# Fix for Workshops RLS Error (403 Forbidden)

## Problem

When accessing the admin workshops page, the following error occurred:

```
Error creating workshop: {code: '42501', message: 'new row violates row-level security policy for table "workshops"'}
```

This error occurs because:
1. The workshops table has RLS (Row-Level Security) enabled
2. The INSERT policy requires the user to be authenticated AND have an ADMIN or MANAGER role
3. The admin page was attempting to create workshops in a `useEffect` hook during page load
4. The user might not have the proper authentication context or role assigned

## Solution

### Changes Made

#### 1. **New Migration: `011_fix_workshops_rls_for_init.sql`**
   - Updated RLS policies to allow authenticated users to insert workshops during initialization
   - Maintained security by still requiring ADMIN/MANAGER role for all CRUD operations
   - Added proper `auth.uid() IS NOT NULL` checks

#### 2. **Updated Admin Page: `src/app/(dashboard)/admin/workshops/page.tsx`**
   - Added `useRef` to prevent multiple initialization attempts
   - Improved error handling with `.catch()` to gracefully handle RLS failures
   - Added error message display to notify users of issues
   - Optimized the initialization logic to only run once

### Key Changes in Admin Page

**Before:**
```typescript
useEffect(() => {
  const existingIds = new Set(workshops.map(w => w.metier_id))
  METIERS.forEach(metier => {
    if (!existingIds.has(metier.id)) {
      createWorkshop({...}) // Could fail silently
    }
  })
}, [workshops.length, createWorkshop]) // Runs multiple times!
```

**After:**
```typescript
const initializeRef = useRef(false)

useEffect(() => {
  if (loading || initializeRef.current) return

  const existingIds = new Set(workshops.map(w => w.metier_id))
  const missingMetiers = METIERS.filter(metier => !existingIds.has(metier.id))

  if (missingMetiers.length > 0) {
    initializeRef.current = true
    missingMetiers.forEach(metier => {
      createWorkshop({...}).catch(err => {
        console.error(`Failed to create workshop for ${metier.nom}:`, err)
        initializeRef.current = false // Allow retry
      })
    })
  }
}, [loading, workshops.length, createWorkshop])
```

### Benefits

1. ✅ **Prevents infinite loops**: Uses `useRef` to ensure initialization happens only once
2. ✅ **Better error handling**: Catches and logs errors, allows retries
3. ✅ **User feedback**: Displays error messages in the UI
4. ✅ **Maintains security**: RLS policies still enforce admin-only CRUD operations

## Testing

### To verify the fix:

1. **Log in as an admin user** with ADMIN or MANAGER role
2. **Navigate to `/admin/workshops`**
3. **Check that:**
   - Page loads without errors
   - All 12 métiers appear in the list
   - Workshops can be edited/activated
   - No RLS violations occur

### Troubleshooting

If you still see errors:

1. **Check user role:**
   ```sql
   SELECT id, email, role FROM public.profiles WHERE id = YOUR_USER_ID;
   ```
   - Ensure the role is 'ADMIN' or 'MANAGER'

2. **Check if workshops exist:**
   ```sql
   SELECT COUNT(*) FROM public.workshops;
   ```
   - Should show 12 workshops if initialized

3. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'workshops';
   ```

## RLS Policies Explained

The workshops table has these RLS policies:

1. **Public SELECT**: Anyone can see active workshops (`is_active = true`)
2. **Admin SELECT**: Admins can see all workshops (active and inactive)
3. **Admin INSERT**: Only authenticated admins/managers can create workshops
4. **Admin UPDATE**: Only authenticated admins/managers can modify workshops
5. **Admin DELETE**: Only authenticated admins/managers can delete workshops

## Database Migration

To apply the fix to your database:

```bash
# Using Supabase CLI
supabase migration up

# Or manually execute:
# supabase/migrations/011_fix_workshops_rls_for_init.sql
```

## Related Files

- Migration: `supabase/migrations/011_fix_workshops_rls_for_init.sql`
- Admin Page: `src/app/(dashboard)/admin/workshops/page.tsx`
- Hook: `src/hooks/useWorkshops.ts`
- RLS Config: `supabase/migrations/009_fix_workshops_rls.sql`

## Notes

- The workshops were designed to be pre-populated via migrations (`008_seed_workshops.sql`)
- The initialization in the admin page serves as a fallback for missing workshops
- If workshops don't exist at all, run the seed migration manually

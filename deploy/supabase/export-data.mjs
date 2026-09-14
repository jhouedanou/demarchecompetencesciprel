#!/usr/bin/env node
/**
 * Exporte les données de référence d'une instance Supabase (cloud ou self-hosted)
 * vers un fichier SQL ré-importable (seed-data.sql).
 *
 * Aucune dépendance : utilise l'API REST (PostgREST) avec la clé service_role.
 *
 * Usage :
 *   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *     node deploy/supabase/export-data.mjs [fichier_sortie.sql]
 *
 *   ou, avec un fichier .env (.env.local / .env.production) à la racine :
 *   node deploy/supabase/export-data.mjs --env .env.local
 *
 * Tables exportées (contenu métier, sans données personnelles) :
 *   questions, workshops, workshops_metiers, workshops_config
 * Ajouter --with-users pour inclure aussi profiles / quiz_results /
 * user_reading_progress (données personnelles : à n'utiliser que pour une
 * migration complète, jamais dans un pack diffusé).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const envIdx = args.indexOf('--env')
if (envIdx >= 0) {
  const envFile = readFileSync(resolve(args[envIdx + 1]), 'utf8')
  for (const line of envFile.split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  args.splice(envIdx, 2)
}
const withUsers = args.includes('--with-users')
const outArg = args.find((a) => !a.startsWith('--'))

const URL_ = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL_ || !KEY) {
  console.error('SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) et SUPABASE_SERVICE_ROLE_KEY requis')
  process.exit(1)
}

const REFERENCE_TABLES = [
  { name: 'questions', pk: 'id', order: 'order_index' },
  { name: 'workshops', pk: 'id', order: 'id', sequence: 'workshops_id_seq' },
  { name: 'workshops_metiers', pk: 'id', order: 'ordre' },
  { name: 'workshops_config', pk: 'id', order: 'id' },
]
const USER_TABLES = [
  { name: 'profiles', pk: 'id', order: 'created_at' },
  { name: 'quiz_results', pk: 'id', order: 'completed_at' },
  { name: 'user_reading_progress', pk: 'id', order: 'created_at' },
]
const tables = withUsers ? [...REFERENCE_TABLES, ...USER_TABLES] : REFERENCE_TABLES

async function fetchAll(table, order) {
  const rows = []
  const page = 500
  for (let from = 0; ; from += page) {
    const res = await fetch(`${URL_}/rest/v1/${table}?select=*&order=${order}.asc`, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Range: `${from}-${from + page - 1}`,
        Prefer: 'count=exact',
      },
    })
    if (!res.ok && res.status !== 416) {
      throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`)
    }
    if (res.status === 416) break
    const chunk = await res.json()
    rows.push(...chunk)
    if (chunk.length < page) break
  }
  return rows
}

const sqlString = (s) => `'${s.replace(/'/g, "''")}'`

const out = []
out.push('-- =============================================================================')
out.push(`-- Données de référence CIPREL Compétences — export du ${new Date().toISOString()}`)
out.push(`-- Source : ${URL_}`)
out.push('-- Import : psql -f seed-data.sql  (ré-exécutable : upsert sur la clé primaire)')
out.push('-- =============================================================================')
out.push('BEGIN;')
out.push("SET session_replication_role = 'replica'; -- désactive triggers/FK pendant l'import")
out.push('')

for (const t of tables) {
  const rows = await fetchAll(t.name, t.order)
  console.error(`  ${t.name}: ${rows.length} lignes`)
  if (rows.length === 0) {
    out.push(`-- ${t.name}: aucune ligne`)
    continue
  }
  const cols = Object.keys(rows[0])
  const setList = cols
    .filter((c) => c !== t.pk)
    .map((c) => `"${c}" = EXCLUDED."${c}"`)
    .join(', ')
  out.push(`-- ---- ${t.name} (${rows.length} lignes) ----`)
  out.push(`INSERT INTO public."${t.name}" (${cols.map((c) => `"${c}"`).join(', ')})`)
  out.push(`SELECT ${cols.map((c) => `"${c}"`).join(', ')} FROM json_populate_recordset(NULL::public."${t.name}", ${sqlString(JSON.stringify(rows))})`)
  out.push(setList ? `ON CONFLICT ("${t.pk}") DO UPDATE SET ${setList};` : `ON CONFLICT ("${t.pk}") DO NOTHING;`)
  if (t.sequence) {
    out.push(`DO $$ BEGIN PERFORM setval('public.${t.sequence}', (SELECT COALESCE(MAX("${t.pk}"), 0) + 1 FROM public."${t.name}"), false); END $$;`)
  }
  out.push('')
}

out.push("SET session_replication_role = 'origin';")
out.push('COMMIT;')

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(outArg || resolve(__dirname, 'seed-data.sql'))
writeFileSync(outPath, out.join('\n') + '\n')
console.error(`Écrit : ${outPath}`)

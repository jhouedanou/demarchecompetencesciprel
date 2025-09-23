import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface UserInfo {
  id: number;
  email: string;
  displayName: string;
  loginName: string;
  title?: string;
  department?: string;
}

export class UserService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  getCurrentUser(): UserInfo {
    const pageContext = this.context.pageContext;
    const user = pageContext.user;

    return {
      id: user.loginName ? this.getUserIdFromLoginName(user.loginName) : 0,
      email: user.email || '',
      displayName: user.displayName || 'Utilisateur inconnu',
      loginName: user.loginName || '',
      title: (user as any).title || undefined,
      department: (user as any).department || undefined
    };
  }

  private getUserIdFromLoginName(loginName: string): number {
    return Math.abs(this.hashCode(loginName));
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  isCurrentUser(userId: number): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser.id === userId;
  }

  getUserDisplayInfo(): {
    displayName: string;
    initials: string;
    email: string;
  } {
    const user = this.getCurrentUser();

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join('');
    };

    return {
      displayName: user.displayName,
      initials: getInitials(user.displayName),
      email: user.email
    };
  }

  hasAdminPermissions(): boolean {
    try {
      return this.context.pageContext.web.permissions?.hasAllPermissions || false;
    } catch {
      return false;
    }
  }

  canViewDashboard(): boolean {
    return this.hasAdminPermissions() || this.isManagerRole();
  }

  private isManagerRole(): boolean {
    const user = this.getCurrentUser();
    const managerKeywords = ['manager', 'directeur', 'chef', 'responsable', 'supervisor'];

    const title = (user.title || '').toLowerCase();
    const department = (user.department || '').toLowerCase();

    return managerKeywords.some(keyword =>
      title.includes(keyword) || department.includes(keyword)
    );
  }

  formatUserName(displayName: string): string {
    if (!displayName || displayName.trim() === '') {
      return 'Utilisateur';
    }

    const parts = displayName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0];
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    return `${firstName} ${lastName}`;
  }

  getUserGreeting(): string {
    const user = this.getCurrentUser();
    const hour = new Date().getHours();

    let greeting: string;
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 17) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }

    const formattedName = this.formatUserName(user.displayName);
    return `${greeting}, ${formattedName}`;
  }

  getStorageKey(key: string): string {
    const user = this.getCurrentUser();
    return `demarcheCompetences_${user.id}_${key}`;
  }

  saveUserPreference(key: string, value: any): void {
    try {
      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.warn('Could not save user preference:', error);
    }
  }

  getUserPreference<T>(key: string, defaultValue: T): T {
    try {
      const storageKey = this.getStorageKey(key);
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not read user preference:', error);
    }

    return defaultValue;
  }

  clearUserPreferences(): void {
    try {
      const user = this.getCurrentUser();
      const keys = Object.keys(localStorage);
      const userKeys = keys.filter(key => key.startsWith(`demarcheCompetences_${user.id}_`));

      userKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Could not clear user preferences:', error);
    }
  }
}
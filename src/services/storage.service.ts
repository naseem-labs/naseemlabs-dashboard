const AUTH_STORAGE_KEY = 'naseemlabs_auth_session';

export const storageService = {
  getKey(): string {
    return AUTH_STORAGE_KEY;
  },

  get<T>(usePersistentStorage: boolean): T | null {
    const storage = usePersistentStorage ? localStorage : sessionStorage;
    const raw = storage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      this.clear(usePersistentStorage);
      return null;
    }
  },

  set<T>(value: T, usePersistentStorage: boolean): void {
    const storage = usePersistentStorage ? localStorage : sessionStorage;
    const serialized = JSON.stringify(value);
    storage.setItem(AUTH_STORAGE_KEY, serialized);

    const alternateStorage = usePersistentStorage ? sessionStorage : localStorage;
    alternateStorage.removeItem(AUTH_STORAGE_KEY);
  },

  clear(usePersistentStorage?: boolean): void {
    if (usePersistentStorage === undefined) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    const storage = usePersistentStorage ? localStorage : sessionStorage;
    storage.removeItem(AUTH_STORAGE_KEY);
  },
};

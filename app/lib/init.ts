import { initializeDatabase, syncMahediStudentProfile } from "./seed";

let initPromise: Promise<void> | null = null;

export function ensureDbInitialized(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!initPromise) {
    initPromise = initializeDatabase().then(() => syncMahediStudentProfile());
  }
  return initPromise;
}

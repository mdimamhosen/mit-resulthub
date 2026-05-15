import type {
  Assignment,
  ClassSchedule,
  Course,
  CourseMaterial,
  Grade,
  Notice,
  Submission,
  User,
} from "./types";

const DB_NAME = "mit_student_portal";
const DB_VERSION = 1;

const STORES = [
  "users",
  "courses",
  "materials",
  "schedules",
  "assignments",
  "submissions",
  "grades",
  "notices",
] as const;

type StoreName = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("users")) {
        const users = db.createObjectStore("users", { keyPath: "id" });
        users.createIndex("username", "username", { unique: true });
      }
      for (const store of [
        "courses",
        "materials",
        "schedules",
        "assignments",
        "submissions",
        "grades",
      ] as const) {
        if (!db.objectStoreNames.contains(store)) {
          const s = db.createObjectStore(store, { keyPath: "id" });
          s.createIndex("userId", "userId", { unique: false });
        }
      }
      if (!db.objectStoreNames.contains("notices")) {
        db.createObjectStore("notices", { keyPath: "id" });
      }
    };
  });
}

export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) dbPromise = openDatabase();
  return dbPromise;
}

function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | void> {
  return getDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const objectStore = transaction.objectStore(store);
        const request = fn(objectStore);
        transaction.oncomplete = () => {
          if (request && "result" in request) resolve((request as IDBRequest<T>).result);
          else resolve();
        };
        transaction.onerror = () => reject(transaction.error);
        if (request) request.onerror = () => reject(request.error);
      }),
  );
}

function getAll<T>(store: StoreName): Promise<T[]> {
  return getDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const req = db.transaction(store, "readonly").objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      }),
  );
}

function getByIndex<T>(store: StoreName, index: string, value: string): Promise<T[]> {
  return getDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const req = db
          .transaction(store, "readonly")
          .objectStore(store)
          .index(index)
          .getAll(value);
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      }),
  );
}

function put<T extends { id: string }>(store: StoreName, item: T): Promise<void> {
  return tx(store, "readwrite", (s) => s.put(item)) as Promise<void>;
}

function remove(store: StoreName, id: string): Promise<void> {
  return tx(store, "readwrite", (s) => s.delete(id)) as Promise<void>;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = await getDb().then(
    (db) =>
      new Promise<User[]>((resolve, reject) => {
        const req = db
          .transaction("users", "readonly")
          .objectStore("users")
          .index("username")
          .getAll(username.toLowerCase());
        req.onsuccess = () => resolve(req.result as User[]);
        req.onerror = () => reject(req.error);
      }),
  );
  return users[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  return getDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const req = db.transaction("users", "readonly").objectStore("users").get(id);
        req.onsuccess = () => resolve(req.result as User | undefined);
        req.onerror = () => reject(req.error);
      }),
  );
}

export async function createUser(user: User): Promise<void> {
  await put("users", user);
}

export async function updateUser(user: User): Promise<void> {
  await put("users", user);
}

export async function replaceGradesForUser(userId: string, grades: Grade[]): Promise<void> {
  const existing = await getGrades(userId);
  const db = await getDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("grades", "readwrite");
    const store = tx.objectStore("grades");
    for (const g of existing) store.delete(g.id);
    for (const g of grades) store.put(g);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCourses(userId: string) {
  return getByIndex<Course>("courses", "userId", userId);
}

export async function getMaterials(userId: string) {
  return getByIndex<CourseMaterial>("materials", "userId", userId);
}

export async function getSchedules(userId: string) {
  return getByIndex<ClassSchedule>("schedules", "userId", userId);
}

export async function getAssignments(userId: string) {
  return getByIndex<Assignment>("assignments", "userId", userId);
}

export async function getSubmissions(userId: string) {
  return getByIndex<Submission>("submissions", "userId", userId);
}

export async function getGrades(userId: string) {
  return getByIndex<Grade>("grades", "userId", userId);
}

export async function getNotices() {
  return getAll<Notice>("notices");
}

export async function addSubmission(submission: Submission): Promise<void> {
  await put("submissions", submission);
}

export async function bulkSeed(items: {
  users?: User[];
  courses?: Course[];
  materials?: CourseMaterial[];
  schedules?: ClassSchedule[];
  assignments?: Assignment[];
  grades?: Grade[];
  notices?: Notice[];
}): Promise<void> {
  const db = await getDb();
  const stores = Object.entries(items).filter(([, v]) => v?.length) as [
    StoreName,
    { id: string }[],
  ][];

  await Promise.all(
    stores.map(
      ([name, rows]) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction(name, "readwrite");
          const store = tx.objectStore(name);
          for (const row of rows) store.put(row);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        }),
    ),
  );
}

export async function seedNewStudentData(userId: string, fullName: string): Promise<void> {
  const { buildStudentSeed } = await import("./seed");
  await bulkSeed(buildStudentSeed(userId, fullName));
}

export async function countUsers(): Promise<number> {
  const users = await getAll<User>("users");
  return users.length;
}

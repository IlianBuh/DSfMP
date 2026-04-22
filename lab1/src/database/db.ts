import * as SQLite from 'expo-sqlite';

export interface Resume {
    id: number;
    fullName: string;
    profession: string;
    email: string;
    phone: string;
    experience: string;
    education: string;
    skills: string;
    createdAt: string;
    photoUrl?: string; // Поле уже есть в интерфейсе
}

export type ResumeInput = Omit<Resume, 'id' | 'createdAt'>;

export interface CachedTip {
    id: number;
    quote: string;
    author: string;
    cachedAt: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    db = await SQLite.openDatabaseAsync('resumes_v2.db');

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      profession TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      experience TEXT DEFAULT '',
      education TEXT DEFAULT '',
      skills TEXT DEFAULT '',
      createdAt TEXT DEFAULT (datetime('now','localtime')),
      photoUrl TEXT DEFAULT '' 
    );
  `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tips_cache (
      id INTEGER PRIMARY KEY,
      quote TEXT NOT NULL,
      author TEXT NOT NULL,
      cachedAt TEXT DEFAULT (datetime('now','localtime'))
    );
  `);

    return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase first.');
    }
    return db;
};

// ── Resume CRUD ──

export const getResumes = async (): Promise<Resume[]> => {
    const database = getDatabase();
    const result = await database.getAllAsync<Resume>(
        'SELECT * FROM resumes ORDER BY createdAt DESC'
    );
    return result;
};

export const getResume = async (id: number): Promise<Resume | null> => {
    const database = getDatabase();
    const result = await database.getFirstAsync<Resume>(
        'SELECT * FROM resumes WHERE id = ?',
        [id]
    );
    return result;
};

export const addResumeInput = async (resume: ResumeInput): Promise<number> => {
    const database = getDatabase();
    const result = await database.runAsync(
        `INSERT OR REPLACE INTO resumes (fullName, profession, email, phone, experience, education, skills, photoUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, // Добавлен 8-й аргумент
        [
            resume.fullName,
            resume.profession,
            resume.email || '',
            resume.phone || '',
            resume.experience || '',
            resume.education || '',
            resume.skills || '',
            resume.photoUrl || '', // Передаем ссылку на фото
        ]
    );
    return result.lastInsertRowId;
};
export const addResume = async (resume: Resume): Promise<number> => {
    const database = getDatabase();
    const result = await database.runAsync(
        `INSERT OR REPLACE INTO resumes (id, createdAt, fullName, profession, email, phone, experience, education, skills, photoUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [
            resume.id,
            resume.createdAt,
            resume.fullName,
            resume.profession,
            resume.email || '',
            resume.phone || '',
            resume.experience || '',
            resume.education || '',
            resume.skills || '',
            resume.photoUrl || '', 
        ]
    );
    return result.lastInsertRowId;
};
export const updateResume = async (id: number, resume: ResumeInput): Promise<void> => {
    const database = getDatabase();
    await database.runAsync(
        `UPDATE resumes SET fullName = ?, profession = ?, email = ?, phone = ?,
     experience = ?, education = ?, skills = ?, photoUrl = ? WHERE id = ?`, // Добавлен photoUrl
        [
            resume.fullName,
            resume.profession,
            resume.email || '',
            resume.phone || '',
            resume.experience || '',
            resume.education || '',
            resume.skills || '',
            resume.photoUrl || '', // Передаем ссылку на фото
            id,
        ]
    );
};

export const deleteResume = async (id: number): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM resumes WHERE id = ?', [id]);
};

// ── Tips Cache ──

export const clearTipsCache = async (): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM tips_cache');
};

export const replaceTipsCache = async (
    tips: { id: number; quote: string; author: string }[]
): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM tips_cache');
    for (const tip of tips) {
        await database.runAsync(
            'INSERT OR REPLACE INTO tips_cache (id, quote, author) VALUES (?, ?, ?)',
            [tip.id, tip.quote, tip.author]
        );
    }
};

export const upsertTipsCache = async (
    tips: { id: number; quote: string; author: string }[]
): Promise<void> => {
    const database = getDatabase();
    for (const tip of tips) {
        await database.runAsync(
            'INSERT OR REPLACE INTO tips_cache (id, quote, author) VALUES (?, ?, ?)',
            [tip.id, tip.quote, tip.author]
        );
    }
};

export const getCachedTips = async (): Promise<CachedTip[]> => {
    const database = getDatabase();
    const result = await database.getAllAsync<CachedTip>(
        'SELECT * FROM tips_cache ORDER BY id ASC'
    );
    return result;
};

export const clearAllResumes = async (): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM resumes');
    await database.runAsync('DELETE FROM sqlite_sequence WHERE name="resumes"');
};
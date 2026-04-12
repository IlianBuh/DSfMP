const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── PostgreSQL Connection ──

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'resume',
    password: process.env.DB_PASSWORD || 'resume123',
    database: process.env.DB_NAME || 'resumes_db',
});

// ── Auto-create table on startup ──

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS resumes (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                profession TEXT NOT NULL,
                email TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                experience TEXT DEFAULT '',
                education TEXT DEFAULT '',
                skills TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✓ Database table "resumes" ready');
    } finally {
        client.release();
    }
}

// ── REST API Routes ──

// Получить все резюме
app.get('/api/resumes', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM resumes ORDER BY created_at DESC'
        );
        const resumes = rows.map(row => ({
            id: row.id,
            fullName: row.full_name,
            profession: row.profession,
            email: row.email,
            phone: row.phone,
            experience: row.experience,
            education: row.education,
            skills: row.skills,
            createdAt: row.created_at,
        }));
        res.json(resumes);
    } catch (err) {
        console.error('GET /api/resumes error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Создать одно резюме
app.post('/api/resumes', async (req, res) => {
    try {
        const { fullName, profession, email, phone, experience, education, skills } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO resumes (full_name, profession, email, phone, experience, education, skills)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [fullName, profession, email || '', phone || '', experience || '', education || '', skills || '']
        );
        const row = rows[0];
        res.status(201).json({
            id: row.id,
            fullName: row.full_name,
            profession: row.profession,
            email: row.email,
            phone: row.phone,
            experience: row.experience,
            education: row.education,
            skills: row.skills,
            createdAt: row.created_at,
        });
    } catch (err) {
        console.error('POST /api/resumes error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Пакетная загрузка резюме
app.post('/api/resumes/batch', async (req, res) => {
    const client = await pool.connect();
    try {
        const { resumes } = req.body;
        if (!Array.isArray(resumes)) {
            return res.status(400).json({ error: 'resumes must be an array' });
        }

        await client.query('BEGIN');
        let count = 0;
        for (const r of resumes) {
            await client.query(
                `INSERT INTO resumes (full_name, profession, email, phone, experience, education, skills)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [r.fullName, r.profession, r.email || '', r.phone || '', r.experience || '', r.education || '', r.skills || '']
            );
            count++;
        }
        await client.query('COMMIT');

        res.status(201).json({ ok: true, count });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('POST /api/resumes/batch error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Удалить резюме
app.delete('/api/resumes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM resumes WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        res.json({ ok: true });
    } catch (err) {
        console.error('DELETE /api/resumes/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Start Server ──

const PORT = process.env.PORT || 3000;

initDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
            console.log(`  API: http://localhost:${PORT}/api/resumes`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

import { Resume, ResumeInput } from '../database/db';

// 10.0.2.2 — Android emulator alias for host machine localhost
// Для физического устройства замени на IP компьютера в Wi-Fi сети
const REMOTE_API_URL = 'http://10.0.2.2:3000/api';

export interface RemoteResume extends ResumeInput {
    id?: number;
    remoteId?: string;
    createdAt?: string;
}

/** Fetch all resumes from the remote PostgreSQL backend */
export const fetchRemoteResumes = async (): Promise<RemoteResume[]> => {
    const response = await fetch(`${REMOTE_API_URL}/resumes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`);
    }

    return response.json();
};

/** Upload a single resume to the remote backend */
export const uploadResume = async (resume: ResumeInput): Promise<RemoteResume> => {
    const response = await fetch(`${REMOTE_API_URL}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
    });

    if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`);
    }

    return response.json();
};

/** Upload multiple resumes to the remote backend */
export const uploadResumes = async (resumes: Resume[]): Promise<void> => {
    const response = await fetch(`${REMOTE_API_URL}/resumes/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            resumes: resumes.map(({ id, createdAt, ...rest }) => rest),
        }),
    });

    if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`);
    }
};

/** Delete a resume from the remote backend */
export const deleteRemoteResume = async (remoteId: string): Promise<void> => {
    const response = await fetch(`${REMOTE_API_URL}/resumes/${remoteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`);
    }
};

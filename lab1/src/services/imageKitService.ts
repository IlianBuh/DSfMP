// Configure your ImageKit credentials here
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';
const IMAGEKIT_PUBLIC_KEY = 'your_public_key';
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/your_imagekit_id';

// Server-side auth endpoint for getting upload signature
const AUTH_ENDPOINT = 'https://your-backend.example.com/api/imagekit/auth';

export interface ImageKitUploadResult {
    url: string;
    fileId: string;
    name: string;
    thumbnailUrl: string;
}

/** Get authentication parameters from backend for signed uploads */
async function getAuthParams(): Promise<{
    token: string;
    expire: number;
    signature: string;
}> {
    const response = await fetch(AUTH_ENDPOINT);
    if (!response.ok) {
        throw new Error(`Auth endpoint error: ${response.status}`);
    }
    return response.json();
}

/** Upload an image to ImageKit */
export const uploadImage = async (
    imageUri: string,
    fileName?: string,
): Promise<ImageKitUploadResult> => {
    const auth = await getAuthParams();

    const formData = new FormData();
    const name = fileName || `resume_${Date.now()}.jpg`;

    formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name,
    } as any);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', auth.signature);
    formData.append('expire', String(auth.expire));
    formData.append('token', auth.token);
    formData.append('fileName', name);
    formData.append('folder', '/resumes');

    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`ImageKit upload error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return {
        url: data.url,
        fileId: data.fileId,
        name: data.name,
        thumbnailUrl: data.thumbnailUrl || data.url,
    };
};

/** Get the full URL for an ImageKit image */
export const getImageUrl = (
    path: string,
    transformations?: string,
): string => {
    const base = `${IMAGEKIT_URL_ENDPOINT}${path}`;
    return transformations ? `${base}?${transformations}` : base;
};

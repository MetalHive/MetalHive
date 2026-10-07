// Listing image upload service.
//
// Default: POST multipart `images` to the backend (/seller/listings/images),
// which returns { urls: [...] }. ImgBB is kept only as an optional fallback,
// used when NEXT_PUBLIC_IMGBB_API_KEY is set AND the backend upload fails.

import apiClient, { getErrorMessage } from '../client';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';
const MAX_FILES_PER_REQUEST = 10;

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

export interface MultiUploadResult {
    urls: string[];
    /** Non-empty when one or more files could not be uploaded. */
    error?: string;
}

export class ImageUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageUploadError';
    }
}

/** Upload a batch of files to the backend; returns absolute URLs. */
const uploadToBackend = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await apiClient.post<{ urls: string[] }>('/seller/listings/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    const urls = response.data?.urls;
    if (!Array.isArray(urls)) {
        throw new ImageUploadError('Upload succeeded but the server returned no image URLs.');
    }
    return urls;
};

/** Convert a File to a base64 string (ImgBB fallback only). */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/** Upload a single image to ImgBB (fallback). */
const uploadToImgBB = async (file: File): Promise<UploadResult> => {
    if (!IMGBB_API_KEY) {
        return { success: false, error: 'ImgBB fallback is not configured.' };
    }
    try {
        const base64Image = await fileToBase64(file);
        const formData = new FormData();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', base64Image);
        formData.append('name', file.name.split('.')[0]);

        const response = await fetch(IMGBB_UPLOAD_URL, { method: 'POST', body: formData });
        const data = await response.json();

        if (data?.success && data?.data?.url) {
            return { success: true, url: data.data.url as string };
        }
        return { success: false, error: data?.error?.message || 'ImgBB upload failed' };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Upload a single image. Backend first; ImgBB only if configured.
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
    try {
        const [url] = await uploadToBackend([file]);
        if (url) return { success: true, url };
        return { success: false, error: 'The server did not return an image URL.' };
    } catch (error: unknown) {
        const backendMessage = getErrorMessage(error, 'Image upload failed.');
        if (IMGBB_API_KEY) {
            const fallback = await uploadToImgBB(file);
            if (fallback.success) return fallback;
            return { success: false, error: `${backendMessage} (fallback: ${fallback.error})` };
        }
        return { success: false, error: backendMessage };
    }
};

/**
 * Upload multiple images. Files are sent to the backend in batches of up to
 * 10. Returns the uploaded URLs plus an error message if anything failed.
 */
export const uploadMultipleImages = async (
    files: File[],
    onProgress?: (uploaded: number, total: number) => void
): Promise<MultiUploadResult> => {
    const urls: string[] = [];
    const errors: string[] = [];
    const total = files.length;
    let uploaded = 0;

    for (let i = 0; i < files.length; i += MAX_FILES_PER_REQUEST) {
        const batch = files.slice(i, i + MAX_FILES_PER_REQUEST);
        try {
            const batchUrls = await uploadToBackend(batch);
            urls.push(...batchUrls);
            uploaded += batch.length;
            onProgress?.(uploaded, total);
        } catch (error: unknown) {
            const backendMessage = getErrorMessage(error, 'Image upload failed.');
            if (IMGBB_API_KEY) {
                // Fall back file-by-file so one bad file does not sink the batch.
                for (const file of batch) {
                    const result = await uploadToImgBB(file);
                    if (result.success && result.url) {
                        urls.push(result.url);
                    } else if (result.error) {
                        errors.push(`${file.name}: ${result.error}`);
                    }
                    uploaded += 1;
                    onProgress?.(uploaded, total);
                }
            } else {
                errors.push(backendMessage);
                uploaded += batch.length;
                onProgress?.(uploaded, total);
            }
        }
    }

    return {
        urls,
        error: errors.length ? Array.from(new Set(errors)).join(' ') : undefined,
    };
};

const imageUploadService = {
    uploadImage,
    uploadMultipleImages,
};

export default imageUploadService;

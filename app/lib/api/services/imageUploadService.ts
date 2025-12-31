// ImgBB Image Upload Service

const IMGBB_API_KEY = 'cfc0e69aa147d4cd1e5a627d818b8488';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: string;
        height: string;
        size: string;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    success: boolean;
    status: number;
}

export interface UploadResult {
    success: boolean;
    url?: string;
    displayUrl?: string;
    thumbUrl?: string;
    error?: string;
}

/**
 * Convert a File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data:image/xxx;base64, prefix
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Upload a single image to ImgBB
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
    try {
        const base64Image = await fileToBase64(file);

        const formData = new FormData();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', base64Image);
        formData.append('name', file.name.split('.')[0]);

        const response = await fetch(IMGBB_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        const data: ImgBBResponse = await response.json();

        if (data.success) {
            return {
                success: true,
                url: data.data.url,
                displayUrl: data.data.display_url,
                thumbUrl: data.data.thumb?.url,
            };
        } else {
            return {
                success: false,
                error: 'Upload failed',
            };
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

/**
 * Upload multiple images to ImgBB
 * Returns array of URLs for successfully uploaded images
 */
export const uploadMultipleImages = async (
    files: File[],
    onProgress?: (uploaded: number, total: number) => void
): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadImage(file);

        if (result.success && result.url) {
            uploadedUrls.push(result.url);
        }

        if (onProgress) {
            onProgress(i + 1, total);
        }
    }

    return uploadedUrls;
};

const imageUploadService = {
    uploadImage,
    uploadMultipleImages,
};

export default imageUploadService;

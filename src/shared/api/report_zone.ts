import { apiFetch } from './client';

// Client-side Zone Report API

interface ZoneInput {
    name: string;
    lat: number;
    lng: number;
    kind: 'SMOKING' | 'NONSMOKING';
    address?: string;
    description?: string;
    category?: string;
    features?: string[];
    userId?: string;
}

interface ImageFile {
    uri: string;
    type: string; // mime
    name: string; // filename
}

/**
 * 흡연구역 제보 (다중 이미지 지원)
 */
export const reportZone = async (
    zoneData: ZoneInput,
    imageFiles: ImageFile[]
): Promise<{ success: boolean; zoneId?: string; error?: string }> => {
    let zoneId: string | undefined;

    if (imageFiles.length === 0) {
        return { success: false, error: '최소 1장의 사진이 필요합니다.' };
    }

    try {
        // --- 1st Image (Zone Creation) ---
        const firstImage = imageFiles[0]!;
        console.log('[ZoneReport] Initializing report with first image...');
        const firstExt = firstImage.name.split('.').pop() || 'jpg';

        // Step 1: Init - Create Zone & Get URL for 1st image
        const initData = await apiFetch<any>('/api/zone/report/init', {
            method: 'POST',
            body: JSON.stringify({
                zoneData,
                fileExt: firstExt,
            }),
        });

        if (!initData.success) throw new Error(initData.error);

        zoneId = initData.data.zoneId;
        const firstUploadInfo = initData.data; // { signedUrl, path, fileName }

        console.log(`[ZoneReport] Zone Created: ${zoneId}. Uploading 1/ ${imageFiles.length} image...`);

        // Upload & Register First Image
        await uploadAndRegisterImage(zoneId!, firstImage, firstUploadInfo);


        // --- Remaining Images ---
        if (imageFiles.length > 1) {
            const remainingImages = imageFiles.slice(1);
            let counter = 2; // Start from 2nd image for logging

            // Process sequentially
            for (const img of remainingImages) {
                console.log(`[ZoneReport] Processing image ${counter}/${imageFiles.length}...`);
                const ext = img.name.split('.').pop() || 'jpg';

                // 1. Get Upload URL
                const urlData = await apiFetch<any>('/api/zone/report/image', {
                    method: 'POST',
                    body: JSON.stringify({
                        zoneId,
                        fileExt: ext
                    }),
                });

                if (!urlData.success) throw new Error(urlData.error);

                // 2. Upload & Register
                await uploadAndRegisterImage(zoneId!, img, urlData.data);
                counter++;
            }
        }

        console.log('[ZoneReport] All images processed. Success!');
        return { success: true, zoneId };

    } catch (error: any) {
        console.error('[ZoneReport] Error:', error);
        if (zoneId) {
            console.warn(`[ZoneReport] Clean up recommended for zone ${zoneId}`);
        }
        return { success: false, error: error.message };
    }
};

async function uploadAndRegisterImage(
    zoneId: string,
    imageFile: ImageFile,
    uploadInfo: { signedUrl: string, path: string, fileName: string }
) {
    // 1. Upload PUT (Direct S3 upload - do not use apiFetch)
    const imageRes = await fetch(imageFile.uri);
    const blob = await imageRes.blob();

    const uploadRes = await fetch(uploadInfo.signedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': imageFile.type,
        },
        body: blob,
    });

    if (!uploadRes.ok) {
        throw new Error(`Image upload failed: ${uploadRes.status}`);
    }

    // 2. Register Meta (Server call - use apiFetch)
    const completeData = await apiFetch<any>('/api/zone/report/complete', {
        method: 'POST',
        body: JSON.stringify({
            zoneId,
            path: uploadInfo.path,
            fileName: uploadInfo.fileName,
            fileType: imageFile.type,
            userId: undefined
        }),
    });

    if (!completeData.success) throw new Error(completeData.error);
}

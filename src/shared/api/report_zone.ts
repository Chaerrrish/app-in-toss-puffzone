
// Client-side Zone Report API

const BASE_URL = 'https://www.puffzone.co.kr';

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
 * 흡연구역 제보 (이미지 필수)
 * Flow:
 * 1. [Server] Zone Init (Insert Zone + Get Signed URL)
 * 2. [Client] Upload Image (PUT to Signed URL)
 * 3. [Server] Zone Complete (Insert Image Meta)
 */
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

    if (imageFiles.length === 0) {
        return { success: false, error: '최소 1장의 사진이 필요합니다.' };
    }

    try {
        // --- 1st Image (Zone Creation) ---
        const firstImage = imageFiles[0]!;
        console.log('[ZoneReport] Initializing report with first image...');
        const firstExt = firstImage.name.split('.').pop() || 'jpg';

        // Step 1: Init - Create Zone & Get URL for 1st image
        const initRes = await fetch(`${BASE_URL}/api/zone/report/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                zoneData,
                fileExt: firstExt,
            }),
        });

        if (!initRes.ok) {
            const err = await initRes.text();
            throw new Error(`Init failed: ${initRes.status} ${err}`);
        }

        const initData = await initRes.json();
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
                const urlRes = await fetch(`${BASE_URL}/api/zone/report/image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        zoneId,
                        fileExt: ext
                    }),
                });

                if (!urlRes.ok) throw new Error(`Failed to get upload url for image ${counter}`);
                const urlData = await urlRes.json();
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
    // 1. Upload PUT
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

    // 2. Register Meta
    const completeRes = await fetch(`${BASE_URL}/api/zone/report/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            zoneId,
            path: uploadInfo.path,
            fileName: uploadInfo.fileName,
            fileType: imageFile.type,
            userId: undefined // Optional, handled by zoneData usually or redundant here
        }),
    });

    if (!completeRes.ok) {
        throw new Error(`Image registration failed`);
    }

    const completeData = await completeRes.json();
    if (!completeData.success) throw new Error(completeData.error);
}

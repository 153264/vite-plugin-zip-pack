import crypto from 'node:crypto';
import fs from 'node:fs/promises';

// export const timeZoneOffset = (date: Date): Date => {
//     return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
// };

export async function fileExists(
    filePath: string,
    mode: number = fs.constants.R_OK | fs.constants.W_OK
): Promise<boolean> {
    try {
        await fs.access(filePath, mode);
        return true;
    } catch {
        return false;
    }
}

export function formatFileBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

export function calculateFileHash(filePath: string, algorithm: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        fs.open(filePath)
            .then((fd) => {
                const stream = fd.createReadStream();

                stream.on('data', (data) => hash.update(data));
                stream.on('end', () => resolve(hash.digest('hex')));
                stream.on('error', reject);
            })
            .catch(reject);
    });
}

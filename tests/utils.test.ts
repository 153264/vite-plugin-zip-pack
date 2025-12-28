import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { calculateFileHash, fileExists, formatFileBytes } from '../src/utils';

describe('fileExists', () => {
    it('exist', async () => {
        expect(await fileExists(path.resolve('./tests/inDir/lv1/lv2/lv3/lv3.js'))).toBe(true);
    });

    it('not exist', async () => {
        expect(await fileExists(path.resolve('./tests/inDir/lv1/lv2/lv3/lv4/lv4.js'))).toBe(false);
    });
});

describe('formatFileBytes', () => {
    it.each([
        { size: 0, result: '0 Bytes' },
        { size: 1024, result: '1 KB' },
        { size: 1024 * 1024, result: '1 MB' },
        { size: 1024 * 1024 * 1024, result: '1 GB' },
        { size: 1024 * 1024 * 1024 * 1024, result: '1 TB' }
    ])('size: $size($result)', ({ size, result }) => {
        expect(formatFileBytes(size)).toBe(result);
    });
});

describe('calculateFileHash', () => {
    it.each([
        {
            file: 'tests/inDir/index.html'
        },
        {
            file: 'tests/inDir/assets/a.js'
        }
    ])('$file', async ({ file }) => {
        expect(await calculateFileHash(file, 'md5')).toBeTruthy();
        expect(await calculateFileHash(file, 'sha256')).toBeTruthy();
    });
});

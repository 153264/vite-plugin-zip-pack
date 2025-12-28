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
            file: 'tests/inDir/index.html',
            md5: 'ea6324a3db603b7266b7ed9e80feae7c',
            sha256: '278cc0f89fa25d8b2125f73615690d57b052ed2c65767939470ce0b2e51a85e6'
        },
        {
            file: 'tests/inDir/assets/a.js',
            md5: 'dddd6ea6336914bc89826a46357c9809',
            sha256: '43ccff088c29a981b65a1d2a3ad716c419b688ab06a095752ea8f23cee36da41'
        }
    ])('$file', async ({ file, md5, sha256 }) => {
        expect(await calculateFileHash(file, 'md5')).toBe(md5);
        expect(await calculateFileHash(file, 'sha256')).toBe(sha256);
    });
});

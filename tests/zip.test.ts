import type { ZipOptions } from '../src/zip';
import fs from 'node:fs/promises';
import { afterEach, expect, it, vi } from 'vitest';
import { fileExists } from '../src/utils';
import Zip from '../src/zip';

function createOptions(): ZipOptions {
    return {
        filter: vi.fn(() => true),
        pathPrefix: ''
    };
}

afterEach(async () => {
    if (await fileExists('tests/outDir')) {
        await fs.rm('tests/outDir', {
            force: true,
            recursive: true
        });
    }
});

it('remove exist save file', async () => {
    const zip = new Zip(createOptions());
    await zip.addDir('tests/inDir');
    expect(await zip.save('tests/outDir', 'out.zip')).not.toBeNull();

    expect(await zip.save('tests/outDir', 'out.zip')).not.toBeNull();
});

it('addDir not exist', () => {
    const zip = new Zip(createOptions());
    expect(() => zip.addDir('tests/a')).rejects.toThrowError(new Error(' - "tests/a" folder does not exist!'));
});

it('build zip', async () => {
    const zip = new Zip(createOptions());
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/outDir', 'out.zip');
    expect(filePath).not.toBeNull();
    const { size } = await fs.stat(filePath);
    expect(size).toBe(13635);
});

it('filter files', async () => {
    const options = createOptions();
    options.filter = vi.fn((fileName: string, filePath: string, _: boolean): boolean => {
        return !/img/.test(filePath);
    });
    const zip = new Zip(options);
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/outDir', 'out.zip');
    expect(filePath).not.toBeNull();

    expect(options.filter).toHaveBeenCalled();
    const { size } = await fs.stat(filePath);
    expect(size).toBe(1258);
});

it('pathPrefix not absolute', () => {
    const options = createOptions();
    options.pathPrefix = '/a/';
    expect(() => new Zip(options)).toThrowError(new Error('"/a/" pathPrefix must be a relative path'));
});

it.each([
    { pathPrefix: 'app', size: 13823 },
    { pathPrefix: 'app/bpp/cpp', size: 14223 }
])('pathPrefix: $pathPrefix', async ({ pathPrefix, size }) => {
    const options = createOptions();
    options.pathPrefix = pathPrefix;
    const zip = new Zip(options);
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/outDir', 'out.zip');
    expect(filePath).not.toBeNull();

    const { size: fileSize } = await fs.stat(filePath);
    expect(fileSize).toBe(size);
});

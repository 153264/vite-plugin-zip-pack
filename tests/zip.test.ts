import type { ZipOptions } from '../src/zip';
import fs from 'node:fs/promises';
import JSZip from 'jszip';
import { afterAll, expect, it, vi } from 'vitest';
import { fileExists } from '../src/utils';
import Zip from '../src/zip';

function createOptions(): ZipOptions {
    return {
        filter: vi.fn(() => true),
        pathPrefix: ''
    };
}

async function checkZip(filePath: string): Promise<string[]> {
    const zip = await JSZip().loadAsync(await fs.readFile(filePath));
    return Object.keys(zip.files).map((v) => v.replaceAll('\\', '/'));
}

afterAll(async () => {
    if (await fileExists('tests/zipOutDir')) {
        await fs.rm('tests/zipOutDir', {
            force: true,
            recursive: true
        });
    }
});

it('remove exist save file', async () => {
    const zip = new Zip(createOptions());
    await zip.addDir('tests/inDir');
    expect(await zip.save('tests/zipOutDir', '1.zip')).not.toBeNull();

    expect(await zip.save('tests/zipOutDir', '1.zip')).not.toBeNull();
});

it('addDir not exist', async () => {
    const zip = new Zip(createOptions());
    await expect(() => zip.addDir('tests/a')).rejects.toThrowError(new Error('"tests/a" folder does not exist!'));
});

it('build zip', async () => {
    const zip = new Zip(createOptions());
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/zipOutDir', '2.zip');
    expect(filePath).not.toBeNull();

    expect(await checkZip(filePath)).toStrictEqual([
        'assets/',
        'assets/a.css',
        'assets/a.js',
        'img/',
        'img/people.png',
        'img/peoples.png',
        'index.html',
        'lv1/',
        'lv1/lv1.js',
        'lv1/lv2/',
        'lv1/lv2/lv2.js',
        'lv1/lv2/lv3/',
        'lv1/lv2/lv3/lv3.js'
    ]);
});

it('filter files', async () => {
    const options = createOptions();
    options.filter = vi.fn((fileName: string, filePath: string, _: boolean): boolean => {
        return !/img/.test(filePath);
    });
    const zip = new Zip(options);
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/zipOutDir', '3.zip');
    expect(filePath).not.toBeNull();

    expect(options.filter).toHaveBeenCalled();

    expect(await checkZip(filePath)).toStrictEqual([
        'assets/',
        'assets/a.css',
        'assets/a.js',
        'index.html',
        'lv1/',
        'lv1/lv1.js',
        'lv1/lv2/',
        'lv1/lv2/lv2.js',
        'lv1/lv2/lv3/',
        'lv1/lv2/lv3/lv3.js'
    ]);
});

it('pathPrefix not absolute', () => {
    const options = createOptions();
    options.pathPrefix = '/a/';
    expect(() => new Zip(options)).toThrowError(new Error('"/a/" pathPrefix must be a relative path'));
});

it.each([
    {
        pathPrefix: 'app',
        files: [
            'app/',
            'app/assets/',
            'app/assets/a.css',
            'app/assets/a.js',
            'app/img/',
            'app/img/people.png',
            'app/img/peoples.png',
            'app/index.html',
            'app/lv1/',
            'app/lv1/lv1.js',
            'app/lv1/lv2/',
            'app/lv1/lv2/lv2.js',
            'app/lv1/lv2/lv3/',
            'app/lv1/lv2/lv3/lv3.js'
        ]
    },
    {
        pathPrefix: 'app/bpp/cpp',
        files: [
            'app/',
            'app/bpp/',
            'app/bpp/cpp/',
            'app/bpp/cpp/assets/',
            'app/bpp/cpp/assets/a.css',
            'app/bpp/cpp/assets/a.js',
            'app/bpp/cpp/img/',
            'app/bpp/cpp/img/people.png',
            'app/bpp/cpp/img/peoples.png',
            'app/bpp/cpp/index.html',
            'app/bpp/cpp/lv1/',
            'app/bpp/cpp/lv1/lv1.js',
            'app/bpp/cpp/lv1/lv2/',
            'app/bpp/cpp/lv1/lv2/lv2.js',
            'app/bpp/cpp/lv1/lv2/lv3/',
            'app/bpp/cpp/lv1/lv2/lv3/lv3.js'
        ]
    }
])('pathPrefix: $pathPrefix', async ({ pathPrefix, files }) => {
    const options = createOptions();
    options.pathPrefix = pathPrefix;
    const zip = new Zip(options);
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/zipOutDir', '4.zip');
    expect(filePath).not.toBeNull();

    expect(await checkZip(filePath)).toStrictEqual(files);
});

it('filter not exist', async () => {
    const options = createOptions();
    options.filter = undefined;
    const zip = new Zip(options);
    await zip.addDir('tests/inDir');
    const filePath = await zip.save('tests/zipOutDir', '5.zip');
    expect(filePath).not.toBeNull();
    expect(await checkZip(filePath)).toStrictEqual([
        'assets/',
        'assets/a.css',
        'assets/a.js',
        'img/',
        'img/people.png',
        'img/peoples.png',
        'index.html',
        'lv1/',
        'lv1/lv1.js',
        'lv1/lv2/',
        'lv1/lv2/lv2.js',
        'lv1/lv2/lv3/',
        'lv1/lv2/lv3/lv3.js'
    ]);
});

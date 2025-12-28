import type { PackOptions } from '../src/pack';
import fs from 'node:fs/promises';
import { afterAll, expect, it, vi } from 'vitest';
import Pack from '../src/pack';
import { fileExists } from '../src/utils';

function createOptions(): PackOptions {
    return {
        pathPrefix: '',
        filter: vi.fn(() => true),
        inDir: 'tests/inDir',
        outDir: 'tests/packOutDir',
        outFileName: 'pack.zip',
        done: vi.fn(() => {}),
        error: vi.fn(() => {}),
        enableLogging: true,
        enableFileHash: true
    };
}

afterAll(async () => {
    if (await fileExists('tests/packOutDir')) {
        await fs.rm('tests/packOutDir', {
            force: true,
            recursive: true
        });
    }
});

it('build pack', async () => {
    const options = createOptions();
    options.outFileName = '1.zip';
    const pack = new Pack(options);
    await pack.pack();
    expect(options.done).toBeCalled();
});

it('error', async () => {
    const options = createOptions();
    options.outFileName = '2.zip';
    options.pathPrefix = '/a/';
    const pack = new Pack(options);
    await pack.pack();
    expect(options.error).toBeCalled();
});

it('disable enableFileHash', async () => {
    const options = createOptions();
    options.outFileName = '3.zip';
    options.enableFileHash = false;
    const pack = new Pack(options);
    await pack.pack();
});

it('disable enableLogging', async () => {
    const options = createOptions();
    options.outFileName = '4.zip';
    options.enableLogging = false;
    const pack = new Pack(options);
    await pack.pack();
});

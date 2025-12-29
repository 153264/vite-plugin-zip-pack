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
        logLevel: false
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

it('enable logging', async () => {
    const options = createOptions();
    options.outFileName = '3.zip';
    options.logLevel = ['info'];
    const pack = new Pack(options);
    await pack.pack();
    expect(options.done).toBeCalled();
});

it('enable all logging', async () => {
    const options = createOptions();
    options.outFileName = '4.zip';
    options.logLevel = true;
    const pack = new Pack(options);
    await pack.pack();
    expect(options.done).toBeCalled();
});

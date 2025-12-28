import type { PackOptions } from '../src/pack';
import fs from 'node:fs/promises';
import { afterAll, expect, it, vi } from 'vitest';
import zipPackPlugin from '../src';
import { fileExists } from '../src/utils';

function createOptions(): PackOptions {
    return {
        pathPrefix: '',
        filter: vi.fn(() => true),
        inDir: 'tests/inDir',
        outDir: 'tests/indexOutDir',
        outFileName: 'pack.zip',
        done: vi.fn(() => {}),
        error: vi.fn(() => {}),
        enableLogging: true,
        enableFileHash: true
    };
}

afterAll(async () => {
    if (await fileExists('tests/indexOutDir')) {
        await fs.rm('tests/indexOutDir', {
            force: true,
            recursive: true
        });
    }
});

it('check vite plugin info', async () => {
    const plugin = zipPackPlugin();

    expect(plugin).not.toBeNull();
    expect(plugin.name).toBe('vite-plugin-zip-pack');
    expect(plugin.apply).toBe('build');
    expect(plugin.enforce).toBe('post');
    expect(plugin.closeBundle).instanceOf(Function);
});

it('build', async () => {
    const options = createOptions();
    const zip = zipPackPlugin(options);
    // @ts-ignore
    await zip.closeBundle();
});

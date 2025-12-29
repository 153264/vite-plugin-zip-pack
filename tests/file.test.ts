import { expect, it } from 'vitest';
import File from '../src/file';

it('file', async () => {
    const file = new File('tests/inDir/lv1/lv2/lv3/lv3.js');
    expect(file.toString()).toBe('tests/inDir/lv1/lv2/lv3/lv3.js');
    expect(await file.stat()).toBeDefined();
    expect(await file.formatSize()).toBeDefined();
    const md5 = await file.md5();
    expect(md5).toBeTruthy();
    expect(await file.md5()).toBe(md5);
    const sha256 = await file.sha256();
    expect(sha256).toBeTruthy();
    expect(await file.sha256()).toBe(sha256);
});

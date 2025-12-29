import type { Stats } from 'node:fs';
import fs from 'node:fs/promises';

import { calculateFileHash, formatFileBytes } from './utils';

export default class File {
    private _md5: string | null = null;

    private _sha256: string | null = null;

    private _stat: Stats | null = null;

    constructor(private _filePath: string) {}

    async stat(): Promise<Stats> {
        if (!this._stat) {
            this._stat = await fs.stat(this._filePath);
        }
        return this._stat;
    }

    async formatSize(): Promise<string> {
        const { size } = await this.stat();
        return formatFileBytes(size);
    }

    async fileHash(algorithm: string): Promise<string> {
        return await calculateFileHash(this._filePath, algorithm);
    }

    async md5(): Promise<string> {
        if (!this._md5) {
            this._md5 = await this.fileHash('md5');
        }
        return this._md5;
    }

    async sha256(): Promise<string> {
        if (!this._sha256) {
            this._sha256 = await this.fileHash('sha256');
        }
        return this._sha256;
    }

    toString(): string {
        return this._filePath;
    }
}

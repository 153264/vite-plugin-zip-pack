import type { ZipOptions } from './zip';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { calculateFileHash, formatFileBytes } from './utils';
import Zip from './zip';

export interface PackOptions extends ZipOptions {
    /**
     * 需要打包的目录
     * @default `./dist`
     */
    inDir: string;
    /**
     * 输出压缩包的目录
     * @default `./`
     */
    outDir: string;
    /**
     * 输出压缩包的名字
     * @default `dist.zip`
     */
    outFileName: string;
    /**
     * 压缩完成
     */
    done?: (filePath: string) => void;
    /**
     * 压缩异常
     */
    error?: (error: Error) => void;
    /**
     * 是否输出日志
     * @default true
     */
    enableLogging: boolean;
    /**
     * 是否输出文件Hash
     * @default true
     */
    enableFileHash: boolean;
}

export default class Pack {
    constructor(private options: PackOptions) {}

    async pack(): Promise<void> {
        const { inDir, outDir, outFileName, done, error } = this.options;
        try {
            const zip = new Zip(this.options);

            console.log(chalk.green(`Zip packing - "${path.resolve(inDir)}" folder :`));

            this.logger(chalk.green('  - Preparing files.'));

            await zip.addDir(inDir);

            this.logger(chalk.green('  - Creating zip archive.'));

            const filePath = await zip.save(outDir, outFileName);

            this.logger(chalk.green('  - Done.'));

            console.log(chalk.green('  - Created zip archive.'));

            await this.loggerZipInfo(filePath);

            done?.(filePath);
        } catch (err: unknown) {
            console.log(chalk.red(`  - ${err}`));
            console.log(chalk.bgRed('Something went wrong while building zip file!'));
            error?.(err as Error);
        }
    }

    private async loggerZipInfo(filePath: string): Promise<void> {
        const { enableFileHash } = this.options;
        console.log(chalk.bgGreen(` Zip info `));

        console.log(chalk.green(`  - Path: ${filePath}`));
        const { size } = await fs.stat(filePath);
        const sizeFormat = formatFileBytes(size);
        console.log(chalk.green(`  - Size: ${sizeFormat}`));
        if (enableFileHash) {
            const md5 = await calculateFileHash(filePath, 'md5');
            const sha256 = await calculateFileHash(filePath, 'sha256');
            console.log(chalk.green(`  - Md5: ${md5}`));
            console.log(chalk.green(`  - Sha256: ${sha256}`));
        }
    }

    private logger(...msg: any): void {
        const { enableLogging } = this.options;
        if (enableLogging) {
            console.log(...msg);
        }
    }
}

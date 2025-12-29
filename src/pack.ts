import type { ZipOptions } from './zip';
import path from 'node:path';
import chalk from 'chalk';
import File from './file';
import Zip from './zip';

type LogLevel = 'info' | 'fileHash' | 'error';
type LogLevelOption = LogLevel[] | boolean;

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
    done?: (file: File) => void;
    /**
     * 压缩异常
     */
    error?: (error: Error) => void;
    /**
     * 日志级别
     * @default true
     */
    logLevel: LogLevelOption;
}

export default class Pack {
    constructor(private options: PackOptions) {}

    async pack(): Promise<void> {
        const { inDir, outDir, outFileName, done, error } = this.options;
        try {
            const zip = new Zip(this.options);

            this.logger('info', chalk.green(`Zip packing - "${path.resolve(inDir)}" folder :`));

            this.logger('info', chalk.green('  - Preparing files.'));

            await zip.addDir(inDir);

            this.logger('info', chalk.green('  - Creating zip archive.'));

            const filePath = await zip.save(outDir, outFileName);

            const file = new File(filePath);

            this.logger('info', chalk.green('  - Done.'));

            this.logger('info', chalk.green('  - Created zip archive.'));

            await this.loggerZipInfo(file);

            done?.(file);
        } catch (err: unknown) {
            this.logger('error', chalk.bgRed('Something went wrong while building zip file!'));
            this.logger('error', chalk.red(`  - ${err}`));
            error?.(err as Error);
        }
    }

    private async loggerZipInfo(file: File): Promise<void> {
        this.logger('info', chalk.bgGreen(` Zip info `));

        this.logger('info', chalk.green(`  - Path: ${file.toString()}`));
        this.logger('info', chalk.green(`  - Size: ${await file.formatSize()}`));

        this.logger('fileHash', chalk.green(`  - Md5: ${await file.md5()}`));
        this.logger('fileHash', chalk.green(`  - Sha256: ${await file.sha256()}`));
    }

    private logger(type: LogLevel, ...msg: any): void {
        const { logLevel } = this.options;
        if (logLevel === false) {
            return;
        }
        if (logLevel === true || logLevel.includes(type)) {
            console.log(...msg);
        }
    }
}

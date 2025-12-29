import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';

import { fileExists } from './utils';

export interface ZipOptions {
    /**
     * 压缩包目录前缀
     * @default ``
     */
    pathPrefix: string;
    /**
     * 文件过滤
     */
    filter?: (fileName: string, filePath: string, isDirectory: boolean) => boolean;
}

export default class Zip {
    private zip: JSZip;

    constructor(private options: ZipOptions) {
        this.zip = this.createJSZip();
    }

    async addDir(inDir: string): Promise<void> {
        if (!(await fileExists(inDir))) {
            throw new Error(`"${inDir}" folder does not exist!`);
        }
        await this.addFilesToZip(this.zip, inDir);
    }

    async save(outDir: string, outFileName: string): Promise<string> {
        const { zip } = this;
        // @ts-ignore
        zip.root = '';
        if (!(await fileExists(outDir))) {
            await fs.mkdir(outDir, {
                recursive: true
            });
        }

        const filePath = path.resolve(path.join(outDir, outFileName));

        if (await fileExists(filePath)) {
            await fs.unlink(filePath);
        }
        // console.log('save', zip.files);
        const file = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        });

        await fs.writeFile(filePath, file);
        return filePath;
    }

    private createJSZip(): JSZip {
        const { pathPrefix } = this.options;
        const zip = new JSZip();

        if (!pathPrefix) {
            return zip;
        }

        if (path.isAbsolute(pathPrefix)) {
            throw new Error(`"${pathPrefix}" pathPrefix must be a relative path`);
        }

        // const timeZoneOffsetDate = timeZoneOffset(new Date());

        zip.file(pathPrefix, null, {
            dir: true
            // date: timeZoneOffsetDate
        });
        const zipFolder = zip.folder(pathPrefix);

        /* v8 ignore if -- @preserve */
        if (!zipFolder) {
            throw new Error("Files could not be loaded from 'pathPrefix'");
        }
        return zipFolder;
    }

    private async addFilesToZip(zip: JSZip, inDir: string): Promise<void> {
        const { options } = this;
        const files = await fs.readdir(inDir);

        for (const fileName of files) {
            const filePath = path.join(inDir, fileName);
            const file = await fs.stat(filePath);
            // const timeZoneOffsetDate = timeZoneOffset(new Date(file.mtime));

            const isDirectory = file.isDirectory();

            if (options?.filter && !options.filter?.(fileName, filePath, isDirectory)) {
                continue;
            }

            if (isDirectory) {
                zip.file(fileName, null, {
                    dir: true
                    // date: timeZoneOffsetDate
                });
                const folder = zip.folder(fileName);
                /* v8 ignore if -- @preserve */
                if (!folder) {
                    throw new Error(`fileName '${fileName}' couldn't get included als directory in the zip`);
                }

                await this.addFilesToZip(folder, filePath);
            } else {
                zip.file(fileName, await fs.readFile(filePath), {
                    // date: timeZoneOffsetDate
                });
            }
        }
    }
}

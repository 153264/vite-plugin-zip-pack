import type { Plugin } from 'vite';
import type { PackOptions } from './pack';
import Pack from './pack';

export default function zipPackPlugin(options: Partial<PackOptions> = {}): Plugin {
    const _options = {
        inDir: './dist',
        outDir: './',
        outFileName: 'dist.zip',
        pathPrefix: '',
        // done: () => {},
        // error: () => {},
        // filter: () => true,
        enableLogging: true,
        enableFileHash: true,
        ...options
    };

    const pack = new Pack(_options);

    return {
        name: 'vite-plugin-zip-pack',
        apply: 'build',
        enforce: 'post',
        async closeBundle() {
            await pack.pack();
        }
        // closeBundle: {
        //     sequential: true,
        //     async handler() {
        //         const zip = new Zip({
        //             inDir: './dist',
        //             outDir: './',
        //             outFileName: 'dist.zip',
        //             pathPrefix: '',
        //             done: () => {},
        //             error: () => {},
        //             filter: () => true,
        //             enableLogging: true,
        //             ...options
        //         });
        //         await zip.pack();
        //     }
        // }
    };
}

// tslint:disable:no-console
import { createReadStream, createWriteStream } from 'fs';
import * as glob from 'glob';

const baseDir = './src';
const destDir = './dist/src';

console.info('Copying CSS files ...');
glob(`${baseDir}/**/*.css`, (err: Error, matches: string[]) => {
    if (err) {
        throw err;
    }
    for (const file of matches) {
        const baseFile: string = file;
        const destFile: string = file.replace(new RegExp(`^${baseDir}`), destDir);
        const stream: NodeJS.ReadableStream = createReadStream(baseFile);
        stream.pipe(createWriteStream(destFile));
        stream.on('end', () => console.info('Copied', baseFile, 'to', destFile));
        stream.on('error', (streamErr: NodeJS.ErrnoException) => {
            throw streamErr;
        });
    }
});

import * as hook from 'css-modules-require-hook';
import * as postCssConfig from '../postcss.config';
import { cssModulePattern } from '../webpack.config';
import { resolve } from 'path';

let isHooked = false;

export default (): void => {
    if (!isHooked) {
        hook({
            prepend: postCssConfig.plugins,
            generateScopedName: cssModulePattern,
            rootDir: resolve(__dirname, '..'),
        });
        isHooked = true;
    }
};

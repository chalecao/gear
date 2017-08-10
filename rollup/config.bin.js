import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'

export default {
    entry: 'src/bin/bsk.js',
    dest: 'dist/bin/bsk',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    external: ['pjson', 'path', 'opts', 'journey'],
    paths: {
        pjson: '../package.json'
    },
    plugins: [
        buble(),
        resolve()
    ]
}

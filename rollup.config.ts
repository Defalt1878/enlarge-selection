import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'
import del from 'rollup-plugin-delete'

const bundle: RollupOptions = {
  input: {
    content: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'commonjs',
    plugins: [terser()],
  },
  plugins: [
    eslint({
      include: 'src/**',
    }),
    typescript(),
    del({ targets: 'dist/*' }),
    nodeResolve({
      browser: true,
    }),
    commonjs({
      sourceMap: false,
    }),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
export default bundle
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'iife',
  dest: 'dist/iife/pixel.js',
  sourceMap: true,
  moduleName: 'Pixel',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
};

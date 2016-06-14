import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'amd',
  dest: 'dist/amd/pixel.js',
  sourceMap: true,
  moduleId: 'pixel-js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
};

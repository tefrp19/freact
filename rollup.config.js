const babel = require("@rollup/plugin-babel");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
const css = require("rollup-plugin-import-css");

module.exports = {
    input: 'src/index.js',
    output: {
        file: 'public/bundle.js',
        format: 'es'
    },
    plugins: [
        babel({babelHelpers: 'bundled'}),
        serve({
            open: true, // 在浏览器中启动页面
            contentBase: 'public',
            port: 4000,
        }),
        livereload({
            watch: 'public',
        }),
        css(),
    ]
};
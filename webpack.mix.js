const mix = require('laravel-mix');
const path = require("path");
// Additional imports for TypeScript support
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').vue()
    .js('resources/js/login.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css')
    .browserSync('http://localhost:8000')
    .sass('resources/scss/theme.scss', 'public/css');

mix.options({
    optimization: {
        splitChunks: { chunks: 'all' }
    }
});

mix.copy('node_modules/@mdi/font/fonts/', 'dist/fonts/')

// Extend Mix Webpack Config for TypeScript
mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.json', '.vue', '.ts'],
        alias: {
            '@': path.resolve('resources/js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(), // Add this plugin for type checking
    ],
});



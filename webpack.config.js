const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

/*
 * Imatic View bundle webpack configuration.
 *
 * Compiles javascript sources and styles into one bundle usable in browser.
 *
 * Supported browsers are defined in package.json under browserslist key.
 * Available queries can be found here: https://github.com/ai/browserslist#queries
 *
 * These files are also available as sources if there is need for custom version of them.
 */
module.exports = function configure(env, opts) {
    env = env || {dev: true};

    /*
     * Options for babel loader.
     * Babel loader is used for javascript code as well as for javascript generated by typescript.
     */
    const babelOptions = {
        babelrc: false, // Ignore .babelrc files encountered in libraries.
        presets: [
            /*
             * Transpile for browsers determined by browserslist query in package.json.
             */
            ['env', { // Preset for configured browsers.
                modules: false,
                loose: true, // Loose mode generated less strict but simpler transpiled code.
                useBuiltIns: true, // Use built in features where possible in browser.
            }]
        ]
    };

    /*
     * Options for postcss preprocessor.
     */
    const postcssOptions = {
        sourceMaps: !env.prod,
    };

    /*
     * Returned configuration ...
     */
    const config = {
        /*
         * Source map depends on environment ...
         */
        devtool: !!env.prod
            ? 'nosources-source-map'
            : 'inline-source-map',

        /*
         * Entries for platform and demo ...
         */
        entry: {
            platform: ['./Resources/assets/platform.scss', './Resources/assets/platform'],
            demo: ['./Resources/assets/platform.scss', './Resources/assets/demo']
        },

        /*
         * Output to dist folder ...
         */
        output: {
            path: path.resolve(__dirname, 'Resources/public'),
            filename: '[name].js',
            publicPath: '/bundles/imaticview/'
        },

        /*
         * Loader rules ...
         */
        module: {
            rules: [
                /*
                 * Basic css compilation.
                 *
                 * CSS is minimized in production.
                 * Source maps are not generated in production (css source maps affect performance).
                 */
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: !!env.prod,
                                    sourceMaps: !env.prod,
                                    importLoaders: 1,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: postcssOptions
                            }
                        ]
                    })
                },

                /*
                 * Less compilation.
                 *
                 * Same rules as for css loader apply.
                 */
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: !!env.prod,
                                    sourceMaps: !env.prod,
                                    importLoaders: 2,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: postcssOptions
                            },
                            'less-loader'
                        ]
                    })
                },

                /*
                 * Sass compilation.
                 *
                 * Same rules as for css loader apply.
                 */
                {
                    test: /\.s[ca]ss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: !!env.prod,
                                    sourceMaps: !env.prod,
                                    importLoaders: 3,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: postcssOptions
                            },
                            'resolve-url-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    sourceMapContents: false
                                }
                            }
                        ]
                    })
                },

                /*
                 * ES6 compilation.
                 */
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        }
                    ]
                },

                /*
                 * TypeScript compilation.
                 *
                 * Typescript files are checked and transpiled to js.
                 * Resulting JS files are then transpiled using babel with same configuration as straight js files.
                 */
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                silent: !!opts.json
                            }
                        }
                    ]
                },

                /*
                 * Fonts are copied to fonts directory.
                 */
                {
                    test: /\.(woff2?|ttf|eot)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    }
                },

                /*
                 * Images are copied to images directory.
                 */
                {
                    test: /\.(jpe?g|png|gif|svg)($|\?)/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                hash: 'sha512',
                                digest: 'hex',
                                name: 'images/[name].[ext]'
                            }
                        }
                    ]
                },

                /*
                 * expose jQuery
                 */
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },{
                        loader: 'expose-loader',
                        options: '$'
                    }]
                }
            ]
        },

        /*
         * Resolve configuration ...
         */
        resolve: {
            extensions: ['.ts', '.js'], // Typescript and javascript files should be resolved without extension.
            modules: [
                'node_modules',
                /*
                 * Search for modules in vendors directory too.
                 * Resolution works the same way as for node_modules directory.
                 * Any file required is searched for in ./vendor then ../vendor etc.
                 * This means you can require a file from php package and it doesn't matter,
                 * if you work on the bundle alone or the bundle is par of a bigger project.
                 * Example: require('imatic/form-bundle/Resources/public/js/Form')
                 */
                'vendor'
            ]
        },

        /*
         * Plugins configuration ...
         */
        plugins: [
            /*
             * Define NODE_ENV for some libraries that take it into account nad provide more compact version.
             */
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(!!env.prod ? 'production' : 'development')
            }),

            /*
             * Only require en cs and sk locales for moment.js.
             */
            new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en|cs)$/),

            /*
             * Extract css files imported throughout the bundle into a separate css file.
             */
            new ExtractTextPlugin({
                filename: '[name].css'
            }),

            /*
             * Clean output folder before rebuild.
             */
            new CleanWebpackPlugin([
                'Resources/public/*'
            ])
        ]
    };

    /*
     * In production, include MinifyPlugin which serves as a replacement for UglifyJs plugin.
     * UglifyJs only minifies ES% code which is not desirable when generating partially ES6 code.
     * ES6 is generated thanks to env babel preset. There is no need to transpile code
     * which is already supported in all major browsers.
     */
    if (!!env.prod) {
        config.plugins.push(new MinifyPlugin({
            evaluate: false,
            numericLiterals: false,
            propertyLiterals: false,
        }));
    }

    /*
     * In analyze environment add bundle analyzer.
     * This plugin is extremely useful when optimizing built file sizes.
     */
    if (!!env.analyze) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};

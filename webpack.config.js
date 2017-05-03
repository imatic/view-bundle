const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = function configure(env, opts) {
    env = env || {dev: true};

    const babelOptions = {
        babelrc: false,
        presets: [
            ['modern-browsers', {modules: false, loose: true}]
        ]
    };

    const config = {
        /*
         * Source map depends on environment ...
         */
        devtool: !!env.prod
            ? 'nosources-source-map'
            : 'cheap-module-eval-source-map',

        /*
         * Entries for platform and demo ...
         */
        entry: {
            platform: ['./Resources/assets/platform.less', './Resources/assets/platform'],
            demo: ['./Resources/assets/platform.less', './Resources/assets/demo']
        },

        /*
         * Output to dist folder ...
         */
        output: {
            path: path.resolve(__dirname, 'Resources/public'),
            filename: '[name].js',
            publicPath: '/bundles/imaticview'
        },

        /*
         * loader rules ...
         */
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {
                            loader: 'css-loader',
                            options: {
                                minimize: !!env.prod,
                                sourceMaps: false
                            }
                        }
                    })
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: !!env.prod,
                                    importLoaders: 1,
                                    sourceMaps: false
                                }
                            },
                            'less-loader'
                        ]
                    })
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        },
                        {
                            loader: 'ts-loader'
                        }
                    ]
                },
                {
                    test: /\.(woff2?|ttf|eot)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    }
                },
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
                }
            ]
        },

        resolve: {
            extensions: ['.ts', '.js']
        },

        plugins: [
            new ExtractTextPlugin({
                filename: '[name].css'
            })
        ]
    };

    if (!!env.prod) {
        config.plugins.push(new BabiliPlugin({
            mangle: true,
            deadcode: true,
            evaluate: true, // constant folding,
            simplify: true, // simplify, undef to void,
            booleans: true,
            properties: true,
        }));
    }

    return config;
};

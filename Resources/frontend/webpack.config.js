const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = function configure(env, opts) {
    env = env || {dev: true};

    const babelOptions = {
        babelrc: false,
        presets: [
            [require.resolve('babel-preset-modern-browsers'), {modules: false}]
        ]
    }

    const config = {
        /*
         * Source map depends on environment ...
         */
        devtool: !!env.prod
            ? 'hidden-source-map'
            : 'eval-source-map',

        /*
         * Entries for platform and demo ...
         */
        entry: {
            platform: ['./platform.less', './platform'],
            demo: ['./platform.less', './demo']
        },

        /*
         * Output to dist folder ...
         */
        output: {
            path: path.resolve(__dirname, '../public'),
            filename: '[name].js',
            sourceMapFilename: '[name].map'
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
                                minimize: !!env.prod
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
                                    importLoaders: 1
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
    }

    if (!!env.prod) {
        config.plugins.push(new BabiliPlugin());
    }

    return config;
}
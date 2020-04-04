const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index_options: './src/options.ts',
        index_popup: './src/popup.ts',
        background: './src/background.ts',

    },
    optimization: {
        minimize: false
    },
    mode: "production",
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    // externals: {
    //     react: "React",
    //     "react-dom": "ReactDOM",
    //     "material-ui": "MaterialUI"
    // },
    plugins: [
        new CopyPlugin([
            { from: './src/images/', to: './' },
            { from: './src/pages/', to: './' },
            { from: './src/manifests/', to: './' }
        ]),
    ]
};
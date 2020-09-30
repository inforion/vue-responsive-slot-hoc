const path = require('path');

module.exports = {
    mode: 'production',
    devtool: false,
    entry: {
        bundle: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'ResponsiveSlotHoc',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        vue: 'commonjs vue'
    }
};
module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@env': './.env', // Keep this for your custom environment files if needed
                },
            },
        ],
    ],
};

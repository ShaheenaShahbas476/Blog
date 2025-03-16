// config-overrides.js

module.exports = {
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
        };

        return config;
    },
};

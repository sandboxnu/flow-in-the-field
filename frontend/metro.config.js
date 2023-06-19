const { getDefaultConfig } = require('expo/metro-config');
module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig(__dirname);
    return {
        resolver: {
            assetExts: [
                ...assetExts,
            ],
            sourceExts: [
                ...sourceExts,'jsx', 'js', 'ts', 'tsx', 'cjs'
            ],
        },
        transformer: {
            assetPlugins: ['expo-asset/tools/hashAssetFiles'],
        },
    };
})();
module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      'react-native-reanimated/plugin', // Reanimated plugin has to be listed last.
    ],
    presets: ['babel-preset-expo'],
  };
};

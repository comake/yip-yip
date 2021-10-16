const { addPlugins, getPlugin, pluginByName } = require("@craco/craco");
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const extensionManifestPlugin = new WebpackExtensionManifestPlugin({
  config: {
    base: './manifest.json',
    extend: Boolean(process.env.IS_FIREFOX) ? './manifest_firefox.json' : './manifest_chrome.json'
  },
  pkgJsonProps: [
    'version'
  ]
})

function removeContentHashFromMiniCssExtractPlugin(webpackConfig) {
  const { isFound, match } = getPlugin(webpackConfig, pluginByName("MiniCssExtractPlugin"));
  if (isFound) {
    match.options.filename = 'static/css/[name].css'
  }
}

function unsetDefaultMainEntryInManifestPlugin(webpackConfig) {
  const { isFound, match } = getPlugin(webpackConfig, pluginByName("ManifestPlugin"));
  if (isFound) {
    // Solution to remove the default "main" entry point found here: https://github.com/timarney/react-app-rewired/issues/421
    // Code copied from here https://github.com/vl4d1m1r4/cra-multi-entry/blob/8c62e9168e638e4c841fff87291cec6a99eb4ea9/config-overrides.js
    match.opts.generate = (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((manifest, file) => {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);

      const entrypointFiles = {};
      Object.keys(entrypoints).forEach(entrypoint => {
        entrypointFiles[entrypoint] = entrypoints[entrypoint].filter(fileName => !fileName.endsWith('.map'));
      });

      return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
      };
    }
  }
}

module.exports = {
  webpack: {
    configure: (webpackConfig, {env, paths}) => {
      removeContentHashFromMiniCssExtractPlugin(webpackConfig);
      unsetDefaultMainEntryInManifestPlugin(webpackConfig);
      addPlugins(webpackConfig, [extensionManifestPlugin])

      return {
        ...webpackConfig,
        entry: {
          login: './src/login.js',
          content: './src/content.js',
          background: './src/background.js',
        },
        output: {
          ...webpackConfig.output,
          filename: (pathData) => {
            return pathData.chunk.name === 'background' ? '[name].js' : 'static/js/[name].js';
          },
        },
        optimization: {
          ...webpackConfig.optimization,
          splitChunks: {
            cacheGroups: {
          		default: false
          	}
          },
          runtimeChunk: false,
        }
      }
    },
  }
}

module.exports = function(api) {
	api.cache(true);

    const presets = [];
	const plugins = ["./src/offload_babel_plugin.js",
                    "transform-es2015-modules-commonjs"];
	return {
		presets,
		plugins
	}
}

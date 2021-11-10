const sources = ["analytics", "background", "popout_for_youtube", "popout"]

const config = sources.map((name) => ({
  input: `src/${name}.js`,
  output: {
    file: `build/${name}.bundle.js`,
    format: "iife",
  },
}))

module.exports = config

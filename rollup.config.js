const sources = ["analytics", "background", "popout_for_youtube", "popout"]

const config = sources.map((name) => ({
  input: `src/${name}.js`,
  output: {
    file: `lib/${name}.js`,
    format: "iife",
  },
}))

module.exports = config

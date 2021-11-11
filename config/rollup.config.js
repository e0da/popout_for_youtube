const sources = ["background", "popout", "session"]

const config = sources.map((name) => ({
  input: `src/bundles/${name}Bundle.js`,
  output: {
    file: `build/${name}.bundle.js`,
    format: "iife",
  },
}))

module.exports = config

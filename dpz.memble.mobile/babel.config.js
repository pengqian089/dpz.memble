module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    ["prismjs", {
      "languages": ["javascript", "css", "markup","markdown","csharp","java","html","go"],
      "plugins": ["line-numbers","match-braces"],
      "theme": "okaidia",
      "css": true
    }]
  ]
}

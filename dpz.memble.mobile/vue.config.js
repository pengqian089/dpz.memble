const {defineConfig} = require('@vue/cli-service');
const path = require("path");
const fs = require("fs");

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        open: true,
        https: {
            cert: fs.readFileSync(path.join(__dirname, "src/cert/localhost.crt")),
            key: fs.readFileSync(path.join(__dirname, "src/cert/localhost.key"))
        }
    }
})

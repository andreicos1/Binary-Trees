const path = require("path");

/** @type {import('next').NextConfig} */
path;
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: '@import "./variables.scss";',
  },
};

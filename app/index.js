var train = require('express-train');

console.log("in index.js, __dirname = " +  __dirname);
module.exports = train(__dirname);
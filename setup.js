var fs = require('fs');

var UglifyJS = require("uglify-js");

var result = UglifyJS.minify([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/underscore/underscore-min.js"
]);

fs.writeFileSync('public/js/libs.min.js',result.code,'utf8');

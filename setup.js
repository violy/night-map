var fs = require('fs');

var UglifyJS = require("uglify-js");

var result = UglifyJS.minify([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/underscore/underscore-min.js",
    "node_modules/google-map-bounds-limit/dist/google-map-bounds-limit.js",
    "node_modules/js-map-label/src/maplabel.js"
]);

fs.writeFileSync('public/js/libs.min.js',result.code,'utf8');
console.log('node modules uglify success');

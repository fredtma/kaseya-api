var gulp    = require("gulp");
var jshint  = require("gulp-jshint");
var nodemon = require("gulp-nodemon");
var shell   = require("gulp-shell");
var argv    = require('yargs').argv;
var fs      = require("fs");
var jsFiles = ["./**/*.js", "index.js"];
var merge   = require("deepmerge");

gulp.task("install", shell.task("npm install"));

gulp.task("watch", ["serve"], function () {
    var watcher = gulp.watch(jsFiles, ["serve"]);
    watcher.on("change", function (event) {
        console.log("File " + event.path + " was " + event.type);
    });
});

gulp.task("jshint", function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("config", function () {
    var environment = argv.target || "dev";
    console.log("writing config for %s", environment);
    var configs = require("./config.js");
    var defaults= configs['defaults'];
    var specific= configs[environment];
    var output  = merge(defaults, specific);
    fs.writeFileSync("config.json", JSON.stringify(output));
});

gulp.task("serve", ["config"], function () {
    nodemon({
        script: 'index.js',
        ext: 'html js json'
    })
    .on("restart", function () {
        console.log("nodemon - restarted!");
    });
});

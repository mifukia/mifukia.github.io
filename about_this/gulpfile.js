var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');//scss
var autoprefixer = require("gulp-autoprefixer");//SCSSのautoprefix
var browser = require("browser-sync");//ライブリロード
var notify = require('gulp-notify'); //(*1)
var watch = require('gulp-watch');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var fs = require('fs');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var vueify = require('vueify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

//パスの定義
var paths = {
    'html' : './**/*.html',
    'php'  : './**/*.php',
    'sass' : 'assets/scss/**/*.scss',
    'css'  : 'assets/css/',
    'js'   : 'assets/js/src/**/*.js',
};

///phpを読まない
gulp.task('connect-sync', function () {
    browser({
        server: {
            proxy: "localhost:3000",
            baseDir: "."
        }
    });
});

//オートリロード
gulp.task('bs-reload', function () {
    browser.reload();
});

//sassのコンパイル
gulp.task("sass", function() {
    gulp.src(paths.sass)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))//コンパイルエラーを表示
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 6 versions']}))//オートプレフィクス
        .pipe(gulp.dest(paths.css))//ｃｓｓに書き出す
        .pipe(browser.reload({stream:true}));//リロードを実行
});

//ejsのコンパイル
gulp.task("ejs", function() {
    // JSONファイル読み込み
    var json = JSON.parse(fs.readFileSync('ejs/config.json'));
    gulp.src(
        ["ejs/**/*.ejs",'!' + "ejs/**/_*.ejs"] //_を頭に付けたejsファイルはコンパイルから除外
    )
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))//コンパイルエラーを表示
        .pipe(ejs(json))
        .pipe(rename({extname: '.html'}))//.ejsをリネーム（phpにしたいときはここを変える）
        .pipe(gulp.dest("./"))
        .on('end',function(){
        browser.reload();
    });
});


//vue,jsのバンドル
function buildScript (watch) {
    var props = {
        entries: ['./assets/js/src/main.js'],
        cache: {},
        packageCache: {},
        fullPaths: true
    };
    var bundler = watch ? watchify(browserify(props)) : browserify(props);
    bundler.transform(babelify, { presets: ['es2015'] });
    bundler.transform(vueify);
    function rebundle () {
        return bundler
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest('./assets/js/'))
            .pipe(browser.reload({stream:true}));//リロードを実行

    }
    if (watch) {
        bundler.on('update', function(){
            rebundle();
        });
    }
    return rebundle();
}

gulp.task('build',function(){
    return buildScript(false);
});

gulp.task('watch', ['build'],function(){
    return buildScript(true);
});



//コマンドで'gulp'を実行時に起動する基本タスク
gulp.task("default",['connect-sync','build','watch'],function() {
    watch([paths.sass],function(){
        gulp.start(['sass']);
    });//sassフォルダの監視
    watch(["ejs/**/*.ejs"],function(){
        gulp.start(['ejs']);
    });//ejsフォルダの監視
});

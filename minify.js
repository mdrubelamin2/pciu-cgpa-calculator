// minify.js
var Terser = require("terser");
var fs = require("fs");
var path = require("path");

function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles.filter(path => path.match(/\.js$/));
}

const terserConfig = {
  module: {},
  compress: true,
  mangle: {},
  output: {},
  parse: {},
  rename: {},
}

async function minifyFiles(filePaths) {
  await Promise.all(filePaths.map(async (filePath) => {
    fs.writeFileSync(
      filePath,
      (await Terser.minify(fs.readFileSync(filePath, "utf8"), terserConfig)).code
    );
  }));
}

const files = getAllFiles("./dist");
minifyFiles(files).then(r => r);

// create a file named build-hash.txt with a random hash number
const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
fs.writeFileSync("./build-hash.txt", hash);

// rename the index.html from dist folder to index.hash.html
fs.renameSync("./dist/index.html", `./dist/index.${hash}.html`);
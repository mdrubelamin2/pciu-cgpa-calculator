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
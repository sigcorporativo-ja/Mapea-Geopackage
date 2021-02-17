const fs = require('fs');
const path = require('path');

const SRC_FOLDER = path.resolve(__dirname, '..', 'src');
const INDEX_PATH = path.resolve(SRC_FOLDER, 'entry.js');

const getAllJSFiles = (src) => {
  const ls = fs.readdirSync(src);
  let paths = [];
  ls.forEach((name) => {
    const srcFile = path.resolve(src, name);
    if (fs.statSync(srcFile).isFile()) {
      paths.push(srcFile);
    }
    if (fs.statSync(srcFile).isDirectory()) {
      paths = paths.concat(getAllJSFiles(srcFile));
    }
  });
  return paths;
};

const filterByModuleAnnotation = (fileList) => {
  return fileList
    .filter(file => fs.readFileSync(file, 'utf8').match(/@module/))
    .map((file) => {
      const content = fs.readFileSync(file, 'utf8');
      const match = content.match(/@module (.*)/);
      const module = match[1];
      return {
        path: file,
        module,
        symbol: module.replace(/\//g, '$'),
        namespace: module.replace(/\//g, '.'),
      };
    });
};

const createIndex = (files) => {
  let content = '';
  // imports
  files.forEach((file) => {
    content += `import ${file.symbol} from '${file.path}';\n`;
  });

  // create namespaces
  files.forEach((file) => {
    content += `${file.namespace} = ${file.symbol};\n`;
  });
  return content;
};

const main = () => {
  const files = getAllJSFiles(SRC_FOLDER);
  const modules = filterByModuleAnnotation(files);
  const content = createIndex(modules);
  fs.writeFileSync(INDEX_PATH, content);
};

main();

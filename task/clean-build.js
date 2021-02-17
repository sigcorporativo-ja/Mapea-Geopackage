const path = require('path');
const fs = require('fs');
const { argv } = require('yargs');

const pathFolder = argv.path;
const folderToRemove = path.resolve(__dirname, '..', pathFolder);
fs.rmdirSync(folderToRemove, { recursive: true });

console.log(`clean-build task: Remove folder ${folderToRemove}`);

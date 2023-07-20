const fs = require('fs/promises');
const path = require('path');

const projectRoot = path.join(__dirname, '../../src');
const testRoot = path.join(__dirname, '../../tests');

const readFileSystemRecursively = async (directory, fileList) => {
  const files = await fs
    .readdir(directory, { withFileTypes: true })
    .then(files => files)
    .catch(error => {
      console.log(`Could not read directory: ${directory}, Stack: ${error}`);
    });
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    if (!file.isDirectory()) {
      fileList.push(filePath);
    } else {
      fileList = await readFileSystemRecursively(filePath, fileList);
    }
  }
  return fileList.filter(file => !!file);
};

const getProjectFilesMap = async () => {
  const projectFiles = await readFileSystemRecursively(projectRoot, []).then(filesMap => filesMap);
  const testFiles = await readFileSystemRecursively(testRoot, []).then(filesMap => filesMap);
  return projectFiles.concat(testFiles);
};

module.exports = { getProjectFilesMap };

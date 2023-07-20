const pathScrapper = require('./path-scrapper');
const commandExecution = require('./command-execution');

const programArgs = process.argv.slice(2);
const testArg = programArgs.find(arg => arg.startsWith('test:')) || 'all';

const isSilent = programArgs.some(arg => arg === '--silent');
const isUnit = testArg.endsWith('unit') || testArg === 'all';
const isE2E = testArg.endsWith('e2e') || testArg === 'all';

async function autoTesting({ isSilent, isUnit, isE2E }) {
  const filesList = await pathScrapper.getProjectFilesMap();
  const unitTestFiles = filesList.filter(file => file.includes('.spec'));
  const e2eTestFiles = filesList.filter(file => file.includes('.test'));
  let failedTestIssues = [];
  if (isUnit) {
    const issues = await testFiles(unitTestFiles, isSilent);
    failedTestIssues = failedTestIssues.concat(issues);
  }
  if (isE2E) {
    const issues = await testFiles(e2eTestFiles, isSilent);
    failedTestIssues = failedTestIssues.concat(issues);
  }
  failedTestIssues.forEach(issue => {
    console.log(issue);
  });
}

const testFiles = async (testFilesList, isSilent) => {
  let issues = [];
  for (const file of testFilesList) {
    const command = `npm run jest -- ${file} ${isSilent ? '--silent' : ''}`.trim();
    const testResult = await commandExecution.executeCommand(command, isSilent);
    formatTestResult(testResult.success, command);
    if (!testResult.success) {
      issues.push(testResult.error);
    }
  }
  return issues;
};

// color strings
const colorRed = text => `\x1b[31m${text}\x1B[0m`;
const colorGreen = text => `\x1b[32m${text}\x1B[0m`;

const formatTestResult = (success, command) => {
  // TODO: Outsource to prep-pr script
  if (success) {
    console.log(colorGreen(`  ✔  ${command}`));
    return;
  }
  console.log(colorRed(`  ✘  ${command}`));
};

autoTesting({
  isSilent,
  isUnit,
  isE2E,
});

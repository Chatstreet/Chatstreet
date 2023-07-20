const util = require('util');
const exec = util.promisify(require('child_process').exec);

const executeCommand = async command => {
  try {
    await exec(command);
    return {
      success: true,
    };
  } catch (e) {
    const { stderr } = e;
    return {
      success: false,
      error: stderr,
    };
  }
};

module.exports = { executeCommand };

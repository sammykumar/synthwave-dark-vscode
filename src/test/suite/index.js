const path = require("path");
const Mocha = require("mocha");
const { glob } = require("glob");

function run() {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    timeout: 10000,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise(async (c, e) => {
    try {
      // Find all test files
      const files = await glob("**/suite/*.test.js", { cwd: testsRoot });

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      console.log(`Found ${files.length} test files: ${files.join(", ")}`);

      // Run the mocha test
      mocha.run((failures) => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}

module.exports = {
  run,
};

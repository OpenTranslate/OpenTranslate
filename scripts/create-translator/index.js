/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require("fs-extra");
const path = require("path");
const fg = require("fast-glob");
const ejs = require("ejs");
const argv = require("yargs").argv;
const lernaConfig = require("../../lerna.json");

const packagePath = path.join(__dirname, "../../packages");

async function checkExistingTranslator(engine) {
  const list = await fs.readdir(packagePath);

  if (list.some(name => name === "service-" + engine)) {
    console.error(`\nTranslator ${engine} exists.\n`);
    process.exit(1);
  }
}

function checkTempalteFiles(entries) {
  const invalidFile = entries.find(entry => !entry.endsWith("ejs"));
  if (invalidFile) {
    console.error(
      `\nFile ${path.resolve(__dirname, invalidFile)} is not a template.\n`
    );
    process.exit(1);
  }
}

async function main() {
  if (!argv._[0]) {
    console.error(
      `\nTranslator name is required.\n\nyarn create-translator <name>\n`
    );
    process.exit(1);
  }

  const engine = argv._[0].toLowerCase();
  await checkExistingTranslator(engine);

  const templatePath = path.join(__dirname, "template");

  const entries = await fg(["**/*"], {
    cwd: templatePath,
    dot: true
  });
  checkTempalteFiles(entries);

  entries.forEach(async entry => {
    const data = {
      version: lernaConfig.version,
      engine,
      engineTitled: engine[0].toUpperCase() + engine.slice(1)
    };

    const result = await ejs.renderFile(path.join(templatePath, entry), data, {
      async: true
    });

    await fs.outputFile(
      path.join(
        packagePath,
        `service-${engine}`,
        entry.replace(/{([^}]*)}/g, (m, key) => data[key]).slice(0, -4)
      ),
      result
    );
  });
}

main();

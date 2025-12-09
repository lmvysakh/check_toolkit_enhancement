// This script computes a cache key using hashFiles from the PR toolkit

const path = require('path');
const fs = require('fs');

// Get environment variables
const toolkitPath = process.env.TOOLKIT_PATH || './toolkit';
const targetFile = process.env.TARGET_FILE || 'dependency.lock';
const targetDir = process.env.TARGET_DIR || 'sibling_repo';

// Dynamically require the toolkit (may need to update this if the export is different!)
const hashFiles = require(path.join(toolkitPath, 'packages', 'glob', 'lib', 'hash-files.js'));

// Build full path to search
const absoluteDir = path.resolve(targetDir);

// Hash the file
async function main() {
  try {
    const hash = await hashFiles(targetFile, { workingDirectory: absoluteDir });
    console.log(hash); // Print for debug
    // Set output for GitHub Actions
    // For old Actions runner compatibility (uses set-output):
    console.log(`::set-output name=hash::${hash}`);
    // For new GITHUB_OUTPUT file:
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `hash=${hash}\n`);
    }
  } catch (err) {
    console.error('Error computing hash:', err);
    process.exit(1);
  }
}

main();
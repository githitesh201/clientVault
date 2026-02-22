#!/usr/bin/env node
const message = `\nClientVault CLI (clientvault-cli) is deprecated.\n\nPlease install and use the new package instead:\n  npm install -g clientvault-sdk\n\nThe command name remains the same: \"clientvault\".\nMore info: https://www.npmjs.com/package/clientvault-sdk\n`;

console.error(message);
process.exitCode = 1;

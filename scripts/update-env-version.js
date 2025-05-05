const fs = require('fs');
const packageJson = require('../package.json');
const envPath = './.env';

const version = packageJson.version;
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
    .replace(/REACT_APP_VERSION=.*/g, `REACT_APP_VERSION=${version}`);
} else {
  envContent = `REACT_APP_VERSION=${version}\n`;
}

fs.writeFileSync(envPath, envContent);
console.log(`✅ Updated .env with REACT_APP_VERSION=${version}`);
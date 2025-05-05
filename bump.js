const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Which version bump? (patch / minor / major): ', (answer) => {
  const type = answer.trim().toLowerCase();
  if (['patch', 'minor', 'major'].includes(type)) {
    console.log(`Running: npm version ${type}`);
    execSync(`npm version ${type}`, { stdio: 'inherit' });
  } else {
    console.log('Invalid type. Skipping version bump.');
  }
  rl.close();
});

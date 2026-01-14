const { execSync } = require('child_process');
const fs = require('fs');

try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf-8' });
  const isEnvTracked = trackedFiles.includes('server/.env');
  const isEnvLocalTracked = trackedFiles.includes('client/.env.local');
  
  const output = {
    isServerEnvTracked: isEnvTracked,
    isClientEnvLocalTracked: isEnvLocalTracked,
    trackedFiles: trackedFiles.split('\n').filter(f => f.includes('.env'))
  };
  
  fs.writeFileSync('git_env_check.json', JSON.stringify(output, null, 2));
  console.log('Check complete. Results in git_env_check.json');
} catch (err) {
  fs.writeFileSync('git_env_check_error.txt', err.message);
  console.error(err);
}

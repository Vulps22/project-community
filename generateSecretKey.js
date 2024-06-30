const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString('hex');

// Path to the .env file
const envFilePath = path.resolve(__dirname, '.env');

// Read the existing .env file
let envFileContent = '';
if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, 'utf8');
}

// Update the JWT_SECRET value
const updatedEnvFileContent = envFileContent
    .split('\n')
    .filter(line => !line.startsWith('JWT_SECRET='))
    .concat(`JWT_SECRET=${secretKey}`)
    .join('\n');

// Write the updated content back to the .env file
fs.writeFileSync(envFilePath, updatedEnvFileContent);

console.log(`JWT_SECRET has been updated to: ${secretKey}`);

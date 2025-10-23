const bcrypt = require('bcryptjs');

// Utility to generate password hash
async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  return hash;
}

// Generate hash for admin123
if (require.main === module) {
  hashPassword('admin123').then(() => {
    process.exit(0);
  });
}

module.exports = hashPassword;

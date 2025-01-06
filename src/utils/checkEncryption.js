const isEncrypted = (password) => {
  // Check if the password matches the bcrypt pattern
  const bcryptPattern = /^\$2[aby]\$.{56}$/;
  return bcryptPattern.test(password);
};

module.exports = { isEncrypted };

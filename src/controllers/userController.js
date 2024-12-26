const upgradeUser = async (req, res, next) => {
  res.status(200).json({ message: "User upgraded successfully" });
};

const downgradeUser = async (req, res, next) => {
  res.status(200).json({ message: "User downgraded successfully" });
};

const deleteUser = async (req, res, next) => {
  res.status(200).json({ message: "User deleted successfully" });
};

const getUser = async (req, res, next) => {
  res.status(200).json({ message: "User retrieved successfully" });
};

module.exports = { upgradeUser, downgradeUser, deleteUser, getUser };

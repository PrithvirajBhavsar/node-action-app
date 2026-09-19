const {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
} = require('../services/users.service');

const getUsers = async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
};

const getUserById = async (req, res) => {
  const user = await getUser(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
};

const createUser = async (req, res) => {
  try {
    const user = await addUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await editUser(req.params.id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const deleted = await removeUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(204).send();
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

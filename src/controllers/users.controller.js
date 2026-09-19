const { getAllUsers, getUser, addUser, editUser, removeUser } = require('../services/users.service');

const getUsers = (req, res) => {
  res.json(getAllUsers());
};

const getUserById = (req, res) => {
  const user = getUser(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
};

const createUser = (req, res) => {
  const user = addUser(req.body);
  return res.status(201).json(user);
};

const updateUser = (req, res) => {
  const updatedUser = editUser(req.params.id, req.body);

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(updatedUser);
};

const deleteUser = (req, res) => {
  const deleted = removeUser(req.params.id);

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

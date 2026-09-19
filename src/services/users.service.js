const mongoose = require('mongoose');
const User = require('../models/User');

const fallbackUsers = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

const getAllUsers = async () => {
  if (!isDbConnected()) {
    return fallbackUsers;
  }

  return User.find();
};

const getUser = async (id) => {
  if (!isDbConnected()) {
    return fallbackUsers.find((user) => user.id === id) || null;
  }

  return User.findById(id);
};

const addUser = async (userData) => {
  if (!isDbConnected()) {
    const newUser = {
      id: String(fallbackUsers.length + 1),
      ...userData,
    };

    fallbackUsers.push(newUser);
    return newUser;
  }

  const user = new User(userData);
  return user.save();
};

const editUser = async (id, userData) => {
  if (!isDbConnected()) {
    const index = fallbackUsers.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    fallbackUsers[index] = {
      ...fallbackUsers[index],
      ...userData,
      id,
    };

    return fallbackUsers[index];
  }

  return User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

const removeUser = async (id) => {
  if (!isDbConnected()) {
    const index = fallbackUsers.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    fallbackUsers.splice(index, 1);
    return true;
  }

  const deletedUser = await User.findByIdAndDelete(id);
  return !!deletedUser;
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
};

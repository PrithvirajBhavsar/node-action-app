let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const getAllUsers = () => users;

const getUser = (id) => users.find((user) => user.id === id);

const addUser = (userData) => {
  const newUser = {
    id: String(users.length + 1),
    ...userData,
  };

  users.push(newUser);
  return newUser;
};

const editUser = (id, userData) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...userData,
    id,
  };

  return users[index];
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  return true;
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
};

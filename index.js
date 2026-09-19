require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT is not defined in the .env file');
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
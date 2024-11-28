require('dotenv').config();
const app = require('./server');
const SERVER_PORT = process.env.SERVER_PORT || 8080;

app.listen(SERVER_PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.SERVER_PORT || 8080}`);
});

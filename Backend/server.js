const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json()); // for parsing JSON request bodies

// Mount the route
app.use('/api/users', userRoutes);

// Run server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

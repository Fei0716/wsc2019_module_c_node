const express = require('express');
//to get all the routes
const routes = require('./routes');

const app = express();
// middleware
app.use(express.json());//convert request to json
app.use('/api/v1',routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
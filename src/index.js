require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const carsRoutes = require('./routes/cars');
const app = express();

app.use(express.json());
app.use('/cars', carsRoutes);

sequelize.sync()
    .then(() => {
        console.log('Database connected and synchronized');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const toLowerCase = require('../helpers/toLowerCase');

router.get('/', async (req, res) => {
    const { make, model, year, priceMin, priceMax, fuelType, transmission, bodyType, color, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (make) query.make = make;
    if (model) query.model = model;
    if (year) query.year = year;
    if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price['$gte'] = priceMin;
        if (priceMax) query.price['$lte'] = priceMax;
    }
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (bodyType) query.bodyType = bodyType;
    if (color) query.color = color;

    try {
        const limitNum = parseInt(limit, 10);
        const offset = (parseInt(page, 10) - 1) * limitNum;

        const { rows: cars, count: totalCars } = await Car.findAndCountAll({
            where: query,
            limit: limitNum,
            offset: offset
        });

        res.json({
            totalItems: totalCars,
            totalPages: Math.ceil(totalCars / limitNum), 
            currentPage: parseInt(page, 10),
            cars
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        toLowerCase(req.body);
        const car = await Car.create(req.body);
        res.status(201).json(car);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));

            const notNullErrors = validationErrors.filter(err => err.message.includes('cannot be null'));

            return res.status(400).json({
                message: "not null violation",
                fields: notNullErrors.map(err => err.field)
            });
        }
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        
        toLowerCase(req.body);
        await car.update(req.body);
        res.json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        await car.destroy();
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

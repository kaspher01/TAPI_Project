module.exports = function toLowerCase(body) {
    const fieldsToConvert = ["make", "model", "fuelType", "transmission", "bodyType", "color", "location"];

    fieldsToConvert.forEach(field => {
        if (body[field]) {
            body[field] = body[field].toLowerCase();
        }
    });
};

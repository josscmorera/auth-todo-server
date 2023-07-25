const mongoose = require('mongoose');

const moongoseConect = async () => {
    await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('connected to mongodb');
}

module.exports = {moongoseConect};
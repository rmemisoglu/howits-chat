const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://movie_user:abcd1234@ds225492.mlab.com:25492/api-movie', { useNewUrlParser: true });
    mongoose.connection.on('open', () => {
        //console.log("MongoDB: Connected");
    });

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB: Error", err);
    });

    mongoose.Promise = global.Promise;
};
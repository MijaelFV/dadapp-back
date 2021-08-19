const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        let options =  {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
        
        if(process.env.MONGO_USER) {
            console.log(`Mongo user:${process.env.MONGO_USER}`)
            options = {
                ...options,
                auth: {authSource: 'admin'},
                user: process.env.MONGO_USER,
                pass: process.env.MONGO_PASS
            }
        }
        await mongoose.connect(process.env.MONGODB_CNN,options);

        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al intentar iniciar la base de datos')
    }
}

module.exports = {
    dbConnection,
}
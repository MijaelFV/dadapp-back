const User = require('../models/user_model');

const migration = async() => {
    try {
        const filter = {
            name: 'Martino'
            // _id: {$exists: true}
            // status: false
        }
    
        const update = {
            $set: {name: ''}
            // $unset: {status: 1}
        }

        const resp = await User.updateMany(filter, update)

        console.log('\n');
        console.log(resp);
        console.log('Se realizo la migracion sin errores');
        console.log('\n');
    } catch (err) {
        console.log('\n');
        console.log(err)
        console.log('Hubo un error en la migracion')
        console.log('\n');
    }
};

module.exports = {
    migration,
}
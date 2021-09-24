const User = require('../models/user_model');

const emailExists = async(email = '')=>{
    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new Error(`El correo ya esta en uso`)
    }
;}

const uidExists = async(id)=>{
    const uidExists = await User.findById(id);
    if (!uidExists) {
        throw new Error(`No existe un usuario con la id ${id} en la base de datos`);
    }
};

const permittedCollections = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error(`La coleccion ${collection} no esta permitida, ${collections}`)
    }
    return true;
}

module.exports = {
    emailExists,
    uidExists,
    permittedCollections
};

const User = require('../models/user_model');

const emailExists = async(email = '')=>{
    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new Error(`El correo ${email} ya esta registrado en la base de datos`)
    }
;}

const uidExists = async(id)=>{
    const uidExists = await User.findById(id);
    if (!uidExists) {
        throw new Error(`No existe un usuario con la id ${id} en la base de datos`);
    }
};

module.exports = {
    emailExists,
    uidExists
};

const User = require('../models/user_model');

const validatePasswords = (req, res, next) => {
    const {password, password2} = req.body;

    if (!password) {
        return res.status(400).json({
            param: 'password',
            msg: 'Es obligatorio escribir una contraseña'
        })
    } else if (!password2) {
        return res.status(400).json({
            param: 'password2',
            msg: 'Debe repetir la contraseña'
        })
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            param: "password",
            msg: 'La contraseña debe tener más de 6 caracteres'
        })
    }

    if (password !== password2) {
        return res.status(400).json({
            param: "password2",
            msg: 'Las contraseñas deben ser identicas'
        })
    }
    
    next();
}

module.exports = {
    validatePasswords
}   
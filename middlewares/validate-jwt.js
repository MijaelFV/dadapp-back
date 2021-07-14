const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

const validateJWT = async(req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const user = await User.findById(uid)
        if (!user) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!user.active) {
            return res.status(401).json({
                msg: 'Token no valido - usuario deshabilitado'
            })
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validateJWT
}
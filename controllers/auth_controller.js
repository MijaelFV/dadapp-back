const bcryptjs = require('bcryptjs');
const User = require('../models/user_model');
const { generateJWT } = require("../helpers/generate-jwt");

const login = async(req, res) => {
    const {email, password}  = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                msg: 'Algunos de los datos no son correctos - email'
            })
        }

        // Si el user esta activo
        if (!user.active) {
            return res.status(400).json({
                msg: 'El usuario se encuentra deshabilitado'
            })
        }

        // Verificar la password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Algunos de los datos no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        const { name } = user;

        res.json({
            msg: 'Login ok',
            name,
            email,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }


}

module.exports = {
    login
}
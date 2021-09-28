const bcryptjs = require('bcryptjs');
const User = require('../models/user_model');
const { generateJWT } = require("../helpers/generate-jwt");

const loginRevalidate = async(req, res) => {
    try {
        const {_id: uid, name} = req.user;

        const token = await generateJWT(uid, name);

        const checkedUser = {
            token,
            uid,
            name
        }
        res.status(200).json({
            checkedUser
        });
    } catch (error) {
        console.log(error);
    }
} 

const login = async(req, res) => {
    const {email, password}  = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                param: "email",
                msg: 'El correo que ingresaste no existe.'
            })
        }

        // Verificar que el user este activo
        if (!user.active) {
            return res.status(400).json({
                param: "user",
                msg: 'El usuario se encuentra deshabilitado'
            })
        }

        // Verificar la password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                param: "password",
                msg: 'La contraseña que ingresaste es incorrecta'
            })
        }

        // Generar el JWT
        const token = await generateJWT(user.id, user.name);

        const loggedUser = {
            uid: user.id,
            name: user.name,
            email,
            token
        }
        res.json({
            loggedUser
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }


}

module.exports = {
    loginRevalidate,
    login
}
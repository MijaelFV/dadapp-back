const User = require('../models/user_model');
const bcryptjs = require('bcryptjs');

const userGetById = async(req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({_id: id, active: true})
            .select('-active')
    
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const userPut = async(req, res) => {
    try {
        const id = req.params.id
        const {name, email, password} = req.body;
    
        if (password) {
            // Encriptar la password
            const salt = bcryptjs.genSaltSync();
            password = bcryptjs.hashSync(password, salt);
        }
    
        await User.findByIdAndUpdate(id, {name, email, password});
    
        res.status(200).json({msg: "El usuario ha sido modificado con exito"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const userPost = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        const emailLowerCase = email.toLowerCase();
        const newUser = new User({name, emailLowerCase, password})

        // Encriptar la password
        const salt = bcryptjs.genSaltSync();
        newUser.password = bcryptjs.hashSync(password, salt);

        // Guardar en DB
        await newUser.save();

        res.status(201).json({msg: "El usuario ha sido creado con exito"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const userDelete = async(req, res) => {
    try {
        const id = req.params.id
    
        await User.findByIdAndUpdate(id, {active: false});

        res.status(200).json({msg: "El usuario se ha deshabilitado con exito"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

module.exports = {
    userGetById,
    userPut,
    userPost,
    userDelete
}
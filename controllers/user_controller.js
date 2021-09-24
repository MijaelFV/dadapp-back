const User = require('../models/user_model');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');

const userGetById = async(req, res) => {
    const id = req.params.id;

    const user = await User.findOne({_id: id, active: true})
        .select('-image -active')

    res.status(200).json(user)
}

const userGet = async(req, res) => {
    const resp = await User.find();
    
    res.json({
        resp
    })
}

const userPut = async(req, res) => {
    const id = req.params.id
    const {password, google, email, _id, active, ...rest} = req.body;

    if (password) {
        // Encriptar la password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, rest, {new: true});

    res.json({
        updatedUser
    })
}

const userPost = async(req, res) => {
    const {name, email: upperEmail, password, password2} = req.body;

    // Verificar que las dos contraseñas sean identicas
    if (password !== password2) {
        return res.status(400).json({
            param: "password2",
            msg: 'Las contraseñas deben ser identicas'
        })
    }

    const email = upperEmail.toLowerCase();
    const newUser = new User({name, email, password})

    // Encriptar la password
    const salt = bcryptjs.genSaltSync();
    newUser.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await newUser.save();

    // Generar nuestro JWT 
    const token = await generateJWT(newUser.uid, newUser.name);

    const createdUser = {
        uid: newUser._id,
        name,
        email,
        token
    }
    res.json({
        createdUser
    })
}

const userDelete = async(req, res) => {
    const id = req.params.id
    
    const deletedUser = await User.findByIdAndUpdate(id, {active: false}, {new: true});

    res.json({
        deletedUser
    })
}

const userRevalidate = async(req, res) => {
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
} 

module.exports = {
    userGetById,
    userGet,
    userPut,
    userPost,
    userDelete,
    userRevalidate
}
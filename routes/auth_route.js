const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginRevalidate } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login',[
    check('email', 'El correo ingresado no tiene un formato valido').isEmail(),
    check('password', 'La contraseña ingresada no es valida').not().isEmpty(),
    validateFields
], login);

router.get('/renew',[
    validateJWT
], loginRevalidate)

module.exports = router;
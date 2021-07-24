const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth_controller');
const { userRevalidate } = require('../controllers/user_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validateFields
], login);

router.get('/renew',[
    validateJWT
], userRevalidate)

module.exports = router;
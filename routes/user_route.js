const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete, userGetById } = require('../controllers/user_controller');
const { uidExists, emailExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id',[
    validateJWT,
    check('id', 'No es un ID de usuario valido').isMongoId(),
    validateFields
], userGetById);

router.get('/',[
    validateJWT,
    validateFields
], userGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de usuario valido').isMongoId(),
    check('id').custom(uidExists),
    validateFields
], userPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo ingresado no es valido').isEmail(),
    check('email').custom(emailExists),
    check('password', 'El contraseña debe tener más de 6 caracteres').isLength({min: 6}),
    check('password2', 'Debe escribir nuevamente la contraseña').not().isEmpty(),
    validateFields
], userPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de usuario valido').isMongoId(),
    validateFields
], userDelete);

module.exports = router;
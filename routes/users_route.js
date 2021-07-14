const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete } = require('../controllers/users_controller');
const { uidExists, emailExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', userGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de usuario valido').isMongoId(),
    check('id').custom(uidExists),
    validateFields
], userPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 caracteres').isLength({min: 6}),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(emailExists),
    validateFields
], userPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de usuario valido').isMongoId(),
    validateFields
], userDelete);

module.exports = router;
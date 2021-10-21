const { Router } = require('express');
const { check } = require('express-validator');
const { userPut, userPost, userDelete, userGetById } = require('../controllers/user_controller');
const { userExists, emailAvailable } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateOwnUser } = require('../middlewares/validate-ownUser');
const { validatePasswords } = require('../middlewares/validate-passwords');

const router = Router();

router.get('/:id',[
    validateJWT,
    check('id').custom(userExists),
    validateFields
], userGetById);

router.put('/:id',[
    validateJWT,
    check('id').custom(userExists),
    validateOwnUser,
    validateFields
], userPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo ingresado no tiene un formato valido').isEmail(),
    check('email').custom(emailAvailable),
    validatePasswords,
    validateFields
], userPost);

router.delete('/:id',[
    validateJWT,
    check('id').custom(userExists),
    validateOwnUser,
    validateFields
], userDelete);

module.exports = router;
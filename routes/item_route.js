const { Router } = require('express');
const { check } = require('express-validator');
const { itemPut, itemPost, itemDelete, itemGet } = require('../controllers/item_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], itemGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de objeto valido').isMongoId(),
    validateFields
], itemPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    validateFields
], itemPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de objeto valido').isMongoId(),
    validateFields
], itemDelete);

module.exports = router;
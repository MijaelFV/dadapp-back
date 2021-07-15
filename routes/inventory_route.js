const { Router } = require('express');
const { check } = require('express-validator');
const { inventoryPut, inventoryPost, inventoryDelete, inventoryGet } = require('../controllers/inventory_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], inventoryGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryPut);

router.post('/',[
    validateJWT,
    check('item', 'El item es obligatorio').not().isEmpty(),
    check('space', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('location', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    validateFields
], inventoryPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryDelete);

module.exports = router;
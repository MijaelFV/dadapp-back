const { Router } = require('express');
const { check } = require('express-validator');
const { inventoryLogsGetByArea, inventoryPut, inventoryPost, inventoryDelete, inventoryGet, inventoryGetBySpace } = require('../controllers/inventory_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/logs/:id',[
    validateJWT,
    check('id', 'No es un ID de area valida').isMongoId(),
    validateFields
], inventoryLogsGetByArea);

router.get('/',[
    validateJWT,
    validateFields
], inventoryGet);

router.get('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], inventoryGetBySpace);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryPut);

router.post('/',[
    validateJWT,
    check('item', 'El item es obligatorio').not().isEmpty(),
    check('space', 'El espacio es obligatorio').not().isEmpty(),
    check('column', 'Se necesita la columna obligatoriamente').not().isEmpty(),
    check('row', 'Se necesita la fila obligatoriamente').not().isEmpty(),
    check('area', 'Se necesita el area obligatoriamente').not().isEmpty(),
    validateFields
], inventoryPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryDelete);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { itemPut, itemPost, itemDelete, itemGetById, inventoryLogsGet, inventoryGetBySpace, inventoryGetByTaked, itemReturn } = require('../controllers/item_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id',[
    validateJWT,
    validateFields
], itemGetById);

router.get('/inventory/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryGetBySpace);

router.get('/taked/:id',[
    validateJWT,
    check('id', 'No es un ID de area valido').isMongoId(),
    validateFields
], inventoryGetByTaked);

router.get('/logs/:type/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryLogsGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de objeto valido').isMongoId(),
    check('area', 'Se necesita el area obligatoriamente').not().isEmpty(),
    validateFields
], itemPut);

router.put('/taked/return/:id',[
    validateJWT,
    check('id', 'No es un ID de objeto valido').isMongoId(),
    check('space', 'No es un ID de espacio valido').isMongoId(),
    check('column', 'Se necesita la columna obligatoriamente').not().isEmpty(),
    check('row', 'Se necesita la fila obligatoriamente').not().isEmpty(),
    validateFields
], itemReturn);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('column', 'Se necesita la columna obligatoriamente').not().isEmpty(),
    check('row', 'Se necesita la fila obligatoriamente').not().isEmpty(),
    check('space', 'El espacio es obligatorio').not().isEmpty(),
    check('area', 'Se necesita el area obligatoriamente').not().isEmpty(),
    validateFields
], itemPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de objeto valido').isMongoId(),
    validateFields
], itemDelete);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { itemPut, itemPost, itemRemove, itemGetById, inventoryLogsGet, inventoryGetBySpace, inventoryGetByTaked, itemReturn, itemDelete } = require('../controllers/item_controller');
const { areaExists, spaceExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateItem } = require('../middlewares/validate-item');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id',[
    validateJWT,
    validateItem,
    validateFields
], itemGetById);

router.get('/inventory/:id',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    validateFields
], inventoryGetBySpace);

router.get('/taked/:id',[
    validateJWT,
    check('id').custom(areaExists),
    validateFields
], inventoryGetByTaked);

router.get('/logs/:type/:id/:areaid?',[
    validateJWT,
    check('id', 'No es un ID de inventario valido').isMongoId(),
    check('type', 'No es un tipo de petición valido').not().isEmpty(),
    validateFields
], inventoryLogsGet);

router.put('/:id',[
    validateJWT,
    validateItem,
    check('area').custom(areaExists),
    validateFields
], itemPut);

router.put('/taked/return/:id',[
    validateJWT,
    validateItem,
    check('space').custom(spaceExists),
    check('column', 'Se necesita la columna obligatoriamente').not().isEmpty(),
    check('row', 'Se necesita la fila obligatoriamente').not().isEmpty(),
    validateFields
], itemReturn);

router.put('/remove/:id',[
    validateJWT,
    validateItem,
    check('area').custom(areaExists),
    check('type', 'Es necesario especificar el tipo de petición').not().isEmpty(),
    validateFields
], itemRemove);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('column', 'Se necesita la columna obligatoriamente').not().isEmpty(),
    check('row', 'Se necesita la fila obligatoriamente').not().isEmpty(),
    check('space').custom(spaceExists),
    check('area').custom(areaExists),
    validateFields
], itemPost);

router.delete('/:id',[
    validateJWT,
    validateItem,
    check('area').custom(areaExists),
    validateFields
], itemDelete);

module.exports = router;
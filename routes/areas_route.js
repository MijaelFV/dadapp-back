const { Router } = require('express');
const { check } = require('express-validator');
const { areaPut, areaPost, areaDelete, areaGet } = require('../controllers/areas_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], areaGet);

router.put('/:id',[
    validateJWT,
    validateFields
], areaPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rows', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('columns', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    validateFields
], areaPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], areaDelete);

module.exports = router;
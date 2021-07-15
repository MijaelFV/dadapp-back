const { Router } = require('express');
const { check } = require('express-validator');
const { objectPut, objectPost, objectDelete, objectGet } = require('../controllers/object_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], objectGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], objectPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rows', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('columns', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    validateFields
], objectPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], objectDelete);

module.exports = router;
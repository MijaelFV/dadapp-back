const { Router } = require('express');
const { check } = require('express-validator');
const { spacePut, spacePost, spaceDelete, spaceGet } = require('../controllers/space_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], spaceGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], spacePut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rows', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('columns', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    check('area', 'Se necesita el id del area obligatoriamente').not().isEmpty(),
    validateFields
], spacePost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], spaceDelete);

module.exports = router;
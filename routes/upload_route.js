const { Router } = require('express');
const { check } = require('express-validator');
const { imagePut } = require('../controllers/upload_controller');
const { permittedCollections } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateFiles } = require('../middlewares/validate-files');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.put('/:collection/:id', [
    validateJWT,
    validateFiles,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['users','items'])),
    validateFields
], imagePut)

module.exports = router;
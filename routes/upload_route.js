const { Router } = require('express');
const { check } = require('express-validator');
const { imagePost, imageGet, imagePut } = require('../controllers/upload_controller');
const { permittedCollections } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateFiles } = require('../middlewares/validate-files');

const router = Router();

router.post('/', validateFiles, imagePost)

router.put('/:collection/:id', [
    validateFiles,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['users','items'])),
    validateFields
], imagePut)

router.get('/:collection/:id', [
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['users','items'])),
    validateFields
], imageGet)

module.exports = router;
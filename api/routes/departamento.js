const router = require('express').Router()
const DeptoController = require('../controllers/DeptoController');

router.get('/', DeptoController.deptoList);
router.post('/', DeptoController.deptoCreate);
router.post('/:id', DeptoController.deptoUpdate);
router.delete('/:id', DeptoController.deptoDisable);

module.exports = router;
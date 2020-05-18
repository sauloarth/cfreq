const router = require('express').Router({ mergeParams: true })
const PontoController = require('../controllers/PontoController');

router.get('/', PontoController.pontoListByFuncionario);
router.post('/', PontoController.pontoCreate);
router.put('/:id', PontoController.pontoUpdate);
router.delete('/:id', PontoController.pontoDelete);

module.exports = router;
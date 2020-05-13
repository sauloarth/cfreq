const router = require('express').Router();
const AuthController = require('../controllers/AuthController')

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/confirm', AuthController.confirmEmail);
router.post('/resend', AuthController.resendConfirmOpt);

module.exports = router;
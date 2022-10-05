const router = require('express').Router();
const { signUp, logIn, getUsers } = require('../controllers/users');

router.post('/signUp', signUp);
router.post('/logIn', logIn);
router.get('/listAll', getUsers);

module.exports = router;
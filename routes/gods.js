const router = require('express').Router();
const {
    getGod,
    getGods,
    createGod,
    updateGod,
    deleteGod
} = require('../controllers/gods')
const auth = require('../config/auth')
const updateCreate = [auth.isPremium, auth.isAdmin]

router.get('/', getGods);
router.get('/:id', getGod);
router.post('/', auth.isPremium, createGod);
router.patch('/:id', auth.isPremium, updateGod);
router.delete('/:id', auth.isAdmin, deleteGod);

module.exports = router;
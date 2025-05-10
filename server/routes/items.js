
const { addItem, getItems, deleteItem, assignAccountToItem } = require('../controllers/item');

const router = require('express').Router();


router.post('/add-item', addItem)
    .get('/get-item', getItems)
    .delete('/delete-item/:id', deleteItem)
    .patch('/assign-account/:itemId', assignAccountToItem);

    
router.get('/test-controller', (req, res) => {
        res.send('✅ Controller loaded');
    });
module.exports = router;
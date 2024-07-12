const { addItem, getItems, deleteItem } = require('../controllers/item');

const router = require('express').Router();


router.post('/add-item', addItem)
    .get('/get-item', getItems)
    .delete('/delete-item/:id', deleteItem)
  

module.exports = router;
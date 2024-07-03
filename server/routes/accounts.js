const { addAccount, getAccount, deleteAccount } = require ('../controllers/account.js');

const router = require('express').Router();


router.post('/add-account', addAccount)
    .get('/get-account', getAccount)
    .delete('/delete-account/:id', deleteAccount)
  

module.exports = router;
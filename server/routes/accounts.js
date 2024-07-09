const { addAccount, getAccount, deleteAccount, transferBalance } = require ('../controllers/account.js');

const router = require('express').Router();


router.post('/add-account', addAccount)
    .get('/get-account', getAccount)
    .delete('/delete-account/:id', deleteAccount)
    .post('/transfer', transferBalance);
  

module.exports = router;
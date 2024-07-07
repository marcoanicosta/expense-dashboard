const { addIncome, getIncome, deleteIncome, getUpcomingRecurringTransactions } = require ('../controllers/income');
const { addExpense, getExpense, deleteExpense } = require ('../controllers/expense');

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-income', getIncome)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expense', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .get('/upcoming-recurring-transactions', getUpcomingRecurringTransactions);




module.exports = router;
const Account = require("../models/accountsModel");
const CreditAccount = require('../models/creditAccountModel');
const LoanAccount = require('../models/loanAccountModel');
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');



exports.addAccount = async (req, res) => {
        const { account_name, balance, type, creditLimit, loanLimit, apr, description } = req.body;


        let account;

        if (type === 'credit') {
            account = new CreditAccount({
                account_name,
                balance,
                type,
                creditLimit,
                apr,
                description
            });
        } // Add this closing brace
        
        if (type === 'loan') {
            account = new LoanAccount({
                account_name,
                balance,
                type,
                loanLimit,
                apr,
                description
            });
        } else {
            account = new Account({
                account_name,
                balance,
                type,
                //description
            });
        }



        try {
            // validations
            if (!account_name || !type) {
                return res.status(400).json({ message: 'Account name and type are required' });
            }
            if (balance === undefined || typeof balance !== "number") {
                return res.status(400).json({ message: 'Balance must be a valid number' });
            }
            if (type === 'credit' && (balance > 0 || balance < -creditLimit)) {
                return res.status(400).json({ message: 'Credit account balance must be zero or negative and within the credit limit' });
            }
            if (type === 'loan' && (balance > 0 || balance < -loanLimit)) {
                return res.status(400).json({ message: 'Loan account balance must be zero or negative and within the loan limit' });
            }

            await account.save(); // save the data to the database
            res.status(200).json({ message: 'Account added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
exports.getAccount = async (req, res) => { 
    try {
        const accounts = await Account.find().sort({ createdAt: -1 }); //sort the data in descending order
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}
exports.deleteAccount = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Delete all associated incomes
        await Income.deleteMany({ account: id });
        // Delete all associated expenses
        await Expense.deleteMany({ account: id });

        // Delete the account
        await Account.findByIdAndDelete(id);

        res.status(200).json({ message: 'Account and associated transactions deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

//Updated to handle cascading delete
exports.transferBalance = async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;

    try {
        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findById(toAccountId);

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (fromAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance in the source account' });
        }

        // Deduct the amount from the fromAccount
        fromAccount.balance -= amount;
        // Create an expense transaction for the fromAccount
        const expenseDescription = `Transfer to ${toAccount.account_name}`.slice(0, 20); // Ensure description fits
        const expense = new Expense({
            title: 'Transfer to ' + toAccount.account_name,
            amount,
            type: 'expense',
            date: new Date(),
            category: 'Transfer',
            description: expenseDescription,
            account: fromAccountId
        });
        await expense.save();

        // Add the expense ID to the fromAccount's expenses array
        fromAccount.expenses.push(expense._id);
        await fromAccount.save();

        // Add the amount to the toAccount
        toAccount.balance += amount;
        // Create an income transaction for the toAccount
        const incomeDescription = `Transfer from ${fromAccount.account_name}`.slice(0, 20); // Ensure description fits
        const income = new Income({
            title: 'Transfer from ' + fromAccount.account_name,
            amount,
            type: 'income',
            date: new Date(),
            category: 'Transfer',
            description: incomeDescription,
            account: toAccountId
        });
        await income.save();

        // Add the income ID to the toAccount's incomes array
        toAccount.incomes.push(income._id);
        await toAccount.save();

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        console.error('Error during transfer:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
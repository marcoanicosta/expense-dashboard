const Accounts = require('../models/accountsModel'); 
const CreditAccount = require('../models/creditAccountModel'); 
const Income = require('../models/incomeModel'); 
const { getNextOccurrence } = require('../utils/utils');

// TODO: v1
exports.addIncome = async (req, res) => {
    const { title, amount, type, date, category, description, accountId, recurrence } = req.body;

    const income = new Income({
        title,
        amount,
        type,
        date,
        category,
        description,
        account: accountId,
        recurrence: recurrence ? {
            frequency: recurrence.frequency,
            startDate: recurrence.startDate,
            endDate: recurrence.endDate || null
        } : undefined
    }); // create a new instance of the Income model

    try {
        // validations
        if (!title || !date || !category || !description || !accountId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount < 0 || typeof amount !== "number") {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const savedIncome = await income.save(); // save the data to the database

        // Find the account and update it with the new income
        let account = await Accounts.findById(accountId);
        if (account.type === 'credit') {
            account = await CreditAccount.findById(accountId);
        }
        
        await account.updateBalanceAfterAddingIncome(savedIncome._id);

        res.status(200).json({ message: 'Income added successfully', income: savedIncome });
    } catch (error) {
        console.error('Server Error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getIncome = async (req, res) => { 
    try {
        const incomes = await Income.find().sort({ createdAt: -1 }); // Sort the data in descending order
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Server Error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
}


exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    console.log(id, "MY ID 🚨");

    try {
        // Find the income to be deleted
        const income = await Income.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Find the account associated with this income
        const account = await Accounts.findById(income.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Delete the income
        await Income.findByIdAndDelete(id);

        // Remove the income from the account's incomes array
        account.incomes = account.incomes.filter(incomeId => incomeId.toString() !== id);

        // Update the account's balance
        await account.updateBalanceAfterRemovingIncome(id); // Ensure this method exists and works as expected

        res.status(200).json({ message: 'Income deleted and account updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getUpcomingIncomes = async (req, res) => {
    try {
        const now = new Date();
        const upcomingIncomes = [];

        const incomes = await Income.find({
            'recurrence.frequency': { $exists: true },
            'recurrence.startDate': { $lte: now },
            $or: [
                { 'recurrence.endDate': { $gte: now } },
                { 'recurrence.endDate': null }
            ]
        });

        for (const income of incomes) {
            let nextOccurrence = income.date;
            while (nextOccurrence <= now) {
                nextOccurrence = getNextOccurrence(income.recurrence.frequency, nextOccurrence);
            }
            upcomingIncomes.push({
                ...income._doc,
                nextOccurrence
            });
        }

        res.status(200).json(upcomingIncomes);
    } catch (error) {
        console.error('Error retrieving upcoming recurring incomes:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
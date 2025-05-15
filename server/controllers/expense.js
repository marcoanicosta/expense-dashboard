const Expense = require("../models/expenseModel");
const Accounts = require("../models/accountsModel");
const Item = require('../models/itemModel');
const { getNextOccurrence } = require('../utils/utils');

exports.addExpense = async (req, res) => {
    const { title, amount, type, date, category, description, accountId, recurrence, fuelItemId, litres, location, carName, fuelType } = req.body;

    // if fuelItemId provided, derive realAccountId from that item
    let realAccountId = accountId;
    if (fuelItemId) {
      const fuelItem = await Item.findById(fuelItemId);
      if (!fuelItem) {
        return res.status(404).json({ message: 'Fuel item not found' });
      }
      realAccountId = fuelItem.account;
    }

    // Build base expense data
    const expenseData = {
      title,
      amount,
      type,
      date,
      category,
      description,
      account: realAccountId
    };

    // Attach recurrence if present
    if (recurrence) {
      expenseData.recurrence = {
        frequency: recurrence.frequency,
        startDate: recurrence.startDate,
        endDate: recurrence.endDate || null
      };
    }

    // Attach fuel-specific extra fields if this is a fuel expense
    if (category === 'fuel') {
      expenseData.extra = { litres, location, carName, fuelType };
    }

    const expense = new Expense(expenseData);

    try {
        // Validations
        if (!title || !date || !category || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount <= 0 || typeof amount !== "number") {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const savedExpense = await expense.save(); // Save the data to the database

        // — if this expense belongs to a fuel‐item, link it back to that Item
       if (fuelItemId) {
            const item = await Item.findById(fuelItemId);
            if (item) {
                item.expenses.push(savedExpense._id);
                await item.save();
                // recalc completionDate on the item
                // await item.updateCompletionDate();
            }
        }

        // Only update an account balance if we have a realAccountId
        if (realAccountId) {
            const account = await Accounts.findById(realAccountId);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            await account.updateBalanceAfterAddingExpense(savedExpense._id);
        }

        res.status(200).json({ message: 'Expense added successfully', expense: savedExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.getExpense = async (req, res) => { 
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 }); // Sort the data in descending order
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.deleteExpense = async (req, res) => {
    const { id } = req.params; // Get the id from the request parameters
    console.log(id);
    
    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const account = await Accounts.findById(expense.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await Expense.findByIdAndDelete(id);

        account.expenses = account.expenses.filter(expenseId => expenseId.toString() !== id);

        await account.updateBalanceAfterDeletingExpense(id);

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// You can add other functions similar to the income controller to handle recurring transactions if needed.
exports.getUpcomingExpenses = async (req, res) => {
    try {
        const now = new Date();
        const upcomingExpenses = [];

        const expenses = await Expense.find({
            'recurrence.frequency': { $exists: true },
            'recurrence.startDate': { $lte: now },
            $or: [
                { 'recurrence.endDate': { $gte: now } },
                { 'recurrence.endDate': null }
            ]
        });

        for (const expense of expenses) {
            let nextOccurrence = expense.date;
            while (nextOccurrence <= now) {
                nextOccurrence = getNextOccurrence(expense.recurrence.frequency, nextOccurrence);
            }
            upcomingExpenses.push({
                ...expense._doc,
                nextOccurrence
            });
        }

        res.status(200).json(upcomingExpenses);
    } catch (error) {
        console.error('Error retrieving upcoming recurring expenses:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
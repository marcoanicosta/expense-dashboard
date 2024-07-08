const Expense = require("../models/ExpenseModel");
const Accounts = require("../models/accountsModel");

const getNextOccurrence = (frequency, lastDate) => {
    const nextDate = new Date(lastDate);

    switch (frequency) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            throw new Error('Invalid frequency');
    }

    return nextDate;
};

exports.addExpense = async (req, res) => {
    const { title, amount, type, date, category, description, accountId, recurrence } = req.body;

    const expense = new Expense({
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
    });

    try {
        // Validations
        if (!title || !date || !category || !description || !accountId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount <= 0 || typeof amount !== "number") {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const savedExpense = await expense.save(); // Save the data to the database
        const account = await Accounts.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await account.updateBalanceAfterAddingExpense(savedExpense._id);

        res.status(200).json({ message: 'Expense added successfully', expense: savedExpense });
    } catch (error) {
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
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const account = await Accounts.findById(deletedExpense.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await account.updateBalanceAfterDeletingExpense(id);

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// You can add other functions similar to the income controller to handle recurring transactions if needed.
exports.getUpcomingRecurringTransactions = async (req, res) => {
    try {
        const now = new Date();
        const upcomingTransactions = [];

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
            upcomingTransactions.push({
                ...income._doc,
                nextOccurrence
            });
        }

        res.status(200).json(upcomingTransactions);
    } catch (error) {
        console.error('Error retrieving upcoming recurring transactions:', error);
        res.status(500).json({ message: 'Server Errors' });
    }
};
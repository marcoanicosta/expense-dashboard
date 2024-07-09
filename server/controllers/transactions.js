// controllers/transactionsController.js
const { getNextOccurrence } = require('../utils/utils');
const Income = require('../models/incomeModel');
const Expense = require("../models/ExpenseModel");

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

        const expenses = await Expense.find({
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

        for (const expense of expenses) {
            let nextOccurrence = expense.date;
            while (nextOccurrence <= now) {
                nextOccurrence = getNextOccurrence(expense.recurrence.frequency, nextOccurrence);
            }
            upcomingTransactions.push({
                ...expense._doc,
                nextOccurrence
            });
        }

        res.status(200).json(upcomingTransactions);
    } catch (error) {
        console.error('Error retrieving upcoming recurring transactions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// recurrenceUtils.js
const Income = require("../models/incomeModel");
const Expense = require("../models/ExpenseModel");

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

const getUpcomingRecurringTransactions = async () => {
    const now = new Date();

    const upcomingIncomes = await Income.find({
        'recurrence.frequency': { $exists: true },
        'recurrence.startDate': { $lte: now },
        $or: [
            { 'recurrence.endDate': { $gte: now } },
            { 'recurrence.endDate': null }
        ]
    });

    const upcomingExpenses = await Expense.find({
        'recurrence.frequency': { $exists: true },
        'recurrence.startDate': { $lte: now },
        $or: [
            { 'recurrence.endDate': { $gte: now } },
            { 'recurrence.endDate': null }
        ]
    });

    return {
        upcomingIncomes,
        upcomingExpenses
    };
};

module.exports = {
    getNextOccurrence,
    getUpcomingRecurringTransactions
};
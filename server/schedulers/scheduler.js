const cron = require('node-cron');
const mongoose = require('mongoose');
const Account = require('../models/accountsModel'); // Adjust the path if necessary
const Income = require('../models/incomeModel'); // Adjust the path if necessary
const Expense = require('../models/ExpenseModel'); // Adjust the path if necessary
const logger = require('./logger');
const db = require('../db/db'); 

// Function to handle recurring transactions
const handleRecurringTransactions = async () => {
    try {
        logger.info('Running handleRecurringTransactions at', new Date().toISOString());
        
        const now = new Date();
        const incomes = await Income.find({ 
            'recurrence.frequency': { $exists: true },
            'recurrence.startDate': { $lte: now },
            $or: [
                { 'recurrence.endDate': { $gte: now } },
                { 'recurrence.endDate': null }
            ]
        });

        for (const income of incomes) {
            // Calculate the next occurrence
            const nextOccurrence = getNextOccurrence(income.recurrence.frequency, income.date);
            if (nextOccurrence <= now) {
                // Clone the income with the new date
                const newIncome = new Income({
                    title: income.title,
                    amount: income.amount,
                    type: income.type,
                    date: nextOccurrence,
                    category: income.category,
                    description: income.description,
                    account: income.account,
                    recurrence: income.recurrence
                });

                await newIncome.save();

                // Update the account balance
                const account = await Account.findById(income.account);
                if (account) {
                    await account.updateBalanceAfterAddingIncome(newIncome._id);
                    logger.info(`Recurring income added for account: ${income.account}`);
                } else {
                    logger.error(`Account not found for recurring income: ${income.account}`);
                }
            }
        }
        logger.info('Completed handleRecurringTransactions');
    } catch (error) {
        logger.error('Error handling recurring transactions:', error);
    }
};

// Function to calculate the next occurrence based on the frequency
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

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', handleRecurringTransactions);

module.exports = handleRecurringTransactions;
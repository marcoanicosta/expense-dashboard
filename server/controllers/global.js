// globalController.js
const { getUpcomingRecurringTransactions } = require('../utils/recurrenceUtils');

exports.getUpcomingTransactions = async (req, res) => {
    try {
        const { upcomingIncomes, upcomingExpenses } = await getUpcomingRecurringTransactions();
        res.status(200).json({ upcomingIncomes, upcomingExpenses });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
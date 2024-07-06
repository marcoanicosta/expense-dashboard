const mongoose = require('mongoose');

const RecurrenceSchema = new mongoose.Schema({
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false // Optional end date
    }
}, { _id : false }); // Prevent creating an _id field for this subdocument

const IncomeSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    type: String,
    date: Date,
    category: String,
    description: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    recurrence: RecurrenceSchema
}, {timestamps: true});

const ExpenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    type: String,
    date: Date,
    category: String,
    description: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    recurrence: RecurrenceSchema
}, {timestamps: true});

module.exports = {
    Income: mongoose.model('Income', IncomeSchema),
    Expense: mongoose.model('Expense', ExpenseSchema)
};
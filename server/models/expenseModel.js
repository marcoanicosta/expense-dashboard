const mongoose = require('mongoose');


const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    },
    type: {
        type: String,
        default: 'expense',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        trim: true
    },
    category: {
        type: String,
        required: true,
        default: 'Misc',
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength:  20,
        default: '—', maxLength: 20,
        trim: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    recurrence: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: false
        },
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    }
}, {timestamps: true});

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
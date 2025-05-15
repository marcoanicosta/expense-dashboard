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
        required: true
    },
    type: {
        type: String,
        default: 'expense',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
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
        default: '—',
        maxLength: 20,
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
    },
    extra: {
        litres: {
            type: Number,
            required: false
        },
        location: {
            type: String,
            required: false,
            trim: true
        },
        carName: {
            type: String,
            required: false,
            trim: true
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'electric'],
            required: false
        }
    }
}, {timestamps: true});

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
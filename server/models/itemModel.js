const mongoose = require('mongoose');
const Expense = require('./expenseModel');

const ItemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    price: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true,
        default: 0,
        min: 0,
    },
    category: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: '',
        maxLength: 50
    },
    // fuel details at root
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric'],
        default: null,
        trim: true
    },
    litres: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: '',
        trim: true
    },
    carName: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        enum: ['standard','fuel'],
        required: true,
        default: 'standard',
        trim: true
    },
    due_date: { 
        type: Date,
        required: false,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false // Optional for non-credit purchases
    },
    instalments: {
        type: Number,
        required: false,
        maxLength: 20,
        trim: true,
        default: 0,
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
    completionDate: {
        type: Date,
        required: false,
    },
}, { timestamps: true });

ItemSchema.methods.updateCompletionDate = async function() {
    const totalExpenses = await Expense.aggregate([
        { $match: { _id: { $in: this.expenses } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalPaid = totalExpenses[0] ? totalExpenses[0].total : 0;

    if (totalPaid >= this.price) {
        this.completionDate = new Date();
    } else {
        this.completionDate = null;
    }

    await this.save();
};

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

module.exports = Item;

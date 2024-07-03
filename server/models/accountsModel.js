const mongoose = require('mongoose');


const AccountSchema = new mongoose.Schema({
    account_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    balance: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true,
        default: 0,
    },
    type: {
        type: String,
        required: true,
        enum: ['normal', 'cash', 'savings', 'credit'], // Add other types as needed
        default: 'normal'
    },
    // date: {
    //     type: Date,
    //     required: true,
    //     trim: true
    // },
    // category: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // description: {
    //     type: String,
    //     required: true,
    //     maxLength:  20,
    //     trim: true
    // },
    incomes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Income'
    }],
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expense'
    }]
}, {timestamps: true});

// Method to calculate the balance
AccountSchema.methods.calculateBalance = async function() {
    const incomeDocs = await mongoose.model('Income').find({ _id: { $in: this.incomes } });
    const expenseDocs = await mongoose.model('expense').find({ _id: { $in: this.expenses } });

    const totalIncome = incomeDocs.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenseDocs.reduce((sum, expense) => sum + expense.amount, 0);

    return totalIncome - totalExpense;
};

module.exports = mongoose.model('Accounts', AccountSchema);


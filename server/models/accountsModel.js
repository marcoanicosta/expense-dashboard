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

    incomes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Income'
    }],
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }]
}, {timestamps: true});

// Method to calculate the balance
AccountSchema.methods.calculateBalance = async function() {
    const incomeDocs = await mongoose.model('Income').find({ _id: { $in: this.incomes } });
    const expenseDocs = await mongoose.model('Expense').find({ _id: { $in: this.expenses } });

    const totalIncome = incomeDocs.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenseDocs.reduce((sum, expense) => sum + expense.amount, 0);

    return totalIncome - totalExpense;
};

// Middleware to update balance before saving
AccountSchema.pre('save', async function(next) {
    this.balance = await this.calculateBalance();
    next();
});

// Middleware to update balance after adding income
AccountSchema.methods.updateBalanceAfterAddingIncome = async function(incomeId) {
    this.incomes.push(incomeId);
    this.balance = await this.calculateBalance();
    await this.save();
};

// Middleware to update balance after adding expense
AccountSchema.methods.updateBalanceAfterAddingExpense = async function(expenseId) {
    this.expenses.push(expenseId);
    this.balance = await this.calculateBalance();
    await this.save();
    console.log("ALERT 🚨")
};

// Middleware to update balance after removing income
AccountSchema.methods.updateBalanceAfterRemovingIncome = async function(incomeId) {
    this.incomes.pull(incomeId);
    this.balance = await this.calculateBalance();
    await this.save();
    console.log("ALERT 🚨")
    console.log("ALERT 🚨", this.incomes, this.balance)
};

// Middleware to update balance after removing expense
AccountSchema.methods.updateBalanceAfterRemovingExpense = async function(expenseId) {
    this.expenses.pull(expenseId);
    this.balance = await this.calculateBalance();
    await this.save();
};


module.exports = mongoose.model('Accounts', AccountSchema);


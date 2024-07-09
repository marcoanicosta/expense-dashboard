const mongoose = require('mongoose');
const Account = require('./accountsModel'); // Adjust the path as necessary

const CreditAccountSchema = new mongoose.Schema({
    creditLimit: {
        type: Number,
        required: true,
        default: 0,
        // Ensure that the balance doesn't exceed the credit limit
        validate: {
            validator: function(value) {
                return this.balance <= 0 && this.balance >= -value;
            },
            message: 'Balance must be between -{VALUE} and 0'
        }
    },
    apr: {
        type: Number,
        required: false // Make this required if you need it in the future
    }
});

module.exports = Account.discriminator('CreditAccount', CreditAccountSchema);
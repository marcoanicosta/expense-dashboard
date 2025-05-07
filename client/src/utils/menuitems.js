import {dashboard, expenses, transactions, trend, freelance} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Accounts",
        icon: freelance,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Income",
        icon: trend,
        link: "/dashboard",

    },
    {
        id: 5,
        title: "Expenses",
        icon: expenses,
        link: "/dashboard",

    },
    {
        id: 6,
        title: "Upcoming Transactions",
        icon: expenses,
        link: "/dashboard",

    },
    {
        id: 7,
        title: "Account Transfer",
        icon: expenses,
        link: "/dashboard",

    },
    {
        id: 8,
        title: "Items",
        icon: transactions,
        link: "/dashboard",

    },
    {
        id: 9,
        title: 'Credit',
        icon: <i className="fas fa-credit-card"></i>
    }
]
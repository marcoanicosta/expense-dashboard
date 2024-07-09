import React, { useState } from 'react';
import { useGlobalContext } from '../../contexts/globalContexts';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';


// const Transfers = () => {
//     const { accounts, transferBalance, error } = useGlobalContext();
//     const [fromAccountId, setFromAccountId] = useState('');
//     const [toAccountId, setToAccountId] = useState('');
//     const [amount, setAmount] = useState('');

//     const handleTransfer = async (e) => {
//         e.preventDefault();
//         await transferBalance(fromAccountId, toAccountId, parseFloat(amount));
//     };

//     return (
//         <div>
            // <h1>Transfer Balance</h1>
            // {error && <p>{error}</p>}
            // <form onSubmit={handleTransfer}>
            //     <div>
            //         <label>From Account:</label>
            //         <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)}>
            //             <option value="">Select Account</option>
            //             {accounts.map(account => (
            //                 <option key={account._id} value={account._id}>{account.name}</option>
            //             ))}
            //         </select>
            //     </div>
            //     <div>
            //         <label>To Account:</label>
            //         <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
            //             <option value="">Select Account</option>
            //             {accounts.map(account => (
            //                 <option key={account._id} value={account._id}>{account.name}</option>
            //             ))}
            //         </select>
            //     </div>
            //     <div>
            //         <label>Amount:</label>
            //         <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            //     </div>
            //     <button type="submit">Transfer</button>
            // </form>
        // </div>
//     );
// };


// // const TransferStyled = styled.div`
// //     display: flex;
// //     overflow: auto;
// //     .error {
// //         color: red;
// //     }
// //     form {
// //         display: flex;
// //         flex-direction: column;
// //         gap: 1rem;
// //         .form-group {
// //             display: flex;
// //             flex-direction: column;
// //         }
// //         button {
// //             padding: 0.5rem;
// //             background: var(--color-green);
// //             color: white;
// //             border: none;
// //             cursor: pointer;
// //             &:hover {
// //                 background: var(--color-dark-green);
// //             }
// //         }
// //     }
// // `;

// export default Transfers;

function Transfers() {
    const { accounts, transferBalance, error } = useGlobalContext();
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransfer = (e) => {
        e.preventDefault();
        transferBalance(fromAccountId, toAccountId, parseFloat(amount));
    };

    return (
        <TransferStyled>
            <InnerLayout>
                <h1>Transfer Balance</h1>
                {error && <p className="error">{error.message}</p>}
                <form onSubmit={handleTransfer}>
                    <div className="form-group">
                        <label>From Account</label>
                        <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)}>
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account._id} value={account._id}>{account.account_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>To Account</label>
                        <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account._id} value={account._id}>{account.account_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button type="submit">Transfer</button>
                </form>

                
                {/* <h1>Transfer Balance</h1>
                {error && <p>{error}</p>}
                <form onSubmit={handleTransfer}>
                    <div>
                        <label>From Account:</label>
                        <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)}>
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account._id} value={account._id}>{account.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>To Account:</label>
                        <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account._id} value={account._id}>{account.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button type="submit">Transfer</button>
                </form> */}
            </InnerLayout>
        </TransferStyled>
    );
}

const TransferStyled = styled.div`
    display: flex;
    overflow: auto;
    .error {
        color: red;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .form-group {
            display: flex;
            flex-direction: column;
        }
        button {
            padding: 0.5rem;
            background: var(--color-green);
            color: white;
            border: none;
            cursor: pointer;
            &:hover {
                background: var(--color-dark-green);
            }
        }
    }
`;

export default Transfers;
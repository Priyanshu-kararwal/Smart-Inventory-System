import { useEffect, useState } from "react";
import request from "../services/api";

function History() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await request(
                    "/inventory/history"
                );

                setTransactions(
                    data.transactions || []
                );
            } catch (error) {
                console.error(error);
            }
        };

        loadHistory();
    }, []);

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Transaction History</h1>
                    <p>
                        Complete history of inventory movements
                    </p>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Note</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((item) => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>

                                <td>
                                    {item.product_name}
                                </td>

                                <td>
                                    <span
                                        className={
                                            item.transaction_type ===
                                            "IN"
                                                ? "badge badge-in"
                                                : "badge badge-out"
                                        }
                                    >
                                        {
                                            item.transaction_type
                                        }
                                    </span>
                                </td>

                                <td>{item.quantity}</td>

                                <td>
                                    {item.note || "-"}
                                </td>

                                <td>
                                    {new Date(
                                        item.created_at
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {transactions.length === 0 && (
                    <p className="empty">
                        No transactions found.
                    </p>
                )}
            </div>
        </>
    );
}

export default History;
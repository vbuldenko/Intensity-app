import { useSelector } from 'react-redux';

import {
    RectangleStackIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export default function AdminOverview() {
    const soldAbonements = useSelector(({ abonements }) => abonements);
    const statistics = useSelector(({ statistics }) => statistics);
    const expenses = {
        rent: 30000,
        utilities: 1500,
        taxes: 1340,
        salary: 2400,
    };

    return (
        <div className="admin-metrics-data">
            <div className="sales">
                <div className="sales-header">
                    <div className="title">Sales</div>
                    <div className="sales-selector">
                        <button>
                            <RectangleStackIcon className="h-4 w-4" />
                            All
                        </button>
                        <div className="divider"></div>
                        <button>
                            <CalendarDaysIcon className="h-4 w-4" />
                            Today
                        </button>
                    </div>
                </div>
                <div className="metrics">
                    <p className="sale-name">client</p>
                    <p className="sale-date">date</p>
                    <p className="sale-abonement">abonement</p>
                    <p className="sale-price">price</p>
                </div>
                {soldAbonements.map((sale) => (
                    <div key={sale.id} className="sale-data">
                        <p className="sale-name">
                            {sale.user.name} {sale.user.surname}
                        </p>
                        <p className="sale-date">
                            {sale.purchase_date.slice(0, 10)}
                        </p>
                        <p className="sale-abonement">{sale.amount}</p>
                        <p className="sale-price">₴{sale.price}</p>
                    </div>
                ))}
            </div>
            <div className="income">
                <div className="income-header">
                    <p className="title">Income</p>
                </div>
                <div className="metrics">
                    <p className="income-total">Total</p>
                    <p className="income-month">Monthly</p>
                    <p className="income-day">Daily</p>
                </div>

                <div className="income-data">
                    <p>{statistics.monthlyIncome}</p>
                    <p>{statistics.monthlyIncome}</p>
                    <p>{statistics.dailyIncome}</p>
                </div>
                <div className="income-additional">
                    <p>Total number of abonements sold</p>
                    <p>{statistics.totalAbonementSales}</p>
                </div>
            </div>
            <div className="expenses">
                <div className="expenses-header">
                    <p className="title">Expenses</p>
                </div>
                <div className="metrics">
                    <p className="expenses-rent">Rent</p>
                    <p className="expenses-utilities">Utilities</p>
                    <p className="expenses-taxes">Taxes</p>
                    <p className="expenses-salary">Salary</p>
                    <p className="expenses-total">Total</p>
                </div>

                <div className="expenses-data">
                    <p> {expenses.rent}</p>
                    <p> {expenses.utilities}</p>
                    <p> {expenses.taxes}</p>
                    <p> {expenses.salary}</p>
                    <p>
                        {' '}
                        ₴
                        {Object.values(expenses).reduce(
                            (total, expense) => total + expense,
                            0
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

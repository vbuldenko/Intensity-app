import '../styles/overview.css';
import { useSelector } from 'react-redux';
import { startOfToday, format } from 'date-fns';

export default function AdminOverview() {
    const user = useSelector(({ user }) => user);
    const soldAbonements = useSelector(({ abonements }) => abonements);
    const statistics = useSelector(({ statistics }) => statistics);

    const expenses = {
        rent: 30000,
        utilities: 1500,
        taxes: 1340,
        salary: 2400,
    };

    console.log('Admin overview');

    if (!user) {
        return null;
    }
    const { name, surname, role } = user;

    let today = format(startOfToday(), 'dd-MMM-yyyy');
    return (
        <div className="admin-overview">
            <div className="admin-user">
                {/* <img className="user-img" src={user.img} /> */}
                <div>
                    <p className="admin-user-name">
                        {name} {surname}
                    </p>
                    <span>{role}</span>
                </div>
                <p className="admin-user-date">{today}</p>
            </div>
            <div className="sales">
                <div className="sales-header">
                    <p className="title">Sales</p>
                    <select id="view" name="view">
                        <option value="all">View All</option>
                        <option value="today">Today</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
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

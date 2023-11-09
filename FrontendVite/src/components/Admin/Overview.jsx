import '../styles/overview.css';
import { useSelector } from 'react-redux';
import { startOfToday, format } from 'date-fns';

import { user, income, expenses, saleData } from '../../test_data/data';

export default function Overview() {
    const user = useSelector(({ user }) => user);
    const soldAbonements = useSelector(({ abonements }) => abonements);
    const statistics = useSelector(({ statistics }) => statistics);
    if (!user) {
        return null;
    }
    const { name, surname, role } = user;

    let today = format(startOfToday(), 'dd-MMM-yyyy');
    return (
        <div className="overview">
            <div className="user">
                {/* <img className="user-img" src={user.img} /> */}
                <div>
                    <p className="user-name">
                        {name} {surname}
                    </p>
                    <span>{role}</span>
                </div>
                <p className="user-date">{today}</p>
            </div>

            <div className="income">
                <div>
                    <p>Total income</p>
                    <p>{statistics.totalIncome}</p>
                </div>
                <div>
                    <p>Monthly income</p>
                    <p>{statistics.monthlyIncome}</p>
                </div>
                <div>
                    <p>Daily income</p>
                    <p>{statistics.dailyIncome}</p>
                </div>
                <div>
                    <p>Total number of abonements sold</p>
                    <p>{statistics.totalAbonementSales}</p>
                </div>
            </div>

            <div className="expenses">
                <div>
                    <p>Rent</p>
                    <p> ₴{expenses.rent}</p>
                </div>
                <div>
                    <p>Utilities</p>
                    <p> ₴{expenses.utilities}</p>
                </div>
                <div>
                    <p>Taxes</p>
                    <p> ₴{expenses.taxes}</p>
                </div>
                <div className="t-salary">
                    {expenses.salary.map((element) => (
                        <div key={element.id}>
                            <p>{element.name}</p>
                            <p>₴{element.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sales">
                <div>
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
        </div>
    );
}

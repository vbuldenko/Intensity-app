import '../styles/overview.css';
import anzhphoto from '../../images/anzhel.jpg';

export default function Overview() {
    const user = {
        img: anzhphoto,
        name: 'Anzhelika Morozova',
        type: 'owner',
        date: '21 Aug 2023',
    };
    const income = [
        { id: 1, title: 'Total income', amount: 30000 },
        { id: 2, title: 'Income of a day', amount: 1500 },
        { id: 3, title: 'Total abonement sales', amount: 10 },
        { id: 4, title: 'Profit', amount: 0 },
    ];
    const expenses = {
        rent: 30000,
        utilities: 1500,
        taxes: 1340,
        salary: [
            { id: 1, name: 'Nastya Babiychuk', amount: 1500 },
            { id: 2, name: 'Lera Narozhna', amount: 1000 },
            { id: 3, name: 'Nastya Tkachuk', amount: 1500 },
        ],
    };
    const saleData = [
        {
            name: 'Vitaliy Klichko',
            date: '24.08.23',
            abonement: 8,
            price: 2000,
        },
        {
            name: 'Vitaliy Klichko',
            date: '24.08.23',
            abonement: 8,
            price: 2000,
        },
        {
            name: 'Vitaliy Klichko',
            date: '24.08.23',
            abonement: 8,
            price: 2000,
        },
        {
            name: 'Vitaliy Klichko',
            date: '24.08.23',
            abonement: 8,
            price: 2000,
        },
        {
            name: 'Vitaliy Klichko',
            date: '24.08.23',
            abonement: 8,
            price: 2000,
        },
    ];

    return (
        <div className="overview">
            <div className="user">
                <img className="user-img" src={user.img} />
                <div>
                    <p className="user-name">{user.name}</p>
                    <span>{user.type}</span>
                </div>
                <p className="user-date">{user.date}</p>
            </div>

            <div className="income">
                {income.map((el) => (
                    <div key={el.id}>
                        <p>{el.title}</p>
                        <p>{el.amount}</p>
                    </div>
                ))}
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
                    <p className="sale-price">amount</p>
                </div>
                {saleData.map((sale) => (
                    <div className="sale-data">
                        <p className="sale-name">{sale.name}</p>
                        <p className="sale-date">{sale.date}</p>
                        <p className="sale-abonement">{sale.abonement}</p>
                        <p className="sale-price">₴{sale.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

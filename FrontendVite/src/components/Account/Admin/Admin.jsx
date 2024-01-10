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
                            <RectangleStackIcon className="h-3 w-3" />
                            All
                        </button>
                        <div className="button-divider"></div>
                        <button>
                            <CalendarDaysIcon className="h-3 w-3" />
                            Today
                        </button>
                    </div>
                </div>
                <div className="metrics">
                    <p>client</p>
                    <p>abonement</p>
                    <p>price</p>
                    <p>date</p>
                </div>
                <div className="sale-data-list">
                    {soldAbonements.map((sale) => (
                        <div key={sale.id} className="sale-data">
                            <div>
                                <p className="sale-name">
                                    {sale.user.name} {sale.user.surname}
                                </p>
                            </div>
                            <div>
                                <p className="sale-abonement">{sale.amount}</p>
                            </div>
                            <div>
                                <p className="sale-price">₴{sale.price}</p>
                            </div>
                            <div>
                                <p className="sale-date">
                                    {sale.purchase_date.slice(0, 10)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="income">
                <div className="income-main">
                    <p className="title">Income</p>
                    <div className="income-metrics">
                        <p className="income-month">Month</p>
                        <p className="income-day">Today</p>
                        <p>Abonements</p>
                    </div>
                    <div className="income-data">
                        <p>{statistics.monthlyIncome}</p>
                        <p>{statistics.dailyIncome}</p>
                        <p>{statistics.totalAbonementSales}</p>
                    </div>
                </div>

                <div className="income-additional">
                    <div>
                        <p className="income-profit">Profit</p>
                    </div>
                    <div className="income-profit-data">
                        <p>{statistics.monthlyIncome}</p>
                    </div>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="12"
                            viewBox="0 0 13 12"
                            fill="none"
                        >
                            <g opacity="0.9">
                                <path
                                    d="M8.24973 2.99774L9.39461 4.14262L6.95487 6.58235L4.95509 4.58257L1.25049 8.29217L1.95541 8.99709L4.95509 5.99742L6.95487 7.9972L10.1045 4.85254L11.2494 5.99742V2.99774H8.24973Z"
                                    fill="#00831D"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="income">
                <div className="income-main">
                    <p className="title">Expenses</p>
                    <div className="income-metrics">
                        <p className="income-month">Trainer</p>
                        <p className="income-day">Salary</p>
                    </div>
                    <div className="income-data">
                        <p>{statistics.monthlyIncome}</p>
                        <p>{statistics.dailyIncome}</p>
                    </div>
                </div>

                <div className="income-additional">
                    <div>
                        <p className="income-profit">Total</p>
                    </div>
                    <div className="income-profit-data">
                        <p>{statistics.monthlyIncome}</p>
                    </div>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="12"
                            viewBox="0 0 13 12"
                            fill="none"
                        >
                            <g opacity="0.9">
                                <path
                                    d="M8.24973 2.99774L9.39461 4.14262L6.95487 6.58235L4.95509 4.58257L1.25049 8.29217L1.95541 8.99709L4.95509 5.99742L6.95487 7.9972L10.1045 4.85254L11.2494 5.99742V2.99774H8.24973Z"
                                    fill="#00831D"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

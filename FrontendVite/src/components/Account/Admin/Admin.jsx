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
        <div className="admin-overview">
            <div className="sales">
                <div className="title top-zero">Sales</div>
                <div className="selector align-right">
                    <button className="selector-element">
                        <RectangleStackIcon className="h-4 w-4" />
                        All
                    </button>
                    <div className="button-divider"></div>
                    <button className="selector-element">
                        <CalendarDaysIcon className="h-4 w-4" />
                        Today
                    </button>
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
            <div className="inout">
                <div className="inout-main">
                    <p className="title top-zero">Income</p>
                    <div className="inout-metrics">
                        <p>Month</p>
                        <p>Today</p>
                        <p>Abonements</p>
                    </div>
                    <div className="inout-data">
                        <p>{statistics.monthlyIncome}</p>
                        <p>{statistics.dailyIncome}</p>
                        <p>{statistics.totalAbonementSales}</p>
                    </div>
                </div>

                <div className="inout-additional">
                    <div>
                        <p className="inout-profit">Profit</p>
                    </div>
                    <div className="inout-profit-data">
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
            <div className="inout">
                <div className="inout-main">
                    <p className="title top-zero">Expenses</p>
                    <div className="inout-metrics">
                        <p className="inout-month">Trainer</p>
                        <p className="inout-day">Salary</p>
                    </div>
                    <div className="inout-data">
                        <p>{statistics.monthlyIncome}</p>
                        <p>{statistics.dailyIncome}</p>
                    </div>
                </div>

                <div className="inout-additional">
                    <div>
                        <p className="inout-profit">Total</p>
                    </div>
                    <div className="inout-profit-data">
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

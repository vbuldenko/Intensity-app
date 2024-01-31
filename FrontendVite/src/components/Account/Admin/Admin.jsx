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
            <div className="sales acc-card-el-bg">
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
                    <p> client</p>
                    <p>abonement</p>
                    <p>price</p>
                    <p>date</p>
                </div>
                <div className="sale-list">
                    {soldAbonements.map((sale) => (
                        <div
                            key={sale.id}
                            className="sale-data acc-card-el-bg3 s-font"
                        >
                            <div>
                                <p className="sale-name">
                                    {sale.user.name} {sale.user.surname}
                                </p>
                            </div>
                            <div>
                                <p className="green-clr">{sale.amount}</p>
                            </div>
                            <div>
                                <p>₴{sale.price}</p>
                            </div>
                            <div>
                                <p className="green-clr">
                                    {sale.purchase_date.slice(0, 10)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="inout acc-card-el-bg">
                <p className="title top-zero">Income</p>
                <div className="inout-el flex-row-container">
                    <div className="flex-col">
                        <p className="xs-font">Month</p>
                        <p className="green-clr">{statistics.monthlyIncome}</p>
                    </div>
                    <div className="flex-col">
                        <p className="xs-font">Today</p>
                        <p className="green-clr">{statistics.dailyIncome}</p>
                    </div>
                    <div className="flex-col">
                        <p className="xs-font">Abonements</p>
                        <p className="green-clr">
                            {statistics.totalAbonementSales}
                        </p>
                    </div>
                </div>

                <div className="flex-row">
                    <div>
                        <p className="bold">Profit</p>
                    </div>
                    <div className="green-clr">
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

            <div className="inout acc-card-el-bg">
                <p className="title top-zero">Expenses</p>
                <div className="inout-el flex-row-container">
                    <div className="flex-col">
                        <p className="xs-font">Trainer</p>
                        <p className="green-clr">{statistics.monthlyIncome}</p>
                    </div>
                    <div className="flex-col">
                        <p className="xs-font">Salary</p>
                        <p className="green-clr">{statistics.dailyIncome}</p>
                    </div>
                </div>

                <div className="flex-row">
                    <div>
                        <p className="bold">Total</p>
                    </div>
                    <div className="green-clr">
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

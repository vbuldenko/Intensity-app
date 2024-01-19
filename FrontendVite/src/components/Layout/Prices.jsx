export default function Prices() {
    const prices = [
        {
            category: 'Group',
            prices: [
                { amount: 1, price: 350 },
                { amount: 4, price: 1300 },
                { amount: 6, price: 1800 },
                { amount: 8, price: 2200 },
                { amount: 10, price: 2500 },
                { amount: 12, price: 2700 },
            ],
        },
        {
            category: 'Individual',
            prices: [
                { amount: 1, price: 600 },
                { amount: 5, price: 2700 },
                { amount: 10, price: 5500 },
            ],
        },
        {
            category: 'Split',
            prices: [
                { amount: 1, price: 800 },
                { amount: 5, price: 3800 },
                { amount: 10, price: 7000 },
            ],
        },
        {
            category: 'Children',
            prices: [
                { amount: 1, price: 250 },
                { amount: 8, price: 1000 },
                { amount: 12, price: 1500 },
            ],
        },
    ];

    return (
        <>
            {/* <div className="flex-column red"> */}
            <h1 className="s-font">Абонементи</h1>
            <div className="prices">
                {prices.map((el, i) => (
                    <div key={i} className="prices-subsection card-el-bg">
                        <span className="status2">{el.category}</span>
                        <div className="abonements-prices">
                            <div className="metrics gray-clr">
                                <p>amount</p>
                                <p>price</p>
                                <p>unit price</p>
                            </div>
                            {el.prices.map((el, i) => (
                                <div key={i} className="metrics-data">
                                    <p>
                                        {el.amount}{' '}
                                        {el.amount === 1
                                            ? 'training'
                                            : 'trainings'}
                                    </p>
                                    <p>₴ {el.price}</p>
                                    <p>₴ {el.price / el.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* </div> */}
        </>
    );
}

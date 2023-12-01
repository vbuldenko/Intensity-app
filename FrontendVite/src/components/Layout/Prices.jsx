import '../styles/prices.css';
import group from '../../images/group.webp';
import indiv from '../../images/indiv.jpg';
import kids from '../../images/kids.webp';

function Prices() {
    const prices = [
        {
            category: 'Group',
            img: group,
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
            img: indiv,
            prices: [
                { amount: 1, price: 600 },
                { amount: 5, price: 2700 },
                { amount: 10, price: 5500 },
            ],
        },
        {
            category: 'Children',
            img: kids,
            prices: [
                { amount: 1, price: 250 },
                { amount: 8, price: 1000 },
                { amount: 12, price: 1500 },
            ],
        },
    ];

    return (
        <section className="prices-section">
            {prices.map((el, i) => (
                <div key={i} className="prices-subsection">
                    <img src={el.img} />
                    <span>{el.category}</span>
                    <div className="abonements-prices">
                        {el.prices.map((el, i) => (
                            <div key={i}>
                                <p>{el.amount} trainings</p>
                                <p>₴{el.price}</p>
                                <p>{el.price / el.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Prices;

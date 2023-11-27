import '../styles/prices.css';
import group from '../../images/group.webp';
import indiv from '../../images/indiv.jpg';
import kids from '../../images/kids.webp';
import { element } from 'prop-types';

function Prices() {
    const prices = [
        {
            category: 'Group',
            img: group,
            prices: [
                { type: 'Test', price: '₴350' },
                { type: '4 classes', price: '₴1300', discount: '225' },
                { type: '6 classes', price: '₴1800', discount: '225' },
                { type: '8 classes', price: '₴2200', discount: '225' },
                { type: '10 classes', price: '₴2500', discount: '225' },
                { type: '12 classes', price: '₴2700', discount: '225' },
                { type: 'Unlimited', price: '₴4500' },
            ],
        },
        {
            category: 'Individual',
            img: indiv,
            prices: [
                { type: '1 training', price: '₴600' },
                { type: '5 trainings', price: '₴2700', discount: '225' },
                { type: '10 trainings', price: '₴5500', discount: '225' },
            ],
        },
        {
            category: 'Children',
            img: kids,
            prices: [
                { type: '1 training', price: '₴250' },
                { type: '8 trainings', price: '₴1000', discount: '225' },
                { type: '12 trainings', price: '₴1500', discount: '225' },
            ],
        },
    ];

    return (
        <section className="prices-section">
            {prices.map((el) => (
                <div className="prices-subsection">
                    <span>{el.category}</span>
                    <img src={el.img} />
                    <div className="abonements-prices">
                        {el.prices.map((el) => (
                            <div>
                                <p>{el.type}</p>
                                <p>{el.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Prices;

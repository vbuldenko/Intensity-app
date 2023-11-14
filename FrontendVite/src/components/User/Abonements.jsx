import Togglable from './Togglable';
import Abonement from './Abonement';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Abonements({ currentDate }) {
    const abonements = useSelector(({ abonements }) => abonements);
    console.log('Abonements component of the User');
    const [abonementView, setAbonementView] = useState('all');

    const filteredAbonements = filterAbonements(abonements, abonementView);

    function filterAbonements(abonements, viewOption) {
        const expirationDateFilter = (abonement) => {
            const expirationDate = new Date(abonement.expiration_date);
            if (viewOption === 'active') {
                return expirationDate >= currentDate;
            }
            if (viewOption === 'ended') {
                return expirationDate < currentDate;
            }
            if (viewOption === 'not activated') {
                return !abonement.activation_date;
            }
            return true; // 'all' option
        };

        return abonements.filter(expirationDateFilter);
    }

    function handleChange(event) {
        setAbonementView(event.target.value);
    }

    const sortByPurchaseDate = (a, b) =>
        new Date(a.purchase_date) - new Date(b.purchase_date);

    return (
        <div className="abonements">
            <div className="abonements-title">
                <p className="title">Abonements</p>
                <select id="view" name="view" onChange={handleChange}>
                    {['all', 'active', 'not activated', 'ended'].map(
                        (option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        )
                    )}
                </select>
            </div>

            {filteredAbonements.sort(sortByPurchaseDate).map((abonement) => {
                return <Abonement key={abonement.id} abonement={abonement} />;
            })}
        </div>
    );
}

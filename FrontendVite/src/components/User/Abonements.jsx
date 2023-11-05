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
            if (viewOption === 'current') {
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

    const getStatus = ({ activation_date, expiration_date }) => {
        const expirationDate = new Date(expiration_date);

        if (activation_date && expirationDate >= currentDate) {
            return 0; // Active
        } else if (activation_date && expirationDate < currentDate) {
            return 2; // Expired
        }
        return 1; // Not activated
    };

    const sortByStatus = (a, b) => getStatus(a) - getStatus(b);

    return (
        <div className="abonements">
            <div className="abonements-title">
                <p className="title">Abonements</p>
                <select id="view" name="view" onChange={handleChange}>
                    {['all', 'current', 'not activated', 'ended'].map(
                        (option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        )
                    )}
                </select>
            </div>

            {filteredAbonements.sort(sortByStatus).map((abonement) => {
                const statusCode = getStatus(abonement);
                const status =
                    statusCode === 0
                        ? 'active'
                        : statusCode === 1
                        ? 'not activated'
                        : 'expired';

                return (
                    <Togglable
                        key={abonement.id}
                        visibility={status === 'active'}
                        status={status}
                    >
                        <Abonement status={status} abonement={abonement} />
                    </Togglable>
                );
            })}
        </div>
    );
}

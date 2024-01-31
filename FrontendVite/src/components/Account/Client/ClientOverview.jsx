import Abonement from './Abonement';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Square3Stack3DIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    BellSnoozeIcon,
} from '@heroicons/react/24/outline';

export default function ClientOverview({ currentDate }) {
    const abonements = useSelector(({ abonements }) => abonements);
    const [abonementView, setAbonementView] = useState('active');
    const filteredAbonements = filterAbonements(abonements, abonementView);

    function filterAbonements(abonements, viewOption) {
        const expirationDateFilter = (abonement) => {
            const expirationDate = new Date(abonement.expiration_date);
            if (viewOption === 'active') {
                return abonement.status === 'active';
            }
            if (viewOption === 'expired') {
                return (
                    expirationDate < currentDate || abonement.status === 'ended'
                );
            }
            if (viewOption === 'not activated') {
                return abonement.status === 'non-active';
            }
            return true; // 'all' option
        };

        return abonements.filter(expirationDateFilter);
    }

    const handleClick = (value) => {
        setAbonementView(value);
    };

    const sortByPurchaseDate = (a, b) =>
        new Date(a.purchase_date) - new Date(b.purchase_date);

    return (
        <div className="flex-column">
            <div className="selector align-right">
                {/* <button
                    className={`selector-element ${
                        abonementView === 'all' ? 'active' : ''
                    }`}
                    onClick={() => handleClick('all')}
                >
                    <Square3Stack3DIcon className="h-4 w-4" />
                    <p>All</p>
                </button>
                <div className="button-divider"></div> */}
                <button
                    className={`selector-element ${
                        abonementView === 'active' ? 'active' : ''
                    }`}
                    onClick={() => handleClick('active')}
                >
                    <CheckIcon className="h-4 w-4" />
                    <p>Active</p>
                </button>
                <div className="button-divider"></div>
                <button
                    className={`selector-element ${
                        abonementView === 'expired' ? 'active' : ''
                    }`}
                    onClick={() => handleClick('expired')}
                >
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <p>Expired</p>
                </button>
                <div className="button-divider"></div>
                <button
                    className={`selector-element ${
                        abonementView === 'not activated' ? 'active' : ''
                    }`}
                    onClick={() => handleClick('not activated')}
                >
                    <BellSnoozeIcon className="h-4 w-4" />
                    <p>Not activated</p>
                </button>
            </div>
            <div className="flex-column">
                {filteredAbonements
                    .sort(sortByPurchaseDate)
                    .map((abonement) => {
                        return (
                            <Abonement
                                key={abonement.id}
                                abonement={abonement}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

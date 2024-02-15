import Abonement from './Abonement';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { filterAbonements, sortByPurchaseDate } from '../../../utils';
import AbonementSelector from '../../Elements/AbonementSelector';

export default function ClientOverview({ abonements }) {
    const [abonementView, setAbonementView] = useState('active');
    const filteredAbonements = filterAbonements(abonements, abonementView);

    const handleClick = (value) => {
        setAbonementView(value);
    };

    return (
        <div className="flex-column">
            <AbonementSelector
                abonementView={abonementView}
                handleClick={handleClick}
            />
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

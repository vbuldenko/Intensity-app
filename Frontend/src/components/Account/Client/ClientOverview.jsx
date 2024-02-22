import Abonement from './Abonement';
import { useState } from 'react';
import { filterAbonements, sortByPurchaseDate } from '../../../utils';
import AbonementSelector from '../../Elements/AbonementSelector';
import Selector from '../../Elements/Selector';

export default function ClientOverview({ abonements }) {
    const [abonementView, setAbonementView] = useState('active');
    const filteredAbonements = filterAbonements(abonements, abonementView);

    return (
        <div className="flex-column">
            <Selector
                selection={abonementView}
                handleSelection={setAbonementView}
                buttonNames={['active', 'expired', 'not activated']}
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

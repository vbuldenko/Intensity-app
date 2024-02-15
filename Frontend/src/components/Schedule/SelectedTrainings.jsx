import { useMemo } from 'react';
import Training from './Training';
import { useSelector } from 'react-redux';
import { findMostRecentAbonement } from '../../utils';

export default function SelectedTrainings({ trainings }) {
    const activeAbonement = useSelector(({ abonements }) =>
        findMostRecentAbonement(abonements)
    );

    return (
        <section className="trainings">
            <ol className="trainings-list">
                {trainings.length > 0 ? (
                    trainings.map((training) => (
                        <Training
                            key={training.id}
                            training={training}
                            activeAbonement={activeAbonement}
                        />
                    ))
                ) : (
                    <p>No trainings for today.</p>
                )}
            </ol>
        </section>
    );
}

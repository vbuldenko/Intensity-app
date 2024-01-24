import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAbonement } from '../../../reducers/abonementReducer';
import storageService from '../../../services/storage';
import HistoryElement from '../../Elements/HistoryElement';
import Toggle from '../../Elements/Toggle';

export default function Abonement({ abonement }) {
    const { role: userRole } = storageService.loadUser();

    const status = !abonement.expiration_date
        ? 'not activated'
        : new Date(abonement.expiration_date) >= new Date()
        ? 'active'
        : 'expired';
    const dispatch = useDispatch();

    const [freeze, setFreeze] = useState(abonement.paused);

    function handleClick() {
        if (abonement.paused) {
            console.log(
                'Abonement was frozen already, other actions forbidden!'
            );
        } else {
            setFreeze((prev) => !prev);
            dispatch(updateAbonement(abonement.id, { updateType: 'freeze' }));
        }
    }

    return (
        <div className="abonement acc-card-el-bg">
            <div className="gen-abonement-info">
                <div className={`top-zero title ${status}`}>{status}</div>
                <div className="f-container">
                    <div>
                        <b>Amount of trainings:</b> {abonement.amount}
                    </div>
                    <div>
                        <div>
                            <b>Left trainings:</b>{' '}
                            <span className="left-training">
                                {abonement.left}
                            </span>
                        </div>
                        {userRole === 'admin' && (
                            <div className="flex-row-container">
                                Freeze
                                <Toggle
                                    state={freeze}
                                    handleClick={handleClick}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="f-container">
                    <div>
                        <b>From:</b>{' '}
                        {abonement.activation_date
                            ? abonement.activation_date.slice(0, 10)
                            : null}
                    </div>
                    <div>
                        <b>To:</b>{' '}
                        {abonement.expiration_date
                            ? abonement.expiration_date.slice(0, 10)
                            : null}
                    </div>
                    <div>
                        <b>Purchase date:</b>{' '}
                        {abonement.purchase_date.slice(0, 10)}
                    </div>
                </div>
            </div>
            <div className="history">
                {abonement.history.length > 0
                    ? abonement.history.map((el) => (
                          <HistoryElement
                              key={el.id}
                              data={el}
                              trainer={false}
                          />
                      ))
                    : null}
            </div>
        </div>
    );
}

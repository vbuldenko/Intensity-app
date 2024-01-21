import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAbonement } from '../../reducers/abonementReducer';
import storageService from '../../services/storage';
import HistoryElement from '../Elements/HistoryElement';

export default function Abonement({ abonement }) {
    const { role: userRole } = storageService.loadUser();

    const status = !abonement.expiration_date
        ? 'not activated'
        : new Date(abonement.expiration_date) >= new Date()
        ? 'active'
        : 'expired';
    const dispatch = useDispatch();

    const [freeze, setFreeze] = useState(abonement.paused);

    function handleChange(e) {
        const { name, checked } = e.target;
        if (abonement.paused) {
            console.log(
                'You have paused your abonement already, other actions forbidden!'
            );
        } else {
            setFreeze((prev) => !prev);
            dispatch(updateAbonement(abonement.id, { updateType: 'freeze' }));
            console.log(name, checked);
        }
    }

    return (
        <div className="abonement acc-card-el-bg">
            <div className="gen-abonement-info">
                <div className={`top-zero title ${status}`}>{status}</div>
                <div className="flex-row-container">
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
                            <div className="freeze-option">
                                <p>Freeze</p>
                                <input
                                    name="freeze-option"
                                    type="checkbox"
                                    id="freeze"
                                    checked={freeze}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="freeze"
                                    className="toggle-button"
                                >
                                    <div className="slider"></div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-row-container">
                    <div>
                        <b>Purchase date:</b>{' '}
                        {abonement.purchase_date.slice(0, 16)}
                    </div>
                    <div>
                        <b>From:</b>{' '}
                        {abonement.activation_date
                            ? abonement.activation_date.slice(0, 16)
                            : null}
                    </div>
                    <div>
                        <b>To:</b>{' '}
                        {abonement.expiration_date
                            ? abonement.expiration_date.slice(0, 16)
                            : null}
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

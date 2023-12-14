import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAbonement } from '../../reducers/abonementReducer';
import storageService from '../../services/storage';

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
        <div className="abonement">
            <div className="gen-abonement-info">
                <div>
                    <b>Status:</b>
                    <span className={status}>{status}</span>
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
                <div>
                    <b>Purchase date:</b> {abonement.purchase_date.slice(0, 16)}
                </div>
                <div>
                    <b>Amount of trainings:</b> {abonement.amount}
                </div>
                <div>
                    <b>Left trainings:</b>{' '}
                    <span className="left-training">{abonement.left}</span>
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
                        <label htmlFor="freeze" className="toggle-button">
                            <div className="slider"></div>
                        </label>
                    </div>
                )}
            </div>
            {/* Look at id property of training history */}
            <div className="abonement-training-history">
                {abonement.history.length > 0
                    ? abonement.history.map((el) => {
                          return (
                              <div
                                  key={el.id}
                                  className="abonement-training-history-element"
                              >
                                  <p>date: {el.date.slice(0, 10)}</p>
                                  <p>time: {el.time}</p>
                                  <p>class: {el.type}</p>
                                  <p>trainer: {el.instructor.surname}</p>
                                  {el.deducted ? (
                                      <p
                                          style={{
                                              color: 'red',
                                              border: '1px solid red',
                                              borderRadius: '0.5em',
                                              padding: '0.25em',
                                          }}
                                      >
                                          deducted: {el.deduction_reason}
                                      </p>
                                  ) : null}
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
}

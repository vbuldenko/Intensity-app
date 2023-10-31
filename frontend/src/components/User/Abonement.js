export default function Abonement({ status, abonement }) {
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
            </div>
            {/* Look at id property of training history */}
            <div className="abonement-training-history">
                {abonement.history
                    ? abonement.history.map((el) => {
                          return (
                              <div
                                  key={el.id}
                                  className="abonement-training-history-element"
                              >
                                  <p>date: {el.date.slice(0, 10)}</p>
                                  <p>time: {el.time}</p>
                                  <p>class: {el.type}</p>
                                  <p>trainer: {el.instructor}</p>
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

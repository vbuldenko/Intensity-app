import './account.css';

function Account() {
    let dates = [
        '1.07',
        '5.07',
        '8.07',
        '10.07',
        '15.07',
        '18.07',
        '20.07',
        '21.07',
        '25.07',
        '27.07',
    ];

    return (
        <section className="account-section">
            <h2>Personal account</h2>
            <div className="account-subsection abonement">
                <h3>My abonement</h3>
                <div>
                    <p>
                        Number of trainings - <span>10</span>
                    </p>
                    <p>
                        Left trainings - <span>8</span>
                    </p>
                </div>
                <div className="abonement-dates">
                    {dates.map((date) => (
                        <p key={date}>{date}</p>
                    ))}
                </div>
            </div>
            <div className="account-subsection">
                <h3>My scheduled trainings</h3>
                <div>
                    <p>
                        Wensday - <span>17:00</span>
                    </p>
                    <p>Fly-stretching</p>
                </div>
            </div>
        </section>
    );
}

export default Account;

import './schedule.css';

function Schedule() {
    return (
        <section className="schedule-section">
            <h2>Schedule</h2>
            <div>
                <ul className="schedule-week">
                    <li className="schedule-day">
                        <p>14</p>
                        <h2>MON</h2>
                    </li>
                    <li className="schedule-day">
                        <p>15</p>
                        <h2>TUE</h2>
                    </li>
                    <li className="schedule-day active">
                        <p>16</p>
                        <h2>WED</h2>
                    </li>
                    <li className="schedule-day">
                        <p>17</p>
                        <h2>THU</h2>
                    </li>
                    <li className="schedule-day">
                        <p>18</p>
                        <h2>FRI</h2>
                    </li>
                    <li className="schedule-day">
                        <p>19</p>
                        <h2>SAT</h2>
                    </li>
                    <li className="schedule-day">
                        <p>20</p>
                        <h2>SUN</h2>
                    </li>
                </ul>
                <div className="schedule-info">
                    <div className="schedule-current-date">
                        <h3>Wensday, 16 August 2023</h3>
                        <span>
                            <b>Today</b>
                        </span>
                    </div>
                    <div className="schedule-training">
                        <div className="schedule-training-details">
                            <div>
                                <b>
                                    <p>11:00</p>
                                </b>
                                <span>50 min</span>
                            </div>
                            <div>Image</div>
                            <div>
                                <b>Functional</b>
                                <p>Anastsia Babiychuk</p>
                            </div>
                        </div>

                        <button>RESERVE</button>
                    </div>
                    <div className="schedule-training">
                        <div className="schedule-training-details">
                            <div>
                                <b>
                                    <p>12:00</p>
                                </b>
                                <span>50 min</span>
                            </div>
                            <div>Image</div>
                            <div>
                                <b>Fly Stretching</b>
                                <p>Anzhelika</p>
                            </div>
                        </div>

                        <button>RESERVE</button>
                    </div>
                    <div className="schedule-training">
                        <div className="schedule-training-details">
                            <div>
                                <b>
                                    <p>19:00</p>
                                </b>
                                <span>50 min</span>
                            </div>
                            <div>Image</div>
                            <div>
                                <b>Heels</b>
                                <p>Anastasia Tkachuk</p>
                            </div>
                        </div>

                        <button>RESERVE</button>
                    </div>
                    <div className="schedule-training">
                        <div className="schedule-training-details">
                            <div>
                                <b>
                                    <p>20:00</p>
                                </b>
                                <span>50 min</span>
                            </div>
                            <div>Image</div>
                            <div>
                                <b>Stretching</b>
                                <p>Anastasia Tkachuk</p>
                            </div>
                        </div>

                        <button>RESERVE</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Schedule;

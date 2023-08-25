import './styles/schedule.css';
import anzhphoto from '../images/anzhel.jpg';
import babiychuk from '../images/Babiychuk.jpg';
import tkachuk from '../images/Tkachuk.jpg';

function Schedule() {
    return (
        <section className="schedule-section">
            <h2>Schedule</h2>
            <div>
                <ul className="schedule-week">
                    <li className="schedule-day">
                        <p className="schedule-day-abbrev">{'<'}</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 14</p>
                        <p className="schedule-day-abbrev">MON</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 15</p>
                        <p className="schedule-day-abbrev">TUE</p>
                    </li>
                    <li className="schedule-day active">
                        <p>Aug 16</p>
                        <p className="schedule-day-abbrev">WED</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 17</p>
                        <p className="schedule-day-abbrev">THU</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 18</p>
                        <p className="schedule-day-abbrev">FRI</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 19</p>
                        <p className="schedule-day-abbrev">SAT</p>
                    </li>
                    <li className="schedule-day">
                        <p>Aug 20</p>
                        <p className="schedule-day-abbrev">SUN</p>
                    </li>
                    <li className="schedule-day">
                        <p className="schedule-day-abbrev">{'>'}</p>
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
                            <img className="schedule-trainer" src={babiychuk} />
                            <div>
                                <b>Functional</b>
                                <p>Anastsia Babiychuk</p>
                            </div>
                            <div>
                                <b>People</b>
                                <p>5</p>
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
                            <img className="schedule-trainer" src={anzhphoto} />
                            <div>
                                <b>Fly Stretching</b>
                                <p>Anzhelika</p>
                            </div>
                            <div>
                                <b>People</b>
                                <p>8</p>
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
                            <img className="schedule-trainer" src={tkachuk} />
                            <div>
                                <b>Heels</b>
                                <p>Anastasia Tkachuk</p>
                            </div>
                            <div>
                                <b>People</b>
                                <p>6</p>
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
                            <img className="schedule-trainer" src={tkachuk} />
                            <div>
                                <b>Stretching</b>
                                <p>Anastasia Tkachuk</p>
                            </div>
                            <div>
                                <b>People</b>
                                <p>6</p>
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

import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
import './styles/trainer.css';

export default function Trainer({ trainers }) {
    const { trainerId } = useParams();
    const location = useLocation();
    const trainer = trainers.find(
        (el) => el.id.toString() === trainerId.toString()
    );

    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all trainers</span>
            </Link>
            <div className="trainer-info">
                <p className="trainer-name">{trainer.fullname}</p>
                <p className="trainer-phone">{trainer.phone}</p>
                <p className="trainer-salary">Salary: {trainer.curr_salary}</p>
                <p className="training-number">
                    Number of trainings: {trainer.tr_history.length}
                </p>
                <div className="trainer-history">
                    {trainer.tr_history.map((element, i) => (
                        <div key={i} className="trainer-history-element">
                            <p>
                                <span>date:</span> {element.date}
                            </p>
                            <p>
                                <span>time:</span> {element.time}
                            </p>
                            <p>
                                <span>class:</span> {element.class}
                            </p>
                            <p>
                                <span>people:</span> {element.people}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

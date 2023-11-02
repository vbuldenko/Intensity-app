import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
import clientPhoto from '../../images/tkachuk.jpg';
import './styles/client.css';

export default function Client({ list }) {
    const { id } = useParams();
    const location = useLocation();
    const client = list.find((el) => el.id.toString() === id.toString());

    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all clients</span>
            </Link>
            <div className="client-info">
                <div className="client-abonement-info">
                    <p>
                        <b>Abonement holder:</b> {client.fullname}
                    </p>
                    <p>
                        <b>Status:</b>
                        <span>{client.active ? 'active' : 'inactive'}</span>
                    </p>
                    <p>
                        <b>From:</b> {client.current_abonement.activation_date}
                    </p>
                    <p>
                        <b>To:</b> {client.current_abonement.expiration_date}
                    </p>
                    <p>
                        <b>Purchase date:</b>{' '}
                        {client.current_abonement.purchase_date}
                    </p>
                    <p>
                        <b>Amount of trainings:</b>{' '}
                        {client.current_abonement.amount}
                    </p>
                    <p>
                        <b>Left trainings:</b> {client.current_abonement.left}
                    </p>
                    <div className="freeze-option">
                        <p>Freeze</p>
                        <input type="checkbox" id="freeze" />
                        <label htmlFor="freeze" className="toggle-button">
                            <div className="slider"></div>
                        </label>
                    </div>
                </div>
                <div className="client-history">
                    {client.current_abonement.history.map((element, i) => (
                        <div
                            key={i}
                            className={`client-history-element ${
                                element.deducted ? 'deducted' : ''
                            }`}
                        >
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
                                <span>trainer:</span> {element.trainer}
                            </p>
                            {element.deducted ? (
                                <p className="deduction-reason">
                                    {element.deduction_reason}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

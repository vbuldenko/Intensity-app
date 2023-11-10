import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
import clientPhoto from '../../images/tkachuk.jpg';
import './styles/client.css';
import { useSelector } from 'react-redux';
import abonement from '../../services/abonement';

export default function Client() {
    const clients = useSelector(({ users }) => users);
    const { id } = useParams();
    const location = useLocation();
    const client = clients.find((client) => client.id === id.toString());
    const activeAbonement = client.abonements.find(
        (abonement) => new Date(abonement.expiration_date) >= new Date()
    );
    console.log(activeAbonement);
    // const client = clients.find(
    //     (client) => client.id.toString() === id.toString()
    // );

    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all clients</span>
            </Link>
            <div className="client-info">
                <div className="client-abonement-info">
                    <p>
                        <b>Abonement holder:</b> {client.name} {client.surname}
                    </p>
                    {/* <p>
                        <b>Status:</b>
                        <span>{client.active ? 'active' : 'inactive'}</span>
                    </p> */}
                    <p>
                        <b>From:</b> {activeAbonement.activation_date}
                    </p>
                    <p>
                        <b>To:</b> {activeAbonement.expiration_date}
                    </p>
                    <p>
                        <b>Purchase date:</b> {activeAbonement.purchase_date}
                    </p>
                    <p>
                        <b>Amount of trainings:</b> {activeAbonement.amount}
                    </p>
                    <p>
                        <b>Left trainings:</b> {activeAbonement.left}
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
                    {activeAbonement.history.map((training) => (
                        <div
                            key={training.id}
                            className={`client-history-element ${
                                training.deducted ? 'deducted' : ''
                            }`}
                        >
                            <p>
                                <span>date:</span> {training.date}
                            </p>
                            <p>
                                <span>time:</span> {training.time}
                            </p>
                            <p>
                                <span>class:</span> {training.type}
                            </p>
                            <p>
                                <span>trainer:</span> {training.instructor}
                            </p>
                            {/* {training.deducted ? (
                                <p className="deduction-reason">
                                    {training.deduction_reason}
                                </p>
                            ) : null} */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

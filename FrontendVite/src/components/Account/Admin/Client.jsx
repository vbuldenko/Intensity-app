import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
// import clientPhoto from '../../images/tkachuk.jpg';
import { useSelector } from 'react-redux';
import Abonement from '../Abonement';

export default function Client() {
    const { id } = useParams();
    const location = useLocation();
    const client = useSelector(({ users }) =>
        users.find((client) => client.id === id.toString())
    );

    if (!client) {
        return null;
    }
    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all clients</span>
            </Link>
            <div className="client-info">
                <p>
                    Abonement holder: {client.name} {client.surname}
                </p>
                {client.abonements.map((abonement) => (
                    <Abonement key={abonement.id} abonement={abonement} />
                ))}
            </div>
        </div>
    );
}

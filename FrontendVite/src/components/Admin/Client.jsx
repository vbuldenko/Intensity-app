import {
    useParams,
    useOutletContext,
    Link,
    useLocation,
} from 'react-router-dom';
// import clientPhoto from '../../images/tkachuk.jpg';
import './styles/client.css';
import { useSelector } from 'react-redux';
import Abonement from '../User/Abonement';

export default function Client() {
    const { id } = useParams();
    const client = useSelector(({ users }) =>
        users.find((client) => client.id === id.toString())
    );
    const location = useLocation();
    const search = location.state?.search || '';

    return (
        <div>
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all clients</span>
            </Link>
            <div className="client-info">
                {client.abonements.map((abonement) => (
                    <Abonement key={abonement.id} abonement={abonement} />
                ))}
            </div>
        </div>
    );
}

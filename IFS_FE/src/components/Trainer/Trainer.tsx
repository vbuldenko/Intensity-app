import { useParams, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TrainerData from '../Trainer/TrainerData';

export default function Trainer() {
    const { id } = useParams();
    const location = useLocation();
    const trainer = useSelector(({ user }) =>
        user.userList.find((user) => user.id === id.toString())
    );

    const search = location.state?.search || '';

    return (
        <div className="flex-column-container">
            <Link to={`..${search}`} relative="path" className="back-button">
                &larr; <span>Back to all trainers</span>
            </Link>

            <TrainerData user={trainer} />
        </div>
    );
}

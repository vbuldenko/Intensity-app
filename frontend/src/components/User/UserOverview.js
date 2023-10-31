import './styles/useroverview.css';
import { useOutletContext } from 'react-router-dom';

import { user, saleData } from '../../test_data/data';

import Abonements from './Abonements';

export default function UserOverview() {
    const userData = useOutletContext();
    if (!userData) {
        return null;
    }

    const { name, surname, role, abonements } = userData;

    const currentDate = new Date();

    return (
        <div className="user-overview">
            <div className="user">
                <img className="user-img" src={user.img} />
                <div>
                    <p className="user-name">
                        {name} {surname}
                    </p>
                    <span className="user-role">{role}</span>
                </div>
                <p className="user-date">
                    {currentDate.toString().slice(0, 16)}
                </p>
            </div>

            <Abonements abonements={abonements} currentDate={currentDate} />
        </div>
    );
}

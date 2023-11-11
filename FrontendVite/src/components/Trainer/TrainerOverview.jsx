import '../User/styles/useroverview.css';
import { useSelector } from 'react-redux';
// import Abonements from './Abonements';

export default function TrainerOverview() {
    const user = useSelector(({ user }) => user);
    if (!user) {
        return null;
    }

    const currentDate = new Date();

    return (
        <div className="user-overview">
            <div className="user">
                {/* <img className="user-img" src={userData.img} /> */}
                <div>
                    <p className="user-name">
                        {user.name} {user.surname}
                    </p>
                    <span className="user-role">{user.role}</span>
                </div>
                <p className="user-date">
                    {currentDate.toString().slice(0, 16)}
                </p>
            </div>

            {/* <Abonements currentDate={currentDate} /> */}
        </div>
    );
}

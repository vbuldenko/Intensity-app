import { useSelector } from 'react-redux';
import Admin from './Admin/Admin';
import TrainerOverview from './TrainerOverview';
import Abonements from './Abonements';

export default function Overview() {
    const user = useSelector(({ user }) => user);

    if (!user) {
        return null;
    }

    const currentDate = new Date();
    const { name, role } = user;

    return (
        <div className="overview">
            <div className="user-date">
                {currentDate.toString().slice(0, 16)}
            </div>
            <div className="user">
                {/* <img className="user-img" src={userData.img} /> */}
                <div>
                    <p className="user-name">Welcome back, {name}</p>
                </div>
                <span className="user-role">{role}</span>
            </div>

            {user.role === 'admin' ? (
                <Admin />
            ) : user.role === 'trainer' ? (
                <TrainerOverview />
            ) : (
                <Abonements currentDate={currentDate} />
            )}
        </div>
    );
}

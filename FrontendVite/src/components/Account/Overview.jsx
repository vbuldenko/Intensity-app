import { useSelector } from 'react-redux';
import { startOfToday, format } from 'date-fns';
import Admin from './Admin/Admin';
import TrainerOverview from './TrainerOverview';
import Abonements from './Abonements';

export default function Overview() {
    const user = useSelector(({ user }) => user);

    if (!user) {
        return null;
    }

    let today = format(startOfToday(), 'dd-MMM-yyyy');
    const currentDate = new Date();
    const { name, surname, role } = user;

    return (
        <div className="overview">
            <div className="user">
                {/* <img className="user-img" src={userData.img} /> */}
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

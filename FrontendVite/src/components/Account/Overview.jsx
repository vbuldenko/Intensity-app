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
        <div className="flex-column">
            <div className="title top-zero align-center">
                {currentDate.toString().slice(0, 16)}
            </div>
            <div className="flex-row-container green-clr">
                <div>
                    <p>Welcome back, {name}</p>
                </div>
                <span className="status3">{role}</span>
            </div>

            <div>
                {user.role === 'admin' ? (
                    <Admin />
                ) : user.role === 'trainer' ? (
                    <TrainerOverview />
                ) : (
                    <Abonements currentDate={currentDate} />
                )}
            </div>
        </div>
    );
}

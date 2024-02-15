import { useSelector } from 'react-redux';
import Admin from './Admin/Admin';
import TrainerOverview from './Trainer/TrainerOverview';
import ClientOverview from './Client/ClientOverview';

export default function Overview({ user }) {
    if (!user) {
        return null;
    }
    const abonements =
        user.role === 'client'
            ? useSelector(({ abonements }) => abonements)
            : null;

    const currentDate = new Date();
    const { name, role } = user;

    return (
        <div className="flex-column">
            <div className="status5 top-zero align-center">
                {currentDate.toString().slice(0, 16)}
            </div>
            <div className="flex-row-container green-clr">
                <div>
                    <p>Welcome back, {name}</p>
                </div>
                <span className="status3">{role}</span>
            </div>

            <div>
                {role === 'admin' ? (
                    <Admin />
                ) : role === 'trainer' ? (
                    <TrainerOverview />
                ) : (
                    <ClientOverview abonements={abonements} />
                )}
            </div>
        </div>
    );
}

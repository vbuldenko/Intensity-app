import { useSelector } from 'react-redux';
import AdminOverview from './Admin/AdminOverview';
import UserOverview from './User/UserOverview';
import TrainerOverview from './Trainer/TrainerOverview';

export default function Overview({}) {
    const user = useSelector(({ user }) => user);

    if (!user) {
        return null;
    }

    return user && user.role === 'admin' ? (
        <AdminOverview />
    ) : user.role === 'trainer' ? (
        <TrainerOverview />
    ) : (
        <UserOverview />
    );
}

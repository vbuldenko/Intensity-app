import { useSelector } from 'react-redux';
import AdminOverview from './Admin/AdminOverview';
import UserOverview from './User/UserOverview';

export default function Overview({}) {
    const user = useSelector(({ user }) => user);

    if (!user) {
        return null;
    }

    return user && user.role === 'admin' ? <AdminOverview /> : <UserOverview />;
}

import { useSelector } from 'react-redux';
import Admin from './Admin/Admin';
import Trainer from './Trainer/Trainer';
import User from './User/User';

export default function Account() {
    const user = useSelector(({ user }) => user);
    if (!user) {
        return null;
    }
    return (
        <>
            {user.role === 'admin' ? (
                <Admin />
            ) : user.role === 'trainer' ? (
                <Trainer />
            ) : (
                <User />
            )}{' '}
        </>
    );
}

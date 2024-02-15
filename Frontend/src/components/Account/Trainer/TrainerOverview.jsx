import { useSelector } from 'react-redux';
import TrainerData from './TrainerData';

export default function TrainerOverview() {
    const user = useSelector(({ user }) => user);

    return <TrainerData user={user} />;
}

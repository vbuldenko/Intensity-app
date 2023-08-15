import { useSelector } from 'react-redux';

const Notification = () => {
    const message = useSelector(({ notification }) => notification);

    if (!message) {
        return null;
    }

    return (
        <div className={`notification ${message.error ? 'error' : ''}`}>
            {message.text}
        </div>
    );
};

export default Notification;

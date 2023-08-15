import { useState, cloneElement } from 'react';
import './togglable.css';

const Togglable = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const buttonLabel = visible ? 'cancel' : 'create new blog';

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div className="toggler">
            <div style={{ display: visible ? '' : 'none' }}>
                {/* Pass toggleVisibility as a prop to BlogForm */}
                {cloneElement(children, { toggleVisibility })}
            </div>
            <button className="togglable-button" onClick={toggleVisibility}>
                {buttonLabel}
            </button>
        </div>
    );
};

export default Togglable;

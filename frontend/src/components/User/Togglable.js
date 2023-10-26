import { useState } from 'react';

const Togglable = ({ visibility, status, children }) => {
    const [visible, setVisible] = useState(visibility);
    const buttonLabel = visible ? 'show less' : 'show more';
    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const buttonStyle = {
        background: 'linear-gradient(to bottom, #3498db, #2980b9)',
        border: 'none',
        borderRadius: '0.5em',
        padding: '0.5em 1em',
        color: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'background 0.3s, transform 0.1s',
    };

    const statusStyle = (status) => {
        const color =
            status === 'active'
                ? 'green'
                : status === 'expired'
                ? 'red'
                : 'gray';
        return {
            color: `${color}`,
            border: `1px solid ${color}`,
            borderRadius: '0.5em',
            padding: '0.25em 0.5em',
        };
    };

    return (
        <div className="toggler">
            <div style={{ display: visible ? '' : 'none' }}>{children}</div>

            {visible ? null : <p style={statusStyle(status)}>{status}</p>}
            <button style={buttonStyle} onClick={toggleVisibility}>
                {buttonLabel}
            </button>
        </div>
    );
};

export default Togglable;

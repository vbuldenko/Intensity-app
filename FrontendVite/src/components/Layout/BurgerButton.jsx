import { useState } from 'react';

export default function BurgerButton({ visible, toggleMenu }) {
    return (
        <div
            className={`burger-icon ${visible ? 'open' : ''}`}
            onClick={toggleMenu}
        >
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

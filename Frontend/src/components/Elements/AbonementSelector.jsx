import {
    Square3Stack3DIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    BellSnoozeIcon,
} from '@heroicons/react/24/outline';

export default function AbonementSelector({ abonementView, handleClick }) {
    return (
        <div className="selector align-right">
            <button
                className={`selector-element ${
                    abonementView === 'active' ? 'active' : ''
                }`}
                onClick={() => handleClick('active')}
            >
                <CheckIcon className="h-4 w-4" />
                <p>Active</p>
            </button>
            <div className="button-divider"></div>
            <button
                className={`selector-element ${
                    abonementView === 'expired' ? 'active' : ''
                }`}
                onClick={() => handleClick('expired')}
            >
                <ExclamationTriangleIcon className="h-4 w-4" />
                <p>Expired</p>
            </button>
            <div className="button-divider"></div>
            <button
                className={`selector-element ${
                    abonementView === 'not activated' ? 'active' : ''
                }`}
                onClick={() => handleClick('not activated')}
            >
                <BellSnoozeIcon className="h-4 w-4" />
                <p>Not activated</p>
            </button>
        </div>
    );
}

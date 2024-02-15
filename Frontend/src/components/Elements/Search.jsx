import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchInput({ value, onChange }) {
    return (
        <div
            className="search"
            style={{
                display: 'flex',
                gap: '3rem',
                alignItems: 'center',
                borderRadius: '2rem',
                boxShadow:
                    '1px 1.5px 4px 0px rgba(0, 0, 0, 0.1) inset, 1px 1.5px 4px 0px rgba(0, 0, 0, 0.08) inset, 0px -0.5px 1px 0px rgba(255, 255, 255, 0.25) inset, 0px -0.5px 1px 0px rgba(255, 255, 255, 0.3) inset',
                background: 'rgba(216, 216, 222, 1)',
                padding: '0.5rem 1rem',
                color: 'rgba(255, 255, 255, 1)',
            }}
        >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <input
                type="text"
                placeholder="Search clients..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    border: 'none',
                    width: '200px',
                    background: 'inherit',
                }}
            />
        </div>
    );
}

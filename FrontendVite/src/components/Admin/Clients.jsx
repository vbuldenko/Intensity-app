import './styles/clients.css';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ListBulletIcon,
    QueueListIcon,
    Squares2X2Icon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Clients(props) {
    const users = useSelector(({ users }) => users);
    const clients = users.filter((user) => user.role === 'client');
    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('view');

    function handleViewChange(key, value) {
        setSearchParams((prevParams) => {
            if (value === null) {
                prevParams.delete(key);
            } else {
                prevParams.set(key, value);
            }
            return prevParams;
        });
    }

    // const [viewMode, setViewMode] = useState('list'); // 'list' or 'tiles'
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="clients-container">
            <div className="header">
                <div className="all-metric">
                    <p>All Clients: {clients.length}</p>
                    {/* <p className="active-clients">
                        Active Clients: {clients.active}
                    </p> */}
                </div>
                <div className="search">
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="view-modes">
                    <button
                        className={`view-button ${
                            viewMode === 'list' ? 'active' : ''
                        }`}
                        onClick={() => handleViewChange('view', 'list')}
                    >
                        <ListBulletIcon className="h-6 w-6" />
                    </button>
                    <button
                        className={`view-button ${
                            viewMode === 'tiles' ? 'active' : ''
                        }`}
                        onClick={() => handleViewChange('view', 'tiles')}
                    >
                        <Squares2X2Icon className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className={`clients-list ${viewMode}`}>
                {filteredClients.map((client) => (
                    <Link
                        key={client.id}
                        to={`${client.id}`}
                        className={`client ${viewMode}`}
                        state={{ search: `?${searchParams.toString()}` }}
                    >
                        <p className="client-name">
                            {client.name} {client.surname}
                        </p>
                        <p className="client-phone">{client.phone}</p>
                        <p className="client-email">{client.email}</p>
                        <p className="client-details">
                            Abonements: {client.abonements.length}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

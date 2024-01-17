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
            <div className="flex-row-container">
                <div className="selector">
                    <div className="selector-element">
                        <p>All:</p> <p>{clients.length}</p>
                    </div>
                    <div className="button-divider"></div>
                    <div className="selector-element">
                        <button
                            className={`view-button ${
                                viewMode === 'tiles' ? 'active' : ''
                            }`}
                            onClick={() => handleViewChange('view', 'tiles')}
                        >
                            <Squares2X2Icon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="selector-element">
                        <button
                            className={`view-button ${
                                viewMode === 'list' ? 'active' : ''
                            }`}
                            onClick={() => handleViewChange('view', 'list')}
                        >
                            <ListBulletIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="search">
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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
                        <div className="client-title">
                            <p className="section-title">
                                {client.name} {client.surname}
                            </p>
                            <p className="status">Active</p>
                        </div>
                        <div className="client-data">
                            <div>
                                <p>Phone</p>
                                <p className="client-phone">{client.phone}</p>
                            </div>
                            <div>
                                <p>Mail</p>
                                <p className="client-email">{client.email}</p>
                            </div>
                            <div>
                                <p>Abonement</p>
                                <p className="client-details">
                                    {client.abonements.length}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

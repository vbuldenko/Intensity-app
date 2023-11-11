import './styles/clients.css';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
                <div className="header-info">
                    <p>All Clients: {clients.length}</p>
                    {/* <p className="active-clients">
                        Active Clients: {clients.active}
                    </p> */}
                </div>
                <div className="view-modes">
                    <button
                        className={`view-button ${
                            viewMode === 'list' ? 'active' : ''
                        }`}
                        onClick={() => handleViewChange('view', 'list')}
                    >
                        <i className="material-icons">view_list</i>
                    </button>
                    <button
                        className={`view-button ${
                            viewMode === 'tiles' ? 'active' : ''
                        }`}
                        onClick={() => handleViewChange('view', 'tiles')}
                    >
                        <i className="material-icons">view_module</i>
                    </button>
                </div>
                <div className="search">
                    <i className="material-icons">search</i>
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

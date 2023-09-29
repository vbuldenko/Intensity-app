import './styles/clients.css';
import { useState } from 'react';
import Client from './Client';
import { Link, useSearchParams } from 'react-router-dom';

export default function Clients({ clients }) {
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

    const filteredClients = clients.list.filter((client) =>
        client.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="clients-container">
            <div className="header">
                <div className="header-info">
                    <p>All Clients: {clients.all}</p>
                    <p className="active-clients">
                        Active Clients: {clients.active}
                    </p>
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
                        to={`${client.id}`}
                        key={client.id}
                        className={`client ${viewMode}`}
                        state={{ search: `?${searchParams.toString()}` }}
                    >
                        <p className="client-name">{client.fullname}</p>
                        <p className="client-phone">{client.phone}</p>
                        <p className="client-email">{client.email}</p>
                        <p className="client-details">
                            Abonement: {client.current_abonement.amount} | Left:{' '}
                            {client.current_abonement.left} | Expiration Date:{' '}
                            {client.current_abonement.expiration_date}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

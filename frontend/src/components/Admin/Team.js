import './styles/team.css';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Team({ trainers }) {
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

    const filteredTrainers = trainers.filter((trainer) =>
        trainer.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="trainers-container">
            <div className="header">
                <div className="header-info">
                    <p>All: {trainers.length}</p>
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
                        placeholder="Search trainers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className={`trainers-list ${viewMode}`}>
                {filteredTrainers.map((trainer) => (
                    <Link
                        to={`${trainer.id}`}
                        key={trainer.id}
                        className={`trainer ${viewMode}`}
                        state={{ search: `?${searchParams.toString()}` }}
                    >
                        <p className="trainer-name">{trainer.fullname}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

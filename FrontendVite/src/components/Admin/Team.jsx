import './styles/team.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
    ListBulletIcon,
    QueueListIcon,
    Squares2X2Icon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Team() {
    const users = useSelector(({ users }) => users);
    const trainers = users.filter((user) => user.role === 'trainer');

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
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="trainers-container">
            <div className="header">
                <div className="header-info">
                    <p>All: {trainers.length}</p>
                </div>
                <div className="search">
                    <MagnifyingGlassIcon className="h-6 w-6 text-green-800" />
                    <input
                        type="text"
                        placeholder="Search trainers..."
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
                        <ListBulletIcon className="h-6 w-6 text-green-800" />
                    </button>
                    <button
                        className={`view-button ${
                            viewMode === 'tiles' ? 'active' : ''
                        }`}
                        onClick={() => handleViewChange('view', 'tiles')}
                    >
                        <Squares2X2Icon className="h-6 w-6 text-green-800" />
                    </button>
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
                        <p className="trainer-name">
                            {trainer.name} {trainer.surname}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

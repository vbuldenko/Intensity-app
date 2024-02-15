import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from '../../Elements/Search';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

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

    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrainers = trainers.filter((trainer) =>
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-column">
            <div className="f-container">
                <div className="selector">
                    <div className="selector-element">
                        <p>All:</p> <p> {trainers.length}</p>
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

                <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className={`persons ${viewMode}`}>
                {filteredTrainers.map((trainer) => (
                    <Link
                        key={trainer.id}
                        to={`${trainer.id}`}
                        className={`acc-card-el-bg2 person ${viewMode}`}
                        state={{ search: `?${searchParams.toString()}` }}
                    >
                        <p className="section-title">
                            {trainer.name} {trainer.surname}
                        </p>
                        <div className="flex-row-container xs-font">
                            <p>Phone</p>
                            <p>{trainer.phone}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Admin from './Admin/Admin';
import Trainer from './Trainer/Trainer';
import User from './User/User';

import { initializeUsers } from '../reducers/usersReducer';
import {
    initializeAllAbonements,
    initializeUserAbonements,
} from '../reducers/abonementReducer';
import { getStatistics } from '../reducers/statisticsReducer';
import { initializeTrainings } from '../reducers/trainingReducer';

export default function Account() {
    const dispatch = useDispatch();
    const user = useSelector(({ user }) => user);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Account useEffect run');
            try {
                if (user) {
                    if (user.role) {
                        const actions = [];
                        // const actions = [dispatch(initializeTrainings())];

                        if (user.role === 'client') {
                            actions.push(dispatch(initializeUserAbonements()));
                        } else if (user.role === 'admin') {
                            actions.push(
                                dispatch(initializeUsers()),
                                dispatch(initializeAllAbonements()),
                                dispatch(getStatistics())
                            );
                        }

                        await Promise.all(actions);
                    }
                }
            } catch (error) {
                // Handle errors here
                console.error('Error in account useEffect:', error);
            }
        };

        fetchData();
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <>
            {user.role === 'admin' ? (
                <Admin />
            ) : user.role === 'trainer' ? (
                <Trainer />
            ) : (
                <User />
            )}{' '}
        </>
    );
}

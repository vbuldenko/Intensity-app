import { Link, Outlet } from 'react-router-dom';
import './clients.css';

export default function Clients() {
    const clients = {
        all: 175,
        active: 100,
        list: [
            {
                id: 1,
                fullname: 'Alice Baber',
                prev_abonements: [
                    {
                        purchase_date: '1.06.23',
                        activation_date: '2.06.23',
                        expiration_date: '02.07.23',
                        amount: 4,
                        expired: false,
                        completed: true,
                    },
                ],
                current_abonement: {
                    amount: 6,
                    purchase_date: '01.07.23',
                    activation_date: '01.07.23',
                    expiration_date: '01.08.23',
                    expired: false,
                    pause: 1,
                    paused: false,
                    left: 1,
                    history: [
                        {
                            date: '11.07.23',
                            time: '10:00',
                            class: 'Tabata',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '15.07.23',
                            time: '12:00',
                            class: 'Fly',
                            trainer: 'Babiychuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '17.07.23',
                            time: '9:00',
                            class: 'Yoga',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '18.07.23',
                            time: '20:00',
                            class: 'Stretching',
                            trainer: 'Babiychuk',
                            deducted: true,
                            deduction_reason: 'unchecked at 19:00',
                        },
                        {
                            date: '22.07.23',
                            time: '19:00',
                            class: 'Heels',
                            trainer: 'Tkachuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                    ],
                },
                active: true,
            },
            {
                id: 2,
                fullname: 'Margo Sokur',
                prev_abonements: null,
                current_abonement: {
                    amount: 4,
                    purchase_date: '01.07.23',
                    activation_date: '01.07.23',
                    expiration_date: '01.08.23',
                    expired: false,
                    pause: 1,
                    paused: false,
                    left: 2,
                    history: [
                        {
                            date: '15.07.23',
                            time: '12:00',
                            class: 'Fly',
                            trainer: 'Babiychuk',
                            deducted: false,
                            deduction_reason: null,
                        },
                        {
                            date: '17.07.23',
                            time: '9:00',
                            class: 'Yoga',
                            trainer: 'Morozova',
                            deducted: false,
                            deduction_reason: null,
                        },
                    ],
                },
                active: true,
            },
        ],
    };

    return (
        <div className="clients">
            <div className="clients-header">
                <div className="all-clients">
                    <p>All clients</p>
                    <p>{clients.all}</p>
                </div>
                <div className="active-clients">
                    <p>Active clients</p>
                    <p>{clients.active}</p>
                </div>
                <div className="clients-list-header">
                    <input type="text" placeholder="search for client..." />
                </div>
            </div>

            <div className="clients-list">
                <div className="clients-list-content">
                    {clients.list.map((client) => (
                        <Link key={client.id} to={`${client.id}`}>
                            <div className="client-gen">
                                <p>{client.fullname}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="client-info">
                <Outlet context={{ list: clients.list }} />
            </div>
        </div>
    );
}

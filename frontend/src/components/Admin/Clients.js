import './clients.css';

export default function Clients() {
    const clients = {
        all: 175,
        active: 100,
        list: [
            {
                id: 1,
                name: 'Alice',
                fullname: 'Alice Baber',
                abonement: 6,
                purchase_date: '01.07.23',
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
                        deduction_reason:
                            'unchecked less than 3 hours before the class',
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
            {
                id: 2,
                name: 'Alice',
                fullname: 'Alice Baber',
                abonement: 6,
                purchase_date: '01.07.23',
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
                        deduction_reason:
                            'unchecked less than 3 hours before the class',
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
        ],
    };

    return (
        <div className="clients">
            <div className="clients-section">
                <p>All clients</p>
                <p>{clients.all}</p>
            </div>
            <div className="clients-section">
                <p>Active clients</p>
                <p>{clients.active}</p>
            </div>
            <div className="clients-section clients-list">
                <div className="clients-list-title">
                    <div className="clients-title-header">
                        <p>name</p>
                        <p>abonement</p>
                        <p>left class attendings</p>
                    </div>
                    <input type="text" placeholder="search for client..." />
                </div>
                {clients.list.map((client) => (
                    <div key={client.id} className="client">
                        <p>{client.fullname}</p>
                        <p>{client.abonement}</p>
                        <p>{client.left}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

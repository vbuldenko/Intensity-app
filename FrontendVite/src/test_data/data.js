import anzhphoto from '../images/anzhel.jpg';

export const trainings = [
    {
        id: 1,
        name: 'Leslie Alexander',
        training: 'Yoga',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2023-09-11T09:00',
        duration: '50',
        places: 1,
    },
    {
        id: 2,
        name: 'Nastia Babiychuk',
        training: 'Pilates',
        imageUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjk0MzcwMDYxfA&ixlib=rb-4.0.3&dpr=2&auto=format&fit=crop&w=120&h=120&q=60',
        startDatetime: '2023-09-10T10:00',
        duration: '50',
        places: 4,
    },
    {
        id: 3,
        name: 'Nastia Tkachuk',
        training: 'Heels',
        imageUrl:
            'https://images.unsplash.com/photo-1519895609939-d2a6491c1196?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fHx8MTY5NDM0OTY4NXww&ixlib=rb-4.0.3&dpr=2&auto=format&fit=crop&w=120&h=120&q=60',
        startDatetime: '2023-09-10T12:00',
        duration: '50',
        places: 5,
    },
    {
        id: 4,
        name: 'Leslie Alexander',
        training: 'Fly-Stretching',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2023-09-10T19:00',
        duration: '50',
        places: 2,
    },
    {
        id: 5,
        name: 'Michael Foster',
        training: 'Healthy Back',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2023-09-10T20:00',
        duration: '50',
        places: 3,
    },
];

export const clients = {
    all: 175,
    active: 100,
    list: [
        {
            id: 1,
            fullname: 'Alice Baber',
            phone: '097-99-100-25',
            email: 'bubab@gmail.com',
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
            phone: '097-99-100-25',
            email: 'bubab@gmail.com',
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

export const trainers = [
    {
        id: 1,
        fullname: 'Anastasia Babiychuk',
        phone: '097-99-100-25',
        curr_salary: 500,
        tr_history: [
            {
                date: '15.07.23',
                time: '12:00',
                class: 'Fly',
                people: 2,
            },
            {
                date: '18.07.23',
                time: '20:00',
                class: 'Stretching',
                people: 3,
            },
        ],
    },
    {
        id: 2,
        fullname: 'Anastasia Tkachuk',
        phone: '097-99-100-25',
        email: 'tkachuk@gmail.com',
        curr_salary: 500,
        tr_history: [
            {
                date: '18.07.23',
                time: '20:00',
                class: 'Stretching',
                people: 3,
            },
            {
                date: '22.07.23',
                time: '19:00',
                class: 'Heels',
                people: 6,
            },
        ],
    },
    {
        id: 3,
        fullname: 'Lera Zabuv',
        phone: '097-99-100-25',
        email: 'zabuv@gmail.com',
        curr_salary: 500,
        tr_history: [
            {
                date: '11.07.23',
                time: '10:00',
                class: 'Tabata',
                people: 2,
            },
            {
                date: '17.07.23',
                time: '9:00',
                class: 'Yoga',
                people: 2,
            },
        ],
    },
];

export const user = {
    img: anzhphoto,
    name: 'Anzhelika Morozova',
    type: 'owner',
    date: '21 Aug 2023',
};
export const income = [
    { id: 1, title: 'Total income', amount: 30000 },
    { id: 2, title: 'Income of a day', amount: 1500 },
    { id: 3, title: 'Total abonement sales', amount: 10 },
    { id: 4, title: 'Profit', amount: 0 },
];
export const expenses = {
    rent: 30000,
    utilities: 1500,
    taxes: 1340,
    salary: [
        { id: 1, name: 'Nastya Babiychuk', amount: 1500 },
        { id: 2, name: 'Lera Narozhna', amount: 1000 },
        { id: 3, name: 'Nastya Tkachuk', amount: 1500 },
    ],
};
export const saleData = [
    {
        name: 'Vitaliy Klichko',
        date: '24.08.23',
        abonement: 8,
        price: 2000,
    },
    {
        name: 'Vitaliy Klichko',
        date: '24.08.23',
        abonement: 8,
        price: 2000,
    },
    {
        name: 'Vitaliy Klichko',
        date: '24.08.23',
        abonement: 8,
        price: 2000,
    },
    {
        name: 'Vitaliy Klichko',
        date: '24.08.23',
        abonement: 8,
        price: 2000,
    },
    {
        name: 'Vitaliy Klichko',
        date: '24.08.23',
        abonement: 8,
        price: 2000,
    },
];

import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { useState, Fragment } from 'react';

const trainings = [
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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Schedule() {
    let today = startOfToday();
    let [selectedDay, setSelectedDay] = useState(today);
    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    let selectedDayTrainings = trainings.filter((training) =>
        isSameDay(parseISO(training.startDatetime), selectedDay)
    );

    return (
        <div className="pt-16">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 &&
                                            colStartClasses[getDay(day)],
                                        'py-1.5'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={classNames(
                                            isEqual(day, selectedDay) &&
                                                'text-white',
                                            !isEqual(day, selectedDay) &&
                                                isToday(day) &&
                                                'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                                !isToday(day) &&
                                                isSameMonth(
                                                    day,
                                                    firstDayCurrentMonth
                                                ) &&
                                                'text-gray-900',
                                            !isEqual(day, selectedDay) &&
                                                !isToday(day) &&
                                                !isSameMonth(
                                                    day,
                                                    firstDayCurrentMonth
                                                ) &&
                                                'text-gray-400',
                                            isEqual(day, selectedDay) &&
                                                isToday(day) &&
                                                'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                                !isToday(day) &&
                                                'bg-gray-900',
                                            !isEqual(day, selectedDay) &&
                                                'hover:bg-gray-200',
                                            (isEqual(day, selectedDay) ||
                                                isToday(day)) &&
                                                'font-semibold',
                                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                        )}
                                    >
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                        >
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {trainings.some((training) =>
                                            isSameDay(
                                                parseISO(
                                                    training.startDatetime
                                                ),
                                                day
                                            )
                                        ) && (
                                            <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14">
                        <h2 className="font-semibold text-gray-900">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {selectedDayTrainings.length > 0 ? (
                                selectedDayTrainings.map((training) => (
                                    <Training
                                        training={training}
                                        key={training.id}
                                    />
                                ))
                            ) : (
                                <p>No trainings for today.</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    );
}

function Training({ training }) {
    let startDateTime = parseISO(training.startDatetime);

    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            <img
                src={training.imageUrl}
                alt=""
                className="flex-none w-10 h-10 rounded-full"
            />
            <div className="flex-auto items-center">
                <p className="text-gray-900">{training.name}</p>
                <p className="mt-0.5">
                    <time dateTime={training.startDatetime}>
                        {format(startDateTime, 'h:mm a')}
                    </time>
                    {' - '}
                    {training.duration} min
                </p>
            </div>

            <div className="flex-auto items-center">
                <p className="text-gray-900">{training.training}</p>
                <p>Places left: {training.places}</p>
            </div>
            <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    );
}

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
];
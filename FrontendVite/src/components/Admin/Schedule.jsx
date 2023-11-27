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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Training from '../Schedule/Training';
import '../Schedule/schedule.css';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Schedule() {
    const trainings = useSelector(({ trainings }) => trainings);
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
        <div>
            <div className="container">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="calendar">
                        <div className="calendar-navbar">
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
                        <div className="days-grid">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="calendar-body">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && first[getDay(day)],
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
                    <section className="trainings-section">
                        <h2 className="font-semibold text-gray-900">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="trainings-list">
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

let first = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
];

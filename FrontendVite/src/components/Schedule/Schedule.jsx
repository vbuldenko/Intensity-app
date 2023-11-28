import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import MonthView from './Month';
import WeekView from './Week';
import Training from './Training';
import './schedule.css';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Schedule() {
    const trainings = useSelector(({ trainings }) => trainings);
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [scheduleView, setScheduleView] = useState('month');
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const selectedDayTrainings = trainings
        .filter((training) => isSameDay(parseISO(training.date), selectedDay))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    function handleViewChange(event) {
        setScheduleView(event.target.value);
    }

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    const colStartClasses = [
        '',
        'col-start-2',
        'col-start-3',
        'col-start-4',
        'col-start-5',
        'col-start-6',
        'col-start-7',
    ];

    return (
        <div className="pt-16">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200 ">
                    <div className="calendar">
                        <div className="calendar-navbar">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                className="calendar-navbar-button"
                                onClick={previousMonth}
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            <button
                                className="calendar-navbar-button"
                                onClick={nextMonth}
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                            <select
                                id="view"
                                name="view"
                                value={scheduleView}
                                onChange={handleViewChange}
                            >
                                <option value="month">Month</option>
                                <option value="week">Week</option>
                            </select>
                        </div>
                        <div className="week-days-names">
                            <div>SUN</div>
                            <div>MON</div>
                            <div>TUE</div>
                            <div>WED</div>
                            <div>THU</div>
                            <div>FRI</div>
                            <div>SAT</div>
                        </div>
                        {scheduleView === 'month' ? (
                            <MonthView
                                days={days}
                                firstDayCurrentMonth={firstDayCurrentMonth}
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                classNames={classNames}
                                trainings={trainings}
                                colStartClasses={colStartClasses}
                            />
                        ) : (
                            <WeekView
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                classNames={classNames}
                                trainings={trainings}
                                colStartClasses={colStartClasses}
                            />
                        )}
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

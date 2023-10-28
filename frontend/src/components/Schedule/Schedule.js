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
import MonthView from './Month';
import WeekView from './Week';
import Training from './Training';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Schedule({ trainings }) {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [scheduleView, setScheduleView] = useState('month');
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const selectedDayTrainings = trainings.filter((training) =>
        isSameDay(parseISO(training.date), selectedDay)
    );

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
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
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
                                selectedDayTrainings={selectedDayTrainings}
                                classNames={classNames}
                                trainings={trainings}
                                colStartClasses={colStartClasses}
                            />
                        ) : (
                            <WeekView
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                selectedDayTrainings={selectedDayTrainings}
                                classNames={classNames}
                                trainings={trainings}
                                colStartClasses={colStartClasses}
                            />
                        )}
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
                                        classNames={classNames}
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

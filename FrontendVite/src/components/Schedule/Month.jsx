import {
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
} from 'date-fns';

export default function MonthView({
    days,
    firstDayCurrentMonth,
    selectedDay,
    setSelectedDay,
    selectedDayTrainings,
    classNames,
    trainings,
    colStartClasses,
}) {
    return (
        <div className="grid grid-cols-7 mt-2 text-sm ">
            {days.map((day, dayIdx) => (
                <div
                    key={day.toString()}
                    className={classNames(
                        dayIdx === 0 && colStartClasses[getDay(day)],
                        'py-1.5'
                    )}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={classNames(
                            isEqual(day, selectedDay) && 'text-white',
                            !isEqual(day, selectedDay) &&
                                isToday(day) &&
                                'text-red-500',
                            !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                isSameMonth(day, firstDayCurrentMonth) &&
                                'text-gray-900',
                            !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                !isSameMonth(day, firstDayCurrentMonth) &&
                                'text-gray-400',
                            isEqual(day, selectedDay) &&
                                isToday(day) &&
                                'bg-red-500',
                            isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                'bg-gray-900',
                            !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                            (isEqual(day, selectedDay) || isToday(day)) &&
                                'font-semibold',
                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                        )}
                    >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'd')}
                        </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                        {trainings.some((training) =>
                            isSameDay(parseISO(training.date), day)
                        ) && (
                            <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

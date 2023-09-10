import { useState } from 'react';
import './admin-schedule.css'; // Import your CSS styles

const Schedule = () => {
    // Sample data for day, week, and month views
    const daySchedule = [
        { time: '09:00 AM', training: 'Training A' },
        { time: '11:00 AM', training: 'Training B' },
        // Add more day schedule items
    ];

    const weekSchedule = [
        { day: 'Monday', training: 'Training A' },
        { day: 'Tuesday', training: 'Training B' },
        // Add more week schedule items
    ];

    const monthSchedule = [
        { date: '2023-09-10', training: 'Training A' },
        { date: '2023-09-11', training: 'Training B' },
        // Add more month schedule items
    ];

    const [view, setView] = useState('week'); // Default view is 'week'
    const [activeDate, setActiveDate] = useState(new Date()); // Default active date is today

    // Filter options
    const [trainingTypeFilter, setTrainingTypeFilter] = useState('All');
    const [trainerFilter, setTrainerFilter] = useState('All');

    // Helper function to get days of the week
    const getDaysOfWeek = () => {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        return days.map((day) => (
            <div
                key={day}
                className={`day-of-week ${
                    activeDate.getDay() === days.indexOf(day) ? 'active' : ''
                }`}
            >
                {day}
            </div>
        ));
    };

    // Helper function to render schedule items
    const renderScheduleItems = () => {
        let scheduleData = [];

        // Set the scheduleData based on the selected view
        if (view === 'day') {
            scheduleData = daySchedule;
        } else if (view === 'week') {
            scheduleData = weekSchedule;
        } else if (view === 'month') {
            scheduleData = monthSchedule;
        }

        return scheduleData.map((item, index) => (
            <div key={index} className="schedule-item">
                {view === 'day' && <p className="time">{item.time}</p>}
                {view !== 'day' && (
                    <p className="day">{item.day || item.date}</p>
                )}
                <p className="training">{item.training}</p>
            </div>
        ));
    };

    return (
        <div className="schedule-container">
            <h1>Schedule</h1>

            {/* Filters */}
            <div className="filters">
                <div className="filter">
                    <label>Training Type:</label>
                    <select
                        value={trainingTypeFilter}
                        onChange={(e) => setTrainingTypeFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Training A">Training A</option>
                        <option value="Training B">Training B</option>
                        {/* Add more training types */}
                    </select>
                </div>
                <div className="filter">
                    <label>Trainer:</label>
                    <select
                        value={trainerFilter}
                        onChange={(e) => setTrainerFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Trainer X">Trainer X</option>
                        <option value="Trainer Y">Trainer Y</option>
                        {/* Add more trainers */}
                    </select>
                </div>
            </div>

            {/* View Selector */}
            <div className="view-selector">
                <button
                    className={view === 'day' ? 'active' : ''}
                    onClick={() => setView('day')}
                >
                    Day
                </button>
                <button
                    className={view === 'week' ? 'active' : ''}
                    onClick={() => setView('week')}
                >
                    Week
                </button>
                <button
                    className={view === 'month' ? 'active' : ''}
                    onClick={() => setView('month')}
                >
                    Month
                </button>
            </div>

            {/* Days of the Week */}
            <div className="days-of-week">{getDaysOfWeek()}</div>

            {/* Schedule */}
            <div className="schedule">{renderScheduleItems()}</div>
        </div>
    );
};

export default Schedule;

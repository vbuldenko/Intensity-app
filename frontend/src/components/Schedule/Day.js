import format from 'date-fns/format';
export default function Day({ getEndOfDay, currentDate }) {
    const hours = getEndOfDay(currentDate);

    return (
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Event</th>
                </tr>
            </thead>
            <tbody>
                {hours.map((hour) => (
                    <tr key={hour}>
                        <td>{format(hour, 'h:mm a')}</td>
                        <td>{/* TODO: Render events for the hour */}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

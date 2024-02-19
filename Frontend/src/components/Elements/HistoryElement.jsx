export default function HistoryElement({ data, trainer }) {
    return (
        <div className="history-element card-el-bg">
            <div>
                <p>Date</p>
                <p>{data.date.slice(0, 10)}</p>
            </div>
            <div>
                <p>Time</p>
                <p>{data.time}</p>
            </div>

            <div>
                <p>Class</p>
                <p>{data.type}</p>
            </div>
            {trainer ? (
                <div>
                    <p>Visitors</p>
                    <p>{data.registeredClients.length}</p>
                </div>
            ) : (
                <div>
                    <p>Trainer</p>
                    <p>{data.instructor.surname}</p>
                </div>
            )}

            {data.deducted ? (
                <div>
                    <p
                        style={{
                            color: 'red',
                            border: '1px solid red',
                            borderRadius: '0.5em',
                            padding: '0.25em',
                        }}
                    >
                        deducted: {data.deduction_reason}
                    </p>
                </div>
            ) : null}
        </div>
    );
}

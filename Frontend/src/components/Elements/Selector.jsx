function Selector({ selection, handleSelection, buttonNames }) {
    return (
        <div
            className="card-el-bg s-font"
            style={{
                lineHeight: '1',
                padding: '0.2rem',
                borderRadius: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {buttonNames.map((buttonName, index) => (
                <button
                    key={index}
                    style={{
                        padding: '0.5rem',
                        minWidth: '75px',
                        width: '150px',
                        textAlign: 'center',
                        borderRadius: '0.75rem',
                        color:
                            selection === buttonName
                                ? 'white'
                                : 'var(--gray-color-1)',
                        background:
                            selection === buttonName && 'var(--green-color)',
                        // boxShadow:
                        //     selection === buttonName &&
                        //     'var(--card-element-shadow3)',
                    }}
                    onClick={() => handleSelection(buttonName)}
                >
                    {buttonName}
                </button>
            ))}
        </div>
    );
}

export default Selector;

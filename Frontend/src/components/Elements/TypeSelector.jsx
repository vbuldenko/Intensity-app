function TypeSelector({ selectedType, handleTypeChange }) {
    return (
        <div className="type-buttons card-el-bg s-font">
            <button
                className={selectedType === 'group' ? 'selected' : ''}
                onClick={() => handleTypeChange('group')}
            >
                Group
            </button>
            <button
                className={selectedType === 'personal' ? 'selected' : ''}
                onClick={() => handleTypeChange('personal')}
            >
                Personal
            </button>
            <button
                className={selectedType === 'split' ? 'selected' : ''}
                onClick={() => handleTypeChange('split')}
            >
                Split
            </button>
            <button
                className={selectedType === 'kids' ? 'selected' : ''}
                onClick={() => handleTypeChange('kids')}
            >
                Kids
            </button>
        </div>
    );
}

export default TypeSelector;

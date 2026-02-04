export const Controls = ({ tonic, setTonic, scaleType, setScaleType, notes, scales }) => {
    return (
        <div className="controls">
            <div className="control-group">
                <select value={tonic} onChange={(e) => setTonic(e.target.value)}>
                    {notes.map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>

            <div className="control-group">
                <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                    {Object.entries(scales).map(([key, scale]) => (
                        <option key={key} value={key}>{scale.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

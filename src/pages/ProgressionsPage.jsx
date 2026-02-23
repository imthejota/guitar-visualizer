import { useState, useMemo } from 'react';
import { Fretboard } from '../components/Fretboard';
import { detectChord, generateProgression } from '../utils/musicTheory';
import './ProgressionsPage.css';

export const ProgressionsPage = () => {
    // Array of { stringIndex, fretIndex, note }
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [mood, setMood] = useState('Happy');
    const [length, setLength] = useState(4);
    const [generatedProgression, setGeneratedProgression] = useState([]);

    const handleFretClick = (stringIndex, fretIndex, note) => {
        setSelectedPositions(prev => {
            // Check if the exact position is already selected (to toggle off)
            const existingPosIndex = prev.findIndex(p => p.stringIndex === stringIndex && p.fretIndex === fretIndex);

            if (existingPosIndex !== -1) {
                // If it exists, remove it
                return prev.filter((_, idx) => idx !== existingPosIndex);
            } else {
                // If it doesn't exist, remove any other selection on the SAME string, then add this one
                const filtered = prev.filter(p => p.stringIndex !== stringIndex);
                return [...filtered, { stringIndex, fretIndex, note }];
            }
        });
        // Clear progression when changing input
        setGeneratedProgression([]);
    };

    const handleClearAll = () => {
        setSelectedPositions([]);
        setGeneratedProgression([]);
    };

    const detectedChordName = useMemo(() => {
        if (selectedPositions.length === 0) return null;

        // Sort positions by stringIndex descending (6th string/Low E is index 5, 1st string/High E is index 0)
        // This gives us notes from lowest pitch to highest pitch.
        const sortedPositions = [...selectedPositions].sort((a, b) => b.stringIndex - a.stringIndex);
        const notes = sortedPositions.map(p => p.note);

        return detectChord(notes);
    }, [selectedPositions]);

    const isChordValid = detectedChordName && !detectedChordName.startsWith('Custom Chord') && detectedChordName !== 'No Notes Selected' && detectedChordName !== 'Interval';

    const handleGenerate = () => {
        if (!isChordValid) return;
        const progression = generateProgression(detectedChordName, mood, length);
        setGeneratedProgression(progression);
    };

    return (
        <div className="page-container progressions-page">
            <div className="progressions-header">
                <h2>Chord Progressions</h2>
                <p>Build a starting chord on the fretboard, pick a mood, and generate a progression.</p>
            </div>

            <div className="input-section">
                <div className="chord-display-section">
                    <div className="detected-chord">
                        {detectedChordName || 'Select notes to build a chord'}
                    </div>
                    {detectedChordName && !isChordValid && (
                        <div className="invalid-warning">Please build a standard triad or 7th chord</div>
                    )}
                    <button className="clear-btn" onClick={handleClearAll} disabled={selectedPositions.length === 0}>
                        Clear Fretboard
                    </button>
                </div>

                <div className="controls generator-controls">
                    <div className="control-group">
                        <label>Mood</label>
                        <select value={mood} onChange={(e) => setMood(e.target.value)} disabled={!isChordValid}>
                            <option value="Happy">Happy</option>
                            <option value="Sad">Sad</option>
                            <option value="Epic">Epic</option>
                            <option value="Mysterious">Mysterious</option>
                            <option value="Jazzy">Jazzy</option>
                        </select>
                    </div>
                    <div className="control-group">
                        <label>Length</label>
                        <select value={length} onChange={(e) => setLength(Number(e.target.value))} disabled={!isChordValid}>
                            <option value={3}>3 Chords</option>
                            <option value={4}>4 Chords</option>
                            <option value={5}>5 Chords</option>
                            <option value={8}>8 Chords</option>
                        </select>
                    </div>
                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={!isChordValid}
                    >
                        Generate Progression
                    </button>
                </div>
            </div>

            {generatedProgression.length > 0 && (
                <div className="progression-results">
                    <h3>Your Progression</h3>
                    <div className="progression-cards">
                        {generatedProgression.map((chord, index) => (
                            <div key={index} className="chord-card">
                                <span className="chord-number">{index + 1}</span>
                                <span className="chord-name">{chord}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="fretboard-container">
                <Fretboard
                    selectedPositions={selectedPositions}
                    onFretClick={handleFretClick}
                    showLabels={true}
                />
            </div>
        </div>
    );
};

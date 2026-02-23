import { useState, useMemo } from 'react';
import { Fretboard } from '../components/Fretboard';
import { detectChord, NOTES } from '../utils/musicTheory';
import './ChordsPage.css';

const STRING_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'].reverse();

export const ChordsPage = () => {
    // Array of { stringIndex, fretIndex, note }
    const [selectedPositions, setSelectedPositions] = useState([]);

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
    };

    const handleClearAll = () => {
        setSelectedPositions([]);
    };

    const detectedChordName = useMemo(() => {
        if (selectedPositions.length === 0) return 'Select notes on the fretboard';

        // Sort positions by stringIndex descending (6th string/Low E is index 5, 1st string/High E is index 0)
        // This gives us notes from lowest pitch to highest pitch.
        const sortedPositions = [...selectedPositions].sort((a, b) => b.stringIndex - a.stringIndex);
        const notes = sortedPositions.map(p => p.note);

        return detectChord(notes);
    }, [selectedPositions]);

    return (
        <div className="page-container chords-page">
            <div className="chords-header">
                <h2>Chord Detector</h2>
                <p>Click on the fretboard to add notes. The detected chord will appear below.</p>
            </div>

            <div className="chord-display-section">
                <div className="detected-chord">{detectedChordName}</div>
                <button className="clear-btn" onClick={handleClearAll} disabled={selectedPositions.length === 0}>
                    Clear All
                </button>
            </div>

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

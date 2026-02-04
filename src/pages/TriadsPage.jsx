import { useState } from 'react';
import { Controls } from '../components/Controls';
import { Fretboard } from '../components/Fretboard';
import { NOTES, TRIADS, getTriadNotes } from '../utils/musicTheory';

export const TriadsPage = () => {
    const [tonic, setTonic] = useState('C');
    const [triadType, setTriadType] = useState('major');

    // getTriadNotes returns the notes of the triad
    const activeNotes = getTriadNotes(tonic, triadType);

    return (
        <div className="page-container">
            <h2>Triads</h2>
            <Controls
                tonic={tonic}
                setTonic={setTonic}
                scaleType={triadType}
                setScaleType={setTriadType}
                notes={NOTES}
                scales={TRIADS}
            />

            <div className="fretboard-container">
                <Fretboard activeNotes={activeNotes} tonic={tonic} fretCount={20} />
            </div>

            <div className="current-scale-info" style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
                <p>Current Triad: <strong style={{ color: 'var(--primary-color)' }}>{tonic} {TRIADS[triadType].name}</strong></p>
                <p>Notes: {activeNotes.join(' - ')}</p>
            </div>
        </div>
    );
};

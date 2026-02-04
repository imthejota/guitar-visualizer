import { useState, useRef } from 'react';
import { Controls } from '../components/Controls';
import { Fretboard } from '../components/Fretboard';
import { NOTES, TRIADS, getTriadNotes } from '../utils/musicTheory';
import { ExportButton } from '../components/ExportButton';

export const TriadsPage = () => {
    const [tonic, setTonic] = useState('C');
    const [triadType, setTriadType] = useState('major');
    const contentRef = useRef(null);

    // getTriadNotes returns the notes of the triad
    const activeNotes = getTriadNotes(tonic, triadType);

    return (
        <div className="page-container">
            <Controls
                tonic={tonic}
                setTonic={setTonic}
                scaleType={triadType}
                setScaleType={setTriadType}
                notes={NOTES}
                scales={TRIADS}
            />

            <div ref={contentRef} style={{ padding: '20px', backgroundColor: '#121212' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{tonic} {TRIADS[triadType].name} Triad</h2>
                <div className="fretboard-container">
                    <Fretboard activeNotes={activeNotes} tonic={tonic} fretCount={20} />
                </div>

                <div className="current-scale-info" style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    <p>Notes: {activeNotes.join(' - ')}</p>
                </div>
            </div>

            <ExportButton targetRef={contentRef} fileName={`${tonic}-${TRIADS[triadType].name}-Triad`} />
        </div>
    );
};

import { useState } from 'react';
import { Controls } from '../components/Controls';
import { Fretboard } from '../components/Fretboard';
import { NOTES, SCALES, getScaleNotes, getHarmonization } from '../utils/musicTheory';
import '../components/Harmonization.css';

export const ScalesPage = () => {
    const [tonic, setTonic] = useState('C');
    const [scaleType, setScaleType] = useState('major');

    const activeNotes = getScaleNotes(tonic, scaleType);

    return (
        <div className="page-container">
            <h2>Scales & Modes</h2>
            <Controls
                tonic={tonic}
                setTonic={setTonic}
                scaleType={scaleType}
                setScaleType={setScaleType}
                notes={NOTES}
                scales={SCALES}
            />

            <div className="fretboard-container">
                <Fretboard activeNotes={activeNotes} tonic={tonic} />
            </div>

            <div className="current-scale-info" style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
                <p>Current Scale: <strong style={{ color: 'var(--primary-color)' }}>{tonic} {SCALES[scaleType].name}</strong></p>
                <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                    <table className="harmonization-table">
                        <thead>
                            <tr>
                                <th>Degree</th>
                                <th>Note</th>
                                <th>Roman</th>
                                <th>Chord</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getHarmonization(tonic, scaleType).map((row) => (
                                <tr key={row.degree}>
                                    <td>{row.degree}</td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{row.note}</td>
                                    <td>{row.roman}</td>
                                    <td>{row.chord}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

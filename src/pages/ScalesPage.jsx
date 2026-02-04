import { useState, useRef } from 'react';
import { Controls } from '../components/Controls';
import { Fretboard } from '../components/Fretboard';
import { NOTES, SCALES, getScaleNotes, getHarmonization } from '../utils/musicTheory';
import { ExportButton } from '../components/ExportButton';
import '../components/Harmonization.css';

export const ScalesPage = () => {
    const [tonic, setTonic] = useState('C');
    const [scaleType, setScaleType] = useState('major');
    const contentRef = useRef(null);

    const activeNotes = getScaleNotes(tonic, scaleType);

    return (
        <div className="page-container">
            <Controls
                tonic={tonic}
                setTonic={setTonic}
                scaleType={scaleType}
                setScaleType={setScaleType}
                notes={NOTES}
                scales={SCALES}
            />

            <ExportButton targetRef={contentRef} fileName={`${tonic}-${SCALES[scaleType].name}-Scale`} />

            <div ref={contentRef} style={{ padding: '20px', backgroundColor: '#121212' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{tonic} {SCALES[scaleType].name}</h2>
                <Fretboard activeNotes={activeNotes} tonic={tonic} />

                <div className="current-scale-info" style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
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
        </div>
    );
};

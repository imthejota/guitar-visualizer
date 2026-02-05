import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleOfFifths } from '../components/CircleOfFifths';
import { getHarmonization } from '../utils/musicTheory';

export const CircleOfFifthsPage = () => {
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const navigate = useNavigate();

    const harmonization = useMemo(() => {
        if (!selectedKey || !selectedType) return null;
        const tonic = selectedKey.split('/')[0]; // Handle enharmonic keys like F#/Gb
        const scaleType = selectedType === 'major' ? 'major' : 'minor';
        return getHarmonization(tonic, scaleType);
    }, [selectedKey, selectedType]);

    const handleKeySelect = (key, type) => {
        setSelectedKey(key);
        setSelectedType(type);
    };

    const handleViewScale = () => {
        if (selectedKey) {
            // Navigate to scales page with the selected key
            // For now, just navigate to scales - we can add state passing later
            navigate('/', { state: { tonic: selectedKey.split('/')[0], scaleType: selectedType === 'major' ? 'major' : 'minor' } });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>
                Circle of Fifths
            </h2>

            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
                Click on any key to explore its scale and relationships
            </p>

            <CircleOfFifths
                onKeySelect={handleKeySelect}
                selectedKey={selectedKey}
                harmonization={harmonization}
            />

            {selectedKey && (
                <div style={{
                    marginTop: '3rem',
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'var(--surface-color)',
                    borderRadius: '12px'
                }}>
                    <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>
                        Selected: {selectedKey} {selectedType === 'major' ? 'Major' : 'Minor'}
                    </h3>

                    <button
                        onClick={handleViewScale}
                        style={{
                            padding: '0.8em 2em',
                            fontSize: '1.1em',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--primary-color)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        View Scale on Fretboard →
                    </button>
                </div>
            )}

            <div style={{
                marginTop: '3rem',
                padding: '1.5rem',
                background: 'rgba(187, 134, 252, 0.1)',
                borderRadius: '8px',
                borderLeft: '4px solid var(--primary-color)'
            }}>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>How to use:</h4>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <li><strong>Outer ring:</strong> Major keys</li>
                    <li><strong>Inner ring:</strong> Relative minor keys</li>
                    <li><strong>Clockwise:</strong> Moving up by fifths (adding sharps)</li>
                    <li><strong>Counter-clockwise:</strong> Moving down by fifths (adding flats)</li>
                </ul>
            </div>
        </div>
    );
};

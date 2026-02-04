import { useState, useEffect } from 'react';
import { Fretboard } from '../components/Fretboard';
import { NOTES } from '../utils/musicTheory';

const STRING_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']; // Same as Fretboard
const QUIZ_FRET_LIMIT = 12; // Limit quiz to first 12 frets for ease

export const QuizPage = () => {
    const [target, setTarget] = useState(null);
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('Guess the note shown on the fretboard!');
    const [status, setStatus] = useState('guessing'); // 'guessing', 'correct', 'revealed', 'wrong'
    const [score, setScore] = useState({ correct: 0, attempts: 0 });

    const generateQuestion = () => {
        const stringIndex = Math.floor(Math.random() * 6);
        const fretIndex = Math.floor(Math.random() * (QUIZ_FRET_LIMIT + 1));

        // Calculate note
        const stringNote = STRING_TUNING[stringIndex];
        const stringNoteIndex = NOTES.indexOf(stringNote);
        const note = NOTES[(stringNoteIndex + fretIndex) % 12];

        setTarget({
            stringIndex,
            fretIndex,
            note
        });
        setInput('');
        setMessage('New note! Type your guess...');
        setStatus('guessing');
    };

    // Initial load
    useEffect(() => {
        generateQuestion();
    }, []);

    const handleCheck = (e) => {
        e.preventDefault();
        if (!target || status === 'correct') return;

        const guess = input.trim().toLowerCase();
        // Target note often looks like "C#/Db"
        // We splits by "/" and check if guess matches either part
        const validAnswers = target.note.toLowerCase().split('/');

        if (validAnswers.includes(guess)) {
            setStatus('correct');
            setMessage(`Great! It is ${target.note}.`);
            setScore(prev => ({ ...prev, correct: prev.correct + 1, attempts: prev.attempts + 1 }));
            // Auto next after slight delay? No, user requested "following note to input" implicitly by "Great" message -> wait for user action? 
            // prompt said: "If it's ok, it should display a Great! message, and the the following note to input the name."
            // This implies immediate next question or close to it. Let's add a "Next" button or auto-timer.
            // Let's add a "Next" button for clarity.
        } else {
            setStatus('wrong');
            setMessage('Wrong! Try again or reveal.');
            setScore(prev => ({ ...prev, attempts: prev.attempts + 1 }));
        }
    };

    const handleReveal = () => {
        setStatus('revealed');
        setMessage(`The note is ${target.note}.`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Fretboard Quiz</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span>Score: {score.correct} / {score.attempts}</span>
                <span>Accuracy: {score.attempts > 0 ? Math.round((score.correct / score.attempts) * 100) : 0}%</span>
            </div>

            <div className="fretboard-container" style={{ marginBottom: '2rem' }}>
                <Fretboard
                    activeNotes={[]}
                    tonic={null}
                    targetPosition={target}
                    showLabels={status === 'correct' || status === 'revealed'}
                    fretCount={15}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{
                    fontSize: '1.2rem',
                    color: status === 'correct' ? 'var(--secondary-color)' : status === 'wrong' ? '#ff4444' : 'white',
                    fontWeight: 'bold',
                    height: '1.5em'
                }}>
                    {message}
                </p>

                {status === 'correct' ? (
                    <button
                        onClick={generateQuestion}
                        style={{
                            padding: '10px 30px',
                            fontSize: '1.2rem',
                            background: 'var(--secondary-color)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'black',
                            fontWeight: 'bold'
                        }}
                        autoFocus
                    >
                        Next Note ➔
                    </button>
                ) : (
                    <form onSubmit={handleCheck} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type note (e.g. C, F#)"
                            style={{
                                padding: '10px',
                                fontSize: '1.1rem',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: 'var(--surface-color)',
                                color: 'white',
                                width: '200px',
                                textAlign: 'center'
                            }}
                            autoFocus
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            Check
                        </button>
                    </form>
                )}

                {(status === 'guessing' || status === 'wrong') && (
                    <button
                        onClick={handleReveal}
                        style={{
                            background: 'transparent',
                            border: '1px solid #444',
                            color: '#888',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Reveal Answer
                    </button>
                )}
                {status === 'revealed' && (
                    <button
                        onClick={generateQuestion}
                        style={{
                            padding: '10px 20px',
                            background: '#444',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}
                    >
                        Next Note
                    </button>
                )}
            </div>
        </div>
    );
};

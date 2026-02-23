import { NOTES } from '../utils/musicTheory';

// Standard Tuning: E A D G B E
const STRINGS = ['E', 'A', 'D', 'G', 'B', 'E'].reverse(); // Top to bottom visually usually means High E first or Low E first? 
// Actually physically: Bottom string is Low E (Thickest). Top string is High E (Thinnnest).
// On screen, usually Low E is at the bottom (or top depending on preference). 
// Let's standard: Top line = High E (1st string), Bottom line = Low E (6th string).
const STRING_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

export const Fretboard = ({ activeNotes = [], tonic, fretCount = 24, targetPosition = null, selectedPositions = [], onFretClick, showLabels = true }) => {
    const FRET_COUNT = fretCount;

    const getNoteAtFret = (stringNote, fret) => {
        const stringNoteIndex = NOTES.indexOf(stringNote);
        return NOTES[(stringNoteIndex + fret) % 12];
    };

    return (
        <div className="fretboard">
            <div className="fretboard-neck">
                {STRING_TUNING.map((stringNote, stringIndex) => (
                    <div key={stringIndex} className="string">
                        {/* Render Frets for this string */}
                        {Array.from({ length: FRET_COUNT + 1 }).map((_, fretIndex) => {
                            const note = getNoteAtFret(stringNote, fretIndex);

                            // Check active state logic
                            let isActive = false;

                            // 1. Single strict target position (used in Quiz)
                            if (targetPosition) {
                                isActive = targetPosition.stringIndex === stringIndex && targetPosition.fretIndex === fretIndex;
                            }
                            // 2. Specific selected positions (used in Chords module)
                            else if (selectedPositions.length > 0) {
                                isActive = selectedPositions.some(
                                    pos => pos.stringIndex === stringIndex && pos.fretIndex === fretIndex
                                );
                            }
                            // 3. Fallback to activeNotes array inclusion (Scales & Triads modules)
                            else {
                                isActive = activeNotes.includes(note);
                            }

                            const isTonic = note === tonic;

                            // Fret click handler
                            const handleFretClick = () => {
                                if (onFretClick) {
                                    onFretClick(stringIndex, fretIndex, note);
                                }
                            };

                            return (
                                <div
                                    key={fretIndex}
                                    className={`fret-cell ${fretIndex === 0 ? 'open-string' : ''} ${onFretClick ? 'clickable' : ''}`}
                                    onClick={handleFretClick}
                                    style={{ cursor: onFretClick ? 'pointer' : 'default' }}
                                >
                                    {/* String Line */}
                                    <div className="string-line"></div>

                                    {/* Fret Bar (Visual) */}
                                    {fretIndex > 0 && <div className="fret-bar"></div>}

                                    {/* Note Dot */}
                                    {isActive && (
                                        <div className={`note-dot ${isTonic && !targetPosition && selectedPositions.length === 0 ? 'tonic' : ''}`}>
                                            {showLabels ? note : '?'}
                                        </div>
                                    )}

                                    {/* Fret Marker Dots (Single/Double) */}
                                    {stringIndex === 2 && [3, 5, 7, 9, 15, 17, 19, 21].includes(fretIndex) && <div className="fret-marker single"></div>}
                                    {stringIndex === 2 && [12, 24].includes(fretIndex) && <div className="fret-marker double"></div>}
                                    {/* NOTE: Markers usually span strings or are on the board. 
                       CSS implementation strategy: simple markers on a specific "layer" or simplified per cell.
                       Let's put markers in the middle (between 3rd and 4th string visually, or just on 3rd string).
                   */}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="fret-numbers">
                {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
                    <div key={i} className="fret-number">{i === 0 ? 'Open' : i}</div>
                ))}
            </div>
        </div>
    );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CircleOfFifths.css';

const CIRCLE_DATA = [
    { major: 'C', minor: 'A', angle: -15 },
    { major: 'G', minor: 'E', angle: 15 },
    { major: 'D', minor: 'B', angle: 45 },
    { major: 'A', minor: 'F#/Gb', angle: 75 },
    { major: 'E', minor: 'C#/Db', angle: 105 },
    { major: 'B', minor: 'G#/Ab', angle: 135 },
    { major: 'F#/Gb', minor: 'D#/Eb', angle: 165 },
    { major: 'C#/Db', minor: 'A#/Bb', angle: 195 },
    { major: 'G#/Ab', minor: 'F', angle: 225 },
    { major: 'D#/Eb', minor: 'C', angle: 255 },
    { major: 'A#/Bb', minor: 'G', angle: 285 },
    { major: 'F', minor: 'D', angle: 315 }
];

export const CircleOfFifths = ({ onKeySelect, selectedKey, harmonization }) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);

    const createSegmentPath = (angle, isOuter) => {
        const centerX = 200;
        const centerY = 200;
        const outerRadius = isOuter ? 180 : 130;
        const innerRadius = isOuter ? 130 : 80;
        const angleSpan = 30;

        const startAngle = (angle - 90) * (Math.PI / 180);
        const endAngle = (angle + angleSpan - 90) * (Math.PI / 180);

        const x1 = centerX + outerRadius * Math.cos(startAngle);
        const y1 = centerY + outerRadius * Math.sin(startAngle);
        const x2 = centerX + outerRadius * Math.cos(endAngle);
        const y2 = centerY + outerRadius * Math.sin(endAngle);
        const x3 = centerX + innerRadius * Math.cos(endAngle);
        const y3 = centerY + innerRadius * Math.sin(endAngle);
        const x4 = centerX + innerRadius * Math.cos(startAngle);
        const y4 = centerY + innerRadius * Math.sin(startAngle);

        return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
    };

    const getTextPosition = (angle, isOuter) => {
        const centerX = 200;
        const centerY = 200;
        const radius = isOuter ? 155 : 105;
        const midAngle = (angle + 15 - 90) * (Math.PI / 180);

        return {
            x: centerX + radius * Math.cos(midAngle),
            y: centerY + radius * Math.sin(midAngle)
        };
    };

    // Helper function to find Roman numeral for a given note
    const getRomanNumeralForNote = (noteName) => {
        if (!harmonization) return null;

        const harmChord = harmonization.find(h => {
            const chordNote = h.chord.split(' ')[0]; // Extract note (e.g., "C" from "C Major")
            // Handle enharmonic equivalents
            return noteName.split('/').some(n => chordNote.includes(n)) ||
                chordNote.split('/').some(n => noteName.includes(n));
        });

        return harmChord ? harmChord.roman : null;
    };

    return (
        <svg viewBox="0 0 400 400" className="circle-of-fifths">
            {/* Outer ring - Major keys */}
            {CIRCLE_DATA.map((segment, index) => {
                const isSelected = selectedKey === segment.major;
                const isHovered = hoveredSegment === `major-${index}`;
                const textPos = getTextPosition(segment.angle, true);
                const romanNumeral = selectedKey ? getRomanNumeralForNote(segment.major) : null;

                return (
                    <g key={`major-${index}`}>
                        <path
                            d={createSegmentPath(segment.angle, true)}
                            className={`segment outer ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredSegment(`major-${index}`)}
                            onMouseLeave={() => setHoveredSegment(null)}
                            onClick={() => onKeySelect(segment.major, 'major')}
                        />
                        <text
                            x={textPos.x}
                            y={textPos.y}
                            className="segment-text"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            pointerEvents="none"
                        >
                            {segment.major}
                        </text>
                        {romanNumeral && (
                            <text
                                x={textPos.x}
                                y={textPos.y + 18}
                                className="roman-numeral"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                pointerEvents="none"
                            >
                                {romanNumeral}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Inner ring - Minor keys */}
            {CIRCLE_DATA.map((segment, index) => {
                const minorKey = segment.minor;
                const isSelected = selectedKey === minorKey;
                const isHovered = hoveredSegment === `minor-${index}`;
                const textPos = getTextPosition(segment.angle, false);
                const romanNumeral = selectedKey ? getRomanNumeralForNote(minorKey) : null;

                return (
                    <g key={`minor-${index}`}>
                        <path
                            d={createSegmentPath(segment.angle, false)}
                            className={`segment inner ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredSegment(`minor-${index}`)}
                            onMouseLeave={() => setHoveredSegment(null)}
                            onClick={() => onKeySelect(minorKey, 'minor')}
                        />
                        <text
                            x={textPos.x}
                            y={textPos.y}
                            className="segment-text minor"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            pointerEvents="none"
                        >
                            {minorKey}
                        </text>
                        {romanNumeral && (
                            <text
                                x={textPos.x}
                                y={textPos.y + 15}
                                className="roman-numeral"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                pointerEvents="none"
                            >
                                {romanNumeral}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Center circle */}
            <circle cx="200" cy="200" r="75" className="center-circle" />
            <text x="200" y="195" className="center-text" textAnchor="middle">Circle of</text>
            <text x="200" y="215" className="center-text" textAnchor="middle">Fifths</text>
        </svg>
    );
};

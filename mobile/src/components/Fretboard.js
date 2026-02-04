import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NOTES } from '../utils/musicTheory';

const STRING_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];
const FRET_COUNT = 24;

export const Fretboard = ({ activeNotes, tonic }) => {
    const getNoteAtFret = (stringNote, fret) => {
        const stringNoteIndex = NOTES.indexOf(stringNote);
        return NOTES[(stringNoteIndex + fret) % 12];
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollView}>
                <View style={styles.neck}>
                    {/* Fret Numbers Row */}
                    <View style={styles.fretNumberRow}>
                        {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
                            <Text key={i} style={[styles.fretNumber, i === 0 && styles.openFretNumber]}>
                                {i === 0 ? 'Op' : i}
                            </Text>
                        ))}
                    </View>

                    {/* Strings */}
                    {STRING_TUNING.map((stringNote, stringIndex) => (
                        <View key={stringIndex} style={styles.stringRow}>
                            {Array.from({ length: FRET_COUNT + 1 }).map((_, fretIndex) => {
                                const note = getNoteAtFret(stringNote, fretIndex);
                                // Check if current note matches any in activeNotes (handling simple matching for mobile)
                                // Note: activeNotes might contain "C#/Db" but helper returns "C#/Db" so exact match works.
                                const isActive = activeNotes.includes(note);
                                const isTonic = note === tonic;

                                return (
                                    <View key={fretIndex} style={[styles.fretCell, fretIndex === 0 && styles.openFretCell]}>
                                        {/* String Line */}
                                        <View style={[styles.stringLine, { height: stringIndex > 2 ? 2 : 1 }]} />

                                        {/* Fret Wire */}
                                        {fretIndex > 0 && <View style={styles.fretWire} />}

                                        {/* Note Dot */}
                                        {isActive && (
                                            <View style={[styles.noteDot, isTonic && styles.tonicDot]}>
                                                <Text style={styles.noteText}>{note}</Text>
                                            </View>
                                        )}

                                        {/* Markers */}
                                        {stringIndex === 2 && [3, 5, 7, 9, 15, 17, 19, 21].includes(fretIndex) && <View style={styles.singleMarker} />}
                                        {stringIndex === 2 && [12, 24].includes(fretIndex) && <View style={styles.doubleMarker} />}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 320,
        backgroundColor: '#1E1E1E',
        marginVertical: 10,
    },
    scrollView: {
        paddingLeft: 10,
    },
    neck: {
        backgroundColor: '#2a2a2a',
        borderColor: '#333',
        borderWidth: 1,
        paddingRight: 20,
        paddingBottom: 20,
    },
    fretNumberRow: {
        flexDirection: 'row',
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 5,
    },
    fretNumber: {
        width: 60, // Fret Width
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
    },
    openFretNumber: {
        width: 50,
    },
    stringRow: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    fretCell: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    openFretCell: {
        width: 50,
        backgroundColor: '#222',
        borderRightWidth: 4,
        borderRightColor: '#888', // Nut
    },
    stringLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#888',
    },
    fretWire: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#555',
    },
    noteDot: {
        width: 34,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#03dac6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    tonicDot: {
        backgroundColor: '#bb86fc',
        borderWidth: 2,
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    noteText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    singleMarker: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#888',
        opacity: 0.5,
        top: 35, // Below string
    },
    doubleMarker: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#888',
        opacity: 0.5,
        top: 35,
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fretboard } from '../components/Fretboard';
import { Controls } from '../components/Controls';
import { NOTES, TRIADS, getTriadNotes } from '../utils/musicTheory';

export const TriadsScreen = () => {
    const [tonic, setTonic] = useState('C');
    const [triadType, setTriadType] = useState('major');

    const activeNotes = getTriadNotes(tonic, triadType);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Triads</Text>

                <Fretboard activeNotes={activeNotes} tonic={tonic} />

                <Controls
                    tonic={tonic}
                    setTonic={setTonic}
                    scaleType={triadType}
                    setScaleType={setTriadType}
                    notes={NOTES}
                    scales={TRIADS}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Displaying <Text style={{ color: '#bb86fc', fontWeight: 'bold' }}>{tonic} {TRIADS[triadType].name}</Text> triad notes across the fretboard.
                    </Text>
                    <Text style={styles.notesList}>
                        Notes: {activeNotes.join(' - ')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: 15,
    },
    infoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    infoText: {
        color: '#b3b3b3',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    notesList: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fretboard } from '../components/Fretboard';
import { Controls } from '../components/Controls';
import { NOTES, SCALES, getScaleNotes, getHarmonization } from '../utils/musicTheory';

export const ScalesScreen = () => {
    const [tonic, setTonic] = useState('C');
    const [scaleType, setScaleType] = useState('major');

    const activeNotes = getScaleNotes(tonic, scaleType);
    const harmonization = getHarmonization(tonic, scaleType);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Scales & Modes</Text>

                <Fretboard activeNotes={activeNotes} tonic={tonic} />

                <Controls
                    tonic={tonic}
                    setTonic={setTonic}
                    scaleType={scaleType}
                    setScaleType={setScaleType}
                    notes={NOTES}
                    scales={SCALES}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Harmonization</Text>
                    {harmonization.map((item, index) => (
                        <View key={index} style={styles.harmonizationRow}>
                            <Text style={[styles.col, styles.degree]}>{item.degree}</Text>
                            <Text style={[styles.col, styles.note]}>{item.note}</Text>
                            <Text style={[styles.col, styles.roman]}>{item.roman}</Text>
                            <Text style={[styles.col, styles.chord]}>{item.chord}</Text>
                        </View>
                    ))}
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
        padding: 15,
        backgroundColor: '#1e1e1e',
        marginTop: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 20,
    },
    infoTitle: {
        color: '#bb86fc',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    harmonizationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    col: {
        color: '#fff',
        flex: 1,
    },
    degree: { color: '#888', maxWidth: 30 },
    note: { fontWeight: 'bold' },
    roman: { color: '#aaa' },
    chord: { color: '#03dac6', textAlign: 'right', flex: 2 },
});

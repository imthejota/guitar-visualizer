import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export const Controls = ({ tonic, setTonic, scaleType, setScaleType, notes, scales }) => {
    return (
        <View style={styles.container}>
            {/* Tonic Selection */}
            <View style={styles.section}>
                <Text style={styles.label}>Tonic</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                    {notes.map(note => (
                        <TouchableOpacity
                            key={note}
                            style={[styles.button, tonic === note && styles.activeButton]}
                            onPress={() => setTonic(note)}
                        >
                            <Text style={[styles.buttonText, tonic === note && styles.activeButtonText]}>{note}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Scale/Type Selection */}
            <View style={styles.section}>
                <Text style={styles.label}>Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                    {Object.entries(scales).map(([key, scale]) => (
                        <TouchableOpacity
                            key={key}
                            style={[styles.button, scaleType === key && styles.activeButton]}
                            onPress={() => setScaleType(key)}
                        >
                            <Text style={[styles.buttonText, scaleType === key && styles.activeButtonText]}>{scale.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    section: {
        marginBottom: 15,
    },
    label: {
        color: '#b3b3b3',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    selectorScroll: {
        flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    activeButton: {
        backgroundColor: '#bb86fc',
        borderColor: '#bb86fc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    activeButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

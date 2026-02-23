export const NOTES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

export const SCALES = {
  major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  locrian: { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
  pentatonic_major: { name: 'Pentatonic Major', intervals: [0, 2, 4, 7, 9] },
  pentatonic_minor: { name: 'Pentatonic Minor', intervals: [0, 3, 5, 7, 10] },
  blues: { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
};

export const TRIADS = {
  major: { name: 'Major', intervals: [0, 4, 7] },
  minor: { name: 'Minor', intervals: [0, 3, 7] },
  diminished: { name: 'Diminished', intervals: [0, 3, 6] },
  augmented: { name: 'Augmented', intervals: [0, 4, 8] },
  sus2: { name: 'Sus2', intervals: [0, 2, 7] },
  sus4: { name: 'Sus4', intervals: [0, 5, 7] },
};

export const getScaleNotes = (tonic, scaleType) => {
  const tonicIndex = NOTES.indexOf(tonic);
  if (tonicIndex === -1) return [];

  const scale = SCALES[scaleType];
  if (!scale) return [];

  return scale.intervals.map(p => NOTES[(tonicIndex + p) % 12]);
};

export const getTriadNotes = (tonic, triadType) => {
  const tonicIndex = NOTES.indexOf(tonic);
  if (tonicIndex === -1) return [];

  const triad = TRIADS[triadType];
  if (!triad) return [];

  return triad.intervals.map(p => NOTES[(tonicIndex + p) % 12]);
};

export const getHarmonization = (tonic, scaleType) => {
  const tonicIndex = NOTES.indexOf(tonic);
  if (tonicIndex === -1) return [];

  const scale = SCALES[scaleType];
  if (!scale) return [];

  const intervals = scale.intervals;
  const scaleNotes = intervals.map(p => NOTES[(tonicIndex + p) % 12]);

  if (intervals.length === 0) return [];

  return scaleNotes.map((note, idx) => {
    // Determine the degree note (1, 3, 5 of the diatonic chord relative to scale degree)
    // We treat the current note as index 0 of the new relative scale
    // 3rd is index + 2, 5th is index + 4 (wrapping around scale length)
    const rootInterval = intervals[idx];
    const thirdInterval = intervals[(idx + 2) % intervals.length];
    const fifthInterval = intervals[(idx + 4) % intervals.length];

    // Adjust intervals for wrap-around to calculate semi-tone distance
    const thirdDist = (thirdInterval < rootInterval ? thirdInterval + 12 : thirdInterval) - rootInterval;
    const fifthDist = (fifthInterval < rootInterval ? fifthInterval + 12 : fifthInterval) - rootInterval;

    let quality = '?';
    let roman = '?';

    if (thirdDist === 4 && fifthDist === 7) {
      quality = 'Major';
      roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][idx] || (idx + 1);
    } else if (thirdDist === 3 && fifthDist === 7) {
      quality = 'Minor';
      roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'][idx] || (idx + 1);
    } else if (thirdDist === 3 && fifthDist === 6) {
      quality = 'Diminished';
      roman = ['i°', 'ii°', 'iii°', 'iv°', 'v°', 'vi°', 'vii°'][idx] || (idx + 1) + '°';
    } else if (thirdDist === 4 && fifthDist === 8) {
      quality = 'Augmented';
      roman = ['I+', 'II+', 'III+', 'IV+', 'V+', 'VI+', 'VII+'][idx] || (idx + 1) + '+';
    } else {
      // Fallback for exotic scales (pentatonics, etc)
      quality = `(${thirdDist}, ${fifthDist})`;
      roman = idx + 1;
    }

    return {
      degree: idx + 1,
      note,
      chord: `${note} ${quality}`,
      roman,
      quality
    };
  });
};

/**
 * Detects the chord name based on an array of notes.
 * Assumes notes are ordered from lowest pitch to highest pitch.
 */
export const detectChord = (notes) => {
  if (!notes || notes.length === 0) return 'No Notes Selected';

  // Extract unique note names (ignoring octaves if we had them, but here we just have 'C', 'C#/Db', etc.)
  // We want to keep the bass note as the first unique note.
  const uniqueNotes = [];
  for (const note of notes) {
    if (!uniqueNotes.includes(note)) {
      uniqueNotes.push(note);
    }
  }

  const bassNote = uniqueNotes[0];
  if (uniqueNotes.length === 1) return bassNote;

  // Function to calculate semitone interval between two notes
  const getInterval = (n1, n2) => {
    let index1 = NOTES.indexOf(n1);
    let index2 = NOTES.indexOf(n2);
    if (index1 === -1 || index2 === -1) return 0;

    let diff = index2 - index1;
    if (diff < 0) diff += 12;
    return diff;
  };

  if (uniqueNotes.length === 2) {
    const interval = getInterval(uniqueNotes[0], uniqueNotes[1]);
    if (interval === 7) return `${uniqueNotes[0]}5 (Power Chord)`;
    if (interval === 5) return `${uniqueNotes[1]}5 (Power Chord)`; // Inverted power chord
    return 'Interval';
  }

  // Generate all rotations of the unique notes to check every possible root
  const getChordForRoot = (rootNote, chordNotes) => {
    // Calculate intervals from root
    const intervalsFromRoot = chordNotes.map(note => getInterval(rootNote, note)).sort((a, b) => a - b);

    // Helper to check if intervals contain specific semi-tones
    const has = (interval) => intervalsFromRoot.includes(interval);

    let chordName = null;

    // Check Triads
    if (intervalsFromRoot.length === 3) {
      if (has(4) && has(7)) chordName = `${rootNote} Major`;
      else if (has(3) && has(7)) chordName = `${rootNote} Minor`;
      else if (has(3) && has(6)) chordName = `${rootNote} Diminished`;
      else if (has(4) && has(8)) chordName = `${rootNote} Augmented`;
      else if (has(2) && has(7)) chordName = `${rootNote} Sus2`;
      else if (has(5) && has(7)) chordName = `${rootNote} Sus4`;
    }
    // Check 7th Chords (4 notes)
    else if (intervalsFromRoot.length === 4) {
      if (has(4) && has(7) && has(11)) chordName = `${rootNote}maj7`;
      else if (has(4) && has(7) && has(10)) chordName = `${rootNote}7`;
      else if (has(3) && has(7) && has(10)) chordName = `${rootNote}m7`;
      else if (has(3) && has(7) && has(11)) chordName = `${rootNote}m(maj7)`;
      else if (has(3) && has(6) && has(10)) chordName = `${rootNote}m7b5`;
      else if (has(3) && has(6) && has(9)) chordName = `${rootNote}dim7`;
      else if (has(4) && has(8) && has(10)) chordName = `${rootNote}aug7`;
      else if (has(4) && has(8) && has(11)) chordName = `${rootNote}aug(maj7)`;
    }

    // Check standard triad + added notes (e.g. add9) if needed here in future
    return chordName;
  };

  // Try each unique note as the potential root
  let detectedChord = null;
  let root = null;

  for (let i = 0; i < uniqueNotes.length; i++) {
    const candidateRoot = uniqueNotes[i];
    const result = getChordForRoot(candidateRoot, uniqueNotes);
    if (result) {
      detectedChord = result;
      root = candidateRoot;
      break; // Found a matching standard chord structure
    }
  }

  if (detectedChord) {
    // Check if it's an inversion
    if (bassNote !== root) {
      return `${detectedChord}/${bassNote}`;
    }
    return detectedChord;
  }

  // If we couldn't match a standard chord, just list notes
  return `Custom Chord: ${uniqueNotes.join('-')}`;
};

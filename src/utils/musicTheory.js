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

/**
 * Generates a chord progression based on a starting chord, mood, and length.
 * The input chord is expected in a format like "C Major", "A Minor", "G7", etc.
 */
export const generateProgression = (startingChordName, mood, length) => {
  // 1. Parse the starting chord to get Root and Quality
  let root = '';
  let quality = '';

  // Basic parsing (e.g. "C# Major", "Bb Minor")
  // First, find the root note which can be 1 or 2 characters if it has a sharp/flat, or a split note like C#/Db
  // We'll rely on the NOTES array to find a match at the beginning of the string.
  for (const note of [...NOTES].sort((a, b) => b.length - a.length)) { // Sort by length descending to match C#/Db before C
    if (startingChordName.startsWith(note)) {
      root = note;
      quality = startingChordName.slice(note.length).trim();
      break;
    }
  }

  // Fallback if parsing fails
  if (!root) {
    root = 'C';
    quality = 'Major';
  }

  // Normalize quality to a basic type (Major or Minor) to determine the scale to draw from
  // If it's a "Custom Chord", we just default to Major.
  let isMinor = quality.toLowerCase().includes('minor') || quality.toLowerCase() === 'm' || quality.toLowerCase().includes('m7') || quality.toLowerCase().includes('dim');
  let scaleType = isMinor ? 'minor' : 'major';
  let rootIndex = NOTES.indexOf(root);

  // 2. Define Progression Templates (Roman Numerals where upper is Major, lower is minor, + is aug, o is dim)
  // We'll map these Roman numerals to semitone intervals from the root, and their respective chord quality.

  // Helper to map roman numeral to semitone offset and quality
  // Note: This is an approximation. A true diatonic calculation would use the scale degrees.
  // For simplicity and matching standard roman numerals across any root:
  const getChordFromRoman = (roman, rootIdx, baseScaleIsMinor) => {
    // Mapping common roman numerals to interval offsets in semitones
    const intervals = {
      'I': { offset: 0, qual: 'Major' },
      'i': { offset: 0, qual: 'Minor' },
      'bII': { offset: 1, qual: 'Major' }, // Neapolitan
      'ii': { offset: 2, qual: 'Minor' },
      'II': { offset: 2, qual: 'Major' },
      'bIII': { offset: 3, qual: 'Major' },
      'iii': { offset: 4, qual: 'Minor' },
      'III': { offset: 4, qual: 'Major' },
      'iv': { offset: 5, qual: 'Minor' },
      'IV': { offset: 5, qual: 'Major' },
      '#iv(dim)': { offset: 6, qual: 'Diminished' },
      'V': { offset: 7, qual: 'Major' },
      'v': { offset: 7, qual: 'Minor' },
      'bVI': { offset: 8, qual: 'Major' },
      'vi': { offset: 9, qual: 'Minor' },
      'VI': { offset: 9, qual: 'Major' },
      'bVII': { offset: 10, qual: 'Major' },
      'vii°': { offset: 11, qual: 'Diminished' },
      'VII': { offset: 11, qual: 'Major' }
    };

    const data = intervals[roman];
    if (!data) return `${NOTES[rootIdx]} Major`; // Fallback

    const targetIdx = (rootIdx + data.offset) % 12;
    return `${NOTES[targetIdx]} ${data.qual}`;
  };

  // Define moods mapping to arrays of Roman numeral templates
  // The first chord of the template will always be replaced by the starting chord exactly as generated by the user,
  // but the rest will follow relative to the root.
  const templates = {
    'Happy': [
      ['I', 'IV', 'V', 'I'],
      ['I', 'vi', 'IV', 'V'],
      ['I', 'V', 'vi', 'IV'],
      ['I', 'ii', 'V', 'I']
    ],
    'Sad': [
      ['i', 'VI', 'III', 'VII'],
      ['i', 'iv', 'v', 'i'],
      ['i', 'bVII', 'bVI', 'V'],
      ['i', 'vi', 'IV', 'V'] // Minor modulating or borrowing
    ],
    'Epic': [
      ['i', 'bVI', 'bIII', 'bVII'], // "Hans Zimmer" progression
      ['i', 'bVII', 'i', 'bVII'],
      ['I', 'bVI', 'bVII', 'I']
    ],
    'Mysterious': [
      ['i', '#iv(dim)', 'V', 'i'],
      ['i', 'bvi', 'i', 'bVI'], // Not standard roman, using exact offsets below if needed
      ['i', 'bII', 'i', 'V'] // Phrygian feel
    ],
    'Jazzy': [
      ['ii', 'V', 'I', 'vi'], // 2-5-1-6
      ['I', 'vi', 'ii', 'V'], // 1-6-2-5
      ['iii', 'vi', 'ii', 'V'] // 3-6-2-5
    ]
  };

  // If the user picked a mood that doesn't fit the chord (e.g., Happy on a minor chord),
  // we still apply the template relative to the root. It might sound weird, but that's part of the fun!
  const moodTemplates = templates[mood] || templates['Happy'];

  // Pick a random template from the chosen mood
  const template = moodTemplates[Math.floor(Math.random() * moodTemplates.length)];

  // Generate the sequence based on requested length
  const progression = [];
  for (let i = 0; i < length; i++) {
    // Loop the template if length > template.length
    const roman = template[i % template.length];

    if (i === 0) {
      // Always use the user's exact starting chord for the first chord, unless the template specifically calls for a completely different root.
      // Usually, progressions start on the root of the template.
      progression.push(startingChordName);
    } else {
      progression.push(getChordFromRoman(roman, rootIndex, isMinor));
    }
  }

  return progression;
};

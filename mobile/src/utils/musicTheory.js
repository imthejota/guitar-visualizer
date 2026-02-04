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

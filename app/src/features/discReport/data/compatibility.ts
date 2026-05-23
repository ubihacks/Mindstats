/**
 * DISC Compatibility matrix — primary type vs primary type.
 * 'cohesive' | 'neutral' | 'tense'
 */
export type CompatLevel = 'cohesive' | 'neutral' | 'tense';

export const COMPATIBILITY_MATRIX: Record<string, Record<string, CompatLevel>> = {
  D: { D: 'tense',    I: 'neutral',  S: 'tense',    C: 'neutral'  },
  I: { D: 'neutral',  I: 'tense',    S: 'cohesive',  C: 'tense'    },
  S: { D: 'tense',    I: 'cohesive',  S: 'cohesive',  C: 'cohesive' },
  C: { D: 'neutral',  I: 'tense',    S: 'cohesive',  C: 'neutral'  },
};

export const COMPAT_LABELS: Record<CompatLevel, string> = {
  cohesive: 'Cohesive',
  neutral:  'Neutral',
  tense:    'Tense',
};

export const COMPAT_COLORS: Record<CompatLevel, string> = {
  cohesive: '#38A169',
  neutral:  '#718096',
  tense:    '#E53E3E',
};

export const COMPAT_BG: Record<CompatLevel, string> = {
  cohesive: '#F0FFF4',
  neutral:  '#F7FAFC',
  tense:    '#FFF5F5',
};

export const COMPATIBILITY_EXPLANATION =
  'This matrix maps the natural behavioural tendencies between two DISC primary types. ' +
  'Cohesive pairings share complementary motivations. Neutral pairings can work well with ' +
  'conscious effort. Tense pairings have fundamentally different drivers and may require ' +
  'deliberate communication strategies. Note: under prolonged stress, neutral pairings can ' +
  'shift toward tense. Understanding these dynamics helps teams build healthier working relationships.';

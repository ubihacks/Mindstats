// @ts-nocheck — react-pdf types diverge from standard React types; runtime is fine.
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Svg, Path, Rect, Circle, Line,
} from '@react-pdf/renderer';
import { PROFILE_CONTENT } from './data/profileContent';
import { COMPATIBILITY_MATRIX, COMPAT_LABELS, COMPAT_COLORS, COMPAT_BG, COMPATIBILITY_EXPLANATION } from './data/compatibility';
import { RECOMMENDATIONS } from './data/recommendations';

// ─── Branding ─────────────────────────────────────────────────────────────────
const BRAND = {
  purple:  '#6B4EFF',
  navy:    '#1E1B2E',
  accent:  '#E8E4FF',
  white:   '#FFFFFF',
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray900: '#111827',
};

const DISC_COLOR: Record<string, string> = {
  D: '#E53E3E',
  I: '#D69E2E',
  S: '#38A169',
  C: '#3182CE',
};

const DIMS = ['D', 'I', 'S', 'C'] as const;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: BRAND.white, padding: 0 },
  coverPage: { fontFamily: 'Helvetica', backgroundColor: BRAND.navy, padding: 0 },

  // Header bar on content pages
  pageHeader: { backgroundColor: BRAND.purple, paddingHorizontal: 36, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageHeaderText: { color: BRAND.white, fontSize: 8, fontWeight: 600, letterSpacing: 1 },

  // Body
  body: { paddingHorizontal: 36, paddingTop: 24, paddingBottom: 50 },

  // Footer
  footer: { position: 'absolute', bottom: 18, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: BRAND.gray100, paddingTop: 6 },
  footerText: { fontSize: 7, color: BRAND.gray400 },

  // Typography
  h1: { fontSize: 26, fontWeight: 800, color: BRAND.navy, letterSpacing: -0.5, marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: 700, color: BRAND.navy, marginBottom: 10 },
  h3: { fontSize: 11, fontWeight: 700, color: BRAND.navy, marginBottom: 5 },
  h4: { fontSize: 9,  fontWeight: 700, color: BRAND.navy, marginBottom: 3 },
  body1: { fontSize: 9, color: BRAND.gray600, lineHeight: 1.6 },
  body2: { fontSize: 8, color: BRAND.gray600, lineHeight: 1.5 },
  caption: { fontSize: 7, color: BRAND.gray400 },

  // Badges
  badge: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText: { fontSize: 7, fontWeight: 700 },

  // Cards
  card: { borderRadius: 8, padding: 14, marginBottom: 10 },
  cardBorder: { borderRadius: 8, borderWidth: 1, borderColor: BRAND.gray100, padding: 14, marginBottom: 10 },

  // Table
  table: { width: '100%' },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: BRAND.navy, paddingVertical: 6, paddingHorizontal: 8, flex: 1, alignItems: 'center' },
  tableHeaderText: { fontSize: 8, fontWeight: 700, color: BRAND.white },
  tableCell: { paddingVertical: 5, paddingHorizontal: 8, flex: 1, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: BRAND.gray100 },
  tableCellText: { fontSize: 8 },

  // Divider
  divider: { borderBottomWidth: 0.5, borderBottomColor: BRAND.gray100, marginVertical: 12 },

  // Bullet
  bullet: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { fontSize: 9, color: BRAND.purple, marginRight: 5, marginTop: 0.5 },
  bulletText: { fontSize: 8, color: BRAND.gray600, lineHeight: 1.5, flex: 1 },

  // Grid
  row: { flexDirection: 'row', gap: 10 },
  col2: { flex: 1 },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Logo = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
    <Svg width="16" height="16" viewBox="0 0 16 16">
      <Circle cx="8" cy="8" r="7" fill={BRAND.purple} />
      <Path d="M5 8 Q8 4 11 8 Q8 12 5 8Z" fill={BRAND.white} />
    </Svg>
    <Text style={{ fontSize: 13, fontWeight: 800, color: BRAND.purple }}>mindstat</Text>
  </View>
);

const LogoWhite = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
    <Svg width="16" height="16" viewBox="0 0 16 16">
      <Circle cx="8" cy="8" r="7" fill={BRAND.white} />
      <Path d="M5 8 Q8 4 11 8 Q8 12 5 8Z" fill={BRAND.purple} />
    </Svg>
    <Text style={{ fontSize: 13, fontWeight: 800, color: BRAND.white }}>mindstat</Text>
  </View>
);

const PageFooter = ({ page }: { page: number }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerText}>mindstat.io · Private and Confidential</Text>
    <Text style={s.footerText}>© 2025 Mindstat · Know yourself. Lead better.</Text>
    <Text style={s.footerText}>Page {page}</Text>
  </View>
);

const SectionLabel = ({ children, color = BRAND.purple }: { children: string; color?: string }) => (
  <View style={{ backgroundColor: color + '20', borderLeftWidth: 3, borderLeftColor: color, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 12, borderRadius: 3 }}>
    <Text style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 0.5 }}>{children}</Text>
  </View>
);

const Bullet = ({ text }: { text: string }) => (
  <View style={s.bullet}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{text}</Text>
  </View>
);

const DimBadge = ({ dim }: { dim: string }) => (
  <View style={[s.badge, { backgroundColor: DISC_COLOR[dim] + '20' }]}>
    <Text style={[s.badgeText, { color: DISC_COLOR[dim] }]}>{dim}</Text>
  </View>
);

// ─── SVG helpers ──────────────────────────────────────────────────────────────
function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function donutSegment(cx: number, cy: number, ro: number, ri: number, a1: number, a2: number): string {
  const os = polarXY(cx, cy, ro, a1);
  const oe = polarXY(cx, cy, ro, a2);
  const is_ = polarXY(cx, cy, ri, a2);
  const ie = polarXY(cx, cy, ri, a1);
  const lg = a2 - a1 <= 180 ? 0 : 1;
  return [
    `M ${os.x} ${os.y}`,
    `A ${ro} ${ro} 0 ${lg} 1 ${oe.x} ${oe.y}`,
    `L ${is_.x} ${is_.y}`,
    `A ${ri} ${ri} 0 ${lg} 0 ${ie.x} ${ie.y}`,
    'Z',
  ].join(' ');
}

// DISC Wheel — 16 segments
const WHEEL_PROFILES = [
  { code: 'D',  dim: 'D', a1: 337.5, a2: 22.5  },
  { code: 'DI', dim: 'D', a1: 22.5,  a2: 45     },
  { code: 'ID', dim: 'I', a1: 45,    a2: 67.5   },
  { code: 'I',  dim: 'I', a1: 67.5,  a2: 112.5  },
  { code: 'IS', dim: 'I', a1: 112.5, a2: 135    },
  { code: 'SI', dim: 'S', a1: 135,   a2: 157.5  },
  { code: 'S',  dim: 'S', a1: 157.5, a2: 202.5  },
  { code: 'SC', dim: 'S', a1: 202.5, a2: 225    },
  { code: 'CS', dim: 'C', a1: 225,   a2: 247.5  },
  { code: 'C',  dim: 'C', a1: 247.5, a2: 292.5  },
  { code: 'CD', dim: 'C', a1: 292.5, a2: 315    },
  { code: 'DC', dim: 'D', a1: 315,   a2: 337.5  },
  { code: 'DS', dim: 'D', a1: 22.5,  a2: 45     },  // bridge — shown separately
  { code: 'IC', dim: 'I', a1: 112.5, a2: 135    },  // bridge
  { code: 'SD', dim: 'S', a1: 202.5, a2: 225    },  // bridge
  { code: 'CI', dim: 'C', a1: 292.5, a2: 315    },  // bridge
];

// Simplified 12-segment wheel (excluding bridges for visual clarity)
const WHEEL_SEGS = [
  { code: 'DC', dim: 'D', a1: 315, a2: 337.5 },
  { code: 'D',  dim: 'D', a1: 337.5, a2: 22.5 },
  { code: 'DI', dim: 'D', a1: 22.5, a2: 45 },
  { code: 'ID', dim: 'I', a1: 45, a2: 67.5 },
  { code: 'I',  dim: 'I', a1: 67.5, a2: 112.5 },
  { code: 'IS', dim: 'I', a1: 112.5, a2: 135 },
  { code: 'SI', dim: 'S', a1: 135, a2: 157.5 },
  { code: 'S',  dim: 'S', a1: 157.5, a2: 202.5 },
  { code: 'SC', dim: 'S', a1: 202.5, a2: 225 },
  { code: 'CS', dim: 'C', a1: 225, a2: 247.5 },
  { code: 'C',  dim: 'C', a1: 247.5, a2: 292.5 },
  { code: 'CD', dim: 'C', a1: 292.5, a2: 315 },
];

const DiscWheel = ({ size = 200, highlightCode }: { size?: number; highlightCode?: string }) => {
  const cx = size / 2, cy = size / 2;
  const ro = size * 0.46, ri = size * 0.18;
  const labelR = ro + 12;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Segments */}
      {WHEEL_SEGS.map((seg) => {
        const isHighlight = seg.code === highlightCode;
        const col = DISC_COLOR[seg.dim];
        return (
          <Path
            key={seg.code}
            d={donutSegment(cx, cy, ro, ri, seg.a1, seg.a2)}
            fill={isHighlight ? col : col + '50'}
            stroke={BRAND.white}
            strokeWidth={1}
          />
        );
      })}
      {/* Centre circle */}
      <Circle cx={cx} cy={cy} r={ri - 2} fill={BRAND.white} />
      {/* Centre label */}
      <Text
        style={{ fontSize: 7, fontWeight: 700, fill: BRAND.navy }}
        x={cx} y={cy + 2} textAnchor="middle"
      >
        DISC
      </Text>
      {/* Segment labels */}
      {WHEEL_SEGS.map((seg) => {
        const midAngle = (seg.a1 + seg.a2) / 2;
        const { x, y } = polarXY(cx, cy, (ro + ri) / 2, midAngle);
        const col = DISC_COLOR[seg.dim];
        return (
          <Text
            key={`lbl-${seg.code}`}
            style={{ fontSize: seg.code.length === 1 ? 7 : 5.5, fontWeight: 700, fill: seg.code === highlightCode ? BRAND.white : BRAND.navy }}
            x={x} y={y + 2} textAnchor="middle"
          >
            {seg.code}
          </Text>
        );
      })}
    </Svg>
  );
};

// Score line chart (SVG)
const ScoreChart = ({ scores }: { scores: DiscResultScores }) => {
  const W = 360, H = 160;
  const pad = { left: 30, right: 10, top: 10, bottom: 30 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const dims = DIMS;
  const xStep = chartW / 3;

  function toX(i: number) { return pad.left + i * xStep; }
  function toY(pct: number) { return pad.top + chartH - pct * chartH; }

  const series = [
    { key: 'public',    label: 'Public',    color: DISC_COLOR.D, pcts: dims.map(d => scores[d].public_percent)    },
    { key: 'private',   label: 'Private',   color: DISC_COLOR.I, pcts: dims.map(d => scores[d].private_percent)   },
    { key: 'perceived', label: 'Perceived', color: DISC_COLOR.S, pcts: dims.map(d => scores[d].perceived_percent) },
  ];

  return (
    <Svg width={W} height={H}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <Line key={v} x1={pad.left} y1={toY(v)} x2={W - pad.right} y2={toY(v)} stroke={BRAND.gray100} strokeWidth={0.5} />
      ))}
      {/* Y labels */}
      {[0, 25, 50, 75, 100].map((v) => (
        <Text key={`y${v}`} style={{ fontSize: 6, fill: BRAND.gray400 }} x={pad.left - 4} y={toY(v / 100) + 2} textAnchor="end">{v}%</Text>
      ))}
      {/* X labels */}
      {dims.map((d, i) => (
        <Text key={`x${d}`} style={{ fontSize: 7, fontWeight: 700, fill: DISC_COLOR[d] }} x={toX(i)} y={H - 8} textAnchor="middle">{d}</Text>
      ))}
      {/* Series lines */}
      {series.map((ser) => {
        const points = ser.pcts.map((p, i) => `${toX(i)},${toY(p)}`).join(' ');
        return (
          <React.Fragment key={ser.key}>
            <Path d={`M ${ser.pcts.map((p, i) => `${toX(i)} ${toY(p)}`).join(' L ')}`}
              stroke={ser.color} strokeWidth={1.5} fill="none" />
            {ser.pcts.map((p, i) => (
              <Circle key={i} cx={toX(i)} cy={toY(p)} r={3} fill={ser.color} />
            ))}
          </React.Fragment>
        );
      })}
      {/* Legend */}
      {series.map((ser, i) => (
        <React.Fragment key={`leg${i}`}>
          <Rect x={pad.left + i * 80} y={H - 18} width={8} height={4} fill={ser.color} />
          <Text style={{ fontSize: 6, fill: BRAND.gray600 }} x={pad.left + i * 80 + 11} y={H - 15}>{ser.label}</Text>
        </React.Fragment>
      ))}
    </Svg>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface DiscDimData {
  most: number; least: number; perceived: number;
  public_intensity: number; public_percent: number;
  private_intensity: number; private_percent: number;
  perceived_intensity: number; perceived_percent: number;
}
type DiscResultScores = Record<'D' | 'I' | 'S' | 'C', DiscDimData>;

export interface DiscReportData {
  respondent_name:   string;
  respondent_email:  string;
  scores:            DiscResultScores;
  public_profile:    string;
  public_label:      string;
  private_profile:   string;
  private_label:     string;
  perceived_profile: string;
  perceived_label:   string;
  alignment_type:    string;
  stress_scale:      number;
  created_at:        string;
  company?:          string;
  position?:         string;
}

// ─── Page 1 — Cover ───────────────────────────────────────────────────────────
const CoverPage = ({ data }: { data: DiscReportData }) => (
  <Page size="A4" style={s.coverPage}>
    {/* Top bar */}
    <View style={{ paddingHorizontal: 36, paddingTop: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <LogoWhite />
      <Text style={{ fontSize: 8, color: BRAND.gray400 }}>Private and Confidential</Text>
    </View>

    {/* Hero text */}
    <View style={{ paddingHorizontal: 36, paddingTop: 60 }}>
      <Text style={{ fontSize: 9, fontWeight: 600, color: BRAND.purple, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
        Behavioural Assessment Report
      </Text>
      <Text style={{ fontSize: 30, fontWeight: 800, color: BRAND.white, lineHeight: 1.2, marginBottom: 8 }}>
        WORKPLACE{'\n'}BEHAVIOURAL{'\n'}REPORT &amp; SUMMARY
      </Text>
      <View style={{ width: 60, height: 3, backgroundColor: BRAND.purple, marginTop: 12, marginBottom: 24 }} />
      <Text style={{ fontSize: 10, color: BRAND.gray400, marginBottom: 4 }}>Prepared for</Text>
      <Text style={{ fontSize: 16, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>{data.respondent_name}</Text>
      <Text style={{ fontSize: 9, color: BRAND.gray400 }}>
        {new Date(data.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </Text>
    </View>

    {/* Decorative DISC quadrant arcs */}
    <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
      <Svg width="280" height="280" viewBox="0 0 280 280">
        {/* 4 quadrant semicircles */}
        <Path d={donutSegment(140, 140, 130, 60, 0, 90)}   fill={DISC_COLOR.D + '60'} />
        <Path d={donutSegment(140, 140, 130, 60, 90, 180)}  fill={DISC_COLOR.I + '60'} />
        <Path d={donutSegment(140, 140, 130, 60, 180, 270)} fill={DISC_COLOR.S + '60'} />
        <Path d={donutSegment(140, 140, 130, 60, 270, 360)} fill={DISC_COLOR.C + '60'} />
        {/* Inner rings */}
        <Path d={donutSegment(140, 140, 58, 20, 0, 90)}   fill={DISC_COLOR.D + '30'} />
        <Path d={donutSegment(140, 140, 58, 20, 90, 180)}  fill={DISC_COLOR.I + '30'} />
        <Path d={donutSegment(140, 140, 58, 20, 180, 270)} fill={DISC_COLOR.S + '30'} />
        <Path d={donutSegment(140, 140, 58, 20, 270, 360)} fill={DISC_COLOR.C + '30'} />
        {/* Quadrant labels */}
        {[['D', 45], ['I', 135], ['S', 225], ['C', 315]].map(([dim, ang]) => {
          const { x, y } = polarXY(140, 140, 95, Number(ang));
          return (
            <Text key={dim as string} style={{ fontSize: 22, fontWeight: 800, fill: DISC_COLOR[dim as string] + 'CC' }}
              x={x} y={y + 8} textAnchor="middle">
              {dim}
            </Text>
          );
        })}
      </Svg>
    </View>

    {/* Footer tagline */}
    <View style={{ position: 'absolute', bottom: 20, left: 36 }}>
      <Text style={{ fontSize: 8, color: BRAND.gray400 }}>Know yourself. Lead better. · mindstat.io</Text>
    </View>
  </Page>
);

// ─── Page 2 — DISC Overview ───────────────────────────────────────────────────
const OverviewPage = ({ data }: { data: DiscReportData }) => (
  <Page size="A4" style={s.page}>
    <View style={s.pageHeader}>
      <Logo />
      <Text style={s.pageHeaderText}>DISC OVERVIEW</Text>
    </View>

    <View style={s.body}>
      <Text style={s.h2}>Mindstat DISC Overview</Text>

      {/* Meta grid */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {[
          ['Name',     data.respondent_name],
          ['Date',     new Date(data.created_at).toLocaleDateString('en-GB')],
          ['Profile',  data.public_label],
          ['Alignment', data.alignment_type],
        ].map(([l, v]) => (
          <View key={l} style={{ flex: 1, backgroundColor: BRAND.gray50, borderRadius: 6, padding: 8 }}>
            <Text style={{ fontSize: 7, color: BRAND.gray400, marginBottom: 2 }}>{l}</Text>
            <Text style={{ fontSize: 8, fontWeight: 700, color: BRAND.navy }}>{v}</Text>
          </View>
        ))}
      </View>

      <Text style={[s.body2, { marginBottom: 14 }]}>
        The DISC model describes four primary behavioural dimensions: Dominance (D), Influence (I), Steadiness (S), and Conscientiousness (C). Each person expresses a unique blend of these traits across three behavioural graphs — how they present publicly, how they naturally behave in private, and how they perceive themselves.
        {'\n\n'}
        Importantly, DISC measures behaviour, not character. Behaviours can adapt as awareness grows. This report is designed to build that awareness and provide a foundation for personal and professional development.
      </Text>

      <View style={s.divider} />

      {/* DISC Wheel + key */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
        <DiscWheel size={190} highlightCode={data.public_profile} />
        <View style={{ flex: 1 }}>
          <Text style={[s.h4, { marginBottom: 8 }]}>Your Public Profile</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: DISC_COLOR[data.public_profile[0]] + '20', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 800, color: DISC_COLOR[data.public_profile[0]] }}>{data.public_profile}</Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: 700, color: BRAND.navy }}>{data.public_label}</Text>
          </View>
          <Text style={[s.body2, { marginBottom: 10 }]}>
            {PROFILE_CONTENT[data.public_profile]?.description ?? ''}
          </Text>
          <View style={s.divider} />
          {/* DISC dimension colours key */}
          <Text style={[s.caption, { marginBottom: 5 }]}>Dimension Key</Text>
          {DIMS.map(d => (
            <View key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: DISC_COLOR[d] }} />
              <Text style={s.body2}><Text style={{ fontWeight: 700 }}>{d}</Text> — {['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'][['D', 'I', 'S', 'C'].indexOf(d)]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.divider} />

      {/* Change tendency bar */}
      <Text style={[s.h4, { marginBottom: 6 }]}>Change Tendency</Text>
      <Text style={[s.body2, { marginBottom: 8 }]}>
        Behaviour exists on a spectrum from deeply genetic to consciously adopted. The further right, the more adaptable through awareness and development.
      </Text>
      <View style={{ flexDirection: 'row', height: 18, borderRadius: 6, overflow: 'hidden' }}>
        {[['Genetic', DISC_COLOR.D], ['Personality', DISC_COLOR.I], ['Behaviour', DISC_COLOR.S], ['Attitude', DISC_COLOR.C]].map(([lbl, col]) => (
          <View key={lbl} style={{ flex: 1, backgroundColor: col + '80', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 6, fontWeight: 700, color: BRAND.navy }}>{lbl}</Text>
          </View>
        ))}
      </View>
    </View>

    <PageFooter page={2} />
  </Page>
);

// ─── Pages 3–5 — Profile Cards ────────────────────────────────────────────────
const ProfileCardPage = ({
  title, profileCode, profileLabel, pageNum, data,
}: {
  title: string; profileCode: string; profileLabel: string; pageNum: number; data: DiscReportData;
}) => {
  const content = PROFILE_CONTENT[profileCode];
  const primaryDim = profileCode[0] as string;
  const col = DISC_COLOR[primaryDim] ?? BRAND.purple;

  if (!content) return null;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.pageHeader}>
        <Logo />
        <Text style={s.pageHeaderText}>{title.toUpperCase()}</Text>
      </View>

      <View style={s.body}>
        <SectionLabel color={col}>{title}</SectionLabel>

        {/* Main profile card */}
        <View style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: col + '40' }}>
          {/* Card header */}
          <View style={{ backgroundColor: col, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 8, color: BRAND.white + 'BB', fontWeight: 600, letterSpacing: 1, marginBottom: 3 }}>BEHAVIOURAL PROFILE</Text>
              <Text style={{ fontSize: 18, fontWeight: 800, color: BRAND.white, letterSpacing: -0.5 }}>{profileLabel}</Text>
              <Text style={{ fontSize: 10, color: BRAND.white + 'CC', marginTop: 2 }}>({profileCode})</Text>
            </View>
            <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: BRAND.white + '20', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 800, color: BRAND.white }}>{profileCode}</Text>
            </View>
          </View>

          {/* 6-attribute grid */}
          <View style={{ backgroundColor: BRAND.white, padding: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              {[['Fear', content.fear], ['Goal', content.goal]].map(([lbl, val]) => (
                <View key={lbl} style={{ flex: 1, backgroundColor: col + '10', borderRadius: 6, padding: 8 }}>
                  <Text style={{ fontSize: 7, fontWeight: 700, color: col, marginBottom: 3 }}>{lbl}</Text>
                  <Text style={{ fontSize: 8, color: BRAND.gray600, lineHeight: 1.4 }}>{val}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              {[['When Under Stress', content.stressResponse], ['Perception', content.perception]].map(([lbl, val]) => (
                <View key={lbl} style={{ flex: 1, backgroundColor: col + '08', borderRadius: 6, padding: 8 }}>
                  <Text style={{ fontSize: 7, fontWeight: 700, color: col, marginBottom: 3 }}>{lbl}</Text>
                  <Text style={{ fontSize: 8, color: BRAND.gray600, lineHeight: 1.4 }}>{val}</Text>
                </View>
              ))}
            </View>
            {/* Strengths + Weaknesses */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 7, fontWeight: 700, color: DISC_COLOR.S, marginBottom: 4 }}>Strengths</Text>
                {content.strengths.map((s, i) => <Bullet key={i} text={s} />)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 7, fontWeight: 700, color: DISC_COLOR.D, marginBottom: 4 }}>Weaknesses</Text>
                {content.weaknesses.map((w, i) => <Bullet key={i} text={w} />)}
              </View>
            </View>
          </View>
        </View>

        {/* Value to team */}
        <View style={{ backgroundColor: BRAND.accent, borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <Text style={{ fontSize: 7, fontWeight: 700, color: BRAND.purple, marginBottom: 3 }}>Value to a Team</Text>
          <Text style={{ fontSize: 8, color: BRAND.navy, lineHeight: 1.5 }}>{content.teamValue}</Text>
        </View>

        <View style={s.divider} />

        {/* Definition + characteristics */}
        <Text style={[s.h4, { marginBottom: 5 }]}>About This Behaviour Type</Text>
        <Text style={[s.body2, { marginBottom: 10 }]}>{content.description}</Text>
        <Text style={{ fontSize: 8, fontWeight: 700, color: BRAND.navy, marginBottom: 6 }}>Key Characteristics</Text>
        {content.characteristics.map((c, i) => <Bullet key={i} text={c} />)}
      </View>

      <PageFooter page={pageNum} />
    </Page>
  );
};

// ─── Page 6 — Score Chart ─────────────────────────────────────────────────────
const ScoreChartPage = ({ data }: { data: DiscReportData }) => (
  <Page size="A4" style={s.page}>
    <View style={s.pageHeader}>
      <Logo />
      <Text style={s.pageHeaderText}>DISC SCORE CHART</Text>
    </View>

    <View style={s.body}>
      <Text style={s.h2}>Your DISC Score Chart</Text>
      <Text style={[s.body2, { marginBottom: 14 }]}>
        Your DISC score chart maps your behavioural intensities across three independent graphs. Public behaviour shows how you present in your environment. Private behaviour reveals your natural, instinctive style. Perceived behaviour reflects the balance between the two — your adapted self-concept.
      </Text>

      <View style={{ backgroundColor: BRAND.gray50, borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <ScoreChart scores={data.scores} />
      </View>

      <View style={s.divider} />

      {/* High/Low explanation grid */}
      <Text style={[s.h4, { marginBottom: 8 }]}>Understanding High and Low Scores</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          {DIMS.slice(0, 2).map(dim => (
            <View key={dim} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: DISC_COLOR[dim] }} />
                <Text style={{ fontSize: 8, fontWeight: 700, color: DISC_COLOR[dim] }}>
                  {['Dominance (D)', 'Influence (I)', 'Steadiness (S)', 'Conscientiousness (C)'][['D','I','S','C'].indexOf(dim)]}
                </Text>
              </View>
              <Text style={s.body2}><Text style={{ fontWeight: 700 }}>High: </Text>{
                dim === 'D' ? 'Direct, decisive, results-driven. Takes charge and acts quickly.' :
                dim === 'I' ? 'Enthusiastic, social, optimistic. Energises and inspires others.' :
                dim === 'S' ? 'Patient, stable, supportive. Dependable and relationship-focused.' :
                              'Precise, analytical, quality-conscious. Thorough and systematic.'
              }</Text>
              <Text style={[s.body2, { marginTop: 2 }]}><Text style={{ fontWeight: 700 }}>Low: </Text>{
                dim === 'D' ? 'Collaborative, considered, and conflict-averse. Builds consensus.' :
                dim === 'I' ? 'Reserved, factual, independent. Focuses on substance over style.' :
                dim === 'S' ? 'Adaptable, change-oriented, and restless. Thrives on variety.' :
                              'Flexible, big-picture thinker. Comfortable with imperfection.'
              }</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {DIMS.slice(2).map(dim => (
            <View key={dim} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: DISC_COLOR[dim] }} />
                <Text style={{ fontSize: 8, fontWeight: 700, color: DISC_COLOR[dim] }}>
                  {['Dominance (D)', 'Influence (I)', 'Steadiness (S)', 'Conscientiousness (C)'][['D','I','S','C'].indexOf(dim)]}
                </Text>
              </View>
              <Text style={s.body2}><Text style={{ fontWeight: 700 }}>High: </Text>{
                dim === 'D' ? 'Direct, decisive, results-driven. Takes charge and acts quickly.' :
                dim === 'I' ? 'Enthusiastic, social, optimistic. Energises and inspires others.' :
                dim === 'S' ? 'Patient, stable, supportive. Dependable and relationship-focused.' :
                              'Precise, analytical, quality-conscious. Thorough and systematic.'
              }</Text>
              <Text style={[s.body2, { marginTop: 2 }]}><Text style={{ fontWeight: 700 }}>Low: </Text>{
                dim === 'D' ? 'Collaborative, considered, and conflict-averse. Builds consensus.' :
                dim === 'I' ? 'Reserved, factual, independent. Focuses on substance over style.' :
                dim === 'S' ? 'Adaptable, change-oriented, and restless. Thrives on variety.' :
                              'Flexible, big-picture thinker. Comfortable with imperfection.'
              }</Text>
            </View>
          ))}
        </View>
      </View>
    </View>

    <PageFooter page={6} />
  </Page>
);

// ─── Page 7 — Compatibility ───────────────────────────────────────────────────
const CompatibilityPage = ({ data }: { data: DiscReportData }) => {
  const myType = data.public_profile[0] as 'D' | 'I' | 'S' | 'C';

  return (
    <Page size="A4" style={s.page}>
      <View style={s.pageHeader}>
        <Logo />
        <Text style={s.pageHeaderText}>DISC COMPATIBILITY</Text>
      </View>

      <View style={s.body}>
        <Text style={s.h2}>DISC Compatibility</Text>
        <Text style={[s.body2, { marginBottom: 14 }]}>{COMPATIBILITY_EXPLANATION}</Text>

        {/* Matrix */}
        <View style={[s.table, { marginBottom: 12 }]}>
          {/* Header row */}
          <View style={s.tableRow}>
            <View style={[s.tableHeader, { flex: 1.2, backgroundColor: BRAND.navy }]}>
              <Text style={s.tableHeaderText}>Your Type →</Text>
            </View>
            {DIMS.map(d => (
              <View key={d} style={[s.tableHeader, { backgroundColor: DISC_COLOR[d] }]}>
                <Text style={s.tableHeaderText}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Data rows */}
          {DIMS.map((rowDim) => (
            <View key={rowDim} style={s.tableRow}>
              <View style={[s.tableCell, { flex: 1.2, backgroundColor: DISC_COLOR[rowDim] + '15' }]}>
                <Text style={[s.tableCellText, { fontWeight: 700, color: DISC_COLOR[rowDim] }]}>{rowDim}</Text>
              </View>
              {DIMS.map((colDim) => {
                const level = COMPATIBILITY_MATRIX[rowDim][colDim];
                const isHighlight = rowDim === myType || colDim === myType;
                return (
                  <View key={colDim} style={[s.tableCell, {
                    backgroundColor: isHighlight ? COMPAT_BG[level] : '#FAFAFA',
                    borderWidth: (rowDim === myType && colDim === myType) ? 1.5 : 0,
                    borderColor: BRAND.purple,
                  }]}>
                    <Text style={[s.tableCellText, { color: COMPAT_COLORS[level], fontWeight: isHighlight ? 700 : 400 }]}>
                      {COMPAT_LABELS[level]}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
          {(['cohesive', 'neutral', 'tense'] as const).map(level => (
            <View key={level} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COMPAT_COLORS[level] }} />
              <Text style={s.body2}>{COMPAT_LABELS[level]}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Your type's compatibility breakdown */}
        <Text style={[s.h4, { marginBottom: 8 }]}>Your Compatibility Profile ({myType} Primary)</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {DIMS.map(d => {
            const level = COMPATIBILITY_MATRIX[myType][d];
            return (
              <View key={d} style={{ flex: 1, borderRadius: 8, borderWidth: 1, borderColor: COMPAT_COLORS[level] + '40', backgroundColor: COMPAT_BG[level], padding: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <View style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: DISC_COLOR[d], alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 8, fontWeight: 800, color: BRAND.white }}>{d}</Text>
                  </View>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: COMPAT_COLORS[level] }}>{COMPAT_LABELS[level]}</Text>
                </View>
                <Text style={s.body2}>
                  {level === 'cohesive'
                    ? 'Natural alignment in pace and priorities. Collaboration flows easily.'
                    : level === 'neutral'
                    ? 'Can work well with conscious effort and clear communication expectations.'
                    : 'Fundamentally different motivations. Requires deliberate adaptation.'
                  }
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={[s.caption, { marginTop: 10 }]}>
          Note: Under sustained pressure, neutral pairings can shift toward tense. Proactive communication strategies prevent this from becoming chronic.
        </Text>
      </View>

      <PageFooter page={7} />
    </Page>
  );
};

// ─── Pages 8–9 — Individual Recommendations ───────────────────────────────────
const RecommendationPage = ({
  title, profile, scores, isManager, pageNum,
}: {
  title: string; profile: string; scores: DiscResultScores; isManager: boolean; pageNum: number;
}) => {
  const sections = DIMS.map(dim => {
    const pct = isManager ? scores[dim].public_percent : scores[dim].private_percent;
    const isHigh = pct >= 0.5;
    const rec = RECOMMENDATIONS[dim];
    return { dim, isHigh, content: isManager ? (isHigh ? rec.managerHigh : rec.managerLow) : (isHigh ? rec.individualHigh : rec.individualLow), pct };
  });

  // Split into two pages worth: show top 2 dims on this page with full content
  return (
    <Page size="A4" style={s.page}>
      <View style={s.pageHeader}>
        <Logo />
        <Text style={s.pageHeaderText}>{title.toUpperCase()}</Text>
      </View>

      <View style={s.body}>
        <Text style={s.h2}>{title}</Text>
        <Text style={[s.body2, { marginBottom: 14 }]}>
          {isManager
            ? `Based on ${profile}'s public behavioural scores. These recommendations help you understand how best to manage, develop, and communicate with this individual.`
            : `Based on your private behavioural scores. These recommendations are designed to help you leverage your natural strengths and develop areas that may hold you back.`
          }
        </Text>

        {sections.map(({ dim, isHigh, content, pct }) => (
          <View key={dim} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <View style={{ width: 22, height: 22, borderRadius: 5, backgroundColor: DISC_COLOR[dim], alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 800, color: BRAND.white }}>{dim}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, fontWeight: 700, color: BRAND.navy }}>{content.title}</Text>
                <Text style={s.caption}>{Math.round(pct * 100)}% intensity — {isHigh ? 'High' : 'Low'} expression</Text>
              </View>
              {/* Mini bar */}
              <View style={{ width: 60, height: 6, backgroundColor: BRAND.gray100, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', backgroundColor: DISC_COLOR[dim], borderRadius: 3 }} />
              </View>
            </View>

            {content.sections.map((sec, i) => (
              <View key={i} style={{ marginLeft: 30, marginBottom: 4 }}>
                <Text style={{ fontSize: 7.5, fontWeight: 700, color: DISC_COLOR[dim], marginBottom: 3 }}>{sec.heading}</Text>
                {sec.bullets.map((b, j) => <Bullet key={j} text={b} />)}
              </View>
            ))}

            {dim !== 'C' && <View style={[s.divider, { marginVertical: 8 }]} />}
          </View>
        ))}
      </View>

      <PageFooter page={pageNum} />
    </Page>
  );
};

// ─── Pages 10–11 — Manager Recs (second page = Overall) ───────────────────────
const OverallRecommendationsPage = ({ data, pageNum }: { data: DiscReportData; pageNum: number }) => (
  <Page size="A4" style={s.page}>
    <View style={s.pageHeader}>
      <Logo />
      <Text style={s.pageHeaderText}>OVERALL RECOMMENDATIONS</Text>
    </View>

    <View style={s.body}>
      <Text style={s.h2}>Overall Recommendations</Text>
      <Text style={[s.body2, { marginBottom: 14 }]}>
        The following recommendations synthesise all three behavioural graphs — Public, Private, and Perceived — together with the Alignment Type <Text style={{ fontWeight: 700 }}>"{data.alignment_type}"</Text> and a Stress Scale of <Text style={{ fontWeight: 700 }}>{Math.round(data.stress_scale * 100)}%</Text>.
      </Text>

      <View style={{ backgroundColor: BRAND.accent, borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <Text style={{ fontSize: 9, fontWeight: 700, color: BRAND.purple, marginBottom: 6 }}>Alignment Summary</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          {[
            ['Public', data.public_label, data.public_profile],
            ['Private', data.private_label, data.private_profile],
            ['Perceived', data.perceived_label, data.perceived_profile],
          ].map(([type, label, code]) => (
            <View key={type} style={{ flex: 1, backgroundColor: BRAND.white, borderRadius: 6, padding: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 6, color: BRAND.gray400, marginBottom: 2 }}>{type}</Text>
              <Text style={{ fontSize: 11, fontWeight: 800, color: DISC_COLOR[code[0]] }}>{code}</Text>
              <Text style={{ fontSize: 6, color: BRAND.gray600, textAlign: 'center', marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={s.body2}>
          {data.alignment_type === 'Aligned'
            ? 'All three behaviour graphs are strongly aligned. This individual presents consistently across all contexts. Development should focus on awareness of how this consistency is perceived by others.'
            : data.alignment_type === 'Minor Adaptation'
            ? 'Small adaptations between natural and public behaviour are evident. This is healthy and common. The individual has good self-awareness and shows flexibility without significant cost.'
            : data.alignment_type === 'Adaptation Gap'
            ? 'The public behaviour differs meaningfully from the private. The individual is adapting significantly to their environment. While this shows versatility, sustained effort can cause fatigue.'
            : data.alignment_type === 'Perception Gap'
            ? 'How the individual perceives themselves differs from how they naturally behave. Building self-awareness through feedback, coaching, and reflection is recommended.'
            : data.alignment_type === 'Double Gap'
            ? 'Both an adaptation gap and a perception gap are present. Multiple behavioural layers are at play. Deep coaching is recommended to build alignment and reduce stress.'
            : 'Significant tension exists between natural, adapted, and perceived behaviours. Sustained coaching, leadership development, or mentoring is strongly recommended.'}
        </Text>
      </View>

      {/* Stress scale */}
      <View style={{ backgroundColor: BRAND.gray50, borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <Text style={{ fontSize: 9, fontWeight: 700, color: BRAND.navy, marginBottom: 6 }}>Stress Indicator</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, height: 10, backgroundColor: BRAND.gray100, borderRadius: 5, overflow: 'hidden' }}>
            <View style={{
              width: `${Math.round(data.stress_scale * 100)}%`,
              height: '100%',
              borderRadius: 5,
              backgroundColor: data.stress_scale < 0.35 ? DISC_COLOR.S : data.stress_scale < 0.65 ? DISC_COLOR.I : DISC_COLOR.D,
            }} />
          </View>
          <Text style={{ fontSize: 9, fontWeight: 700, color: BRAND.navy, width: 30 }}>{Math.round(data.stress_scale * 100)}%</Text>
        </View>
        <Text style={[s.body2, { marginTop: 6 }]}>
          {data.stress_scale < 0.35
            ? 'Low stress indicator. The individual\'s behavioural alignment is healthy. Minor development steps can be pursued at a comfortable pace.'
            : data.stress_scale < 0.65
            ? 'Moderate stress indicator. Some adaptation effort is required. Regular check-ins and reflective practice are recommended.'
            : 'Elevated stress indicator. Significant effort is being made to adapt behaviour. Prioritise recovery, coaching, and authentic expression.'}
        </Text>
      </View>

      {/* Key development themes */}
      <Text style={[s.h4, { marginBottom: 8 }]}>Key Development Themes</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, backgroundColor: DISC_COLOR.S + '10', borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 7, fontWeight: 700, color: DISC_COLOR.S, marginBottom: 4 }}>Leverage</Text>
          {(PROFILE_CONTENT[data.public_profile]?.strengths ?? []).slice(0, 3).map((s, i) => <Bullet key={i} text={s} />)}
        </View>
        <View style={{ flex: 1, backgroundColor: DISC_COLOR.D + '10', borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 7, fontWeight: 700, color: DISC_COLOR.D, marginBottom: 4 }}>Develop</Text>
          {(PROFILE_CONTENT[data.public_profile]?.weaknesses ?? []).slice(0, 3).map((w, i) => <Bullet key={i} text={w} />)}
        </View>
      </View>

      <View style={s.divider} />
      <Text style={[s.caption, { textAlign: 'center' }]}>
        This report was generated by Mindstat · mindstat.io · Know yourself. Lead better.{'\n'}
        © 2025 Mindstat · Private and Confidential · Not for external distribution.
      </Text>
    </View>

    <PageFooter page={pageNum} />
  </Page>
);

// ─── Main Document ────────────────────────────────────────────────────────────
export const DiscReportPDF = ({ data }: { data: DiscReportData }) => (
  <Document
    title={`Mindstat DISC Report — ${data.respondent_name}`}
    author="Mindstat"
    subject="DISC Behavioural Assessment Report"
    creator="mindstat.io"
  >
    {/* 1 — Cover */}
    <CoverPage data={data} />

    {/* 2 — DISC Overview */}
    <OverviewPage data={data} />

    {/* 3 — Public Behaviour */}
    <ProfileCardPage
      title="Public Behaviour"
      profileCode={data.public_profile}
      profileLabel={data.public_label}
      pageNum={3}
      data={data}
    />

    {/* 4 — Private Behaviour */}
    <ProfileCardPage
      title="Private Behaviour"
      profileCode={data.private_profile}
      profileLabel={data.private_label}
      pageNum={4}
      data={data}
    />

    {/* 5 — Perceived Behaviour */}
    <ProfileCardPage
      title="Perceived Behaviour"
      profileCode={data.perceived_profile}
      profileLabel={data.perceived_label}
      pageNum={5}
      data={data}
    />

    {/* 6 — Score Chart */}
    <ScoreChartPage data={data} />

    {/* 7 — Compatibility */}
    <CompatibilityPage data={data} />

    {/* 8–9 — Individual Recommendations */}
    <RecommendationPage
      title="Individual's Recommendation"
      profile={data.respondent_name}
      scores={data.scores}
      isManager={false}
      pageNum={8}
    />

    {/* 10–11 — Manager Recommendations + Overall */}
    <RecommendationPage
      title="Manager's Recommendation"
      profile={data.respondent_name}
      scores={data.scores}
      isManager={true}
      pageNum={10}
    />
    <OverallRecommendationsPage data={data} pageNum={11} />

    {/* 12 — Raw Data (debug) */}
    <Page size="A4" style={s.page}>
      <View style={s.pageHeader}>
        <Text style={s.pageHeaderText}>RAW JSON DATA</Text>
        <Text style={s.pageHeaderText}>mindstat.io</Text>
      </View>
      <View style={[s.body, { paddingTop: 20 }]}>
        <Text style={[s.h3, { marginBottom: 12 }]}>disc_results record</Text>
        <View style={{ backgroundColor: BRAND.gray50, borderRadius: 6, padding: 14, borderWidth: 1, borderColor: BRAND.gray100 }}>
          <Text style={{ fontFamily: 'Courier', fontSize: 7, color: BRAND.gray600, lineHeight: 1.6 }}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      </View>
      <View style={s.footer}>
        <Text style={s.footerText}>Mindstat · mindstat.io</Text>
        <Text style={s.footerText}>Page 12</Text>
      </View>
    </Page>
  </Document>
);

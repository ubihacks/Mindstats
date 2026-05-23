/**
 * DISC Profile Content — all 16 named profiles.
 * Keyed by profile code (e.g. "D", "CS", "DI", …).
 */

export interface ProfileContent {
  code: string;
  label: string;               // e.g. "THE PERFECTIONIST"
  primaryDim: 'D' | 'I' | 'S' | 'C';
  description: string;
  goal: string;
  fear: string;
  stressResponse: string;
  perception: string;          // how others perceive them
  strengths: string[];
  weaknesses: string[];
  teamValue: string;
  characteristics: string[];   // 4 bullet points
}

export const PROFILE_CONTENT: Record<string, ProfileContent> = {
  // ── Pure profiles ──────────────────────────────────────────────────────────

  D: {
    code: 'D', label: 'THE OPPORTUNIST', primaryDim: 'D',
    description:
      'The Opportunist is a highly driven, results-oriented individual who thrives on challenge and competition. They make swift decisions, accept risk with ease, and are motivated by achievement above all else. Directness is their default — they cut through complexity and expect others to keep pace.',
    goal: 'Achieve results, win, and maintain control over outcomes.',
    fear: 'Being taken advantage of, losing control, or appearing weak.',
    stressResponse: 'Becomes dictatorial, aggressive, or dismissive of others\' input.',
    perception: 'Seen as bold and decisive, but can be perceived as domineering or insensitive.',
    strengths: ['Decisive and action-oriented', 'High drive and ambition', 'Comfortable with authority', 'Thrives under pressure'],
    weaknesses: ['Can be blunt or abrasive', 'Impatient with slower processes', 'May overlook people\'s feelings', 'Prone to overcommitting'],
    teamValue: 'Drives results, pushes through obstacles, and keeps the team moving toward the goal.',
    characteristics: [
      'Prefers direct, bottom-line communication',
      'Sets aggressive goals and expects compliance',
      'Quick to decide, sometimes without full information',
      'Values independence and dislikes micromanagement',
    ],
  },

  I: {
    code: 'I', label: 'THE NETWORKER', primaryDim: 'I',
    description:
      'The Networker is an enthusiastic, people-centric communicator who lights up every room they enter. They are natural storytellers, gifted at building relationships and rallying others around a vision. Their optimism is infectious and they excel in dynamic, social environments.',
    goal: 'Influence, inspire, and be recognised for their contributions.',
    fear: 'Rejection, loss of social approval, or being ignored.',
    stressResponse: 'Becomes disorganised, talks excessively, or avoids difficult conversations.',
    perception: 'Seen as warm and energising, but can appear disorganised or attention-seeking.',
    strengths: ['Exceptional communication skills', 'Natural relationship builder', 'Optimistic and enthusiastic', 'Creative and collaborative'],
    weaknesses: ['Can lose focus on detail', 'Tends to over-promise', 'Avoids conflict', 'May prioritise popularity over practicality'],
    teamValue: 'Builds morale, promotes collaboration, and brings energy and enthusiasm to shared goals.',
    characteristics: [
      'Highly expressive and emotionally engaging',
      'Motivated by recognition and applause',
      'Prefers variety and dislikes routine',
      'Builds broad networks of relationships quickly',
    ],
  },

  S: {
    code: 'S', label: 'THE SUPPORTER', primaryDim: 'S',
    description:
      'The Supporter is a warm, empathetic team player who values harmony, loyalty, and consistency. They are the steady backbone of any team — reliable, patient, and deeply caring. They take time to build trust and prefer stable, predictable environments where they can invest deeply in people.',
    goal: 'Maintain harmony, serve others, and create a stable environment.',
    fear: 'Loss of security, sudden change, or interpersonal conflict.',
    stressResponse: 'Withdraws, becomes passive-aggressive, or sacrifices their own needs.',
    perception: 'Seen as warm and dependable, but may appear indecisive or resistant to change.',
    strengths: ['Deeply empathetic and patient', 'Loyal and dependable', 'Excellent listener', 'Skilled at building trust over time'],
    weaknesses: ['Avoids confrontation to a fault', 'Struggles with rapid change', 'Can be overly accommodating', 'Difficulty saying no'],
    teamValue: 'Provides consistency, loyalty, and a calming presence that maintains cohesion and morale.',
    characteristics: [
      'Prefers a steady, low-conflict work environment',
      'Builds deep, long-lasting relationships',
      'Needs time to adapt to significant change',
      'Places high value on team harmony and inclusion',
    ],
  },

  C: {
    code: 'C', label: 'THE ANALYSER', primaryDim: 'C',
    description:
      'The Analyser is a meticulous, systems-thinking professional who demands accuracy and precision in everything they do. They approach problems with objectivity, gather extensive data before deciding, and hold themselves and others to the highest standards. Quality is non-negotiable.',
    goal: 'Ensure accuracy, maintain high standards, and understand all variables.',
    fear: 'Criticism of their work, making errors, or operating without sufficient data.',
    stressResponse: 'Becomes overly critical, withdrawn, or paralysed by analysis.',
    perception: 'Seen as precise and reliable, but can appear cold, overly cautious, or pedantic.',
    strengths: ['Exceptional attention to detail', 'Logical and systematic thinker', 'Maintains high quality standards', 'Risk-aware and thorough'],
    weaknesses: ['Can be overly critical', 'Slow to decide without full data', 'Struggles with ambiguity', 'May seem aloof or detached'],
    teamValue: 'Provides the quality assurance, analytical depth, and systematic thinking that prevents costly errors.',
    characteristics: [
      'Approaches decisions with careful analysis',
      'Holds high standards for self and others',
      'Prefers written communication with full context',
      'Naturally sceptical of new ideas without evidence',
    ],
  },

  // ── D-primary combinations ─────────────────────────────────────────────────

  DI: {
    code: 'DI', label: 'THE DIRECTOR', primaryDim: 'D',
    description:
      'The Director combines results-driven determination with social charisma. They are commanding yet inspiring leaders who motivate through both authority and personality. They excel at rallying teams around bold goals and driving progress at pace.',
    goal: 'Lead others toward ambitious goals while receiving recognition for success.',
    fear: 'Failure, rejection, or being seen as incompetent.',
    stressResponse: 'Becomes overbearing, demands instant results, or seeks public validation.',
    perception: 'Seen as dynamic and commanding, but can appear aggressive or self-promoting.',
    strengths: ['Natural leader with strong presence', 'Persuasive and energising', 'Bold decision-maker', 'Thrives in fast-paced environments'],
    weaknesses: ['Can be impatient with process', 'May overpromise when excited', 'Struggles with slow, detailed work', 'Can dominate conversations'],
    teamValue: 'Drives momentum, inspires confidence, and helps teams tackle ambitious challenges with energy.',
    characteristics: [
      'Combines authority with personal charm',
      'Motivates others through vision and excitement',
      'Quick to act on emerging opportunities',
      'Balances results focus with people engagement',
    ],
  },

  DS: {
    code: 'DS', label: 'THE PRODUCER', primaryDim: 'D',
    description:
      'The Producer is a disciplined, results-driven achiever who pairs drive with patience. They pursue goals systematically and persistently, building reliable processes to ensure consistent output. They are less flashy than pure D types but deeply committed to long-term results.',
    goal: 'Achieve consistent, measurable outcomes through disciplined effort.',
    fear: 'Instability, failure to deliver, or loss of authority.',
    stressResponse: 'Becomes stubborn, controlling, or resistant to new approaches.',
    perception: 'Seen as steady and competent, but may appear inflexible or overly serious.',
    strengths: ['Disciplined and methodical', 'Reliable under pressure', 'Long-term thinker', 'Strong work ethic'],
    weaknesses: ['Can be inflexible', 'Resistant to change mid-project', 'May suppress team creativity', 'Slow to adapt strategy'],
    teamValue: 'Delivers consistently, builds strong systems, and ensures the team follows through on commitments.',
    characteristics: [
      'Blends competitive drive with patient persistence',
      'Sets clear expectations and holds people to them',
      'Prefers proven methods over experimental approaches',
      'Balances assertiveness with measured stability',
    ],
  },

  DC: {
    code: 'DC', label: 'THE PIONEER', primaryDim: 'D',
    description:
      'The Pioneer is a bold strategist who drives results through rigorous analysis and decisive action. They set high standards for both themselves and others, combining ambition with precision. They excel in roles requiring both strategic vision and technical expertise.',
    goal: 'Achieve results while maintaining correctness and high standards.',
    fear: 'Inefficiency, incompetence, or being challenged without evidence.',
    stressResponse: 'Becomes critical, dismissive, or demanding of flawless execution.',
    perception: 'Seen as capable and exacting, but may be perceived as cold or excessively critical.',
    strengths: ['Strategic and analytical', 'High personal standards', 'Confident and decisive', 'Thorough in planning'],
    weaknesses: ['Can be overly demanding', 'Impatient with those who underperform', 'May sacrifice people for results', 'Difficulty delegating'],
    teamValue: 'Brings both strategic direction and quality standards, ensuring goals are achieved with precision.',
    characteristics: [
      'Combines bold ambition with systematic thinking',
      'Sets high benchmarks for performance and quality',
      'Challenges inefficiency and poor thinking',
      'Drives accountability with data and results',
    ],
  },

  // ── I-primary combinations ──────────────────────────────────────────────────

  ID: {
    code: 'ID', label: 'THE PERSUADER', primaryDim: 'I',
    description:
      'The Persuader is a charismatic influencer who backs social energy with results orientation. They are natural salespeople and advocates, using emotional intelligence and compelling communication to win others over and drive action. They thrive in high-visibility, high-impact roles.',
    goal: 'Inspire others, achieve recognition, and create tangible results.',
    fear: 'Failure to convince, being overlooked, or losing status.',
    stressResponse: 'Becomes manipulative, overpromises, or exaggerates achievements.',
    perception: 'Seen as magnetic and driven, but can appear self-serving or pushy.',
    strengths: ['Highly persuasive communicator', 'Energetic and confident', 'Results-oriented storyteller', 'Builds broad influence quickly'],
    weaknesses: ['Can oversell or exaggerate', 'May become confrontational when challenged', 'Tends toward self-promotion', 'Impatient with detail'],
    teamValue: 'Sells ideas, drives buy-in, and connects the team\'s work to meaningful outcomes with passion.',
    characteristics: [
      'Combines social flair with competitive drive',
      'Highly persuasive in individual and group settings',
      'Motivated by both recognition and achievement',
      'Moves quickly from idea to action',
    ],
  },

  IS: {
    code: 'IS', label: 'THE COACH', primaryDim: 'I',
    description:
      'The Coach is a nurturing communicator who blends social warmth with genuine care for others\' wellbeing. They are natural mentors — patient listeners who help others grow and thrive. They create trust quickly and use positivity and encouragement to bring out the best in people.',
    goal: 'Help others succeed, foster belonging, and create positive team experiences.',
    fear: 'Conflict, rejection, or causing harm to those they care about.',
    stressResponse: 'Becomes over-accommodating, avoids hard truths, or takes on others\' problems.',
    perception: 'Seen as warm and supportive, but can appear lacking in direction or too soft.',
    strengths: ['Natural mentor and encourager', 'Deeply empathetic', 'Exceptional communicator', 'Creates strong team bonds'],
    weaknesses: ['Avoids difficult feedback', 'Can be overly optimistic about people', 'May neglect task focus for relationships', 'Struggles to set firm boundaries'],
    teamValue: 'Develops people, fosters trust, and creates the psychological safety teams need to perform.',
    characteristics: [
      'Combines enthusiasm with deep personal care',
      'Motivated by others\' growth and happiness',
      'Skilled at reading emotional dynamics',
      'Balances positive energy with genuine empathy',
    ],
  },

  IC: {
    code: 'IC', label: 'THE STRATEGIST', primaryDim: 'I',
    description:
      'The Strategist combines social intelligence with analytical depth. They are thoughtful communicators who think before they speak, blending creativity with logic to produce elegant solutions. They thrive in advisory and consulting roles where insight and influence both matter.',
    goal: 'Generate creative solutions, influence decisions, and achieve recognition for insight.',
    fear: 'Being seen as unintelligent, making poor decisions, or losing credibility.',
    stressResponse: 'Overthinks, becomes indecisive, or withdraws from group settings.',
    perception: 'Seen as insightful and composed, but may appear detached or overly analytical in social situations.',
    strengths: ['Combines creativity with analytical thinking', 'Strong communicator with depth', 'Influential in strategy discussions', 'Balances optimism with realism'],
    weaknesses: ['Can overthink decisions', 'May struggle with emotional directness', 'Inconsistent between social and analytical modes', 'Dislikes routine work'],
    teamValue: 'Bridges creative thinking and logical analysis, bringing well-reasoned ideas to collaborative discussions.',
    characteristics: [
      'Blends social influence with analytical precision',
      'Engages in ideas at both a strategic and interpersonal level',
      'Prefers quality of conversation over quantity',
      'Motivated by intellectual recognition and creativity',
    ],
  },

  // ── S-primary combinations ──────────────────────────────────────────────────

  SD: {
    code: 'SD', label: 'THE SELF-STARTER', primaryDim: 'S',
    description:
      'The Self-Starter is a quietly determined achiever who combines stability with drive. They are reliable, consistent performers who set high personal goals and pursue them with patience and discipline. Though unassuming, they deliver results and earn respect through action, not words.',
    goal: 'Achieve meaningful results while maintaining personal stability and loyalty.',
    fear: 'Instability, public failure, or losing the trust of those they serve.',
    stressResponse: 'Becomes withdrawn, overworks silently, or bottles up frustration.',
    perception: 'Seen as reliable and competent, but may appear reserved or under-assertive.',
    strengths: ['Self-motivated and disciplined', 'Trustworthy and consistent', 'Balances patience with ambition', 'Strong follow-through'],
    weaknesses: ['Can be too self-reliant', 'Reluctant to ask for help', 'May resist visibility or promotion', 'Can be perceived as passive'],
    teamValue: 'Delivers reliably without needing recognition, building trust through consistent performance.',
    characteristics: [
      'Combines steadiness with quiet determination',
      'Sets personal goals and delivers without drama',
      'Earns respect through demonstrated reliability',
      'Balances people-care with task discipline',
    ],
  },

  SI: {
    code: 'SI', label: 'THE HARMONISER', primaryDim: 'S',
    description:
      'The Harmoniser is a warm, relationship-oriented team member whose greatest strength is creating unity. They read group dynamics naturally, mediate tensions effortlessly, and ensure everyone feels valued. They are the glue that holds teams together in difficult times.',
    goal: 'Maintain team harmony, foster belonging, and support others\' wellbeing.',
    fear: 'Conflict, feeling excluded, or letting someone down.',
    stressResponse: 'Becomes a people-pleaser, suppresses own needs, or avoids hard decisions.',
    perception: 'Seen as likable and easy-going, but may be overlooked for leadership roles.',
    strengths: ['Exceptional at mediating and unifying', 'Warm and approachable', 'Highly attuned to team dynamics', 'Creates inclusive environments'],
    weaknesses: ['Avoids assertiveness when needed', 'May prioritise feelings over outcomes', 'Can be manipulated by others', 'Difficulty holding firm positions'],
    teamValue: 'Creates the social cohesion and interpersonal trust that makes high-performing teams possible.',
    characteristics: [
      'Natural peacemaker in conflict situations',
      'Deeply attuned to how others feel',
      'Creates space for everyone to contribute',
      'Balances steadiness with social warmth',
    ],
  },

  SC: {
    code: 'SC', label: 'THE RESEARCHER', primaryDim: 'S',
    description:
      'The Researcher is a patient, detail-oriented professional who approaches their work with systematic thoroughness. They combine stability with analytical rigour, taking time to gather and verify information before drawing conclusions. They are trusted for their reliability and depth.',
    goal: 'Produce accurate, high-quality work and maintain stability in systems and relationships.',
    fear: 'Uncertainty, making errors, or sudden unplanned change.',
    stressResponse: 'Overanalyses, delays decisions, or becomes passive in the face of pressure.',
    perception: 'Seen as thorough and dependable, but can appear slow or overly cautious.',
    strengths: ['Meticulous and methodical', 'Highly reliable and consistent', 'Strong research and analytical skills', 'Patient and persistent'],
    weaknesses: ['Can be slow to decide', 'Resistant to rapid change', 'May overthink straightforward problems', 'Avoids confrontation even when needed'],
    teamValue: 'Ensures the team operates on solid information, preventing errors through careful analysis and consistency.',
    characteristics: [
      'Combines patience with analytical precision',
      'Thorough in research and data gathering',
      'Values consistency and proven methods',
      'Earns trust through steady, reliable output',
    ],
  },

  // ── C-primary combinations ──────────────────────────────────────────────────

  CD: {
    code: 'CD', label: 'THE INNOVATOR', primaryDim: 'C',
    description:
      'The Innovator is a systems-thinking disruptor who combines analytical rigour with results-oriented drive. They challenge the status quo with evidence, build new frameworks where old ones fail, and push for better — not just different. They lead through logic, not charisma.',
    goal: 'Redesign broken systems, solve complex problems, and achieve measurable improvement.',
    fear: 'Mediocrity, poor quality, or being forced to work within flawed systems.',
    stressResponse: 'Becomes dismissive, hypercritical, or moves to solo-execution.',
    perception: 'Seen as brilliant and forward-thinking, but can appear arrogant or impatient.',
    strengths: ['Exceptional problem solver', 'Challenges inefficiency with evidence', 'Builds scalable systems', 'Highly self-directed'],
    weaknesses: ['Can dismiss others\' contributions', 'Impatient with slower thinkers', 'May over-engineer solutions', 'Struggles with routine operations'],
    teamValue: 'Redesigns how the team works, challenging assumptions and building smarter processes.',
    characteristics: [
      'Combines rigorous analysis with bold action',
      'Driven by logic and evidence, not tradition',
      'Creates new approaches to complex problems',
      'Holds high standards for systems and outcomes',
    ],
  },

  CI: {
    code: 'CI', label: 'THE EXPERT', primaryDim: 'C',
    description:
      'The Expert is a deeply knowledgeable professional who combines analytical precision with genuine warmth. They are respected for their intellectual depth and ability to explain complex ideas clearly. They build trust through competence and care, and are natural subject-matter advisors.',
    goal: 'Develop deep expertise, share knowledge generously, and be respected for quality thinking.',
    fear: 'Being seen as incompetent, making public errors, or losing professional credibility.',
    stressResponse: 'Withdraws, over-prepares, or becomes dismissive of simpler perspectives.',
    perception: 'Seen as knowledgeable and approachable, but can appear overly serious or difficult to engage casually.',
    strengths: ['Deep domain expertise', 'Clear and logical communicator', 'Respected for quality and care', 'Patient teacher and advisor'],
    weaknesses: ['May over-explain or lecture', 'Can be slow to act without full knowledge', 'Dislikes uncertainty or ambiguity', 'Struggles with imperfect conditions'],
    teamValue: 'Provides intellectual depth and builds the team\'s knowledge base through clear, expert guidance.',
    characteristics: [
      'Combines analytical depth with genuine warmth',
      'Respected equally for quality thinking and care for people',
      'Shares knowledge freely and generously',
      'Builds trust through competence and consistency',
    ],
  },

  CS: {
    code: 'CS', label: 'THE PERFECTIONIST', primaryDim: 'C',
    description:
      'The Perfectionist is a detail-obsessed quality guardian who combines high standards with a genuine commitment to people. They ensure that processes, communications, and outcomes meet exacting standards — not for pride, but because they deeply care about doing things right.',
    goal: 'Maintain excellence, avoid errors, and ensure all work meets the highest standard.',
    fear: 'Criticism of their work, making mistakes, or being held responsible for poor quality.',
    stressResponse: 'Becomes overly critical, paralysed by perfectionism, or withdraws under pressure.',
    perception: 'Seen as thorough and reliable, but can appear overly cautious or nit-picky.',
    strengths: ['Exceptional quality focus', 'Reliable and consistent performer', 'Strong attention to process', 'Genuinely cares about outcomes'],
    weaknesses: ['Can delay progress seeking perfection', 'Overly self-critical', 'Difficulty delegating important tasks', 'Can stifle team creativity with high standards'],
    teamValue: 'Maintains quality control and process integrity, ensuring the team\'s output meets the highest standards.',
    characteristics: [
      'Driven by precision and a fear of mistakes',
      'Combines analytical standards with genuine care for people',
      'Thorough in all communication and documentation',
      'Values both accuracy and interpersonal harmony',
    ],
  },
};

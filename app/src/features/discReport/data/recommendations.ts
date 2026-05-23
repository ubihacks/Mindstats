/**
 * Individual and Manager recommendations for High/Low scores per DISC type.
 * Used on pages 8–11 of the report.
 */

export interface RecommendationSection {
  heading: string;
  bullets: string[];
}

export interface TypeRecommendation {
  individualHigh: { title: string; sections: RecommendationSection[] };
  individualLow:  { title: string; sections: RecommendationSection[] };
  managerHigh:    { title: string; sections: RecommendationSection[] };
  managerLow:     { title: string; sections: RecommendationSection[] };
}

export const RECOMMENDATIONS: Record<'D' | 'I' | 'S' | 'C', TypeRecommendation> = {

  D: {
    individualHigh: {
      title: 'High D — Individual Guidance',
      sections: [
        {
          heading: 'Leveraging Your Strengths',
          bullets: [
            'Channel your decisiveness into leading high-stakes initiatives where speed matters.',
            'Use your competitive drive to set ambitious personal benchmarks.',
            'Own projects end-to-end — your ability to drive through obstacles is rare.',
            'Position yourself as the person who gets things done when others hesitate.',
          ],
        },
        {
          heading: 'Areas for Development',
          bullets: [
            'Practise active listening — pausing before responding builds trust and better outcomes.',
            'Invite dissenting opinions deliberately; diverse input sharpens your decisions.',
            'Recognise that building buy-in, while slower, produces more durable results.',
            'Notice when urgency is manufactured — not every decision needs to be made today.',
          ],
        },
      ],
    },
    individualLow: {
      title: 'Low D — Individual Guidance',
      sections: [
        {
          heading: 'Recognising Your Value',
          bullets: [
            'Your collaborative, considered approach prevents rash decisions that cost organisations dearly.',
            'Your willingness to listen deeply makes others feel heard and valued.',
            'You build sustainable solutions — not just fast ones.',
            'Your consensus-building creates broader ownership of outcomes.',
          ],
        },
        {
          heading: 'Stretching Your Comfort Zone',
          bullets: [
            'Practice setting clear personal boundaries and advocating for your ideas more assertively.',
            'Take ownership of a high-visibility project to build confidence in decision-making.',
            'Set a deadline for decisions and commit — analysis paralysis has real costs.',
            'Seek feedback-rich environments where your voice is explicitly invited.',
          ],
        },
      ],
    },
    managerHigh: {
      title: 'Managing a High D',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Give them authority and clear ownership — micromanagement will cause friction.',
            'Be direct and get to the point quickly in all communication.',
            'Provide challenging goals and opportunities to compete.',
            'Allow them to make decisions within their domain without second-guessing.',
          ],
        },
        {
          heading: 'What to Watch For',
          bullets: [
            'Monitor for team relationship damage caused by blunt or dismissive behaviour.',
            'Ensure they receive structured feedback on the impact of their communication style.',
            'Create accountability for how, not just what, they deliver.',
            'Pair them with S or C types to balance pace and quality.',
          ],
        },
      ],
    },
    managerLow: {
      title: 'Managing a Low D',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Provide clear direction and structured decision frameworks.',
            'Create a safe environment for them to voice opinions without being overridden.',
            'Assign them roles where thoroughness and collaboration are valued.',
            'Recognise their contributions explicitly — they won\'t self-promote.',
          ],
        },
        {
          heading: 'How to Develop Them',
          bullets: [
            'Gradually assign them stretch projects that require assertive decision-making.',
            'Debrief decisions with them to build confidence over time.',
            'Encourage them to advocate for their ideas in group settings.',
            'Celebrate wins when they take initiative.',
          ],
        },
      ],
    },
  },

  I: {
    individualHigh: {
      title: 'High I — Individual Guidance',
      sections: [
        {
          heading: 'Leveraging Your Strengths',
          bullets: [
            'Lead communication-heavy initiatives — pitches, launches, and stakeholder engagement.',
            'Use your network to open doors that analysis alone cannot.',
            'Volunteer as the team\'s spokesperson in cross-functional meetings.',
            'Your enthusiasm is contagious — use it to champion causes others overlook.',
          ],
        },
        {
          heading: 'Areas for Development',
          bullets: [
            'Build systems to track follow-through — your energy is high but commitments can slip.',
            'Practise delivering difficult messages directly, without over-softening.',
            'Dedicate focused time to detail-heavy work before seeking social stimulation.',
            'Learn to distinguish between being liked and being respected — both matter.',
          ],
        },
      ],
    },
    individualLow: {
      title: 'Low I — Individual Guidance',
      sections: [
        {
          heading: 'Recognising Your Value',
          bullets: [
            'Your considered, thoughtful communication prevents misunderstandings.',
            'You build credibility through substance rather than style.',
            'Your depth of relationships, though fewer, tends to be more enduring.',
            'People trust what you say because you don\'t say things lightly.',
          ],
        },
        {
          heading: 'Stretching Your Comfort Zone',
          bullets: [
            'Practice small talk as a deliberate skill — relationship capital compounds over time.',
            'Share your perspectives in group settings, even when you prefer to observe.',
            'Seek one collaborative project outside your comfort zone per quarter.',
            'Use written communication as a bridge to verbal sharing of ideas.',
          ],
        },
      ],
    },
    managerHigh: {
      title: 'Managing a High I',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Provide public recognition and celebrate their wins visibly.',
            'Keep them engaged with varied, socially rich work.',
            'Allow them to collaborate and brainstorm — isolation reduces their performance.',
            'Give feedback with warmth and specific positive examples.',
          ],
        },
        {
          heading: 'What to Watch For',
          bullets: [
            'Ensure they have accountability systems — enthusiasm doesn\'t always equal follow-through.',
            'Monitor for overpromising to stakeholders.',
            'Ensure they document and communicate plans, not just ideas.',
            'Balance their natural optimism with realistic goal-setting.',
          ],
        },
      ],
    },
    managerLow: {
      title: 'Managing a Low I',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Create structured opportunities for them to contribute — don\'t rely on them to self-promote.',
            'Use written briefings and agendas so they can prepare before group discussions.',
            'Respect their need for focused, deep work time.',
            'Offer 1:1 feedback rather than group praise.',
          ],
        },
        {
          heading: 'How to Develop Them',
          bullets: [
            'Involve them in stakeholder presentations with preparation time.',
            'Pair them with high-I colleagues to observe relationship-building techniques.',
            'Encourage them to lead team meetings in structured formats.',
            'Celebrate the depth of their relationships, not just breadth.',
          ],
        },
      ],
    },
  },

  S: {
    individualHigh: {
      title: 'High S — Individual Guidance',
      sections: [
        {
          heading: 'Leveraging Your Strengths',
          bullets: [
            'Take on roles requiring deep relationship management or long-term stakeholder trust.',
            'Lead projects that require sustained patience and methodical execution.',
            'Serve as the team\'s anchor during periods of high change.',
            'Use your natural empathy to sense team tension before it escalates.',
          ],
        },
        {
          heading: 'Areas for Development',
          bullets: [
            'Practice expressing disagreement clearly rather than deferring to avoid conflict.',
            'Set boundaries around your time — your helpfulness can be taken for granted.',
            'Embrace change initiatives by focusing on the stability within them.',
            'Volunteer for stretch roles even when uncertain — growth requires discomfort.',
          ],
        },
      ],
    },
    individualLow: {
      title: 'Low S — Individual Guidance',
      sections: [
        {
          heading: 'Recognising Your Value',
          bullets: [
            'You adapt quickly in environments where others struggle to adjust.',
            'You\'re not attached to "the way things were" — a rare and valuable quality.',
            'You naturally seek novelty, which drives innovation.',
            'Your restlessness pushes teams to evolve rather than stagnate.',
          ],
        },
        {
          heading: 'Stretching Your Comfort Zone',
          bullets: [
            'Build habits and routines that anchor you through ambiguous periods.',
            'Practice patience with colleagues who need more time to process change.',
            'Develop your follow-through — excitement at the start must translate to delivery.',
            'Invest more deeply in fewer relationships rather than moving broadly.',
          ],
        },
      ],
    },
    managerHigh: {
      title: 'Managing a High S',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Provide advance notice of changes — surprises cause disproportionate stress.',
            'Offer a stable, structured environment with clear expectations.',
            'Show genuine appreciation for their loyalty and consistency.',
            'Create space for them to raise concerns privately rather than in group settings.',
          ],
        },
        {
          heading: 'What to Watch For',
          bullets: [
            'Watch for silent disengagement — they won\'t always voice discontent directly.',
            'Ensure they\'re not absorbing too much of others\' emotional burden.',
            'Gently push them toward visibility and self-advocacy.',
            'Ensure change communication is thorough and repeated.',
          ],
        },
      ],
    },
    managerLow: {
      title: 'Managing a Low S',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Provide variety and rotation in their projects to maintain engagement.',
            'Allow flexibility in how they approach work — rigid process frustrates them.',
            'Keep them informed of upcoming changes as an energising opportunity.',
            'Leverage their adaptability in roles requiring rapid pivots.',
          ],
        },
        {
          heading: 'How to Develop Them',
          bullets: [
            'Coach them on the value of consistency and follow-through for team trust.',
            'Help them develop patience as a leadership skill.',
            'Assign them to mentor or support roles to deepen relationship investment.',
            'Celebrate their completion of long-term projects, not just new starts.',
          ],
        },
      ],
    },
  },

  C: {
    individualHigh: {
      title: 'High C — Individual Guidance',
      sections: [
        {
          heading: 'Leveraging Your Strengths',
          bullets: [
            'Lead quality assurance, compliance, or research-heavy functions.',
            'Act as the team\'s sceptic — your questions prevent costly mistakes.',
            'Use your systematic thinking to build scalable, repeatable processes.',
            'Serve as the subject matter expert others consult before making decisions.',
          ],
        },
        {
          heading: 'Areas for Development',
          bullets: [
            'Set a "good enough" standard and commit to it — perfectionism has a cost.',
            'Practice sharing opinions with confidence, not just facts.',
            'Build comfort with ambiguity by making smaller decisions quickly and learning.',
            'Invest in relationships — likability and logic are not mutually exclusive.',
          ],
        },
      ],
    },
    individualLow: {
      title: 'Low C — Individual Guidance',
      sections: [
        {
          heading: 'Recognising Your Value',
          bullets: [
            'Your big-picture thinking prevents teams from over-engineering solutions.',
            'You move fast — an advantage in competitive environments.',
            'Your comfort with imperfection enables iteration rather than paralysis.',
            'You bring spontaneity and adaptability that detail-focused people struggle to access.',
          ],
        },
        {
          heading: 'Stretching Your Comfort Zone',
          bullets: [
            'Build a personal checklist habit for high-stakes deliverables.',
            'Slow down on consequential decisions — gather at least three data points.',
            'Work alongside C-type colleagues to learn quality frameworks without adopting perfectionism.',
            'Create space for your own reflection before acting on instinct alone.',
          ],
        },
      ],
    },
    managerHigh: {
      title: 'Managing a High C',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Provide complete context and clear logical rationale for decisions.',
            'Allow time for thorough analysis before expecting decisions.',
            'Give feedback in writing with specific examples.',
            'Respect their need for private thinking time — don\'t demand instant responses.',
          ],
        },
        {
          heading: 'What to Watch For',
          bullets: [
            'Watch for analysis paralysis on time-sensitive deliverables.',
            'Ensure they\'re not overly critical of colleagues\' work.',
            'Encourage them to share their thinking aloud — others benefit from their logic.',
            'Celebrate imperfect wins to break perfectionistic cycles.',
          ],
        },
      ],
    },
    managerLow: {
      title: 'Managing a Low C',
      sections: [
        {
          heading: 'What They Need From You',
          bullets: [
            'Create clear quality checkpoints rather than relying on self-monitoring.',
            'Pair them with a detail-oriented colleague on high-stakes deliverables.',
            'Provide direct feedback when standards aren\'t met — they can handle it.',
            'Set explicit expectations around documentation and process adherence.',
          ],
        },
        {
          heading: 'How to Develop Them',
          bullets: [
            'Help them develop a personal quality framework they can apply consistently.',
            'Assign them to audit or review work — building critical evaluation skills.',
            'Coach them to pause and reflect before finalising important decisions.',
            'Recognise improvement in attention to detail explicitly.',
          ],
        },
      ],
    },
  },
};

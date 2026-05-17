// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'HIRING_MANAGER';

export type AssessmentStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';

export type InviteStatus = 'PENDING' | 'COMPLETED' | 'EXPIRED';

export type PlanType = 'ON_DEMAND' | 'STEADY' | 'GROWTH' | 'SCALE';

export type PaymentCycle = 'MONTHLY' | 'YEARLY';

export type UIStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  companyDomain: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  status: UIStatus;
  error: string | null;
  initialized: boolean;
}

// ─── Assessment ──────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  options: QuestionOption[];
}

export interface QuestionAnswer {
  questionId: number;
  mostOptionId: string | null;
  leastOptionId: string | null;
}

export interface AssessmentState {
  questions: Question[];
  answers: Record<number, QuestionAnswer>;
  currentQuestionIndex: number;
  status: UIStatus;
  submittedAt: string | null;
}

// ─── Roles ───────────────────────────────────────────────────────────────────

export interface HiringRole {
  id: string;
  title: string;
  jobLevel: string;
  function: string;
  uniqueCode: string;
  companyId: string;
  hiringManagerId: string | null;
  hiringManagerEmail: string | null;
  hiringManagerName: string | null;
  hiringManagerStatus: AssessmentStatus;
  behaviouralDemand: string | null;
  candidates: Candidate[];
  createdAt: string;
}

export interface DiscScores { D: number; I: number; S: number; C: number }

export interface Candidate {
  id: string;
  name: string;
  email: string;
  inviteToken: string;
  inviteStatus: InviteStatus;
  invitedAt: string;
  expiresAt: string;
  reportUrl: string | null;
  shareReportWithCandidate: boolean;
  discScores?: DiscScores | null;
}

export interface RolesState {
  roles: HiringRole[];
  selectedRoleId: string | null;
  status: UIStatus;
  error: string | null;
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface Plan {
  type: PlanType;
  name: string;
  creditsPerMonth: number;
  maxUsers: number;
  maxRolloverCredits: number;
  priceMonthly: number;
  priceYearly: number;
  supportLabel: string;
  responseTime: string;
}

export interface BillingState {
  currentPlan: PlanType | null;
  paymentCycle: PaymentCycle;
  credits: number;
  usedCredits: number;
  status: UIStatus;
  error: string | null;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  roleId: string;
  candidateId: string | null;
  uploadedAt: string;
  fileUrl: string;
  fileType: 'PDF' | 'EXCEL';
  uploadedBy: string;
}

export interface AssessmentResult {
  id: string;
  roleId: string;
  respondentId: string;
  assessmentType: 'HIRING_MANAGER' | 'CANDIDATE';
  discScores: DiscScores | null;
  submittedAt: string;
  candidateName?: string;
  candidateEmail?: string;
  roleTitle?: string;
}

export interface ReportsState {
  reports: Report[];
  assessmentResults: AssessmentResult[];
  resultsStatus: UIStatus;
  status: UIStatus;
  error: string | null;
}

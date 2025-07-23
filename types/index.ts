export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}
export interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date,
  isPremium: boolean,
  referralCode: string,
  referralPoints: number,
  role: "admin" | "user"
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name: string;
  email: string;
  password: string;
  roleId: string
}

export interface ForgotPasswordData {
  email: string;
}
export type TabType = 'overview' | 'documents' | 'messages' | 'billing';

export const roles = [
  {
    "_id": "6866e1abae6342167c9b35e9",
    "name": "Client"
  },
  {
    "_id": "6866e1acae6342167c9b35ea",
    "name": "Law Firm Admin"
  }
]
export const adminRole: Role = {
  _id: "6872d7051a3f220ffd342e01",
  name: "Law Firm Admin"
};
export const clientRole: Role = {
  "_id": "6872d7051a3f220ffd342e00",
  "name": "Client"
}

export const invitationRoles = [
  {
    "_id": "6866e1acae6342167c9b35eb",
    "name": "Paralegal"
  },
  {
    "_id": "6866e1acae6342167c9b35ec",
    "name": "Secretary"
  }
]

export interface Role {
  _id: string;
  name: string;
  description?: string;
}

export type SCOPE = "case" | "company" | "direct"

export interface ChatThread {
  _id: string,
  scope: SCOPE,
  caseId: string,
  clientCompanyId: null,
  lawCompanyId: null,
  participants: [{ userId: string, companyId: string }],
  createdAt: string,
  updatedAt: string
}

export interface ChatMessage {
  _id: string,
  scope: SCOPE,
  threadId: string,
  receiverId: string,
  content: string,
  type: "text" | "other",
  createdAt: string,
  updatedAt: string,
  sender: {
    _id: string,
    name: string,
    email: string,
    isCompanyOwner: boolean,
    createdAt: string,
    role: Role,
  },
  company: {
    _id: string,
    name: string,
    type: string,
    ownerId: string,
    createdAt: string,
    updatedAt: string
  }
}

// AI Chat specific types
export interface AIChatMessage {
  _id: string,
  userId: string,
  roleId: string,
  message: string,
  response: string,
  sessionId: string,
  createdAt: string,
  flaggedForReview: boolean
}

export interface AIChatSession {
  _id: string,
  userId: string,
  sessionName: string,
  createdAt: string
}


export type SettlementAgreement= {
  date: string;
  claimantName: string;
  claimantAddress: string;
  defendantName: string;
  dateOfIncident: string;
  settlementAmount: string;
  governingState: string;
}

export type MedicalRecordRequest = {
  healthcareProvider: string;
  providerAddress: string;
  patientName: string;
  dateOfBirth: string;
  recordsFromDate: string;
  recordsToDate: string;
  specificRecords: string;
}
export type CourtFillingRequest= {
  caseNumber: string;
  courtName: string;
  motionType: string;
  plainTiff: string;
  Defendant: string;
  reliefSought: string;
  supportingFacts: string;
  submittedBy: string;
  date: string;
}

export type ClientIntakeRequest ={
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  emailAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  dateOfIncident: string;
  locationOfIncident: string;
  descriptionOfIncident: string;
  injuiresSustained: string;
  medicalProviders: string;
  insuranceCompany: string;
  policyNumber: string;
  attorneyNotes: string;
}
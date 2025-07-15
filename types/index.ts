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
    roleId:string
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  export type TabType = 'overview' | 'documents' | 'messages' | 'billing';
  
  export const roles=[
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

export const invitationRoles=[
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

  export interface ChatThread {
    _id: string;
    caseId: string;
    caseTitle: string;
    lastMessage: string;
    lastMessageAt: string;
    participants: string[];
    unreadCount: number;
  }
  
  export interface ChatMessage {
    _id: string;
    caseId: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    read: boolean;
  }
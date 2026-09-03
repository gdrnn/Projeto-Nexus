export type ActiveTab =
  | "home"
  | "recursos"
  | "ai"
  | "projeto"
  | "mapa"
  | "dashboard"
  | "simulador"
  | "riscos"
  | "conquistas";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
  role?: string;
  createdAt: string;
  token?: string;
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  completed: boolean;
  priority: "baixa" | "media" | "alta";
  category?: string;
  createdAt: string;
}

export interface ProjectPhase {
  id: number;
  number: string;
  name: string;
  title: string;
  description: string;
  days: number;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  budget: number;
  deadline: number;
  progress: number;
  viability: number;
  createdAt: string;
  teamSize?: number;
  riskLevel?: "Baixo" | "Moderado" | "Alto";
  status?: "Planejamento" | "Em Execução" | "Concluído";
  aiAnalysis?: string;
}

export interface RiskItem {
  id: string;
  category: "financeiro" | "operacional" | "tecnico" | "mercado";
  title: string;
  severity: "baixo" | "medio" | "alto";
  probability: number;
  description: string;
  mitigation: string;
}

export interface NexusNotification {
  id: string;
  title: string;
  body: string;
  type: "system" | "project" | "achievement" | "ai" | "deadline";
  timestamp: string;
  read: boolean;
  actionTab?: ActiveTab;
}

export interface Achievement {
  id: string | number;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  category: string;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  source?: "gemini" | "local";
}

export interface SimulatorState {
  budget: number;
  team: number;
  deadlineDays: number;
}

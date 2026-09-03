import { User, Project, Task, Achievement, NexusNotification, ChatMessage } from "../types";

const STORAGE_KEYS = {
  USER: "nexus_user",
  USERS_LIST: "nexus_registered_users",
  PROJECTS: "nexus_projects",
  ACTIVE_PROJECT_ID: "nexus_active_project_id",
  TASKS: "nexus_tasks",
  NOTIFICATIONS: "nexus_notifications",
  ACHIEVEMENTS: "nexus_achievements",
  PUSH_ENABLED: "nexus_push_enabled",
  CHAT_HISTORY: "nexus_chat_history",
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 0,
    icon: "🏆",
    title: "Primeiro Projeto",
    description: "Crie ou estruture seu primeiro projeto no Nexus.",
    unlocked: true,
    category: "Criação",
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 1,
    icon: "⚡",
    title: "Mestre da Produtividade",
    description: "Conclua 5 tarefas prioritárias no painel de controle.",
    unlocked: false,
    category: "Gestão",
  },
  {
    id: 2,
    icon: "🔥",
    title: "Meio Caminho Andado",
    description: "Atinja 50% de progresso geral no projeto ativo.",
    unlocked: false,
    category: "Execução",
  },
  {
    id: 3,
    icon: "🧠",
    title: "Estrategista de IA",
    description: "Realize 3 análises de projeto com o Nexus AI.",
    unlocked: false,
    category: "Inteligência",
  },
  {
    id: 4,
    icon: "🔔",
    title: "Sempre Conectado",
    description: "Ative notificações push para alertas em tempo real.",
    unlocked: false,
    category: "Sistema",
  },
  {
    id: 5,
    icon: "💎",
    title: "Lançamento Triunfal",
    description: "Alcance 100% de conclusão e prepare o lançamento.",
    unlocked: false,
    category: "Conquista",
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Definir proposta de valor única e público-alvo",
    completed: true,
    priority: "alta",
    category: "Pesquisa",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Análise comparativa de 5 concorrentes diretos",
    completed: true,
    priority: "media",
    category: "Pesquisa",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Modelagem orçamentária e cálculo de ponto de equilíbrio",
    completed: true,
    priority: "alta",
    category: "Planejamento",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Definir estratégia de aquisição e go-to-market",
    completed: false,
    priority: "media",
    category: "Planejamento",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Desenvolver protótipo navegável ou MVP",
    completed: false,
    priority: "alta",
    category: "Execução",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-6",
    title: "Executar testes de usabilidade com 10 pioneiros",
    completed: false,
    priority: "baixa",
    category: "Validação",
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Cafeteria & Hub Conecta",
    category: "Alimentos & Bebidas",
    description: "Espaço gourmet de cafés especiais com área de coworking e eventos para criadores e startups.",
    budget: 65000,
    deadline: 90,
    progress: 68,
    viability: 88,
    teamSize: 4,
    riskLevel: "Moderado",
    status: "Em Execução",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    aiAnalysis: "Projeto sólido com forte tração comunitária. Margem bruta estimada em 62%.",
  },
  {
    id: "proj-2",
    name: "App Mobile HealthTracker",
    category: "Tecnologia & Saúde",
    description: "Aplicativo inteligente para monitoramento biométrico preventivo e rotinas personalizadas.",
    budget: 45000,
    deadline: 75,
    progress: 35,
    viability: 82,
    teamSize: 3,
    riskLevel: "Baixo",
    status: "Em Execução",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: NexusNotification[] = [
  {
    id: "notif-1",
    title: "Bem-vindo ao Project Nexus! 🚀",
    body: "Sua central de ideação e gestão executiva está ativa. Experimente consultar o Nexus AI.",
    type: "system",
    timestamp: new Date().toISOString(),
    read: false,
    actionTab: "ai",
  },
  {
    id: "notif-2",
    title: "Meta de Tarefas Atualizada",
    body: "Você concluiu 3 das 6 tarefas iniciais do projeto. Continue assim!",
    type: "project",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    actionTab: "dashboard",
  },
];

export const Storage = {
  getUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    return this.getUser();
  },

  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  saveCurrentUser(user: User): void {
    this.setUser(user);
  },

  logout(): void {
    this.setUser(null);
  },

  getRegisteredUsers(): Array<{ email: string; passwordHash: string; name: string; id: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRegisteredUser(userData: { email: string; passwordHash: string; name: string; id: string }): void {
    const list = this.getRegisteredUsers();
    list.push(userData);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(list));
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getActiveProjectId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID) || "proj-1";
  },

  setActiveProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getNotifications(): NexusNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NexusNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  isPushEnabled(): boolean {
    return localStorage.getItem(STORAGE_KEYS.PUSH_ENABLED) === "true";
  },

  setPushEnabled(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.PUSH_ENABLED, String(enabled));
  },

  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveChatHistory(history: ChatMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history.slice(-30)));
  },
};

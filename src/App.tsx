import React, { useState, useEffect } from "react";
import {
  ActiveTab,
  User,
  Project,
  Task,
  NexusNotification,
  Achievement,
} from "./types";
import { Storage } from "./lib/storage";
import { PushNotificationService, playNotificationSound } from "./lib/notifications";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Recursos } from "./components/Recursos";
import { NexusAIChat } from "./components/NexusAIChat";
import { ProjectCreator } from "./components/ProjectCreator";
import { RoadmapAndMap } from "./components/RoadmapAndMap";
import { Dashboard } from "./components/Dashboard";
import { Simulator } from "./components/Simulator";
import { RiskCenter } from "./components/RiskCenter";
import { Achievements } from "./components/Achievements";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { NotificationModal } from "./components/NotificationModal";
import { CheckCircle2, Info } from "lucide-react";

export default function App() {
  // State Initialization
  const [currentUser, setCurrentUser] = useState<User | null>(() => Storage.getCurrentUser());
  const [projects, setProjects] = useState<Project[]>(() => Storage.getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = Storage.getProjects();
    return saved.length > 0 ? saved[0].id : "";
  });
  const [tasks, setTasks] = useState<Task[]>(() => Storage.getTasks());
  const [notifications, setNotifications] = useState<NexusNotification[]>(() =>
    Storage.getNotifications()
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    Storage.getAchievements()
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  // Modals & Dialogs
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA & Push Status
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [pushPermissionVersion, setPushPermissionVersion] = useState(0);

  // Show Toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Register PWA Service Worker & BeforeInstallPrompt
  useEffect(() => {
    // Register Service Worker
    PushNotificationService.registerServiceWorker().then((success) => {
      if (success) {
        console.log("PWA Service Worker ativo!");
      }
    });

    // Check if already in standalone mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
    ) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Sync projects and tasks to storage
  useEffect(() => {
    Storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveNotifications(notifications);
  }, [notifications]);

  // Active Project object
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  // Handler: Tab Navigation with smooth scrolling
  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    Storage.saveCurrentUser(user);
    setIsAuthOpen(false);
    showToast(`Bem-vindo de volta ao Project Nexus, ${user.name}! 🚀`);
    playNotificationSound();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    Storage.logout();
    showToast("Sessão encerrada com segurança.");
  };

  // PWA Install Trigger
  const handleInstallApp = async () => {
    if (!installPrompt) {
      showToast("App já instalado ou seu navegador não suporta instalação direta.");
      return;
    }
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsAppInstalled(true);
      showToast("Project Nexus instalado como PWA no seu dispositivo! 📱");
    }
    setInstallPrompt(null);
  };

  // Project Handlers
  const handleSaveProject = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  };

  const handleDeleteProject = (projId: string) => {
    if (projects.length <= 1) {
      showToast("Você precisa manter pelo menos um projeto cadastrado.");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== projId));
    if (activeProjectId === projId) {
      const remaining = projects.filter((p) => p.id !== projId);
      setActiveProjectId(remaining[0]?.id || "");
    }
    showToast("Projeto removido.");
  };

  const handleUpdateProjectParams = (
    budget: number,
    deadline: number,
    team: number,
    viability: number
  ) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, budget, deadline, teamSize: team, viability }
          : p
      )
    );
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, priority: "baixa" | "media" | "alta") => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId: activeProjectId,
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Tarefa removida.");
  };

  // Notification & Push Handlers
  const handleTriggerTestPush = async (
    title: string,
    body: string,
    actionTab?: ActiveTab
  ) => {
    // 1. Send native browser push notification
    await PushNotificationService.sendPushNotification(title, { body });

    // 2. Add to in-app notification state
    const newNotif: NexusNotification = {
      id: `notif_${Date.now()}`,
      title,
      body,
      type: actionTab === "ai" ? "ai" : actionTab === "mapa" ? "deadline" : "system",
      timestamp: new Date().toISOString(),
      read: false,
      actionTab,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Notificação disparada: ${title}`);
    playNotificationSound();
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("Todas as notificações foram marcadas como lidas.");
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
    Storage.saveNotifications([]);
    showToast("Histórico de notificações limpo.");
  };

  const handleSelectNotification = (notif: NexusNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.actionTab) {
      setIsNotifOpen(false);
      handleNavigate(notif.actionTab);
    }
  };

  const handleAskAIRisk = (riskTitle: string) => {
    handleNavigate("ai");
    showToast(`Consultando estratégias de mitigação para: ${riskTitle}`);
  };

  const isPushActive = PushNotificationService.getPermission() === "granted";
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-2xl bg-[#0e1320] border border-cyan-500/40 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,212,255,0.25)] flex items-center gap-3 animate-in slide-in-from-bottom duration-200"
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
            <Info className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onInstallApp={handleInstallApp}
        isInstallable={!!installPrompt}
      />

      {/* Main Application Content */}
      <main className="pt-20">
        {/* 1. Hero Showcase */}
        <Hero
          onStartProject={() => handleNavigate("projeto")}
          onExploreAI={() => handleNavigate("ai")}
          activeProject={activeProject}
          completedTasksCount={completedTasksCount}
          totalTasksCount={tasks.length}
        />

        {/* 2. Recursos Grid */}
        <Recursos onNavigate={handleNavigate} />

        {/* 3. Nexus AI Chat Console */}
        <NexusAIChat currentUser={currentUser} showToast={showToast} />

        {/* 4. Project Creator & Manager */}
        <ProjectCreator
          currentUser={currentUser}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            showToast("Projeto ativo atualizado.");
          }}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          showToast={showToast}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* 5. Roadmap & Topological Map */}
        <RoadmapAndMap showToast={showToast} />

        {/* 6. Smart Dashboard & Tasks */}
        <Dashboard
          activeProject={activeProject}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          showToast={showToast}
        />

        {/* 7. Scenario Simulator */}
        <Simulator
          activeProject={activeProject}
          onUpdateProjectParams={handleUpdateProjectParams}
          showToast={showToast}
        />

        {/* 8. Risk Management Center */}
        <RiskCenter onAskAIAboutRisk={handleAskAIRisk} />

        {/* 9. Gamification & Achievements */}
        <Achievements
          achievements={achievements}
          completedTasksCount={completedTasksCount}
          isPushActive={isPushActive}
          showToast={showToast}
        />
      </main>

      {/* Modern Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Secure Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      {/* Push Notifications & Notification Center Drawer */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onClearAll={handleClearAllNotifs}
        onSelectNotification={handleSelectNotification}
        onTriggerTestPush={handleTriggerTestPush}
        showToast={showToast}
        onPushPermissionChanged={() => setPushPermissionVersion((v) => v + 1)}
      />
    </div>
  );
}

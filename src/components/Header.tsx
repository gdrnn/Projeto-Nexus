import React, { useState } from "react";
import { User, ActiveTab } from "../types";
import {
  Bell,
  Sparkles,
  LayoutDashboard,
  Layers,
  MapPin,
  Sliders,
  ShieldAlert,
  Award,
  FolderPlus,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Download,
  CheckCircle2,
} from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  unreadCount: number;
  isPushActive: boolean;
  onOpenAuth: (mode?: "login" | "signup") => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadCount,
  isPushActive,
  onOpenAuth,
  onLogout,
  onOpenNotifications,
  onInstallPwa,
  canInstallPwa,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Início", icon: <Layers className="w-4 h-4" /> },
    { id: "ai", label: "Nexus AI", icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
    { id: "projeto", label: "Projetos", icon: <FolderPlus className="w-4 h-4" /> },
    { id: "mapa", label: "Mapa & Roadmap", icon: <MapPin className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "simulador", label: "Simulador", icon: <Sliders className="w-4 h-4" /> },
    { id: "riscos", label: "Riscos", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "conquistas", label: "Conquistas", icon: <Award className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="header-logo"
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-lg shadow-[0_0_20px_rgba(0,212,255,0.35)] group-hover:scale-105 transition-transform duration-300">
            N
          </div>
          <div>
            <div className="text-[10px] tracking-[3px] text-slate-400 font-bold uppercase">Project</div>
            <div className="text-base font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
              NEXUS
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* PWA Install Button (if available) */}
          {canInstallPwa && onInstallPwa && (
            <button
              id="header-pwa-install-btn"
              onClick={onInstallPwa}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition"
              title="Instalar aplicativo"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instalar</span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition group cursor-pointer"
            title="Notificações Push e Alertas"
            aria-label="Abrir notificações"
          >
            <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 shadow-[0_0_10px_rgba(0,212,255,0.6)] animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {isPushActive && unreadCount === 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#07090e]" />
            )}
          </button>

          {/* User Profile or Login */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[90px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d111a] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-300">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Sessão Segura Ativa
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick("dashboard");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" /> Meu Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenNotifications();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5" /> Notificações Push
                    </button>
                  </div>
                  <div className="pt-1 border-t border-white/10">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => onOpenAuth("login")}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl border border-white/15 hover:border-white/30 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                Entrar
              </button>
              <button
                id="header-signup-btn"
                onClick={() => onOpenAuth("signup")}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:brightness-110 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all cursor-pointer"
              >
                Criar conta
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
            aria-label="Abrir menu mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07090e]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

          {!currentUser && (
            <div className="pt-3 mt-3 border-t border-white/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("login");
                }}
                className="w-full py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-center text-slate-200"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("signup");
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-xs font-bold text-center text-white"
              >
                Criar conta
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

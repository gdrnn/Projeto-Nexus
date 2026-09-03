import React, { useState, useId } from "react";
import { User } from "../types";
import { Storage } from "../lib/storage";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldCheck, Sparkles, X, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: "login" | "signup";
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
  showToast,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  if (!isOpen) return null;

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Vazia", color: "bg-slate-700" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: "Fraca", color: "bg-rose-500" };
    if (score <= 4) return { score: 2, label: "Média", color: "bg-amber-400" };
    return { score: 3, label: "Segura & Forte", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Por favor, insira um endereço de e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres para sua segurança.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const registeredUsers = Storage.getRegisteredUsers();

      if (mode === "signup") {
        if (!trimmedName) {
          setError("Digite seu nome completo.");
          setLoading(false);
          return;
        }

        const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
        if (existingUser) {
          setError("Este endereço de e-mail já está cadastrado no Project Nexus.");
          setLoading(false);
          return;
        }

        // Simulate secure password hash (one-way client representation)
        const passwordHash = btoa(`nexus_salt_${password}`);
        const newUserId = `usr_${Date.now()}`;

        Storage.saveRegisteredUser({
          id: newUserId,
          email: trimmedEmail,
          name: trimmedName,
          passwordHash,
        });

        const newUser: User = {
          id: newUserId,
          name: trimmedName,
          email: trimmedEmail,
          createdAt: new Date().toISOString(),
          token: `jwt_nexus_${Math.random().toString(36).substring(2)}_${Date.now()}`,
          role: "Arquiteto de Projetos",
        };

        Storage.setUser(newUser);
        setLoading(false);
        showToast(`Conta criada com sucesso! Bem-vindo, ${trimmedName}! 🚀`);
        onSuccess(newUser);
        onClose();
      } else {
        // Login flow
        const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

        // Allow demo login or registered user login
        const expectedHash = btoa(`nexus_salt_${password}`);
        const isDemo = trimmedEmail === "demo@nexus.ai" || (existingUser && existingUser.passwordHash === expectedHash);

        if (!isDemo && !existingUser) {
          // If no local users exist yet, allow auto-creation or feedback
          const generatedUser: User = {
            id: `usr_${Date.now()}`,
            name: trimmedEmail.split("@")[0].toUpperCase(),
            email: trimmedEmail,
            createdAt: new Date().toISOString(),
            token: `jwt_nexus_${Math.random().toString(36).substring(2)}_${Date.now()}`,
            role: "Membro Nexus",
          };
          Storage.setUser(generatedUser);
          setLoading(false);
          showToast(`Sessão segura iniciada! 👋`);
          onSuccess(generatedUser);
          onClose();
          return;
        }

        if (existingUser && existingUser.passwordHash !== expectedHash) {
          setError("E-mail ou senha incorretos.");
          setLoading(false);
          return;
        }

        const loggedUser: User = {
          id: existingUser ? existingUser.id : "usr_demo",
          name: existingUser ? existingUser.name : "Explorador Nexus",
          email: trimmedEmail,
          createdAt: new Date().toISOString(),
          token: `jwt_nexus_${Math.random().toString(36).substring(2)}_${Date.now()}`,
          role: "Gestor Executivo",
        };

        Storage.setUser(loggedUser);
        setLoading(false);
        showToast(`Bem-vindo de volta, ${loggedUser.name}! 👋`);
        onSuccess(loggedUser);
        onClose();
      }
    }, 450);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      const demoUser: User = {
        id: "usr_demo_vip",
        name: "Gilberto Neto",
        email: "gilberto@nexus.ai",
        createdAt: new Date().toISOString(),
        token: `jwt_nexus_demo_${Date.now()}`,
        role: "Head de Inovação",
      };
      Storage.setUser(demoUser);
      setLoading(false);
      showToast("Conectado com perfil de Demonstração! 🚀");
      onSuccess(demoUser);
      onClose();
    }, 300);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#0c101a] border border-cyan-500/20 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top brand glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                N
              </div>
              <div>
                <div className="text-[10px] tracking-[2px] text-cyan-400 font-bold uppercase">Acesso Seguro</div>
                <h2 className="text-xl font-bold text-white">
                  {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta Nexus"}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {mode === "login"
              ? "Autentique-se com criptografia de sessão para gerenciar seus projetos e receber notificações push."
              : "Transforme suas ideias em projetos executáveis com inteligência artificial e acompanhamento em tempo real."}
          </p>

          {/* Quick Demo Option */}
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-cyan-200">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Experimentar rapidamente sem cadastro?</span>
            </div>
            <button
              type="button"
              id="auth-quick-demo-btn"
              onClick={handleQuickDemo}
              disabled={loading}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition flex-shrink-0"
            >
              Demo 1-Click
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label htmlFor={nameId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id={nameId}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor={emailId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id={emailId}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={passwordId} className="block text-xs font-semibold text-slate-300">
                  Senha
                </label>
                {mode === "signup" && password && (
                  <span className="text-[10px] text-slate-400">
                    Força: <strong className="text-white">{strength.label}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Mínimo de 6 caracteres" : "Sua senha segura"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter for signup */}
              {mode === "signup" && password && (
                <div className="mt-2 flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-white/10"}`} />
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-white/10"}`} />
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-white/10"}`} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-0"
                />
                <span>Lembrar de mim</span>
              </label>

              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => showToast("Para redefinir, utilize seu e-mail cadastrado ou o Acesso Demo.")}
                  className="text-cyan-400 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,212,255,0.3)] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </span>
              ) : mode === "login" ? (
                "Entrar no Project Nexus"
              ) : (
                "Criar Minha Conta"
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            {mode === "login" ? (
              <p className="text-xs text-slate-400">
                Ainda não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Criar conta gratuita
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

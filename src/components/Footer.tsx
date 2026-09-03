import React from "react";
import { ActiveTab } from "../types";
import { ShieldCheck, Sparkles, Bell, ArrowUp } from "lucide-react";

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#07090e] pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                N
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                PROJECT NEXUS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plataforma inteligente de planejamento, validação de viabilidade e execução de projetos. Transformando ideias em negócios estruturados com suporte de inteligência artificial.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Autenticação segura e armazenamento de dados criptografado</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Módulos do Sistema</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("ai")}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Nexus AI Copilot
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("projeto")}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Gerador de Projetos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Dashboard & Metas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("mapa")}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Mapa Nexus & Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("simulador")}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Simulador de Cenários
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tecnologias e Push */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Recursos Avançados
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipado com <strong>Service Worker PWA</strong> e motor de notificações push nativas para alertas de prazos críticos e atualizações de tarefas em segundo plano.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono">
                PWA Ready
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                Push Notifications
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-mono">
                Nexus AI Engine
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} Project Nexus. Todos os direitos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

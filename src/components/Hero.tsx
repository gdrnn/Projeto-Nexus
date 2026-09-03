import React from "react";
import { ActiveTab, Project } from "../types";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

interface HeroProps {
  onStartProject: () => void;
  onExploreAI: () => void;
  activeProject: Project | null;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onStartProject,
  onExploreAI,
  activeProject,
  completedTasksCount,
  totalTasksCount,
}) => {
  const taskPercentage =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 75;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,212,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Inteligência Artificial para Projetos</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Transforme qualquer{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                ideia
              </span>{" "}
              em um projeto real.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              O <strong className="text-white font-semibold">Project Nexus</strong> combina inteligência artificial generativa,
              planejamento automatizado e gestão visual em tempo real para transformar visões em negócios executáveis, viáveis e mensuráveis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-start-project-btn"
                onClick={onStartProject}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>🚀 Começar agora</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-ai-btn"
                onClick={onExploreAI}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Conhecer o Nexus AI</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 sm:gap-8 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">+10K</div>
                <div className="text-xs text-slate-400 mt-0.5">Ideias analisadas</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">94%</div>
                <div className="text-xs text-slate-400 mt-0.5">Precisão dos planos</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">Assistência com IA</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Futuristic Interactive Mockup */}
          <div className="lg:col-span-5 relative perspective-1000">
            <div className="relative rounded-2xl bg-[#0d121f] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(0,212,255,0.08)] overflow-hidden transform hover:-translate-y-1 transition duration-500">
              {/* Window Header */}
              <div className="px-4 py-3 bg-[#080a11] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Project Nexus v2.6 • Smart Console
                </span>
                <span className="text-xs text-slate-600 font-mono">LIVE</span>
              </div>

              {/* Inside Mockup Body */}
              <div className="p-5 space-y-4">
                {/* Active Project Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      PROJETO ATIVO
                    </span>
                    <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                      {activeProject ? activeProject.name : "Cafeteria & Hub Conecta"}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Em Execução
                  </span>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Progresso</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {activeProject ? `${activeProject.progress}%` : "68%"}
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                        style={{ width: `${activeProject ? activeProject.progress : 68}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Orçamento</div>
                    <div className="text-lg font-bold text-cyan-300 mt-1">
                      R$ {activeProject ? (activeProject.budget / 1000).toFixed(0) : "65"}k
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 truncate">Estruturado</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Viabilidade</div>
                    <div className="text-lg font-bold text-purple-300 mt-1">
                      {activeProject ? `${activeProject.viability}%` : "88%"}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-2 truncate">Excelente</div>
                  </div>
                </div>

                {/* Mini Visual Chart simulation */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-semibold text-slate-300">Tração & Marcos Concluídos</span>
                    <span className="text-[11px] text-cyan-400 font-mono">Últimos 30 dias</span>
                  </div>
                  <div className="h-20 flex items-end gap-2 pt-2">
                    {[35, 48, 42, 60, 55, 78, 92].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-purple-600 via-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Feature Tag */}
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Nexus AI pronto para analisar novo escopo
                  </span>
                  <span className="text-[11px] font-bold text-white bg-cyan-500/30 px-2 py-0.5 rounded-lg">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

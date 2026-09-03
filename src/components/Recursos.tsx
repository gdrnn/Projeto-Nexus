import React from "react";
import { ActiveTab } from "../types";
import {
  Sparkles,
  Brain,
  Calendar,
  Map,
  ShieldAlert,
  Sliders,
  ArrowRight,
} from "lucide-react";

interface RecursosProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Recursos: React.FC<RecursosProps> = ({ onNavigate }) => {
  const features: {
    id: ActiveTab;
    icon: React.ReactNode;
    title: string;
    description: string;
    cta: string;
    accentColor: string;
  }[] = [
    {
      id: "ai",
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      title: "Nexus AI Copilot",
      description:
        "Converse com a inteligência artificial para avaliar ideias, calcular investimentos simulados e estruturar cronogramas completos.",
      cta: "Conversar com IA",
      accentColor: "group-hover:border-cyan-500/40",
    },
    {
      id: "projeto",
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "Planejamento Inteligente",
      description:
        "Crie novos projetos com estimativa automática de orçamento, definição de categorias estratégicas e cálculo de viabilidade.",
      cta: "Criar novo projeto",
      accentColor: "group-hover:border-purple-500/40",
    },
    {
      id: "dashboard",
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      title: "Gestão de Tarefas & Metas",
      description:
        "Organize prazos, tarefas priorizadas, dependências operacionais e acompanhe o percentual de conclusão em tempo real.",
      cta: "Gerenciar tarefas",
      accentColor: "group-hover:border-blue-500/40",
    },
    {
      id: "mapa",
      icon: <Map className="w-6 h-6 text-emerald-400" />,
      title: "Mapa Nexus & Roadmap",
      description:
        "Visualize a jornada completa do projeto através de nós interativos: da Ideia à Pesquisa, Protótipo, Validação e Lançamento.",
      cta: "Explorar o mapa",
      accentColor: "group-hover:border-emerald-500/40",
    },
    {
      id: "riscos",
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      title: "Central de Riscos",
      description:
        "Monitore riscos financeiros, operacionais, técnicos e de mercado com matriz de probabilidade e recomendações de mitigação.",
      cta: "Ver matriz de riscos",
      accentColor: "group-hover:border-rose-500/40",
    },
    {
      id: "simulador",
      icon: <Sliders className="w-6 h-6 text-amber-400" />,
      title: "Simulador de Cenários",
      description:
        "Ajuste sliders de investimento, tamanho de equipe e prazos em dias para analisar o impacto instantâneo na viabilidade do projeto.",
      cta: "Simular cenários",
      accentColor: "group-hover:border-amber-500/40",
    },
  ];

  return (
    <section id="recursos" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
            POWERED BY PROJECT NEXUS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
            Tudo o que sua ideia precisa{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              em um só lugar.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Planeje, analise, execute e acompanhe projetos de ponta a ponta com ferramentas projetadas para máxima agilidade e foco na execução.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group p-6 sm:p-7 rounded-2xl bg-[#0c101a] border border-white/10 hover:bg-[#101624] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-lg ${item.accentColor}`}
            >
              {/* Subtle hover backlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>{item.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

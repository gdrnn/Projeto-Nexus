import React, { useState } from "react";
import { CheckCircle2, ArrowRight, Sparkles, MapPin } from "lucide-react";

interface RoadmapAndMapProps {
  showToast: (msg: string) => void;
}

export const RoadmapAndMap: React.FC<RoadmapAndMapProps> = ({ showToast }) => {
  const [selectedRoadmapIdx, setSelectedRoadmapIdx] = useState(1);
  const [selectedMapNodeIdx, setSelectedMapNodeIdx] = useState(0);

  const roadmapSteps = [
    {
      step: "01",
      tag: "PESQUISA DE MERCADO",
      title: "Entenda o mercado e valide a demanda",
      description:
        "Mapeamento detalhado de clientes em potencial, análise de forças e fraquezas dos concorrentes e formulação da proposta de valor exclusiva.",
      deliverables: [
        "20 entrevistas em profundidade com clientes",
        "Matriz comparativa de concorrentes diretos",
        "Definição da persona compradora",
      ],
      duration: "15 dias sugeridos",
    },
    {
      step: "02",
      tag: "PLANEJAMENTO ESTRATÉGICO",
      title: "Defina a estratégia e alocação de recursos",
      description:
        "Estruturação de metas trimestrais, orçamento de contingência, seleção da equipe essencial e definição de canais de tração comercial.",
      deliverables: [
        "Planilha de fluxo de caixa e ponto de equilíbrio",
        "Contratos e acordos societários",
        "Roadmap de tecnologia e produto",
      ],
      duration: "20 dias sugeridos",
    },
    {
      step: "03",
      tag: "DESENVOLVIMENTO & EXECUÇÃO",
      title: "Construa a solução e o Menor Produto Viável",
      description:
        "Materialização da ideia através de sprints ágeis. Foco total em entregar o fluxo central que resolve a dor do cliente sem complexidade excessiva.",
      deliverables: [
        "Arquitetura de sistema segura e escalável",
        "Protótipo funcional de alta fidelidade",
        "Integração de pagamentos e fluxos críticos",
      ],
      duration: "35 dias sugeridos",
    },
    {
      step: "04",
      tag: "TESTES & VALIDAÇÃO",
      title: "Valide com usuários reais e filtre atritos",
      description:
        "Lançamento em ambiente controlado para grupo beta fechado. Coleta sistemática de feedbacks, eliminação de gargalos e ajustes de usabilidade.",
      deliverables: [
        "NPS e taxa de retenção da primeira semana",
        "Auditoria de segurança e testes de carga",
        "Correção de bugs críticos",
      ],
      duration: "10 dias sugeridos",
    },
    {
      step: "05",
      tag: "LANÇAMENTO & ESCALA",
      title: "Coloque no mundo e acione o crescimento",
      description:
        "Abertura oficial para o mercado geral, acionamento de campanhas de marketing de performance, assessoria e monitoramento contínuo de métricas.",
      deliverables: [
        "Campanhas ativas nos canais de tração",
        "Suporte ao cliente estruturado",
        "Painel de métricas em tempo real",
      ],
      duration: "10 dias sugeridos",
    },
  ];

  const mapNodes = [
    {
      emoji: "💡",
      label: "IDEIA",
      subtitle: "Origem & Visão",
      title: "💡 Fase 1: Ideação & Conceituação",
      text: "Tudo começa com uma faísca. O Project Nexus transforma intuições vagas em hipóteses de negócio testáveis, quantificando o potencial de mercado.",
    },
    {
      emoji: "🔎",
      label: "PESQUISA",
      subtitle: "Validação Real",
      title: "🔎 Fase 2: Pesquisa & Inteligência Competitiva",
      text: "Investigamos o tamanho do mercado endereçável, comportamentos de compra e diferenciais competitivos para não construir o que ninguém quer.",
    },
    {
      emoji: "🧠",
      label: "PLANEJAMENTO",
      subtitle: "Arquitetura",
      title: "🧠 Fase 3: Planejamento Financeiro & Operacional",
      text: "Equacionamos orçamento, equipe e prazos. Criamos o plano de contingência para garantir que imprevistos não paralisem o avanço.",
    },
    {
      emoji: "🛠️",
      label: "PROTÓTIPO",
      subtitle: "Construção MVP",
      title: "🛠️ Fase 4: Construção do Protótipo Funcional",
      text: "A ideia ganha vida em código ou modelo operacional. Cada funcionalidade é testada quanto à usabilidade e retorno sobre o esforço.",
    },
    {
      emoji: "🧪",
      label: "TESTES",
      subtitle: "Controle de Qualidade",
      title: "🧪 Fase 5: Validação Beta & Refinamento",
      text: "Pioneiros interagem com a solução. Ajustamos gargalos de usabilidade, aperfeiçoamos o atendimento e preparamos a infraestrutura.",
    },
    {
      emoji: "🚀",
      label: "LANÇAMENTO",
      subtitle: "Tração & Escala",
      title: "🚀 Fase 6: Go-to-Market & Expansão",
      text: "O projeto entra em operação real. Monitoramos métricas de engajamento, retenção e satisfação dos clientes de forma ininterrupta.",
    },
  ];

  const handleSelectRoadmap = (idx: number) => {
    setSelectedRoadmapIdx(idx);
    showToast(`Etapa ${roadmapSteps[idx].step}: ${roadmapSteps[idx].tag}`);
  };

  const handleSelectMapNode = (idx: number) => {
    setSelectedMapNodeIdx(idx);
    showToast(`Mapa Nexus: ${mapNodes[idx].label}`);
  };

  return (
    <section id="mapa" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          INTELLIGENT ROADMAP & NEXUS MAP
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Veja seu projeto{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            ganhar forma.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Navegue pelas 5 etapas cronológicas essenciais ou explore a topologia de nós do Nexus para entender o que entregar em cada marco.
        </p>
      </div>

      {/* Part 1: Interactive Nexus Node Map */}
      <div className="rounded-3xl bg-[#090c14] border border-white/10 p-6 sm:p-10 shadow-2xl mb-16 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mapa Topológico Nexus</h3>
              <p className="text-xs text-slate-400">Clique em qualquer nó da cadeia para ver os detalhes operacionais</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 font-mono hidden sm:inline">6 NÓS INTEGRADOS</span>
        </div>

        {/* Nodes Horizontal Flow */}
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-[700px] flex items-center justify-between relative px-6 py-6">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 -translate-y-1/2 z-0 opacity-40" />

            {mapNodes.map((node, i) => {
              const isSelected = selectedMapNodeIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => handleSelectMapNode(i)}
                  className={`relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                    isSelected ? "scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_30px_rgba(0,212,255,0.4)] border border-white/40 ring-4 ring-cyan-500/20"
                        : "bg-[#101422] border border-white/15 text-slate-300 hover:border-cyan-400/50"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{node.emoji}</span>
                    <span className="text-[9px] font-extrabold tracking-wider mt-1">{node.label}</span>
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium tracking-tight whitespace-nowrap ${
                      isSelected ? "text-cyan-300 font-bold" : "text-slate-400"
                    }`}
                  >
                    {node.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Map Node Info */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 to-purple-950/20 border border-cyan-500/20 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold tracking-[2px] text-cyan-400 uppercase">
            ETAPA SELECIONADA NO MAPA
          </span>
          <h4 className="text-lg sm:text-xl font-bold text-white mt-1 mb-2">
            {mapNodes[selectedMapNodeIdx].title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {mapNodes[selectedMapNodeIdx].text}
          </p>
        </div>
      </div>

      {/* Part 2: Vertical Intelligent Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Step Selector */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-extrabold tracking-wider text-slate-400 uppercase mb-4">
            Cronograma em 5 Etapas
          </h3>

          {roadmapSteps.map((step, idx) => {
            const isSelected = selectedRoadmapIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSelectRoadmap(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? "bg-cyan-950/25 border-cyan-500/40 shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                    : "bg-[#0c101a] border-white/10 hover:border-white/20 text-slate-400"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-400 to-purple-600 text-slate-950 shadow-md"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {step.step}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase block">
                    {step.tag}
                  </span>
                  <h4
                    className={`text-sm font-bold truncate mt-0.5 ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {step.title}
                  </h4>
                </div>

                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? "text-cyan-400 translate-x-1" : "text-slate-600"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right Step Details */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c101a] border border-white/10 p-6 sm:p-8 shadow-xl min-h-[380px]">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-extrabold tracking-[2px] text-cyan-400 uppercase">
                DETALHES DA FASE
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {roadmapSteps[selectedRoadmapIdx].title}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold whitespace-nowrap">
              {roadmapSteps[selectedRoadmapIdx].duration}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
            {roadmapSteps[selectedRoadmapIdx].description}
          </p>

          <div className="mt-6 pt-5 border-t border-white/5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Entregáveis Críticos Desta Fase:
            </h4>
            <div className="space-y-2.5">
              {roadmapSteps[selectedRoadmapIdx].deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

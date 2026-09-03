import React, { useState, useId } from "react";
import { Project } from "../types";
import { Sliders, Sparkles, Check, AlertCircle } from "lucide-react";

interface SimulatorProps {
  activeProject: Project | null;
  onUpdateProjectParams?: (budget: number, deadline: number, team: number, viability: number) => void;
  showToast: (msg: string) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  activeProject,
  onUpdateProjectParams,
  showToast,
}) => {
  const [budget, setBudget] = useState(activeProject ? activeProject.budget : 45000);
  const [team, setTeam] = useState(activeProject?.teamSize || 4);
  const [time, setTime] = useState(activeProject ? activeProject.deadline : 90);

  const budgetId = useId();
  const teamId = useId();
  const timeId = useId();

  // Dynamic Viability calculation
  const calculateViability = (b: number, tm: number, t: number) => {
    let score = 50;

    // Budget impact
    if (b >= 80000) score += 20;
    else if (b >= 45000) score += 14;
    else if (b >= 25000) score += 6;
    else score -= 15;

    // Team impact
    if (tm >= 3 && tm <= 7) score += 12;
    else if (tm > 7) score += 4; // Diminishing returns / communication overhead
    else score -= 8;

    // Time impact
    if (t >= 60 && t <= 120) score += 10;
    else if (t < 40) score -= 14;
    else if (t > 180) score -= 6; // Procrastination / market change risk

    return Math.max(15, Math.min(97, score));
  };

  const viability = calculateViability(budget, team, time);

  const getVerdict = (v: number) => {
    if (v >= 85) {
      return {
        label: "Cenário Altamente Favorável",
        desc: "Excelente equilíbrio! O projeto possui margem financeira de contingência, time dimensionado para tração e prazo ágil para chegar antes dos concorrentes.",
        color: "text-emerald-400",
        barColor: "bg-gradient-to-r from-emerald-500 to-teal-400",
        border: "border-emerald-500/30",
      };
    }
    if (v >= 70) {
      return {
        label: "Cenário Equilibrado & Viável",
        desc: "Boas chances reais de execução com margem controlada. Mantenha os custos de equipe alinhados e monitore os marcos semanais com rigor.",
        color: "text-cyan-300",
        barColor: "bg-gradient-to-r from-cyan-400 to-blue-500",
        border: "border-cyan-500/30",
      };
    }
    if (v >= 50) {
      return {
        label: "Cenário Moderado (Requer Atenção)",
        desc: "O projeto pode ser executado, mas há risco considerável de pressão no fluxo de caixa ou sobrecarga no time caso ocorram imprevistos.",
        color: "text-amber-400",
        barColor: "bg-gradient-to-r from-amber-400 to-yellow-500",
        border: "border-amber-500/30",
      };
    }
    return {
      label: "Cenário de Alto Risco",
      desc: "Prazo muito apertado ou capital insuficiente para a complexidade pretendida. Recomenda-se aumentar o orçamento ou simplificar drasticamente o escopo.",
      color: "text-rose-400",
      barColor: "bg-gradient-to-r from-rose-500 to-red-600",
      border: "border-rose-500/30",
    };
  };

  const verdict = getVerdict(viability);

  const handleApplyToProject = () => {
    if (onUpdateProjectParams) {
      onUpdateProjectParams(budget, time, team, viability);
    }
    showToast(`Cenário aplicado ao projeto com viabilidade calculada em ${viability}%! 🎯`);
  };

  const setPreset = (b: number, tm: number, t: number, name: string) => {
    setBudget(b);
    setTeam(tm);
    setTime(t);
    showToast(`Preset carregado: ${name}`);
  };

  return (
    <section id="simulador" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          SCENARIO SIMULATOR
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          E se você{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            mudasse o plano?
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Simule hipóteses de investimento, dimensionamento de talentos e prazos de entrega para prever riscos e maximizar a viabilidade.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-3xl bg-[#0c101a] border border-white/10 p-6 sm:p-10 shadow-2xl">
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-white/10">
          <span className="text-xs font-bold text-slate-400 mr-1">Cenários Rápidos:</span>
          <button
            onClick={() => setPreset(20000, 2, 45, "MVP Enxuto")}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
          >
            🚀 MVP Enxuto (R$ 20k / 45d)
          </button>
          <button
            onClick={() => setPreset(65000, 5, 90, "Equilíbrio Ágil")}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 transition"
          >
            ⚖️ Equilíbrio Ágil (R$ 65k / 90d)
          </button>
          <button
            onClick={() => setPreset(150000, 8, 120, "Escala Acelerada")}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-purple-300 transition"
          >
            🔥 Tração Forte (R$ 150k / 120d)
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-8">
          {/* Orçamento Slider */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <label htmlFor={budgetId} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <span>💰 Orçamento Total Alocado</span>
              </label>
              <strong className="text-white text-base font-black">
                R$ {budget.toLocaleString("pt-BR")}
              </strong>
            </div>
            <input
              id={budgetId}
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>R$ 10.000 (Mínimo)</span>
              <span>R$ 250.000 (Expansão)</span>
            </div>
          </div>

          {/* Equipe Slider */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <label htmlFor={teamId} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <span>👥 Tamanho da Equipe</span>
              </label>
              <strong className="text-white text-base font-black">
                {team} {team === 1 ? "colaborador" : "colaboradores"}
              </strong>
            </div>
            <input
              id={teamId}
              type="range"
              min="1"
              max="15"
              step="1"
              value={team}
              onChange={(e) => setTeam(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 pessoa (Solo)</span>
              <span>15 pessoas (Multidisciplinar)</span>
            </div>
          </div>

          {/* Prazo Slider */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <label htmlFor={timeId} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <span>⏱️ Prazo Estimado de Lançamento</span>
              </label>
              <strong className="text-white text-base font-black">{time} dias</strong>
            </div>
            <input
              id={timeId}
              type="range"
              min="20"
              max="240"
              step="5"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>20 dias (Sprint Rush)</span>
              <span>240 dias (Estruturação Completa)</span>
            </div>
          </div>
        </div>

        {/* Viability Result Box */}
        <div
          className={`mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border text-center transition-all ${verdict.border}`}
        >
          <span className="text-[10px] font-extrabold tracking-[2px] text-cyan-400 uppercase">
            ÍNDICE DE VIABILIDADE DO PROJETO
          </span>

          <div className="text-5xl sm:text-6xl font-black text-white my-3 tracking-tight">
            {viability}%
          </div>

          <div className="w-full max-w-md mx-auto bg-white/10 h-2.5 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-300 ${verdict.barColor}`}
              style={{ width: `${viability}%` }}
            />
          </div>

          <h4 className={`text-base font-bold ${verdict.color}`}>{verdict.label}</h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
            {verdict.desc}
          </p>

          <button
            onClick={handleApplyToProject}
            className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition inline-flex items-center gap-2 border border-white/10 cursor-pointer"
          >
            <Check className="w-4 h-4 text-cyan-400" />
            Aplicar este Cenário no Projeto Ativo
          </button>
        </div>
      </div>
    </section>
  );
};

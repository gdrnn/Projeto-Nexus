import React from "react";
import { RiskItem, ActiveTab } from "../types";
import { ShieldAlert, AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

interface RiskCenterProps {
  onAskAIAboutRisk: (topic: string) => void;
}

export const RiskCenter: React.FC<RiskCenterProps> = ({ onAskAIAboutRisk }) => {
  const risks: RiskItem[] = [
    {
      id: "risk-1",
      category: "financeiro",
      title: "Risco Financeiro & Liquidez",
      severity: "alto",
      probability: 78,
      description:
        "Esgotamento do capital de giro antes de alcançar o ponto de equilíbrio (Break-even). Custos ocultos com marketing e reformas.",
      mitigation:
        "Alocar reserva de contingência intocável de 15% a 20% do orçamento total. Estabelecer métricas semanais rígidas de queima de caixa (Burn Rate).",
    },
    {
      id: "risk-2",
      category: "operacional",
      title: "Risco Operacional & Prazos",
      severity: "medio",
      probability: 52,
      description:
        "Dependência de fornecedores externos ou gargalos em contratações técnicas que podem postergar a data do lançamento.",
      mitigation:
        "Homologar pelo menos dois fornecedores alternativos para cada item crítico e trabalhar com buffers de 7 dias entre cada sprint.",
    },
    {
      id: "risk-3",
      category: "mercado",
      title: "Risco de Mercado & Aderência",
      severity: "medio",
      probability: 45,
      description:
        "Clientes potenciais elogiam a ideia nas conversas, mas hesitam em pagar o valor estipulado no lançamento oficial.",
      mitigation:
        "Conduzir pré-vendas com desconto exclusivo de fundadores (early-bird) ou cartas de intenção antes do investimento maciço.",
    },
    {
      id: "risk-4",
      category: "tecnico",
      title: "Risco Técnico & Arquitetura",
      severity: "baixo",
      probability: 24,
      description:
        "Falhas de escalabilidade, bugs críticos no fluxo de checkout ou problemas de compatibilidade entre plataformas.",
      mitigation:
        "Construir arquitetura moderna com testes automatizados, rotinas de backup e ambiente de homologação idêntico à produção.",
    },
  ];

  return (
    <section id="riscos" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          RISK MANAGEMENT CENTER
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Antecipe os problemas{" "}
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
            antes que aconteçam.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          O Project Nexus mapeia e quantifica vetores de vulnerabilidade que afetam o sucesso de novos empreendimentos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((risk) => {
          const isHigh = risk.severity === "alto";
          const isMedium = risk.severity === "medio";

          return (
            <div
              key={risk.id}
              className={`p-6 sm:p-7 rounded-2xl bg-[#0c101a] border transition-all flex flex-col justify-between ${
                isHigh
                  ? "border-rose-500/30 hover:border-rose-500/50"
                  : isMedium
                  ? "border-amber-500/30 hover:border-amber-500/50"
                  : "border-emerald-500/30 hover:border-emerald-500/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                      isHigh
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        : isMedium
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    RISCO {risk.severity.toUpperCase()}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-400">
                    Probabilidade: <strong className="text-white">{risk.probability}%</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{risk.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {risk.description}
                </p>

                {/* Probability Bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-5">
                  <div
                    className={`h-full rounded-full ${
                      isHigh ? "bg-rose-500" : isMedium ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${risk.probability}%` }}
                  />
                </div>

                {/* Mitigation Recommendation */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    🛡️ ESTRATÉGIA DE MITIGAÇÃO
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{risk.mitigation}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => onAskAIAboutRisk(risk.title)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consultar Nexus AI sobre este risco</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

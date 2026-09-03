import React, { useState } from "react";
import { Project, User } from "../types";
import {
  FolderPlus,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  Check,
  TrendingUp,
  Clock,
  DollarSign,
  Layers,
  ArrowRight,
} from "lucide-react";

interface ProjectCreatorProps {
  currentUser: User | null;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  showToast: (msg: string) => void;
  onOpenAuth: () => void;
}

export const ProjectCreator: React.FC<ProjectCreatorProps> = ({
  currentUser,
  projects,
  activeProjectId,
  onSelectProject,
  onSaveProject,
  onDeleteProject,
  showToast,
  onOpenAuth,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Startup");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | string>(35000);
  const [deadline, setDeadline] = useState<number | string>(90);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    analysis: string;
    viabilityScore: number;
    budgetNum: number;
    deadlineNum: number;
  } | null>(null);

  const categories = [
    "Startup & SaaS",
    "Tecnologia & App",
    "E-commerce & Varejo",
    "Alimentos & Bebidas",
    "Educação (EdTech)",
    "Saúde & Bem-Estar",
    "Agronegócio",
    "Serviços Profissionais",
    "Outro",
  ];

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Por favor, digite o nome do projeto.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/analyze-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          budget: Number(budget) || 30000,
          deadline: Number(deadline) || 90,
        }),
      });

      const data = await response.json();

      setAiResult({
        analysis: data.analysis,
        viabilityScore: data.viabilityScore || 78,
        budgetNum: Number(budget) || 30000,
        deadlineNum: Number(deadline) || 90,
      });

      showToast("Estrutura gerada com sucesso pelo Nexus AI! ✨");
    } catch (err) {
      console.error("Erro ao analisar:", err);
      showToast("Não foi possível conectar ao servidor de IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToProjects = () => {
    if (!name.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || "Projeto estruturado com o auxílio do Nexus AI.",
      budget: Number(budget) || 30000,
      deadline: Number(deadline) || 90,
      progress: 0,
      viability: aiResult ? aiResult.viabilityScore : 78,
      teamSize: 3,
      riskLevel: "Moderado",
      status: "Planejamento",
      createdAt: new Date().toISOString(),
      aiAnalysis: aiResult ? aiResult.analysis : undefined,
    };

    onSaveProject(newProj);
    showToast(`Projeto "${newProj.name}" salvo no Nexus com sucesso! 🚀`);
    // Clear form
    setName("");
    setDescription("");
    setAiResult(null);
  };

  return (
    <section id="projeto" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          PROJECT CREATOR & STUDIO
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Crie e estruture seu próximo{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            grande projeto.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Defina parâmetros essenciais da sua ideia. O motor de inteligência do Nexus gera cronogramas, dimensionamento de equipe e métricas de viabilidade instantaneamente.
        </p>
      </div>

      {/* Creation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0c101a] border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parâmetros da Ideia</h3>
              <p className="text-xs text-slate-400">Preencha os dados fundamentais para a análise</p>
            </div>
          </div>

          <form onSubmit={handleGenerateAI} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Projeto <span className="text-rose-400">*</span>
              </label>
              <input
                id="project-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Minha Cafeteria Especial / App EduConnect"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Categoria do Negócio
              </label>
              <select
                id="project-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111522] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Descrição da Ideia & Proposta de Valor
              </label>
              <textarea
                id="project-desc-input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explique o que você quer construir, quem é o cliente e qual problema será resolvido..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Orçamento Estimado (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                  <input
                    id="project-budget-input"
                    type="number"
                    min="1000"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Prazo Desejado (Dias)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    id="project-deadline-input"
                    type="number"
                    min="15"
                    max="720"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>

            <button
              id="generate-project-ai-btn"
              type="submit"
              disabled={isGenerating || !name.trim()}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,212,255,0.3)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analisando Viabilidade com Nexus AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  Gerar Estrutura com IA
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0c101a] border border-white/10 p-6 sm:p-8 shadow-xl min-h-[460px] flex flex-col justify-between">
          {aiResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-extrabold tracking-[2px] text-cyan-400 uppercase">
                    DIAGNÓSTICO ESTRUTURADO
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                  {category}
                </span>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Orçamento</span>
                  <div className="text-base font-bold text-white mt-1">
                    R$ {aiResult.budgetNum.toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Prazo</span>
                  <div className="text-base font-bold text-cyan-300 mt-1">{aiResult.deadlineNum} dias</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Viabilidade</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">{aiResult.viabilityScore}%</div>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-h-56 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
                {aiResult.analysis}
              </div>

              {/* Save Project Button */}
              <button
                id="save-generated-project-btn"
                onClick={handleSaveToProjects}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-[0_0_20px_rgba(56,232,155,0.25)] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Projeto no Nexus
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Seu plano aparecerá aqui</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                Preencha o nome e o escopo da sua ideia ao lado e clique em <strong>"Gerar Estrutura com IA"</strong> para calcular a viabilidade e o cronograma.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Existing Saved Projects List */}
      <div className="mt-16 pt-12 border-t border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Projetos em Andamento ({projects.length})</h3>
            <p className="text-xs text-slate-400">Clique para selecionar o projeto ativo em todo o Nexus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  isActive
                    ? "bg-cyan-950/25 border-cyan-500/40 shadow-[0_0_25px_rgba(0,212,255,0.15)]"
                    : "bg-[#0c101a] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5 truncate max-w-[220px]">
                      {proj.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ativo
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remover projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Orçamento:</span>
                    <strong className="text-white ml-1">R$ {proj.budget.toLocaleString("pt-BR")}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Viabilidade:</span>
                    <strong className="text-emerald-400 ml-1">{proj.viability}%</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

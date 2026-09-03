import React, { useState } from "react";
import { Task, Project } from "../types";
import { playNotificationSound } from "../lib/notifications";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  DollarSign,
  ListTodo,
  Zap,
  Filter,
} from "lucide-react";

interface DashboardProps {
  activeProject: Project | null;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, priority: "baixa" | "media" | "alta", category?: string) => void;
  onDeleteTask: (taskId: string) => void;
  showToast: (msg: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeProject,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  showToast,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baixa" | "media" | "alta">("alta");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Efficiency calculation based on completion ratio and active project viability
  const efficiency =
    totalCount > 0
      ? Math.min(98, Math.max(50, Math.round(progressPercent * 0.4 + (activeProject?.viability || 80) * 0.6)))
      : 85;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask(newTaskTitle.trim(), newTaskPriority);
    setNewTaskTitle("");
    setShowAddForm(false);
    showToast("Nova tarefa adicionada ao painel! 📋");
    playNotificationSound();
  };

  const handleToggle = (taskId: string, isNowComplete: boolean) => {
    onToggleTask(taskId);
    if (!isNowComplete) {
      showToast("Tarefa concluída com sucesso! ⚡");
      playNotificationSound();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <section id="dashboard" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          SMART DASHBOARD & GESTÃO
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Controle seu projeto em{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            tempo real.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Acompanhe indicadores vitais, tarefas prioritárias e métricas de eficiência operacional do projeto ativo.
        </p>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Progresso Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">PROGRESSO GERAL</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{progressPercent}%</div>

          <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">↑ 12% avanço esta semana</p>
        </div>

        {/* Investimento Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">INVESTIMENTO</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight">
            R$ {activeProject ? (activeProject.budget / 1000).toFixed(0) : "38"}K
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {activeProject ? activeProject.name : "Orçamento Planejado"}
          </p>
        </div>

        {/* Tarefas Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">TAREFAS</span>
            <ListTodo className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {completedCount}/{totalCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {progressPercent}% concluídas com sucesso
          </p>
        </div>

        {/* Eficiência Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">EFICIÊNCIA</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 tracking-tight">{efficiency}%</div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {efficiency >= 80 ? "Classificação Excelente" : "Classificação Operacional Normal"}
          </p>
        </div>
      </div>

      {/* Task Management Panel */}
      <div className="rounded-2xl bg-[#0c101a] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-extrabold tracking-[2px] text-cyan-400 uppercase">
              PLANO DE AÇÃO
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">Minhas Tarefas do Projeto</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Todas ({tasks.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === "pending" ? "bg-white/10 text-cyan-300" : "text-slate-400 hover:text-white"
                }`}
              >
                Pendentes ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === "completed" ? "bg-white/10 text-emerald-300" : "text-slate-400 hover:text-white"
                }`}
              >
                Concluídas ({completedCount})
              </button>
            </div>

            <button
              id="add-task-toggle-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.25)] flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Inline Add Task Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateTask}
            className="my-5 p-4 rounded-xl bg-white/[0.02] border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-200"
          >
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ex: Entrevistar 10 potenciais clientes para validação do preço..."
              className="flex-1 w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="w-full sm:w-36 px-3 py-2 rounded-xl bg-[#111522] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="alta">Alta Prioridade</option>
              <option value="media">Média Prioridade</option>
              <option value="baixa">Baixa Prioridade</option>
            </select>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="divide-y divide-white/5 mt-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhuma tarefa encontrada neste filtro.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-white/[0.01] px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
                      task.completed
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "border-slate-600 hover:border-cyan-400 text-transparent hover:text-cyan-400/50"
                    }`}
                    aria-label={task.completed ? "Desmarcar tarefa" : "Concluir tarefa"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <span
                    className={`text-xs sm:text-sm font-medium transition break-words ${
                      task.completed ? "line-through text-slate-500" : "text-slate-200"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === "alta"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/20"
                        : task.priority === "media"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                        : "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                    }`}
                  >
                    {task.priority === "alta"
                      ? "Alta"
                      : task.priority === "media"
                      ? "Média"
                      : "Baixa"}
                  </span>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {task.completed ? "Concluída" : "Em andamento"}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-40 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

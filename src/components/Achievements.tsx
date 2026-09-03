import React from "react";
import { Achievement } from "../types";
import { playNotificationSound } from "../lib/notifications";
import { Award, Trophy, Lock, CheckCircle2, Star, Sparkles } from "lucide-react";

interface AchievementsProps {
  achievements: Achievement[];
  completedTasksCount: number;
  isPushActive: boolean;
  showToast: (msg: string) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  completedTasksCount,
  isPushActive,
  showToast,
}) => {
  // Update dynamic unlocked state
  const resolvedAchievements = achievements.map((ach) => {
    if (ach.id === "ach-3") {
      return { ...ach, unlocked: completedTasksCount >= 5 };
    }
    if (ach.id === "ach-5") {
      return { ...ach, unlocked: isPushActive };
    }
    return ach;
  });

  const unlockedCount = resolvedAchievements.filter((a) => a.unlocked).length;
  const totalXp = resolvedAchievements
    .filter((a) => a.unlocked)
    .reduce((acc, curr) => acc + (curr.unlocked ? 150 : 0), 200);

  const level = Math.floor(totalXp / 300) + 1;
  const nextLevelXp = level * 300;
  const currentLevelProgress = Math.round(((totalXp % 300) / 300) * 100);

  const handleClickBadge = (ach: Achievement) => {
    if (ach.unlocked) {
      showToast(`🏆 Conquista Desbloqueada: ${ach.title}!`);
      playNotificationSound();
    } else {
      showToast(`🔒 Bloqueada: ${ach.description}`);
    }
  };

  return (
    <section id="conquistas" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-extrabold tracking-[3px] text-cyan-400 uppercase">
          GAMIFICATION & PROGRESSION
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Suas conquistas no{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Project Nexus.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Cada projeto cadastrado, tarefa finalizada e notificação configurada rende pontos de experiência e desbloqueia insígnias exclusivas.
        </p>
      </div>

      {/* Gamification Level Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0c101a] to-cyan-950/40 border border-white/10 p-6 sm:p-8 shadow-2xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                NÍVEL {level}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
                Arquiteto de Projetos
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {unlockedCount} de {resolvedAchievements.length} Conquistas Concluídas
            </h3>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full sm:w-72">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-semibold">
            <span>Experiência Total</span>
            <span className="text-cyan-300">{totalXp} XP</span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-right mt-1">
            Próximo nível em {300 - (totalXp % 300)} XP
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resolvedAchievements.map((ach) => (
          <div
            key={ach.id}
            onClick={() => handleClickBadge(ach)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
              ach.unlocked
                ? "bg-[#0c101a] border-purple-500/30 hover:border-purple-400/60 shadow-lg"
                : "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-80"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                ach.unlocked
                  ? "bg-purple-500/20 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  : "bg-white/5 border border-white/10 text-slate-600 grayscale"
              }`}
            >
              {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`text-sm font-bold truncate ${
                    ach.unlocked ? "text-white" : "text-slate-400"
                  }`}
                >
                  {ach.title}
                </h4>
                {ach.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">Bloqueado</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

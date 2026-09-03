import React, { useState } from "react";
import { NexusNotification, ActiveTab } from "../types";
import { PushNotificationService } from "../lib/notifications";
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  X,
  Sparkles,
  AlertTriangle,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NexusNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (notif: NexusNotification) => void;
  onTriggerTestPush: (title: string, body: string, actionTab?: ActiveTab) => void;
  showToast: (msg: string) => void;
  onPushPermissionChanged: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectNotification,
  onTriggerTestPush,
  showToast,
  onPushPermissionChanged,
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const currentPermission = PushNotificationService.getPermission();
  const isPushGranted = currentPermission === "granted";
  const isPushDenied = currentPermission === "denied";

  const handleEnablePush = async () => {
    setIsRequesting(true);
    const granted = await PushNotificationService.requestPermission();
    setIsRequesting(false);
    onPushPermissionChanged();

    if (granted) {
      showToast("Notificações Push ativadas com sucesso! 🔔");
      await PushNotificationService.sendPushNotification("Project Nexus Ativo!", {
        body: "Notificações push em tempo real configuradas com sucesso no seu dispositivo.",
      });
    } else {
      showToast("Permissão de notificações não concedida no navegador.");
    }
  };

  const filteredNotifications = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  const getIconForType = (type: NexusNotification["type"]) => {
    switch (type) {
      case "ai":
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case "deadline":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "achievement":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "project":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      id="notification-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="notification-drawer"
        className="w-full sm:max-w-md h-full sm:h-[92vh] sm:rounded-2xl bg-[#0b0e17] border-l sm:border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#07090e]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Central de Notificações</h2>
              <p className="text-[11px] text-slate-400">Push em tempo real e avisos de projeto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Fechar gaveta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Permission Box */}
        <div className="p-4 bg-gradient-to-b from-cyan-950/20 to-transparent border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Status de Notificações Push</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isPushGranted
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : isPushDenied
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPushGranted ? "bg-emerald-400" : isPushDenied ? "bg-rose-400" : "bg-amber-400"
                }`}
              />
              {isPushGranted ? "Ativo no Dispositivo" : isPushDenied ? "Bloqueado pelo Navegador" : "Pendente"}
            </span>
          </div>

          {!isPushGranted && (
            <button
              onClick={handleEnablePush}
              disabled={isRequesting}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.25)]"
            >
              <Bell className="w-3.5 h-3.5" />
              {isRequesting ? "Solicitando..." : "Ativar Notificações Push no Navegador"}
            </button>
          )}

          {/* Test Push Triggers */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[11px] text-slate-400 mb-2">Simular alertas do Nexus (dispara Push nativo + áudio):</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() =>
                  onTriggerTestPush(
                    "📅 Alerta de Prazo Nexus",
                    "A fase de Pesquisa encerra em 48h. Verifique os marcos pendentes.",
                    "mapa"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-200 text-left truncate"
              >
                ⏰ Prazo em 48h
              </button>
              <button
                onClick={() =>
                  onTriggerTestPush(
                    "🤖 Insight do Nexus AI",
                    "Oportunidade detectada: redução de 12% no custo de infraestrutura.",
                    "ai"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-cyan-300 text-left truncate"
              >
                💡 Insight de IA
              </button>
              <button
                onClick={() =>
                  onTriggerTestPush(
                    "⚠️ Alerta de Risco Operacional",
                    "O simulador identificou equipe sobrecarregada para o prazo atual.",
                    "simulador"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-amber-300 text-left truncate"
              >
                ⚠️ Risco Detectado
              </button>
              <button
                onClick={() =>
                  onTriggerTestPush(
                    "🏆 Nova Conquista Desbloqueada!",
                    "Você avançou para o próximo nível de eficiência de projeto.",
                    "conquistas"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-purple-300 text-left truncate"
              >
                🏆 Conquista Nova
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar & Actions */}
        <div className="px-4 py-3 bg-[#07090e]/50 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                filter === "unread" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              Não lidas ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition"
              title="Marcar todas como lidas"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition"
              title="Limpar histórico"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Bell className="w-8 h-8 stroke-1 mb-2 opacity-40" />
              <p className="text-xs font-semibold text-slate-400">Nenhuma notificação encontrada</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Dispare um teste acima para verificar a entrega de alertas em tempo real.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-xl border transition cursor-pointer relative group ${
                  notif.read
                    ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    : "bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.06)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold truncate ${
                          notif.read ? "text-slate-300" : "text-white"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{notif.body}</p>
                    {notif.actionTab && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-cyan-400 group-hover:underline">
                        <span>Acessar seção correspondente</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>

                {!notif.read && (
                  <span className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-[#0b0e17]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

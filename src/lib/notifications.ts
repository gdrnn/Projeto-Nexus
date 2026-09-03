import { Storage } from "./storage";

// Play a subtle high-tech chime using Web Audio API
export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

export const PushNotificationService = {
  isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      Storage.setPushEnabled(granted);
      return granted;
    } catch (err) {
      console.error("Erro ao solicitar permissão de notificações:", err);
      return false;
    }
  },

  async sendPushNotification(title: string, options?: { body?: string; icon?: string; tag?: string; url?: string }): Promise<boolean> {
    playNotificationSound();

    if (!this.isSupported() || Notification.permission !== "granted") {
      return false;
    }

    const notifOptions = {
      body: options?.body || "Atualização importante no Project Nexus.",
      icon: options?.icon || "/icon.svg",
      badge: "/icon.svg",
      tag: options?.tag || "nexus-update",
      vibrate: [100, 50, 100],
      data: {
        url: options?.url || "/",
      },
    };

    // Try service worker first (proper push notification)
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, notifOptions);
          return true;
        }
      } catch (err) {
        console.warn("ServiceWorker push notification failed, using window fallback:", err);
      }
    }

    // Fallback to Window Notification API
    try {
      new Notification(title, notifOptions);
      return true;
    } catch (err) {
      console.warn("Window Notification fallback failed:", err);
      return false;
    }
  },

  async registerServiceWorker(): Promise<boolean> {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("[Project Nexus] Service Worker registrado:", reg.scope);
        return true;
      } catch (err) {
        console.warn("[Project Nexus] Falha ao registrar Service Worker:", err);
        return false;
      }
    }
    return false;
  },
};

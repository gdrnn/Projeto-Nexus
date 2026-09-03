import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, User } from "../types";
import { Storage } from "../lib/storage";
import { playNotificationSound } from "../lib/notifications";
import {
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  Bot,
  User as UserIcon,
} from "lucide-react";

interface NexusAIChatProps {
  currentUser: User | null;
  showToast: (msg: string) => void;
}

const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Olá! 👋 Eu sou o **Nexus AI**, seu arquiteto e consultor executivo de projetos. Me conte sobre qualquer ideia que você tenha em mente e eu vou te ajudar a transformá-la em um plano real, viável e estruturado.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg-2",
    sender: "ai",
    text: "Você pode começar clicando em uma das sugestões abaixo ou descrevendo sua ideia livremente, como por exemplo: **'Quero abrir uma cafeteria de cafés especiais'** ou **'Quero criar um aplicativo de telemedicina'**.",
    timestamp: new Date().toISOString(),
  },
];

export const NexusAIChat: React.FC<NexusAIChatProps> = ({ currentUser, showToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = Storage.getChatHistory();
    return saved.length > 0 ? saved : DEFAULT_INITIAL_MESSAGES;
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    Storage.saveChatHistory(messages);
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Ideia processada. Como deseja estruturar os próximos passos?";

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toISOString(),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMessage]);
      playNotificationSound();
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Compreendi sua proposta: "${messageText}". Recomendo estruturarmos este escopo dividindo em 3 fases: Validação inicial, MVP e Tração comercial. Você pode registrar este projeto na aba 'Projetos' para calcularmos o orçamento exato!`,
        timestamp: new Date().toISOString(),
        source: "local",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Texto copiado para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages(DEFAULT_INITIAL_MESSAGES);
    Storage.saveChatHistory(DEFAULT_INITIAL_MESSAGES);
    showToast("Conversa reiniciada com o Nexus AI.");
  };

  const quickPrompts = [
    { label: "☕ Cafeteria", text: "Quero abrir uma cafeteria de cafés especiais" },
    { label: "📱 Aplicativo SaaS", text: "Quero criar um aplicativo mobile por assinatura (SaaS)" },
    { label: "🛍️ Loja Virtual", text: "Quero montar um e-commerce de moda sustentável" },
    { label: "⚠️ Análise de Riscos", text: "Quais são os principais riscos de iniciar um negócio hoje?" },
    { label: "💰 Orçamento", text: "Como devo dividir meu orçamento de investimento inicial?" },
    { label: "📅 Cronograma 90 Dias", text: "Monte um cronograma executivo de 90 dias do zero ao lançamento" },
  ];

  return (
    <section id="ai" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Overview & Capabilities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEXUS AI 3.8 ONLINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Sua ideia.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Nossa inteligência.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Converse diretamente com o motor de inteligência artificial do Nexus para dissecar oportunidades de mercado, mapear riscos ocultos, estimar investimentos e gerar planos de execução prontos para ação.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Analisa viabilidade</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Estima investimentos</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Calcula cronogramas</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Mapeia matriz de riscos</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Dica de Navegação Fluida</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Você pode copiar respostas do Nexus AI e aplicá-las diretamente na aba <strong>Projetos</strong> para gerar o registro formal do seu empreendimento.
            </p>
          </div>
        </div>

        {/* Right column: The Chat Console */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#090c14] border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden relative">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#07090e] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                  N
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Nexus AI</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ativo
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Copiloto Estratégico de Projetos
                  </span>
                </div>
              </div>

              <button
                onClick={handleClearChat}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold"
                title="Reiniciar conversa"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isUser
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black"
                      }`}
                    >
                      {isUser ? (
                        currentUser ? (
                          currentUser.name.charAt(0).toUpperCase()
                        ) : (
                          <UserIcon className="w-4 h-4" />
                        )
                      ) : (
                        "N"
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`relative group max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/25 text-white"
                          : "bg-white/[0.04] border border-white/10 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className={`text-[10px] font-bold ${isUser ? "text-cyan-300" : "text-cyan-400"}`}>
                          {isUser ? (currentUser ? currentUser.name : "Você") : "Nexus AI"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Content with basic line break and bold support */}
                      <div className="space-y-2 whitespace-pre-line break-words">
                        {msg.text.split("\n").map((line, idx) => {
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>

                      {/* Copy Button */}
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="mt-2 text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition opacity-70 group-hover:opacity-100"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copiar resposta
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs flex-shrink-0">
                    N
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 flex items-center gap-2">
                    <span className="text-xs">Nexus AI está estruturando a análise...</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompts */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#07090e]/50 flex gap-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 border border-white/10 text-slate-300 hover:text-white text-xs whitespace-nowrap transition cursor-pointer flex-shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-[#07090e] border-t border-white/10 flex items-center gap-2"
            >
              <input
                id="nexus-ai-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Como validar uma ideia de marketplace antes de gastar com software?"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition disabled:opacity-50"
              />

              <button
                id="nexus-ai-send-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:brightness-110 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,255,0.3)] flex-shrink-0"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

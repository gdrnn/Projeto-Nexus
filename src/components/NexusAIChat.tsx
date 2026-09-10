import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ChatMode, User } from "../types";
import { Storage } from "../lib/storage";
import { playNotificationSound } from "../lib/notifications";
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  Bot,
  User as UserIcon,
  Download,
  ArrowRight,
  ShieldAlert,
  Coins,
  Cpu,
  TrendingUp,
  Boxes,
  Sparkles,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface NexusAIChatProps {
  currentUser: User | null;
  showToast: (msg: string) => void;
  onSendToProjectCreator?: (prefill: {
    name?: string;
    category?: string;
    description?: string;
    budget?: number;
    deadline?: number;
  }) => void;
}

const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Olá! 👋 Eu sou o **Nexus AI**, seu arquiteto e consultor executivo de projetos, conectado diretamente ao motor neural **Google Gemini**.\n\nMe conte sobre qualquer ideia, dúvida de mercado, desafio técnico ou negócio que você queira estruturar. Podemos conversar livremente sobre qualquer assunto!",
    timestamp: new Date().toISOString(),
    source: "gemini",
    model: "gemini-3.1-flash-lite",
  },
  {
    id: "msg-2",
    sender: "ai",
    text: "Você pode me fazer perguntas abertas como:\n* *'Quero criar um marketplace de serviços locais, por onde começo?'*\n* *'Como calcular o CAC e o LTV para uma assinatura de R$ 49/mês?'*\n* *'Quais os principais riscos regulatórios de uma fintech de pagamentos?'*\n\nSelecione uma persona acima (Finanças, MVP, Engenharia, Riscos ou Growth) ou comece digitando abaixo.",
    timestamp: new Date().toISOString(),
    source: "gemini",
    model: "gemini-3.1-flash-lite",
  },
];

const MODES: Array<{
  id: ChatMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  badge: string;
}> = [
  {
    id: "general",
    label: "Visão Geral",
    icon: Sparkles,
    desc: "Ideação livre e arquitetura executiva",
    badge: "360°",
  },
  {
    id: "architect",
    label: "Arquiteto MVP",
    icon: Boxes,
    desc: "Validação de hipóteses, UVP e escopo",
    badge: "MVP",
  },
  {
    id: "finance",
    label: "Finanças & Custos",
    icon: Coins,
    desc: "Orçamento em R$, unit economics e ROI",
    badge: "R$",
  },
  {
    id: "tech",
    label: "Engenharia & Tech",
    icon: Cpu,
    desc: "Stack tecnológica, arquitetura e sprints",
    badge: "Tech",
  },
  {
    id: "risks",
    label: "Auditor de Riscos",
    icon: ShieldAlert,
    desc: "Matriz de vulnerabilidade e contingência",
    badge: "Riscos",
  },
  {
    id: "growth",
    label: "Growth & Tração",
    icon: TrendingUp,
    desc: "Aquisição de clientes, SEO e go-to-market",
    badge: "Go-to-Market",
  },
];

// Helper to extract follow-up options if present in the text
function parseMessageFollowUps(text: string): {
  bodyText: string;
  suggestedQuestions: string[];
} {
  const marker = "💡 **Para onde deseja avançar?**";
  const markerIdx = text.indexOf(marker);

  if (markerIdx === -1) {
    return { bodyText: text, suggestedQuestions: [] };
  }

  const bodyText = text.substring(0, markerIdx).trim();
  const trailingPart = text.substring(markerIdx + marker.length);

  const questions: string[] = [];
  const lines = trailingPart.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("•")) {
      const clean = trimmed.replace(/^[\*\-•]\s*/, "");
      // Look for quoted text
      const quoteMatch = clean.match(/["“](.+?)["”]/);
      if (quoteMatch) {
        questions.push(quoteMatch[1]);
      } else if (clean.length > 5 && clean.length < 120) {
        // Remove markdown bold prefixes like **Tópico:**
        const stripped = clean.replace(/\*\*.+?\*\*:\s*/, "").replace(/\*\*/g, "");
        questions.push(stripped);
      }
    }
  }

  return {
    bodyText,
    suggestedQuestions: questions.slice(0, 3),
  };
}

// Helper to extract draft project data from an AI message
function extractProjectDraft(
  text: string,
  userMessage?: string
): {
  name: string;
  category: string;
  description: string;
  budget: number;
  deadline: number;
} {
  // Try finding budget
  const budgetMatch = text.match(/R\$\s*([\d\.]+)/i);
  let budget = 40000;
  if (budgetMatch) {
    const parsed = parseInt(budgetMatch[1].replace(/\./g, ""), 10);
    if (!isNaN(parsed) && parsed > 1000) budget = parsed;
  }

  // Try finding deadline
  const daysMatch = text.match(/(\d+)\s*dias/i);
  const monthsMatch = text.match(/(\d+)\s*meses/i);
  let deadline = 90;
  if (daysMatch) {
    deadline = parseInt(daysMatch[1], 10);
  } else if (monthsMatch) {
    deadline = parseInt(monthsMatch[1], 10) * 30;
  }

  // Generate cleaned name
  let name = userMessage ? userMessage.slice(0, 45) : "Novo Projeto Nexus";
  name = name
    .replace(/^quero (abrir|criar|montar|desenvolver|estruturar)\s*/i, "")
    .replace(/^(como|quais|qual)\s.+/i, "Projeto Estratégico")
    .trim();

  if (name.length > 0) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  } else {
    name = "Empreendimento Nexus";
  }

  return {
    name,
    category: text.toLowerCase().includes("loja") || text.toLowerCase().includes("e-commerce")
      ? "E-commerce & Varejo"
      : text.toLowerCase().includes("app") || text.toLowerCase().includes("saas")
      ? "Startup & SaaS"
      : text.toLowerCase().includes("cafeteria") || text.toLowerCase().includes("restaurante")
      ? "Alimentos & Bebidas"
      : "Tecnologia & App",
    description: text.slice(0, 240).replace(/\*\*/g, "") + "...",
    budget,
    deadline,
  };
}

export const NexusAIChat: React.FC<NexusAIChatProps> = ({
  currentUser,
  showToast,
  onSendToProjectCreator,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = Storage.getChatHistory();
    return saved.length > 0 ? saved : DEFAULT_INITIAL_MESSAGES;
  });
  const [input, setInput] = useState("");
  const [currentMode, setCurrentMode] = useState<ChatMode>("general");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastModelUsed, setLastModelUsed] = useState<string>("gemini-3.1-flash-lite");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    Storage.saveChatHistory(messages);
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
      mode: currentMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          mode: currentMode,
          history: messages.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const aiReply =
        data.reply ||
        "Compreendi sua proposta perfeitamente. Como você gostaria de aprofundar os detalhes?";

      if (data.model) {
        setLastModelUsed(data.model);
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toISOString(),
        source: data.source || "gemini",
        model: data.model || "gemini-3.1-flash-lite",
        mode: currentMode,
      };

      setMessages((prev) => [...prev, aiMessage]);
      playNotificationSound();
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Compreendi sua proposta: "${messageText}". Recomendo estruturarmos este escopo dividindo em 3 fases: Validação inicial, MVP e Tração comercial. Você pode registrar este projeto no Estúdio de Projetos para calcularmos o cronograma e orçamento exatos!`,
        timestamp: new Date().toISOString(),
        source: "local",
        model: "nexus-local-v1",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Resposta copiada para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages(DEFAULT_INITIAL_MESSAGES);
    Storage.saveChatHistory(DEFAULT_INITIAL_MESSAGES);
    showToast("Histórico de conversa reiniciado.");
  };

  const handleExportChat = () => {
    const formatted = messages
      .map((m) => {
        const who = m.sender === "user" ? (currentUser ? currentUser.name : "Você") : "Nexus AI";
        const time = new Date(m.timestamp).toLocaleString("pt-BR");
        return `[${time}] ${who}:\n${m.text}\n\n-------------------------\n`;
      })
      .join("\n");

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-ai-conversa-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Transcrição da conversa baixada!");
  };

  const handleSendToStudio = (msgText: string, userMsgText?: string) => {
    const draft = extractProjectDraft(msgText, userMsgText);
    if (onSendToProjectCreator) {
      onSendToProjectCreator(draft);
    } else {
      // Fallback navigate to project tab
      const elem = document.getElementById("projeto");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
      showToast(`Plano '${draft.name}' transferido para o Estúdio!`);
    }
  };

  const quickPrompts = [
    {
      label: "☕ Cafeteria Especial",
      text: "Quero abrir uma cafeteria de cafés especiais com torrefação própria.",
    },
    {
      label: "📱 App Mobile SaaS",
      text: "Quero criar um aplicativo SaaS por assinatura para gestão de clínicas.",
    },
    {
      label: "🛍️ E-commerce Sustentável",
      text: "Como montar um e-commerce de moda sustentável com logística reversa?",
    },
    {
      label: "💰 Calcular Orçamento",
      text: "Tenho R$ 50.000. Como dividir este capital entre produto, marketing e reserva?",
    },
    {
      label: "⚡ Validar MVP em 30 dias",
      text: "Como validar minha ideia de produto digital em 30 dias gastando menos de R$ 2.000?",
    },
    {
      label: "⚠️ Matriz de Riscos",
      text: "Quais são os 4 maiores riscos que quebram startups no primeiro ano e como mitigá-los?",
    },
  ];

  return (
    <section id="ai" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Overview & Capabilities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GOOGLE GEMINI API INTEGRADA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Conversas sem amarras.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Inteligência em tempo real.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            O <strong>Nexus AI</strong> agora conversa de forma ilimitada através do modelo <strong>Gemini 3.1 Flash</strong>. Faça qualquer pergunta: de validação de hipóteses e cálculos de CAC até cronogramas de engenharia e estratégias de aquisição.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Memória contextual contínua</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>6 Personas executivas</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Perguntas interativas em 1 clique</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Exportação direta para Projetos</span>
            </div>
          </div>

          {/* Persona selector overview card */}
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                Especialidade Ativa:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                {MODES.find((m) => m.id === currentMode)?.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {MODES.find((m) => m.id === currentMode)?.desc}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {MODES.map((m) => {
                const Icon = m.icon;
                const isSel = currentMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentMode(m.id);
                      showToast(`Modo alterado para: ${m.label}`);
                    }}
                    className={`p-2 rounded-xl text-left border transition flex flex-col gap-1 cursor-pointer ${
                      isSel
                        ? "bg-cyan-500/15 border-cyan-400/50 text-white shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSel ? "text-cyan-300" : "text-slate-400"}`} />
                    <span className="text-[11px] font-bold leading-none truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tip */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Dica de Produtividade</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Respostas do Nexus AI agora exibem perguntas de aprofundamento sugeridas e um botão para enviar os dados diretamente para o <strong>Criador de Projetos</strong>!
            </p>
          </div>
        </div>

        {/* Right column: The Chat Console */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#090c14] border border-white/10 shadow-2xl flex flex-col h-[650px] overflow-hidden relative">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#07090e] border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                  N
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Nexus AI</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Gemini Online
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Motor: {lastModelUsed} • Modo: {MODES.find((m) => m.id === currentMode)?.label}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportChat}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold"
                  title="Baixar transcrição"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold"
                  title="Reiniciar conversa"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Limpar</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                const { bodyText, suggestedQuestions } = !isUser
                  ? parseMessageFollowUps(msg.text)
                  : { bodyText: msg.text, suggestedQuestions: [] };

                // Locate the last user query if available
                const userQuery = isUser
                  ? undefined
                  : messages.slice(0, index).reverse().find((m) => m.sender === "user")?.text;

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
                      className={`relative group max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/25 text-white"
                          : "bg-white/[0.04] border border-white/10 text-slate-200"
                      }`}
                    >
                      {/* Bubble Header */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${isUser ? "text-cyan-300" : "text-cyan-400"}`}>
                            {isUser ? (currentUser ? currentUser.name : "Você") : "Nexus AI"}
                          </span>
                          {!isUser && msg.model && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                              {msg.model}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Content with markdown paragraph rendering */}
                      <div className="space-y-2 whitespace-pre-line break-words">
                        {bodyText.split("\n\n").map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Suggested Interactive Follow-ups if generated */}
                      {!isUser && suggestedQuestions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                          <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                            Avançar na exploração:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestedQuestions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                onClick={() => handleSendMessage(q)}
                                disabled={isLoading}
                                className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <span>{q}</span>
                                <ArrowRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Tool Bar on AI messages */}
                      {!isUser && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-400">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
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
                          </div>

                          {/* Send to Project Studio button */}
                          <button
                            onClick={() => handleSendToStudio(msg.text, userQuery)}
                            className="text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-1 transition cursor-pointer font-semibold"
                            title="Preencher o Criador de Projetos com os dados desta análise"
                          >
                            <Boxes className="w-3 h-3 text-cyan-400" />
                            <span>Abrir no Estúdio de Projetos</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs flex-shrink-0">
                    N
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 flex items-center gap-3">
                    <span className="text-xs">
                      Nexus AI está consultando o motor neural Gemini...
                    </span>
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

            {/* Quick Inspiration Pills */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#07090e]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0">
                Sugestões:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 border border-white/10 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition cursor-pointer flex-shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input Form with Multi-line Support */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-[#07090e] border-t border-white/10 flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  id="nexus-ai-input"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Pergunte qualquer coisa ao Nexus AI... (Shift+Enter para quebra de linha)"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition disabled:opacity-50 resize-none max-h-36 leading-normal"
                />
              </div>

              <button
                id="nexus-ai-send-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:brightness-110 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,255,0.3)] flex-shrink-0"
                aria-label="Enviar mensagem"
                title="Enviar (Enter)"
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

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Project Nexus",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper to call Gemini with graceful multi-model fallback (gemini-3.1-flash-lite / gemini-3.8-flash)
async function callGeminiAPI(params: {
  prompt: string;
  systemInstruction: string;
  temperature?: number;
}): Promise<{ text: string; model: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // We try gemini-3.1-flash-lite first for rapid, high-throughput responses,
    // and fallback to gemini-3.8-flash if needed.
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];

    for (const model of modelsToTry) {
      try {
        // Enforce a strict 9-second timeout per model so requests never hang
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 9000)
        );

        const generatePromise = ai.models
          .generateContent({
            model,
            contents: params.prompt,
            config: {
              systemInstruction: params.systemInstruction,
              temperature: params.temperature ?? 0.7,
            },
          })
          .then((res) => ({ text: res.text?.trim() || "", model }))
          .catch((err) => {
            console.warn(
              `[Project Nexus] Model ${model} encountered an issue:`,
              err?.status || err?.message
            );
            return null;
          });

        const result = await Promise.race([generatePromise, timeoutPromise]);
        if (result && result.text) {
          return result;
        }
      } catch (err: any) {
        console.warn(`[Project Nexus] Model ${model} execution error:`, err?.status || err?.message);
      }
    }
  } catch (initErr: any) {
    console.error("[Project Nexus] Gemini client initialization failed:", initErr?.message);
  }

  return null;
}

// Personas / Modes system instructions dictionary
const MODE_INSTRUCTIONS: Record<string, string> = {
  general:
    "Você é o Nexus AI, motor de inteligência e arquiteto executivo do Project Nexus. Seu objetivo é dialogar livremente com o usuário sobre qualquer ideia de negócio, projeto ou iniciativa, transformando visões abstratas em planos executáveis, viáveis e altamente estruturados.",
  architect:
    "Você é o Nexus AI atuando como Arquiteto de Negócios e Estrategista de Startups. Seu foco é validação rápida de hipóteses, desenho de Menor Produto Viável (MVP), proposta única de valor (UVP) e modelagem de modelo de negócio (B2B, B2C, Marketplace, Assinatura).",
  finance:
    "Você é o Nexus AI atuando como CFO e Consultor Financeiro de Projetos. Seu foco é detalhar investimentos em Reais (R$), estrutura de custos fixos e variáveis, fluxo de caixa, precificação, projeção de ponto de equilíbrio (break-even) e métricas unitárias (CAC, LTV).",
  tech:
    "Você é o Nexus AI atuando como CTO e Arquiteto de Software. Seu foco é sugerir a stack tecnológica moderna ideal, infraestrutura escalável, segurança, estimativas de sprints, riscos de engenharia e facilidade de manutenção.",
  risks:
    "Você é o Nexus AI atuando como Auditor de Riscos e Governança de Projetos. Seu foco é identificar vulnerabilidades financeiras, regulatórias, jurídicas, de concorrência e operacionais, fornecendo planos de contingência práticos e mitigação ágil.",
  growth:
    "Você é o Nexus AI atuando como Especialista em Growth & Go-to-Market. Seu foco é aquisição dos primeiros clientes (estratégia 0 a 100), canais de tração, SEO, campanhas digitais, posicionamento de marca e retenção.",
};

// Nexus AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history, mode = "general" } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem obrigatória." });
    return;
  }

  // Format multi-turn context
  const historyArray = Array.isArray(history) ? history.slice(-8) : [];
  const conversationContext = historyArray
    .map((item: { sender: string; text: string }) => {
      const senderLabel = item.sender === "user" ? "Usuário" : "Nexus AI";
      return `${senderLabel}: ${item.text}`;
    })
    .join("\n\n");

  const baseInstruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.general;
  const fullSystemInstruction = `${baseInstruction}
Diretrizes fundamentais:
- Responda em Português do Brasil com tom executivo, moderno, empático, encorajador e prático.
- NÃO se limite a respostas prontas nem bloqueie perguntas. Responda a QUALQUER pergunta, dúvida, cenário hipotético ou detalhe que o usuário trouxer.
- Estruture com Markdown elegante: utilize negrito para conceitos-chave, listas para etapas e separadores quando oportuno.
- Forneça estimativas realistas (valores em R$, semanas/meses de prazo e composição de equipe) sempre que relevante.
- Mantenha continuidade: se o usuário estiver continuando uma conversa anterior, faça referência aos pontos discutidos.
- Sempre conclua a resposta oferecendo 2 ou 3 sugestões curtas de perguntas que o usuário pode fazer para continuar explorando, sinalizadas por:
"💡 **Para onde deseja avançar?**" seguido das opções em marcadores curtos.`;

  const prompt = conversationContext
    ? `Histórico recente da conversa com o usuário:
${conversationContext}

Nova mensagem do usuário:
${message}`
    : message;

  const geminiResult = await callGeminiAPI({
    prompt,
    systemInstruction: fullSystemInstruction,
    temperature: 0.7,
  });

  if (geminiResult) {
    res.json({
      reply: geminiResult.text,
      source: "gemini",
      model: geminiResult.model,
    });
    return;
  }

  // Fallback intelligent responder based on query topics (only if API key is missing or offline)
  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("cafeteria") || text.includes("café") || text.includes("restaurante")) {
    reply = `☕ **Excelente ideia para o setor de Alimentos & Bebidas!**

Para uma cafeteria moderna com foco em experiência do cliente:

1. **Investimento Estimado:** Entre **R$ 45.000 e R$ 90.000** (incluindo maquinário espresso profissional, reforma e capital de giro).
2. **Cronograma Inicial (90 dias):**
   - *Semana 1-2:* Estudo de ponto comercial e fluxo de pedestres.
   - *Semana 3-5:* Regularização sanitária (ANVISA) e arquitetura funcional.
   - *Semana 6-8:* Homologação de torrefadores parceiros e treinamento de baristas.
   - *Semana 9-12:* Testes operacionais (soft-opening) e campanha de lançamento local.
3. **Riscos Principais:** Custo fixo do ponto e perda de insumos perecíveis.
4. **Dica Nexus:** Desenvolva um programa de fidelidade digital desde o dia 1 para garantir recorrência.

💡 **Para onde deseja avançar?**
- Como escolher os maquinários com menor custo de manutenção?
- Qual a margem média esperada para cafés especiais?
- Como montar o evento de inauguração com custo zero?`;
  } else if (text.includes("app") || text.includes("aplicativo") || text.includes("software") || text.includes("saas")) {
    reply = `📱 **Plano de Estruturação de Aplicativo:**

Para transformar sua ideia de software em um produto viável e escalável (MVP):

1. **Fases Recomendadas:**
   - **Fase 1 (Validação):** Entrevistas com 20 clientes potenciais e protótipo navegável (Figma).
   - **Fase 2 (MVP):** Desenvolvimento do fluxo essencial com arquitetura moderna e segura.
   - **Fase 3 (Beta Fechado):** 50 usuários pioneiros medindo retenção e taxa de conclusão de tarefas.
   - **Fase 4 (Go-to-Market):** Estratégia de aquisição orgânica e canais de tração.
2. **Equipe Inicial Recomendada:** 1 Product Designer + 1 Fullstack Engineer + 1 Growth/Estrategista.
3. **Prazo de Lançamento:** 60 a 90 dias para a primeira versão pública.

💡 **Para onde deseja avançar?**
- Qual modelo de monetização se encaixa melhor no seu app?
- Como recrutar os primeiros 50 usuários de teste?
- Quais ferramentas no-code podem acelerar seu protótipo?`;
  } else if (text.includes("loja") || text.includes("e-commerce") || text.includes("vender") || text.includes("marca")) {
    reply = `🛍️ **Estruturação de E-commerce / Varejo Digital:**

1. **Investimento Inicial Simulado:** R$ 15.000 a R$ 35.000 (estoque inicial, branding, plataforma e verba de tráfego pago).
2. **Pilares Críticos de Sucesso:**
   - **CAC vs LTV:** Manter o Custo de Aquisição abaixo de 30% da margem bruta.
   - **Logística Rápida:** Integração com fulfillment e transportadoras eficientes.
   - **Políticas de Troca Claras:** Reduz a fricção e aumenta a confiança na primeira compra.
3. **Próxima Ação:** Cadastre os primeiros 3 produtos e teste campanhas de pré-venda com landing page.

💡 **Para onde deseja avançar?**
- É melhor começar com estoque próprio ou dropshipping?
- Como planejar a verba de anúncios no Instagram e Google?`;
  } else if (text.includes("risco") || text.includes("perigo") || text.includes("problema")) {
    reply = `⚠️ **Matriz de Riscos Nexus:**

1. 🔴 **Risco Financeiro:** Esgotamento de caixa antes da validação da tração comercial. *Mitigação: Manter reserva de contingência de pelo menos 20% do orçamento.*
2. 🟠 **Risco Operacional:** Atrasos no cronograma de fornecedores ou entregas técnicas. *Mitigação: Definir marcos semanais com prazos elásticos.*
3. 🟡 **Risco de Mercado:** O cliente achar o produto interessante, mas não estar disposto a pagar. *Mitigação: Pré-venda ou cartas de intenção antecipadas.*
4. 🔵 **Risco Técnico:** Complexidade inesperada na execução. *Mitigação: Comece pelo Menor Produto Viável (MVP).*

💡 **Para onde deseja avançar?**
- Como estruturar um plano B caso o orçamento aperte?
- Como validar a disposição a pagar antes de produzir?`;
  } else if (text.includes("investimento") || text.includes("orçamento") || text.includes("dinheiro") || text.includes("custo")) {
    reply = `💰 **Distribuição Estratégica de Capital (Recomendação Nexus):**

- 🏗️ **Construção / Produto:** 35% do orçamento total
- 👥 **Operação & Talentos:** 25%
- 📢 **Marketing & Aquisição:** 25%
- 🛡️ **Reserva de Emergência / Contingência:** 15%

Qual valor você tem disponível hoje para refinarmos este cálculo?`;
  } else {
    reply = `🧠 **Análise Inicial do Nexus AI para:** "${message}"

Analisei sua proposta sob as melhores práticas de gestão de projetos e viabilidade de negócios:

1. **Definição de Escopo:** O principal valor é solucionar uma dor latente com o menor tempo de chegada ao mercado (Time to Market).
2. **Marcos Críticos:**
   - Validação com clientes reais antes de despender grandes volumes financeiros.
   - Construção ágil em 3 ciclos quinzenais (Sprints).
   - Coleta contínua de métricas de uso e satisfação.
3. **Recomendação Imediata:** Clique em **"Projetos"** para registrar este escopo e utilizar nosso simulador de cenários para equilibrar orçamento, equipe e prazo!

💡 **Para onde deseja avançar?**
- Descreva seu público-alvo principal para refinarmos o posicionamento.
- Deseja calcular o investimento inicial estimado?
- Quer definir um cronograma de 90 dias passo a passo?`;
  }

  res.json({ reply, source: "local", model: "nexus-local-v1" });
});

// Nexus AI Project analysis endpoint
app.post("/api/analyze-project", async (req, res) => {
  try {
    const {
      name = "Novo Projeto",
      category = "Startup & SaaS",
      description = "",
      budget = 35000,
      deadline = 90,
    } = req.body || {};

    const prompt = `Analise o projeto abaixo e forneça um plano em formato de tópicos objetivos:
Nome: ${name}
Categoria: ${category}
Descrição: ${description}
Orçamento Disponível: R$ ${budget}
Prazo em dias: ${deadline}

Forneça:
1. Resumo Executivo da Ideia (2 frases de impacto)
2. 5 Etapas Claras (Pesquisa, Planejamento, Desenvolvimento, Testes, Lançamento) com estimativa de dias cada
3. Equipe Mínima Recomendada
4. 3 Principais Riscos e Mitigações
5. Nota de Viabilidade Geral de 0 a 100% com justificativa fundamentada.`;

    const geminiResult = await callGeminiAPI({
      prompt,
      systemInstruction:
        "Você é o analista sênior de projetos do Project Nexus. Seja conciso, cirúrgico, estruturado e focado em viabilidade real de execução.",
      temperature: 0.6,
    });

    if (geminiResult) {
      // Extract viability score if present
      const scoreMatch = geminiResult.text.match(/(\d{1,3})%/);
      const viabilityScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 78;

      res.json({
        analysis: geminiResult.text,
        source: "gemini",
        model: geminiResult.model,
        viabilityScore: Math.min(100, Math.max(10, viabilityScore)),
      });
      return;
    }

    // Fallback analytical generator
    const budgetNum = Number(budget) || 30000;
    const deadlineNum = Number(deadline) || 90;

    let viabilityScore = 72;
    if (budgetNum >= 40000) viabilityScore += 10;
    if (budgetNum < 15000) viabilityScore -= 15;
    if (deadlineNum >= 60) viabilityScore += 8;
    if (deadlineNum < 40) viabilityScore -= 12;
    viabilityScore = Math.min(96, Math.max(35, viabilityScore));

    const p1 = Math.round(deadlineNum * 0.15);
    const p2 = Math.round(deadlineNum * 0.2);
    const p3 = Math.round(deadlineNum * 0.35);
    const p4 = Math.round(deadlineNum * 0.15);
    const p5 = Math.max(5, deadlineNum - (p1 + p2 + p3 + p4));

    const fallbackAnalysis = `### 📊 Diagnóstico Estruturado pelo Nexus AI

**Resumo Executivo:**
O projeto **${name}** na categoria **${category}** tem alto potencial de execução quando estruturado em ciclos ágeis. Com R$ ${budgetNum.toLocaleString("pt-BR")} e ${deadlineNum} dias de prazo, é possível entregar uma versão robusta sem comprometer a liquidez operacional.

**Cronograma em 5 Etapas:**
1. 🔎 **Pesquisa & Mercado:** ${p1} dias — Análise de concorrentes, público-alvo e proposição de valor única.
2. 🧠 **Planejamento Estratégico:** ${p2} dias — Orçamento detalhado, contratos e definição de requisitos.
3. 🛠️ **Desenvolvimento / Execução:** ${p3} dias — Construção do core do projeto e fluxos centrais.
4. 🧪 **Testes & Qualidade:** ${p4} dias — Validação com grupo de controle e correções imediatas.
5. 🚀 **Lançamento & Monitoramento:** ${p5} dias — Campanha de tração, aquisição e métricas iniciais.

**Equipe Sugerida:**
- 1 Gestor / Líder de Projeto
- 1 a 2 Especialistas Técnicos (${category})
- 1 Responsável por Aquisição / Comercial

**Viabilidade Geral Calculada:** **${viabilityScore}%** (Cenário ${viabilityScore >= 75 ? "muito favorável" : "equilibrado com atenção aos custos"}).`;

    res.json({
      analysis: fallbackAnalysis,
      source: "local",
      viabilityScore,
    });
  } catch (endpointErr: any) {
    console.error("[Project Nexus] Erro crítico no endpoint /api/analyze-project:", endpointErr?.message);
    res.json({
      analysis: `### 📊 Diagnóstico do Nexus AI\n\n**Resumo Executivo:**\nO projeto foi estruturado com base nas melhores práticas ágeis. O foco deve ser na validação com os primeiros clientes e execução do MVP.\n\n**Viabilidade Geral:** 75%`,
      source: "local",
      viabilityScore: 75,
    });
  }
});

// Vite middleware & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Project Nexus] Servidor em execução na porta ${PORT}`);
  });
}

startServer();

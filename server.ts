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

// Nexus AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem obrigatória." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare conversation history context
      const formattedHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Usuário" : "Nexus AI"}: ${h.text}`)
            .join("\n")
        : "";

      const prompt = `Contexto anterior da conversa:
${formattedHistory}

Mensagem do usuário:
${message}

Instruções para o Nexus AI:
- Você é o motor de inteligência do Project Nexus: uma plataforma que transforma qualquer ideia em um projeto real, executável e validado.
- Responda de forma profissional, moderna, encorajadora e altamente prática em Português do Brasil.
- Estruture a resposta com tópicos claros, estimativas realistas (orçamento, prazos, equipe, riscos) e próximos passos.
- Utilize formatação Markdown (negrito, listas e tópicos).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Você é o Nexus AI, especialista em ideação, estruturação de startups, gestão ágil e arquitetura de projetos.",
        },
      });

      const replyText = response.text || "Não foi possível formular uma resposta no momento.";
      res.json({ reply: replyText, source: "gemini" });
      return;
    } catch (err: any) {
      console.warn("Gemini call failed, falling back to local engine:", err?.message);
    }
  }

  // Fallback intelligent responder based on query topics
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
4. **Dica Nexus:** Desenvolva um programa de fidelidade digital desde o dia 1 para garantir recorrência.`;
  } else if (text.includes("app") || text.includes("aplicativo") || text.includes("software") || text.includes("saas")) {
    reply = `📱 **Plano de Estruturação de Aplicativo:**

Para transformar sua ideia de software em um produto viável e escalável (MVP):

1. **Fases Recomendadas:**
   - **Fase 1 (Validação):** Entrevistas com 20 clientes potenciais e protótipo navegável (Figma).
   - **Fase 2 (MVP):** Desenvolvimento do fluxo essencial com arquitetura moderna e segura.
   - **Fase 3 (Beta Fechado):** 50 usuários pioneiros medindo retenção e taxa de conclusão de tarefas.
   - **Fase 4 (Go-to-Market):** Estratégia de aquisição orgânica e canais de tração.
2. **Equipe Inicial Recomendada:** 1 Product Designer + 1 Fullstack Engineer + 1 Growth/Estrategista.
3. **Prazo de Lançamento:** 60 a 90 dias para a primeira versão pública.`;
  } else if (text.includes("loja") || text.includes("e-commerce") || text.includes("vender") || text.includes("marca")) {
    reply = `🛍️ **Estruturação de E-commerce / Varejo Digital:**

1. **Investimento Inicial Simulado:** R$ 15.000 a R$ 35.000 (estoque inicial, branding, plataforma e verba de tráfego pago).
2. **Pilares Críticos de Sucesso:**
   - **CAC vs LTV:** Manter o Custo de Aquisição abaixo de 30% da margem bruta.
   - **Logística Rápida:** Integração com fulfillment e transportadoras eficientes.
   - **Políticas de Troca Claras:** Reduz a fricção e aumenta a confiança na primeira compra.
3. **Próxima Ação:** Cadastre os primeiros 3 produtos e teste campanhas de pré-venda com landing page.`;
  } else if (text.includes("risco") || text.includes("perigo") || text.includes("problema")) {
    reply = `⚠️ **Matriz de Riscos Nexus:**

1. 🔴 **Risco Financeiro:** Esgotamento de caixa antes da validação da tração comercial. *Mitigação: Manter reserva de contingência de pelo menos 20% do orçamento.*
2. 🟠 **Risco Operacional:** Atrasos no cronograma de fornecedores ou entregas técnicas. *Mitigação: Definir marcos semanais com prazos elásticos.*
3. 🟡 **Risco de Mercado:** O cliente achar o produto interessante, mas não estar disposto a pagar. *Mitigação: Pré-venda ou cartas de intenção antecipadas.*
4. 🔵 **Risco Técnico:** Complexidade inesperada na execução. *Mitigação: Comece pelo Menor Produto Viável (MVP).*`;
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
3. **Recomendação Imediata:** Clique em **"Projetos"** para registrar este escopo e utilizar nosso simulador de cenários para equilibrar orçamento, equipe e prazo!`;
  }

  res.json({ reply, source: "local" });
});

// Nexus AI Project analysis endpoint
app.post("/api/analyze-project", async (req, res) => {
  const { name, category, description, budget, deadline } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Analise o projeto abaixo e forneça um plano em formato de tópicos objetivos:
Nome: ${name}
Categoria: ${category}
Descrição: ${description}
Orçamento Disponível: R$ ${budget}
Prazo em dias: ${deadline}

Forneça:
1. Resumo Executivo da Ideia (2 frases)
2. 5 Etapas Claras (Pesquisa, Planejamento, Desenvolvimento, Testes, Lançamento) com estimativa de dias cada
3. Equipe Mínima Recomendada
4. 3 Principais Riscos e Mitigações
5. Nota de Viabilidade Geral de 0 a 100% com justificativa.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Você é o analista sênior de projetos do Project Nexus. Seja conciso, cirúrgico e focado em viabilidade.",
        },
      });

      res.json({
        analysis: response.text,
        source: "gemini",
      });
      return;
    } catch (err: any) {
      console.warn("Analyze project Gemini error, falling back:", err?.message);
    }
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
  const p5 = deadlineNum - (p1 + p2 + p3 + p4);

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

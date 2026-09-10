import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { message, history, mode = "general" } = body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem obrigatória." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

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
- Mantenha continuidade com o histórico da conversa.
- Sempre conclua a resposta oferecendo 2 ou 3 sugestões curtas de perguntas que o usuário pode fazer para continuar explorando, sinalizadas por:
"💡 **Para onde deseja avançar?**" seguido das opções em marcadores curtos.`;

      const prompt = conversationContext
        ? `Histórico recente da conversa com o usuário:\n${conversationContext}\n\nNova mensagem do usuário:\n${message}`
        : message;

      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: fullSystemInstruction,
              temperature: 0.7,
            },
          });

          if (response.text) {
            res.status(200).json({
              reply: response.text.trim(),
              source: "gemini",
              model,
              hasGeminiKey: true,
            });
            return;
          }
        } catch (modelErr: any) {
          console.warn(`[Vercel Serverless] Erro no modelo ${model}:`, modelErr?.message);
        }
      }
    } catch (apiErr: any) {
      console.error("[Vercel Serverless] Erro ao instanciar Gemini SDK:", apiErr?.message);
    }
  }

  // Resilient fallback when GEMINI_API_KEY is not configured or offline
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
    reply = `📱 **Plano de Estruturação de Aplicativo / SaaS:**

Para transformar sua ideia de software em um produto viável e escalável (MVP):

1. **Fases Recomendadas:**
   - **Fase 1 (Validação):** Entrevistas com 20 clientes potenciais e protótipo navegável (Figma).
   - **Fase 2 (MVP):** Desenvolvimento do fluxo essencial com arquitetura moderna e segura.
   - **Fase 3 (Beta Fechado):** 50 usuários pioneiros medindo retenção e conclusão de tarefas.
   - **Fase 4 (Go-to-Market):** Estratégia de aquisição orgânica e canais de tração.
2. **Equipe Inicial Recomendada:** 1 Product Designer + 1 Fullstack Engineer + 1 Growth/Estrategista.
3. **Prazo de Lançamento:** 60 a 90 dias para a primeira versão pública.

💡 **Para onde deseja avançar?**
- Qual modelo de monetização se encaixa melhor no seu app?
- Como recrutar os primeiros 50 usuários de teste?
- Quais ferramentas aceleram a construção do protótipo?`;
  } else if (text.includes("loja") || text.includes("e-commerce") || text.includes("vender") || text.includes("marca")) {
    reply = `🛍️ **Estruturação de E-commerce / Varejo Digital:**

1. **Investimento Inicial Simulado:** R$ 15.000 a R$ 35.000 (estoque inicial, branding, plataforma e tráfego).
2. **Pilares Críticos de Sucesso:**
   - **CAC vs LTV:** Manter o Custo de Aquisição abaixo de 30% da margem bruta.
   - **Logística Rápida:** Parcerias com transportadoras ágeis e fulfillment.
   - **Políticas Claras de Troca:** Reduz a fricção e aumenta a confiança na primeira compra.
3. **Próxima Ação:** Cadastre os primeiros 3 produtos e teste campanhas de pré-venda.

💡 **Para onde deseja avançar?**
- É melhor começar com estoque próprio ou sob demanda?
- Como planejar a verba de anúncios no Instagram e Google?`;
  } else {
    reply = `🧠 **Análise Estratégica do Nexus AI para:** "${message}"

Analisei sua proposta sob as melhores práticas de validação ágil e viabilidade de negócios:

1. **Definição de Escopo:** O principal foco deve ser solucionar uma dor real com o menor tempo até o mercado (Time to Market).
2. **Marcos Críticos:**
   - Validação com clientes reais antes de despender grandes volumes financeiros.
   - Construção ágil em ciclos quinzenais (Sprints).
   - Coleta contínua de métricas de engajamento e satisfação.
3. **Recomendação Prática:** Registre esta iniciativa no módulo **"Projetos"** para simular o cronograma de 90 dias e calcular a viabilidade!

💡 **Para onde deseja avançar?**
- Descreva seu público-alvo principal para refinarmos o posicionamento.
- Deseja estimar o orçamento ideal para este projeto?
- Como estruturar um cronograma de validação passo a passo?`;
  }

  res.status(200).json({
    reply,
    source: "local",
    model: "nexus-local-v1",
    hasGeminiKey: Boolean(apiKey),
  });
}

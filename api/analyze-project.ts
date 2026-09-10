import { GoogleGenAI } from "@google/genai";

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

  const {
    name = "Novo Projeto",
    category = "Startup & SaaS",
    description = "",
    budget = 35000,
    deadline = 90,
  } = body || {};

  const budgetNum = Number(budget) || 35000;
  const deadlineNum = Number(deadline) || 90;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Analise o projeto abaixo e forneça um plano em formato de tópicos objetivos:
Nome: ${name}
Categoria: ${category}
Descrição: ${description}
Orçamento Disponível: R$ ${budgetNum}
Prazo em dias: ${deadlineNum}

Forneça:
1. Resumo Executivo da Ideia (2 frases de impacto)
2. 5 Etapas Claras (Pesquisa, Planejamento, Desenvolvimento, Testes, Lançamento) com estimativa de dias cada
3. Equipe Mínima Recomendada
4. 3 Principais Riscos e Mitigações
5. Nota de Viabilidade Geral de 0 a 100% com justificativa fundamentada.`;

      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction:
                "Você é o analista sênior de projetos do Project Nexus. Seja conciso, cirúrgico, estruturado e focado em viabilidade real de execução.",
              temperature: 0.6,
            },
          });

          if (response.text) {
            const scoreMatch = response.text.match(/(\d{1,3})%/);
            const viabilityScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 78;

            res.status(200).json({
              analysis: response.text.trim(),
              source: "gemini",
              model,
              viabilityScore: Math.min(100, Math.max(10, viabilityScore)),
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

  // Resilient fallback when offline or without API key
  let viabilityScore = 74;
  if (budgetNum >= 45000) viabilityScore += 8;
  if (budgetNum < 18000) viabilityScore -= 12;
  if (deadlineNum >= 60) viabilityScore += 6;
  if (deadlineNum < 40) viabilityScore -= 10;
  viabilityScore = Math.min(95, Math.max(40, viabilityScore));

  const p1 = Math.round(deadlineNum * 0.15);
  const p2 = Math.round(deadlineNum * 0.2);
  const p3 = Math.round(deadlineNum * 0.35);
  const p4 = Math.round(deadlineNum * 0.15);
  const p5 = Math.max(5, deadlineNum - (p1 + p2 + p3 + p4));

  const fallbackAnalysis = `### 📊 Diagnóstico Estruturado pelo Nexus AI

**Resumo Executivo:**
O projeto **${name.trim()}** na categoria **${category}** possui grande potencial prático de mercado. Com R$ ${budgetNum.toLocaleString("pt-BR")} de investimento inicial previsto e ${deadlineNum} dias para o lançamento, o foco primordial deve ser na validação rápida com usuários pioneiros para gerar receita inicial antes de expansões secundárias.

**Cronograma em 5 Etapas Recomendadas:**
1. 🔎 **Pesquisa & Validação:** ${p1} dias — Análise de concorrentes diretos, entrevistas com potenciais clientes e definição da Proposta Única de Valor (UVP).
2. 🧠 **Planejamento & Prototipagem:** ${p2} dias — Desenho da arquitetura, wireframes funcionais e detalhamento da estrutura de custos fixos e variáveis.
3. 🛠️ **Desenvolvimento do Core (MVP):** ${p3} dias — Construção do Menor Produto Viável contendo apenas o fluxo indispensável para resolver a dor do cliente.
4. 🧪 **Testes & Homologação:** ${p4} dias — Grupo fechado com 30 usuários pioneiros (Beta), refinamento de usabilidade e testes de segurança.
5. 🚀 **Go-to-Market & Lançamento:** ${p5} dias — Campanha de aquisição inicial, ativação de canais de tração e acompanhamento diário de métricas de retenção.

**Equipe Mínima Sugerida:**
- 1 Líder de Produto / Estrategista de Negócios
- 1 a 2 Especialistas de Execução Técnica (${category})
- 1 Gestor de Aquisição & Comercial (Growth)

**Principais Riscos e Mitigações:**
1. 🔴 **Risco Financeiro:** Despesas imprevistas na fase de desenvolvimento. *Mitigação: Manter 15% do orçamento em reserva de emergência.*
2. 🟠 **Risco de Mercado:** Menor conversão na primeira oferta. *Mitigação: Realizar campanhas de lista de espera e pré-venda antecipada.*
3. 🟡 **Risco Operacional:** Atrasos em entregas de fornecedores ou integrações. *Mitigação: Sprints quinzenais com entregas incrementais funcionais.*

**Viabilidade Geral Calculada:** **${viabilityScore}%** (Cenário muito promissor quando executado com disciplina de escopo enxuto).`;

  res.status(200).json({
    analysis: fallbackAnalysis,
    source: "local",
    viabilityScore,
    hasGeminiKey: Boolean(apiKey),
  });
}

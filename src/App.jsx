import { useState, useRef, useEffect } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .fa-header { font-family: 'Playfair Display', serif; }
  .fa-body   { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }
  @keyframes barGrow {
    from { width: 0%; }
    to   { width: var(--bar-w); }
  }

  .anim-fadeup   { animation: fadeUp   0.5s ease both; }
  .anim-fadein   { animation: fadeIn   0.4s ease both; }
  .anim-scalein  { animation: scaleIn  0.4s ease both; }

  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.10s; }
  .delay-3 { animation-delay: 0.15s; }
  .delay-4 { animation-delay: 0.20s; }
  .delay-5 { animation-delay: 0.25s; }

  .hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(200,160,80,0.22);
  }

  .gold-shimmer {
    background: linear-gradient(90deg, #c8a050, #f0d888, #c8a050);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .option-btn {
    width: 100%;
    text-align: left;
    padding: 13px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(200,160,80,0.18);
    border-radius: 10px;
    color: #c8d8e8;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .option-btn:hover {
    background: rgba(200,160,80,0.09);
    border-color: rgba(200,160,80,0.45);
    color: #e8dcc8;
    transform: translateX(3px);
  }
  .option-btn.selected {
    background: rgba(200,160,80,0.14);
    border-color: rgba(200,160,80,0.7);
    color: #e8c878;
    font-weight: 500;
  }
  .option-btn.selected::before {
    content: '✓';
    color: #c8a050;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }

  select.fa-select {
    width: 100%;
    padding: 13px 16px;
    background: rgba(10,20,40,0.8);
    border: 1px solid rgba(200,160,80,0.3);
    border-radius: 10px;
    color: #e8dcc8;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c8a050' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    transition: border-color 0.2s ease;
  }
  select.fa-select:focus {
    border-color: rgba(200,160,80,0.7);
    box-shadow: 0 0 0 3px rgba(200,160,80,0.1);
  }
  select.fa-select option {
    background: #0d1b2a;
    color: #e8dcc8;
  }

  input.fa-input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(10,20,40,0.8);
    border: 1px solid rgba(200,160,80,0.3);
    border-radius: 10px;
    color: #e8dcc8;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s ease;
  }
  input.fa-input:focus {
    border-color: rgba(200,160,80,0.7);
    box-shadow: 0 0 0 3px rgba(200,160,80,0.1);
  }
  input.fa-input::placeholder { color: #445566; }

  .module-dot {
    width: 8px; height: 8px; border-radius: 50%;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
  .module-dot.done     { background: #4caf82; }
  .module-dot.current  { background: #c8a050; width: 24px; border-radius: 4px; }
  .module-dot.upcoming { background: rgba(255,255,255,0.12); }

  .card-glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
  }

  .btn-primary {
    padding: 14px 36px;
    background: linear-gradient(135deg, #c8a050, #e8c878);
    border: none;
    border-radius: 12px;
    color: #050a12;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(200,160,80,0.35);
    transition: all 0.2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(200,160,80,0.5);
  }
  .btn-primary:disabled {
    background: rgba(255,255,255,0.06);
    color: #445566;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-ghost {
    padding: 12px 24px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    color: #667788;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .btn-ghost:hover {
    border-color: rgba(200,160,80,0.3);
    color: #c8a050;
  }

  .score-bar-fill {
    height: 100%;
    border-radius: 4px;
    animation: barGrow 1.2s ease both;
    animation-delay: 0.3s;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(200,160,80,0.3); border-radius: 2px; }
`;

function GlobalStyles() {
  useEffect(() => {
    const id = 'fa-global-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GLOBAL_STYLE;
      document.head.appendChild(style);
    }
    return () => {};
  }, []);
  return null;
}

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "Financial Protection Advisor",
    appSubtitle: "Personalized Strategy Builder",
    moduleLabel: "Module",
    ofLabel: "of",
    nextBtn: "Next Module →",
    generateBtn: "Generate My Plan →",
    backBtn: "← Back",
    reviewBtn: "← Review Answers",
    restartBtn: "Start New Assessment",
    selectPlaceholder: "— Select an option —",
    answerHonestly: "Answer honestly for the most accurate personalized plan",
    assessmentTitle: "Your Financial Protection Assessment",
    criticalTitle: "🚨 Critical — Address Immediately",
    importantTitle: "⚠️ Important — Plan Within 90 Days",
    opportunityTitle: "💡 Opportunities — Make Your Money Work Harder",
    insightsTitle: "🔎 Personalized Insights",
    budgetTitle: "💵 Recommended Budget Allocation",
    budgetSubtitle: "Based on your selected budget:",
    scoresTitle: "📊 Protection Score Breakdown",
    factsTitle: "📌 Key Facts",
    ctaText: "Ready to take the next step? A complimentary strategy session costs nothing — but not having a plan could cost everything.",
    disclaimer: "⚠️ For educational purposes only. Not financial, legal, or tax advice. Consult a licensed financial professional for personalized recommendations.",
    criticalBadge: "CRITICAL", importantBadge: "IMPORTANT", opportunityBadge: "OPPORTUNITY", tipBadge: "TIP",
    wellProtected: "Well Protected", partiallyProtected: "Partially Protected", significantGaps: "Significant Gaps Detected",
    critical: "Critical", important: "Important", opportunity: "Opportunity",
    perMonth: "/month", switchLang: "🌐 ES",
    modules: [
      { id: "A", title: "Family Profile", icon: "👨‍👩‍👧‍👦", questions: [
        { id: "age", label: "What is your age?", type: "number", placeholder: "e.g. 35" },
        { id: "marital", label: "Marital status?", type: "select", options: ["Single", "Married", "Divorced", "Widowed"] },
        { id: "dependents", label: "Do you have children or dependents?", type: "select", options: ["No", "Yes – 1", "Yes – 2", "Yes – 3+"] },
        { id: "dependent_ages", label: "Ages of children/dependents (if any)?", type: "text", placeholder: "e.g. 3, 7, 12  |  N/A if none" },
        { id: "young_children", label: "Do you have children under 18?", type: "select", options: ["No", "Yes – under age 5", "Yes – age 5–12", "Yes – age 13–17", "Yes – multiple age groups"] },
        { id: "economic_dependent", label: "Does anyone depend financially on your income?", type: "select", options: ["No", "Yes – Spouse/Partner", "Yes – Children", "Yes – Parents", "Multiple"] },
        { id: "medical_condition", label: "Does anyone in your household have a relevant medical condition?", type: "select", options: ["No", "Yes – myself", "Yes – spouse/partner", "Yes – dependent"] },
      ]},
      { id: "B", title: "Income & Stability", icon: "💼", questions: [
        { id: "income_type", label: "What is your income type?", type: "select", options: ["W-2 Employee", "Self-Employed", "Business Owner", "Mixed"] },
        { id: "gross_monthly", label: "Gross monthly income?", type: "number", placeholder: "e.g. 6000" },
        { id: "net_monthly", label: "Net monthly income (take-home)?", type: "number", placeholder: "e.g. 4500" },
        { id: "income_dependent_on_health", label: "Does your income depend on your health or active work?", type: "select", options: ["Yes – entirely", "Mostly yes", "Partially", "No – I have passive income"] },
        { id: "passive_income", label: "Do you have passive income sources?", type: "select", options: ["No", "Yes – rental", "Yes – investments", "Yes – business", "Multiple sources"] },
      ]},
      { id: "C", title: "Cash Flow & Savings", icon: "💰", questions: [
        { id: "monthly_expenses", label: "Total monthly expenses (approx.)?", type: "number", placeholder: "e.g. 3800" },
        { id: "positive_cashflow", label: "Do you have positive monthly cash flow after expenses?", type: "select", options: ["Yes – $500+", "Yes – under $500", "Breaking even", "Negative / deficit"] },
        { id: "emergency_fund", label: "Do you have an emergency fund?", type: "select", options: ["No", "Yes – less than 1 month", "Yes – 1–3 months", "Yes – 3–6 months", "Yes – 6+ months"] },
        { id: "savings_habit", label: "Are you currently saving monthly?", type: "select", options: ["No", "Yes – less than $200", "Yes – $200–$500", "Yes – $500+"] },
        { id: "bank_cd_savings", label: "Do you have money in CDs or bank savings accounts?", type: "select", options: ["No", "Yes – under $10,000", "Yes – $10,000–$50,000", "Yes – $50,000–$100,000", "Yes – over $100,000"] },
        { id: "cd_rate_awareness", label: "If yes — what interest rate are you earning on those savings?", type: "select", options: ["Not applicable", "Under 2%", "Around 2–3%", "Around 3–4%", "Over 4%", "I don't know"] },
      ]},
      { id: "D", title: "Debts", icon: "📊", questions: [
        { id: "mortgage", label: "Do you have a mortgage?", type: "select", options: ["No", "Yes – under $1,500/mo", "Yes – $1,500–$2,500/mo", "Yes – $2,500+/mo"] },
        { id: "auto_loan", label: "Do you have auto loans?", type: "select", options: ["No", "Yes – under $500/mo", "Yes – $500+/mo"] },
        { id: "credit_cards", label: "Do you carry credit card debt?", type: "select", options: ["No", "Yes – under $5,000", "Yes – $5,000–$20,000", "Yes – $20,000+"] },
        { id: "personal_loans", label: "Personal loans or other debts?", type: "select", options: ["No", "Yes – manageable", "Yes – high interest (20%+)"] },
        { id: "total_debt_payments", label: "Total monthly debt payments?", type: "number", placeholder: "e.g. 1200" },
      ]},
      { id: "E", title: "Current Protection", icon: "🛡️", questions: [
        { id: "life_insurance", label: "Do you have life insurance?", type: "select", options: ["No", "Term – employer provided", "Term – private", "Permanent / Whole Life", "Not sure"] },
        { id: "life_coverage_amount", label: "Approximate life insurance coverage amount?", type: "select", options: ["Not applicable", "Under $100K", "$100K–$300K", "$300K–$500K", "$500K–$1M", "Over $1M"] },
        { id: "final_expense_coverage", label: "Do you have coverage for final expenses (funeral, burial, end-of-life)?", type: "select", options: ["No", "Yes – included in my life policy", "Yes – separate final expense policy", "I have savings set aside", "Not sure"] },
        { id: "health_insurance", label: "Health insurance?", type: "select", options: ["No", "Employer plan", "Private / Marketplace", "Medicare", "Medicaid"] },
        { id: "ltc", label: "Do you have Long-Term Care (LTC) coverage?", type: "select", options: ["No", "Yes – stand-alone policy", "Yes – linked benefits / hybrid", "Yes – rider on life policy", "Not sure"] },
        { id: "disability", label: "Do you have disability income coverage?", type: "select", options: ["No", "Yes – employer short-term", "Yes – long-term disability", "Not sure"] },
        { id: "will", label: "Do you have a Will?", type: "select", options: ["No", "In progress", "Yes – up to date", "Yes – needs updating"] },
        { id: "trust", label: "Do you have a Trust or Power of Attorney?", type: "select", options: ["No", "Power of Attorney only", "Trust only", "Both"] },
      ]},
      { id: "F", title: "Retirement & Future", icon: "🏔️", questions: [
        { id: "retirement_accounts", label: "Do you have retirement accounts?", type: "select", options: ["No", "401(k) / 403(b)", "IRA / Roth IRA", "TSP / 457", "Multiple"] },
        { id: "retirement_savings_total", label: "Approximate total retirement savings?", type: "select", options: ["$0 – nothing saved", "Under $25,000", "$25K–$100K", "$100K–$300K", "$300K–$500K", "$500K+"] },
        { id: "rollover_experience", label: "Have you ever done a 401k rollover?", type: "select", options: ["No", "Yes", "Not sure what that is"] },
        { id: "retirement_age_goal", label: "When would you like to retire?", type: "select", options: ["In 5 years or less", "In 5–10 years", "In 10–20 years", "In 20+ years", "Not sure"] },
        { id: "retirement_priority", label: "Your #1 retirement priority?", type: "select", options: ["Safety & Guarantees", "Maximum Growth", "Tax Efficiency", "Balance of all three"] },
        { id: "college_savings", label: "Are you saving for a child's college education?", type: "select", options: ["No children / not applicable", "No – not saving yet", "Yes – 529 plan", "Yes – other savings", "Looking for better options"] },
        { id: "monthly_budget", label: "Monthly budget available for financial protection & savings?", type: "select", options: ["Under $100", "$100–$250", "$250–$500", "$500–$1,000", "$1,000+"] },
      ]},
      { id: "H", title: "Tax Strategy", icon: "💡", questions: [
        { id: "tax_situation", label: "How do you feel about your current tax situation?", type: "select", options: ["I pay too much in taxes every year", "I break even — nothing owed, nothing returned", "I get a refund — but don't know if that's good or bad", "I have a tax strategy in place", "I've never thought about it"] },
        { id: "income_sources", label: "How many income sources do you currently have?", type: "select", options: ["Just one — W-2 job", "Two — job + side income", "Multiple — business, investments, etc.", "Retired / fixed income"] },
        { id: "has_business", label: "Do you own a business or have any self-employed income?", type: "select", options: ["No", "Yes – sole proprietor / 1099", "Yes – LLC or S-Corp", "Thinking about starting one"] },
        { id: "knows_business_deductions", label: "Do you know the tax advantages of owning a business?", type: "select", options: ["Yes – I use them actively", "I've heard of them but don't use them", "No – I had no idea that was a thing", "Not applicable"] },
        { id: "tax_deferred_accounts", label: "Are you using tax-deferred or tax-free accounts to reduce your tax bill?", type: "select", options: ["Yes – maxing out 401k / IRA", "Yes – contributing but not maxing", "No – I don't have any", "Not sure if what I have qualifies"] },
        { id: "knows_iul_tax", label: "Do you know that a properly structured life insurance policy (IUL) can provide tax-FREE retirement income?", type: "select", options: ["Yes – I use or plan to use one", "I've heard of it but don't fully understand", "No – this is the first time I'm hearing this", "I'm skeptical"] },
        { id: "tax_refund_habit", label: "If you get a tax refund each year, what do you typically do with it?", type: "select", options: ["Spend it", "Save it in a bank account", "Pay off debt", "Invest it", "I usually owe taxes, not get a refund"] },
      ]},
      { id: "G", title: "Medicare & Social Security", icon: "🏛️", questions: [
        { id: "age_near_65", label: "Are you 60 years old or older?", type: "select", options: ["No – under 60", "Yes – age 60–64", "Yes – age 65–69", "Yes – age 70+"] },
        { id: "knows_medicare", label: "Do you know what Medicare is and how it works?", type: "select", options: ["Yes – I understand it well", "Somewhat – I've heard of it", "No – I don't know what it is", "I'm already on Medicare"] },
        { id: "medicare_parts", label: "Do you know the difference between Medicare Part A, B, C, and D?", type: "select", options: ["Yes – I know all parts", "I know Parts A & B only", "No – I don't know the parts", "Not applicable yet"] },
        { id: "medicare_supplement", label: "Do you have a Medicare Supplement (Medigap) or Medicare Advantage plan?", type: "select", options: ["Yes – Medigap/Supplement", "Yes – Medicare Advantage", "No – only Original Medicare", "Not on Medicare yet", "Not sure"] },
        { id: "medicare_monthly_payment", label: "Approximately how much do you pay per month for health/Medicare coverage?", type: "select", options: ["$0 – covered by employer or Medicaid", "Under $100/mo", "$100–$250/mo", "$250–$500/mo", "$500+/mo", "Not sure"] },
        { id: "medicare_medications", label: "Do you take regular prescription medications?", type: "select", options: ["No", "Yes – 1 or 2", "Yes – 3 or more", "Yes – specialty/high-cost medications"] },
        { id: "medicare_specialists", label: "Do you see any specialists regularly (cardiologist, eye doctor, etc.)?", type: "select", options: ["No", "Yes – 1 specialist", "Yes – 2 or more specialists"] },
        { id: "knows_ss", label: "Do you know what Social Security benefits you've earned so far?", type: "select", options: ["Yes – I check it regularly", "I've seen it once but don't track it", "No – I've never checked", "I don't know how to access it"] },
        { id: "ss_account", label: "Do you have an account at SSA.gov (Social Security Administration)?", type: "select", options: ["Yes – I have an account", "No – I don't have one", "I didn't know that was possible"] },
        { id: "ss_claiming_age", label: "Do you know the best age to claim Social Security to maximize your benefit?", type: "select", options: ["Yes – I have a strategy", "I know it depends on age but unsure of best timing", "No – I don't know how that works"] },
      ]},
      { id: "I", title: "Tax Prep 2025", icon: "📋", questions: [
        { id: "tax_filing_status", label: "What is your filing status for 2025?", type: "select", options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household", "Not sure"] },
        { id: "tax_income_type_2025", label: "What type(s) of income did you have in 2025?", type: "select", options: ["W-2 only", "1099 / Self-employed only", "W-2 + 1099", "W-2 + business income", "Retirement / pension income", "Multiple types"] },
        { id: "tax_overtime", label: "Did you work overtime in 2025?", type: "select", options: ["No", "Yes – occasionally", "Yes – regularly (significant amount)"] },
        { id: "tax_tips", label: "Did you receive tips or gratuities in 2025?", type: "select", options: ["No", "Yes – reported on my W-2", "Yes – but not sure if reported", "Yes – cash tips not reported"] },
        { id: "tax_children_born", label: "Were any children born or adopted in your household in 2025?", type: "select", options: ["No", "Yes – 1 child", "Yes – 2 or more children"] },
        { id: "tax_auto_loan_interest", label: "Did you pay auto loan interest in 2025?", type: "select", options: ["No", "Yes – I have the statement", "Yes – but I don't have the statement handy"] },
        { id: "tax_crypto", label: "Did you buy, sell, or receive cryptocurrency in 2025?", type: "select", options: ["No", "Yes – I received a 1099 from the broker", "Yes – but I didn't receive a 1099", "I'm not sure"] },
        { id: "tax_housing", label: "What is your current housing situation?", type: "select", options: ["Renting", "Own my home – with mortgage", "Own my home – paid off", "Living with family / no payment", "Other"] },
        { id: "tax_mortgage_interest", label: "Did you pay mortgage interest in 2025?", type: "select", options: ["No – I rent or paid off", "Yes – I have my 1098 form", "Yes – but I need to locate the form", "Not applicable"] },
        { id: "tax_beautiful_bill", label: "Are you aware of the 'Beautiful Bill' (2025 tax law changes) and how they may affect your return?", type: "select", options: ["Yes – I've read about it", "I've heard of it but don't know the details", "No – first time I'm hearing this", "I'd like my advisor to explain it"] },
        { id: "tax_notes", label: "Any other income, life changes, or tax situations we should know about for 2025?", type: "text", placeholder: "e.g. sold a home, inherited money, started a business, got married..." },
      ]},
    ],
    scoreLabels: { "Life & Family Protection": "Life & Family Protection", "Final Expense Coverage": "Final Expense Coverage", "Health & LTC": "Health & LTC", "Income Protection": "Income Protection", "Retirement Planning": "Retirement Planning", "Emergency Fund": "Emergency Fund", "Savings Optimization": "Savings Optimization", "Estate Planning": "Estate Planning", "Medicare & Social Security": "Medicare & Social Security", "Tax Strategy": "Tax Strategy" },
    facts: [["70%+","of people 65+ will need long-term care"],["11%","only — have LTC coverage"],["$10–15K","average funeral & burial cost"],["$12K+","average monthly nursing home cost"],["47%","can't cover a $500 emergency"],["Rule of 72","At 8%, money doubles every 9 years"]],
  },
  es: {
    appTitle: "Asesor de Protección Financiera",
    appSubtitle: "Constructor de Estrategia Personalizada",
    moduleLabel: "Módulo",
    ofLabel: "de",
    nextBtn: "Siguiente Módulo →",
    generateBtn: "Generar Mi Plan →",
    backBtn: "← Atrás",
    reviewBtn: "← Revisar Respuestas",
    restartBtn: "Nueva Evaluación",
    selectPlaceholder: "— Selecciona una opción —",
    answerHonestly: "Responde con honestidad para obtener el plan más preciso",
    assessmentTitle: "Tu Evaluación de Protección Financiera",
    criticalTitle: "🚨 Crítico — Atender de Inmediato",
    importantTitle: "⚠️ Importante — Planificar en 90 días",
    opportunityTitle: "💡 Oportunidades — Haz que tu dinero trabaje más",
    insightsTitle: "🔎 Perspectivas Personalizadas",
    budgetTitle: "💵 Distribución de Presupuesto Recomendada",
    budgetSubtitle: "Basado en tu presupuesto seleccionado:",
    scoresTitle: "📊 Desglose de Puntuación de Protección",
    factsTitle: "📌 Datos Clave",
    ctaText: "¿Listo para el siguiente paso? Una sesión de estrategia gratuita no cuesta nada — pero no tener un plan puede costarlo todo.",
    disclaimer: "⚠️ Solo con fines educativos. No es asesoramiento financiero, legal ni fiscal. Consulta con un profesional financiero licenciado.",
    criticalBadge: "CRÍTICO", importantBadge: "IMPORTANTE", opportunityBadge: "OPORTUNIDAD", tipBadge: "CONSEJO",
    wellProtected: "Bien Protegido/a", partiallyProtected: "Parcialmente Protegido/a", significantGaps: "Brechas Significativas Detectadas",
    critical: "Crítico", important: "Importante", opportunity: "Oportunidad",
    perMonth: "/mes", switchLang: "🌐 EN",
    modules: [
      { id: "A", title: "Perfil Familiar", icon: "👨‍👩‍👧‍👦", questions: [
        { id: "age", label: "¿Cuál es tu edad?", type: "number", placeholder: "ej. 35" },
        { id: "marital", label: "¿Estado civil?", type: "select", options: ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"] },
        { id: "dependents", label: "¿Tienes hijos o dependientes?", type: "select", options: ["No", "Sí – 1", "Sí – 2", "Sí – 3+"] },
        { id: "dependent_ages", label: "¿Edades de tus hijos/dependientes?", type: "text", placeholder: "ej. 3, 7, 12  |  N/A si no aplica" },
        { id: "young_children", label: "¿Tienes hijos menores de 18 años?", type: "select", options: ["No", "Sí – menores de 5 años", "Sí – entre 5 y 12 años", "Sí – entre 13 y 17 años", "Sí – varios grupos de edad"] },
        { id: "economic_dependent", label: "¿Alguien depende económicamente de tu ingreso?", type: "select", options: ["No", "Sí – Esposo/a o pareja", "Sí – Hijos", "Sí – Padres", "Varios"] },
        { id: "medical_condition", label: "¿Algún miembro del hogar tiene una condición médica relevante?", type: "select", options: ["No", "Sí – yo mismo/a", "Sí – esposo/a o pareja", "Sí – un dependiente"] },
      ]},
      { id: "B", title: "Ingresos y Estabilidad", icon: "💼", questions: [
        { id: "income_type", label: "¿Cuál es tu tipo de ingreso?", type: "select", options: ["Sin empleo / Sin trabajo", "Empleado W-2", "Trabajador Independiente", "Dueño de Negocio", "Mixto"] },
        { id: "gross_monthly", label: "¿Ingreso mensual bruto?", type: "number", placeholder: "ej. 6000" },
        { id: "net_monthly", label: "¿Ingreso mensual neto (lo que recibes)?", type: "number", placeholder: "ej. 4500" },
        { id: "income_dependent_on_health", label: "¿Tu ingreso depende de tu salud o de trabajar activamente?", type: "select", options: ["Sí – completamente", "En su mayoría sí", "Parcialmente", "No – tengo ingresos pasivos"] },
        { id: "passive_income", label: "¿Tienes fuentes de ingresos pasivos?", type: "select", options: ["No", "Sí – rentas", "Sí – inversiones", "Sí – negocio", "Múltiples fuentes"] },
      ]},
      { id: "C", title: "Flujo de Efectivo y Ahorros", icon: "💰", questions: [
        { id: "monthly_expenses", label: "¿Total de gastos mensuales (aproximado)?", type: "number", placeholder: "ej. 3800" },
        { id: "positive_cashflow", label: "¿Tienes flujo positivo mensual después de gastos?", type: "select", options: ["Sí – $500+", "Sí – menos de $500", "Equilibrado", "Negativo / déficit"] },
        { id: "emergency_fund", label: "¿Tienes un fondo de emergencia?", type: "select", options: ["No", "Sí – menos de 1 mes", "Sí – 1 a 3 meses", "Sí – 3 a 6 meses", "Sí – 6+ meses"] },
        { id: "savings_habit", label: "¿Estás ahorrando mensualmente?", type: "select", options: ["No", "Sí – menos de $200", "Sí – $200 a $500", "Sí – $500+"] },
        { id: "bank_cd_savings", label: "¿Tienes dinero en CDs o cuentas de ahorro bancarias?", type: "select", options: ["No", "Sí – menos de $10,000", "Sí – $10,000 a $50,000", "Sí – $50,000 a $100,000", "Sí – más de $100,000"] },
        { id: "cd_rate_awareness", label: "Si es así, ¿qué tasa de interés te están pagando?", type: "select", options: ["No aplica", "Menos del 2%", "Alrededor del 2–3%", "Alrededor del 3–4%", "Más del 4%", "No lo sé"] },
      ]},
      { id: "D", title: "Deudas", icon: "📊", questions: [
        { id: "mortgage", label: "¿Tienes hipoteca?", type: "select", options: ["No", "Sí – menos de $1,500/mes", "Sí – $1,500 a $2,500/mes", "Sí – $2,500+/mes"] },
        { id: "auto_loan", label: "¿Tienes préstamos de auto?", type: "select", options: ["No", "Sí – menos de $500/mes", "Sí – $500+/mes"] },
        { id: "credit_cards", label: "¿Tienes deudas en tarjetas de crédito?", type: "select", options: ["No", "Sí – menos de $5,000", "Sí – $5,000 a $20,000", "Sí – $20,000+"] },
        { id: "personal_loans", label: "¿Préstamos personales u otras deudas?", type: "select", options: ["No", "Sí – manejable", "Sí – interés alto (20%+)"] },
        { id: "total_debt_payments", label: "¿Total de pagos mensuales de deudas?", type: "number", placeholder: "ej. 1200" },
      ]},
      { id: "E", title: "Protección Actual", icon: "🛡️", questions: [
        { id: "life_insurance", label: "¿Tienes seguro de vida?", type: "select", options: ["No", "Temporal – del empleador", "Temporal – privado", "Permanente / Vida entera", "No estoy seguro/a"] },
        { id: "life_coverage_amount", label: "¿Monto aproximado de cobertura de vida?", type: "select", options: ["No aplica", "Menos de $100K", "$100K–$300K", "$300K–$500K", "$500K–$1M", "Más de $1M"] },
        { id: "final_expense_coverage", label: "¿Tienes cobertura para gastos finales (funeral, entierro)?", type: "select", options: ["No", "Sí – incluido en mi póliza de vida", "Sí – póliza separada de gastos finales", "Tengo ahorros reservados para eso", "No estoy seguro/a"] },
        { id: "health_insurance", label: "¿Seguro médico?", type: "select", options: ["No", "Plan del empleador", "Privado / Mercado", "Medicare", "Medicaid"] },
        { id: "ltc", label: "¿Tienes cobertura de Cuidado a Largo Plazo (LTC)?", type: "select", options: ["No", "Sí – póliza independiente", "Sí – beneficios combinados / híbrido", "Sí – rider en póliza de vida", "No estoy seguro/a"] },
        { id: "disability", label: "¿Tienes cobertura por discapacidad?", type: "select", options: ["No", "Sí – corto plazo del empleador", "Sí – discapacidad a largo plazo", "No estoy seguro/a"] },
        { id: "will", label: "¿Tienes un testamento (Will)?", type: "select", options: ["No", "En proceso", "Sí – actualizado", "Sí – necesita actualización"] },
        { id: "trust", label: "¿Tienes un Trust o Poder Notarial (POA)?", type: "select", options: ["No", "Solo Poder Notarial", "Solo Trust", "Ambos"] },
      ]},
      { id: "F", title: "Retiro y Futuro", icon: "🏔️", questions: [
        { id: "retirement_accounts", label: "¿Tienes cuentas de retiro?", type: "select", options: ["No", "401(k) / 403(b)", "IRA / Roth IRA", "TSP / 457", "Múltiples"] },
        { id: "retirement_savings_total", label: "¿Total aproximado de ahorros para el retiro?", type: "select", options: ["$0 – nada ahorrado", "Menos de $25,000", "$25K–$100K", "$100K–$300K", "$300K–$500K", "$500K+"] },
        { id: "rollover_experience", label: "¿Alguna vez has hecho un rollover de 401k?", type: "select", options: ["No", "Sí", "No sé qué es eso"] },
        { id: "retirement_age_goal", label: "¿Cuándo te gustaría retirarte?", type: "select", options: ["En 5 años o menos", "En 5–10 años", "En 10–20 años", "En 20+ años", "No estoy seguro/a"] },
        { id: "retirement_priority", label: "¿Tu prioridad #1 para el retiro?", type: "select", options: ["Seguridad y Garantías", "Máximo Crecimiento", "Eficiencia Fiscal", "Equilibrio de los tres"] },
        { id: "college_savings", label: "¿Estás ahorrando para la educación universitaria de tus hijos?", type: "select", options: ["Sin hijos / no aplica", "No – aún no ahorro", "Sí – plan 529", "Sí – otros ahorros", "Buscando mejores opciones"] },
        { id: "monthly_budget", label: "¿Presupuesto mensual para protección financiera y ahorros?", type: "select", options: ["Menos de $100", "$100–$250", "$250–$500", "$500–$1,000", "$1,000+"] },
      ]},
      { id: "G", title: "Medicare y Seguro Social", icon: "🏛️", questions: [
        { id: "age_near_65", label: "¿Tienes 60 años o más?", type: "select", options: ["No – menos de 60", "Sí – entre 60 y 64 años", "Sí – entre 65 y 69 años", "Sí – 70 años o más"] },
        { id: "knows_medicare", label: "¿Sabes qué es Medicare y cómo funciona?", type: "select", options: ["Sí – lo entiendo bien", "Un poco – he escuchado de ello", "No – no sé qué es", "Ya estoy en Medicare"] },
        { id: "medicare_parts", label: "¿Conoces la diferencia entre Medicare Parte A, B, C y D?", type: "select", options: ["Sí – conozco todas las partes", "Solo conozco las Partes A y B", "No – no conozco las partes", "Aún no aplica para mí"] },
        { id: "medicare_supplement", label: "¿Tienes un Medicare Supplement (Medigap) o Medicare Advantage?", type: "select", options: ["Sí – Medigap/Suplemento", "Sí – Medicare Advantage", "No – solo Medicare Original", "Aún no estoy en Medicare", "No estoy seguro/a"] },
        { id: "medicare_monthly_payment", label: "¿Aproximadamente cuánto pagas al mes por tu cobertura de salud/Medicare?", type: "select", options: ["$0 – cubierto por empleador o Medicaid", "Menos de $100/mes", "$100–$250/mes", "$250–$500/mes", "$500+/mes", "No sé"] },
        { id: "medicare_medications", label: "¿Tomas medicamentos recetados regularmente?", type: "select", options: ["No", "Sí – 1 o 2", "Sí – 3 o más", "Sí – medicamentos especializados/costosos"] },
        { id: "medicare_specialists", label: "¿Ves especialistas regularmente (cardiólogo, oculista, etc.)?", type: "select", options: ["No", "Sí – 1 especialista", "Sí – 2 o más especialistas"] },
        { id: "knows_ss", label: "¿Sabes cuánto has acumulado en beneficios del Seguro Social?", type: "select", options: ["Sí – lo reviso regularmente", "Lo vi una vez pero no lo sigo", "No – nunca lo he revisado", "No sé cómo acceder a esa información"] },
        { id: "ss_account", label: "¿Tienes una cuenta en SSA.gov (Administración del Seguro Social)?", type: "select", options: ["Sí – tengo una cuenta", "No – no tengo cuenta", "No sabía que eso era posible"] },
        { id: "ss_claiming_age", label: "¿Sabes a qué edad conviene reclamar el Seguro Social para maximizar tu beneficio?", type: "select", options: ["Sí – tengo una estrategia", "Sé que depende de la edad pero no sé el mejor momento", "No – no sé cómo funciona eso"] },
      ]},
      { id: "H", title: "Estrategia Fiscal", icon: "💡", questions: [
        { id: "tax_situation", label: "¿Cómo te sientes con tu situación fiscal actual?", type: "select", options: ["Pago demasiado en impuestos cada año", "Quedo en cero — no debo ni me regresan", "Me regresan dinero — pero no sé si eso es bueno o malo", "Tengo una estrategia fiscal establecida", "Nunca lo he pensado"] },
        { id: "income_sources", label: "¿Cuántas fuentes de ingreso tienes actualmente?", type: "select", options: ["Sin empleo / Sin trabajo", "Solo una — empleo W-2", "Dos — trabajo + ingreso adicional", "Múltiples — negocio, inversiones, etc.", "Retirado / ingreso fijo"] },
        { id: "has_business", label: "¿Tienes un negocio o ingresos como trabajador independiente?", type: "select", options: ["No", "Sí – propietario único / 1099", "Sí – LLC o S-Corp", "Estoy pensando en empezar uno"] },
        { id: "knows_business_deductions", label: "¿Conoces las ventajas fiscales de tener un negocio?", type: "select", options: ["Sí – las uso activamente", "He escuchado de ellas pero no las uso", "No – no sabía que eso existía", "No aplica"] },
        { id: "tax_deferred_accounts", label: "¿Estás usando cuentas con ventajas fiscales para reducir tu carga impositiva?", type: "select", options: ["Sí – maximizando 401k / IRA", "Sí – contribuyo pero no al máximo", "No – no tengo ninguna", "No estoy seguro/a si lo que tengo aplica"] },
        { id: "knows_iul_tax", label: "¿Sabías que una póliza de vida bien estructurada (IUL) puede generar ingresos de retiro LIBRES de impuestos?", type: "select", options: ["Sí – lo uso o planeo usarlo", "He escuchado de ello pero no lo entiendo bien", "No – es la primera vez que escucho esto", "Soy escéptico/a"] },
        { id: "tax_refund_habit", label: "Si recibes un reembolso de impuestos cada año, ¿qué haces con él?", type: "select", options: ["Lo gasto", "Lo guardo en el banco", "Lo uso para pagar deudas", "Lo invierto", "Generalmente debo impuestos, no me regresan"] },
      ]},
      { id: "I", title: "Preparación de Taxes 2025", icon: "📋", questions: [
        { id: "tax_filing_status", label: "¿Cuál es tu estatus de declaración para 2025?", type: "select", options: ["Soltero/a (Single)", "Casado/a declarando juntos (MFJ)", "Casado/a declarando por separado (MFS)", "Jefe/a de familia (Head of Household)", "No estoy seguro/a"] },
        { id: "tax_income_type_2025", label: "¿Qué tipo(s) de ingreso tuviste en 2025?", type: "select", options: ["Solo W-2", "Solo 1099 / Trabajo independiente", "W-2 + 1099", "W-2 + ingresos de negocio", "Ingreso de retiro / pensión", "Varios tipos"] },
        { id: "tax_overtime", label: "¿Trabajaste overtime (horas extra) en 2025?", type: "select", options: ["No", "Sí – ocasionalmente", "Sí – regularmente (cantidad significativa)"] },
        { id: "tax_tips", label: "¿Recibiste propinas (tips) en 2025?", type: "select", options: ["No", "Sí – reportadas en mi W-2", "Sí – pero no sé si fueron reportadas", "Sí – propinas en efectivo no reportadas"] },
        { id: "tax_children_born", label: "¿Nació o fue adoptado algún hijo en tu hogar en 2025?", type: "select", options: ["No", "Sí – 1 hijo/a", "Sí – 2 o más"] },
        { id: "tax_auto_loan_interest", label: "¿Pagaste intereses de préstamo de auto en 2025?", type: "select", options: ["No", "Sí – tengo el estado de cuenta", "Sí – pero no tengo el estado de cuenta a la mano"] },
        { id: "tax_crypto", label: "¿Compraste, vendiste o recibiste criptomonedas en 2025?", type: "select", options: ["No", "Sí – recibí un 1099 del broker", "Sí – pero no recibí 1099", "No estoy seguro/a"] },
        { id: "tax_housing", label: "¿Cuál es tu situación de vivienda actual?", type: "select", options: ["Rento", "Tengo casa – con hipoteca", "Tengo casa – pagada", "Vivo con familia / sin pago", "Otra"] },
        { id: "tax_mortgage_interest", label: "¿Pagaste intereses de hipoteca en 2025?", type: "select", options: ["No – rento o casa pagada", "Sí – tengo mi forma 1098", "Sí – pero necesito localizar la forma", "No aplica"] },
        { id: "tax_beautiful_bill", label: "¿Estás al tanto del 'Beautiful Bill' (cambios en las leyes de taxes 2025)?", type: "select", options: ["Sí – lo he leído", "He escuchado de ello pero no conozco los detalles", "No – es la primera vez que lo escucho", "Me gustaría que mi asesor me lo explique"] },
        { id: "tax_notes", label: "¿Algún otro ingreso, cambio de vida o situación fiscal que debamos saber para 2025?", type: "text", placeholder: "ej. vendí una casa, herencia, empecé un negocio, me casé..." },
      ]},
    ],
    scoreLabels: { "Life & Family Protection": "Protección de Vida y Familia", "Final Expense Coverage": "Cobertura de Gastos Finales", "Health & LTC": "Salud y Cuidado a Largo Plazo", "Income Protection": "Protección de Ingresos", "Retirement Planning": "Planificación de Retiro", "Emergency Fund": "Fondo de Emergencia", "Savings Optimization": "Optimización de Ahorros", "Estate Planning": "Planificación Patrimonial", "Medicare & Social Security": "Medicare y Seguro Social", "Tax Strategy": "Estrategia Fiscal" },
    facts: [["70%+","de personas 65+ necesitarán cuidado a largo plazo"],["11%","solamente tiene cobertura LTC"],["$10–15K","costo promedio de funeral y entierro"],["$12K+","costo mensual promedio de hogar de ancianos"],["47%","no puede cubrir una emergencia de $500"],["Regla del 72","Al 8%, el dinero se duplica cada 9 años"]],
  },
};

// ─── PLAN GENERATOR ────────────────────────────────────────────────────────────
function generatePlan(answers, lang) {
  const t = T[lang];
  const age = parseInt(answers.age) || 35;
  const budget = answers.monthly_budget || (lang === "es" ? "$250–$500" : "$250–$500");
  const isOlderAdult = age >= 55;

  const no = (v) => !v || v.startsWith("No") || v === "No aplica" || v === "Not applicable";
  const yes = (v) => v && (v.startsWith("Yes") || v.startsWith("Sí") || v.startsWith("Si"));
  const unsure = (v) => v && (v.includes("sure") || v.includes("seguro"));

  const hasDependents = yes(answers.dependents);
  const hasYoungChildren = yes(answers.young_children);
  const hasLifeIns = !no(answers.life_insurance) && !unsure(answers.life_insurance);
  const hasFinalExpense = !no(answers.final_expense_coverage) && !unsure(answers.final_expense_coverage);
  const hasLTC = !no(answers.ltc) && !unsure(answers.ltc);
  const hasDisability = !no(answers.disability) && !unsure(answers.disability);
  const hasRetirement = !no(answers.retirement_accounts);
  const hasWill = yes(answers.will) && answers.will.includes("up to date") || answers.will === "Sí – actualizado";
  const hasEmergency = yes(answers.emergency_fund);
  const hasDebt = yes(answers.credit_cards);
  const incomeAtRisk = answers.income_dependent_on_health && (answers.income_dependent_on_health.startsWith("Yes") || answers.income_dependent_on_health.startsWith("Sí") || answers.income_dependent_on_health.startsWith("En su"));
  const hasBankSavings = yes(answers.bank_cd_savings);
  const lowCDRateValues = ["Under 2%", "Around 2–3%", "Around 3–4%", "I don't know", "Menos del 2%", "Alrededor del 2–3%", "Alrededor del 3–4%", "No lo sé"];
  const lowCDRate = lowCDRateValues.includes(answers.cd_rate_awareness);
  const needsCollege = hasYoungChildren && answers.college_savings && ["No – not saving yet", "Looking for better options", "No – aún no ahorro", "Buscando mejores opciones"].includes(answers.college_savings);
  const has529 = answers.college_savings && answers.college_savings.includes("529");

  // Tax strategy analysis
  const paysTooMuchTax = answers.tax_situation && (answers.tax_situation.includes("too much") || answers.tax_situation.includes("demasiado"));
  const onlyW2 = answers.income_sources && (answers.income_sources.includes("Just one") || answers.income_sources.includes("Solo una"));
  const hasBusiness = answers.has_business && !answers.has_business.startsWith("No");
  const thinkingBusiness = answers.has_business && (answers.has_business.includes("Thinking") || answers.has_business.includes("Estoy pensando"));
  const knowsDeductions = answers.knows_business_deductions && (answers.knows_business_deductions.includes("actively") || answers.knows_business_deductions.includes("activamente"));
  const usesTaxAccounts = answers.tax_deferred_accounts && (answers.tax_deferred_accounts.includes("maxing") || answers.tax_deferred_accounts.includes("maximizando") || answers.tax_deferred_accounts.includes("contributing") || answers.tax_deferred_accounts.includes("contribuyo"));
  const knowsIULTax = answers.knows_iul_tax && (answers.knows_iul_tax.includes("use") || answers.knows_iul_tax.includes("uso") || answers.knows_iul_tax.includes("plan"));
  const spendsRefund = answers.tax_refund_habit && (answers.tax_refund_habit.includes("Spend") || answers.tax_refund_habit.includes("Lo gasto"));
  const taxScore = (knowsDeductions ? 3 : 0) + (usesTaxAccounts ? 3 : 0) + (knowsIULTax ? 2 : 0) + (!paysTooMuchTax ? 2 : 0);

  // Medicare & SS awareness
  const knowsMedicare = answers.knows_medicare && (answers.knows_medicare.includes("well") || answers.knows_medicare.includes("bien") || answers.knows_medicare.includes("already") || answers.knows_medicare.includes("estoy en"));
  const knowsMedicareParts = answers.medicare_parts && (answers.medicare_parts.includes("all parts") || answers.medicare_parts.includes("todas"));
  const hasMedicarePlan = answers.medicare_supplement && (answers.medicare_supplement.includes("Medigap") || answers.medicare_supplement.includes("Advantage"));
  const knowsSS = answers.knows_ss && (answers.knows_ss.includes("regularly") || answers.knows_ss.includes("regularmente"));
  const hasSsAccount = answers.ss_account && (answers.ss_account.includes("Yes") || answers.ss_account.includes("Sí"));
  const knowsSsStrategy = answers.ss_claiming_age && (answers.ss_claiming_age.includes("strategy") || answers.ss_claiming_age.includes("estrategia"));
  const isNear65 = answers.age_near_65 && answers.age_near_65 !== "No – under 60" && answers.age_near_65 !== "No – menos de 60";
  const isOn65Plus = answers.age_near_65 && (answers.age_near_65.includes("65") || answers.age_near_65.includes("70"));

  // Medicare/SS education content
  const medicareEducation = lang === "en" ? {
    whatIsMedicare: {
      title: "📘 What Is Medicare?",
      body: "Medicare is the federal health insurance program for people 65 and older (or under 65 with certain disabilities). It's not free — it has premiums, deductibles, and gaps. Understanding it before you turn 65 is essential to avoid costly mistakes.",
      parts: [
        { part: "Part A", name: "Hospital Insurance", detail: "Covers inpatient hospital stays, skilled nursing facility care, hospice. Most people pay $0 premium if they worked 10+ years." },
        { part: "Part B", name: "Medical Insurance", detail: "Covers doctor visits, outpatient care, preventive services. Standard premium is ~$174.70/month in 2024." },
        { part: "Part C", name: "Medicare Advantage", detail: "Private plans that bundle A+B (often with dental, vision, drug coverage). May have lower premiums but limited networks." },
        { part: "Part D", name: "Prescription Drugs", detail: "Covers prescription drugs. Separate plan or bundled with Part C. Avoid the 'coverage gap' (donut hole)." },
      ],
      gap: "⚠️ Key Gap: Original Medicare (A+B) covers about 80% of costs. The other 20% + deductibles can add up to tens of thousands. A Medigap/Supplement plan covers those gaps.",
      action: "✅ Action: Enroll during your Initial Enrollment Period (3 months before turning 65 through 3 months after). Missing this window can mean permanent higher premiums.",
    },
    whatIsSS: {
      title: "📘 What Is Social Security & How Do You Access It?",
      body: "Social Security pays you a monthly income in retirement based on your 35 highest-earning years of work. The average benefit is ~$1,976/month — but the amount varies dramatically based on WHEN you claim.",
      claimingStrategy: [
        { age: "Age 62", result: "Earliest possible — but you get up to 30% LESS for life." },
        { age: "Full Retirement Age (66–67)", result: "You get 100% of your earned benefit." },
        { age: "Age 70", result: "Maximum benefit — grows 8% per year beyond full retirement age." },
      ],
      howToAccess: {
        title: "How to Create Your SSA.gov Account (Step by Step):",
        steps: [
          "Go to SSA.gov and click 'Sign In or Create an Account'",
          "Select 'Create a New Account' and verify your identity",
          "You'll need: Social Security Number, email address, and a U.S. mailing address",
          "Once logged in, click 'My Social Security' to view your earnings history and estimated benefits",
          "Review your statement yearly — errors in your record can reduce your benefit",
        ],
      },
    },
  } : {
    whatIsMedicare: {
      title: "📘 ¿Qué es Medicare?",
      body: "Medicare es el programa federal de seguro médico para personas de 65 años o más (o menores de 65 con ciertas discapacidades). No es gratuito — tiene primas, deducibles y brechas de cobertura. Entenderlo antes de cumplir 65 es esencial para evitar errores costosos.",
      parts: [
        { part: "Parte A", name: "Seguro Hospitalario", detail: "Cubre hospitalizaciones, cuidado en instalaciones de enfermería especializada, hospicio. La mayoría no paga prima si trabajó 10+ años." },
        { part: "Parte B", name: "Seguro Médico", detail: "Cubre visitas al médico, atención ambulatoria, servicios preventivos. Prima estándar ~$174.70/mes en 2024." },
        { part: "Parte C", name: "Medicare Advantage", detail: "Planes privados que combinan A+B (a menudo con dental, visión, medicamentos). Pueden tener primas más bajas pero redes limitadas." },
        { part: "Parte D", name: "Medicamentos Recetados", detail: "Cubre medicamentos con receta. Plan separado o incluido con la Parte C. Evita la 'brecha de cobertura' (donut hole)." },
      ],
      gap: "⚠️ Brecha Clave: Medicare Original (A+B) cubre aproximadamente el 80% de los costos. El otro 20% + deducibles puede sumar decenas de miles de dólares. Un plan Medigap/Suplemento cubre esas brechas.",
      action: "✅ Acción: Inscríbete durante tu Período de Inscripción Inicial (3 meses antes de cumplir 65 hasta 3 meses después). Perder esta ventana puede significar primas permanentemente más altas.",
    },
    whatIsSS: {
      title: "📘 ¿Qué es el Seguro Social y cómo accedes a él?",
      body: "El Seguro Social te paga un ingreso mensual en el retiro basado en tus 35 años de mayores ingresos. El beneficio promedio es ~$1,976/mes — pero el monto varía drásticamente según CUÁNDO lo reclames.",
      claimingStrategy: [
        { age: "A los 62 años", result: "Lo más temprano posible — pero recibes hasta un 30% MENOS de por vida." },
        { age: "Edad de Retiro Completo (66–67)", result: "Recibes el 100% de tu beneficio ganado." },
        { age: "A los 70 años", result: "Beneficio máximo — crece un 8% por año más allá de la edad de retiro completo." },
      ],
      howToAccess: {
        title: "Cómo crear tu cuenta en SSA.gov (paso a paso):",
        steps: [
          "Ve a SSA.gov y haz clic en 'Iniciar sesión o crear una cuenta'",
          "Selecciona 'Crear una nueva cuenta' y verifica tu identidad",
          "Necesitarás: Número de Seguro Social, dirección de correo electrónico y dirección postal en EE.UU.",
          "Una vez dentro, haz clic en 'Mi Seguro Social' para ver tu historial de ingresos y beneficios estimados",
          "Revisa tu estado de cuenta cada año — los errores en tu historial pueden reducir tu beneficio",
        ],
      },
    },
  };

  const scores = {
    "Life & Family Protection": hasLifeIns ? (hasDependents ? 6 : 8) : 2,
    "Final Expense Coverage": hasFinalExpense ? 9 : (isOlderAdult ? 1 : 4),
    "Health & LTC": hasLTC ? 8 : 2,
    "Income Protection": hasDisability ? 7 : (incomeAtRisk ? 1 : 5),
    "Retirement Planning": hasRetirement ? 7 : 2,
    "Emergency Fund": hasEmergency ? 8 : 2,
    "Savings Optimization": hasBankSavings && lowCDRate ? 2 : hasBankSavings ? 6 : 5,
    "Estate Planning": hasWill ? 7 : 1,
    "Tax Strategy": Math.min(10, taxScore + 1),
    ...(isNear65 ? { "Medicare & Social Security": (knowsMedicare && knowsSS && hasSsAccount) ? 8 : (knowsMedicare || knowsSS) ? 4 : 1 } : {}),
  };

  const cdRateDisplay = lang === "en"
    ? (answers.cd_rate_awareness === "I don't know" ? "an unknown rate (likely 2–3%)" : answers.cd_rate_awareness)
    : (answers.cd_rate_awareness === "No lo sé" ? "una tasa desconocida (probablemente 2–3%)" : answers.cd_rate_awareness);

  const gaps = lang === "en" ? [
    ...(!hasLifeIns && hasDependents ? [{ priority:1, area:"Life Insurance", reason:"You have dependents with no coverage — this is the #1 gap. Your family has no financial safety net if something happens to you.", tag:"CRITICAL" }] : []),
    ...(!hasLifeIns && !hasDependents ? [{ priority:2, area:"Life Insurance", reason:"No life coverage detected. Even without dependents, this protects your estate and covers end-of-life costs.", tag:"IMPORTANT" }] : []),
    ...(!hasFinalExpense ? [{ priority:isOlderAdult?1:2, area:"Final Expense Coverage", reason:"The average funeral today costs $10,000–$15,000. Without a plan, that burden falls on your family at their most vulnerable moment. A final expense whole life policy starts as low as $30–$60/month — no medical exam required in most cases, locked-in rates, guaranteed payout.", tag:isOlderAdult?"CRITICAL":"IMPORTANT" }] : []),
    ...(!hasLTC ? [{ priority:2, area:"Long-Term Care (LTC)", reason:"70%+ of people over 65 will need long-term care. Only 11% have coverage. Nursing homes average $11,695–$15,178/month. Act early — premiums rise every year you wait.", tag:"IMPORTANT" }] : []),
    ...(!hasDisability && incomeAtRisk ? [{ priority:1, area:"Disability / Income Protection", reason:"Your income depends directly on your ability to work. If illness or injury sidelines you, what's the plan? Your income is your most valuable — and most exposed — asset.", tag:"CRITICAL" }] : []),
    ...(!hasEmergency ? [{ priority:1, area:"Emergency Fund", reason:"47% of Americans can't cover a $500 emergency. Without a liquid cushion, any surprise expense forces you into debt. This is your first line of financial defense.", tag:"CRITICAL" }] : []),
    ...(hasBankSavings && lowCDRate ? [{ priority:2, area:"💡 Savings Optimization — CD / Bank Money", reason:`You have money earning ${cdRateDisplay}. A Fixed Indexed Annuity typically offers 4–7%+ with ZERO market risk, NO fees, and TAX-DEFERRED compounding. Same safety — significantly better returns.`, tag:"OPPORTUNITY" }] : []),
    ...(needsCollege ? [{ priority:2, area:"💡 Children's Future — College & Wealth Building", reason:"You have young children but no college savings strategy. A 529 plan offers tax-free growth for education. An IUL policy for your child is even more powerful — tax-free growth, living benefits, guaranteed insurability for life, cash value usable for college, a first home, or retirement.", tag:"OPPORTUNITY" }] : []),
    ...(has529 ? [{ priority:3, area:"💡 Upgrade Your 529 — Add a Child IUL", reason:"Great that you have a 529! A child IUL isn't limited to education, builds growing cash value, includes life insurance protection, and serves as a lifetime wealth asset. Many families use both: 529 for tuition, IUL for everything else.", tag:"TIP" }] : []),
    ...(hasDebt ? [{ priority:2, area:"Debt Strategy", reason:"High-interest debt (often 20–29% APR) erodes wealth faster than investments can build it. A structured elimination plan should run alongside your protection strategy.", tag:"IMPORTANT" }] : []),
    ...(!hasRetirement ? [{ priority:3, area:"Retirement Savings", reason:"At 8% return, $10,000 today becomes $159,000 in 36 years. Every year of delay has a real, compounding cost you can never recover.", tag:"IMPORTANT" }] : []),
    ...(!hasWill ? [{ priority:3, area:"Estate Planning", reason:"Without a will or trust, the state decides what happens to your assets and who raises your children. Your legacy deserves a plan.", tag:"IMPORTANT" }] : []),
    ...(isNear65 && !knowsMedicare ? [{ priority:1, area:"Medicare Education — You're Close to 65!", reason:"You're approaching Medicare age and don't yet understand how it works. Choosing the wrong plan or missing enrollment windows can cost thousands per year — permanently.", tag:"CRITICAL" }] : []),
    ...(isOn65Plus && !hasMedicarePlan ? [{ priority:1, area:"Medicare Gap Coverage", reason:"You're on Medicare but may lack a Supplement or Advantage plan. Original Medicare only covers ~80% of costs — the remaining 20% has no cap. A Medigap or Medicare Advantage plan plugs this gap.", tag:"CRITICAL" }] : []),
    ...(!knowsSS && isNear65 ? [{ priority:2, area:"Social Security Strategy", reason:"You don't know your Social Security benefit amount. Every year you delay claiming past full retirement age earns 8% more — for life. You need a personalized strategy.", tag:"IMPORTANT" }] : []),
    ...(!hasSsAccount ? [{ priority:2, area:"Create Your SSA.gov Account", reason:"You don't have a Social Security account online. It's free, takes 10 minutes, and shows your full earnings history and estimated retirement benefit.", tag:"IMPORTANT" }] : []),
    ...(paysTooMuchTax && onlyW2 ? [{ priority:2, area:"💡 Tax Strategy — You're Overpaying", reason:"If you only have W-2 income and pay too much in taxes, you're working with one hand tied behind your back. Adding even a part-time business opens up hundreds of deductions: home office, car, phone, education, equipment, retirement contributions. The tax code rewards business owners — not employees.", tag:"OPPORTUNITY" }] : []),
    ...(onlyW2 && !hasBusiness ? [{ priority:2, area:"💡 Start a Side Business — Change Your Tax Category", reason:"W-2 employees are the most taxed category in America. Business owners and investors pay less — legally. A side business lets you deduct expenses, build equity, and create a second income stream. You don't need to quit your job. You need a strategy.", tag:"OPPORTUNITY" }] : []),
    ...(!usesTaxAccounts ? [{ priority:2, area:"Tax-Advantaged Accounts — You're Leaving Money on the Table", reason:"You're not fully using tax-deferred or tax-free accounts. A 401k reduces your taxable income now. A Roth IRA grows tax-free forever. An IUL gives you tax-free retirement income with no contribution limits and no RMDs.", tag:"IMPORTANT" }] : []),
    ...(!knowsIULTax ? [{ priority:3, area:"💡 IUL — The Tax-Free Retirement Tool Most People Never Hear About", reason:"A properly structured IUL grows tax-free, lets you withdraw tax-free in retirement, has no IRS contribution limits, no RMDs, and includes life insurance + living benefits. It's not sold at banks. But it's one of the most powerful tax-free tools available.", tag:"TIP" }] : []),
    ...(spendsRefund ? [{ priority:3, area:"💡 Your Tax Refund Is a Missed Opportunity", reason:"Spending your tax refund is the most common financial mistake in America. That $1,500–$5,000 put into an indexed account for 20 years at 8% becomes $7,000–$23,000+. Redirect it — one decision, compounding results.", tag:"TIP" }] : []),
  ] : [
    ...(!hasLifeIns && hasDependents ? [{ priority:1, area:"Seguro de Vida", reason:"Tienes dependientes sin cobertura — esta es la brecha #1. Tu familia no tiene red de seguridad financiera si algo te pasa.", tag:"CRÍTICO" }] : []),
    ...(!hasLifeIns && !hasDependents ? [{ priority:2, area:"Seguro de Vida", reason:"Sin cobertura de vida detectada. Incluso sin dependientes, esto protege tu patrimonio y cubre costos de fin de vida.", tag:"IMPORTANTE" }] : []),
    ...(!hasFinalExpense ? [{ priority:isOlderAdult?1:2, area:"Cobertura de Gastos Finales", reason:"Un funeral hoy cuesta en promedio $10,000–$15,000. Sin un plan, esa carga cae sobre tu familia en su momento más vulnerable. Una póliza de gastos finales empieza desde $30–$60/mes — sin examen médico en la mayoría de los casos, tasa garantizada de por vida.", tag:isOlderAdult?"CRÍTICO":"IMPORTANTE" }] : []),
    ...(!hasLTC ? [{ priority:2, area:"Cuidado a Largo Plazo (LTC)", reason:"Más del 70% de las personas mayores de 65 necesitarán cuidado a largo plazo. Solo el 11% tiene cobertura. Los hogares de ancianos cuestan $11,695–$15,178/mes. Actúa pronto — las primas suben cada año que esperas.", tag:"IMPORTANTE" }] : []),
    ...(!hasDisability && incomeAtRisk ? [{ priority:1, area:"Protección por Discapacidad / Ingresos", reason:"Tu ingreso depende directamente de tu capacidad de trabajar. Si una enfermedad o lesión te detiene, ¿cuál es el plan? Tu ingreso es tu activo más valioso — y más expuesto.", tag:"CRÍTICO" }] : []),
    ...(!hasEmergency ? [{ priority:1, area:"Fondo de Emergencia", reason:"El 47% no puede cubrir una emergencia de $500. Sin un colchón líquido, cualquier gasto inesperado te empuja a la deuda. Esta es tu primera línea de defensa financiera.", tag:"CRÍTICO" }] : []),
    ...(hasBankSavings && lowCDRate ? [{ priority:2, area:"💡 Optimización de Ahorros — Dinero en Banco / CD", reason:`Tienes dinero ganando ${cdRateDisplay}. Una Anualidad Indexada Fija típicamente ofrece 4–7%+ con CERO riesgo de mercado, SIN comisiones y capitalización DIFERIDA de impuestos. Misma seguridad — resultados significativamente mejores.`, tag:"OPORTUNIDAD" }] : []),
    ...(needsCollege ? [{ priority:2, area:"💡 Futuro de tus Hijos — Universidad y Patrimonio", reason:"Tienes hijos pequeños pero sin estrategia de ahorro para la universidad. Un plan 529 ofrece crecimiento libre de impuestos para educación. Un IUL para tu hijo es aún más poderoso — crecimiento libre de impuestos, beneficios en vida, asegurabilidad garantizada de por vida.", tag:"OPORTUNIDAD" }] : []),
    ...(has529 ? [{ priority:3, area:"💡 Mejora tu 529 — Agrega un IUL para tu Hijo", reason:"¡Excelente que tienes un 529! Un IUL para tu hijo no está limitado a educación, acumula valor en efectivo creciente, incluye seguro de vida y sirve como activo de construcción de riqueza de por vida.", tag:"CONSEJO" }] : []),
    ...(hasDebt ? [{ priority:2, area:"Estrategia de Deudas", reason:"La deuda de tarjetas con alto interés (a menudo 20–29% APR) erosiona el patrimonio más rápido de lo que las inversiones pueden construirlo. Un plan estructurado de eliminación de deudas debe correr junto a tu estrategia de protección.", tag:"IMPORTANTE" }] : []),
    ...(!hasRetirement ? [{ priority:3, area:"Ahorro para el Retiro", reason:"Al 8% de retorno, $10,000 hoy se convierten en $159,000 en 36 años. Cada año de retraso tiene un costo real y acumulado que nunca puedes recuperar.", tag:"IMPORTANTE" }] : []),
    ...(!hasWill ? [{ priority:3, area:"Planificación Patrimonial", reason:"Sin un testamento o trust, el estado decide qué pasa con tus bienes y quién cría a tus hijos. Tu legado merece un plan.", tag:"IMPORTANTE" }] : []),
    ...(isNear65 && !knowsMedicare ? [{ priority:1, area:"Educación sobre Medicare — ¡Te acercas a los 65!", reason:"Te acercas a la edad de Medicare y aún no entiendes cómo funciona. Elegir el plan equivocado o perder los períodos de inscripción puede costarte miles de dólares al año de forma permanente.", tag:"CRÍTICO" }] : []),
    ...(isOn65Plus && !hasMedicarePlan ? [{ priority:1, area:"Cobertura de Brecha de Medicare", reason:"Estás en Medicare pero puede que no tengas un plan Suplemento o Advantage. Medicare Original solo cubre ~80% de los costos — el 20% restante no tiene límite máximo.", tag:"CRÍTICO" }] : []),
    ...(!knowsSS && isNear65 ? [{ priority:2, area:"Estrategia del Seguro Social", reason:"No conoces el monto de tu beneficio del Seguro Social. Cada año que retrases el reclamo más allá de la edad de retiro completo ganas un 8% más — de por vida. Necesitas una estrategia personalizada.", tag:"IMPORTANTE" }] : []),
    ...(!hasSsAccount ? [{ priority:2, area:"Crea tu Cuenta en SSA.gov", reason:"No tienes una cuenta del Seguro Social en línea. Es gratuita, toma 10 minutos y te permite ver tu historial completo de ingresos y tu beneficio estimado de retiro.", tag:"IMPORTANTE" }] : []),
    ...(paysTooMuchTax && onlyW2 ? [{ priority:2, area:"💡 Estrategia Fiscal — Estás Pagando de Más", reason:"Si solo tienes ingreso W-2 y pagas demasiado en impuestos, estás trabajando con una mano atada. Añadir aunque sea un negocio a tiempo parcial abre cientos de deducciones: oficina en casa, auto, teléfono, educación, equipo, contribuciones al retiro. El código fiscal premia a los dueños de negocios — no a los empleados.", tag:"OPORTUNIDAD" }] : []),
    ...(onlyW2 && !hasBusiness ? [{ priority:2, area:"💡 Empieza un Negocio — Cambia tu Categoría Fiscal", reason:"Los empleados W-2 son la categoría con más impuestos en Estados Unidos. Los dueños de negocios e inversores pagan menos — legalmente. Un negocio secundario te permite deducir gastos, construir patrimonio y crear una segunda fuente de ingreso.", tag:"OPORTUNIDAD" }] : []),
    ...(!usesTaxAccounts ? [{ priority:2, area:"Cuentas con Ventajas Fiscales — Estás Dejando Dinero en la Mesa", reason:"No estás aprovechando al máximo las cuentas con ventajas fiscales. Un 401k reduce tu ingreso gravable ahora. Un Roth IRA crece libre de impuestos para siempre. Un IUL te da ingresos de retiro libres de impuestos sin límites de contribución ni RMDs.", tag:"IMPORTANTE" }] : []),
    ...(!knowsIULTax ? [{ priority:3, area:"💡 IUL — La Herramienta Libre de Impuestos que la Mayoría Nunca Escucha", reason:"Una póliza IUL bien estructurada hace crecer tu dinero libre de impuestos, te permite retirar libre de impuestos en el retiro, no tiene límites de contribución del IRS, no tiene RMDs e incluye seguro de vida + beneficios en vida.", tag:"CONSEJO" }] : []),
    ...(spendsRefund ? [{ priority:3, area:"💡 Tu Reembolso de Impuestos es una Oportunidad Perdida", reason:"Gastar tu reembolso de impuestos es el error financiero más común. Esos $1,500–$5,000 invertidos en una cuenta indexada durante 20 años al 8% se convierten en $7,000–$23,000+. Redirígelo — una decisión, resultados que se multiplican.", tag:"CONSEJO" }] : []),
  ];

  gaps.sort((a, b) => a.priority - b.priority);

  const insights = lang === "en" ? [
    ...(hasBankSavings && lowCDRate ? [{ icon:"🏦", title:"Your Bank/CD Money Is Losing Ground to Inflation", body:`With money earning ${cdRateDisplay}, inflation (averaging 3–4%/year) may be eroding your real purchasing power. A Fixed Annuity offers rates typically 1.5–3x higher than CDs, with no market risk and tax-deferred compounding. This is a repositioning move — same safety, significantly better outcome.` }] : []),
    ...(hasYoungChildren ? [{ icon:"🎓", title:"The Best Time to Plan for Your Child's Future Is NOW", body:"A child insured at age 3–5 locks in the lowest possible premiums for life — guaranteed. An IUL started today for a 5-year-old could accumulate $150K–$400K+ in tax-free cash value by age 25, usable for college, a first home, or retirement. This is one of the highest-ROI moves a parent can make." }] : []),
    ...(!hasFinalExpense && isOlderAdult ? [{ icon:"🕊️", title:"Final Expenses: The Gift of Not Burdening Your Family", body:"Funerals average $10,000–$15,000. Many families are blindsided and end up taking out loans during their time of grief. A final expense whole life policy locks in coverage now, builds guaranteed cash value, and gives your loved ones a check — not a bill." }] : []),
  ] : [
    ...(hasBankSavings && lowCDRate ? [{ icon:"🏦", title:"Tu Dinero en el Banco Está Perdiendo Valor Real", body:`Con dinero ganando ${cdRateDisplay}, la inflación (promedio 3–4% anual) puede estar erosionando tu poder real de compra. Una Anualidad Fija ofrece tasas típicamente 1.5–3 veces más altas que los CDs, sin riesgo de mercado y con capitalización diferida de impuestos. Es un movimiento de reposicionamiento — misma seguridad, mucho mejor resultado.` }] : []),
    ...(hasYoungChildren ? [{ icon:"🎓", title:"El Mejor Momento para el Futuro de tu Hijo es AHORA", body:"Un niño asegurado a los 3–5 años bloquea las primas más bajas posibles de por vida. Un IUL iniciado hoy para un niño de 5 años podría acumular $150K–$400K+ en valor en efectivo libre de impuestos a los 25 años, utilizable para universidad, primera casa o retiro. Es uno de los movimientos de mayor ROI que un padre puede hacer." }] : []),
    ...(!hasFinalExpense && isOlderAdult ? [{ icon:"🕊️", title:"Gastos Finales: El Regalo de No Cargar a tu Familia", body:"Los funerales cuestan en promedio $10,000–$15,000. Muchas familias sacan préstamos durante su duelo. Una póliza de gastos finales bloquea tu cobertura ahora, acumula valor en efectivo garantizado y les da a tus seres queridos un cheque — no una factura." }] : []),
  ];

  const plans = {
    en: {
      "Under $100": [
        { item:"Term Life / Final Expense (starter)", amount:"$30–$60", note:"Protection first — even a small policy is a foundation" },
        { item:"Emergency Fund (auto-transfer)", amount:"$30–$50", note:"Build the habit — target $1,000 as your first milestone" },
      ],
      "$100–$250": [
        { item:"Life Insurance with Living Benefits", amount:"$70–$100", note:"Term or permanent — prioritize living benefits riders" },
        { item:"Final Expense Whole Life Policy", amount:"$30–$50", note:"Locks in your rate now; no medical exam in most cases" },
        { item:"Emergency / Short-Term Savings", amount:"$50–$80", note:"Target 3–6 months of expenses over time" },
      ],
      "$250–$500": [
        { item:"Life Insurance + LTC Rider", amount:"$120–$150", note:"One policy: death benefit + long-term care + living benefits" },
        { item:"Final Expense Whole Life Policy", amount:"$30–$50", note:"Guaranteed issue options; builds cash value from day 1" },
        { item:"Emergency / Tax-Advantaged Savings", amount:"$60–$80", note:"Roth IRA, HSA, or indexed savings" },
        { item:"Fixed Annuity (reposition CD/bank money)", amount:"Lump sum — no monthly cost", note:"4–7% guaranteed vs 2–3% at bank — same safety, better return" },
        { item:"Retirement Contribution", amount:"$50–$80", note:"Capture 401k match first, then Roth IRA" },
      ],
      "$500–$1,000": [
        { item:"Life + LTC Hybrid Policy", amount:"$180–$250", note:"Permanent — guaranteed premiums, return of premium option" },
        { item:"Final Expense / Legacy Whole Life", amount:"$50–$80", note:"Locks in rates; guaranteed cash value growth" },
        { item:"Retirement (Fixed Indexed Annuity or IUL)", amount:"$150–$200", note:"Tax-deferred indexed growth with a downside floor" },
        { item:"Emergency + Liquid Savings", amount:"$80–$100", note:"Build a 6-month cushion" },
        { item:"Disability Income Protection", amount:"$70–$100", note:"Protect your income — your #1 financial asset" },
        { item:"Child IUL or 529", amount:"$50–$80", note:"Tax-free education + lifetime wealth tool — start early" },
      ],
      "$1,000+": [
        { item:"Life + LTC Hybrid (max coverage)", amount:"$300–$400", note:"Permanent — full living benefits suite, legacy protection" },
        { item:"Final Expense / Legacy Coverage", amount:"$50–$100", note:"Guaranteed generational protection locked in now" },
        { item:"Indexed Retirement (IUL or FIA)", amount:"$250–$350", note:"Tax-free or tax-deferred; market-linked growth with floor" },
        { item:"Child IUL Policy", amount:"$100–$150", note:"Best financial gift a parent can give — starts compounding now" },
        { item:"Fixed Annuity (CD/bank reallocation)", amount:"Lump sum", note:"Move idle savings to earn 2–3x more" },
        { item:"Estate Planning (Trust + Will + POA)", amount:"$100–$150", note:"Full legal protection for your assets and legacy" },
      ],
    },
    es: {
      "Menos de $100": [
        { item:"Vida Temporal / Gastos Finales (básico)", amount:"$30–$60", note:"Protección primero — incluso una póliza pequeña es una base" },
        { item:"Fondo de Emergencia (transferencia automática)", amount:"$30–$50", note:"Construye el hábito — meta inicial: $1,000" },
      ],
      "$100–$250": [
        { item:"Seguro de Vida con Beneficios en Vida", amount:"$70–$100", note:"Temporal o permanente — prioriza riders de beneficios en vida" },
        { item:"Póliza de Gastos Finales Vida Entera", amount:"$30–$50", note:"Bloquea tu tasa ahora; sin examen médico en la mayoría de casos" },
        { item:"Fondo de Emergencia / Ahorro Corto Plazo", amount:"$50–$80", note:"Meta: 3–6 meses de gastos con el tiempo" },
      ],
      "$250–$500": [
        { item:"Vida con Beneficios en Vida + Rider LTC", amount:"$120–$150", note:"Una póliza: muerte + cuidado a largo plazo + beneficios en vida" },
        { item:"Póliza de Gastos Finales Vida Entera", amount:"$30–$50", note:"Emisión garantizada; acumula valor en efectivo desde el día 1" },
        { item:"Ahorro de Emergencia / Con Ventajas Fiscales", amount:"$60–$80", note:"Roth IRA, HSA o ahorro indexado" },
        { item:"Anualidad Fija (reubicar dinero de banco/CD)", amount:"Suma global — sin costo mensual", note:"4–7% garantizado vs 2–3% en banco — misma seguridad, mejor resultado" },
        { item:"Contribución al Retiro", amount:"$50–$80", note:"Captura el match del 401k primero, luego Roth IRA" },
      ],
      "$500–$1,000": [
        { item:"Póliza Híbrida Vida + LTC", amount:"$180–$250", note:"Permanente — primas garantizadas, opción de devolución" },
        { item:"Gastos Finales / Vida Entera Legacy", amount:"$50–$80", note:"Bloquea tasas; crecimiento garantizado de valor en efectivo" },
        { item:"Retiro (Anualidad Indexada Fija o IUL)", amount:"$150–$200", note:"Crecimiento indexado diferido de impuestos con piso de protección" },
        { item:"Emergencia + Ahorros Líquidos", amount:"$80–$100", note:"Construye un colchón de 6 meses" },
        { item:"Protección de Ingresos por Discapacidad", amount:"$70–$100", note:"Protege tu ingreso — tu activo financiero #1" },
        { item:"IUL para tu Hijo o Plan 529", amount:"$50–$80", note:"Educación libre de impuestos + herramienta financiera de por vida" },
      ],
      "$1,000+": [
        { item:"Vida + LTC Híbrido (cobertura máxima)", amount:"$300–$400", note:"Permanente — suite completa de beneficios en vida y legado" },
        { item:"Cobertura de Gastos Finales / Legacy", amount:"$50–$100", note:"Protección generacional garantizada bloqueada ahora" },
        { item:"Retiro Indexado (IUL o FIA)", amount:"$250–$350", note:"Libre o diferido de impuestos; crecimiento con protección contra caídas" },
        { item:"Póliza IUL para tu Hijo", amount:"$100–$150", note:"El mejor regalo financiero que un padre puede dar" },
        { item:"Anualidad Fija (banco/CD)", amount:"Suma global", note:"Mueve ahorros inactivos para ganar 2–3 veces más" },
        { item:"Planificación Patrimonial (Trust + Testamento + POA)", amount:"$100–$150", note:"Protección legal completa para tus activos y legado" },
      ],
    },
  };

  const langPlans = plans[lang];
  const rawPlan = langPlans[budget] || langPlans[lang === "en" ? "$250–$500" : "$250–$500"] || Object.values(langPlans)[2];
  const filteredPlan = rawPlan.filter(item => {
    const isChild = item.item.includes("Child IUL") || item.item.includes("529") || item.item.includes("IUL para tu Hijo") || item.item.includes("IUL o Plan 529");
    const isBankMove = item.item.includes("Fixed Annuity") || item.item.includes("Anualidad Fija") || item.item.includes("CD/bank") || item.item.includes("banco/CD");
    if (isChild && !hasYoungChildren) return false;
    if (isBankMove && !hasBankSavings) return false;
    return true;
  });

  // LTC education content
  // Beautiful Bill awareness
  const doesNotKnowBB = answers.tax_beautiful_bill && (
    answers.tax_beautiful_bill.includes("No –") ||
    answers.tax_beautiful_bill.includes("No – es la primera") ||
    answers.tax_beautiful_bill.includes("heard of it but") ||
    answers.tax_beautiful_bill.includes("heard") ||
    answers.tax_beautiful_bill.includes("escuchado de ello") ||
    answers.tax_beautiful_bill.includes("advisor to explain") ||
    answers.tax_beautiful_bill.includes("asesor me lo explique")
  );

  const bbEducation = lang === "en" ? {
    title: "📜 What Is the 'Beautiful Bill'?",
    subtitle: "The One Big Beautiful Bill Act — 2025 Tax Law Changes",
    summary: "The 'One Big Beautiful Bill' is a major tax reform package passed in 2025 that extends and expands many provisions from the 2017 Tax Cuts and Jobs Act. It introduces significant changes that could affect how much you owe — or get back — on your taxes.",
    sections: [
      {
        icon: "💰",
        title: "Higher Standard Deduction",
        body: "The standard deduction is temporarily increased — $16,000 for single filers and $32,000 for married filing jointly. This means fewer people need to itemize, and most families will owe less."
      },
      {
        icon: "👶",
        title: "Expanded Child Tax Credit",
        body: "The Child Tax Credit increases to $2,500 per child (up from $2,000). Families with children could see a meaningful boost in their refund."
      },
      {
        icon: "🏠",
        title: "No Tax on Tips & Overtime",
        body: "A key provision eliminates federal income tax on tips and overtime pay for eligible workers. If you earn tips or work overtime, this could significantly reduce your tax bill."
      },
      {
        icon: "🏢",
        title: "Small Business Deduction Extended",
        body: "The 20% pass-through deduction for self-employed individuals and small business owners (Section 199A) is made permanent. If you own a business, this is major."
      },
      {
        icon: "⚠️",
        title: "What You Should Do",
        body: "These changes may affect your withholding, estimated tax payments, and overall strategy. We recommend reviewing your situation with a financial professional to make sure you're taking full advantage."
      }
    ]
  } : {
    title: "📜 ¿Qué es el 'Beautiful Bill'?",
    subtitle: "The One Big Beautiful Bill Act — Cambios en las Leyes de Taxes 2025",
    summary: "El 'One Big Beautiful Bill' es un paquete de reforma fiscal importante aprobado en 2025 que extiende y amplía muchas disposiciones de la Ley de Recortes de Impuestos de 2017. Introduce cambios significativos que podrían afectar cuánto debes — o recibes — en tus impuestos.",
    sections: [
      {
        icon: "💰",
        title: "Deducción Estándar Más Alta",
        body: "La deducción estándar aumenta temporalmente — $16,000 para solteros y $32,000 para casados que declaran en conjunto. Esto significa que menos personas necesitan detallar deducciones y la mayoría de las familias pagarán menos."
      },
      {
        icon: "👶",
        title: "Crédito Tributario por Hijos Expandido",
        body: "El crédito tributario por hijo aumenta a $2,500 por niño (antes era $2,000). Las familias con hijos podrían ver un aumento significativo en su reembolso."
      },
      {
        icon: "🏠",
        title: "Sin Impuesto en Propinas y Horas Extra",
        body: "Una disposición clave elimina el impuesto federal sobre propinas y horas extra para trabajadores elegibles. Si recibes propinas o trabajas tiempo extra, esto podría reducir significativamente tu factura de impuestos."
      },
      {
        icon: "🏢",
        title: "Deducción para Pequeños Negocios Extendida",
        body: "La deducción del 20% para trabajadores independientes y dueños de pequeños negocios (Sección 199A) se hace permanente. Si tienes un negocio, esto es muy importante."
      },
      {
        icon: "⚠️",
        title: "¿Qué Debes Hacer?",
        body: "Estos cambios pueden afectar tus retenciones, pagos estimados y estrategia general. Recomendamos revisar tu situación con un profesional financiero para asegurarte de aprovechar todos los beneficios."
      }
    ]
  };

  const ltcEducation = lang === "en" ? {
    adls: {
      title: "🏃 What Triggers Long-Term Care Benefits?",
      subtitle: "Benefits activate when you can no longer perform 2 out of 6 Activities of Daily Living (ADLs):",
      items: [
        { icon: "🛁", label: "Bathing" }, { icon: "👗", label: "Dressing" }, { icon: "🍽️", label: "Eating" },
        { icon: "🚽", label: "Toileting" }, { icon: "🚶", label: "Transferring" }, { icon: "🔄", label: "Continence" },
      ],
    },
    causes: {
      title: "⚠️ Common Causes for Long-Term Care",
      items: ["Stroke", "Parkinson's Disease", "Alzheimer's / Dementia", "Cognitive Impairment", "Traumatic Brain Injury", "Multiple Sclerosis", "Advanced Diabetes", "Late-Stage Cancer", "COPD", "Heart Failure", "Physical Accidents"],
    },
    costs: {
      title: "💰 Real Cost of Care",
      items: [
        { label: "Family Care", cost: "Loss of Income", note: "Burden on family — time & money", color: "#e05050" },
        { label: "In-Home Health Aide", cost: "$7,436/mo", note: "Professional at-home care", color: "#e8a050" },
        { label: "Nursing Home (Semi-Priv.)", cost: "$11,695/mo", note: "Semi-private room", color: "#e8a050" },
        { label: "Nursing Home (Private)", cost: "$15,178/mo", note: "Private room", color: "#e05050" },
      ],
    },
    myths: {
      title: "❌ Health Insurance Myths — What Does NOT Cover LTC:",
      items: [
        { label: "Employer Health Insurance", reason: "Does not cover long-term care — it's for medical treatment, not daily living assistance." },
        { label: "Medicare", reason: "Only covers up to 100 days of skilled care after a hospital stay. Then — nothing." },
        { label: "Medicaid", reason: "Only available if you spend down to very low income/asset levels. Not a plan, a last resort." },
      ],
    },
    types: {
      title: "✅ Types of Long-Term Care Coverage",
      items: [
        { name: "Stand-Alone LTC", pros: ["Lower premiums", "LTC-focused"], cons: ["Use it or lose it", "Not guaranteed"], color: "#e8a050" },
        { name: "Linked Benefits LTC", pros: ["Guaranteed premiums", "Return of premium", "LTC + Life combined"], cons: [], color: "#4caf82" },
        { name: "LTC Rider on Life Policy", pros: ["Life insurance + LTC access", "Various products available"], cons: [], color: "#4a90d9" },
      ],
    },
  } : {
    adls: {
      title: "🏃 ¿Qué Activa los Beneficios de Cuidado a Largo Plazo?",
      subtitle: "Los beneficios se activan cuando ya no puedes realizar 2 de las 6 Actividades de la Vida Diaria (ADLs):",
      items: [
        { icon: "🛁", label: "Bañarse" }, { icon: "👗", label: "Vestirse" }, { icon: "🍽️", label: "Comer" },
        { icon: "🚽", label: "Ir al baño" }, { icon: "🚶", label: "Moverse / Trasladarse" }, { icon: "🔄", label: "Continencia" },
      ],
    },
    causes: {
      title: "⚠️ Causas Comunes que Requieren Cuidado a Largo Plazo",
      items: ["Derrame cerebral", "Enfermedad de Parkinson", "Alzheimer / Demencia", "Deterioro cognitivo", "Lesión cerebral traumática", "Esclerosis múltiple", "Diabetes avanzada", "Cáncer en etapa avanzada", "EPOC", "Insuficiencia cardíaca", "Accidentes físicos"],
    },
    costs: {
      title: "💰 Costo Real del Cuidado",
      items: [
        { label: "Cuidado Familiar", cost: "Pérdida de Ingresos", note: "Carga para la familia — tiempo y dinero", color: "#e05050" },
        { label: "Enfermero/a en Casa", cost: "$7,436/mes", note: "Cuidado profesional en el hogar", color: "#e8a050" },
        { label: "Hogar de Ancianos (Semi-Priv.)", cost: "$11,695/mes", note: "Habitación semi-privada", color: "#e8a050" },
        { label: "Hogar de Ancianos (Privado)", cost: "$15,178/mes", note: "Habitación privada", color: "#e05050" },
      ],
    },
    myths: {
      title: "❌ Mitos del Seguro de Salud — Lo que NO cubre el LTC:",
      items: [
        { label: "Seguro Médico del Empleador", reason: "No cubre cuidado a largo plazo — es para tratamiento médico, no para asistencia en la vida diaria." },
        { label: "Medicare", reason: "Solo cubre hasta 100 días de cuidado especializado después de una hospitalización. Después — nada." },
        { label: "Medicaid", reason: "Solo disponible si agotaste casi todos tus ingresos y activos. No es un plan, es el último recurso." },
      ],
    },
    types: {
      title: "✅ Tipos de Cobertura de Cuidado a Largo Plazo",
      items: [
        { name: "LTC Independiente", pros: ["Primas más bajas", "Enfocado en LTC"], cons: ["Use it or lose it", "No garantizado"], color: "#e8a050" },
        { name: "Beneficios Vinculados (LTC + Vida)", pros: ["Primas garantizadas", "Devolución de prima", "LTC + Vida combinados"], cons: [], color: "#4caf82" },
        { name: "Rider de LTC en Póliza de Vida", pros: ["Seguro de vida + acceso a LTC", "Varios productos disponibles"], cons: [], color: "#4a90d9" },
      ],
    },
  };

  return { scores, gaps, plan: filteredPlan, budget, insights, medicareEducation, showMedicareEdu: isNear65 || !hasSsAccount, ltcEducation, showLTCEdu: !hasLTC, bbEducation, showBBEdu: doesNotKnowBB };
}

// ─── UI COMPONENTS ─────────────────────────────────────────────────────────────
function ScoreBar({ label, score, index = 0 }) {
  const color = score >= 7 ? "#4caf82" : score >= 4 ? "#e8c050" : "#e05050";
  return (
    <div className="anim-fadeup" style={{ marginBottom: 16, animationDelay: `${index * 0.06}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: "#9ab", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{score}<span style={{ fontSize: 10, color: "#445566" }}>/10</span></span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div className="score-bar-fill" style={{ '--bar-w': `${score * 10}%`, width: `${score * 10}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} />
      </div>
    </div>
  );
}

const TAG_COLORS = {
  CRITICAL:   { bg:"rgba(224,80,80,0.12)",   border:"rgba(224,80,80,0.35)",   text:"#e05050" },
  CRÍTICO:    { bg:"rgba(224,80,80,0.12)",   border:"rgba(224,80,80,0.35)",   text:"#e05050" },
  IMPORTANT:  { bg:"rgba(232,160,80,0.10)",  border:"rgba(232,160,80,0.32)",  text:"#e8a050" },
  IMPORTANTE: { bg:"rgba(232,160,80,0.10)",  border:"rgba(232,160,80,0.32)",  text:"#e8a050" },
  OPPORTUNITY:{ bg:"rgba(76,175,130,0.10)",  border:"rgba(76,175,130,0.32)",  text:"#4caf82" },
  OPORTUNIDAD:{ bg:"rgba(76,175,130,0.10)",  border:"rgba(76,175,130,0.32)",  text:"#4caf82" },
  TIP:        { bg:"rgba(100,160,220,0.10)", border:"rgba(100,160,220,0.32)", text:"#64a0dc" },
  CONSEJO:    { bg:"rgba(100,160,220,0.10)", border:"rgba(100,160,220,0.32)", text:"#64a0dc" },
};

function GapCard({ gap }) {
  const s = TAG_COLORS[gap.tag] || TAG_COLORS.IMPORTANT;
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontWeight: "bold", color: "#e8dcc8", fontSize: 13 }}>{gap.area}</div>
        <span style={{ fontSize: 9, fontWeight: "bold", letterSpacing: 1, color: s.text, background: s.border, padding: "3px 7px", borderRadius: 4, whiteSpace: "nowrap", marginLeft: 10 }}>{gap.tag}</span>
      </div>
      <div style={{ fontSize: 12, color: "#aabbcc", lineHeight: 1.7 }}>{gap.reason}</div>
    </div>
  );
}

function InsightCard({ insight }) {
  return (
    <div style={{ background: "rgba(100,160,220,0.07)", border: "1px solid rgba(100,160,220,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 9 }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{insight.icon}</div>
      <div style={{ fontWeight: "bold", color: "#c8d8e8", fontSize: 13, marginBottom: 6 }}>{insight.title}</div>
      <div style={{ fontSize: 12, color: "#8899aa", lineHeight: 1.7 }}>{insight.body}</div>
    </div>
  );
}

function MedicareEduCard({ edu, lang }) {
  const [openSection, setOpenSection] = useState(null);
  const toggle = (s) => setOpenSection(prev => prev === s ? null : s);
  const accentBlue = "#4a90d9";
  const accentGold = "#c8a050";

  return (
    <div style={{ background: "rgba(74,144,217,0.07)", border: "1px solid rgba(74,144,217,0.3)", borderRadius: 14, marginBottom: 20, overflow: "hidden" }}>
      {/* Medicare Section */}
      <div onClick={() => toggle("medicare")} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(74,144,217,0.15)" }}>
        <div style={{ fontWeight: "bold", color: accentBlue, fontSize: 14 }}>{edu.whatIsMedicare.title}</div>
        <div style={{ color: accentBlue, fontSize: 16 }}>{openSection === "medicare" ? "▲" : "▼"}</div>
      </div>
      {openSection === "medicare" && (
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#aabbcc", lineHeight: 1.8, margin: "0 0 16px" }}>{edu.whatIsMedicare.body}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {edu.whatIsMedicare.parts.map(p => (
              <div key={p.part} style={{ background: "rgba(74,144,217,0.08)", border: "1px solid rgba(74,144,217,0.2)", borderRadius: 9, padding: "12px 14px" }}>
                <div style={{ color: accentGold, fontWeight: "bold", fontSize: 13, marginBottom: 3 }}>{p.part} — {p.name}</div>
                <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.6 }}>{p.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(224,80,80,0.08)", border: "1px solid rgba(224,80,80,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "#e08080", lineHeight: 1.7 }}>{edu.whatIsMedicare.gap}</div>
          </div>
          <div style={{ background: "rgba(76,175,130,0.08)", border: "1px solid rgba(76,175,130,0.25)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, color: "#6caf92", lineHeight: 1.7 }}>{edu.whatIsMedicare.action}</div>
          </div>
        </div>
      )}

      {/* Social Security Section */}
      <div onClick={() => toggle("ss")} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", color: accentBlue, fontSize: 14 }}>{edu.whatIsSS.title}</div>
        <div style={{ color: accentBlue, fontSize: 16 }}>{openSection === "ss" ? "▲" : "▼"}</div>
      </div>
      {openSection === "ss" && (
        <div style={{ padding: "0 20px 18px" }}>
          <p style={{ fontSize: 12, color: "#aabbcc", lineHeight: 1.8, margin: "0 0 14px" }}>{edu.whatIsSS.body}</p>

          {/* Claiming Strategy Table */}
          <div style={{ marginBottom: 16 }}>
            {edu.whatIsSS.claimingStrategy.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "10px 14px", background: i % 2 === 0 ? "rgba(74,144,217,0.06)" : "rgba(74,144,217,0.03)", borderRadius: 7, marginBottom: 5 }}>
                <div style={{ minWidth: 120, fontWeight: "bold", color: accentGold, fontSize: 12 }}>{row.age}</div>
                <div style={{ fontSize: 12, color: "#aabbcc" }}>{row.result}</div>
              </div>
            ))}
          </div>

          {/* Step by Step */}
          <div style={{ background: "rgba(200,160,80,0.07)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 9, padding: "12px 16px" }}>
            <div style={{ fontWeight: "bold", color: accentGold, fontSize: 12, marginBottom: 10 }}>{edu.whatIsSS.howToAccess.title}</div>
            {edu.whatIsSS.howToAccess.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ minWidth: 22, height: 22, borderRadius: "50%", background: accentGold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", color: "#0a1628", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: "#aabbcc", lineHeight: 1.6 }}>{step}</div>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(74,144,217,0.1)", borderRadius: 6, fontSize: 11, color: "#64a0dc" }}>
              🔗 {lang === "en" ? "Visit:" : "Visita:"} <strong>ssa.gov</strong> — {lang === "en" ? "free, secure, available in Spanish" : "gratuito, seguro, disponible en español"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function BBEduCard({ edu, lang }) {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);
  return (
    <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.25)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, rgba(200,160,80,0.15), rgba(200,160,80,0.05))", padding: "18px 20px", borderBottom: "1px solid rgba(200,160,80,0.15)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e8c878", marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>{edu.title}</div>
        <div style={{ fontSize: 11, color: "#c8a050", marginBottom: 10, letterSpacing: 0.5 }}>{edu.subtitle}</div>
        <p style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.75, margin: 0 }}>{edu.summary}</p>
      </div>
      {/* Sections */}
      {edu.sections.map((sec, i) => (
        <div key={i} style={{ borderBottom: i < edu.sections.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div onClick={() => toggle(i)} style={{ padding: "14px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{sec.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#c8d8e8" }}>{sec.title}</span>
            </div>
            <span style={{ color: "#c8a050", fontSize: 12 }}>{openIdx === i ? "▲" : "▼"}</span>
          </div>
          {openIdx === i && (
            <div style={{ padding: "4px 20px 16px 52px" }}>
              <p style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.8, margin: 0 }}>{sec.body}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LTCEduCard({ edu, lang }) {
  const [openSection, setOpenSection] = useState(null);
  const toggle = (s) => setOpenSection(prev => prev === s ? null : s);
  const accentRed = "#e05050";
  const accentGreen = "#4caf82";
  const accentGold = "#c8a050";

  const Section = ({ id, title, children }) => (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div onClick={() => toggle(id)} style={{ padding: "15px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", color: "#e8c878", fontSize: 13 }}>{title}</div>
        <div style={{ color: accentGold, fontSize: 14 }}>{openSection === id ? "▲" : "▼"}</div>
      </div>
      {openSection === id && <div style={{ padding: "4px 20px 18px" }}>{children}</div>}
    </div>
  );

  return (
    <div style={{ background: "rgba(232,80,80,0.05)", border: "1px solid rgba(232,80,80,0.25)", borderRadius: 14, marginBottom: 20, overflow: "hidden" }}>

      {/* ADLs */}
      <Section id="adls" title={edu.adls.title}>
        <p style={{ fontSize: 12, color: "#aabbcc", lineHeight: 1.7, margin: "0 0 14px" }}>{edu.adls.subtitle}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
          {edu.adls.items.map((item, i) => (
            <div key={i} style={{ background: "rgba(232,160,80,0.08)", border: "1px solid rgba(232,160,80,0.2)", borderRadius: 9, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 11, color: "#c8d8e8", fontWeight: "bold" }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(232,80,80,0.1)", border: "1px solid rgba(232,80,80,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e08080", lineHeight: 1.6 }}>
          ⚡ {lang === "en" ? "Benefits activate when you cannot perform 2 of these 6 — regardless of age." : "Los beneficios se activan cuando no puedes realizar 2 de estas 6 — sin importar la edad."}
        </div>
      </Section>

      {/* Causes */}
      <Section id="causes" title={edu.causes.title}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {edu.causes.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 7, fontSize: 12, color: "#aabbcc" }}>
              <span style={{ color: accentRed, fontSize: 10 }}>●</span>{item}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: "rgba(232,80,80,0.08)", border: "1px solid rgba(232,80,80,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e08080", lineHeight: 1.6 }}>
          {lang === "en" ? "🔴 Any of these conditions could require long-term care — and most happen unexpectedly." : "🔴 Cualquiera de estas condiciones puede requerir cuidado a largo plazo — y la mayoría ocurre de forma inesperada."}
        </div>
      </Section>

      {/* Real Costs */}
      <Section id="costs" title={edu.costs.title}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {edu.costs.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: `1px solid ${item.color}33`, borderRadius: 9, padding: "12px 16px" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#e8dcc8", fontSize: 12, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: "#667788" }}>{item.note}</div>
              </div>
              <div style={{ fontWeight: "bold", color: item.color, fontSize: 13, whiteSpace: "nowrap", marginLeft: 12 }}>{item.cost}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: "rgba(232,80,80,0.08)", border: "1px solid rgba(232,80,80,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e08080" }}>
          {lang === "en" ? "📊 More than 70% of people over 65 will need some form of LTC. Only 11% have coverage." : "📊 Más del 70% de personas mayores de 65 necesitarán algún tipo de LTC. Solo el 11% tiene cobertura."}
        </div>
      </Section>

      {/* Myths */}
      <Section id="myths" title={edu.myths.title}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {edu.myths.items.map((item, i) => (
            <div key={i} style={{ background: "rgba(232,80,80,0.07)", border: "1px solid rgba(232,80,80,0.2)", borderRadius: 9, padding: "12px 14px" }}>
              <div style={{ fontWeight: "bold", color: "#e08080", fontSize: 12, marginBottom: 4 }}>❌ {item.label}</div>
              <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.6 }}>{item.reason}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Types of Coverage */}
      <Section id="types" title={edu.types.title}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {edu.types.items.map((item, i) => (
            <div key={i} style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid ${item.color}44`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontWeight: "bold", color: item.color, fontSize: 13, marginBottom: 8 }}>{item.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.pros.map((p, j) => (
                  <span key={j} style={{ background: `${accentGreen}18`, border: `1px solid ${accentGreen}33`, borderRadius: 5, padding: "3px 9px", fontSize: 10, color: accentGreen }}>✓ {p}</span>
                ))}
                {item.cons.map((c, j) => (
                  <span key={j} style={{ background: `${accentRed}12`, border: `1px solid ${accentRed}25`, borderRadius: 5, padding: "3px 9px", fontSize: 10, color: "#e08080" }}>✗ {c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: "rgba(76,175,130,0.08)", border: "1px solid rgba(76,175,130,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6caf92", lineHeight: 1.6 }}>
          💡 {lang === "en" ? "The best option for most people is a Linked Benefits policy — LTC + Life Insurance combined, guaranteed premiums, and return of premium if never used." : "La mejor opción para la mayoría es una póliza de Beneficios Vinculados — LTC + Vida combinados, primas garantizadas y devolución de prima si nunca se usa."}
        </div>
      </Section>

    </div>
  );
}

function PlanDisplay({ plan, lang, clientName, advisorName, onBack, onReset, onFinish }) {
  const t = T[lang];
  const { scores, gaps, plan: budgetPlan, budget, insights, medicareEducation, showMedicareEdu, ltcEducation, showLTCEdu, bbEducation, showBBEdu } = plan;
  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
  const overallColor = avgScore >= 7 ? "#4caf82" : avgScore >= 4 ? "#e8c050" : "#e05050";
  const overallLabel = avgScore >= 7 ? t.wellProtected : avgScore >= 4 ? t.partiallyProtected : t.significantGaps;
  const cTags = ["CRITICAL","CRÍTICO"], iTags = ["IMPORTANT","IMPORTANTE"], oTags = ["OPPORTUNITY","OPORTUNIDAD","TIP","CONSEJO"];
  const criticalGaps = gaps.filter(g => cTags.includes(g.tag));
  const importantGaps = gaps.filter(g => iTags.includes(g.tag));
  const opportunities = gaps.filter(g => oTags.includes(g.tag));

  return (
    <div className="anim-fadeup">

      {/* SCORE HERO */}
      <div style={{ textAlign: "center", marginBottom: 32, padding: "32px 20px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20 }}>
        <div style={{ fontSize: 10, color: "#445566", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>{t.assessmentTitle}</div>
        {clientName && (
          <div style={{ fontSize: 12, color: "#c8a050", marginBottom: 16, fontWeight: 500 }}>
            👤 <strong style={{ color: "#e8c878" }}>{clientName}</strong>
          </div>
        )}
        <div style={{ position: "relative", width: 148, height: 148, margin: "0 auto 18px" }}>
          <svg width="148" height="148" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="74" cy="74" r="62" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
            <circle cx="74" cy="74" r="62" fill="none" stroke={overallColor} strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 62 * avgScore / 10} ${2 * Math.PI * 62}`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${overallColor}88)` }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: overallColor, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{avgScore}</div>
            <div style={{ fontSize: 10, color: "#445566", marginTop: 2 }}>/ 10</div>
          </div>
        </div>
        <div style={{ fontSize: 18, color: overallColor, fontWeight: 600, marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>{overallLabel}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {criticalGaps.length > 0 && <span style={{ fontSize: 11, color: "#e05050", background: "rgba(224,80,80,0.1)", border: "1px solid rgba(224,80,80,0.2)", borderRadius: 20, padding: "3px 12px" }}>🔴 {criticalGaps.length} {t.critical}</span>}
          {importantGaps.length > 0 && <span style={{ fontSize: 11, color: "#e8a050", background: "rgba(232,160,80,0.1)", border: "1px solid rgba(232,160,80,0.2)", borderRadius: 20, padding: "3px 12px" }}>🟡 {importantGaps.length} {t.important}</span>}
          {opportunities.length > 0 && <span style={{ fontSize: 11, color: "#4caf82", background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.2)", borderRadius: 20, padding: "3px 12px" }}>💡 {opportunities.length} {t.opportunity}</span>}
        </div>
      </div>

      {/* SCORE BARS */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "24px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 3, height: 18, borderRadius: 2, background: "linear-gradient(180deg, #c8a050, #e8c878)" }} />
          <h3 style={{ color: "#e8c878", margin: 0, fontSize: 14, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{t.scoresTitle}</h3>
        </div>
        {Object.entries(scores).map(([key, score], i) => <ScoreBar key={key} label={t.scoreLabels[key] || key} score={score} index={i} />)}
      </div>

      {criticalGaps.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#e05050" }} />
            <h3 style={{ color: "#e05050", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.criticalTitle}</h3>
          </div>
          {criticalGaps.map((g, i) => <GapCard key={i} gap={g} />)}
        </div>
      )}
      {importantGaps.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#e8a050" }} />
            <h3 style={{ color: "#e8a050", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.importantTitle}</h3>
          </div>
          {importantGaps.map((g, i) => <GapCard key={i} gap={g} />)}
        </div>
      )}
      {opportunities.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#4caf82" }} />
            <h3 style={{ color: "#4caf82", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.opportunityTitle}</h3>
          </div>
          {opportunities.map((g, i) => <GapCard key={i} gap={g} />)}
        </div>
      )}
      {insights.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#4a90d9" }} />
            <h3 style={{ color: "#4a90d9", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.insightsTitle}</h3>
          </div>
          {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
        </div>
      )}

      {showMedicareEdu && medicareEducation && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: "#4a90d9", margin: "0 0 8px", fontSize: 12, letterSpacing: 1 }}>
            🏛️ {lang === "en" ? "Medicare & Social Security — Education Center" : "Medicare y Seguro Social — Centro Educativo"}
          </h3>
          <p style={{ fontSize: 11, color: "#8899aa", margin: "0 0 10px" }}>
            {lang === "en" ? "Tap each section to expand and learn." : "Toca cada sección para expandir y aprender."}
          </p>
          <MedicareEduCard edu={medicareEducation} lang={lang} />
        </div>
      )}

      {showBBEdu && bbEducation && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#c8a050" }} />
            <h3 style={{ color: "#c8a050", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {lang === "en" ? "📜 Tax Law Update — Beautiful Bill" : "📜 Actualización Fiscal — Beautiful Bill"}
            </h3>
          </div>
          <p style={{ fontSize: 11, color: "#667788", margin: "0 0 10px", fontStyle: "italic" }}>
            {lang === "en" ? "Based on your answers, here's what you should know about the 2025 tax changes." : "Basado en tus respuestas, esto es lo que debes saber sobre los cambios fiscales de 2025."}
          </p>
          <BBEduCard edu={bbEducation} lang={lang} />
        </div>
      )}

      {showLTCEdu && ltcEducation && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: "#e05050", margin: "0 0 8px", fontSize: 12, letterSpacing: 1 }}>
            🏥 {lang === "en" ? "Long-Term Care — Education Center" : "Cuidado a Largo Plazo — Centro Educativo"}
          </h3>
          <p style={{ fontSize: 11, color: "#8899aa", margin: "0 0 10px" }}>
            {lang === "en"
              ? "You don't have LTC coverage. Learn what it is, what it costs, and your options."
              : "No tienes cobertura de LTC. Aprende qué es, cuánto cuesta y cuáles son tus opciones."}
          </p>
          <LTCEduCard edu={ltcEducation} lang={lang} />
        </div>
      )}

      {/* ── BUDGET PLAN ── */}
      <div style={{ background: "linear-gradient(135deg, rgba(200,160,80,0.07), rgba(200,160,80,0.02))", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 18, padding: "24px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 18, borderRadius: 2, background: "linear-gradient(180deg, #c8a050, #e8c878)" }} />
          <h3 className="fa-header" style={{ color: "#e8c878", margin: 0, fontSize: 14, fontWeight: 600 }}>{t.budgetTitle}</h3>
        </div>
        <p style={{ color: "#445566", fontSize: 11, margin: "0 0 18px", paddingLeft: 11 }}>{t.budgetSubtitle} <strong style={{ color: "#c8a050" }}>{budget}{t.perMonth}</strong></p>
        {budgetPlan.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 12px", borderRadius: 10, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, color: "#d0c8b8", fontSize: 12, marginBottom: 1 }}>{item.item}</div>
              <div style={{ fontSize: 10, color: "#445566" }}>{item.note}</div>
            </div>
            <div style={{ color: "#c8a050", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", marginLeft: 12, background: "rgba(200,160,80,0.08)", borderRadius: 8, padding: "3px 10px" }}>{item.amount}</div>
          </div>
        ))}
      </div>

      {/* ── KEY FACTS ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, padding: "20px 24px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: "#4a90d9" }} />
          <h3 style={{ color: "#4a90d9", margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.factsTitle}</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {t.facts.map(([stat, desc]) => (
            <div key={stat} style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: 12, padding: "12px 14px" }}>
              <div className="fa-header" style={{ fontSize: 18, color: "#c8a050", fontWeight: 700, marginBottom: 4 }}>{stat}</div>
              <div style={{ fontSize: 10, color: "#445566", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BLOCK ── */}
      <div style={{ background: "linear-gradient(135deg, rgba(200,160,80,0.09), rgba(200,160,80,0.03))", border: "1px solid rgba(200,160,80,0.3)", borderRadius: 20, padding: "28px 24px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(200,160,80,0.12)", border: "1px solid rgba(200,160,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 14px" }}>📞</div>
        <div className="fa-header" style={{ fontSize: 17, fontWeight: 700, color: "#f0e4c8", marginBottom: 10, letterSpacing: 0.3 }}>
          {lang === "en" ? "We Will Reach Out to You" : "Nosotros Te Contactaremos"}
        </div>
        <div style={{ fontSize: 13, color: "#667788", lineHeight: 1.85, marginBottom: 20, maxWidth: 420, margin: "0 auto 20px", fontWeight: 300 }}>
          {lang === "en"
            ? `${clientName ? `${clientName}, your` : "Your"} assessment is complete. ${advisorName || "Your advisor"} will review your results and reach out to guide you and present personalized options and strategies for your situation.`
            : `${clientName ? `${clientName}, tu` : "Tu"} evaluación está completa. ${advisorName || "Tu asesor"} revisará tus resultados y se pondrá en contacto contigo para guiarte y presentarte opciones y estrategias personalizadas para tu situación.`}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} className="btn-ghost" style={{ fontSize: 12 }}>{t.reviewBtn}</button>
          <button onClick={() => printReport({ answers: window._fa_answers, plan, clientName, advisorName, lang })} className="btn-ghost" style={{ fontSize: 12, color: "#4a90d9", borderColor: "rgba(74,144,217,0.3)" }}>
            🖨️ {lang === "en" ? "Save PDF" : "Guardar PDF"}
          </button>
          <button onClick={onFinish} className="btn-primary" style={{ fontSize: 13, padding: "11px 28px" }}>
            ✅ {lang === "en" ? "Done — Submit" : "Listo — Enviar"}
          </button>
        </div>
      </div>

      {/* Legal */}
      <div style={{ textAlign: "center", padding: "10px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "#1e2c3a", lineHeight: 1.7 }}>
          {lang === "en"
            ? `For educational purposes only. Does not constitute legal, tax, or financial advice. ${advisorName ? `Presented by ${advisorName}.` : ""} We will contact you to present personalized options and strategies for your situation.`
            : `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero. ${advisorName ? `Presentado por ${advisorName}.` : ""} Nos pondremos en contacto contigo para presentarte opciones y estrategias personalizadas para tu situación.`}
        </div>
      </div>
    </div>
  );
}

// ─── IMPACT OPENING SCREEN ─────────────────────────────────────────────────────
function ImpactScreen({ clientName, advisorName, onContinue }) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState(null);
  const [seenIntroMsg, setSeenIntroMsg] = useState(false);

  const introContent = {
    en: {
      title: "Welcome — Thank You for Trusting Us",
      body: [
        `We are a team of licensed financial professionals dedicated to guiding you and helping you discover the strategies and options available to protect your income, your family, and your financial future — both in the short and long term.`,
        `Beyond tax preparation, our mission is to make sure you understand where you stand today, what options are available to you, and how to build a plan that works for your specific situation.`,
        `This questionnaire will help us get to know you better so we can present you with personalized options and strategies. Please answer as honestly as possible — everything is confidential.`,
      ],
      btn: "Continue →",
    },
    es: {
      title: "Bienvenido — Gracias por Permitirnos Asistirte",
      body: [
        `Somos un equipo de profesionales financieros dedicados a guiarte y darte a conocer las estrategias y opciones disponibles para proteger tus ingresos, tu familia y tu futuro financiero — tanto a corto como a largo plazo.`,
        `Más allá de la preparación de impuestos, nuestra misión es asegurarnos de que entiendas dónde estás hoy, qué opciones tienes disponibles y cómo construir un plan que funcione para tu situación específica.`,
        `Este cuestionario nos ayudará a conocerte mejor para poder presentarte opciones y estrategias personalizadas. Por favor responde con la mayor honestidad posible — todo es confidencial.`,
      ],
      btn: "Continuar →",
    },
  };

  const stories = {
    en: [
      { icon: "👨‍👩‍👧", stat: "1 in 4", text: "working adults will become disabled before they retire — most have no income protection.", color: "#e05050" },
      { icon: "🏥", stat: "$11,695/mo", text: "is the average nursing home cost. Medicare only covers 100 days. After that — it's all on you.", color: "#e8a050" },
      { icon: "⚰️", stat: "$12,000", text: "is the average funeral cost. 68% of families have no plan — the bill goes straight to grieving relatives.", color: "#9988cc" },
      { icon: "💸", stat: "47%", text: "of Americans can't cover a $500 emergency. One unexpected event away from financial collapse.", color: "#e05050" },
      { icon: "📉", stat: "30%", text: "of people over 50 have zero retirement savings. Social Security alone averages only $1,976/month.", color: "#e8a050" },
      { icon: "⏰", stat: "The truth?", text: "Most people don't think about financial protection until life happens. And when life happens — it's not too late, but the road becomes much harder. The best time to protect your family was yesterday. The second best time is right now.", color: "#c8a050", isFinal: true },
    ],
    es: [
      { icon: "👨‍👩‍👧", stat: "1 de cada 4", text: "adultos que trabajan quedará discapacitado antes de retirarse — la mayoría no tiene protección de ingresos.", color: "#e05050" },
      { icon: "🏥", stat: "$11,695/mes", text: "es el costo promedio de un hogar de ancianos. Medicare solo cubre 100 días. Después — todo recae en ti.", color: "#e8a050" },
      { icon: "⚰️", stat: "$12,000", text: "es el costo promedio de un funeral. El 68% de las familias no tienen plan — la factura llega en el peor momento.", color: "#9988cc" },
      { icon: "💸", stat: "47%", text: "de los estadounidenses no puede cubrir una emergencia de $500. Un evento inesperado los separa del colapso financiero.", color: "#e05050" },
      { icon: "📉", stat: "30%", text: "de las personas mayores de 50 no tienen ahorros para el retiro. El Seguro Social promedia solo $1,976/mes.", color: "#e8a050" },
      { icon: "⏰", stat: "La verdad", text: "La mayoría de las personas no piensa en la protección financiera hasta que la vida ocurre. Y cuando ocurre — no es demasiado tarde, pero el camino se vuelve mucho más difícil. El mejor momento para proteger a tu familia fue ayer. El segundo mejor momento es ahora mismo.", color: "#c8a050", isFinal: true },
    ],
  };

  // Step 1: Language selection
  if (!lang) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "20px" }}>
        <GlobalStyles />

        {/* 1. BACKGROUND IMAGE — happy family / financial freedom */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1600&q=80&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center top",
          filter: "brightness(0.22) saturate(0.8)"
        }} />

        {/* Dark overlay gradient for readability */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(5,10,18,0.7) 0%, rgba(8,14,26,0.85) 50%, rgba(5,10,18,0.95) 100%)" }} />

        {/* Gold ambient glow center */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,80,0.08) 0%, transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1, pointerEvents: "none" }} />

        {/* CONTENT */}
        <div className="anim-scalein" style={{ textAlign: "center", maxWidth: 520, position: "relative", zIndex: 2 }}>

          {/* 2. BIGGER LOGO — with glow ring */}
          <div style={{
            width: 100, height: 100, borderRadius: 28,
            background: "linear-gradient(135deg, rgba(200,160,80,0.18), rgba(200,160,80,0.06))",
            border: "1px solid rgba(200,160,80,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, margin: "0 auto 28px",
            boxShadow: "0 0 60px rgba(200,160,80,0.25), 0 0 120px rgba(200,160,80,0.1)"
          }}>⚖️</div>

          {/* Title */}
          <h1 className="fa-header gold-shimmer" style={{ fontSize: 30, margin: "0 0 8px", lineHeight: 1.15, letterSpacing: 0.3 }}>
            Financial Protection Advisor
          </h1>
          <p style={{ fontSize: 14, color: "#667788", margin: "0 0 18px", fontWeight: 300, letterSpacing: 0.3 }}>
            Asesor de Protección Financiera
          </p>

          {/* 4. TAGLINE — powerful, emotional */}
          <div className="anim-fadeup delay-1" style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 17, color: "#c8d8e8", fontWeight: 300, lineHeight: 1.75, margin: "0 auto", maxWidth: 400, fontStyle: "italic" }}>
              "Helping families protect what matters most —<br/>
              <span style={{ color: "#e8c878", fontWeight: 500, fontStyle: "normal" }}>your income, your future, your legacy.</span>"
            </p>
          </div>

          {/* Client/advisor badge */}
          {clientName && (
            <div className="anim-fadeup delay-2" style={{ margin: "0 auto 20px", padding: "9px 24px", background: "rgba(200,160,80,0.08)", border: "1px solid rgba(200,160,80,0.25)", borderRadius: 24, display: "inline-block" }}>
              <span style={{ fontSize: 12, color: "#c8a050", fontWeight: 500 }}>
                Prepared for <strong style={{ color: "#e8c878" }}>{clientName}</strong>
              </span>
            </div>
          )}
          {advisorName && (
            <div className="anim-fadeup delay-3" style={{ fontSize: 10, color: "#445566", marginBottom: 28, letterSpacing: 1 }}>
              Presented by <span style={{ color: "#667788" }}>{advisorName}</span>
            </div>
          )}

          {/* Language label */}
          <p style={{ color: "#334455", fontSize: 10, margin: "0 0 16px", letterSpacing: 2.5, textTransform: "uppercase" }}>
            Select your language · Selecciona tu idioma
          </p>

          {/* 3. BIGGER, MORE IMPRESSIVE LANGUAGE BUTTONS */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {[["en","🇺🇸","English","Continue in English"],["es","🇪🇸","Español","Continuar en Español"]].map(([code, flag, label, sub]) => (
              <button key={code} onClick={() => setLang(code)}
                style={{
                  padding: "22px 36px", cursor: "pointer", border: "none", borderRadius: 18,
                  background: "linear-gradient(135deg, #c8a050 0%, #e8c878 50%, #d4a84b 100%)",
                  boxShadow: "0 6px 32px rgba(200,160,80,0.4), 0 2px 8px rgba(0,0,0,0.4)",
                  transition: "all 0.22s ease", fontFamily: "'DM Sans', sans-serif",
                  minWidth: 160
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(200,160,80,0.6), 0 4px 12px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(200,160,80,0.4), 0 2px 8px rgba(0,0,0,0.4)"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{flag}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#050a12", letterSpacing: 0.3 }}>{label}</div>
                <div style={{ fontSize: 10, color: "rgba(5,10,18,0.55)", marginTop: 3, letterSpacing: 0.5 }}>{sub}</div>
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className="anim-fadeup delay-4" style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {["🔒 100% Confidential", "📋 Takes ~5 minutes", "🆓 Completely Free"].map(badge => (
              <span key={badge} style={{ fontSize: 10, color: "#445566", letterSpacing: 0.5 }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Welcome / intro message
  if (!seenIntroMsg) {
    const intro = introContent[lang];
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #07090f 0%, #0b1120 60%, #080e1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "28px 20px", position: "relative", overflow: "hidden" }}>
        <GlobalStyles />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,80,0.04) 0%, transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

        <div className="anim-fadeup" style={{ maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, rgba(200,160,80,0.15), rgba(200,160,80,0.05))", border: "1px solid rgba(200,160,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px", boxShadow: "0 0 30px rgba(200,160,80,0.12)" }}>🤝</div>
            <h1 className="fa-header" style={{ fontSize: 21, color: "#f0e4c8", margin: "0 0 8px", lineHeight: 1.3, fontWeight: 700 }}>{intro.title}</h1>
            {clientName && <div style={{ fontSize: 12, color: "#c8a050", fontWeight: 500 }}>👤 {clientName}</div>}
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(200,160,80,0.14)", borderRadius: 18, padding: "26px 28px", marginBottom: 24, backdropFilter: "blur(8px)" }}>
            {intro.body.map((para, i) => (
              <p key={i} className={`anim-fadeup delay-${i+2}`} style={{ fontSize: 14, color: i === 0 ? "#c8d8e8" : "#667788", lineHeight: 1.9, margin: i < intro.body.length - 1 ? "0 0 16px" : "0", fontStyle: i === 2 ? "italic" : "normal", fontWeight: i === 0 ? 400 : 300 }}>
                {para}
              </p>
            ))}
          </div>

          {advisorName && (
            <div style={{ textAlign: "center", fontSize: 11, color: "#334455", marginBottom: 20, letterSpacing: 0.5 }}>
              — {advisorName}
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button onClick={() => setSeenIntroMsg(true)} className="btn-primary" style={{ padding: "15px 52px", fontSize: 15 }}>
              {intro.btn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const slides = stories[lang];
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div key={step} style={{ minHeight: "100vh", background: "linear-gradient(160deg, #07090f 0%, #0b1120 60%, #080e1a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
      <GlobalStyles />
      {/* Ambient color glow that changes with slide */}
      <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${slide.color}0d 0%, transparent 65%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", transition: "background 0.7s ease", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${slide.color}07 0%, transparent 65%)`, top: "15%", right: "10%", transition: "background 0.7s ease", pointerEvents: "none" }} />

      {/* Step pills */}
      <div style={{ display: "flex", gap: 5, marginBottom: 44, position: "relative", zIndex: 1 }}>
        {slides.map((_, i) => (
          <div key={i} style={{ height: 4, borderRadius: 3, width: i === step ? 28 : (i < step ? 14 : 7), background: i <= step ? slide.color : "rgba(255,255,255,0.08)", transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)", boxShadow: i === step ? `0 0 8px ${slide.color}88` : "none" }} />
        ))}
      </div>

      {/* Card */}
      <div className="anim-scalein" style={{ textAlign: "center", maxWidth: 520, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ background: `${slide.color}0a`, border: `1px solid ${slide.color}22`, borderRadius: 24, padding: "36px 32px 32px", backdropFilter: "blur(12px)", marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 18, filter: `drop-shadow(0 0 20px ${slide.color}55)` }}>{slide.icon}</div>
          <div className="fa-header" style={{ fontSize: slide.isFinal ? 30 : 56, fontWeight: 700, color: slide.color, margin: "0 0 18px", lineHeight: 1.05, textShadow: `0 0 40px ${slide.color}33`, letterSpacing: slide.isFinal ? 0.5 : -1 }}>
            {slide.stat}
          </div>
          <p style={{ fontSize: slide.isFinal ? 15 : 16, color: slide.isFinal ? "#c0d0e0" : "#8899aa", lineHeight: 1.95, margin: 0, fontStyle: slide.isFinal ? "italic" : "normal", fontWeight: 300 }}>
            {slide.text}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
          {step > 0 && (
            <button onClick={() => setStep(p => p - 1)} className="btn-ghost" style={{ padding: "11px 20px" }}>←</button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(p => p + 1)} className="hover-lift"
              style={{ padding: "14px 38px", background: `linear-gradient(135deg, ${slide.color}dd, ${slide.color})`, border: "none", borderRadius: 12, color: "#050a12", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 22px ${slide.color}44`, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
              {lang === "en" ? "Next →" : "Siguiente →"}
            </button>
          ) : (
            <button onClick={() => onContinue(lang)} className="btn-primary" style={{ padding: "15px 44px", fontSize: 15 }}>
              {lang === "en" ? "Start My Assessment →" : "Iniciar Mi Evaluación →"}
            </button>
          )}
        </div>

        {!isLast && (
          <button onClick={() => onContinue(lang)} style={{ marginTop: 14, background: "transparent", border: "none", color: "#2a3a4a", fontSize: 11, cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif" }}>
            {lang === "en" ? "Skip intro" : "Saltar intro"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LANGUAGE SCREEN ───────────────────────────────────────────────────────────
function LanguageScreen({ onSelect }) {
  const [hoverEn, setHoverEn] = useState(false);
  const [hoverEs, setHoverEs] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b2a 50%, #0a1628 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <div style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 20, filter: "drop-shadow(0 0 20px rgba(200,160,80,0.5))" }}>⚖️</div>
        <h1 style={{ fontSize: 24, color: "#e8c878", margin: "0 0 6px", letterSpacing: 1 }}>Financial Protection Advisor</h1>
        <h2 style={{ fontSize: 18, color: "#c8b878", margin: "0 0 8px", fontWeight: "normal", letterSpacing: 1 }}>Asesor de Protección Financiera</h2>
        <p style={{ color: "#8899aa", fontSize: 13, margin: "0 0 50px", letterSpacing: 1 }}>Select your language · Selecciona tu idioma</p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["en","🇺🇸 English", hoverEn, setHoverEn], ["es","🇪🇸 Español", hoverEs, setHoverEs]].map(([code, label, hover, setHover]) => (
            <button key={code} onClick={() => onSelect(code)}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
              style={{ padding: "22px 48px", fontSize: 18, fontWeight: "bold", background: "linear-gradient(135deg, #c8a050, #e8c878)", border: "none", borderRadius: 14, color: "#0a1628", cursor: "pointer", boxShadow: hover ? "0 8px 32px rgba(200,160,80,0.6)" : "0 4px 20px rgba(200,160,80,0.3)", letterSpacing: 1, transform: hover ? "scale(1.06) translateY(-2px)" : "scale(1)", transition: "all 0.25s ease" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LTC EDUCATION SCREEN ──────────────────────────────────────────────────────
function LTCEducationScreen({ lang, onContinue }) {
  const [slide, setSlide] = useState(0);
  const isEN = lang === "en";

  const slides = [
    // SLIDE 0 — The Shocking Truth
    {
      bg: "radial-gradient(ellipse at top, #1a0808 0%, #0a0e1a 100%)",
      accent: "#e05050",
      content: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 0 30px rgba(224,80,80,0.6))", animation: "pulse 2s infinite" }}>⏳</div>
          <h2 style={{ fontSize: 22, color: "#e05050", margin: "0 0 10px", letterSpacing: 1 }}>
            {isEN ? "Something you should know before we continue..." : "Algo que debes saber antes de continuar..."}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "24px 0" }}>
            {[
              { stat: "70%+", desc: isEN ? "of people over 65 will need long-term care" : "de personas mayores de 65 necesitarán cuidado a largo plazo" },
              { stat: "11%", desc: isEN ? "only have any LTC coverage at all" : "solamente tiene algún tipo de cobertura LTC" },
              { stat: "$11,695", desc: isEN ? "average monthly nursing home cost" : "costo mensual promedio de un hogar de ancianos" },
              { stat: "90 days", desc: isEN ? "is all Medicare covers — then nothing" : "es todo lo que cubre Medicare — luego nada" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(224,80,80,0.1)", border: "1px solid rgba(224,80,80,0.3)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#e05050", marginBottom: 4 }}>{item.stat}</div>
                <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.8, fontStyle: "italic" }}>
            {isEN
              ? "Most people think their health insurance, employer, or Medicare will cover them. The truth may surprise you."
              : "La mayoría cree que su seguro médico, empleador o Medicare los cubrirá. La verdad puede sorprenderte."}
          </p>
        </div>
      ),
    },

    // SLIDE 1 — What Triggers LTC (ADLs visual)
    {
      bg: "radial-gradient(ellipse at top, #0a0e1a 0%, #0d1a2a 100%)",
      accent: "#e8a050",
      content: () => (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔑</div>
            <h2 style={{ fontSize: 19, color: "#e8c878", margin: "0 0 8px" }}>
              {isEN ? "When Do Benefits Activate?" : "¿Cuándo Se Activan los Beneficios?"}
            </h2>
            <p style={{ fontSize: 12, color: "#8899aa", lineHeight: 1.7, margin: 0 }}>
              {isEN
                ? "Long-term care benefits activate when you can no longer independently perform 2 of the 6 Activities of Daily Living."
                : "Los beneficios de cuidado a largo plazo se activan cuando ya no puedes realizar de forma independiente 2 de las 6 Actividades de la Vida Diaria."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { icon: "🛁", en: "Bathing", es: "Bañarse", color: "#4a90d9" },
              { icon: "👗", en: "Dressing", es: "Vestirse", color: "#9988cc" },
              { icon: "🍽️", en: "Eating", es: "Comer", color: "#4caf82" },
              { icon: "🚽", en: "Toileting", es: "Usar el baño", color: "#e8a050" },
              { icon: "🔄", en: "Continence", es: "Continencia", color: "#e05050" },
              { icon: "🚶", en: "Transferring", es: "Moverse", color: "#c8a050" },
            ].map((adl, i) => (
              <div key={i} style={{ background: `${adl.color}14`, border: `1px solid ${adl.color}44`, borderRadius: 11, padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{adl.icon}</div>
                <div style={{ fontSize: 11, fontWeight: "bold", color: adl.color }}>{isEN ? adl.en : adl.es}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(232,160,80,0.1)", border: "1px solid rgba(232,160,80,0.3)", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#e8c050", fontWeight: "bold", marginBottom: 4 }}>
              ⚡ {isEN ? "2 out of 6 = Benefits Activate" : "2 de 6 = Los beneficios se activan"}
            </div>
            <div style={{ fontSize: 11, color: "#8899aa" }}>
              {isEN ? "This can happen at any age — not just when you're old." : "Esto puede ocurrir a cualquier edad — no solo cuando eres mayor."}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: current.bg, fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", transition: "background 0.5s ease" }}>
      {/* Glow */}
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${current.accent}18 0%, transparent 70%)`, top: "30%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>

        {/* Header badge */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ background: `${current.accent}22`, border: `1px solid ${current.accent}55`, borderRadius: 20, padding: "5px 16px", fontSize: 11, color: current.accent, letterSpacing: 1, textTransform: "uppercase" }}>
            🏥 {isEN ? "Long-Term Care — What You Need to Know" : "Cuidado a Largo Plazo — Lo Que Necesitas Saber"}
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: i === slide ? 22 : 7, height: 7, borderRadius: 4, background: i <= slide ? current.accent : "rgba(255,255,255,0.1)", transition: "all 0.4s ease", cursor: "pointer" }} onClick={() => setSlide(i)} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${current.accent}33`, borderRadius: 16, padding: "24px 22px", marginBottom: 20 }}>
          {current.content()}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {slide > 0 && (
            <button onClick={() => setSlide(p => p - 1)} style={{ padding: "10px 22px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, color: "#667788", fontSize: 13, cursor: "pointer" }}>
              ←
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setSlide(p => p + 1)} style={{ padding: "13px 36px", background: `linear-gradient(135deg, ${current.accent}bb, ${current.accent})`, border: "none", borderRadius: 10, color: "#050a12", fontSize: 14, fontWeight: "bold", cursor: "pointer", boxShadow: `0 4px 20px ${current.accent}44`, letterSpacing: 1 }}>
              {isEN ? "Next →" : "Siguiente →"}
            </button>
          ) : (
            <button onClick={onContinue} style={{ padding: "14px 40px", background: "linear-gradient(135deg, #c8a050, #e8c878)", border: "none", borderRadius: 12, color: "#050a12", fontSize: 15, fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 28px rgba(200,160,80,0.5)", letterSpacing: 1 }}>
              {isEN ? "Continue to Survey →" : "Continuar al Cuestionario →"}
            </button>
          )}
          {!isLast && (
            <button onClick={onContinue} style={{ background: "transparent", border: "none", color: "#445566", fontSize: 11, cursor: "pointer", textDecoration: "underline", padding: "10px 8px" }}>
              {isEN ? "Skip" : "Saltar"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── THANKS SCREEN ─────────────────────────────────────────────────────────────
function ThanksScreen({ lang, clientName, advisorName, onReset }) {
  const isEN = lang === "en";
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b2a 100%)", fontFamily: "'Georgia', serif", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>

        {/* THANK YOU HEADER */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 60, marginBottom: 14, filter: "drop-shadow(0 0 24px rgba(200,160,80,0.5))" }}>🙏</div>
          <h1 style={{ fontSize: 26, color: "#e8c878", margin: "0 0 10px", letterSpacing: 1 }}>
            {isEN ? "Thank You!" : "¡Gracias!"}
          </h1>
          {clientName && (
            <div style={{ fontSize: 16, color: "#c8a050", marginBottom: 10 }}>
              {isEN ? `${clientName}, we received your information.` : `${clientName}, recibimos tu información.`}
            </div>
          )}
        </div>

        {/* CONFIRMATION */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 14, padding: "22px 26px", marginBottom: 16, lineHeight: 1.8 }}>
          <p style={{ fontSize: 14, color: "#c8d8e8", margin: "0 0 12px" }}>
            {isEN
              ? "Your responses have been recorded. We will carefully review your information and reach out to guide you and present personalized options and strategies for your situation."
              : "Tus respuestas han sido registradas. Revisaremos tu información con cuidado y nos pondremos en contacto contigo para guiarte y presentarte opciones y estrategias personalizadas para tu situación."}
          </p>
          <p style={{ fontSize: 12, color: "#8899aa", margin: 0 }}>
            {isEN ? "There is nothing more you need to do right now — we will take it from here."
              : "No necesitas hacer nada más por ahora — nosotros nos encargamos a partir de aquí."}
          </p>
        </div>

        {advisorName && (
          <div style={{ textAlign: "center", fontSize: 14, color: "#c8a050", fontStyle: "italic", marginBottom: 28 }}>
            — {advisorName}
          </div>
        )}

        {/* SIMPLE OPPORTUNITY MENTION */}
        <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.18)", borderRadius: 12, padding: "18px 22px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 22, marginBottom: 10 }}>🤝</div>
          <p style={{ fontSize: 13, color: "#aabbcc", lineHeight: 1.9, margin: 0 }}>
            {isEN
              ? "If at any point you're curious about opportunities to generate extra income and be part of our team, feel free to ask us — we'd love to tell you more."
              : "Si en algún momento tienes curiosidad sobre oportunidades para generar ingresos extras y ser parte de nuestro equipo, no dudes en preguntarnos — con gusto te contamos más."}
          </p>
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <button onClick={() => window.print()} style={{ padding: "11px 22px", background: "rgba(100,160,220,0.12)", border: "1px solid rgba(100,160,220,0.3)", borderRadius: 9, color: "#64a0dc", fontSize: 13, cursor: "pointer", fontFamily: "'Georgia', serif" }}>
            🖨️ {isEN ? "Print / Save PDF" : "Imprimir / Guardar PDF"}
          </button>
          <button onClick={onReset} style={{ padding: "11px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, color: "#8899aa", fontSize: 13, cursor: "pointer", fontFamily: "'Georgia', serif" }}>
            {isEN ? "Start New Assessment" : "Nueva Evaluación"}
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "#2a3a4a", lineHeight: 1.7 }}>
          {isEN
            ? `For educational purposes only. Does not constitute legal, tax, or financial advice.${advisorName ? ` Presented by ${advisorName}.` : ""}`
            : `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero.${advisorName ? ` Presentado por ${advisorName}.` : ""}`}
        </div>

      </div>
    </div>
  );
}

// ─── ADVISOR PORTAL SCREEN ─────────────────────────────────────────────────────
function AdvisorScreen() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [advisorName, setAdvisorName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (clientName) params.set("name", clientName);
    if (clientEmail) params.set("email", clientEmail);
    if (clientPhone) params.set("phone", clientPhone);
    if (advisorName) params.set("advisor", advisorName);
    setGeneratedLink(`${base}?${params.toString()}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", background: "rgba(10,20,40,0.8)",
    border: "1px solid rgba(200,160,80,0.3)", borderRadius: 8, color: "#e8dcc8",
    fontSize: 13, outline: "none", boxSizing: "border-box", marginTop: 6,
  };
  const labelStyle = { fontSize: 12, color: "#8899aa", display: "block", marginTop: 14 };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b2a 100%)", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 10, filter: "drop-shadow(0 0 20px rgba(200,160,80,0.5))" }}>🔑</div>
          <h1 style={{ fontSize: 20, color: "#e8c878", margin: "0 0 4px", letterSpacing: 1 }}>Advisor Portal</h1>
          <p style={{ color: "#667788", fontSize: 12, margin: 0 }}>Generate a personalized survey link for your client</p>
        </div>

        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 14, padding: "24px 24px 28px" }}>
          <label style={labelStyle}>Your Name (Advisor) *</label>
          <input style={inputStyle} placeholder="e.g. Maria González" value={advisorName} onChange={e => setAdvisorName(e.target.value)} />

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "18px 0 4px" }} />
          <div style={{ fontSize: 11, color: "#c8a050", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Client Info</div>

          <label style={labelStyle}>Client Full Name *</label>
          <input style={inputStyle} placeholder="e.g. Juan Pérez" value={clientName} onChange={e => setClientName(e.target.value)} />

          <label style={labelStyle}>Client Email</label>
          <input style={inputStyle} placeholder="e.g. juan@email.com" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />

          <label style={labelStyle}>Client Phone (optional)</label>
          <input style={inputStyle} placeholder="e.g. 555-123-4567" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />

          <button
            onClick={generateLink}
            disabled={!clientName.trim() || !advisorName.trim()}
            style={{
              width: "100%", marginTop: 22, padding: "13px",
              background: (clientName.trim() && advisorName.trim()) ? "linear-gradient(135deg, #c8a050, #e8c878)" : "rgba(255,255,255,0.06)",
              border: "none", borderRadius: 9, color: (clientName.trim() && advisorName.trim()) ? "#0a1628" : "#445566",
              fontSize: 14, fontWeight: "bold", cursor: (clientName.trim() && advisorName.trim()) ? "pointer" : "not-allowed",
              letterSpacing: 1, transition: "all 0.3s",
            }}>
            🔗 Generate Client Link
          </button>
        </div>

        {/* Generated Link */}
        {generatedLink && (
          <div style={{ marginTop: 18, background: "rgba(76,175,130,0.08)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#4caf82", fontWeight: "bold", letterSpacing: 1, marginBottom: 10 }}>✅ LINK GENERATED — READY TO SEND</div>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 7, padding: "10px 12px", fontSize: 10, color: "#8899aa", wordBreak: "break-all", marginBottom: 12, lineHeight: 1.6 }}>
              {generatedLink}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyLink} style={{ flex: 1, padding: "10px", background: copied ? "rgba(76,175,130,0.3)" : "rgba(200,160,80,0.15)", border: `1px solid ${copied ? "rgba(76,175,130,0.5)" : "rgba(200,160,80,0.3)"}`, borderRadius: 7, color: copied ? "#4caf82" : "#c8a050", fontSize: 12, fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>
                {copied ? "✅ Copied!" : "📋 Copy Link"}
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Hola ${clientName}, te comparto tu evaluación financiera personalizada: ${generatedLink}`)}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "10px", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 7, color: "#25d366", fontSize: 12, fontWeight: "bold", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                💬 WhatsApp
              </a>
              <a href={`mailto:${clientEmail}?subject=Tu Evaluación Financiera Personalizada&body=Hola ${clientName},%0D%0A%0D%0ATe comparto tu evaluación financiera personalizada:%0D%0A${generatedLink}%0D%0A%0D%0AComplete el cuestionario cuando puedas.%0D%0A%0D%0A${advisorName}`} style={{ flex: 1, padding: "10px", background: "rgba(100,160,220,0.12)", border: "1px solid rgba(100,160,220,0.3)", borderRadius: 7, color: "#64a0dc", fontSize: 12, fontWeight: "bold", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                ✉️ Email
              </a>
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#445566", textAlign: "center" }}>
              The client will see their name and your name throughout the survey
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href={window.location.pathname} style={{ fontSize: 10, color: "#445566", textDecoration: "underline", cursor: "pointer" }}>
            ← Go to survey (as client preview)
          </a>
        </div>
      </div>
    </div>
  );
}


// ─── PRINT FULL REPORT ──────────────────────────────────────────────────────────
function printReport({ answers, plan, clientName, advisorName, lang }) {
  if (!plan) { window.print(); return; }
  const isEN = lang === "en";
  const { scores, gaps, budget, plan: budgetPlan } = plan;
  const avgScore = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.values(scores).length);
  const overallColor = avgScore >= 7 ? "#2d8a5e" : avgScore >= 4 ? "#b8860b" : "#c0392b";
  const overallLabel = avgScore >= 7 ? (isEN ? "Well Protected" : "Bien Protegido") : avgScore >= 4 ? (isEN ? "Partially Protected" : "Parcialmente Protegido") : (isEN ? "Significant Gaps" : "Brechas Significativas");

  const scoreRows = Object.entries(scores).map(([k, v]) => {
    const c = v >= 7 ? "#2d8a5e" : v >= 4 ? "#b8860b" : "#c0392b";
    const labels = { income: isEN?"Income Protection":"Protección de Ingresos", retirement: isEN?"Retirement":"Retiro", protection: isEN?"Protection":"Protección", tax: isEN?"Tax Strategy":"Estrategia Fiscal", debt: isEN?"Debt":"Deudas", estate: isEN?"Estate":"Patrimonio", medicare: isEN?"Medicare/SS":"Medicare/SS" };
    return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px">${labels[k]||k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right"><span style="color:${c};font-weight:600">${v}/10</span><div style="height:4px;background:#eee;border-radius:2px;margin-top:4px;width:120px;margin-left:auto"><div style="height:100%;width:${v*10}%;background:${c};border-radius:2px"></div></div></td></tr>`;
  }).join('');

  const gapRows = gaps.map(g => {
    const tagColor = g.tag.includes("CRIT") ? "#c0392b" : g.tag.includes("IMP") ? "#b8860b" : "#2d8a5e";
    return `<div style="border-left:3px solid ${tagColor};padding:10px 14px;margin-bottom:10px;background:#fafafa;border-radius:0 8px 8px 0"><div style="font-weight:600;font-size:13px;color:#1a1a1a;margin-bottom:3px">${g.icon||''} ${g.title}</div><div style="font-size:12px;color:#555">${g.body}</div><span style="font-size:10px;color:${tagColor};font-weight:700;letter-spacing:1px">${g.tag}</span></div>`;
  }).join('');

  const budgetRows = budgetPlan.map(item => `<tr><td style="padding:7px 12px;border-bottom:1px solid #eee;font-size:12px">${item.item}</td><td style="padding:7px 12px;border-bottom:1px solid #eee;font-size:11px;color:#888">${item.note}</td><td style="padding:7px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#c8a050;font-size:12px">${item.amount}</td></tr>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Financial Assessment — ${clientName||'Client'}</title>
  <style>
    body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;color:#1a1a1a;background:#fff}
    .header{background:linear-gradient(135deg,#0a1628,#112240);color:#e8c878;padding:30px 40px;display:flex;justify-content:space-between;align-items:center}
    .header h1{margin:0;font-size:22px;font-weight:700}
    .header .meta{font-size:12px;color:#c8a050;text-align:right;line-height:1.8}
    .score-hero{background:#f8f9fa;padding:30px 40px;text-align:center;border-bottom:1px solid #e8e8e8}
    .score-circle{display:inline-block;width:90px;height:90px;border-radius:50%;border:6px solid ${overallColor};line-height:78px;font-size:32px;font-weight:700;color:${overallColor};margin-bottom:10px}
    .section{padding:24px 40px;border-bottom:1px solid #f0f0f0}
    .section h2{font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;padding-bottom:6px;border-bottom:2px solid ${overallColor}}
    table{width:100%;border-collapse:collapse}
    .footer{background:#f8f9fa;padding:16px 40px;font-size:10px;color:#888;text-align:center;border-top:1px solid #e8e8e8}
    @media print{@page{margin:0.5in}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="header">
    <div><h1>⚖️ Financial Protection Assessment</h1><div style="font-size:12px;color:#8899aa;margin-top:4px">Asesor de Protección Financiera</div></div>
    <div class="meta">
      ${clientName ? `<div><strong>${clientName}</strong></div>` : ''}
      ${advisorName ? `<div>Advisor: ${advisorName}</div>` : ''}
      <div>${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
  </div>
  <div class="score-hero">
    <div class="score-circle">${avgScore}</div>
    <div style="font-size:18px;font-weight:700;color:${overallColor}">${overallLabel}</div>
    <div style="font-size:12px;color:#888;margin-top:6px">${isEN?'Overall Financial Health Score':'Puntuación General de Salud Financiera'} — ${isEN?'Based on':'Basado en'} ${Object.keys(scores).length} ${isEN?'categories':'categorías'}</div>
  </div>
  <div class="section">
    <h2>${isEN?'Score by Category':'Puntuación por Categoría'}</h2>
    <table>${scoreRows}</table>
  </div>
  <div class="section">
    <h2>${isEN?'Key Findings & Recommendations':'Hallazgos Clave y Recomendaciones'}</h2>
    ${gapRows}
  </div>
  <div class="section">
    <h2>${isEN?'Suggested Monthly Budget':'Presupuesto Mensual Sugerido'} — ${budget}/mo</h2>
    <table><thead><tr><th style="text-align:left;padding:8px 12px;background:#f5f5f5;font-size:12px">${isEN?'Item':'Elemento'}</th><th style="text-align:left;padding:8px 12px;background:#f5f5f5;font-size:12px">${isEN?'Note':'Nota'}</th><th style="text-align:right;padding:8px 12px;background:#f5f5f5;font-size:12px">${isEN?'Amount':'Monto'}</th></tr></thead><tbody>${budgetRows}</tbody></table>
  </div>
  <div class="footer">
    ${isEN?'For educational purposes only. Does not constitute legal, tax, or financial advice.':'Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero.'}
    ${advisorName?` Presented by ${advisorName}.`:''}
  </div>
  </body></html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 600);
}

// ─── SEND REPORT VIA EMAILJS ────────────────────────────────────────────────────
async function sendReport({ answers, plan, clientName, clientEmail, clientPhone, advisorName, lang }) {
  const { scores, gaps, budget } = plan;
  const avgScore = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.values(scores).length);

  // Build a clean summary of findings
  const findingsSummary = gaps.map(g => `[${g.tag}] ${g.title}: ${g.body}`).join(" | ");

  // All scores as individual fields (shows nicely in Formspree dashboard)
  const scoreFields = {};
  Object.entries(scores).forEach(([k, v]) => { scoreFields[`score_${k}`] = `${v}/10`; });

  const payload = {
    // ── Client info ──
    _subject: `📋 New Survey — ${clientName || "Anonymous"} | ${new Date().toLocaleDateString()}`,
    client_name:    clientName  || "N/A",
    client_email:   clientEmail || "N/A",
    client_phone:   clientPhone || "N/A",
    advisor_name:   advisorName || "N/A",
    language:       lang === "en" ? "English" : "Español",
    submitted_at:   new Date().toLocaleString(),

    // ── Overall result ──
    overall_score:  `${avgScore}/10`,
    budget_needed:  budget,
    key_findings:   findingsSummary,

    // ── Individual scores ──
    ...scoreFields,

    // ── Survey answers ──
    age:                  answers.age || "N/A",
    dependents:           answers.dependents || "N/A",
    young_children:       answers.young_children || "N/A",
    life_insurance:       answers.life_insurance || "N/A",
    final_expense:        answers.final_expense_coverage || "N/A",
    ltc_coverage:         answers.ltc || "N/A",
    disability:           answers.disability || "N/A",
    retirement_accounts:  answers.retirement_accounts || "N/A",
    emergency_fund:       answers.emergency_fund || "N/A",
    has_will:             answers.will || "N/A",
    credit_card_debt:     answers.credit_cards || "N/A",
    monthly_budget:       answers.monthly_budget || "N/A",
    tax_situation:        answers.tax_situation || "N/A",
    income_sources:       answers.income_sources || "N/A",
    bank_savings:         answers.bank_cd_savings || "N/A",
    knows_medicare:       answers.knows_medicare || "N/A",
    knows_ss:             answers.knows_ss || "N/A",
    has_business:         answers.has_business || "N/A",
    college_savings:      answers.college_savings || "N/A",
  };

  try {
    const res = await fetch("https://formspree.io/f/meeldjqa", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      console.log("✅ Survey sent to iprotections@yahoo.com via Formspree");
    } else {
      console.warn("Formspree error:", res.status);
    }
  } catch (err) {
    console.warn("Survey submission failed:", err);
    // Don't block the UI
  }
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FinancialBot() {
  // Read URL params — set by advisor
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get("mode");
  const clientName = params.get("name") || "";
  const clientEmail = params.get("email") || "";
  const clientPhone = params.get("phone") || "";
  const advisorName = params.get("advisor") || "";

  // If ?mode=advisor → show advisor portal
  if (urlMode === "advisor") return <AdvisorScreen />;

  const [lang, setLang] = useState(null);
  const [seenIntro, setSeenIntro] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showPlan, setShowPlan] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [showLTCScreen, setShowLTCScreen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [animating, setAnimating] = useState(false);
  const topRef = useRef(null);

  // Show impact screen first — it also handles language selection
  if (!seenIntro) {
    return <ImpactScreen clientName={clientName} advisorName={advisorName} onContinue={(selectedLang) => { setLang(selectedLang); setSeenIntro(true); }} />;
  }

  // Show thanks screen after submitting
  if (showThanks) {
    return <ThanksScreen lang={lang} clientName={clientName} advisorName={advisorName} onReset={() => { setAnswers({}); setCurrentModule(0); setShowPlan(false); setShowThanks(false); setShowLTCScreen(false); setPlan(null); setLang(null); setSeenIntro(false); }} />;
  }

  // Show LTC education screen before module E (index 4)
  if (showLTCScreen) {
    return <LTCEducationScreen lang={lang} onContinue={() => { setShowLTCScreen(false); setCurrentModule(4); topRef.current?.scrollIntoView({ behavior: "smooth" }); }} />;
  }

  const t = T[lang];
  const MODULES = t.modules;
  const module = MODULES[currentModule];

  const handleAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
  const isModuleComplete = () => module.questions.every(q => answers[q.id] && String(answers[q.id]).trim() !== "");

  const next = () => {
    // Before moving to Module E (index 4 = Protection), show LTC education screen
    if (currentModule === 3) {
      setShowLTCScreen(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (currentModule < MODULES.length - 1) {
      setAnimating(true);
      setTimeout(() => { setCurrentModule(p => p + 1); setAnimating(false); topRef.current?.scrollIntoView({ behavior: "smooth" }); }, 260);
    } else {
      window._fa_answers = answers;
      setPlan(generatePlan(answers, lang));
      setShowPlan(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const back = () => {
    if (showPlan) { setShowPlan(false); return; }
    if (currentModule > 0) { setCurrentModule(p => p - 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); }
  };
  const reset = () => { setAnswers({}); setCurrentModule(0); setShowPlan(false); setShowThanks(false); setShowLTCScreen(false); setPlan(null); setLang(null); setSeenIntro(false); };
  const progress = showPlan ? 100 : (currentModule / MODULES.length) * 100;

  const disclaimerText = lang === "en"
    ? `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero. ${advisorName ? `Presentado por ${advisorName}.` : ""} We will contact you to present personalized options and strategies.`
    : `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero. ${advisorName ? `Presentado por ${advisorName}.` : ""} Nos pondremos en contacto para presentarte opciones y estrategias personalizadas.`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #07090f 0%, #0b1120 50%, #080e1a 100%)", fontFamily: "'DM Sans', sans-serif", color: "#e8dcc8", position: "relative", overflow: "hidden" }}>
      <GlobalStyles />

      {/* Ambient background orbs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,80,0.04) 0%, transparent 70%)", top: "-100px", right: "-150px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,144,217,0.04) 0%, transparent 70%)", bottom: "10%", left: "-100px", pointerEvents: "none", zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div ref={topRef} style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(200,160,80,0.15)", padding: "0 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #c8a050, #e8c878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 16px rgba(200,160,80,0.35)", flexShrink: 0 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8c878", fontFamily: "'Playfair Display', serif", letterSpacing: 0.5 }}>{t.appTitle}</div>
              {clientName
                ? <div style={{ fontSize: 10, color: "#c8a05099", fontWeight: 500 }}>👤 {clientName}</div>
                : <div style={{ fontSize: 9, color: "#445566", letterSpacing: 2, textTransform: "uppercase" }}>{t.appSubtitle}</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!showPlan && (
              <div style={{ fontSize: 11, color: "#445566" }}>
                <span style={{ color: "#c8a050", fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: 13 }}>{currentModule + 1}</span>
                <span style={{ color: "#334455", margin: "0 3px" }}>/</span>
                <span>{MODULES.length}</span>
              </div>
            )}
            <button onClick={reset} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 10, letterSpacing: 0.5 }}>{t.switchLang}</button>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.04)", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #c8a050, #e8c878, #c8a050)", backgroundSize: "200% 100%", transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px rgba(200,160,80,0.6)", animation: "shimmer 2s linear infinite" }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 18px 60px", position: "relative", zIndex: 1 }}>
        {!showPlan ? (
          <div key={currentModule} className="anim-fadeup" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.22s ease" }}>

            {/* Module header */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              {/* Step dots */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 20 }}>
                {MODULES.map((m, i) => (
                  <div key={m.id} style={{
                    height: 4, borderRadius: 3,
                    width: i === currentModule ? 28 : (i < currentModule ? 14 : 8),
                    background: i < currentModule ? "rgba(200,160,80,0.6)" : i === currentModule ? "#e8c878" : "rgba(255,255,255,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: i === currentModule ? "0 0 8px rgba(232,200,120,0.7)" : "none"
                  }} />
                ))}
              </div>

              <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, rgba(200,160,80,0.15), rgba(200,160,80,0.06))", border: "1px solid rgba(200,160,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px", boxShadow: "0 4px 20px rgba(200,160,80,0.12)" }}>{module.icon}</div>

              <div style={{ fontSize: 10, color: "#c8a050", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{t.moduleLabel} {module.id}</div>
              <h2 className="fa-header" style={{ fontSize: 22, fontWeight: 700, color: "#f0e4c8", margin: "0 0 8px", letterSpacing: 0.3, lineHeight: 1.2 }}>{module.title}</h2>
              <p style={{ color: "#445566", fontSize: 11, margin: 0, fontStyle: "italic" }}>{t.answerHonestly}</p>
            </div>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {module.questions.map((q, qi) => (
                <div key={q.id} className="anim-fadeup" style={{
                  animationDelay: `${qi * 0.07}s`,
                  background: answers[q.id] ? "rgba(200,160,80,0.05)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${answers[q.id] ? "rgba(200,160,80,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 14, padding: "16px 18px",
                  transition: "border-color 0.25s, background 0.25s",
                  boxShadow: answers[q.id] ? "0 2px 16px rgba(200,160,80,0.07)" : "none"
                }}>
                  <label style={{ display: "block", fontSize: 12, color: "#9ab0c4", marginBottom: 10, fontWeight: 500, lineHeight: 1.5 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "rgba(200,160,80,0.12)", border: "1px solid rgba(200,160,80,0.25)", color: "#c8a050", fontSize: 9, fontWeight: 700, marginRight: 8, flexShrink: 0, verticalAlign: "middle" }}>{qi + 1}</span>
                    {q.label}
                  </label>
                  {q.type === "select" ? (
                    <select value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)} className="fa-select">
                      <option value="">{t.selectPlaceholder}</option>
                      {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={q.type} placeholder={q.placeholder} value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)} className="fa-input" />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "space-between", alignItems: "center" }}>
              {currentModule > 0
                ? <button onClick={back} className="btn-ghost">{t.backBtn}</button>
                : <div />}
              <button onClick={next} disabled={!isModuleComplete()} className="btn-primary" style={{ opacity: isModuleComplete() ? 1 : 0.35 }}>
                {currentModule === MODULES.length - 1 ? t.generateBtn : t.nextBtn}
              </button>
            </div>

            {/* Completion hint */}
            {!isModuleComplete() && (
              <p style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: "#334455", fontStyle: "italic" }}>
                {lang === "en" ? "Answer all questions above to continue" : "Responde todas las preguntas para continuar"}
              </p>
            )}
          </div>
        ) : (
          <PlanDisplay plan={plan} lang={lang} clientName={clientName} advisorName={advisorName} onBack={back} onReset={reset} onFinish={() => {
            // Send email via EmailJS
            sendReport({ answers, plan, clientName, clientEmail, clientPhone, advisorName, lang });
            setShowThanks(true);
          }} />
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "14px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 9, color: "#2a3340", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 6px" }}>{disclaimerText}</div>
        <a href="?mode=advisor" style={{ fontSize: 9, color: "#2a3340", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>Advisor Portal</a>
      </div>
    </div>
  );
}

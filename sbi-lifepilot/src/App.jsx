import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const CUSTOMERS = {
  rahul: {
    id: "C001", name: "Rahul Sharma", age: 25, occupation: "Software Engineer",
    income: 75000, expenses: 42000, savings: 33000, savingsGoal: 500000,
    riskProfile: "Moderate", goals: "Buy a car, Build emergency fund",
    city: "Mumbai", since: "2021", segment: "Young Professional",
    transactions: [
      { month: "Jan", income: 75000, expenses: 44000 },
      { month: "Feb", income: 75000, expenses: 39000 },
      { month: "Mar", income: 75000, expenses: 42000 },
      { month: "Apr", income: 75000, expenses: 45000 },
      { month: "May", income: 78000, expenses: 41000 },
      { month: "Jun", income: 78000, expenses: 43000 },
    ],
    spending: [
      { category: "Housing", amount: 15000, color: "#1e40af" },
      { category: "Food", amount: 8000, color: "#3b82f6" },
      { category: "Transport", amount: 5000, color: "#60a5fa" },
      { category: "Entertainment", amount: 4000, color: "#93c5fd" },
      { category: "Utilities", amount: 4000, color: "#bfdbfe" },
      { category: "Others", amount: 6000, color: "#dbeafe" },
    ],
    healthScore: 78,
    lifeEvent: "Car Purchase Planning",
  },
  priya: {
    id: "C002", name: "Priya Mehta", age: 32, occupation: "Doctor",
    income: 150000, expenses: 70000, savings: 80000, savingsGoal: 2000000,
    riskProfile: "Conservative", goals: "Buy home, Child education",
    city: "Delhi", since: "2018", segment: "High Income Professional",
    transactions: [
      { month: "Jan", income: 150000, expenses: 72000 },
      { month: "Feb", income: 150000, expenses: 68000 },
      { month: "Mar", income: 150000, expenses: 75000 },
      { month: "Apr", income: 155000, expenses: 71000 },
      { month: "May", income: 155000, expenses: 69000 },
      { month: "Jun", income: 155000, expenses: 70000 },
    ],
    spending: [
      { category: "Housing", amount: 25000, color: "#1e40af" },
      { category: "Food", amount: 15000, color: "#3b82f6" },
      { category: "Education", amount: 10000, color: "#60a5fa" },
      { category: "Healthcare", amount: 8000, color: "#93c5fd" },
      { category: "Shopping", amount: 7000, color: "#bfdbfe" },
      { category: "Others", amount: 5000, color: "#dbeafe" },
    ],
    healthScore: 91,
    lifeEvent: "Home Loan Planning",
  },
  arjun: {
    id: "C003", name: "Arjun Patel", age: 20, occupation: "Student",
    income: 15000, expenses: 12000, savings: 3000, savingsGoal: 100000,
    riskProfile: "Aggressive", goals: "Higher education abroad, Startup fund",
    city: "Ahmedabad", since: "2023", segment: "Student",
    transactions: [
      { month: "Jan", income: 15000, expenses: 13000 },
      { month: "Feb", income: 15000, expenses: 11000 },
      { month: "Mar", income: 15000, expenses: 12500 },
      { month: "Apr", income: 15000, expenses: 12000 },
      { month: "May", income: 18000, expenses: 11500 },
      { month: "Jun", income: 18000, expenses: 12000 },
    ],
    spending: [
      { category: "Education", amount: 5000, color: "#1e40af" },
      { category: "Food", amount: 3000, color: "#3b82f6" },
      { category: "Transport", amount: 1500, color: "#60a5fa" },
      { category: "Entertainment", amount: 1500, color: "#93c5fd" },
      { category: "Others", amount: 1000, color: "#bfdbfe" },
    ],
    healthScore: 52,
    lifeEvent: "Education Loan",
  },
};

const ADMIN_STATS = {
  totalCustomers: 2847634,
  newThisMonth: 18432,
  digitalAdoption: 73.4,
  avgEngagement: 8.2,
  topProducts: [
    { name: "SBI Smart SIP", count: 4821, growth: "+23%" },
    { name: "SBI Life eShield", count: 3940, growth: "+18%" },
    { name: "SBI Car Loan", count: 2810, growth: "+31%" },
    { name: "SBI Platinum Card", count: 2340, growth: "+15%" },
    { name: "SBI Education Loan", count: 1920, growth: "+41%" },
  ],
  segments: [
    { name: "Young Professionals", pct: 34 },
    { name: "High Income", pct: 22 },
    { name: "Students", pct: 18 },
    { name: "Retired", pct: 14 },
    { name: "Business Owners", pct: 12 },
  ],
  acquisition: [
    { month: "Jan", count: 14200 },
    { month: "Feb", count: 15100 },
    { month: "Mar", count: 16800 },
    { month: "Apr", count: 17200 },
    { month: "May", count: 17900 },
    { month: "Jun", count: 18432 },
  ],
};

// Agent descriptions shown in chat
const AGENTS = {
  profile: { name: "Profile Agent", color: "#1d4ed8", icon: "👤" },
  analysis: { name: "Analysis Agent", color: "#0369a1", icon: "📊" },
  recommendation: { name: "Recommendation Agent", color: "#0f766e", icon: "💡" },
  lifeEvent: { name: "Life Event Agent", color: "#7c3aed", icon: "🔮" },
  conversation: { name: "Conversation Agent", color: "#1e40af", icon: "🤖" },
};

// ─────────────────────────────────────────────
//  UTILITY
// ─────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString("en-IN");
const fmtRs = (n) => `₹${fmt(n)}`;

function ScoreRing({ score, size = 120 }) {
  const r = 45, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#64748b">/100</text>
    </svg>
  );
}

function MiniBar({ data, valueKey, labelKey, color = "#3b82f6", height = 120 }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: "100%", background: color, borderRadius: 4,
            height: `${(d[valueKey] / max) * (height - 24)}px`,
            minHeight: 4, transition: "height 0.5s ease"
          }} />
          <span style={{ fontSize: 9, color: "#64748b" }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, size = 140 }) {
  const total = data.reduce((a, d) => a + d.amount, 0);
  let cumAngle = -Math.PI / 2;
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.24;
  const slices = data.map(d => {
    const angle = (d.amount / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle), y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle), y2 = cy + r * Math.sin(cumAngle);
    const ix1 = cx + ir * Math.cos(cumAngle - angle), iy1 = cy + ir * Math.sin(cumAngle - angle);
    const ix2 = cx + ir * Math.cos(cumAngle), iy2 = cy + ir * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { ...d, path: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z` };
  });
  return (
    <svg width={size} height={size}>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={1.5} />)}
      <circle cx={cx} cy={cy} r={ir - 2} fill="white" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  API CALL TO CLAUDE
// ─────────────────────────────────────────────
async function callLifePilotAgent(messages, customerData, agentType = "conversation") {
  const systemPrompt = `You are SBI LifePilot AI, an autonomous multi-agent banking assistant for State Bank of India. You are currently acting as the ${AGENTS[agentType]?.name || "Conversation Agent"}.

Customer Profile:
${JSON.stringify(customerData, null, 2)}

You have 5 specialized agents:
1. Profile Agent - Understands customer data, builds financial profiles
2. Financial Analysis Agent - Analyzes transactions, finds spending patterns, gives saving suggestions  
3. Recommendation Agent - Recommends suitable banking products (savings, insurance, investments, loans, credit cards)
4. Life Event Prediction Agent - Predicts future financial needs based on life stage
5. Conversation Agent - Acts as the AI banker, answers customer queries naturally

Rules:
- Always respond in a warm, professional banking tone
- Use ₹ symbol for Indian Rupees
- Reference the customer's actual data when giving advice
- Keep responses concise (3-5 sentences max unless asked for detail)
- If recommending products, be specific: "SBI Smart SIP", "SBI Life eShield", "SBI Platinum Card", etc.
- Start responses with which agent is handling: "[${AGENTS[agentType]?.icon || "🤖"} ${AGENTS[agentType]?.name || "Conversation Agent"}]"
- Be genuinely helpful, not salesy`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "I'm having trouble connecting. Please try again.";
}

// ─────────────────────────────────────────────
//  PAGES
// ─────────────────────────────────────────────

function LandingPage({ onNavigate }) {
  const features = [
    { icon: "🧠", title: "AI Financial Twin", desc: "A living digital profile that understands your income, goals, and behavior to deliver hyper-personal banking." },
    { icon: "🤖", title: "Multi-Agent Architecture", desc: "Five specialized AI agents work in parallel — profiling, analyzing, recommending, predicting, and conversing." },
    { icon: "📈", title: "Predictive Life Events", desc: "Anticipates future needs — education loan, home purchase, or retirement — before you even ask." },
    { icon: "💡", title: "Real-time Recommendations", desc: "Products matched to your financial DNA, not demographic buckets." },
    { icon: "🔒", title: "Secure & Compliant", desc: "RBI-compliant architecture with end-to-end encryption and zero data leakage." },
    { icon: "📊", title: "Bank-Grade Analytics", desc: "Admin dashboard gives bank teams segment insights, acquisition trends, and product performance." },
  ];
  const pillars = [
    { num: "01", title: "Customer Acquisition", desc: "AI-driven onboarding with instant financial profiling converts prospects 3× faster than traditional KYC flows.", tag: "Acquisition" },
    { num: "02", title: "Digital Adoption", desc: "Conversational AI guides customers to use net banking, UPI, and investment products with zero friction.", tag: "Adoption" },
    { num: "03", title: "Digital Engagement", desc: "Proactive nudges, life event alerts, and personalized dashboards keep customers engaged daily.", tag: "Engagement" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "80px 24px 60px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Subtle grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 720 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", borderRadius: 100,
            padding: "6px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{ color: "#bfdbfe", fontSize: 13, fontWeight: 500 }}>Live Demo — Hackathon Build</span>
          </div>
          <div style={{ fontSize: 13, color: "#93c5fd", letterSpacing: "0.15em", fontWeight: 600, marginBottom: 12 }}>
            STATE BANK OF INDIA · INNOVATE 2025
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            SBI LifePilot AI
          </h1>
          <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#bfdbfe", fontWeight: 400, margin: "0 0 12px" }}>
            Your Autonomous AI Financial Companion
          </p>
          <p style={{ fontSize: 16, color: "#93c5fd", margin: "0 0 48px", lineHeight: 1.6 }}>
            Five AI agents. One unified banking experience. Acquisition, adoption, and engagement — solved.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("dashboard")} style={{
              background: "#fff", color: "#1d4ed8", border: "none",
              borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}>Try AI Banker →</button>
            <button onClick={() => onNavigate("admin")} style={{
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.4)", borderRadius: 10,
              padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer"
            }}>View Bank Dashboard</button>
          </div>
        </div>
        {/* Floating stats */}
        <div style={{ display: "flex", gap: 16, marginTop: 60, flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
          {[["2.8M+", "Customers Served"], ["₹4.2T", "Assets Managed"], ["91%", "CSAT Score"], ["3×", "Faster Onboarding"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "16px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 12, color: "#93c5fd", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Pillars */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, color: "#3b82f6", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>HACKATHON ALIGNMENT</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Three Pillars. One Solution.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {pillars.map(p => (
              <div key={p.num} style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #e2e8f0", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 20, right: 24, background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{p.tag}</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#dbeafe", lineHeight: 1 }}>{p.num}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 12px" }}>{p.title}</h3>
                <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Architecture */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, color: "#3b82f6", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>MULTI-AGENT SYSTEM</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Five Agents. Working Together.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {Object.entries(AGENTS).map(([k, a]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 12, padding: "24px 20px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Built for Real Banking</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0", display: "flex", gap: 16 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>Ready to meet your AI banker?</h2>
        <p style={{ color: "#bfdbfe", marginBottom: 32 }}>Select a demo customer profile and experience autonomous banking.</p>
        <button onClick={() => onNavigate("dashboard")} style={{
          background: "#fff", color: "#1d4ed8", border: "none", borderRadius: 10,
          padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer"
        }}>Launch Demo →</button>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
function CustomerSelector({ onSelect, selected }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {Object.entries(CUSTOMERS).map(([k, c]) => (
        <button key={k} onClick={() => onSelect(k)} style={{
          padding: "8px 16px", borderRadius: 8, border: "2px solid",
          borderColor: selected === k ? "#1d4ed8" : "#e2e8f0",
          background: selected === k ? "#eff6ff" : "#fff",
          color: selected === k ? "#1d4ed8" : "#64748b",
          fontWeight: 600, fontSize: 13, cursor: "pointer"
        }}>
          {c.name.split(" ")[0]}
        </button>
      ))}
    </div>
  );
}

function DashboardPage({ customerKey, onCustomerChange }) {
  const c = CUSTOMERS[customerKey];
  const savingPct = Math.round((c.savings / c.income) * 100);

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Customer Dashboard</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>AI-powered financial overview</p>
        </div>
        <CustomerSelector selected={customerKey} onSelect={onCustomerChange} />
      </div>

      {/* Profile Card */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, color: "#fff", display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#93c5fd", letterSpacing: "0.1em", fontWeight: 600 }}>CUSTOMER · {c.id}</div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 4px" }}>{c.name}</div>
          <div style={{ color: "#bfdbfe", fontSize: 15 }}>{c.occupation} · {c.age} yrs · {c.city}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "4px 12px", fontSize: 12 }}>{c.segment}</span>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "4px 12px", fontSize: 12 }}>Risk: {c.riskProfile}</span>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "4px 12px", fontSize: 12 }}>SBI since {c.since}</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#bfdbfe" }}>🎯 Goals: {c.goals}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <ScoreRing score={c.healthScore} size={130} />
          <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600 }}>Financial Health Score</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Monthly Income", value: fmtRs(c.income), color: "#16a34a", bg: "#f0fdf4", icon: "💰" },
          { label: "Monthly Expenses", value: fmtRs(c.expenses), color: "#dc2626", bg: "#fef2f2", icon: "💸" },
          { label: "Monthly Savings", value: fmtRs(c.savings), color: "#1d4ed8", bg: "#eff6ff", icon: "🏦" },
          { label: "Savings Rate", value: `${savingPct}%`, color: "#7c3aed", bg: "#faf5ff", icon: "📈" },
        ].map(card => (
          <div key={card.label} style={{ background: card.bg, borderRadius: 14, padding: 20, border: `1px solid ${card.color}22` }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Income vs Expense Trend */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Income vs Expense Trend</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Last 6 months</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 120 }}>
            {c.transactions.map((t, i) => {
              const maxV = Math.max(...c.transactions.map(x => x.income));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", display: "flex", gap: 2 }}>
                    <div style={{ flex: 1, background: "#3b82f6", borderRadius: "3px 3px 0 0", height: `${(t.income / maxV) * 96}px` }} />
                    <div style={{ flex: 1, background: "#ef4444", borderRadius: "3px 3px 0 0", height: `${(t.expenses / maxV) * 96}px` }} />
                  </div>
                  <span style={{ fontSize: 9, color: "#64748b" }}>{t.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "#3b82f6", borderRadius: 2, display: "inline-block" }} /> Income</span>
            <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "#ef4444", borderRadius: 2, display: "inline-block" }} /> Expenses</span>
          </div>
        </div>

        {/* Spending Breakdown */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Spending Breakdown</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Current month</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart data={c.spending} size={120} />
            <div style={{ flex: 1 }}>
              {c.spending.map(s => (
                <div key={s.category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>{s.category}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtRs(s.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>AI Life Event Prediction</div>
          <div style={{ color: "#1e40af", fontSize: 14 }}>
            Based on {c.name}'s profile, our <strong>Life Event Agent</strong> has predicted: <strong>{c.lifeEvent}</strong>.
            Recommended next step: Schedule a consultation with our product specialist.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function ChatPage({ customerKey, onCustomerChange }) {
  const c = CUSTOMERS[customerKey];
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `[🤖 Conversation Agent] Namaste ${c.name}! I'm your SBI LifePilot AI. I can see your financial health score is **${c.healthScore}/100** and you're saving **${fmtRs(c.savings)}** per month. How can I help you today?`,
      agent: "conversation"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const suggestions = [
    "How can I save more money?",
    "What investment plans suit me?",
    "Analyze my spending habits",
    "Do I need life insurance?",
    "Can I afford a home loan?",
    "Predict my financial future",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset on customer change
  useEffect(() => {
    setMessages([{
      role: "assistant",
      text: `[🤖 Conversation Agent] Namaste ${c.name}! I'm your SBI LifePilot AI. I can see your financial health score is **${c.healthScore}/100** and you're saving **${fmtRs(c.savings)}** per month. How can I help you today?`,
      agent: "conversation"
    }]);
  }, [customerKey]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    // Determine which agent to invoke based on keywords
    let agentType = "conversation";
    const lc = text.toLowerCase();
    if (lc.includes("spend") || lc.includes("analyz") || lc.includes("pattern")) agentType = "analysis";
    else if (lc.includes("invest") || lc.includes("product") || lc.includes("plan") || lc.includes("insurance") || lc.includes("loan") || lc.includes("card")) agentType = "recommendation";
    else if (lc.includes("predict") || lc.includes("future") || lc.includes("event") || lc.includes("life")) agentType = "lifeEvent";
    else if (lc.includes("profile") || lc.includes("who am i") || lc.includes("about me")) agentType = "profile";

    try {
      const apiMessages = newHistory.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const reply = await callLifePilotAgent(apiMessages, c, agentType);
      setMessages(prev => [...prev, { role: "assistant", text: reply, agent: agentType }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Connection error. Please check your API key.", agent: "conversation" }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    // Simple bold markdown
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>AI Banker Chat</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Powered by 5 specialized AI agents</p>
        </div>
        <CustomerSelector selected={customerKey} onSelect={onCustomerChange} />
      </div>

      {/* Agent Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(AGENTS).map(([k, a]) => (
          <span key={k} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>
            {a.icon} {a.name}
          </span>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", borderRadius: 16, padding: 20, marginBottom: 12, border: "1px solid #e2e8f0" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
            {m.role === "assistant" && (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginRight: 10, marginTop: 4 }}>
                {AGENTS[m.agent]?.icon || "🤖"}
              </div>
            )}
            <div style={{
              maxWidth: "72%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "#1d4ed8" : "#fff",
              color: m.role === "user" ? "#fff" : "#1e293b",
              fontSize: 14, lineHeight: 1.6, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: m.role === "assistant" ? "1px solid #e2e8f0" : "none"
            }}>
              {renderText(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div style={{ padding: "12px 16px", background: "#fff", borderRadius: "16px 16px 16px 4px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#1d4ed8", animation: `bounce ${0.6 + i * 0.1}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading} style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 100,
            padding: "5px 12px", fontSize: 12, color: "#1d4ed8", cursor: "pointer", fontWeight: 500
          }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask your AI banker anything..."
          disabled={loading}
          style={{
            flex: 1, padding: "14px 18px", borderRadius: 12, border: "2px solid #e2e8f0",
            fontSize: 14, outline: "none", background: "#fff",
            borderColor: input ? "#1d4ed8" : "#e2e8f0"
          }}
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{
          background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 12,
          padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
          opacity: (!input.trim() || loading) ? 0.5 : 1
        }}>Send</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function RecommendationsPage({ customerKey, onCustomerChange }) {
  const c = CUSTOMERS[customerKey];
  const [loading, setLoading] = useState(false);
  const [aiRecs, setAiRecs] = useState(null);

  const baseRecs = {
    rahul: [
      { product: "SBI Smart SIP", category: "Investment", icon: "📈", why: "Your 44% savings rate signals strong investment capacity. Systematic Investment Plan in ELSS funds can build ₹12L in 5 years while saving tax." },
      { product: "SBI Car Loan @ 7.25%", category: "Loan", icon: "🚗", why: "Your goal is buying a car. With ₹33K monthly savings and stable income, you qualify for up to ₹6L car loan with comfortable EMIs." },
      { product: "SBI Life eShield Next", category: "Insurance", icon: "🛡️", why: "At 25, term insurance is most affordable. ₹1 Cr cover costs only ₹850/month — critical financial safety net." },
      { product: "SBI Platinum Credit Card", category: "Credit Card", icon: "💳", why: "Your spending pattern on travel and dining qualifies you for 5× reward points and lounge access benefits." },
    ],
    priya: [
      { product: "SBI Home Loan @ 8.50%", category: "Loan", icon: "🏠", why: "Your income-to-expense ratio is excellent. You qualify for a ₹60L home loan with a comfortable EMI of ₹52,000/month." },
      { product: "SBI Life Smart Wealth Builder", category: "Investment", icon: "💰", why: "ULIP plan ideal for long-term wealth creation with life cover. Your risk profile suggests a balanced fund allocation." },
      { product: "SBI Child Education Plan", category: "Insurance", icon: "🎓", why: "With young children, securing education corpus of ₹30L by 2035 is feasible with ₹12,000/month SIP." },
      { product: "SBI Exclusive Savings Account", category: "Banking", icon: "🏦", why: "High-value customer benefits: 6% interest, dedicated RM, zero fee on all services." },
    ],
    arjun: [
      { product: "SBI Education Loan", category: "Loan", icon: "🎓", why: "For higher education abroad, SBI offers up to ₹1.5 Cr with 1-year moratorium and competitive 8.15% rate." },
      { product: "SBI Fixed Deposit (Tax Saver)", category: "Investment", icon: "📊", why: "Start building a savings habit with ₹500/month FD. Tax-saving FD offers 6.5% interest and ₹1.5L deduction." },
      { product: "SBI Student Credit Card", category: "Credit Card", icon: "💳", why: "Build credit history early. ₹5,000 limit with fuel surcharge waiver and education fee reward points." },
      { product: "SBI Life Student Insurance", category: "Insurance", icon: "🛡️", why: "Affordable accident and health cover at ₹299/month — essential for a student going abroad." },
    ],
  };

  const recs = baseRecs[customerKey] || baseRecs.rahul;

  const getAIInsight = async () => {
    setLoading(true);
    try {
      const resp = await callLifePilotAgent([
        { role: "user", content: `As the Recommendation Agent, give me a 3-line summary of the top financial priority for ${c.name} (${c.occupation}, income ${fmtRs(c.income)}, goals: ${c.goals}). Be specific and actionable.` }
      ], c, "recommendation");
      setAiRecs(resp);
    } catch { setAiRecs("Unable to fetch AI insight at this time."); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>AI Recommendations</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Personalized products for {c.name}</p>
        </div>
        <CustomerSelector selected={customerKey} onSelect={onCustomerChange} />
      </div>

      {/* AI Insight Banner */}
      <div style={{ background: "#1e3a8a", borderRadius: 14, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 RECOMMENDATION AGENT</div>
          {aiRecs ? (
            <div style={{ color: "#e0f2fe", fontSize: 14, lineHeight: 1.6 }}>{aiRecs}</div>
          ) : (
            <div style={{ color: "#bfdbfe", fontSize: 14 }}>Click to get a live AI analysis of {c.name}'s top financial priority.</div>
          )}
        </div>
        <button onClick={getAIInsight} disabled={loading} style={{
          background: "#fff", color: "#1d4ed8", border: "none", borderRadius: 10,
          padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13,
          opacity: loading ? 0.7 : 1, flexShrink: 0
        }}>{loading ? "Analyzing..." : "Get AI Insight"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {recs.map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ fontSize: 32 }}>{r.icon}</div>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{r.category}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 10 }}>{r.product}</div>
            <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{r.why}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Apply Now</button>
              <button style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function HealthPage({ customerKey, onCustomerChange }) {
  const c = CUSTOMERS[customerKey];
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const scoreColor = c.healthScore >= 80 ? "#16a34a" : c.healthScore >= 60 ? "#d97706" : "#dc2626";
  const scoreLabel = c.healthScore >= 80 ? "Excellent" : c.healthScore >= 60 ? "Good" : "Needs Attention";

  const factors = [
    { label: "Savings Rate", score: Math.min(100, Math.round((c.savings / c.income) * 250)), desc: `${Math.round((c.savings / c.income) * 100)}% of income saved` },
    { label: "Expense Control", score: Math.round(100 - (c.expenses / c.income) * 100), desc: `Expense ratio: ${Math.round((c.expenses / c.income) * 100)}%` },
    { label: "Income Stability", score: c.occupation === "Student" ? 45 : c.occupation === "Doctor" ? 98 : 85, desc: "Based on employment type" },
    { label: "Goal Progress", score: Math.min(100, Math.round((c.savings * 12 / c.savingsGoal) * 100)), desc: `${fmtRs(c.savings * 12)} / ${fmtRs(c.savingsGoal)} annual target` },
  ];

  const getAnalysis = async () => {
    setLoading(true);
    try {
      const resp = await callLifePilotAgent([
        { role: "user", content: `As the Financial Analysis Agent, give a brief (4-5 sentences) financial health analysis for ${c.name}. Cover: 1) What their score of ${c.healthScore} means, 2) Top 2 strengths, 3) Top 1 area to improve, 4) One specific action they can take this month.` }
      ], c, "analysis");
      setAnalysis(resp);
    } catch { setAnalysis("Unable to fetch analysis."); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Financial Health</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>AI-calculated health score & breakdown</p>
        </div>
        <CustomerSelector selected={customerKey} onSelect={onCustomerChange} />
      </div>

      {/* Score Hero */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, marginBottom: 20, border: "1px solid #e2e8f0", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ScoreRing score={c.healthScore} size={160} />
          <div style={{ fontWeight: 800, color: scoreColor, fontSize: 18 }}>{scoreLabel}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 20 }}>Score Breakdown</h3>
          {factors.map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: f.score >= 70 ? "#16a34a" : f.score >= 50 ? "#d97706" : "#dc2626" }}>{f.score}/100</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 100, height: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100, width: `${f.score}%`,
                  background: f.score >= 70 ? "#16a34a" : f.score >= 50 ? "#d97706" : "#dc2626",
                  transition: "width 1s ease"
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Progress */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 20, border: "1px solid #e2e8f0" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Savings Goal Progress</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Annual savings pace</span>
          <span style={{ fontWeight: 700 }}>{fmtRs(c.savings * 12)} / {fmtRs(c.savingsGoal)}</span>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 100, height: 16, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 100,
            width: `${Math.min(100, Math.round((c.savings * 12 / c.savingsGoal) * 100))}%`,
            background: "linear-gradient(90deg, #1d4ed8, #3b82f6)"
          }} />
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
          {Math.round((c.savings * 12 / c.savingsGoal) * 100)}% of annual goal · {c.goals}
        </div>
      </div>

      {/* AI Analysis */}
      <div style={{ background: "#f0fdf4", borderRadius: 14, padding: 24, border: "1px solid #bbf7d0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: analysis ? 16 : 0, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontWeight: 700, color: "#15803d", fontSize: 15 }}>📊 Financial Analysis Agent</div>
          <button onClick={getAnalysis} disabled={loading} style={{
            background: "#16a34a", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}>{loading ? "Analyzing..." : "Run AI Analysis"}</button>
        </div>
        {analysis && <div style={{ color: "#166534", fontSize: 14, lineHeight: 1.7 }}>{analysis}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function AdminPage() {
  const segColors = ["#1e40af", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"];

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Bank Admin Dashboard</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Acquisition, engagement & product analytics</p>
      </div>

      {/* Top KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Total Customers", value: "28,47,634", icon: "👥", color: "#1d4ed8", bg: "#eff6ff" },
          { label: "New This Month", value: "18,432", icon: "➕", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Digital Adoption", value: "73.4%", icon: "📱", color: "#7c3aed", bg: "#faf5ff" },
          { label: "Avg Engagement Score", value: "8.2/10", icon: "⭐", color: "#d97706", bg: "#fffbeb" },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 14, padding: "20px 18px", border: `1px solid ${k.color}22` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Acquisition Trend */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Customer Acquisition Trend</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>New customers per month</div>
          <MiniBar data={ADMIN_STATS.acquisition} valueKey="count" labelKey="month" color="#1d4ed8" height={120} />
        </div>

        {/* Customer Segments */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Customer Segments</div>
          {ADMIN_STATS.segments.map((s, i) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{s.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: segColors[i] }}>{s.pct}%</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 100, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 100, width: `${s.pct}%`, background: segColors[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Top AI-Recommended Products</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Rank", "Product", "Recommendations", "Growth"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_STATS.topProducts.map((p, i) => (
                <tr key={p.name} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>#{i + 1}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14 }}>
                    <div style={{ background: "#eff6ff", borderRadius: 100, padding: "3px 10px", display: "inline-block", fontSize: 13, fontWeight: 600, color: "#1d4ed8" }}>{p.count.toLocaleString()}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>{p.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pillar Coverage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 20 }}>
        {[
          { pillar: "Acquisition", score: "92%", desc: "AI-powered onboarding reduces drop-off by 63%", color: "#1d4ed8" },
          { pillar: "Digital Adoption", score: "73%", desc: "Conversational AI guides users to digital products", color: "#0f766e" },
          { pillar: "Engagement", score: "8.2/10", desc: "Proactive nudges increase monthly logins by 4.2×", color: "#7c3aed" },
        ].map(p => (
          <div key={p.pillar} style={{ background: "#fff", borderRadius: 14, padding: 20, border: `2px solid ${p.color}33`, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: p.color, marginBottom: 4 }}>{p.score}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.pillar}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
const NAV = [
  { id: "landing", label: "Home", icon: "🏠" },
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "chat", label: "AI Banker", icon: "💬" },
  { id: "recommendations", label: "Recommendations", icon: "💡" },
  { id: "health", label: "Health Score", icon: "❤️" },
  { id: "admin", label: "Admin", icon: "🏛️" },
];

export default function App() {
  const [page, setPage] = useState("landing");
  const [customerKey, setCustomerKey] = useState("rahul");
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        button:hover { opacity: 0.9; }
      `}</style>

      {/* Top Nav */}
      {page !== "landing" && (
        <nav style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
            <div style={{ width: 32, height: 32, background: "#1d4ed8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>SBI</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b" }}>LifePilot AI</span>
            <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>DEMO</span>
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 2 }}>
            {NAV.filter(n => n.id !== "landing").map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                background: page === n.id ? "#eff6ff" : "transparent",
                color: page === n.id ? "#1d4ed8" : "#64748b",
                border: "none", borderRadius: 8, padding: "8px 14px",
                fontSize: 13, fontWeight: page === n.id ? 700 : 500, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5
              }}>
                <span>{n.icon}</span>
                <span style={{ display: "none" }} className="navlabel">{n.label}</span>
                <span style={{ fontSize: 12 }}>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main>
        {page === "landing" && <LandingPage onNavigate={setPage} />}
        {page === "dashboard" && <DashboardPage customerKey={customerKey} onCustomerChange={setCustomerKey} />}
        {page === "chat" && <ChatPage customerKey={customerKey} onCustomerChange={setCustomerKey} />}
        {page === "recommendations" && <RecommendationsPage customerKey={customerKey} onCustomerChange={setCustomerKey} />}
        {page === "health" && <HealthPage customerKey={customerKey} onCustomerChange={setCustomerKey} />}
        {page === "admin" && <AdminPage />}
      </main>
    </div>
  );
}

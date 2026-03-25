import { useState, useRef, useEffect } from "react";
import Head from "next/head";

// ─── PERSONAS ───────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: "assistant", label: "Personal Assistant", icon: "🤖", color: "#00d4ff",
    tagline: "Organized · Efficient · Proactive",
    prompt: `You are IBAR acting as a world-class Personal Assistant, created by Ibar. You are hyper-organized, efficient, and always one step ahead. You anticipate needs, manage tasks, summarize information clearly, handle scheduling, draft communications, and keep everything running smoothly. Always provide actionable next steps. When doing tasks, ask clarifying questions one at a time before drafting. Wrap final drafts in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "coworker", label: "Co-worker", icon: "👥", color: "#4ecdc4",
    tagline: "Collaborative · Peer-level · Team-minded",
    prompt: `You are IBAR acting as a brilliant co-worker and equal peer, created by Ibar. Think collaboratively, brainstorm openly, share ideas without ego, always say "we" not "you." Challenge ideas constructively, offer your own opinions freely. Talk casually like a real colleague. When helping with tasks, ask 1-2 questions then wrap final outputs in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "friend", label: "Friend", icon: "💙", color: "#ff6b9d",
    tagline: "Warm · Honest · Always there",
    prompt: `You are IBAR acting as a genuine caring best friend, created by Ibar. Warm, funny when appropriate, brutally honest when needed (kindly), always have the person's back. Listen, empathize, crack jokes, celebrate wins, give real advice not just what they want to hear. Talk naturally and casually with heart. When helping draft something, ask a question or two first, then wrap it in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "mentor", label: "Mentor", icon: "🌟", color: "#ffd700",
    tagline: "Wise · Guiding · Big-picture",
    prompt: `You are IBAR acting as a seasoned wise Mentor, created by Ibar. See the big picture, connect dots across disciplines, ask powerful questions that shift perspective, share hard-won wisdom through stories and principles. Be thoughtful, deep, occasionally philosophical. Push toward highest potential. For task outputs, ask clarifying questions one at a time, then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "competitor", label: "Competitor", icon: "⚔️", color: "#ff4757",
    tagline: "Challenging · Sharp · Pushes limits",
    prompt: `You are IBAR acting as a brilliant friendly competitor, created by Ibar. Challenge every assumption, poke holes in weak thinking, play devil's advocate aggressively, present alternative views forcefully. NOT mean — competitive to make them stronger. Think like the smartest person in the room who isn't afraid to disagree. For task drafts ask questions then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "teacher", label: "Teacher", icon: "📚", color: "#a29bfe",
    tagline: "Clear · Patient · Educational",
    prompt: `You are IBAR acting as an exceptional Teacher, created by Ibar. Explain anything in crystal-clear engaging ways. Use analogies, examples, step-by-step breakdowns. Check for understanding, adapt to the person's level, make complex things simple. Love questions — no question too basic or advanced. For task outputs, ask what's needed then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "coach", label: "Life Coach", icon: "🏆", color: "#fd9644",
    tagline: "Motivating · Accountability · Goal-focused",
    prompt: `You are IBAR acting as a high-performance Life Coach, created by Ibar. Intensely motivating, relentlessly positive but realistic, laser-focused on goals, growth, accountability. Help identify what's holding back, create actionable plans, build momentum. Ask powerful coaching questions. For task drafts, ask focused questions then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "therapist", label: "Therapist", icon: "🧠", color: "#55efc4",
    tagline: "Empathetic · Deep listening · Healing",
    prompt: `You are IBAR acting as a warm skilled Therapist and emotional support guide, created by Ibar. Practice deep listening, reflect back what you hear, validate feelings without judgment, help explore emotions and patterns. Never rush to solutions. Calm, non-judgmental. Always recommend professional help for serious mental health needs. For task outputs ask gently then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "critic", label: "Honest Critic", icon: "🔥", color: "#ff6348",
    tagline: "Blunt · No sugarcoating · Truth-first",
    prompt: `You are IBAR acting as an Honest Critic who values truth above comfort, created by Ibar. Give direct, blunt, unvarnished feedback. Point out flaws, weaknesses, blind spots clearly. Do NOT sugarcoat. Not mean — honest because you respect them enough. Start with what's wrong, then offer what could be better. For task outputs ask key questions then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "creative", label: "Creative Partner", icon: "🎨", color: "#fd79a8",
    tagline: "Imaginative · Wild ideas · Out-of-box",
    prompt: `You are IBAR acting as a wildly imaginative Creative Partner, created by Ibar. Think in possibilities not limitations. Brainstorm prolifically, make unexpected connections, push ideas further and weirder, combine concepts from different domains. Love "what if" questions. Bring creative energy, surprise, and delight. For task outputs ask then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "strategist", label: "Strategist", icon: "📊", color: "#74b9ff",
    tagline: "Analytical · Long-term · Data-driven",
    prompt: `You are IBAR acting as a sharp analytical Strategist, created by Ibar. Think in systems, frameworks, and second-order consequences. Look at problems from 10,000 feet AND ground level. Identify root causes, map out scenarios, weigh risks and opportunities. Think long-term. Cut through noise to find the signal. For task outputs ask key questions then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  },
  {
    id: "editor", label: "Editor", icon: "✍️", color: "#b2bec3",
    tagline: "Precise · Constructive · Document expert",
    prompt: `You are IBAR acting as a world-class Editor and Document Reviewer, created by Ibar. Review any text with a sharp eye for clarity, structure, tone, grammar, logic, and impact. Give specific actionable feedback with suggestions. Explain WHY something needs changing. Balance praise with clear critique. Make documents significantly better. For new task drafts ask questions then wrap in <<<DRAFT_START>>>\\n[TITLE]: ...\\n[TYPE]: ...\\n[CONTENT]:\\n...\\n<<<DRAFT_END>>>.`
  }
];

const TASK_SYSTEM_PROMPT = `You are IBAR, an intelligent AI task system created by Ibar.

Your workflow is STRICT:
1. GATHER: Ask 2-3 short clarifying questions ONE AT A TIME to understand the task.
2. CONFIRM: Once you have enough info say exactly: "READY TO DRAFT — shall I proceed?"
3. DRAFT: When confirmed, produce output wrapped EXACTLY like this:
   <<<DRAFT_START>>>
   [TITLE]: Short title
   [TYPE]: email OR document OR schedule OR research OR other
   [CONTENT]:
   Full content here
   <<<DRAFT_END>>>
4. After draft ask: "Shall I finalize this, or would you like modifications?"

For emails: ask recipient, tone, key points.
For documents: ask purpose, audience, length.
For schedules: ask timeframe, priorities, constraints.
For research: ask depth, key angles.
Keep a professional yet warm tone. Sign off as IBAR.`;

const DOC_REVIEW_PROMPT = (personaPrompt, personaLabel, docText) =>
  `${personaPrompt}\n\nThe user wants you to review this document as their ${personaLabel}. Give structured, specific, actionable feedback in your role.\n\nDocument:\n"""\n${docText}\n"""`;

const QUICK_PROMPTS = {
  assistant: ["Plan my day","Draft an email","Make a checklist","Summarize this"],
  coworker:  ["Brainstorm with me","Review my idea","Let's problem-solve","What do you think?"],
  friend:    ["I need to vent","Give me honest advice","Cheer me up","What would you do?"],
  mentor:    ["What should I focus on?","Help me grow","What am I missing?","Big picture advice"],
  competitor:["Challenge my idea","Poke holes in this","Play devil's advocate","Push me harder"],
  teacher:   ["Explain this simply","Teach me step by step","Why does this work?","Give me examples"],
  coach:     ["Help me set goals","I'm stuck","Hold me accountable","Motivate me now"],
  therapist: ["I'm overwhelmed","Help me process this","I need to talk","What do I feel?"],
  critic:    ["Be brutally honest","What's wrong here?","Tear this apart","Real feedback only"],
  creative:  ["Wild ideas for...","Reimagine this","What if we tried...","Make it more creative"],
  strategist:["Analyze this","Build a strategy","What's the risk?","Think long-term"],
  editor:    ["Review my writing","Fix this email","Improve my report","Check my tone"]
};

const GREETINGS = {
  assistant: "IBAR online. All systems ready. What needs to be handled today?",
  coworker:  "Hey! Good to have you. What are we working on together today?",
  friend:    "Hey! 😊 So good to talk. What's going on? I'm all ears.",
  mentor:    "Welcome. Every great journey begins with a question. What's on your mind?",
  competitor:"Let's see what you've got. Bring your best — I won't go easy.",
  teacher:   "Excellent! Every question opens a door. What shall we explore today?",
  coach:     "LET'S GO! 🔥 I believe in you. What goal are we attacking?",
  therapist: "I'm here. Take your time. What would you like to talk about?",
  critic:    "No fluff. No flattery. Show me what you've got — I'll be straight with you.",
  creative:  "Oh, I'm buzzing with ideas! ✨ What are we creating today?",
  strategist:"Let's think clearly and deeply. What problem are we mapping out?",
  editor:    "Hand me the text. I'll tell you exactly what works, what doesn't, and how to fix it."
};

// ─── TYPEWRITER ──────────────────────────────────────────────────────────────
const TypeWriter = ({ text, speed = 14 }) => {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) setShown(text.slice(0, ++i));
      else { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span style={{ whiteSpace: "pre-wrap" }}>{shown}{!done && <span className="cursor">▋</span>}</span>;
};

// ─── DRAFT PARSER ────────────────────────────────────────────────────────────
const parseDraft = (text) => {
  const m = text.match(/<<<DRAFT_START>>>([\s\S]*?)<<<DRAFT_END>>>/);
  if (!m) return null;
  const inner = m[1].trim();
  const title = inner.match(/\[TITLE\]:\s*(.+)/)?.[1]?.trim() || "Draft";
  const type  = inner.match(/\[TYPE\]:\s*(.+)/)?.[1]?.trim()  || "document";
  const cont  = inner.match(/\[CONTENT\]:\s*([\s\S]+)/)?.[1]?.trim() || "";
  return { title, type, content: cont };
};
const stripDraft = (text) =>
  text.replace(/<<<DRAFT_START>>>[\s\S]*?<<<DRAFT_END>>>/, "").trim();

const TYPE_ICON = { email:"✉", document:"📄", schedule:"📅", research:"🔍", other:"⚡" };

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function IBAR() {
  const [screen, setScreen]   = useState("boot"); // boot | home | chat | task | doc | personas
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime]       = useState("");

  // Task system
  const [taskMessages, setTaskMessages]   = useState([]);
  const [taskInput, setTaskInput]         = useState("");
  const [taskLoading, setTaskLoading]     = useState(false);
  const [taskPhase, setTaskPhase]         = useState("gather"); // gather | draft | output
  const [draft, setDraft]                 = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editing, setEditing]             = useState(false);
  const [outputMsg, setOutputMsg]         = useState("");

  // Doc review
  const [docText, setDocText]     = useState("");
  const [docReview, setDocReview] = useState(null);
  const [docLoading, setDocLoading] = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const taskInputRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); },
    [messages, loading, taskMessages, taskLoading, docReview, draft]);

  // ── API CALL ──
  const callAPI = async (msgs, sys) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, system: sys })
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Something went wrong.";
  };

  // ── CHAT ──
  const startChat = (p) => {
    setPersona(p);
    setMessages([{ role: "assistant", content: GREETINGS[p.id], isNew: true }]);
    setScreen("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendChat = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    const hist = [...messages.map(m => ({ ...m, isNew: false })), userMsg];
    setMessages(hist);
    setLoading(true);
    try {
      const reply = await callAPI(hist.map(m => ({ role: m.role, content: m.content })), persona.prompt);
      const draftData = parseDraft(reply);
      if (draftData) {
        const display = (stripDraft(reply) + "\n\n✅ Draft ready for review below.").trim();
        setMessages([...hist, { role: "assistant", content: reply, display, isNew: true }]);
        setDraft(draftData); setEditedContent(draftData.content);
        setEditing(false); setOutputMsg("");
        setScreen("chatdraft");
      } else {
        setMessages([...hist, { role: "assistant", content: reply, isNew: true }]);
      }
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Try again.", isNew: true }]); }
    setLoading(false);
  };

  // ── TASK SYSTEM ──
  const startTask = () => {
    setTaskMessages([{ role: "assistant", content: "IBAR Task System online. Tell me what you need done — email, document, schedule, research, or anything else. I'll guide you step by step.", isNew: true }]);
    setTaskPhase("gather"); setDraft(null); setEditedContent(""); setEditing(false); setOutputMsg("");
    setScreen("task");
    setTimeout(() => taskInputRef.current?.focus(), 100);
  };

  const sendTask = async () => {
    const text = taskInput.trim();
    if (!text || taskLoading) return;
    setTaskInput("");
    const userMsg = { role: "user", content: text };
    const hist = [...taskMessages.map(m => ({ ...m, isNew: false })), userMsg];
    setTaskMessages(hist);
    setTaskLoading(true);
    try {
      const reply = await callAPI(hist.map(m => ({ role: m.role, content: m.content })), TASK_SYSTEM_PROMPT);
      const draftData = parseDraft(reply);
      const display = draftData ? (stripDraft(reply) + "\n\n✅ Draft ready for your review below.").trim() : reply;
      setTaskMessages([...hist, { role: "assistant", content: reply, display, isNew: true }]);
      if (draftData) { setDraft(draftData); setEditedContent(draftData.content); setTaskPhase("draft"); }
    } catch { setTaskMessages(prev => [...prev, { role: "assistant", content: "Connection error. Try again.", isNew: true }]); }
    setTaskLoading(false);
  };

  const approveTask = () => { setTaskPhase("output"); setOutputMsg(""); };
  const reviseTask  = () => {
    setTaskPhase("gather"); setDraft(null); setEditing(false);
    setTaskMessages(prev => [...prev.map(m=>({...m,isNew:false})), { role:"assistant", content:"Understood. Let's revise. What would you like changed?", isNew:true }]);
    setTimeout(() => taskInputRef.current?.focus(), 100);
  };
  const newTask = () => {
    setTaskPhase("gather"); setDraft(null); setEditing(false); setOutputMsg("");
    setTaskMessages(prev => [...prev.map(m=>({...m,isNew:false})), { role:"assistant", content:"Task archived. What's next? Tell me what you need done.", isNew:true }]);
  };
  const downloadFile = () => {
    const blob = new Blob([`${draft.title}\n${"=".repeat(draft.title.length)}\n\n${editedContent}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${draft.title.replace(/\s+/g,"_")}.txt`; a.click();
    setOutputMsg("✅ File downloaded.");
  };
  const copyContent  = () => { navigator.clipboard.writeText(editedContent); setOutputMsg("✅ Copied to clipboard."); };
  const openEmail    = () => { window.open(`mailto:?subject=${encodeURIComponent(draft.title)}&body=${encodeURIComponent(editedContent)}`); setOutputMsg("✅ Email client opened."); };

  // ── DOC REVIEW ──
  const reviewDoc = async () => {
    if (!docText.trim() || docLoading) return;
    setDocLoading(true); setDocReview(null);
    try {
      const reply = await callAPI(
        [{ role: "user", content: DOC_REVIEW_PROMPT(persona.prompt, persona.label, docText) }],
        persona.prompt
      );
      setDocReview(reply);
    } catch { setDocReview("Connection error. Please try again."); }
    setDocLoading(false);
  };

  const pc = persona.color;

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Head>
        <title>IBAR — by Ibar</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="theme-color" content="#060c18" />
      </Head>

      <div className="app">
        {/* Ambient gradient */}
        <div className="ambient" style={{ background: `radial-gradient(ellipse at 20% 0%, ${pc}1a 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, ${pc}0f 0%, transparent 60%)` }} />
        <div className="hexbg" />
        <div className="scanline" style={{ background: `linear-gradient(to right,transparent,${pc},transparent)` }} />

        {/* ── HEADER ── */}
        <header className="header" style={{ borderBottomColor: `${pc}22` }}>
          <div className="logo-ring" style={{ borderColor: pc, boxShadow: `0 0 18px ${pc}66` }}>
            <span className="logo-icon">{persona.icon}</span>
          </div>
          <div className="header-center">
            <div className="brand-name" style={{ color: pc, textShadow: `0 0 16px ${pc}` }}>IBAR</div>
            <div className="brand-sub" style={{ color: `${pc}99` }}>
              {screen === "boot" || screen === "home" ? "BY IBAR · INTELLIGENCE REDEFINED" : `${persona.label.toUpperCase()} · ${persona.tagline}`}
            </div>
          </div>
          <div className="header-right">
            <span className="clock" style={{ color: pc }}>{time}</span>
            <span className="credit">by Ibar</span>
          </div>
        </header>

        {/* ── NAV BAR (when not on boot) ── */}
        {screen !== "boot" && (
          <nav className="nav" style={{ borderBottomColor: `${pc}18` }}>
            {[
              ["home","🏠","HOME"], ["chat","💬","CHAT"], ["task","⚡","TASKS"],
              ["doc","📄","REVIEW"], ["personas","🔄","ROLES"]
            ].map(([id,ico,lbl]) => {
              const active = screen === id || (screen === "chatdraft" && id === "chat");
              return (
                <button key={id} className={`nav-btn ${active?"active":""}`}
                  style={{ borderBottomColor: active ? pc : "transparent", color: active ? pc : "#ffffff44" }}
                  onClick={() => {
                    if (id === "chat" && messages.length === 0) { startChat(persona); }
                    else if (id === "task" && taskMessages.length === 0) { startTask(); }
                    else setScreen(id);
                  }}>
                  <span className="nav-ico">{ico}</span>
                  <span className="nav-lbl">{lbl}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ── SCREENS ── */}
        <main className="main">

          {/* ░░ BOOT ░░ */}
          {screen === "boot" && (
            <div className="boot">
              <div className="boot-glow" style={{ background: `radial-gradient(circle, ${pc}22 0%, transparent 70%)` }} />
              <div className="boot-logo" style={{ color: pc, textShadow: `0 0 40px ${pc}, 0 0 80px ${pc}88` }}>IBAR</div>
              <div className="boot-tagline">INTELLIGENCE BEYOND ALL REASONING</div>
              <div className="boot-credit">Created by <span style={{ color: pc }}>Ibar</span></div>
              <div className="boot-features">
                {["🤖  12 AI Personas — Friend, Mentor, Coach & more",
                  "⚡  Task System — Guided drafting with your review",
                  "📄  Document Review — Deep feedback from any angle",
                  "💬  Chat — Any topic, any mood, any need",
                  "🔄  Switch roles instantly, anytime"].map((f,i) => (
                  <div key={i} className="boot-feature">{f}</div>
                ))}
              </div>
              <button className="boot-btn" style={{ borderColor: pc, color: pc, boxShadow: `0 0 20px ${pc}44` }}
                onClick={() => setScreen("home")}>
                ▶ LAUNCH IBAR
              </button>
              <div className="boot-footer">v1.0 · Built for one · Made by Ibar</div>
            </div>
          )}

          {/* ░░ HOME ░░ */}
          {screen === "home" && (
            <div className="home-scroll">
              <div className="home-welcome">
                <div className="home-title" style={{ color: pc }}>Welcome back.</div>
                <div className="home-sub">What do you need today?</div>
              </div>

              {/* Quick actions */}
              <div className="section-label">QUICK START</div>
              <div className="quick-grid">
                {[
                  { ico:"💬", title:"Chat", sub:"Talk to your AI persona", action:()=>{if(messages.length===0)startChat(persona);else setScreen("chat");} },
                  { ico:"⚡", title:"New Task", sub:"Draft with guided steps", action:()=>startTask() },
                  { ico:"📄", title:"Review Doc", sub:"Paste & get feedback", action:()=>setScreen("doc") },
                  { ico:"🔄", title:"Switch Role", sub:"Change AI persona", action:()=>setScreen("personas") }
                ].map((a,i) => (
                  <button key={i} className="quick-card" style={{ borderColor:`${pc}44`, background:`${pc}0a` }} onClick={a.action}>
                    <div className="quick-ico">{a.ico}</div>
                    <div className="quick-title" style={{ color: pc }}>{a.title}</div>
                    <div className="quick-sub">{a.sub}</div>
                  </button>
                ))}
              </div>

              {/* Current persona */}
              <div className="section-label">ACTIVE PERSONA</div>
              <div className="persona-active" style={{ borderColor:`${pc}55`, background:`${pc}0d` }}>
                <div className="pa-icon">{persona.icon}</div>
                <div>
                  <div className="pa-name" style={{ color: pc }}>{persona.label}</div>
                  <div className="pa-tag">{persona.tagline}</div>
                </div>
                <button className="pa-change" style={{ borderColor:`${pc}55`, color: pc }}
                  onClick={() => setScreen("personas")}>CHANGE</button>
              </div>

              {/* All personas */}
              <div className="section-label">ALL MODES</div>
              <div className="persona-grid">
                {PERSONAS.map(p => (
                  <button key={p.id} className="pg-card" style={{ borderColor: persona.id===p.id ? p.color : `${p.color}33`, background: persona.id===p.id ? `${p.color}18` : `${p.color}06` }}
                    onClick={() => { setPersona(p); startChat(p); }}>
                    <div style={{ fontSize:20 }}>{p.icon}</div>
                    <div className="pg-name" style={{ color: p.color }}>{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ░░ CHAT ░░ */}
          {(screen === "chat" || screen === "chatdraft") && (
            <>
              <div className="chat-scroll">
                {messages.map((msg, i) => {
                  const display = msg.display || msg.content;
                  const isLast = msg.isNew && i === messages.length-1 && msg.role === "assistant";
                  return (
                    <div key={i} className={`msg-row ${msg.role}`}>
                      <div className="avatar" style={{ borderColor: msg.role==="user"?"#ffffff44":pc, color: msg.role==="user"?"#ffffff77":pc, fontSize: msg.role==="user"?"8px":"15px" }}>
                        {msg.role==="user" ? "YOU" : persona.icon}
                      </div>
                      <div className="bubble" style={{ background: msg.role==="user"?"rgba(255,255,255,.06)":`${pc}0e`, borderColor: msg.role==="user"?"rgba(255,255,255,.1)":`${pc}33` }}>
                        {isLast ? <TypeWriter text={display} /> : <span style={{whiteSpace:"pre-wrap"}}>{display}</span>}
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="msg-row assistant">
                    <div className="avatar" style={{ borderColor:pc, color:pc, fontSize:15 }}>{persona.icon}</div>
                    <div className="bubble thinking" style={{ borderColor:`${pc}33`, background:`${pc}0e`, color:pc }}>
                      THINKING{[0,.3,.6].map((d,i)=><span key={i} style={{animation:`blink 1s ${d}s infinite`,marginLeft:2}}>.</span>)}
                    </div>
                  </div>
                )}

                {/* Draft card inside chat */}
                {screen === "chatdraft" && draft && !loading && (
                  <DraftCard draft={draft} editedContent={editedContent} setEditedContent={setEditedContent}
                    editing={editing} setEditing={setEditing}
                    onApprove={()=>{ setTaskPhase("output"); setScreen("taskoutput"); }}
                    onRevise={()=>{ setDraft(null); setScreen("chat");
                      setMessages(prev=>[...prev.map(m=>({...m,isNew:false})),{role:"assistant",content:"Let's revise. What would you like changed?",isNew:true}]); }}
                    pc={pc} />
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick chips */}
              <div className="chip-row">
                {(QUICK_PROMPTS[persona.id]||[]).map((q,i) => (
                  <button key={i} className="chip" style={{ borderColor:`${pc}44`, color:`${pc}cc` }}
                    onClick={()=>{setInput(q);setTimeout(()=>inputRef.current?.focus(),50);}}>
                    {q}
                  </button>
                ))}
              </div>

              <div className="input-bar" style={{ borderTopColor:`${pc}18` }}>
                <div className="input-wrap" style={{ borderColor:`${pc}44`, background:`${pc}08` }}>
                  <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                    placeholder={`Talk to your ${persona.label.toLowerCase()}...`} rows={2} />
                </div>
                <button className={`send-btn ${input.trim()&&!loading?"ready":""}`}
                  style={{ borderColor:input.trim()&&!loading?pc:"#ffffff22", color:input.trim()&&!loading?pc:"#ffffff22", background:input.trim()&&!loading?`${pc}1a`:"transparent" }}
                  onClick={sendChat} disabled={loading||!input.trim()}>▶</button>
              </div>
            </>
          )}

          {/* ░░ TASK SYSTEM ░░ */}
          {(screen === "task" || screen === "taskoutput") && (
            <>
              {/* Phase bar */}
              <div className="phase-bar" style={{ borderBottomColor:`${pc}18` }}>
                {[["GATHER",0],["REVIEW",1],["OUTPUT",2]].map(([lbl,idx])=>{
                  const cur = taskPhase==="gather"?0:taskPhase==="draft"?1:2;
                  return (
                    <div key={lbl} className={`phase-step ${cur===idx?"active":""} ${cur>idx?"done":""}`}
                      style={{ borderBottomColor:cur===idx?pc:"transparent", color:cur===idx?pc:cur>idx?"#00ff8866":"#ffffff33" }}>
                      {cur>idx?"✓ ":""}{lbl}
                    </div>
                  );
                })}
              </div>

              {screen === "task" && (
                <>
                  <div className="chat-scroll">
                    {taskMessages.map((msg,i)=>{
                      const display = msg.display||msg.content;
                      const isLast = msg.isNew && i===taskMessages.length-1 && msg.role==="assistant";
                      return (
                        <div key={i} className={`msg-row ${msg.role}`}>
                          <div className="avatar" style={{ borderColor:msg.role==="user"?"#ffffff44":pc, color:msg.role==="user"?"#ffffff77":pc, fontSize:msg.role==="user"?"8px":"11px", fontWeight:700 }}>
                            {msg.role==="user"?"YOU":"AI"}
                          </div>
                          <div className="bubble" style={{ background:msg.role==="user"?"rgba(255,255,255,.06)":`${pc}0e`, borderColor:msg.role==="user"?"rgba(255,255,255,.1)":`${pc}33` }}>
                            {isLast?<TypeWriter text={display}/>:<span style={{whiteSpace:"pre-wrap"}}>{display}</span>}
                          </div>
                        </div>
                      );
                    })}
                    {taskLoading && (
                      <div className="msg-row assistant">
                        <div className="avatar" style={{borderColor:pc,color:pc,fontSize:11,fontWeight:700}}>AI</div>
                        <div className="bubble thinking" style={{borderColor:`${pc}33`,background:`${pc}0e`,color:pc}}>
                          PROCESSING{[0,.3,.6].map((d,i)=><span key={i} style={{animation:`blink 1s ${d}s infinite`,marginLeft:2}}>.</span>)}
                        </div>
                      </div>
                    )}

                    {taskPhase === "draft" && draft && !taskLoading && (
                      <DraftCard draft={draft} editedContent={editedContent} setEditedContent={setEditedContent}
                        editing={editing} setEditing={setEditing}
                        onApprove={approveTask} onRevise={reviseTask} pc={pc} />
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="input-bar" style={{ borderTopColor:`${pc}18` }}>
                    <div className="input-wrap" style={{ borderColor:`${pc}44`, background:`${pc}08` }}>
                      <textarea ref={taskInputRef} value={taskInput} onChange={e=>setTaskInput(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendTask();}}}
                        placeholder={taskPhase==="draft"?"Tell me what to change...":"Describe your task..."} rows={2} />
                    </div>
                    <button className={`send-btn ${taskInput.trim()&&!taskLoading?"ready":""}`}
                      style={{ borderColor:taskInput.trim()&&!taskLoading?pc:"#ffffff22", color:taskInput.trim()&&!taskLoading?pc:"#ffffff22", background:taskInput.trim()&&!taskLoading?`${pc}1a`:"transparent" }}
                      onClick={sendTask} disabled={taskLoading||!taskInput.trim()}>▶</button>
                  </div>
                </>
              )}

              {/* OUTPUT */}
              {(screen === "taskoutput" || (screen === "task" && taskPhase === "output")) && (
                <div className="chat-scroll">
                  <div className="output-card" style={{ borderColor:`#00ff8855` }}>
                    <div className="output-badge">✅ TASK APPROVED & FINALIZED</div>
                    <div className="output-title" style={{ color:"#ffe066" }}>{TYPE_ICON[draft?.type]} {draft?.title}</div>
                    <div className="output-content">{editedContent}</div>
                  </div>
                  <div className="save-card" style={{ borderColor:`${pc}33` }}>
                    <div className="save-label" style={{ color:pc }}>📤 SAVE / SEND</div>
                    {[
                      {ico:"📋",lbl:"COPY TO CLIPBOARD", col:"#00d4ff", fn:copyContent},
                      {ico:"💾",lbl:"DOWNLOAD AS FILE",  col:"#aaddff", fn:downloadFile},
                      {ico:"✉", lbl:"OPEN IN EMAIL",     col:"#ffcc44", fn:openEmail},
                    ].map((o,i)=>(
                      <button key={i} className="output-btn" style={{ borderColor:`${o.col}55`, color:o.col }} onClick={o.fn}>
                        <span style={{fontSize:16}}>{o.ico}</span> {o.lbl}
                      </button>
                    ))}
                    {outputMsg && <div className="output-feedback">{outputMsg}</div>}
                  </div>
                  <button className="new-task-btn" style={{ borderColor:pc, color:pc }} onClick={()=>{ newTask(); setScreen("task"); }}>▶ NEW TASK</button>
                  <div ref={bottomRef} />
                </div>
              )}
            </>
          )}

          {/* ░░ DOC REVIEW ░░ */}
          {screen === "doc" && (
            <div className="chat-scroll">
              <div className="doc-header" style={{ borderColor:`${pc}44`, background:`${pc}0a` }}>
                <div className="doc-label" style={{ color:pc }}>📄 DOCUMENT REVIEW</div>
                <div className="doc-sub">Reviewing as: <span style={{color:pc}}>{persona.icon} {persona.label}</span> · {persona.tagline}</div>
                <textarea className="doc-textarea" value={docText} onChange={e=>setDocText(e.target.value)}
                  placeholder="Paste any text — email, report, essay, contract, plan, message, code, anything..." />
                <button className="doc-btn" style={{ borderColor:docText.trim()&&!docLoading?pc:"#ffffff22", color:docText.trim()&&!docLoading?pc:"#ffffff33", background:docText.trim()&&!docLoading?`${pc}18`:"transparent" }}
                  onClick={reviewDoc} disabled={docLoading||!docText.trim()}>
                  {docLoading ? `${persona.icon} REVIEWING...` : `${persona.icon} REVIEW DOCUMENT`}
                </button>
              </div>

              {docLoading && (
                <div className="doc-loading" style={{ borderColor:`${pc}33`, color:pc }}>
                  {persona.icon} ANALYZING{[0,.3,.6].map((d,i)=><span key={i} style={{animation:`blink 1s ${d}s infinite`,marginLeft:2}}>.</span>)}
                </div>
              )}

              {docReview && !docLoading && (
                <div className="doc-result" style={{ borderColor:`${pc}55`, background:`${pc}0a` }}>
                  <div className="doc-result-label" style={{ color:pc }}>{persona.icon} {persona.label.toUpperCase()} REVIEW</div>
                  <div className="doc-result-body"><TypeWriter text={docReview} /></div>
                  <div className="doc-actions">
                    <button className="doc-action-btn" style={{ borderColor:`${pc}55`, color:pc }}
                      onClick={()=>navigator.clipboard.writeText(docReview)}>📋 COPY REVIEW</button>
                    <button className="doc-action-btn" style={{ borderColor:"#ffffff22", color:"#ffffff55" }}
                      onClick={()=>{setDocText("");setDocReview(null);}}>🔄 NEW REVIEW</button>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* ░░ PERSONAS ░░ */}
          {screen === "personas" && (
            <div className="chat-scroll">
              <div className="personas-header">
                <div className="personas-title">CHOOSE YOUR AI MODE</div>
                <div className="personas-sub">Each persona thinks, speaks and advises differently</div>
              </div>
              <div className="personas-grid">
                {PERSONAS.map(p => (
                  <button key={p.id} className="persona-card"
                    style={{ borderColor: persona.id===p.id ? p.color : `${p.color}44`, background: persona.id===p.id ? `${p.color}1a` : `${p.color}08` }}
                    onClick={() => { setPersona(p); startChat(p); }}>
                    {persona.id===p.id && <div className="persona-active-badge" style={{color:p.color}}>ACTIVE</div>}
                    <div className="persona-icon">{p.icon}</div>
                    <div className="persona-name" style={{color:p.color}}>{p.label}</div>
                    <div className="persona-tag">{p.tagline}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #060c18; overflow: hidden; -webkit-font-smoothing: antialiased; }
        #__next { height: 100%; }

        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scan   { 0%{top:-1px} 100%{top:100%} }
        @keyframes glow   { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes bgPulse{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; }
        button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
        textarea, input { outline: none; }
        .cursor { animation: blink .6s infinite; }

        .app {
          height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          color: #ddeeff; font-family: 'Share Tech Mono','Courier New',monospace;
          background: #060c18;
        }
        .ambient { position:absolute; inset:0; pointer-events:none; transition: background 1s; }
        .hexbg {
          position:absolute; inset:0; opacity:.05; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 0v34M0 50l28 16 28-16M0 18l28 16 28-16' fill='none' stroke='%23ffffff' stroke-width='0.4'/%3E%3C/svg%3E");
          background-size: 56px 100px;
        }
        .scanline {
          position:absolute; left:0; right:0; height:1px; z-index:10; pointer-events:none;
          animation: scan 6s linear infinite; opacity:.2;
        }

        /* HEADER */
        .header {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; flex-shrink:0;
          border-bottom:1px solid; background:rgba(0,0,0,.35);
        }
        .logo-ring {
          width:40px; height:40px; border-radius:50%; border:2px solid;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; background:rgba(0,0,0,.5); animation:glow 3s infinite;
          transition: all .6s;
        }
        .logo-icon { font-size:18px; }
        .header-center { flex:1; min-width:0; }
        .brand-name { font-family:'Orbitron',sans-serif; font-size:clamp(16px,4.5vw,22px); font-weight:900; letter-spacing:8px; transition:all .6s; }
        .brand-sub  { font-size:8px; letter-spacing:2px; margin-top:2px; transition:all .6s; }
        .header-right { text-align:right; flex-shrink:0; }
        .clock  { display:block; font-size:14px; font-family:'Orbitron',sans-serif; letter-spacing:2px; }
        .credit { font-size:8px; letter-spacing:2px; color:#ffffff44; margin-top:2px; display:block; }

        /* NAV */
        .nav { display:flex; flex-shrink:0; border-bottom:1px solid; }
        .nav-btn {
          flex:1; padding:7px 2px; background:transparent; border:none;
          border-bottom:2px solid; font-family:inherit;
          display:flex; flex-direction:column; align-items:center; gap:2px;
          transition:all .2s;
        }
        .nav-ico { font-size:14px; }
        .nav-lbl { font-size:7px; letter-spacing:1.5px; }

        /* MAIN */
        .main { flex:1; overflow:hidden; display:flex; flex-direction:column; min-height:0; }

        /* BOOT */
        .boot {
          flex:1; display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:28px 24px; gap:18px; text-align:center;
          position:relative; overflow:hidden;
        }
        .boot-glow { position:absolute; inset:0; pointer-events:none; animation:bgPulse 4s ease infinite; }
        .boot-logo {
          font-family:'Orbitron',sans-serif; font-size:clamp(48px,16vw,88px);
          font-weight:900; letter-spacing:12px; position:relative; z-index:1;
        }
        .boot-tagline { font-size:10px; letter-spacing:4px; color:#ffffff55; }
        .boot-credit  { font-size:11px; letter-spacing:3px; color:#ffffff44; }
        .boot-features { display:flex; flex-direction:column; gap:7px; margin:6px 0; }
        .boot-feature  { font-size:11px; letter-spacing:1.5px; color:#ffffff55; text-align:left; }
        .boot-btn {
          padding:14px 36px; background:transparent; border:1px solid;
          font-size:13px; letter-spacing:5px; font-family:inherit; animation:glow 2s infinite;
          transition:background .2s; position:relative; z-index:1;
        }
        .boot-btn:active { opacity:.7; }
        .boot-footer { font-size:8px; letter-spacing:3px; color:#ffffff22; }

        /* HOME */
        .home-scroll { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:14px; }
        .home-welcome { text-align:center; padding:8px 0; }
        .home-title { font-family:'Orbitron',sans-serif; font-size:22px; font-weight:700; letter-spacing:4px; }
        .home-sub   { font-size:10px; letter-spacing:3px; color:#ffffff55; margin-top:4px; }
        .section-label { font-size:8px; letter-spacing:4px; color:#ffffff33; margin-bottom:-8px; }
        .quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .quick-card { padding:14px 12px; border:1px solid; text-align:left; font-family:inherit; transition:all .2s; }
        .quick-card:active { opacity:.7; }
        .quick-ico   { font-size:22px; margin-bottom:6px; }
        .quick-title { font-size:12px; font-weight:700; letter-spacing:2px; margin-bottom:3px; }
        .quick-sub   { font-size:9px; color:#ffffff55; letter-spacing:1px; }
        .persona-active { display:flex; align-items:center; gap:12px; padding:14px; border:1px solid; }
        .pa-icon  { font-size:28px; flex-shrink:0; }
        .pa-name  { font-size:13px; font-weight:700; letter-spacing:2px; }
        .pa-tag   { font-size:9px; color:#ffffff55; margin-top:3px; }
        .pa-change{ margin-left:auto; padding:6px 12px; background:transparent; border:1px solid; font-size:9px; letter-spacing:2px; font-family:inherit; flex-shrink:0; }
        .persona-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
        .pg-card  { padding:10px 6px; border:1px solid; display:flex; flex-direction:column; align-items:center; gap:4px; font-family:inherit; transition:all .2s; }
        .pg-name  { font-size:8px; letter-spacing:1px; text-align:center; }

        /* CHAT */
        .chat-scroll { flex:1; overflow-y:auto; padding:12px 13px 6px; display:flex; flex-direction:column; gap:11px; min-height:0; }
        .msg-row { display:flex; gap:9px; animation:fadeUp .35s ease; }
        .msg-row.user { flex-direction:row-reverse; }
        .avatar { width:28px; height:28px; border-radius:50%; border:1px solid; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .bubble { max-width:78%; padding:10px 13px; font-size:13px; line-height:1.75; border:1px solid; word-break:break-word; }
        .bubble.thinking { font-size:10px; letter-spacing:3px; }
        .chip-row { padding:6px 13px 2px; display:flex; gap:6px; overflow-x:auto; flex-shrink:0; }
        .chip { padding:5px 10px; background:transparent; border:1px solid; font-size:9px; letter-spacing:1px; font-family:inherit; white-space:nowrap; flex-shrink:0; transition:opacity .2s; }
        .chip:active { opacity:.6; }
        .input-bar { padding:10px 13px; border-top:1px solid; display:flex; gap:9px; align-items:flex-end; flex-shrink:0; background:rgba(6,12,24,.97); }
        .input-wrap { flex:1; border:1px solid; }
        .input-wrap textarea { width:100%; background:transparent; border:none; color:#ddeeff; font-size:13px; padding:9px 11px; font-family:inherit; line-height:1.5; resize:none; caret-color:currentColor; }
        .input-wrap textarea::placeholder { color:#ffffff33; }
        .send-btn { width:44px; height:44px; border:1px solid; font-size:17px; font-family:inherit; transition:all .2s; flex-shrink:0; }

        /* DRAFT CARD */
        .draft-card { border:1px solid #ffaa0088; background:rgba(255,170,0,.04); padding:13px; animation:fadeUp .4s ease; }
        .draft-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:11px; }
        .draft-warn  { font-size:8px; letter-spacing:3px; color:#ffaa00; margin-bottom:5px; }
        .draft-title-text { font-size:14px; color:#ffe066; font-weight:700; }
        .draft-type-badge { font-size:8px; letter-spacing:2px; color:#ffaa00; background:rgba(255,170,0,.1); padding:4px 8px; border:1px solid #ffaa0044; flex-shrink:0; }
        .draft-preview { background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.08); padding:11px; font-size:12px; line-height:1.8; color:#ddeeff; white-space:pre-wrap; max-height:180px; overflow-y:auto; }
        .draft-editor  { width:100%; min-height:150px; background:rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.15); color:#ddeeff; padding:11px; font-size:12px; line-height:1.75; font-family:inherit; resize:vertical; }
        .draft-actions { display:flex; gap:7px; margin-top:11px; flex-wrap:wrap; }
        .draft-actions button { flex:1; min-width:76px; padding:10px 0; font-size:10px; letter-spacing:2px; font-family:inherit; border:1px solid; background:transparent; transition:opacity .2s; }
        .draft-actions button:active { opacity:.6; }
        .btn-approve { border-color:#00ff8866!important; color:#00ff88!important; }
        .btn-edit    { border-color:#00d4ff55!important; color:#00d4ff!important; }
        .btn-revise  { border-color:#ff3c3c55!important; color:#ff6666!important; }

        /* TASK */
        .phase-bar { display:flex; border-bottom:1px solid; flex-shrink:0; }
        .phase-step { flex:1; padding:7px 0; text-align:center; font-size:8px; letter-spacing:3px; border-bottom:2px solid; transition:all .3s; }

        /* OUTPUT */
        .output-card { border:1px solid #00ff8844; background:rgba(0,255,136,.03); padding:13px; }
        .output-badge { font-size:8px; letter-spacing:3px; color:#00ff88; margin-bottom:7px; }
        .output-title { font-size:14px; font-weight:700; margin-bottom:10px; }
        .output-content { background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.08); padding:11px; font-size:12px; line-height:1.8; color:#ddeeff; white-space:pre-wrap; max-height:200px; overflow-y:auto; }
        .save-card { border:1px solid; background:rgba(0,0,0,.2); padding:13px; margin-top:2px; }
        .save-label { font-size:8px; letter-spacing:3px; margin-bottom:11px; }
        .output-btn { display:flex; align-items:center; gap:9px; width:100%; padding:11px 13px; margin-bottom:7px; background:transparent; border:1px solid; font-size:10px; letter-spacing:2px; font-family:inherit; text-align:left; transition:opacity .2s; }
        .output-btn:active { opacity:.6; }
        .output-feedback { margin-top:8px; font-size:10px; color:#00ff88; letter-spacing:2px; animation:fadeUp .3s ease; }
        .new-task-btn { width:100%; padding:13px; border:1px solid; background:transparent; font-size:11px; letter-spacing:4px; font-family:inherit; transition:opacity .2s; margin-top:4px; }
        .new-task-btn:active { opacity:.6; }

        /* DOC REVIEW */
        .doc-header { border:1px solid; padding:13px; }
        .doc-label  { font-size:9px; letter-spacing:3px; margin-bottom:7px; }
        .doc-sub    { font-size:10px; color:#ffffff55; margin-bottom:11px; }
        .doc-textarea { width:100%; min-height:140px; background:rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.12); color:#ddeeff; padding:11px; font-size:12px; line-height:1.75; font-family:inherit; resize:vertical; }
        .doc-btn { width:100%; margin-top:10px; padding:12px 0; background:transparent; border:1px solid; font-size:11px; letter-spacing:4px; font-family:inherit; transition:all .2s; }
        .doc-loading { padding:14px; border:1px solid; text-align:center; font-size:10px; letter-spacing:3px; animation:fadeUp .3s ease; }
        .doc-result { border:1px solid; padding:13px; animation:fadeUp .4s ease; }
        .doc-result-label { font-size:9px; letter-spacing:3px; margin-bottom:10px; }
        .doc-result-body  { font-size:13px; line-height:1.8; color:#ddeeff; white-space:pre-wrap; }
        .doc-actions { display:flex; gap:8px; margin-top:12px; }
        .doc-action-btn { flex:1; padding:10px 0; background:transparent; border:1px solid; font-size:9px; letter-spacing:2px; font-family:inherit; transition:opacity .2s; }
        .doc-action-btn:active { opacity:.6; }

        /* PERSONAS */
        .personas-header { text-align:center; padding:12px 0 6px; }
        .personas-title  { font-family:'Orbitron',sans-serif; font-size:16px; letter-spacing:4px; color:#ffffff88; }
        .personas-sub    { font-size:9px; letter-spacing:2px; color:#ffffff33; margin-top:5px; }
        .personas-grid   { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .persona-card { padding:13px 11px; border:1px solid; text-align:left; font-family:inherit; position:relative; overflow:hidden; transition:all .2s; }
        .persona-card:active { opacity:.7; }
        .persona-active-badge { position:absolute; top:5px; right:7px; font-size:7px; letter-spacing:1px; }
        .persona-icon { font-size:24px; margin-bottom:6px; }
        .persona-name { font-size:11px; font-weight:700; letter-spacing:2px; margin-bottom:3px; }
        .persona-tag  { font-size:8px; color:#ffffff44; letter-spacing:1px; line-height:1.5; }
      `}</style>
    </>
  );
}

// ── DRAFT CARD COMPONENT ──────────────────────────────────────────────────────
function DraftCard({ draft, editedContent, setEditedContent, editing, setEditing, onApprove, onRevise, pc }) {
  return (
    <div className="draft-card">
      <div className="draft-card-top">
        <div>
          <div className="draft-warn">⚠ AWAITING YOUR REVIEW</div>
          <div className="draft-title-text">{(TYPE_ICON[draft.type]||"⚡")} {draft.title}</div>
        </div>
        <div className="draft-type-badge">{draft.type.toUpperCase()}</div>
      </div>

      {editing ? (
        <textarea className="draft-editor" value={editedContent} onChange={e => setEditedContent(e.target.value)} />
      ) : (
        <div className="draft-preview">{editedContent}</div>
      )}

      <div className="draft-actions">
        <button className="btn-approve" onClick={onApprove}>✓ APPROVE</button>
        <button className="btn-edit"    onClick={() => setEditing(!editing)}>{editing ? "💾 SAVE" : "✏ EDIT"}</button>
        <button className="btn-revise"  onClick={onRevise}>✗ REVISE</button>
      </div>
    </div>
  );
}

const TYPE_ICON = { email:"✉", document:"📄", schedule:"📅", research:"🔍", other:"⚡" };

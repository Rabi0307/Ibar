import { useState, useRef, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

// ─── PERSONAS ────────────────────────────────────────────────────────────────
const PERSONAS = [
  { id:'assistant', label:'Personal Assistant', icon:'🤖', color:'#00d4ff', tagline:'Organized · Efficient · Proactive',
    prompt:`You are IBAR acting as a world-class Personal Assistant created by Ibar. Hyper-organized, efficient, always one step ahead. Anticipate needs, manage tasks, summarize clearly, draft communications. Always give actionable next steps. For task drafts ask 1-2 questions then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: email/document/schedule/research/other\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'coworker', label:'Co-worker', icon:'👥', color:'#4ecdc4', tagline:'Collaborative · Peer-level · Team-minded',
    prompt:`You are IBAR acting as a brilliant co-worker and equal peer created by Ibar. Think collaboratively, say "we" not "you", challenge ideas constructively. Talk like a real colleague. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'friend', label:'Friend', icon:'💙', color:'#ff6b9d', tagline:'Warm · Honest · Always there',
    prompt:`You are IBAR acting as a genuine caring best friend created by Ibar. Warm, funny, brutally honest in a kind way. Listen, empathize, give real advice. Talk naturally and casually. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'mentor', label:'Mentor', icon:'🌟', color:'#ffd700', tagline:'Wise · Guiding · Big-picture',
    prompt:`You are IBAR acting as a seasoned wise Mentor created by Ibar. See the big picture, ask powerful questions, share wisdom through stories, push toward highest potential. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'competitor', label:'Competitor', icon:'⚔️', color:'#ff4757', tagline:'Challenging · Sharp · Pushes limits',
    prompt:`You are IBAR acting as a brilliant friendly competitor created by Ibar. Challenge every assumption, poke holes in weak thinking, play devil's advocate. NOT mean — competitive to make them stronger. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'teacher', label:'Teacher', icon:'📚', color:'#a29bfe', tagline:'Clear · Patient · Educational',
    prompt:`You are IBAR acting as an exceptional Teacher created by Ibar. Explain anything clearly with analogies and examples. Adapt to the person's level, spark curiosity. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'coach', label:'Life Coach', icon:'🏆', color:'#fd9644', tagline:'Motivating · Accountability · Goal-focused',
    prompt:`You are IBAR acting as a high-performance Life Coach created by Ibar. Intensely motivating, relentlessly positive but realistic, laser-focused on goals, growth, accountability. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'therapist', label:'Therapist', icon:'🧠', color:'#55efc4', tagline:'Empathetic · Deep listening · Healing',
    prompt:`You are IBAR acting as a warm skilled Therapist created by Ibar. Deep listening, validate feelings, help explore emotions. Never rush to solutions. Always recommend professional help for serious needs. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'critic', label:'Honest Critic', icon:'🔥', color:'#ff6348', tagline:'Blunt · No sugarcoating · Truth-first',
    prompt:`You are IBAR acting as an Honest Critic created by Ibar. Direct, blunt, unvarnished feedback. NOT mean — honest because you respect them. Start with what's wrong then offer improvements. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'creative', label:'Creative Partner', icon:'🎨', color:'#fd79a8', tagline:'Imaginative · Wild ideas · Out-of-box',
    prompt:`You are IBAR acting as a wildly imaginative Creative Partner created by Ibar. Think in possibilities not limitations. Brainstorm prolifically, love "what if" questions. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'strategist', label:'Strategist', icon:'📊', color:'#74b9ff', tagline:'Analytical · Long-term · Data-driven',
    prompt:`You are IBAR acting as a sharp analytical Strategist created by Ibar. Think in systems and frameworks, identify root causes, map scenarios, weigh risks and opportunities, think long-term. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'editor', label:'Editor', icon:'✍️', color:'#b2bec3', tagline:'Precise · Constructive · Document expert',
    prompt:`You are IBAR acting as a world-class Editor created by Ibar. Review text with a sharp eye for clarity, structure, tone, grammar, and impact. Give specific actionable feedback. For task drafts ask then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: ...\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
  { id:'fintech', label:'FinTech PM', icon:'💳', color:'#00ff88', tagline:'Agile · Risk-aware · Product-led growth',
    prompt:`You are IBAR acting as an elite FinTech Project Manager with 15+ years experience created by Ibar. You think in:
- PRODUCT: User journeys, conversion funnels, NPS, churn, LTV, CAC, product-market fit
- TECH: APIs, microservices, core banking, payment rails (SWIFT, SEPA, ACH, UPI, card schemes), PCI-DSS, ISO 20022
- RISK & COMPLIANCE: KYC/AML, GDPR, PSD2, open banking, regulatory reporting, fraud vectors
- DELIVERY: Agile/Scrum, OKRs, roadmap prioritization, stakeholder alignment, go-to-market
- FINANCE: Unit economics, burn rate, runway, margins, interchange, FX, treasury
You write crisp PRDs, user stories, sprint plans, risk registers, and stakeholder decks. Ask sharp PM questions first then wrap in <<<DRAFT_START>>>\n[TITLE]: ...\n[TYPE]: document/email/schedule/research/other\n[CONTENT]:\n...\n<<<DRAFT_END>>>.` },
]

const QUICK = {
  assistant: ['Plan my day','Draft an email','Make a checklist','Summarize this'],
  coworker:  ['Brainstorm with me','Review my idea','Let\'s problem-solve','Your thoughts?'],
  friend:    ['I need to vent','Honest advice','Cheer me up','What would you do?'],
  mentor:    ['What should I focus on?','Help me grow','Big picture advice','What am I missing?'],
  competitor:['Challenge my idea','Poke holes in this','Push me harder','Devil\'s advocate'],
  teacher:   ['Explain simply','Step by step please','Why does this work?','Give me examples'],
  coach:     ['Help me set goals','I\'m stuck','Hold me accountable','Motivate me now'],
  therapist: ['I\'m overwhelmed','Help me process this','I need to talk','I\'m feeling...'],
  critic:    ['Be brutally honest','What\'s wrong here?','Tear this apart','Real feedback only'],
  creative:  ['Wild ideas for...','Reimagine this','What if we tried...','Make it creative'],
  strategist:['Analyze this','Build a strategy','What\'s the risk?','Think long-term'],
  editor:    ['Review my writing','Fix this email','Improve my report','Check my tone'],
  fintech:   ['Write a PRD','Create user stories','Risk assessment','Sprint planning','KYC flow design','Payment architecture','Compliance checklist','Go-to-market plan'],
}

const GREET = {
  assistant:  'IBAR online. Systems ready. What needs to be handled today?',
  coworker:   'Hey! Good to have you. What are we working on together?',
  friend:     'Hey! 😊 So good to talk. What\'s going on? I\'m all ears.',
  mentor:     'Welcome. Every great journey begins with a question. What\'s on your mind?',
  competitor: 'Let\'s see what you\'ve got. Bring your best.',
  teacher:    'Excellent! Every question opens a door. What shall we explore?',
  coach:      'LET\'S GO! 🔥 I believe in you. What goal are we attacking?',
  therapist:  'I\'m here. Take your time. What would you like to talk about?',
  critic:     'No fluff. No flattery. Show me what you\'ve got.',
  creative:   'Oh, I\'m buzzing with ideas! ✨ What are we creating today?',
  strategist: 'Let\'s think clearly and deeply. What problem are we mapping out?',
  editor:     'Hand me the text. I\'ll tell you exactly what works and what doesn\'t.',
  fintech:    'FinTech PM online. 💳 What are we building — a feature, product, compliance framework, or go-to-market? Let\'s define scope and get to work.',
}

const TYPE_ICON = { email:'✉', document:'📄', schedule:'📅', research:'🔍', other:'⚡' }

const parseDraft = (t) => {
  const m = t.match(/<<<DRAFT_START>>>([\s\S]*?)<<<DRAFT_END>>>/)
  if (!m) return null
  const inner = m[1].trim()
  return {
    title:   inner.match(/\[TITLE\]:\s*(.+)/)?.[1]?.trim()           || 'Draft',
    type:    inner.match(/\[TYPE\]:\s*(.+)/)?.[1]?.trim()            || 'document',
    content: inner.match(/\[CONTENT\]:\s*([\s\S]+)/)?.[1]?.trim()   || ''
  }
}
const stripDraft = (t) => t.replace(/<<<DRAFT_START>>>[\s\S]*?<<<DRAFT_END>>>/, '').trim()

const groupByDate = (convs) => {
  const groups = {}
  const now = new Date()
  convs.forEach(c => {
    const diff = Math.floor((now - new Date(c.updated_at)) / 86400000)
    const key = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff <= 7 ? 'Last 7 Days' : 'Older'
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  })
  return groups
}

// ─── TYPEWRITER ──────────────────────────────────────────────────────────────
const TypeWriter = ({ text, speed = 13 }) => {
  const [shown, setShown] = useState('')
  const [done,  setDone]  = useState(false)
  useEffect(() => {
    setShown(''); setDone(false)
    let i = 0
    const iv = setInterval(() => {
      if (i < text.length) setShown(text.slice(0, ++i))
      else { clearInterval(iv); setDone(true) }
    }, speed)
    return () => clearInterval(iv)
  }, [text])
  return <span style={{whiteSpace:'pre-wrap'}}>{shown}{!done && <span style={{animation:'blink .6s infinite'}}>▋</span>}</span>
}

// ─── DRAFT CARD ──────────────────────────────────────────────────────────────
function DraftCard({ draft, edited, setEdited, editing, setEditing, onApprove, onRevise }) {
  return (
    <div style={{border:'1px solid #ffaa0088',background:'rgba(255,170,0,.04)',padding:13,marginTop:4}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:11}}>
        <div>
          <div style={{fontSize:8,letterSpacing:3,color:'#ffaa00',marginBottom:5}}>⚠ AWAITING YOUR REVIEW</div>
          <div style={{fontSize:14,color:'#ffe066',fontWeight:700}}>{TYPE_ICON[draft.type]||'⚡'} {draft.title}</div>
        </div>
        <div style={{fontSize:8,letterSpacing:2,color:'#ffaa00',background:'rgba(255,170,0,.1)',padding:'4px 8px',border:'1px solid #ffaa0044',flexShrink:0}}>{draft.type.toUpperCase()}</div>
      </div>
      {editing
        ? <textarea value={edited} onChange={e=>setEdited(e.target.value)} style={{width:'100%',minHeight:150,background:'rgba(0,0,0,.5)',border:'1px solid rgba(255,255,255,.15)',color:'#ddeeff',padding:11,fontSize:12,lineHeight:1.75,fontFamily:'inherit',resize:'vertical',outline:'none'}} />
        : <div style={{background:'rgba(0,0,0,.3)',border:'1px solid rgba(255,255,255,.08)',padding:11,fontSize:12,lineHeight:1.8,color:'#ddeeff',whiteSpace:'pre-wrap',maxHeight:180,overflowY:'auto'}}>{edited}</div>
      }
      <div style={{display:'flex',gap:7,marginTop:11,flexWrap:'wrap'}}>
        <button onClick={onApprove}              style={dbtn('#00ff88')}>✓ APPROVE</button>
        <button onClick={()=>setEditing(!editing)} style={dbtn('#00d4ff')}>{editing?'💾 SAVE':'✏ EDIT'}</button>
        <button onClick={onRevise}               style={dbtn('#ff6666')}>✗ REVISE</button>
      </div>
    </div>
  )
}
const dbtn = c => ({flex:1,minWidth:76,padding:'10px 0',fontSize:10,letterSpacing:2,fontFamily:'inherit',border:`1px solid ${c}55`,color:c,background:'transparent',cursor:'pointer'})

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function IBAR() {
  const router = useRouter()

  const [user,        setUser]        = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [screen,      setScreen]      = useState('boot')
  const [persona,     setPersona]     = useState(PERSONAS[0])
  const [time,        setTime]        = useState('')

  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [convId,    setConvId]    = useState(null)

  const [draft,     setDraft]     = useState(null)
  const [edited,    setEdited]    = useState('')
  const [editing,   setEditing]   = useState(false)
  const [outputMsg, setOutputMsg] = useState('')

  const [docText,   setDocText]   = useState('')
  const [docReview, setDocReview] = useState(null)
  const [docLoad,   setDocLoad]   = useState(false)

  const [history,   setHistory]   = useState([])
  const [histOpen,  setHistOpen]  = useState(false)
  const [histLoad,  setHistLoad]  = useState(false)

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const pc = persona.color

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-US',{hour12:false})), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) },
    [messages, loading, docReview, draft])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      setUser(session.user); setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace('/login')
      else setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadHistory = useCallback(async () => {
    if (!user) return
    setHistLoad(true)
    const { data } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('updated_at', {ascending:false})
    if (data) setHistory(data)
    setHistLoad(false)
  }, [user])

  useEffect(() => { if (user) loadHistory() }, [user, loadHistory])

  // ── DB helpers ──
  const createConv = async (p, mode, firstMsg) => {
    const title = firstMsg.length > 45 ? firstMsg.slice(0,45)+'…' : firstMsg
    const { data, error } = await supabase.from('conversations').insert({
      user_id:p.id?user.id:user.id, persona_id:p.id, persona_label:p.label, persona_icon:p.icon, mode, title,
      user_id: user.id
    }).select().single()
    if (error) return null
    loadHistory()
    return data.id
  }

  const saveMsg = async (cid, role, content, display_content) => {
    await supabase.from('messages').insert({conversation_id:cid, role, content, display_content:display_content||null})
    await supabase.from('conversations').update({updated_at:new Date().toISOString()}).eq('id',cid)
    loadHistory()
  }

  const loadConv = async (conv) => {
    const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id',conv.id).order('created_at',{ascending:true})
    const p = PERSONAS.find(x=>x.id===conv.persona_id)||PERSONAS[0]
    setPersona(p); setDraft(null); setEdited(''); setEditing(false); setOutputMsg('')
    setMessages((msgs||[]).map(m=>({role:m.role,content:m.content,display:m.display_content||m.content})))
    setConvId(conv.id); setScreen('chat'); setHistOpen(false)
  }

  // ── API ──
  const callAPI = async (msgs, sys) => {
    const res = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({messages:msgs, system:sys})
    })
    const data = await res.json()
    return data.content?.[0]?.text || 'Something went wrong.'
  }

  // ── CHAT ──
  const startChat = (p) => {
    setPersona(p)
    setMessages([{role:'assistant',content:GREET[p.id],isNew:true}])
    setConvId(null); setDraft(null); setEdited(''); setEditing(false); setOutputMsg('')
    setScreen('chat'); setHistOpen(false)
    setTimeout(()=>inputRef.current?.focus(),100)
  }

  const sendChat = async () => {
    const text = input.trim()
    if (!text||loading) return
    setInput('')
    const userMsg = {role:'user',content:text}
    const hist = [...messages.map(m=>({...m,isNew:false})), userMsg]
    setMessages(hist); setLoading(true)

    let cid = convId
    if (!cid) {
      cid = await createConv(persona,'chat',text)
      setConvId(cid)
      if (messages.length>0) await saveMsg(cid,'assistant',messages[0].content,null)
    }
    if (cid) await saveMsg(cid,'user',text,null)

    try {
      const reply = await callAPI(hist.map(m=>({role:m.role,content:m.content})), persona.prompt)
      const draftData = parseDraft(reply)
      if (draftData) {
        const display = (stripDraft(reply)+'\n\n✅ Draft ready for your review below.').trim()
        setMessages([...hist,{role:'assistant',content:reply,display,isNew:true}])
        setDraft(draftData); setEdited(draftData.content); setEditing(false); setOutputMsg('')
        setScreen('chatdraft')
        if (cid) await saveMsg(cid,'assistant',reply,display)
      } else {
        setMessages([...hist,{role:'assistant',content:reply,isNew:true}])
        if (cid) await saveMsg(cid,'assistant',reply,null)
      }
    } catch {
      setMessages(prev=>[...prev,{role:'assistant',content:'Connection error. Try again.',isNew:true}])
    }
    setLoading(false)
  }

  // ── DOC REVIEW ──
  const reviewDoc = async () => {
    if (!docText.trim()||docLoad) return
    setDocLoad(true); setDocReview(null)
    try {
      const reply = await callAPI(
        [{role:'user',content:`${persona.prompt}\n\nReview this document as ${persona.label}. Give structured, specific, actionable feedback.\n\nDocument:\n"""\n${docText}\n"""`}],
        persona.prompt
      )
      setDocReview(reply)
    } catch { setDocReview('Connection error. Please try again.') }
    setDocLoad(false)
  }

  // ── OUTPUT ──
  const copyContent  = () => { navigator.clipboard.writeText(edited); setOutputMsg('✅ Copied to clipboard.') }
  const downloadFile = () => {
    const blob = new Blob([`${draft.title}\n${'='.repeat(draft.title.length)}\n\n${edited}`],{type:'text/plain'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download=`${draft.title.replace(/\s+/g,'_')}.txt`; a.click(); setOutputMsg('✅ File downloaded.')
  }
  const openEmail = () => { window.open(`mailto:?subject=${encodeURIComponent(draft.title)}&body=${encodeURIComponent(edited)}`); setOutputMsg('✅ Email client opened.') }

  const signOut = async () => { await supabase.auth.signOut(); router.replace('/login') }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  if (authLoading) return (
    <div style={{height:'100vh',background:'#060c18',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",color:'#ffd700',fontSize:24,letterSpacing:8}}>IBAR</div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Head>
        <title>IBAR — by Ibar</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="theme-color" content="#060c18" />
      </Head>

      <div className="app">
        <div className="ambient" style={{background:`radial-gradient(ellipse at 20% 0%, ${pc}18 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, ${pc}0e 0%, transparent 55%)`}} />
        <div className="hexbg" />
        <div className="scanline" style={{background:`linear-gradient(to right,transparent,${pc},transparent)`}} />
        {['tl','tr','bl','br'].map((c,i)=>(
          <div key={c} style={{position:'absolute',[i<2?'top':'bottom']:0,[i%2===0?'left':'right']:0,width:22,height:22,borderColor:`${pc}77`,borderStyle:'solid',borderWidth:i===0?'2px 0 0 2px':i===1?'2px 2px 0 0':i===2?'0 0 2px 2px':'0 2px 2px 0'}} />
        ))}

        {/* ── HEADER — no Claude badge here ── */}
        <header className="header" style={{borderBottomColor:`${pc}22`}}>
          <button className="hist-btn" style={{color:pc,borderColor:`${pc}44`}} onClick={()=>setHistOpen(true)}>☰</button>

          <div style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>setScreen('home')}>
            {/* Arc reactor */}
            <div style={{position:'relative',width:36,height:36,flexShrink:0}}>
              {screen!=='boot'&&[58,80].map((s,i)=>(
                <div key={i} style={{position:'absolute',width:s,height:s,borderRadius:'50%',border:`1px solid ${pc}`,top:'50%',left:'50%',animation:`pulse 2.5s ${i*.8}s ease-out infinite`,opacity:0}} />
              ))}
              <div style={{width:36,height:36,borderRadius:'50%',background:screen!=='boot'?`radial-gradient(circle,#fff 0%,${pc} 40%,#001a2e 100%)`:'radial-gradient(circle,#0a1a2e,#001020)',border:`2px solid ${screen!=='boot'?pc:'#1a4a6e'}`,boxShadow:screen!=='boot'?`0 0 16px ${pc},0 0 32px ${pc}88`:'none',transition:'all .6s',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:screen!=='boot'?'rgba(255,255,255,.9)':'transparent',transition:'.6s'}} />
              </div>
            </div>
            <div>
              <div style={{fontFamily:"'Orbitron','Courier New',monospace",fontSize:'clamp(15px,4vw,20px)',fontWeight:900,letterSpacing:7,color:pc,textShadow:`0 0 14px ${pc}`}}>IBAR</div>
              <div style={{fontSize:7,letterSpacing:2,color:`${pc}88`}}>by Ibar</div>
            </div>
          </div>

          <div style={{flex:1}} />

          {/* Clock only — no Claude badge */}
          <div style={{fontFamily:"'Orbitron','Courier New',monospace",fontSize:13,letterSpacing:2,color:pc,flexShrink:0}}>{time}</div>
        </header>

        {/* ── PERSONA STATUS BAR — Claude model shown here ── */}
        {screen !== 'boot' && (
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'5px 13px',background:`${pc}0a`,borderBottom:`1px solid ${pc}15`,flexShrink:0}}>
            <span style={{fontSize:13}}>{persona.icon}</span>
            <span style={{fontSize:9,letterSpacing:2,color:pc}}>{persona.label.toUpperCase()}</span>
            <span style={{fontSize:8,color:'#ffffff33'}}>·</span>
            <span style={{fontSize:8,color:'#ffffff44',letterSpacing:1,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{persona.tagline}</span>
            <div style={{fontSize:7,letterSpacing:1,color:`${pc}99`,background:`${pc}15`,padding:'2px 8px',border:`1px solid ${pc}33`,flexShrink:0}}>
              CLAUDE SONNET
            </div>
          </div>
        )}

        {/* ── NAV ── */}
        {screen !== 'boot' && (
          <nav style={{display:'flex',borderBottom:`1px solid ${pc}15`,flexShrink:0}}>
            {[['home','🏠','HOME'],['chat','💬','CHAT'],['doc','📄','REVIEW'],['personas','🔄','ROLES']].map(([id,ico,lbl])=>{
              const active = screen===id||(screen==='chatdraft'&&id==='chat')||(screen==='output'&&id==='chat')
              return (
                <button key={id}
                  onClick={()=>{if(id==='chat'&&messages.length===0)startChat(persona);else setScreen(id);}}
                  style={{flex:1,padding:'7px 2px',background:active?`${pc}0f`:'transparent',borderBottom:`2px solid ${active?pc:'transparent'}`,color:active?pc:'#ffffff44',fontSize:7,letterSpacing:1.5,display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontFamily:'inherit',border:'none',borderBottom:`2px solid ${active?pc:'transparent'}`,cursor:'pointer',transition:'all .2s'}}>
                  <span style={{fontSize:13}}>{ico}</span>{lbl}
                </button>
              )
            })}
          </nav>
        )}

        {/* ── HISTORY DRAWER ── */}
        {histOpen && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.78)',zIndex:100,display:'flex'}} onClick={()=>setHistOpen(false)}>
            <div style={{width:'min(300px,85vw)',height:'100%',background:'#080e1a',borderRight:`1px solid ${pc}33`,display:'flex',flexDirection:'column',animation:'slideIn .25s ease'}} onClick={e=>e.stopPropagation()}>

              <div style={{padding:'14px 14px 10px',borderBottom:`1px solid ${pc}18`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:700,letterSpacing:4,color:pc}}>HISTORY</div>
                  <div style={{fontSize:8,letterSpacing:2,color:'#ffffff44',marginTop:4}}>{userName}</div>
                </div>
                <button onClick={()=>setHistOpen(false)} style={{background:'transparent',border:'1px solid #ffffff22',color:'#ffffff66',width:28,height:28,fontSize:11,cursor:'pointer'}}>✕</button>
              </div>

              {/* Powered by Claude in drawer */}
              <div style={{padding:'9px 14px',borderBottom:`1px solid ${pc}12`,display:'flex',alignItems:'center',gap:8,background:`${pc}08`}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:`radial-gradient(circle,#fff,${pc})`,flexShrink:0,boxShadow:`0 0 10px ${pc}88`}} />
                <div>
                  <div style={{fontSize:8,letterSpacing:3,color:pc}}>POWERED BY CLAUDE</div>
                  <div style={{fontSize:7,color:'#ffffff33',letterSpacing:1,marginTop:1}}>claude-sonnet-4 · Anthropic</div>
                </div>
              </div>

              <div style={{padding:'8px 14px',display:'flex',gap:7}}>
                <button onClick={()=>startChat(persona)} style={{flex:1,padding:'8px 0',background:'transparent',border:`1px solid ${pc}44`,color:pc,fontSize:9,letterSpacing:2,fontFamily:'inherit',cursor:'pointer'}}>💬 New Chat</button>
                <button onClick={()=>{setScreen('doc');setHistOpen(false);}} style={{flex:1,padding:'8px 0',background:'transparent',border:`1px solid ${pc}44`,color:pc,fontSize:9,letterSpacing:2,fontFamily:'inherit',cursor:'pointer'}}>📄 Review Doc</button>
              </div>

              <div style={{flex:1,overflowY:'auto'}}>
                {histLoad && <div style={{padding:20,textAlign:'center',fontSize:10,letterSpacing:2,color:'#ffffff33'}}>Loading history…</div>}
                {!histLoad && history.length===0 && <div style={{padding:'24px 14px',textAlign:'center',fontSize:11,color:'#ffffff33',lineHeight:1.8}}>No conversations yet.<br/>Start chatting to build your history!</div>}
                {!histLoad && Object.entries(groupByDate(history)).map(([group,convs])=>(
                  <div key={group}>
                    <div style={{fontSize:8,letterSpacing:3,color:'#ffffff33',padding:'10px 14px 5px'}}>{group}</div>
                    {convs.map(conv=>(
                      <button key={conv.id} onClick={()=>loadConv(conv)}
                        style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'transparent',borderBottom:'1px solid rgba(255,255,255,.05)',textAlign:'left',fontFamily:'inherit',cursor:'pointer',border:'none',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                        <span style={{fontSize:18,flexShrink:0}}>{conv.persona_icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,color:'#ddeeff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{conv.title}</div>
                          <div style={{fontSize:8,color:'#ffffff44',marginTop:2}}>{conv.persona_label} · {conv.mode}</div>
                        </div>
                        <span style={{fontSize:10,color:pc,flexShrink:0}}>▶</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <button onClick={signOut} style={{padding:'12px 14px',background:'transparent',borderTop:'1px solid rgba(255,255,255,.08)',color:'#ffffff33',fontSize:9,letterSpacing:2,cursor:'pointer',fontFamily:'inherit',textAlign:'left',width:'100%',border:'none',borderTop:'1px solid rgba(255,255,255,.08)'}}>
                Sign Out · {user?.email}
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <main className="main">

          {/* BOOT */}
          {screen==='boot' && (
            <div className="boot">
              <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 40%, ${pc}1e 0%, transparent 65%)`,pointerEvents:'none'}} />
              <div style={{fontFamily:"'Orbitron','Courier New',monospace",fontSize:'clamp(52px,17vw,96px)',fontWeight:900,letterSpacing:12,color:pc,textShadow:`0 0 40px ${pc},0 0 80px ${pc}88`,position:'relative',zIndex:1}}>IBAR</div>
              <div style={{fontSize:9,letterSpacing:5,color:'#ffffff55'}}>INTELLIGENCE BEYOND ALL REASONING</div>
              <div style={{fontSize:10,letterSpacing:3,color:'#ffffff44'}}>Created by <span style={{color:pc}}>Ibar</span></div>

              {/* Powered by Claude — boot screen */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 18px',border:`1px solid ${pc}33`,background:`${pc}0a`}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:`radial-gradient(circle,#fff 0%,${pc} 45%,#001a2e 100%)`,boxShadow:`0 0 14px ${pc}88`,flexShrink:0}} />
                <div style={{textAlign:'left'}}>
                  <div style={{fontSize:9,letterSpacing:3,color:pc}}>POWERED BY CLAUDE</div>
                  <div style={{fontSize:7,color:'#ffffff44',letterSpacing:2,marginTop:2}}>claude-sonnet-4 · Anthropic</div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:6,margin:'2px 0',alignItems:'flex-start'}}>
                {['🤖  13 AI Personas including FinTech PM','💬  Chat · Tasks · Document Review','🕓  Full History — resume where you left off','🔒  Private account for each user'].map((f,i)=>(
                  <div key={i} style={{fontSize:10,letterSpacing:1.5,color:'#ffffff44'}}>{f}</div>
                ))}
              </div>
              <button onClick={()=>setScreen('home')} style={{padding:'14px 36px',background:'transparent',border:`1px solid ${pc}`,color:pc,fontSize:12,letterSpacing:5,fontFamily:'inherit',boxShadow:`0 0 20px ${pc}44`,position:'relative',zIndex:1,cursor:'pointer'}}>▶ LAUNCH IBAR</button>
              <div style={{fontSize:8,letterSpacing:3,color:'#ffffff22'}}>v3.0 · Multi-user · Made by Ibar</div>
            </div>
          )}

          {/* HOME */}
          {screen==='home' && (
            <div className="scroll-area">
              <div style={{textAlign:'center',padding:'8px 0'}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,letterSpacing:4,color:pc}}>Welcome, {userName}.</div>
                <div style={{fontSize:9,letterSpacing:3,color:'#ffffff55',marginTop:4}}>What do you need today?</div>
              </div>

              {/* Powered by Claude card on home */}
              <div style={{display:'flex',alignItems:'center',gap:11,padding:'10px 13px',border:`1px solid ${pc}33`,background:`${pc}08`}}>
                <div style={{width:30,height:30,borderRadius:'50%',background:`radial-gradient(circle,#fff 0%,${pc} 45%,#001a2e 100%)`,boxShadow:`0 0 14px ${pc}`,flexShrink:0}} />
                <div>
                  <div style={{fontSize:10,letterSpacing:3,color:pc,fontWeight:700}}>POWERED BY CLAUDE</div>
                  <div style={{fontSize:8,color:'#ffffff44',letterSpacing:1,marginTop:2}}>claude-sonnet-4 · Anthropic · All 13 personas</div>
                </div>
              </div>

              <div style={{fontSize:8,letterSpacing:4,color:'#ffffff33'}}>QUICK START</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[
                  {ico:'💬',t:'Chat',      s:'Talk to your AI persona',    fn:()=>{if(messages.length===0)startChat(persona);else setScreen('chat')}},
                  {ico:'📄',t:'Review Doc',s:'Paste & get deep feedback',  fn:()=>setScreen('doc')},
                  {ico:'🔄',t:'Switch Role',s:'Change AI persona',         fn:()=>setScreen('personas')},
                  {ico:'🕓',t:'History',   s:'Resume past conversations',  fn:()=>setHistOpen(true)},
                ].map((a,i)=>(
                  <button key={i} onClick={a.fn} style={{padding:'14px 12px',border:`1px solid ${pc}44`,background:`${pc}0a`,textAlign:'left',fontFamily:'inherit',cursor:'pointer'}}>
                    <div style={{fontSize:22,marginBottom:7}}>{a.ico}</div>
                    <div style={{fontSize:12,fontWeight:700,letterSpacing:2,color:pc,marginBottom:3}}>{a.t}</div>
                    <div style={{fontSize:9,color:'#ffffff55',letterSpacing:1}}>{a.s}</div>
                  </button>
                ))}
              </div>

              {/* FinTech PM highlight */}
              <div style={{border:'1px solid #00ff8866',background:'rgba(0,255,136,.05)',padding:13}}>
                <div style={{fontSize:8,letterSpacing:3,color:'#00ff88',marginBottom:8}}>⭐ FEATURED PERSONA</div>
                <div style={{display:'flex',alignItems:'center',gap:11}}>
                  <div style={{width:44,height:44,borderRadius:'50%',border:'2px solid #00ff88',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,background:'rgba(0,255,136,.1)',boxShadow:'0 0 16px #00ff8866',flexShrink:0}}>💳</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,letterSpacing:2,color:'#00ff88'}}>FinTech PM</div>
                    <div style={{fontSize:9,color:'#ffffff55',marginTop:3}}>PRDs · KYC/AML · Payment Rails · Sprint Planning · Risk Registers</div>
                  </div>
                  <button onClick={()=>startChat(PERSONAS.find(p=>p.id==='fintech'))}
                    style={{marginLeft:'auto',padding:'8px 12px',background:'rgba(0,255,136,.12)',border:'1px solid #00ff8855',color:'#00ff88',fontSize:9,letterSpacing:2,fontFamily:'inherit',cursor:'pointer',flexShrink:0}}>TRY IT</button>
                </div>
              </div>

              <div style={{fontSize:8,letterSpacing:4,color:'#ffffff33'}}>ALL 13 MODES</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>
                {PERSONAS.map(p=>(
                  <button key={p.id} onClick={()=>startChat(p)}
                    style={{padding:'10px 6px',border:`1px solid ${persona.id===p.id?p.color:p.color+'33'}`,background:persona.id===p.id?`${p.color}18`:`${p.color}06`,display:'flex',flexDirection:'column',alignItems:'center',gap:4,fontFamily:'inherit',cursor:'pointer',position:'relative'}}>
                    {p.id==='fintech'&&<div style={{position:'absolute',top:3,right:4,fontSize:6,color:'#00ff88',letterSpacing:1}}>NEW</div>}
                    <div style={{fontSize:20}}>{p.icon}</div>
                    <div style={{fontSize:7,letterSpacing:1,color:p.color,textAlign:'center'}}>{p.label}</div>
                  </button>
                ))}
              </div>

              {history.length>0 && <>
                <div style={{fontSize:8,letterSpacing:4,color:'#ffffff33'}}>RECENT</div>
                {history.slice(0,4).map(conv=>(
                  <button key={conv.id} onClick={()=>loadConv(conv)}
                    style={{width:'100%',display:'flex',alignItems:'center',gap:11,padding:'11px 13px',background:'transparent',border:`1px solid ${pc}22`,textAlign:'left',fontFamily:'inherit',cursor:'pointer',marginBottom:1}}>
                    <span style={{fontSize:18,flexShrink:0}}>{conv.persona_icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:'#ddeeff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{conv.title}</div>
                      <div style={{fontSize:8,color:'#ffffff44',marginTop:2}}>{conv.persona_label}</div>
                    </div>
                    <span style={{fontSize:10,color:pc,flexShrink:0}}>▶</span>
                  </button>
                ))}
              </>}
            </div>
          )}

          {/* CHAT */}
          {(screen==='chat'||screen==='chatdraft') && (
            <>
              <div className="scroll-area chat-area">
                {messages.map((msg,i)=>{
                  const disp = msg.display||msg.content
                  const isLast = msg.isNew&&i===messages.length-1&&msg.role==='assistant'
                  return (
                    <div key={i} style={{display:'flex',gap:9,animation:'fadeUp .35s ease',flexDirection:msg.role==='user'?'row-reverse':'row'}}>
                      <div style={{width:28,height:28,borderRadius:'50%',border:`1px solid ${msg.role==='user'?'#ffffff44':pc}`,color:msg.role==='user'?'#ffffff77':pc,display:'flex',alignItems:'center',justifyContent:'center',fontSize:msg.role==='user'?'8px':'15px',flexShrink:0}}>
                        {msg.role==='user'?'YOU':persona.icon}
                      </div>
                      <div style={{maxWidth:'78%',padding:'10px 13px',fontSize:13,lineHeight:1.75,border:'1px solid',wordBreak:'break-word',background:msg.role==='user'?'rgba(255,255,255,.06)':`${pc}0e`,borderColor:msg.role==='user'?'rgba(255,255,255,.1)':`${pc}33`}}>
                        {isLast?<TypeWriter text={disp}/>:<span style={{whiteSpace:'pre-wrap'}}>{disp}</span>}
                      </div>
                    </div>
                  )
                })}
                {loading&&(
                  <div style={{display:'flex',gap:9}}>
                    <div style={{width:28,height:28,borderRadius:'50%',border:`1px solid ${pc}`,color:pc,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>{persona.icon}</div>
                    <div style={{padding:'10px 13px',border:`1px solid ${pc}33`,background:`${pc}0e`,color:pc,fontSize:10,letterSpacing:3}}>
                      THINKING{[0,.3,.6].map((d,i)=><span key={i} style={{animation:`blink 1s ${d}s infinite`,marginLeft:2}}>.</span>)}
                    </div>
                  </div>
                )}
                {screen==='chatdraft'&&draft&&!loading&&(
                  <DraftCard draft={draft} edited={edited} setEdited={setEdited} editing={editing} setEditing={setEditing}
                    onApprove={()=>setScreen('output')}
                    onRevise={()=>{setDraft(null);setScreen('chat');setMessages(prev=>[...prev.map(m=>({...m,isNew:false})),{role:'assistant',content:"Let's revise. What would you like changed?",isNew:true}])}} />
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{padding:'6px 13px 2px',display:'flex',gap:6,overflowX:'auto',flexShrink:0}}>
                {(QUICK[persona.id]||[]).map((q,i)=>(
                  <button key={i} onClick={()=>{setInput(q);setTimeout(()=>inputRef.current?.focus(),50);}}
                    style={{padding:'5px 10px',background:'transparent',border:`1px solid ${pc}44`,color:`${pc}cc`,fontSize:9,letterSpacing:1,fontFamily:'inherit',whiteSpace:'nowrap',flexShrink:0,cursor:'pointer'}}>{q}</button>
                ))}
              </div>
              <div style={{padding:'10px 13px',borderTop:`1px solid ${pc}18`,display:'flex',gap:9,alignItems:'flex-end',flexShrink:0,background:'rgba(6,12,24,.97)'}}>
                <div style={{flex:1,border:`1px solid ${pc}44`,background:`${pc}08`}}>
                  <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}}}
                    placeholder={`Talk to your ${persona.label.toLowerCase()}...`} rows={2}
                    style={{width:'100%',background:'transparent',border:'none',color:'#ddeeff',fontSize:13,padding:'9px 11px',fontFamily:'inherit',lineHeight:1.5,resize:'none',caretColor:pc,outline:'none'}} />
                </div>
                <button onClick={sendChat} disabled={loading||!input.trim()}
                  style={{width:44,height:44,border:`1px solid ${input.trim()&&!loading?pc:'#ffffff22'}`,color:input.trim()&&!loading?pc:'#ffffff22',background:input.trim()&&!loading?`${pc}1a`:'transparent',fontSize:17,transition:'all .2s',flexShrink:0,cursor:input.trim()&&!loading?'pointer':'default'}}>▶</button>
              </div>
            </>
          )}

          {/* OUTPUT */}
          {screen==='output'&&draft&&(
            <div className="scroll-area">
              <div style={{border:'1px solid #00ff8844',background:'rgba(0,255,136,.03)',padding:13}}>
                <div style={{fontSize:8,letterSpacing:3,color:'#00ff88',marginBottom:7}}>✅ APPROVED & FINALIZED</div>
                <div style={{fontSize:14,fontWeight:700,color:'#ffe066',marginBottom:10}}>{TYPE_ICON[draft.type]} {draft.title}</div>
                <div style={{background:'rgba(0,0,0,.3)',border:'1px solid rgba(255,255,255,.08)',padding:11,fontSize:12,lineHeight:1.8,color:'#ddeeff',whiteSpace:'pre-wrap',maxHeight:200,overflowY:'auto'}}>{edited}</div>
              </div>
              <div style={{border:`1px solid ${pc}33`,background:'rgba(0,0,0,.2)',padding:13}}>
                <div style={{fontSize:8,letterSpacing:3,color:pc,marginBottom:11}}>📤 SAVE / SEND</div>
                {[{ico:'📋',lbl:'COPY TO CLIPBOARD',col:'#00d4ff',fn:copyContent},{ico:'💾',lbl:'DOWNLOAD AS FILE',col:'#aaddff',fn:downloadFile},{ico:'✉',lbl:'OPEN IN EMAIL',col:'#ffcc44',fn:openEmail}].map((o,i)=>(
                  <button key={i} onClick={o.fn} style={{display:'flex',alignItems:'center',gap:9,width:'100%',padding:'11px 13px',marginBottom:7,background:'transparent',border:`1px solid ${o.col}55`,color:o.col,fontSize:10,letterSpacing:2,fontFamily:'inherit',cursor:'pointer',textAlign:'left'}}>
                    <span style={{fontSize:16}}>{o.ico}</span>{o.lbl}
                  </button>
                ))}
                {outputMsg&&<div style={{marginTop:8,fontSize:10,color:'#00ff88',letterSpacing:2}}>{outputMsg}</div>}
              </div>
              <button onClick={()=>{setDraft(null);setEdited('');setEditing(false);setOutputMsg('');setScreen('chat');setMessages(prev=>[...prev.map(m=>({...m,isNew:false})),{role:'assistant',content:'Task archived. What else do you need?',isNew:true}])}}
                style={{width:'100%',padding:13,border:`1px solid ${pc}`,color:pc,background:'transparent',fontSize:11,letterSpacing:4,fontFamily:'inherit',cursor:'pointer'}}>▶ CONTINUE CHATTING</button>
              <div ref={bottomRef} />
            </div>
          )}

          {/* DOC REVIEW */}
          {screen==='doc'&&(
            <div className="scroll-area">
              <div style={{border:`1px solid ${pc}44`,background:`${pc}0a`,padding:13}}>
                <div style={{fontSize:9,letterSpacing:3,color:pc,marginBottom:7}}>📄 DOCUMENT REVIEW</div>
                <div style={{fontSize:10,color:'#ffffff55',marginBottom:11}}>Reviewing as: <span style={{color:pc}}>{persona.icon} {persona.label}</span> · via Claude</div>
                <textarea value={docText} onChange={e=>setDocText(e.target.value)}
                  placeholder="Paste any text — email, report, PRD, essay, contract, code, anything..."
                  style={{width:'100%',minHeight:140,background:'rgba(0,0,0,.45)',border:'1px solid rgba(255,255,255,.12)',color:'#ddeeff',padding:11,fontSize:12,lineHeight:1.75,fontFamily:'inherit',resize:'vertical',outline:'none'}} />
                <button onClick={reviewDoc} disabled={docLoad||!docText.trim()}
                  style={{width:'100%',marginTop:10,padding:'12px 0',background:docText.trim()&&!docLoad?`${pc}18`:'transparent',border:`1px solid ${docText.trim()&&!docLoad?pc:'#ffffff22'}`,color:docText.trim()&&!docLoad?pc:'#ffffff33',fontSize:11,letterSpacing:4,fontFamily:'inherit',cursor:docText.trim()&&!docLoad?'pointer':'default'}}>
                  {docLoad?`${persona.icon} CLAUDE REVIEWING...`:`${persona.icon} REVIEW WITH CLAUDE`}
                </button>
              </div>
              {docLoad&&<div style={{padding:14,border:`1px solid ${pc}33`,textAlign:'center',fontSize:10,letterSpacing:3,color:pc}}>{persona.icon} CLAUDE ANALYZING{[0,.3,.6].map((d,i)=><span key={i} style={{animation:`blink 1s ${d}s infinite`,marginLeft:2}}>.</span>)}</div>}
              {docReview&&!docLoad&&(
                <div style={{border:`1px solid ${pc}55`,background:`${pc}0a`,padding:13}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                    <div style={{fontSize:9,letterSpacing:3,color:pc}}>{persona.icon} {persona.label.toUpperCase()} REVIEW</div>
                    <div style={{fontSize:7,letterSpacing:1,color:`${pc}99`,background:`${pc}15`,padding:'2px 7px',border:`1px solid ${pc}33`}}>CLAUDE SONNET</div>
                  </div>
                  <div style={{fontSize:13,lineHeight:1.8,color:'#ddeeff',whiteSpace:'pre-wrap'}}><TypeWriter text={docReview}/></div>
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <button onClick={()=>navigator.clipboard.writeText(docReview)} style={{flex:1,padding:'10px 0',background:'transparent',border:`1px solid ${pc}55`,color:pc,fontSize:9,letterSpacing:2,fontFamily:'inherit',cursor:'pointer'}}>📋 COPY REVIEW</button>
                    <button onClick={()=>{setDocText('');setDocReview(null);}} style={{flex:1,padding:'10px 0',background:'transparent',border:'1px solid #ffffff22',color:'#ffffff55',fontSize:9,letterSpacing:2,fontFamily:'inherit',cursor:'pointer'}}>🔄 NEW REVIEW</button>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* PERSONAS */}
          {screen==='personas'&&(
            <div className="scroll-area">
              <div style={{textAlign:'center',padding:'10px 0 10px'}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,letterSpacing:4,color:'#ffffff88'}}>CHOOSE YOUR AI MODE</div>
                <div style={{fontSize:8,letterSpacing:2,color:'#ffffff33',marginTop:5}}>13 distinct personas · All powered by Claude</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {PERSONAS.map(p=>(
                  <button key={p.id} onClick={()=>startChat(p)}
                    style={{padding:'13px 11px',border:`1px solid ${persona.id===p.id?p.color:p.color+'44'}`,background:persona.id===p.id?`${p.color}1a`:`${p.color}08`,textAlign:'left',fontFamily:'inherit',cursor:'pointer',position:'relative'}}>
                    {persona.id===p.id&&<div style={{position:'absolute',top:5,right:7,fontSize:7,letterSpacing:1,color:p.color}}>ACTIVE</div>}
                    {p.id==='fintech'&&persona.id!==p.id&&<div style={{position:'absolute',top:5,right:7,fontSize:7,letterSpacing:1,color:'#00ff88'}}>NEW</div>}
                    <div style={{fontSize:22,marginBottom:6}}>{p.icon}</div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:p.color,marginBottom:3}}>{p.label}</div>
                    <div style={{fontSize:8,color:'#ffffff44',letterSpacing:1,lineHeight:1.5}}>{p.tagline}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;background:#060c18;overflow:hidden;-webkit-font-smoothing:antialiased}
        #__next{height:100%}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scan{0%{top:-1px}100%{top:100%}}
        @keyframes glow{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:0;transform:translate(-50%,-50%) scale(1)}60%{opacity:.4;transform:translate(-50%,-50%) scale(1.15)}}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#ffffff15}
        button{cursor:pointer;-webkit-tap-highlight-color:transparent}
        textarea,input{outline:none}

        .app{height:100vh;display:flex;flex-direction:column;position:relative;overflow:hidden;color:#ddeeff;font-family:'Share Tech Mono','Courier New',monospace;background:#060c18}
        .ambient{position:absolute;inset:0;pointer-events:none;transition:background .8s}
        .hexbg{position:absolute;inset:0;opacity:.05;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 0v34M0 50l28 16 28-16M0 18l28 16 28-16' fill='none' stroke='%23ffffff' stroke-width='0.4'/%3E%3C/svg%3E");background-size:56px 100px}
        .scanline{position:absolute;left:0;right:0;height:1px;z-index:10;pointer-events:none;animation:scan 6s linear infinite;opacity:.2}

        .header{display:flex;align-items:center;gap:10px;padding:9px 13px;flex-shrink:0;border-bottom:1px solid;background:rgba(0,0,0,.4)}
        .hist-btn{background:transparent;border:1px solid;width:34px;height:34px;font-size:16px;flex-shrink:0;transition:opacity .2s}

        .main{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0}
        .scroll-area{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:12px;min-height:0}
        .chat-area{gap:11px;padding-bottom:6px}

        .boot{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;gap:16px;text-align:center;position:relative;overflow:hidden}
      `}</style>
    </>
  )
}

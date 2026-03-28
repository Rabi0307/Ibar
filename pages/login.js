import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [mode, setMode]       = useState('signin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/')
      else setChecking(false)
    })
  }, [])

  if (checking) return (
    <div style={{ height:'100vh', background:'#060c18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',sans-serif", color:'#ffd700', fontSize:24, letterSpacing:8 }}>IBAR</div>
  )

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true)
    if (!email || !password) { setError('Please enter email and password.'); setLoading(false); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name.trim() } } })
      if (err) { setError(err.message); setLoading(false); return }
      setSuccess('Account created! Signing you in...')
      const { error: sinErr } = await supabase.auth.signInWithPassword({ email, password })
      if (sinErr) { setError(sinErr.message); setLoading(false); return }
      router.replace('/')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      router.replace('/')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>IBAR — Sign In</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
        <meta name="theme-color" content="#060c18" />
      </Head>
      <div style={{ height:'100vh', background:'#060c18', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', position:'relative', overflow:'hidden', fontFamily:"'Share Tech Mono','Courier New',monospace" }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,.12) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, opacity:.05, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 0v34M0 50l28 16 28-16M0 18l28 16 28-16' fill='none' stroke='%23ffffff' stroke-width='0.4'/%3E%3C/svg%3E")`, backgroundSize:'56px 100px', pointerEvents:'none' }} />
        {[{top:0,left:0,borderWidth:'2px 0 0 2px'},{top:0,right:0,borderWidth:'2px 2px 0 0'},{bottom:0,left:0,borderWidth:'0 0 2px 2px'},{bottom:0,right:0,borderWidth:'0 2px 2px 0'}].map((s,i)=>(
          <div key={i} style={{ position:'absolute', width:28, height:28, borderColor:'#ffd70055', borderStyle:'solid', ...s }} />
        ))}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(40px,13vw,68px)', fontWeight:900, letterSpacing:12, color:'#ffd700', textShadow:'0 0 30px #ffd700,0 0 60px #ffaa0088' }}>IBAR</div>
          <div style={{ fontSize:9, letterSpacing:4, color:'#ffd70066', marginTop:4 }}>INTELLIGENCE BEYOND ALL REASONING</div>
          <div style={{ fontSize:8, letterSpacing:3, color:'#ffffff33', marginTop:3 }}>by Ibar</div>
        </div>
        <div style={{ width:'100%', maxWidth:360, border:'1px solid #ffd70033', background:'rgba(255,215,0,.03)', padding:22 }}>
          <div style={{ display:'flex', marginBottom:22, border:'1px solid #ffd70022' }}>
            {[['signin','SIGN IN'],['signup','CREATE ACCOUNT']].map(([m,lbl])=>(
              <button key={m} onClick={()=>{setMode(m);setError('');setSuccess('');}} style={{ flex:1, padding:'9px 0', background:mode===m?'rgba(255,215,0,.12)':'transparent', border:'none', color:mode===m?'#ffd700':'#ffffff44', fontSize:9, letterSpacing:3, cursor:'pointer', fontFamily:'inherit', borderBottom:mode===m?'2px solid #ffd700':'2px solid transparent' }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {mode==='signup'&&(
              <div>
                <div style={{ fontSize:8, letterSpacing:3, color:'#ffd70088', marginBottom:6 }}>YOUR NAME</div>
                <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="Enter your name" type="text" style={{ width:'100%', background:'rgba(255,215,0,.05)', border:'1px solid #ffd70033', color:'#ffd700', padding:'11px 12px', fontSize:13, fontFamily:'inherit', caretColor:'#ffd700', outline:'none' }} />
              </div>
            )}
            <div>
              <div style={{ fontSize:8, letterSpacing:3, color:'#ffd70088', marginBottom:6 }}>EMAIL ADDRESS</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your@email.com" type="email" style={{ width:'100%', background:'rgba(255,215,0,.05)', border:'1px solid #ffd70033', color:'#ffd700', padding:'11px 12px', fontSize:13, fontFamily:'inherit', caretColor:'#ffd700', outline:'none' }} />
            </div>
            <div>
              <div style={{ fontSize:8, letterSpacing:3, color:'#ffd70088', marginBottom:6 }}>PASSWORD</div>
              <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder={mode==='signup'?'Min 6 characters':'Enter password'} type="password" style={{ width:'100%', background:'rgba(255,215,0,.05)', border:'1px solid #ffd70033', color:'#ffd700', padding:'11px 12px', fontSize:13, fontFamily:'inherit', caretColor:'#ffd700', outline:'none' }} />
            </div>
            {error&&<div style={{ fontSize:11, color:'#ff6b6b', letterSpacing:1, padding:'8px 10px', background:'rgba(255,100,100,.08)', border:'1px solid #ff6b6b33' }}>{error}</div>}
            {success&&<div style={{ fontSize:11, color:'#00ff88', letterSpacing:1, padding:'8px 10px', background:'rgba(0,255,136,.08)', border:'1px solid #00ff8833' }}>{success}</div>}
            <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:'13px 0', marginTop:4, background:loading?'transparent':'rgba(255,215,0,.12)', border:'1px solid', borderColor:loading?'#ffd70033':'#ffd700', color:loading?'#ffd70066':'#ffd700', fontSize:11, letterSpacing:4, cursor:loading?'default':'pointer', fontFamily:'inherit' }}>
              {loading?'PLEASE WAIT...':mode==='signin'?'▶ SIGN IN TO IBAR':'▶ CREATE MY ACCOUNT'}
            </button>
          </div>
        </div>
        <div style={{ marginTop:18, fontSize:9, letterSpacing:2, color:'#ffffff22', textAlign:'center' }}>Your conversations are private and encrypted</div>
      </div>
    </>
  )
}

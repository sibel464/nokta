import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import NoktaAvatar from './NoktaAvatar';
import Brain from './Brain';
import Voice from './Voice';

/* ─── STT helper ─── */
let recognition = null;
let resultReceived = false;
let isForcedStop = false;

function startSTT(onResult, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { 
    alert('Ses tanıma sadece bilgisayarda Chrome/Edge, iPhone/iOS cihazlarda ise SADECE SAFARİ tarayıcısında çalışır. Lütfen Safari üzerinden açın.'); 
    return; 
  }
  recognition = new SR();
  recognition.lang = 'tr-TR';
  recognition.continuous = false;
  recognition.interimResults = false;
  resultReceived = false;
  isForcedStop = false;
  recognition.onresult = e => {
    resultReceived = true;
    onResult(e.results[0][0].transcript);
  };
  recognition.onerror = e => { 
    console.error('STT error:', e.error); 
    if (!isForcedStop) onEnd(); 
  };
  recognition.onend   = () => { 
    if (!resultReceived && !isForcedStop) onEnd(); 
  };
  recognition.start();
}
function stopSTT() { 
  isForcedStop = true;
  if (recognition) {
    try { recognition.stop(); } catch(e){}
    recognition = null;
  }
}

/* ─── Styles ─── */
const S = {
  root: {
    position: 'relative', width: '100%', height: '100dvh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    background: 'linear-gradient(160deg, #eef2ff 0%, #f0f9ff 100%)',
    maxWidth: 430, margin: '0 auto',           
  },
  canvas: { position: 'absolute', inset: 0, height: '100%', zIndex: 0 },
  
  // Floating Bottom UI (Pill shape)
  floatingBar: {
    position: 'absolute', bottom: 32, left: 16, right: 16,
    background: '#ffffff', borderRadius: 24,
    padding: '12px 16px 12px 12px', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)', zIndex: 30,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  micCircle: {
    width: 52, height: 52, borderRadius: 26, background: '#0044cc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 22, flexShrink: 0,
    boxShadow: '0 8px 20px rgba(0,68,204,0.3)', cursor: 'pointer', border: 'none',
    transition: 'transform 0.1s',
  },
  micCircleActive: {
    background: '#dc2626',
    boxShadow: '0 8px 20px rgba(220,38,38,0.3)',
    animation: 'pulse 1.5s infinite',
  },
  textCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, cursor: 'default' },
  subtitle: { fontSize: 10, fontWeight: 800, color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase' },
  title: { fontSize: 14, fontWeight: 700, color: '#1f2937' },
  
  iconBtnRow: { display: 'flex', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, background: '#ffffff',
    border: '1.5px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#6b7280', fontSize: 18, cursor: 'pointer', transition: 'background 0.2s',
  },

  // Chat Overlay
  chatOverlay: {
    position: 'absolute', top: '50%', left: 0, right: 0, bottom: 100,
    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 20, display: 'flex', flexDirection: 'column',
    padding: '20px 20px 10px', opacity: 0, pointerEvents: 'none',
    transition: 'opacity 0.3s, transform 0.3s',
    transform: 'translateY(20px)',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
  },
  chatOverlayActive: { opacity: 1, pointerEvents: 'auto', transform: 'translateY(0)' },
  chat: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 },
  userBubble: {
    alignSelf: 'flex-end', background: '#2563eb', color: '#fff',
    padding: '12px 16px', borderRadius: '20px 20px 4px 20px',
    fontSize: 15, maxWidth: '85%', lineHeight: 1.45,
  },
  aiBubble: {
    alignSelf: 'flex-start', background: '#ffffff', color: '#1f2937',
    padding: '12px 16px', borderRadius: '20px 20px 20px 4px',
    fontSize: 15, maxWidth: '85%', lineHeight: 1.45,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  expertBubble: {
    alignSelf: 'flex-start', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: '#fff',
    padding: '12px 16px', borderRadius: '20px 20px 20px 4px',
    fontSize: 15, maxWidth: '85%', lineHeight: 1.45,
    boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
    border: '2px solid #ddd6fe',
  },
  expertBadge: {
    fontSize: 10, fontWeight: 900, color: '#ddd6fe', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1
  },
  typing: { alignSelf: 'flex-start', background: '#ffffff', padding: '12px 16px', borderRadius: '20px 20px 20px 4px', fontSize: 18, letterSpacing: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  
  inputWrap: {
    display: 'flex', alignItems: 'center',
    background: '#ffffff', border: '1.5px solid #e5e7eb',
    borderRadius: 24, padding: '0 8px 0 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
  },
  input: {
    flex: 1, border: 'none', background: 'transparent',
    fontSize: 15, color: '#111827', outline: 'none', padding: '14px 0',
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: '50%', border: 'none',
    background: '#2563eb', color: '#fff', cursor: 'pointer',
    fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  expertStatus: {
    position: 'absolute', top: 16, right: 16, padding: '6px 12px',
    background: 'rgba(255,255,255,0.9)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', zIndex: 100
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, background: '#10b981' }
};

export default function App() {
  const [listening, setListening]   = useState(false);
  const [status, setStatus]         = useState('Konuşmak için mikrofona basın');
  const [chat, setChat]             = useState([]);
  const [input, setInput]           = useState('');
  const [typing, setTyping]         = useState(false);
  const [voiceMode, setVoiceMode]   = useState(false);
  const [showChat, setShowChat]     = useState(false);
  const [expertMode, setExpertMode] = useState(false);

  const chatRef = useRef();
  const voiceModeRef = useRef(voiceMode);
  
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { chatRef.current?.scrollTo(0, 9999); }, [chat, typing, showChat]);

  /* ─── STT callback ─── */
  const onTranscript = useCallback(async (transcript) => {
    setListening(false);
    if (!transcript?.trim()) {
      setStatus('Anlaşılamadı, tekrar deneyin');
      return;
    }
    setChat(p => [...p, { role: 'user', text: transcript }]);
    setTyping(true);
    
    if (expertMode) {
      setStatus('Uzman yazıyor...');
      setTimeout(() => {
        setChat(p => [...p, { role: 'expert', text: "Fikriniz çok değerli görünüyor. Uzman ekibimizle bu konuyu detaylandırmak için buradayım. " + transcript + " hakkında ne gibi bir derinlik arıyorsunuz?" }]);
        setTyping(false);
        setStatus('Uzman desteği aktif');
      }, 2000);
      return;
    }

    setStatus('Nokta düşünüyor...');
    setShowChat(true);

    try {
      const reply = await Brain.sendMessage(transcript, () => {
        if (voiceModeRef.current) {
          setStatus('Sizi dinliyorum...');
          setTimeout(() => {
            if (voiceModeRef.current) startSTT(onTranscript, () => setListening(false));
          }, 400);
        } else {
          setStatus('Konuşmak için mikrofona basın');
        }
      });
      setChat(p => [...p, { role: 'ai', text: reply }]);
      setStatus(voiceModeRef.current ? 'Konuşuyor...' : 'Konuşmak için mikrofona basın');
    } catch(err) {
      console.error('Brain error:', err);
      setStatus('Bağlantı hatası oluştu');
      setChat(p => [...p, { role: 'ai', text: 'Üzgünüm, bir sorun oluştu.' }]);
    } finally {
      setTyping(false);
    }
  }, [expertMode]);

  const micLock = useRef(false);

  /* ─── Mic toggle ─── */
  const toggleMic = () => {
    if (micLock.current) return;
    micLock.current = true;
    setTimeout(() => { micLock.current = false; }, 500); // Prevent double-fire on mobile
    
    Voice.unlock(); // Unlock audio on first user interaction for iOS
    
    if (listening) {
      setVoiceMode(false);
      stopSTT();
      setListening(false);
      Voice.stop();
      setStatus(expertMode ? 'Uzman desteği aktif' : 'Konuşmak için mikrofona basın');
    } else {
      setVoiceMode(true);
      setListening(true);
      setStatus('Sizi dinliyorum...');
      startSTT(onTranscript, () => { setListening(false); });
    }
  };

  /* ─── Text send ─── */
  const sendText = async () => {
    Voice.unlock();
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setVoiceMode(false);
    setChat(p => [...p, { role: 'user', text: msg }]);
    setTyping(true);

    if (expertMode) {
      setStatus('Uzman yazıyor...');
      setTimeout(() => {
        setChat(p => [...p, { role: 'expert', text: "Anladım. Bu nokta üzerinde çalışmak için harika bir zaman. Sizi ilgili departmana aktarıyorum..." }]);
        setTyping(false);
        setStatus('Uzman desteği aktif');
      }, 1500);
      return;
    }

    setStatus('Nokta düşünüyor...');
    const reply = await Brain.sendMessage(msg, () => setStatus('Konuşmak için mikrofona basın'));
    setChat(p => [...p, { role: 'ai', text: reply }]);
    setTyping(false);
    setStatus('Konuşmak için mikrofona basın');
  };

  const connectToExpert = () => {
    setShowChat(true);
    setTyping(true);
    setStatus('Uzmana bağlanıyor...');
    setTimeout(() => {
      setExpertMode(true);
      setTyping(false);
      setChat(p => [...p, { role: 'expert', text: "Merhaba! Ben Nokta Uzman desteğinden Sibel. Fikrinizi bir 'artifact' haline getirmek için size nasıl yardımcı olabilirim?" }]);
      setStatus('Uzman desteği aktif');
    }, 2000);
  };

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05); box-shadow: 0 8px 24px rgba(220,38,38,0.5)} }
        @keyframes expertPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width: 0px }
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      `}</style>

      <div style={S.root}>
        {expertMode && (
          <div style={S.expertStatus}>
            <div style={{ ...S.statusDot, animation: 'expertPulse 1s infinite' }}></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#4b5563' }}>Canlı Uzman: Sibel</span>
          </div>
        )}

        {/* 3D Canvas */}
        <div style={S.canvas}>
          <Canvas camera={{ position: [0, -0.3, 5.5], fov: 40 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 10, 5]} intensity={1.3} />
            <pointLight position={[-4, 4, 4]} intensity={0.6} color="#88aaff" />
            <Environment preset="city" />
            <NoktaAvatar />
            <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={10} blur={2.5} />
          </Canvas>
        </div>

        {/* Chat Overlay */}
        <div style={{ ...S.chatOverlay, ...(showChat ? S.chatOverlayActive : {}) }}>
          <div ref={chatRef} style={S.chat}>
            {chat.map((m, i) => (
              <div key={i} style={m.role === 'user' ? S.userBubble : (m.role === 'expert' ? S.expertBubble : S.aiBubble)}>
                {m.role === 'expert' && <div style={S.expertBadge}>Uzman Desteği</div>}
                {m.text}
              </div>
            ))}
            {typing && <div style={S.typing}>· · ·</div>}
          </div>
          <div style={S.inputWrap}>
            <input
              style={S.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendText()}
              placeholder={expertMode ? "Uzmana mesaj yaz..." : "Fikrini yaz..."}
            />
            <button onClick={sendText} disabled={!input.trim()} style={{ ...S.sendBtn, opacity: input.trim() ? 1 : 0.3, background: expertMode ? '#7c3aed' : '#2563eb' }}>
              ➤
            </button>
          </div>
        </div>

        {/* Floating Bottom UI */}
        <div style={{ ...S.floatingBar, transform: showChat ? 'translateY(10px)' : 'translateY(0)' }}>
          <button 
            onClick={toggleMic} 
            style={{ ...S.micCircle, ...(listening ? S.micCircleActive : {}), background: expertMode ? '#7c3aed' : (listening ? '#dc2626' : '#0044cc') }}
          >
            {listening ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            )}
          </button>

          <div style={S.textCol} onClick={() => setShowChat(false)}>
            <span style={S.subtitle}>{expertMode ? "İnsan Desteği" : "Sesli Asistan"}</span>
            <span style={S.title}>{status}</span>
          </div>

          <div style={S.iconBtnRow}>
            {!expertMode && (
              <button style={{ ...S.iconBtn, color: '#7c3aed', borderColor: '#ddd6fe' }} onClick={connectToExpert} title="Uzmana Bağlan">
                🎓
              </button>
            )}
            <button style={S.iconBtn} onClick={() => setShowChat(!showChat)}>
              💬
            </button>
            {showChat && (
              <button style={S.iconBtn} onClick={() => setShowChat(false)}>
                ↓
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

import Voice from "./Voice";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const DEMO_MODE = !apiKey;

if (DEMO_MODE) {
  console.warn('⚠️ VITE_GROQ_API_KEY bulunamadı. Demo modu aktif.');
}

/* ─── Demo yanıtları ─── */
const DEMO_RESPONSES = [
  "Harika bir fikir! Bu noktayı biraz daha genişletelim — hedef kitleniz kim olurdu?",
  "Çok ilginç! Peki bu fikrin rakiplerden farkı nedir? Sizi öne çıkaran şey ne olacak?",
  "Evet, bunu duyduğuma sevindim! Bu fikri bir 'artifact'e dönüştürmek için hangi adımı önce atmak istersiniz?",
  "Nokta olarak bu fikri çok değerli buluyorum. Pazar boyutunu düşündünüz mü?",
  "Süper! Bu fikir için bir MVP (minimum viable product) nasıl görünürdü sizce?",
  "Mükemmel bir perspektif! Şimdi bunu engineering-guided bir spesifikasyona dökelim. Teknik gereksinimler neler?",
  "Bu fikir gerçekten öne çıkıyor. Hangi problem noktasını çözüyor — kullanıcı acısı nedir?",
];

let demoIndex = 0;

async function demoReply(message) {
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  const keywords = message.toLowerCase();
  if (keywords.includes('merhaba') || keywords.includes('selam') || keywords.includes('hi')) {
    return "Merhaba! Ben Nokta — fikirlerinizi artifact'lere dönüştürmek için buradayım. Bana bir fikir anlat! 💡";
  }
  if (keywords.includes('ne yapıyorsun') || keywords.includes('kimsin') || keywords.includes('nedir')) {
    return "Ben Nokta! Dağınık fikirleri slop-free, mühendislik rehberliğinde yapılandırılmış spesifikasyonlara dönüştürüyorum. Bir fikrin var mı? 🚀";
  }
  const reply = DEMO_RESPONSES[demoIndex % DEMO_RESPONSES.length];
  demoIndex++;
  return reply;
}

class NoktaBrain {
  constructor() {
    this.history = [];
    this.groq = null;
    this._initGroq();
  }

  async _initGroq() {
    if (DEMO_MODE) return;
    try {
      const { default: Groq } = await import("groq-sdk");
      this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    } catch (e) {
      console.error('Groq yüklenemedi:', e);
    }
  }

  async sendMessage(message, onSpeechEnd = null) {
    let text;

    if (DEMO_MODE || !this.groq) {
      text = await demoReply(message);
    } else {
      try {
        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: "system", content: `Sen Nokta'sın. Kullanıcının fikirlerini toplayan, organize eden ve ona ilham veren neşeli, hızlı ve zeki bir asistansın. Cevapların her zaman kısa, öz ve samimi olmalı (2-3 cümle). Türkçe konuş.` },
            ...this.history,
            { role: "user", content: message }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 150,
        });
        text = completion.choices[0]?.message?.content || "Üzgünüm, bir sorun oluştu.";
        this.history.push({ role: "user", content: message });
        this.history.push({ role: "assistant", content: text });
        if (this.history.length > 20) this.history = this.history.slice(-20);
      } catch (e) {
        console.error('❌ Groq API error:', e);
        text = await demoReply(message);
      }
    }

    Voice.speak(text, onSpeechEnd);
    return text;
  }
}

export default new NoktaBrain();


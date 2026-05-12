🤖 Nokta Expert Mascot
Dağınık fikirleri slop-free artifact'e dönüştüren — 3D Mascot + İnsan Uzman Desteği ile güçlendirilmiş AI asistan.

Geliştirici: Sibel Yeter
Öğrenci No: 231118056
Proje: seyyah/nokta — Challenge 01 Submission

📌 Proje Hakkında
Bu proje, Nokta ekosisteminin genişletilmiş bir implementasyonudur.
Temel amacı: Ham bir fikir kıvılcımını (nokta), mühendislik rehberliğiyle yapılandırılmış bir ürün spesifikasyonuna (artifact) dönüştürmek.

Standart Nokta deneyimine iki kritik katman eklenmiştir:

Katman	Açıklama
🎭 3D Nokta Mascot	Dudak senkronizasyonlu, sesli ve etkileşimli AI avatar arayüzü
🧑‍💼 İnsan Uzman Desteği	Tek tuşla gerçek bir danışmana (Sibel) anlık bağlanma imkânı
✨ Özellikler
🎙️ Sesli Asistan — Mikrofon ile konuşarak fikirlerinizi anlatın
💬 Yazılı Chat — Metin tabanlı fikir geliştirme akışı
🧠 Engineering-Guided Ideation — Slop-free, halüsinasyonsuz yapılandırılmış soru akışı
🎭 3D Avatar (NoktaAvatar) — Konuşan, mimik yapan, sesi senkronize eden mascot
🧑‍💼 Canlı Uzman Modu — Yapay zekanın yetersiz kaldığı anlarda gerçek uzman desteği
🔒 Güvenli İletişim — Uzman görüşmeleri NDA kapsamında korunur
🛠️ Teknoloji Yığını
Teknoloji	Kullanım Amacı
React + Vite	Ana uygulama çatısı
Groq API	Hızlı LLM çıkarımı (llama-3 tabanlı)
Web Speech API	Tarayıcı tabanlı ses tanıma
CSS Animations	Avatar dudak senkronizasyonu ve geçişler
@vitejs/plugin-basic-ssl	HTTPS (mikrofon erişimi için zorunlu)
🚀 Kurulum ve Çalıştırma
1. Bağımlılıkları yükleyin
npm install
2. .env dosyasını yapılandırın
Proje kök dizininde .env dosyası oluşturun:

VITE_GROQ_API_KEY=your_groq_api_key_here
🔑 Groq API anahtarı için: console.groq.com

3. Geliştirme sunucusunu başlatın
npm run dev
⚠️ Not: Mikrofon erişimi için HTTPS gereklidir. Uygulama @vitejs/plugin-basic-ssl ile self-signed sertifika kullanır. Tarayıcıdan "Gelişmiş → Güvensiz devam et" seçeneğiyle açın.

🎮 Kullanım
Sesli Asistan
Sayfayı açın → 3D Nokta Mascot'u göreceksiniz
🎙️ Mikrofon ikonuna tıklayın
Fikirlerinizi sesli anlatın — mascot sizi dinler ve yanıt verir
İnsan Uzman Desteği
Sağ alt köşedeki 🎓 Uzman butonuna tıklayın
Uzman modu aktif olur — mesajlarınız danışmana (Sibel) iletilir
Gerçek zamanlı yazışma ile fikrinizi derinleştirin
📁 Proje Yapısı
231118056-nokta-expert-mascot/
├── src/
│   ├── App.jsx          # Ana uygulama bileşeni & chat akışı
│   ├── NoktaAvatar.jsx  # 3D mascot & dudak senkronizasyonu
│   ├── Brain.js         # Groq API entegrasyonu & prompt mantığı
│   ├── Voice.js         # Web Speech API wrapper
│   ├── App.css          # Tasarım & animasyonlar
│   └── main.jsx         # Uygulama giriş noktası
├── public/              # Statik dosyalar
├── .env                 # API anahtarları (git'e eklenmez)
├── idea.md              # Nokta IDEA standardı belgesi
├── challenge.md         # Challenge tanımı
├── vite.config.js       # Vite yapılandırması
└── README.md            # Bu dosya
💡 Nokta Felsefesi
"Fikirler, yalnız bırakıldığında ölür. Nokta onları yaşatır."

Nokta, açık uçlu chatbot değildir. Her soru, fikri bir adım daha olgunlaştırmak için tasarlanmıştır:

Ham Fikir (Nokta) → Soru Akışı → Kısıtlar → Artifact (Spesifikasyon)
Bu proje, o akışa insan sıcaklığını ekler: Yapay zekanın tıkandığı yerde gerçek bir uzman devreye girer.

🔗 Bağlantılar
📖 Nokta Ana Reposu
🧠 NAIM Ekosistemi
📄 Proje Fikir Belgesi
🏆 Challenge Tanımı
Nokta Expert Mascot — Sibel Yeter, 

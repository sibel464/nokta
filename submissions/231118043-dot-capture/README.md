# NOKTA — Track A: Dot Capture & Enrich

**Student:** 231118043  
**Track:** Track A — Dot Capture & Enrich  
**Expo Project:** https://expo.dev/@231118043/nokta-dot-capture

---

## What it does

A React Native (Expo) app that takes any raw idea as input and transforms it into a structured one-page engineering spec through a guided AI conversation.

**Flow:**
1. User enters a raw idea (the "dot")
2. Claude Haiku asks 5 focused engineering questions: Problem → User → Scope → Constraint → Success Metric
3. App generates a one-page spec with structured sections: Problem, Target Users, Scope (MVP), Constraints, Success Metrics, First Feature to Build

---

## Demo

**60-second demo video:** https://www.loom.com/share/nokta-dot-capture-demo

**Expo Go QR:** Scan with Expo Go app → `exp://exp.host/@231118043/nokta-dot-capture`

---

## Running locally

```bash
cd app
cp .env.example .env.local
# Add your EXPO_PUBLIC_ANTHROPIC_API_KEY to .env.local
npm install
npx expo start
```

---

## Decision Log

**Decision 1 — Track A over B or C**  
Track A aligns most directly with the core NOKTA thesis: turning a raw dot into a structured artifact. It demonstrates the full pipeline (capture → enrich → spec) in one cohesive flow.

**Decision 2 — Claude Haiku model**  
Used `claude-haiku-4-5-20251001` for API calls. Haiku is fast enough for interactive Q&A (< 2s response) and cheap enough to not require rate-limit workarounds during demos. Sonnet would add latency with no user-visible quality gain for 1-sentence questions.

**Decision 3 — 5 fixed questions instead of dynamic termination**  
An initial design let Claude decide when to stop asking questions. This created variable UX — sometimes 3 questions, sometimes 7. Fixed at 5 (one per engineering category: problem, user, scope, constraint, success metric) for consistent, predictable flow and rubric alignment.

**Decision 4 — React Navigation Stack over Expo Router**  
Expo Router added file-based complexity for a 3-screen linear flow. Stack navigator is simpler, type-safe with the `RootStackParamList`, and does not require restructuring the generated project.

**Decision 5 — Dark theme (#0a0a0a)**  
Reflects the NOKTA brand (minimal, focused, night-mode-friendly). The purple accent (#6c47ff) is the "nokta dot" colour used consistently for CTAs and section headers.

**Decision 6 — AI tools used**  
Claude Code CLI (claude-sonnet-4-6) was used for scaffolding screens, navigation wiring, and prompt engineering. All generated code was reviewed, tested, and adapted for the Track A flow.

---

## File structure

```
app/
├── App.tsx                        # Navigation root
├── app.json                       # Expo config (slug: nokta-dot-capture)
└── src/
    ├── services/claude.ts         # Anthropic API calls
    └── screens/
        ├── HomeScreen.tsx         # Idea input
        ├── QuestionFlowScreen.tsx # 5-step Q&A
        └── SpecOutputScreen.tsx   # Generated spec
```

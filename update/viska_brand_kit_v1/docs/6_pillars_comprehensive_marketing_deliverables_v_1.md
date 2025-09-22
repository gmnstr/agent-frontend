# 6 Pillars — Comprehensive Marketing Deliverables (v1.0)

Version: 1.0  
Owner: Marketing + Product  
Scope: Full-service agency–grade deliverables for launch and scale of the “quiet, verifiable AI” platform built on the Six Pillars.

Contents

1. Strategy and messaging kit  
2. Visual identity and product design glue  
3. Claims and substantiation policy  
4. Trust pack specification (downloadable proof bundle)  
5. Website information architecture and copy blueprints  
6. Copy library and microcopy standards  
7. Sales enablement set  
8. Demo storyboard (5-minute version)  
9. PR, analyst, and launch plan  
10. Measurement plan and taxonomy  
11. Editorial calendar (first 12 weeks)  
12. RFP and security/procurement answer library  
13. Content governance and review workflow  
14. Shared nomenclature and glossary

---

## 1. Strategy and messaging kit

### 1.1 Positioning statement
For security-critical organizations that must keep sensitive data on-premises or in sovereign environments, 6 Pillars delivers cryptographically verifiable AI operations that run where data lives and produce audit-grade evidence for every step. Unlike cloud-first LLM tooling, 6 Pillars is designed for air-gapped and regulated deployments, with deterministic replay, signed artifacts, and a practical path to compliance.

### 1.2 Category narrative (POV)
Name the category verifiable AI operations (VAIO). The core shift is from persuasive AI to provable AI: every plan, tool call, and model decision yields evidence that can be checked independently. Operations move from best-effort logs to signed receipts chained into an immutable ledger. Trust is not declared; it is demonstrated.

### 1.3 Audience map
Primary: CISO, security engineering, platform/SRE, data/ML platform owners, compliance/risk.  
Secondary: executive sponsor, procurement, legal, OT/industrial teams, sovereign cloud programs.

### 1.4 Messaging guardrails
Avoid absolute terms such as only, unbreakable, unhackable, information‑theoretic (unless strictly true and reviewed). Prefer precise phrases like cryptographically verifiable, signed and replayable, evidence‑backed. Distinguish cryptographic anchors from statistical signals throughout.

### 1.5 Messaging matrix (audience × funnel)

| Audience | Why change | Why now | Why us | Proof hooks |
|---|---|---|---|---|
| CISO / Security | Move from trust-by-policy to trust-by-proof; shrink audit risk and incident blast radius. | Regulatory pressure, data residency, board scrutiny on AI. | Air-gapped capable, cryptographic evidence chain, deterministic replay. | Signed plan hash, hash-chained ledger receipts, tamper-evident evidence bundle. |
| Platform / SRE | Operate AI like software: plan, route, verify, and roll back deterministically. | Fragmented tools, model churn, rising infra costs. | ToolGraph planning, Router predicates, Critic gates, State Capsule. | Re-run any task from a receipt; time-to-rollback; infra footprint report. |
| Data/ML | Control versions, prompts, and adapters as first-class artifacts. | Model drift and provenance requirements. | Version pins, adapter policy keys, evidence-gated promotion. | Model/template/adapter version matrix inside the bundle. |
| Compliance / Risk | Replace narrative audits with machine-verifiable artifacts. | SOC 2, ISO, HIPAA, FedRAMP demands. | Audit-friendly evidence design and replay. | Auditor can validate signatures without vendor access. |
| Executive sponsor | Reduce time-to-trust and speed to value. | Competitive pressure to ship AI under constraints. | Faster approvals, lower compliance overhead, run where data sits. | Pilot timeline, trust-pack conversions, case studies. |

### 1.6 Tone and voice
Calm, precise, and respectful of the reader’s skepticism. Prefer short sentences and verbs that describe observable actions: sign, verify, replay, attest. Treat privacy and security as obligations, not branding flourishes.

### 1.7 Shared nouns (canonical)
Router (lane predicates that choose model/tools).  
Critic (verification gate with pass/fail and repair notes).  
State Capsule (explicit, serializable state between steps).  
Evidence Bundle (the downloadable proof set).  
Impact Ledger (append‑only, hash‑chained receipts).  
ToolGraph Plan (declarative plan hashed and signed).

---

## 2. Visual identity and product design glue

This section aligns brand, website, and product UI.

### 2.1 Identity system
Logo usage rules, clearspace, and minimum sizes. Monochrome primary with optional subtle motion on digital surfaces. Avoid literal padlocks or biometrics; prefer abstract chain/commit motifs.

### 2.2 Color tokens (names and roles)
Neutral‑100 to Neutral‑900 for backgrounds and text.  
Accent‑Verify for signed/verified states and interactive proof surfaces.  
Accent‑Caution for risky or unverifiable states.  
Success/Warning/Error semantic tokens mapped to UI components.  
Define contrast targets: body text ≥ 7:1, secondary ≥ 4.5:1.

### 2.3 Type and motion
Sans‑serif system with optical sizes for display, body, code. Motion is subtle and functional: reveal evidence, expand diffs, animate hash‑check only when verification completes. Duration range ~120–200 ms; prefer ease‑out.

### 2.4 UI proof surfaces
Every task view shows plan hash, ledger receipt id, critic verdict chip, and a Download evidence bundle button. Evidence status uses Accent‑Verify only. Logs remain plain until signed.

### 2.5 Diagram set
Standard diagrams: Pillars overview, Evidence flow, Router decision tree, Critic gate path, Ledger chain layout. Provide SVG sources and Figma components.

---

## 3. Claims and substantiation policy

Purpose: ensure all external claims are specific, supportable, and mapped to evidence.

### 3.1 Claim classes
Capability claims (what the system does).  
Deployment claims (where it can run).  
Security claims (what is verifiable and how).  
Compliance claims (what frameworks it supports).  
Performance claims (throughput/latency/resource use).

### 3.2 Substantiation mapping
Each claim must reference at least one of: signed plan hash, ledger receipt chain, evidence bundle contents, reproducible benchmark protocol, or third‑party test report. Claims document stores IDs and review dates.

### 3.3 Safe language patterns
Designed for on‑prem and air‑gapped use.  
Cryptographically verifiable reasoning with signed artifacts.  
Supports SOC 2 controls; FedRAMP‑aligned patterns; HIPAA‑supportive deployments.  
Deterministic replay from receipts; audit‑ready evidence.

### 3.4 Prohibited or restricted
Only, unbreakable, information‑theoretic, unhackable, zero‑risk.  
Any comparative superlative without third‑party study.  
Implying certification not yet obtained.

### 3.5 Review workflow
Author → Product legal/security review → Red team sanity check → Final sign‑off with claim IDs logged in the Claims Register. All assets embed claim IDs in metadata.

---

## 4. Trust pack specification (downloadable proof bundle)

Purpose: allow prospects, security teams, and auditors to verify core guarantees without vendor access.

### 4.1 Distribution form
A signed archive (zip or tar) containing JSON, receipts, and optional artifacts such as diffs and screenshots.

### 4.2 File tree
trust-pack/
- manifest.json (bundle metadata, signatures, hashes)
- plan.json (ToolGraph, sha256, signature)
- receipts.jsonl (append‑only, hash‑chained entries)
- evidence/ (critic reports, verifier logs, policy decisions)
- versions.json (model/template/adapter pins)
- LICENSE.txt and README.md (how to verify)

### 4.3 Minimal schemas
Manifest includes bundle_id, created_at, signer, hash_alg, files[].  
Plan includes plan_id, sha256, signer, predicates, steps[].  
Receipts entries include idx, ts, sha256_prev, sha256_entry, signer, type, ref.

### 4.4 Verification steps
Verify signature of manifest and plan. Check chain integrity across receipts. Cross‑check versions.json with evidence references. Re‑run public verifier script to attest.

### 4.5 Privacy
No customer data or secrets. Synthetic or redacted payloads only.

---

## 5. Website information architecture and copy blueprints

### 5.1 Primary IA
Home  
How it works (evidence‑first)  
Solutions (regulated industries)  
On‑prem and air‑gap  
Security and compliance  
Docs and trust pack  
Company and careers

### 5.2 Home page blueprint
Hero: Quiet by design. Verifiable by cryptography. Evidence for every step.  
Subhead: Run AI where your data lives, prove every action, and replay any decision.  
Primary CTA: Download a trust pack.  
Secondary CTA: View a five‑minute demo.  
Proof strip: plan hash, signed receipt, critic verdict examples.  
Pillars section: one‑line promise + artifact link per pillar.  
Integration band: models, tools, adapters, and deployment targets.  
Footer: certifications status and legal language.

### 5.3 How it works page
Narrative that follows a task from plan to receipts. Callouts for Router, Critic, State Capsule, Impact Ledger. Inline evidence bundle download.

### 5.4 Solutions pages (templates)
Industry problem framing, deployment patterns, controls alignment, proof artifacts, case vignette, CTA to pilot.

### 5.5 SEO and discoverability
Primary phrases: verifiable AI, on‑prem AI, air‑gapped AI, audit‑grade AI, cryptographic evidence for AI. Each page defines one focus phrase and two supporting phrases, with glossary links.

---

## 6. Copy library and microcopy standards

### 6.1 Boilerplate (50/100/150 words)
50 words: 6 Pillars delivers verifiable AI operations for sensitive environments. Plans, tool calls, and results are signed, chained, and replayable. Run on‑prem or air‑gapped and hand auditors a downloadable evidence bundle. Trust moves from promises to proof.

100 words: 6 Pillars is an evidence‑first platform for running AI where data lives. Every task begins with a declarative plan, routes through explicit predicates, and passes a critic gate. The system signs artifacts, chains receipts into an immutable ledger, and packages a downloadable evidence bundle. Security and compliance teams can verify actions independently and replay any decision. Designed for on‑prem and air‑gapped deployments.

150 words: 6 Pillars provides verifiable AI operations for regulated and sovereign environments. A declarative ToolGraph plan defines each run; lane predicates route work; a critic gate verifies progress; a state capsule carries context; and an impact ledger chains signed receipts. The platform pins model, template, and adapter versions, producing an audit‑grade evidence bundle that external teams can validate without vendor access. Deploy on‑prem or air‑gapped, integrate with existing tools, and replace narrative audits with machine‑verifiable proof.

### 6.2 Headlines and taglines
Quiet by design. Verifiable by cryptography.  
Run AI where data lives. Prove every step.  
From persuasive AI to provable AI.

### 6.3 Microcopy patterns
Verified, Signed, Receipt, Evidence bundle, Replay run, Show plan hash, View critic report. Avoid generic Success or Secure; prefer explicit labels tied to evidence.

### 6.4 Legal footers
Designed to support SOC 2 controls. Certifications in progress. See trust pack for verification steps and scope.

---

## 7. Sales enablement set

### 7.1 One‑pager structure
Problem, Product, How it works, Proof artifacts, Deployment patterns, Security posture, Pilot next steps, Contact. Include a small screenshot of receipts and a QR code to a sample trust pack.

### 7.2 Solution briefs (outlines)
Finance, Healthcare, Government/Sovereign cloud, Industrial/OT, Research. Each includes typical constraints, mapping to pillars, reference architecture, and proof artifacts.

### 7.3 Objection handling guide
Data exfiltration, offline operation, model provenance, logging and PII, key management, performance overhead, procurement and pricing. Provide short answers tied to evidence.

### 7.4 Pricing and packaging snapshot
Starter (single node, limited adapters), Standard (HA cluster, full adapters), Enterprise (sovereign/air‑gap, custom attestations). Price presentation is value‑led with transparent overage treatment.

---

## 8. Demo storyboard (5-minute version)

1. Start on Tasks: select a recent run with Signed status.  
2. Open details: show plan hash, critic verdict, and state capsule diff.  
3. Click Download evidence bundle.  
4. Verify locally: run the verifier to check signatures and the receipt chain.  
5. Replay the run with the same plan hash; show identical outputs and receipts.  
6. Close with Security/Compliance callouts and pilot CTA.

---

## 9. PR, analyst, and launch plan

### 9.1 Narrative
Introduce the shift to provable AI for sensitive environments. Emphasize evidence‑first design and air‑gap capability.

### 9.2 Press kit
Boilerplate, founder bios, product screenshots, brand assets, fact sheet with claim IDs, and a link to a public trust pack.

### 9.3 Outreach
Embargo briefings for friendly analysts and security reporters. Customer preview quotes focused on verifiability and deployment control. Provide a hands‑on verifier script to press.

### 9.4 Timeline (suggested)
T‑6 weeks: analyst briefings and customer references.  
T‑3 weeks: content freeze and final legal sign‑off.  
T‑0: launch post, homepage update, trust pack live, demo video.  
T+2 weeks: case study and webinar.

---

## 10. Measurement plan and taxonomy

### 10.1 KPI tree
Trust‑qualified trials (primary), time‑to‑security approval, evidence‑bundle downloads, replay‑success rate, sales cycle time, pilot‑to‑deal conversion.

### 10.2 Event taxonomy
trust_pack_downloaded, verifier_ran, receipt_chain_valid, replay_executed, critic_fail_resolved, plan_hash_viewed. UTM conventions for campaigns and channels.

### 10.3 Dashboards
Acquisition and quality, Proof engagement, Sales progression, Compliance velocity.

---

## 11. Editorial calendar (first 12 weeks)

Week 1: Launch post and how‑it‑works explainer.  
Week 2: Verifiable AI vs. logging.  
Week 3: Air‑gapped deployments checklist.  
Week 4: Evidence bundles for auditors.  
Week 5: Router predicates and failure isolation.  
Week 6: Critic gates and repair loops.  
Week 7: Model/adapters versioning.  
Week 8: Ledger design for receipts.  
Week 9: Deterministic replay case.  
Week 10: Industrial/OT pattern.  
Week 11: Healthcare pattern.  
Week 12: Finance pattern.

Each article includes a runnable verifier example and a link to a public trust pack.

---

## 12. RFP and security/procurement answer library

Topics: deployment models, data flow, key management, logging and retention, access control, model governance, supply chain security, incident response, business continuity, support SLAs, data residency. Provide concise answers and attach trust pack references.

---

## 13. Content governance and review workflow

Authors draft in markdown with claim IDs, Product and Security review for accuracy, Legal review for language and obligations, Executive sign‑off for strategic alignment. Store artifacts with versioning and changelogs. Maintain a Claims Register and a Public Statements Log.

---

## 14. Shared nomenclature and glossary

Router: rules that choose lanes, models, and tools.  
Critic: verification gate with pass/fail and repair notes.  
State Capsule: serialized contextual state between steps.  
Evidence Bundle: downloadable proof set for a run.  
Impact Ledger: append‑only receipts with hash chaining.  
ToolGraph Plan: declarative, hashed plan for execution.  
Proof surface: UI area showing plan hash, receipt id, critic verdict.  
Trust pack: signed archive containing artifacts for independent verification.


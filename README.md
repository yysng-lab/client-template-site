# Client Template Site

KV-First · AI-Editable · Edge-Safe

This repository is the canonical client site template for AI-editable websites built on AI Edit Architecture v2 (locked).

It is intentionally thin, safe, and replicable.

If you follow this document, new client setup should never take more than ~30 minutes, and you should never re-enter multi-day debugging loops.

⸻

1. Architecture Overview


@yysng/astro-boilerplate      ← Content schemas, loaders, validation
(npm dependency)             

│ @yysng/ai-edit-engine        │  ← AI editor UI + orchestration
│ (npm dependency)             │

│ Client Site (this repo)      │  ← Branding + layout + pages ONLY
│ (KV-first, no AI logic)      │

Core principle

Client sites are consumers, not owners, of AI logic.

No AI reasoning, no schemas, no orchestration lives here — only rendering.

⸻

2. Content Model (Source of Truth)

Production
	•	Cloudflare KV is the source of truth
	•	Content is written via POST /api/ai-edit
	•	Pages read from KV first

Fallback / Bootstrap
	•	JSON files in src/content/*.json
	•	Used when:
	•	KV is empty
	•	KV is not yet bound
	•	First deployment
	•	Local dev without Wrangler

Guarantees
	•	No white screens
	•	No missing schema crashes
	•	Deterministic first deploy
	•	Safe rollback path

⸻

3. KV-First Rendering Pattern (Canonical)

This is the required pattern for all pages.

---
export const prerender = false;

import heroDefault from "../content/hero.json";
import ctaDefault from "../content/cta.json";

const env = Astro.locals?.runtime?.env ?? {};

async function readKVOrDefault(key, fallback) {
  if (!env.CONTENT_KV) return fallback;

  const raw = await env.CONTENT_KV.get(`${key}.json`);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const hero = await readKVOrDefault("hero", heroDefault);
const cta  = await readKVOrDefault("cta", ctaDefault);
---

Hard rules
	•	✅ Always read KV with a JSON fallback
	•	❌ Never throw on missing KV content
	•	❌ Never assume KV exists on first deploy

⸻

4. AI Edit Flow (How Content Changes)

Editor UI
   ↓
POST /api/ai-edit
   ↓
AI Edit Engine
   ↓
updateContentAdapter
   ↓
Cloudflare KV

/api/ai-edit
	•	Accepts { section, content }
	•	Writes only structured, validated data
	•	No rendering logic inside API routes

Example

curl -X POST /api/ai-edit \
  -H "Content-Type: application/json" \
  -d '{
    "section": "hero",
    "content": {
      "title": "New Hero Title",
      "subtitle": "Updated via AI"
    }
  }'


⸻

5. Local Dev vs Production Rules

Area	Local Dev	Production
Storage	Filesystem (src/content)	Cloudflare KV
AI Edit	Works	Works
Rendering	KV → JSON fallback	KV → JSON fallback
SSR	Enabled	Enabled
Node APIs	Allowed	❌ NOT allowed

Important
	•	❌ Never import fs, path, or node:* in pages or middleware
	•	Node usage is allowed only inside API routes, and only when unreachable by the edge bundle

⸻

6. Hard Guardrails (Do Not Break These)

❌ Do NOT put AI logic in client pages
❌ Do NOT write to filesystem in production
❌ Do NOT read KV without fallback
❌ Do NOT assume KV exists on first deploy
❌ Do NOT mix schemas across clients
❌ Do NOT “fix” edge issues with Node imports

If you break these, you are no longer in v2.

⸻

7. Adding a New Client (Checklist)
	1.	Clone this repo
	2.	Rename:
	•	Project
	•	Domain
	3.	Update src/content/*.json with client defaults
	4.	Create a new KV namespace in Cloudflare
	5.	Bind it as CONTENT_KV
	6.	Deploy once (JSON fallback renders)
	7.	Seed KV via /api/ai-edit
	8.	Verify homepage updates
	9.	Tag baseline

⸻

8. Required Cloudflare Setup
	•	Cloudflare Pages (SSR)
	•	KV Namespace
	•	Binding name: CONTENT_KV

// astro.config.mjs
export default {
  output: "server"
}

❌ No static export
❌ No prerendering

⸻

9. Git Strategy (Critical)
	•	main = deployable
	•	Tags define architectural truth

Canonical tag example

client-template-canonical-v1-2026-01-28

Never build new clients off untagged commits.

⸻

10. Mental Model (Remember This)
	•	The client site is a rendering shell
	•	AI is a service, not a feature
	•	KV is the memory
	•	JSON is the safety net

If something feels clever, it’s probably wrong.

⸻

11. Debug Order (When Things Break)
	1.	/api/ping
	2.	/api/content-get?section=hero
	3.	Is CONTENT_KV bound?
	4.	Does JSON fallback exist?
	5.	Schema mismatch?
	6.	Only then: code

⸻

12. Architecture Contract (Locked)

AI_EDIT_ENGINE_ARCH_V2_LOCKED (Amended)
	•	All code shipped to Cloudflare Workers / Pages must be edge-safe
	•	Node APIs (fs, path, node:*) must never appear in production bundles
	•	Node logic is allowed only in local dev / Node runtimes, and must be isolated
	•	No static Node imports at module scope in any file that can reach the edge bundle
	•	Runtime selection happens inside request handlers only
	•	Client sites must be KV-first with JSON fallback
	•	This contract must not be violated
	•	If violated → AI Edit v3 (new version line, new tag)

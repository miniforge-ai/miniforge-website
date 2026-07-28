---
title: "Orchestration is not the hard part."
date: 2026-04-13
description: "Code was never the bottleneck."
---

## *Code was never the bottleneck.*

I’ve been thinking about a question that’s floating around in conversations everywhere right now:

**What are you going to do when what you do is gone?**

You can see it splitting the noosphere in real time. I considered it for a while. For many, it’s hype. AI is terrible at real world problems, has too many hallucinations, will run out of energy, etc. etc. I’m not here to litigate the hype or the hype around how terrible it really is. I’m firmly in the camp that the answer to that question does not matter. Software is industrializing—and bargaining with the trillions of reasons it *won’t* is a fool’s errand. It will. The people writing your paychecks, funding your startups, purchasing your politicians .. will make sure it succeeds. I've even blogged about it before:

- [AI will slow you down .. until it doesn't](/blog/ai-will-slow-you-down-until-it-doesnt)
- [Hand built coding is going away...](/blog/hand-built-code-is-going-away)
- [Industrializing Software: AI as the catalyst for a fourth industrial revolution.](/blog/industrializing-software-ai-fourth-industrial-revolution)

So .. AI is transforming how software gets built. I did know this. I have a degree in expert systems, had spent a year and a half working on EngrammicAI. I wrote the above.

.. but that isn't *transformative*. To be sure, those things felt transformative at the time .. but the scale was wrong.

That hit me around December, with the first real agentic models. The understanding that I was moving slow relative to oncoming change. Scratch that, *I was standing still*. The change was too big to comprehend and I was stuck processing instead of moving. And like natural events that are too large for you to scale properly .. the ones that seem slow and then arrive all at once .. I needed to ***move***.

That is the much harder hitting shift. That *movement* is through a loss of identity. One I felt when I was ghosted off by Salesforce. That same kind of loss, the disanchoring of your identity you feel when what was your life is suddenly gone. Your mind rationalizes, keeps you stuck. *You have to let go* and **move**.

You don’t just let go of typing code, of prepping documents, of being the smart person solving problems. **You let go of identity.**

“I have an architect hat.” “I’m the best at X, Y, or Z.”

So yes, **move**.

## **The first jump: *the Yeet Machine* (tm)**

***.. unblocking creativity and a path to moving***

*Move.* But how? To really move at this speed I needed a my own software factory, which gave me a target. Two reasons, **one** -- the new set of models looked like pure creative leverage to me. Build faster. Try more ideas. Ship more experiments. Yeet more things into the void and see what sticks.

**Two**, I wanted to be the one building the machines that made machines. Industrialization means I can be a factory worker (if I am lucky), or I can make the machines the factory uses. I am choosing the latter. It may not work, but that bet was the genesis of Miniforge.

A personal Yeet Machine (tm) <g> gave me a means to bring a backlog of ideas into existence **now**. With the *marginal cost of code* is collapsing toward zero, products I have wanted to create for years but did not have time or resources to execute on could be yeeted into existence.

So yes: Miniforge started as my own “yeet machine.”

And then it became something more.

### **A *governed* Yeet Machine**

For the last decade I’ve been brought into companies to redesign how they build and ship software:

- fix broken CI/CD systems
- refactor the SDLC and stabilize release discipline
- scale the company and it's means of delivery
- recover reliability and velocity without trading off safety
- make delivery legible to the business again

*When you’ve done that enough times, you stop seeing “code” as the hard part.*

And I realized something:

> ‍**The industry is focused on agent orchestration**
>
> **...but agent orchestration is not the hard part.**

If we had told devs at any point in the industries history: "Look you don't have to do any testing, you don't have to do any compliance, you have zero security," .. they could yeet code like crazy into the void. **Developers** *with no guardrails* **can ship shockingly fast**.

So yes… those teams would yeet code at light speed into your customers hands. CEO's and Founders would stand in amazement. Then slowly, and then all at once .. what you’d notice wouldn’t be “**wow**, humans are *amazingly* fast.”

You’d notice:

- outages
- customer losses
- regressions
- breached trust
- a business sliding into entropy

Because what makes your widget a **product** isn’t the code. It’s the governed delivery system around it.

### **AI + ? == Profit**

**Governance**. That is how you get from widget to product. How you get from AI to Profit.

That's the ?.

> **Profit comes from governed delivery: legible, reviewable, controllable execution across real repositories—at speed—without overwhelming humans into routing around your controls.**

You can’t just yeet a widget into being and call it a product. A product is a widget that has survived the rules of the business:

- architecture constraints
- security posture
- compliance requirements
- operational standards
- release gates
- rollback planning
- evidence and traceability

There’s immense pressure right now to “go faster with AI.”

What breaks first won’t be your engineering team (at least not the way people think). It won’t be product managers shipping prompts. It will be your *rule sets*.

Your *policies*.

Everything that slows down the rocket ship.

Humans get overwhelmed. And when they get overwhelmed, controls become optional.

At that point you just *ship;* but you’re no longer shipping a product. You’re shipping half-formed widgets into customer hands and hoping the universe is kind.

That’s not leverage. That’s accelerated ***entropy***.

## **Introducing Miniforge (Open Source)**

Write a spec. Get a pull request.

Not a diff. Not a suggestion. A governed, evidence-bearing, review-ready pull request that was driven through the same gauntlet your team would run it through — **plan, implement, verify, review, release** — except *autonomously*, with policy enforcement at every transition and a full audit trail of why every decision was made.

Miniforge is 90 components built in Clojure on the Polylith architecture. The distributed CLI ships on Babashka for instant startup with no JVM boot penalty. It is organized as three products on a shared kernel:

- **MiniForge Core.** The governed workflow engine. Six normative specifications (N1-N6), written to RFC 2119 rigor, define the contracts for architecture, workflow execution, event streaming, policy enforcement, interfaces, and evidence. This is the engine contract that everything else builds on.
- **Miniforge.** The autonomous software factory for SDLC. Takes a spec and drives it through: Plan -> Design -> Implement -> Verify -> Review -> Release. Each phase is an autonomous LLM agent. Each transition is gated by policy. Each decision is traced.
- **Data Foundry.** A generic ETL framework on the same kernel. Connectors for EDGAR, GitHub, GitLab, Jira, HTTP, Excel, and flat files. Same governance model, different domain.

The pipeline is not aspirational. It runs. Here is what actually happens when you feed it a spec:

1. **Plan —** decomposes intent into a DAG of tasks with topological ordering
2. **Implement —** LLM agents write code against the plan, selecting from a 16-model registry (Anthropic, OpenAI, Google, open-source) based on task classification
3. **Verify —** inner validate/repair loop: lint, test, coverage, no-secrets. Failures are classified, diagnosed, and self-healed before moving forward
4. **Review —** semantic review against the original spec intent, not just "does the code compile"
5. **Release —** PR creation with evidence bundle: provenance chain, policy gate results, validation outcomes, decision trace

Every phase emits to an append-only event stream (in-process pub/sub + WebSocket). You can watch it live in the TUI, query it through the CLI, or consume it through the REST API. Three interfaces ship: CLI, TUI, and an LSP/MCP bridge.

### **What “governed” means here**

Governed does not mean "slow."

It means:

- the system can move fast without silently bypassing guardrails
- intent is enforced semantically, not cosmetically
- execution produces evidence, not just output

Policy is not a checklist bolted on at the end. It is a five-layer validation taxonomy enforced at every gate:

- **L0 Syntax** — does it parse
- **L1 Semantic** — does it match intent (IMPORT/CREATE/UPDATE/DESTROY/REFACTOR/MIGRATE)
- **L2 Policy** — does it comply with policy packs (pluggable, versioned, signed)
- **L3 Operational** — does it meet SLOs for the workflow tier
- **L4 Authorization** — is the agent permitted to take this action at this trust level

When something fails, it does not just fail. Failures are classified into a canonical taxonomy, diagnosed, and routed to the repair loop — or escalated to a human with full context about what happened and why.

It is the difference between: "the model wrote a bunch of code"

and

"we can ship this change confidently, and prove why."

### **What ships in the OSS release**

The full engine. Locally. End-to-end.

- **Workflow engin**e — DAG executor with topological ordering, frontier computation, inner validate/repair loops, and workflow chaining
- **Phase agents** — Plan, Implement, Verify, Review, Release. Each phase has defined inputs, outputs, and gates per N2
- **Policy-as-code** — pluggable policy packs with gate enforcement, semantic intent validation, and violation taxonomy with auto-fix capabilities
- **Evidence bundles** — every workflow produces a provenance-traced evidence bundle: intent, phases, validations, outcome. Queryable. Auditable
- **Event stream** — append-only, causally ordered, replayable. Powers live TUI, REST API, and future analytics
- **Intelligent model selection** — 16-model registry across four providers. Task classification drives model choice, not config files
- **Self-healing** — failure classification, automatic diagnosis, repair strategies. The inner loop fixes what it can before escalating
- **Three interfaces** — CLI (seven command namespaces), TUI (workflow list, detail, evidence viewer, artifact browser), LSP/MCP bridge
- **Data Foundry** — ETL framework with connectors for EDGAR, GitHub, GitLab, Jira, HTTP, Excel, flat files. Same governance, different domain
- **10 specifications** — six core (complete), four extension (draft). These are not documentation. They are the implementation contracts, enforced by schema validation, golden-file tests, and gate checks

**If you can't run it locally and see the whole loop, it's not a factory. It's a demo.**

### **Getting started**

**- Repo:** [**https://github.com/miniforge-ai/miniforge**](https://github.com/miniforge-ai/miniforge)

**- Docs:** [**https://github.com/miniforge-ai/miniforge/tree/main/docs**](https://github.com/miniforge-ai/miniforge/tree/main/docs)

**- Quickstart:** [**https://github.com/miniforge-ai/miniforge/blob/main/docs/quickstart.md**](https://github.com/miniforge-ai/miniforge/blob/main/docs/quickstart.md)

If you’re evaluating it, the first question isn’t “can it generate code?”

It’s:

**Can it deliver a change through the rules of a real system without needing babysitting?**

## **Closing**

AI will absolutely increase the raw throughput of software production.

But throughput isn’t the constraint in any real business I’ve worked in.

**Governance is.**

Miniforge exists to make governed delivery industrial:

fast, legible, reviewable, controllable—on real repositories—without humans having to route around controls to keep up.

If you want to follow the OSS launch and the technical deep dives as they land, keep an eye here:

**-** [**miniforge.ai**](http://miniforge.ai) **(updates, docs, write-ups)**

**-** [**https://github.com/miniforge-ai/miniforge**](https://github.com/miniforge-ai/miniforge)

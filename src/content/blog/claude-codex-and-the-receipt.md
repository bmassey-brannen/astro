---
title: "Claude, Codex, and the Receipt"
description: "A note on using coding agents as workers without pretending they are magic: scoped tasks, review loops, receipts, and knowing who owns the final decision."
pubDate: "2026-07-12"
heroImage: "/blog-images/agent-receipt-loop.png"
---

The agent is not the boss.

That is the first rule.

Claude and Codex are useful because they can move through a repo faster than I can type, but speed is not judgment. A fast wrong answer is just a more efficient pothole.

So the work is not "let the AI build it."

The work is building a loop where the agent can help without becoming a slot machine with file-system access.

## The useful unit is a bounded task

Agents get worse when the mission is foggy.

"Make the site better" is foggy.

"Tighten the homepage copy, preserve the current layout, do not expose private infrastructure, run the build, and leave a receipt" is something an agent can actually do.

The better the boundary, the better the output:

```text
scope
constraints
files likely involved
commands to run
things not to touch
receipt required
```

That sounds bureaucratic until you have watched an agent confidently improve the wrong thing for thirty minutes.

## Receipts turn motion into progress

The receipt is the part I care about most.

Not a victory lap. Not "all done!" Not a paragraph of vibes.

A useful receipt answers:

- What changed?
- What files were touched?
- What did you verify?
- What failed?
- What remains uncertain?
- Is it committed?
- Is it pushed?

Without that, the next session starts by excavating the previous one. That is how small projects become haunted houses.

## Two agents are not automatically a team

Claude and Codex have different strengths, but the important part is not the mascot on the command line.

The important part is role separation.

One worker edits. Another reviews. The human decides. The repo records.

That sounds simple, but it changes the psychology. Instead of treating the agent like a genius intern, the system treats it like a fast contractor who still needs a punch list, a spec, and inspection before the keys get handed over.

## The human still owns the taste

The agent can spot broken imports. It can refactor a component. It can run a test. It can even make a decent first draft.

But it does not know when the thing feels fake.

It does not know when the line sounds like a LinkedIn goblin. It does not know when a dashboard is technically clean but emotionally unusable. It does not know when a public page says too much about private machinery.

That is still my job.

The goal is not to replace taste. The goal is to protect enough time and attention that taste can show up before the deploy button does.

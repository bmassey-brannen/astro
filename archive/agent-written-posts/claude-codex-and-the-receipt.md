---
title: "Claude, Codex, and the Receipt"
description: "A note on using coding agents without letting them turn the repo into a mystery box."
pubDate: "2026-07-12"
heroImage: "/blog-images/agent-receipt-loop.png"
---

The agent is not the boss.

Claude and Codex are useful because they move fast through a repo. That does not mean they have judgment. A wrong change made quickly is still a wrong change.

So I am trying to use them less like magic and more like workers: give them a small job, make the boundaries clear, review what changed, and require a receipt.

## Smaller tasks work better

Agents get weird when the prompt is vague.

"Make the site better" is how you end up with a stranger redecorating your kitchen.

This works better:

> Tighten the homepage copy. Keep the layout. Do not expose private infrastructure. Run the build. Leave a receipt with changed files and anything that still needs review.

That is not fancy. It is just a scoped work order.

The useful parts are usually the boring parts:

```text
scope
constraints
files likely involved
commands to run
things not to touch
receipt required
```

I have learned to be annoying about this because the alternative is spending half an hour figuring out what the agent thought it was doing.

## The receipt matters

A receipt is not "done!"

It should answer a few plain questions:

- What changed?
- Which files changed?
- What did you verify?
- What failed?
- What is still uncertain?
- Is it committed?
- Is it pushed?

Without that, the next session starts with archaeology.

That is how small projects get haunted. Nobody remembers which edit was intentional, which test passed, or whether the thing on the server matches the thing in the repo.

## Two agents do not make a team by default

Claude and Codex have different strengths, but the logo is not the important part.

The important part is role separation.

One worker edits. Another reviews. I decide. Git records.

That setup changes the mood. The agent stops being a genius intern and becomes a fast contractor. Useful, but still someone whose work needs a punch list and inspection before it ships.

## Taste is still manual

An agent can fix an import, refactor a component, run a build, and write a decent first draft.

It cannot always tell when a sentence sounds fake.

It cannot tell when a dashboard is technically clean but annoying to use. It cannot tell when a public page says too much about private work. It cannot tell when a clever line is the wrong kind of clever.

That part is still mine.

The point is not to replace taste. The point is to save enough attention that taste is still available before I push.

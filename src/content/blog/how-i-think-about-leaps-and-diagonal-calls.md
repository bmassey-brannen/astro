---
title: "How I Think About LEAPs and Diagonal Calls"
description: "A plain-English guide to long-dated calls, short-call financing, calendars, diagonals, and the mistake of capping the exact upside you bought."
pubDate: "2026-07-12T14:20:00-04:00"
heroImage: "/blog-images/leaps-diagonal-hero.svg"
---

A LEAP is just a long-dated option.

That sounds boring, but it changes the shape of a trade. Instead of renting a short-dated contract and needing the stock to move right now, you are buying time. The trade still has defined risk. You can still lose the whole premium. But the clock is less hostile than it is on a weekly or one-month call.

That is why I like them.

A LEAP lets me express a thesis without buying shares, using margin, or pretending I can predict next Friday. If the stock never works, the loss is the debit. If the thesis starts working and the market finally notices, the upside can get weird.

The danger starts when I try to make the position too efficient.

![LEAP versus diagonal payoff sketch](/blog-images/leaps-payoff-map.svg)

## The clean version: buy the LEAP

The simplest version is a long call dated one or two years out.

Example, using fake numbers:

```
Stock price: $10
Long call: Jan 2027 $10 call
Debit paid: $3.00
Max loss: $300 per contract
Upside breakeven at expiration: $13
```

If the stock is at $20 at expiration, the call is worth about $10. You paid $3. The rough profit is $7 per share, or $700 per contract, before spreads and commissions.

If the stock is under $10 at expiration, the call expires worthless.

That is the basic bargain: defined downside, leveraged upside, and enough time for the thesis to become obvious.

## Why people sell calls against them

Once you own the LEAP, it is tempting to sell shorter-dated calls against it.

That creates a diagonal call spread: long a farther-dated call, short a nearer-dated call, usually at a higher strike.

Example:

```
Long:  Jan 2027 $10 call, paid $3.00
Short: Aug 2026 $15 call, sold for $0.60
Net debit after short-call credit: $2.40
```

The short call helps finance the long call. It lowers the net cost. If the stock stays below $15 through the short call's expiration, the short call may decay and you may keep the premium.

That is the appeal.

The problem is that the market is not paying you for nothing. You sold someone else the upside above $15 for that period. If the stock rips through $15, the short call can become the trade.

That is where the handcuffs show up.

## Calendar versus diagonal

People use these words loosely, so I try to keep them simple:

- A calendar spread usually has the same strike on both options, with different expirations.
- A diagonal spread has different expirations and different strikes.

A call calendar might be long the January $10 call and short the August $10 call.

A call diagonal might be long the January $10 call and short the August $15 call.

The diagonal is the version I care about most because it shows up naturally when you own LEAPs and sell higher-strike calls against them.

![Diagonal call management loop](/blog-images/diagonal-call-cycle.svg)

## The rule I learned the annoying way

Premium is not automatically progress.

Selling a call feels productive because cash hits the account. But if the short call caps the exact move you bought the LEAP for, you may have made the trade look cleaner while making the outcome worse.

Before selling the short call, I want to ask:

- Am I actually willing to sell the upside above this strike?
- Is the short strike above the zone where the thesis starts working?
- How much premium am I collecting compared with the upside I am giving away?
- If the stock gaps higher tomorrow, will I be happy I sold this call?
- Is there enough extrinsic value left to justify waiting, or is this mostly intrinsic now?

That last question matters once the stock moves.

A short call that is out of the money or near the money can have real extrinsic value. Time decay may be useful there.

A short call that is deep in the money and near expiration is different. At that point, the short call is often mostly intrinsic value. Waiting for theta may not help much. You are not collecting useful decay. You are just sitting under a cap while the trade you wanted is trying to run.

## A simple way to think about management

I break the position into two jobs.

The LEAP's job is exposure.

The short call's job is financing.

If the financing starts controlling the exposure, the structure is backwards.

That does not mean every short call is bad. It means the short call needs a job description. It should be sold at a strike and expiration where I understand the trade-off ahead of time.

A decent short-call sale might look like this:

```
The thesis starts getting interesting above $18.
I sell the $25 call, not the $15 call.
The premium is smaller, but I am not selling the part of the move I actually care about.
```

A bad short-call sale might look like this:

```
The thesis starts getting interesting above $15.
I sell the $15 call because the premium looks juicy.
Then the stock rips and I spend the week mad at the position I created.
```

Ask me how I know.

## What can go wrong

The obvious risk is that the LEAP loses value or expires worthless.

The less obvious risk is that the short call creates bad behavior. You start rooting for the stock to stall. You hesitate to close the cap because buying it back feels like "losing" on the short leg. You focus on the premium you collected instead of the upside you gave away.

There are also mechanical risks:

- wide bid/ask spreads
- assignment risk on short calls, especially around dividends or expiration
- IV crush changing the long call's value
- poor liquidity when you need to adjust
- tax complexity if you are doing this in a taxable account
- emotional overmanagement because the position always has something to tweak

That last one is real. A diagonal can turn a good thesis into a part-time job.

## My current rule

Use LEAPs for the core bet.

Use short calls only when they clearly finance the position without choking the reason I bought it.

If I cannot explain why the short strike is acceptable, I probably should not sell it. If the short call becomes deep in the money with little extrinsic value left, I should treat it like a cap problem, not a magic theta machine.

The goal is not to collect every dollar of premium.

The goal is to stay alive long enough for the thesis to work and avoid selling away the weird part of the distribution.

That is the whole point of using LEAPs in the first place.

This is not a trade recommendation. It is a structure note. The lesson is simple enough: buy time when the thesis needs time, finance carefully, and do not handcuff the move you were early enough to catch.

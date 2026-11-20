# Backlog

Work the owner or the Approver has said yes to, kept for a later sprint. The Friday review
moves the items marked for the coming sprint into its proposal, sizes them, and sets them
to "Waiting for build" in `DECISIONS.md`. The Tuesday build never builds straight from here.

## Sprint from Friday 20 Nov 2026 (build Tuesday 24 Nov)

### Healthy play (owner, 16 Nov 2026)

Source: the owner, from a summary of screen-time guidance for children (Singapore MOH
Grow Well SG and the American Academy of Pediatrics). Not tester feedback. The ideas behind it
are short play blocks with eye and movement breaks, no screens in the hour before bed, and
a daily total kept well under 2 hours for ages 7 to 12. Any health wording shown in the game or
in Help is checked against the MOH and AAP pages first, not copied from the summary.

Ground rules for all four items: nothing leaves the device, no age or name is asked for, and the
game never scolds. Breaks are framed as part of the isle (your pet wants a stretch, the Dream
Pod glows) rather than as punishment.

| # | Item | What it does | Rough size |
| --- | --- | --- | --- |
| H1 | Eye and stretch break | After 30 minutes of play without a break, the game saves and pauses with a calm screen: look at something far away for 20 seconds, stand up, have some water. A 20-second countdown, then Keep playing. The timer resets after the break or after 5 minutes away from the game. | About 1 day, test included |
| H2 | Evening wind-down | After 8 pm on the device's own clock, a gentle note once per evening: it's getting late, time to tuck your pet into bed soon. It does not block play. | About half a day |
| H3 | Daily play total, soft wrap-up | The game counts today's play time on the device only. At 60 minutes it shows a friendly "Great building today! Time for a real-world adventure", once per day, with Keep playing still available. | About half a day, test included |
| H4 | Healthy play tips for grown-ups | A short section in Help (and the More tips list): play on a bigger screen at arm's length, a break every 30 minutes, no screens at meals or in the hour before bed, time outdoors every day. | About 2 hours |

Open points for the Friday review to raise, not to decide by default:

- Owner decision 20 Nov (E2, option a): device-only play-time records are not data collection. H1 and H4 are in the 24 Nov build; H2 and H3 move to the sprint from 27 Nov, H2 at 8 pm (owner confirmed).
- H3 keeps a play-time count about the player on the device. Under the charter's current reading
  (on-device only is not data collection) this is allowed, but that reading is not yet
  confirmed by the owner. The owner asked for this item, so confirm the reading with the owner
  in the 20 Nov TL;DR.
- The exact numbers (30 minutes, 8 pm, 60 minutes) are the dev's first proposal. A parent
  setting to change them is not in this slice.

### Rollback test (owner, option b on the Wood Door, 13 Nov 2026)

| # | Item | What it does | Rough size |
| --- | --- | --- | --- |
| R1 | Rollback test | Done 16 Nov, now part of `bash tests/run.sh` as `tests/rollback.js`. Result: the live build and `stable` swap saves both ways with nothing lost (the Wood Table and Pet House are already in `stable`). A block `stable` does not know stops that world from opening in `stable`. | Done |
| R2 | Unknown blocks never crash a world | If a save holds a block this version does not know, show it as a plain placeholder block and keep it in the save, instead of failing to open the world. Extra protection on top of the "new blocks ship unplaceable first" rule. Owner request (rollback safety). | About half a day, test included |

## To validate at the Friday 20 Nov review

### Animals get in the way when placing blocks (owner, 19 Nov 2026)

Source: the owner passed on tester feedback that animals get in the way when placing blocks.
Related: feedback issue 4 (18 Nov, phone, "My pet still blocks the way", rated 3 of 5, no detail
given). It came from the feedback form, the day after build 2026.11-w3 went live, and the form
does not send the game version, so we cannot tell which build the tester was on.

What the 2026.11-w3 fix covers: only Doggy and Mew. A pet in the target square hops aside, and
Place aims past pets. Dev check on 19 Nov (scratch run of the game code, not a shipped test):

| Case | What happens now |
| --- | --- |
| Pet in the target square, room beside it | Pet hops aside, block placed (fixed in w3) |
| Pet on a 1-wide bridge or ledge | Pet hops back along the bridge, block placed |
| Wild creature (such as a Puff-sheep) in the target square, Place pressed | No block. Place pets the creature instead ("likes you! +1 aura") |
| Wild creature between the player and the target | No block, and often no message at all (pet cooldown) |

To validate before anything is built:

- V1. Which creature: pet or wild animals? Ask through the next TL;DR. Watch "Tell us" for
  "My pet got in the way" and "A block won't place". Those notes carry the game version.
- V2. Old build: was the tester on the 12 Nov build (cached page)? Issue 4 cannot say.
- V3. Reproduce on a phone on the live w3 build: a pet and a wild creature next to a build spot.

Possible actions, for the Approver to decide on Friday (each about half a day, test included):

- A. Extend the w3 fix to wild creatures: with a block in hand, Place aims past every creature
  (Use still pets them), and a creature in the target square steps aside like the pet does.
- B. Smaller: Place aims past every creature, but a creature in the target square only shows
  "Something is in the way". No creature is moved.
- C. Wait one more week for evidence from "Tell us" (V1 to V3), then choose A or B.

None of these touch the escalate list: nothing saved changes, no new block.

## Later: bigger than one week or a change of direction

These need shaping and an owner decision before they can enter a sprint.

- Trader's Ledger: shop maths (unit prices, budgets, profit) through the Isle Folk shops, with an
  optional paper ledger for grown-ups to print. This moves the game towards a learning game,
  which is the owner's call on direction, and it is more than one week of work.
- Wood Door: R1 is done. Under the rollback rule it takes two releases: first the block ships unplaceable, then a later release makes it placeable. Owner chose option b on 13 Nov.

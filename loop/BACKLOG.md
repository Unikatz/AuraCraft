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

## Later: bigger than one week or a change of direction

These need shaping and an owner decision before they can enter a sprint.

- Trader's Ledger: shop maths (unit prices, budgets, profit) through the Isle Folk shops, with an
  optional paper ledger for grown-ups to print. This moves the game towards a learning game,
  which is the owner's call on direction, and it is more than one week of work.
- Wood Door: R1 is done. Under the rollback rule it takes two releases: first the block ships unplaceable, then a later release makes it placeable. Owner chose option b on 13 Nov.

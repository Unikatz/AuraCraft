# Changelog

## On preview (not live yet)

Build 2026.11-w4 (Tuesday build, 24 Nov).

- With a block in hand, Place now aims past every creature, not only Doggy and Mew, so a Puff-sheep standing in front no longer stops your block. If a wild creature stands right where the block would go, the game says "Something is in the way" and leaves it there. Use (E) still pets creatures. A pet that hops aside never lands in water or an Ember Pool; if there is no dry square, it stays and the game says so. (Approver, 20 Nov, changed; feedback issues 1 and 4)
- Help now says "Gloomies" instead of "zombies" in the two places it still did. (Approver, 20 Nov; feedback issue 3)
- Stretch break: after 30 minutes of play the game saves, pauses the whole world and shows a calm screen (your pet wants a stretch: look far away for 20 seconds, stand up, have some water). Keep playing unlocks after a 20-second countdown. If a Gloomy is within 10 blocks it waits for it, at most 2 more minutes. 5 minutes away from the game also counts as a break. The timer is kept in memory only; nothing new is saved. (Approver, 20 Nov, changed; owner backlog H1)
- Help has a "For grown-ups" section: under 2 hours of screen use a day outside schoolwork, short breaks for eyes and body, screen-free meals, no screens in the hour before bed, an hour of active play a day, outdoors when possible. Sources: Singapore MOH Grow Well SG press release (21 Jan 2025) and HealthHub "How parents can foster healthy screen use" for the 2-hour limit and the hour before bed; AAP (HealthyChildren.org "Helping kids thrive in a digital world", and the AAP policy statement summarised in AFP 2017) for screen-free meals, the hour before bed and an hour of physical activity. The backlog's "bigger screen at arm's length" line was left out because none of the sources says it, and the "every 30 minutes" figure is labelled as the game's own choice, not as advice. (Approver, 20 Nov, changed; owner backlog H4)
- A world holding a block this version does not know (from a newer build) now opens: the block shows as a plain "Mystery Block" that cannot be broken, replaced or blown up, and the save keeps its real id. The Mystery Block itself can never be placed or saved. (Approver, 20 Nov, changed; owner request R2)
- Tests: new `tests/w4.js` (25 checks for the items above) and two new checks in `tests/rollback.js` (unknown block load and re-save, twice).

## 17 Nov 2026: build 2026.11-w3

Released by the Approver (Tuesday build). Rollback copy: the `stable` branch (the 12 Nov build 2026.11-w2).

- If Doggy or Mew stands where you want to put a block, the pet hops to the square beside it and the block goes in. With a block in hand, Place aims past your pet; Use still pets it. If something else is in the way, or the pet has no room to move, the game says "Something is in the way" instead of doing nothing. (Approver, 13 Nov; feedback issue 1)
- A door made of 2 Glass Rock blocks, one on top of the other, now opens and closes with one press. Only the one block above or below moves with it. (Approver, 13 Nov; feedback issue 2)
- The test report now shows real check counts for every test file, and a new test covers the two changes above. (Approver, 13 Nov)

## 12 Nov 2026: build 2026.11-w2

Released by the owner. Rollback copy: the `stable` branch (the 10 Nov version).

- "Tell us" button: three picks and preset reasons, no typing, no name. (Owner decision, 10 Nov)
- Version label in the menu and in Help. (Approver, 10 Nov)
- Quick guide shortened from 20 steps to 8. The other 12 are in Help, under More tips. (Approver, 10 Nov)
- Look speed setting in Help: Slow, Normal, Fast. Saved on the device only. (Approver, 10 Nov)

## 10 Nov 2026

- Removed the analytics script from the live game. (Owner decision)

## 7 Nov 2026

- Wood Table and a 2 x 2 wooden Pet House. (Tester feedback)
- Glass is easier to see, and the block you point at has a clearer outline. (Tester feedback)
- First-person view again, easier turning, bigger Dream Pod. (Tester feedback)

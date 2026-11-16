# Decisions

Newest first. Status: Backlog (decided, kept for a later sprint, see `BACKLOG.md`), Waiting for build, On preview, Released, On hold, Waiting for owner.

| Date | Item | Decided by | Decision | Status |
| --- | --- | --- | --- | --- |
| 16 Nov 2026 | Every release must be possible to roll back | Owner | Standing rule. Rollback check added to `bash tests/run.sh` (save round trip with `stable`, and no placeable block that `stable` lacks). New blocks ship unplaceable first. Not yet written into `CHARTER.md`: the owner adds it there | In force from 16 Nov |
| 16 Nov 2026 | Rollback test (R1) | Owner | Done 16 Nov: today's live build and `stable` swap saves both ways with no errors and nothing lost. A block that `stable` does not know makes that world fail to open in `stable`, so new blocks must ship unplaceable first | Done |
| 16 Nov 2026 | Healthy play: eye and stretch break, evening wind-down, daily play total, tips for grown-ups (H1 to H4) | Owner | Add to the backlog for the sprint from 20 Nov. Details in `BACKLOG.md` | Backlog: sprint from 20 Nov |
| 14 Nov 2026 | Wood Door (escalated 13 Nov) | Owner | Option b: one Wood Door in a later week, after the dev tests and reports what happens to a world with new blocks when the game is rolled back (R1 in `BACKLOG.md`). Reply by email | On hold until the rollback test is reported |
| 13 Nov 2026 | Wood Door (doors in other materials) | Approver | Escalated to the owner: direction of the game (closer to Minecraft) and an untested rollback risk to saved worlds. Options: a. not now, b. one Wood Door in a later week after a rollback test, c. more doors but in the game's own style. Approver recommends a. Reply by 17 Nov | Owner decided 14 Nov (option b) |
| 13 Nov 2026 | Pet gets in the way when placing a block | Approver | Approved; the test must cover the pet hop, a walled-in pet (no block, message shown) and that Use still pets the pet | Waiting for build |
| 13 Nov 2026 | Glass door opens as one door | Approver | Approved; the test must cover a pair in a mixed state, the doorway check on both blocks, and a third stacked block that must not move. Feedback issue 2 stays open until testers confirm it helped | Waiting for build |
| 13 Nov 2026 | Test report shows real check counts | Approver | Approved; only output lines are added, no check removed or loosened, game file untouched | Waiting for build |
| 12 Nov 2026 | Release build 2026.11-w2 to the live game | Owner | Release now, ahead of the Tuesday build | Released 12 Nov |
| 10 Nov 2026 | "Tell us" feedback button | Owner | Build without free text: three picks plus preset reasons | Released 12 Nov |
| 10 Nov 2026 | Version label in the menu | Approver | Approved | Released 12 Nov |
| 10 Nov 2026 | Shorter quick guide (8 steps, 12 more tips) | Approver | Approved; More tips must be reachable from the menu | Released 12 Nov |
| 10 Nov 2026 | Look-speed setting (Slow, Normal, Fast) | Approver | Approved | Released 12 Nov |
| 10 Nov 2026 | Remove the analytics script from the live game | Owner | Remove now | Released 10 Nov |
| 10 Nov 2026 | Pet Isle (about 2 weeks) | Owner | Not now; revisit after testers react to the Pet House | On hold |
| 10 Nov 2026 | Small things on the Wood Table | Approver | Not now; no tester asked for it | On hold |

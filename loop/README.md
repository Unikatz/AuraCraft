# Aura Isles weekly loop

A one-week cycle. Testers send feedback, the dev proposes changes, the Approver decides,
approved changes are built on a preview link, and the Approver releases them to the live game.
The product owner hears about it by email: a TL;DR every Friday, and an escalation when
something crosses a line set in `CHARTER.md`.

| When (Singapore time) | Who | What |
| --- | --- | --- |
| All week | Testers | "Tell us" button in the game, or the feedback form. Notes become issues in the private repo `Unikatz/refinery-feedback`. |
| Friday 6 pm | Dev, then Approver | Dev writes `loop/proposals/YYYY-MM-DD.md` (max 6 candidates). Approver decides each one under `CHARTER.md`. TL;DR email to the owner. |
| Tuesday 6 pm | Dev, then Approver | Dev builds only approved items on `preview`, runs `bash tests/run.sh`. Approver checks the build and releases or holds. Email to the owner. |

## Branches

| Branch | What it is |
| --- | --- |
| `main` | The live game on Vercel. Changes only by a release. |
| `preview` | Work under test. Vercel gives it its own preview link. Loop files are edited here. |
| `stable` | The last good release. Updated to the old `main` just before each release. Rollback target. |
| `v1.1-live`, `v1-stable`, `v2-beta` | Older versions, kept. |

## Files

- `CHARTER.md`: what the Approver may decide and what must go to the owner.
- `DECISIONS.md`: every decision, who made it, and its status.
- `FEEDBACK.md`: tester feedback seen so far and what happened to it.
- `proposals/`: one weekly proposal per Friday.
- `../CHANGELOG.md`: what changed in each release.
- `../tests/`: checks run before every build (`bash tests/run.sh`).

## Release steps

1. `bash tests/run.sh` passes on `preview`.
2. Approver says "release" (or the owner does).
3. Push the current `main` to `stable`.
4. Push `preview` to `main`. Vercel publishes it.
5. Add the release to `CHANGELOG.md` and update `DECISIONS.md`.

## Rollback

`stable` always holds the version that was live before the latest release. To roll back,
make a new commit on `main` that puts the game file back, then push it. Never force-push.

```
git fetch origin main stable
git checkout -B rollback origin/main
git checkout origin/stable -- index.html
git commit -m "Roll back the game to the stable version"
git push origin rollback:main
```

Players keep their saves: the save format is the same in both versions.
Afterwards, tell the owner the same day and note it in `DECISIONS.md`.

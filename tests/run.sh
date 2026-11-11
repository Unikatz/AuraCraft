#!/usr/bin/env bash
# Runs every game test against index.html. Exit code 0 = all good.
# Needs only Node.js (no installs). Usage: bash tests/run.sh
cd "$(dirname "$0")" || exit 1
node build-harness.js || exit 1
fail=0
for t in guide sleep-house-bounce place-home frames-save turn fall; do
  out=$(timeout 180 node "$t.js" 2>&1); code=$?
  if [ $code -ne 0 ] || echo "$out" | grep -q "^FAIL\|Error:\|    at "; then
    echo "FAILED: $t"; echo "$out" | tail -15; fail=1
  else
    echo "ok: $t ($(echo "$out" | grep -c '^PASS') checks passed, $(echo "$out" | wc -l) lines)"
  fi
done
[ $fail -eq 0 ] && echo "ALL TESTS PASSED" || echo "SOME TESTS FAILED"
exit $fail

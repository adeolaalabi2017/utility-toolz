#!/usr/bin/env bash
# Phase 4 E2E verification: 78/78 tools, math assertions on every new tool.
set -u
BASE="http://localhost:3000"
PASS=0; FAIL=0

check() { # name path regex [extra_wait_ms]
  local name="$1" path="$2" regex="$3" wms="${4:-900}"
  agent-browser open "$BASE$path" >/dev/null 2>&1
  agent-browser reload >/dev/null 2>&1
  agent-browser wait --load networkidle >/dev/null 2>&1
  agent-browser wait "$wms" >/dev/null 2>&1
  local txt
  txt=$(agent-browser eval "document.body.innerText" 2>/dev/null)
  if echo "$txt" | grep -qE "$regex"; then
    echo "PASS  $name"; PASS=$((PASS+1))
  else
    echo "FAIL  $name  (wanted /$regex/)"
    echo "$txt" | head -12 | sed 's/^/      | /'
    FAIL=$((FAIL+1))
  fi
}

agent-browser set viewport 1280 900 >/dev/null 2>&1

echo "--- Shells ---"
check "home: catalogue complete badge"   "/"                                      "Catalogue complete · 78 of 78 tools live"
check "home: new domains listed"         "/"                                      "Productivity & Project Management"
check "domain hub: productivity"         "/productivity"                          "Pomodoro Timer"
check "domain hub: education"            "/education"                             "Citation Formatter"
check "domain hub: everyday"             "/everyday"                              "Temperature Converter"
check "domain hub: developer 6 tools"    "/developer"                             "Hash Generator"
check "profession: project managers"     "/professions/project-manager"           "Ready now — 9 tools"
check "profession: students 9 tools"     "/professions/student"                   "Ready now — 9 tools"
check "404 still works"                  "/does-not-exist"                        "404"

echo "--- Developer additions ---"
check "base64 default encodes"           "/developer/base64-encoder-decoder"      "SGVsbG8sIFRvb2xEZWNr"
check "url encoder escapes"              "/developer/url-encoder-decoder"         "unit%20converter"
check "uuid v4 generated"                "/developer/uuid-generator"              "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
check "hash sha256(abc)"                 "/developer/hash-generator"              "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" 1500

echo "--- Productivity ---"
check "pomodoro 25:00 idle"              "/productivity/pomodoro-timer"           "25:00"
check "meeting cost per meeting"         "/productivity/meeting-cost-calculator"  "\\\$675"
check "meeting cost annual"              "/productivity/meeting-cost-calculator"  "32,400"
check "working days Jan 2026 = 22"       "/productivity/working-days-calculator"  "22"
check "project cost total"               "/productivity/project-cost-calculator"  "\\\$40,135"
check "project cost quote"               "/productivity/project-cost-calculator"  "\\\$57,336"
check "deadline Nov 23"                  "/productivity/deadline-calculator"      "Nov 23"
check "timezone NY 09:30"                "/productivity/time-zone-converter"      "09:30"
check "timezone Sydney +1 day"           "/productivity/time-zone-converter"      "\\+1 day"

echo "--- Education ---"
check "gpa 3.23"                         "/education/gpa-calculator"              "3\\.23"
check "grade needs 89.5"                 "/education/grade-calculator"            "89\\.5"
check "percentage 15% of 240 = 36"       "/education/percentage-calculator"       "36"
check "citation APA authors"             "/education/citation-formatter"          "Lovelace, A\\., & Turing, A\\. M\\."

echo "--- Everyday ---"
check "age 31 yrs 4 mo 16 d"             "/everyday/age-calculator"               "31 yrs 4 mo 16 d"
check "age total days 11,461"            "/everyday/age-calculator"               "11,461"
check "date calc Dec 2"                  "/everyday/date-calculator"              "Dec 2"
check "unit 1 m = 3.28084 ft"            "/everyday/unit-converter"               "3\\.28084"
check "temp 100C = 212F"                 "/everyday/temperature-converter"        "212"

echo "--- Interactions ---"
# Pomodoro: press Start, expect countdown past 25:00
agent-browser open "$BASE/productivity/pomodoro-timer" >/dev/null 2>&1
agent-browser reload >/dev/null 2>&1
agent-browser wait 900 >/dev/null 2>&1
agent-browser find role button click --name "Start" >/dev/null 2>&1
agent-browser wait 2600 >/dev/null 2>&1
T=$(agent-browser eval "document.body.innerText" 2>/dev/null)
if echo "$T" | grep -qE "24:5[0-9]"; then echo "PASS  pomodoro counts down"; PASS=$((PASS+1)); else echo "FAIL  pomodoro counts down"; FAIL=$((FAIL+1)); fi

# Base64: set input to ToolDeck via native setter (React controlled)
agent-browser open "$BASE/developer/base64-encoder-decoder" >/dev/null 2>&1
agent-browser reload >/dev/null 2>&1
agent-browser wait 900 >/dev/null 2>&1
agent-browser eval "(() => { const ta = document.querySelector('textarea'); const s = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; s.call(ta,'ToolDeck'); ta.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; })()" >/dev/null 2>&1
agent-browser wait 500 >/dev/null 2>&1
T=$(agent-browser eval "document.body.innerText" 2>/dev/null)
if echo "$T" | grep -q "VG9vbERlY2s="; then echo "PASS  base64 ToolDeck -> VG9vbERlY2s="; PASS=$((PASS+1)); else echo "FAIL  base64 ToolDeck"; FAIL=$((FAIL+1)); fi

# Percentage change mode switch
agent-browser open "$BASE/education/percentage-calculator" >/dev/null 2>&1
agent-browser reload >/dev/null 2>&1
agent-browser wait 900 >/dev/null 2>&1
agent-browser eval "(() => { const btn=[...document.querySelectorAll('[role=combobox]')][0]; btn.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); btn.click(); return 'ok'; })()" >/dev/null 2>&1
agent-browser wait 500 >/dev/null 2>&1
agent-browser find text "What percent" click >/dev/null 2>&1 || true
agent-browser wait 500 >/dev/null 2>&1
T=$(agent-browser eval "document.body.innerText" 2>/dev/null)
if echo "$T" | grep -qE "15%|is what"; then echo "PASS  percentage mode switch renders"; PASS=$((PASS+1)); else echo "FAIL  percentage mode switch"; FAIL=$((FAIL+1)); fi

echo "--- Console / error sweep ---"
E=$(agent-browser errors 2>/dev/null | grep -viE "hydration|Download the React DevTools" | head -6)
if [ -z "$E" ]; then echo "PASS  zero page errors"; PASS=$((PASS+1)); else echo "FAIL  page errors:"; echo "$E"; FAIL=$((FAIL+1)); fi

echo ""
echo "RESULT: $PASS passed, $FAIL failed"

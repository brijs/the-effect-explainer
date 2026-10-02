#!/usr/bin/env bash
# Rebuilds ../../field-guide/index.html from these source files.
set -e
cd "$(dirname "$0")"
JS="header.js voicedata_pages.js _helpers.js core.js audio_a.js _sfx.js audio_b.js scenesA.js scenesB.js scenesC.js main.js"
{ cat head.html style.css body.html; cat $JS; echo '</script>'; echo '</body>'; echo '</html>'; } > ../../field-guide/index.html
echo "built field-guide/index.html"

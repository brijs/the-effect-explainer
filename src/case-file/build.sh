#!/usr/bin/env bash
# Rebuilds ../../case-file/index.html from these source files.
set -e
cd "$(dirname "$0")"
{ cat head.html style.css body.html engine.js scenes1.js scenes2.js main.js; echo '</script>'; echo '</body>'; echo '</html>'; } > ../../case-file/index.html
echo "built case-file/index.html"

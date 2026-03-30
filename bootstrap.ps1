#!/usr/bin/env pwsh
# bootstrap.ps1 — init APEX in any project (run once from project root)
$here = $PSScriptRoot

if (-not (Test-Path ".git")) {
    $r = Read-Host "No git repo. Init one? (y/N)"
    if ($r -eq "y") { git init }
}

# Copy structure (skip existing files)
$map = @{
    "AGENTS.md"                        = "AGENTS.md"
    ".gitignore"                       = ".gitignore"
    ".agent/CONTEXT.md"                = ".agent/CONTEXT.md"
    ".agent/PREFERENCES.md"            = ".agent/PREFERENCES.md"
    ".agent/lessons.md"                = ".agent/lessons.md"
    ".agent/failures.md"               = ".agent/failures.md"
    ".agent/handoffs/INDEX.md"         = ".agent/handoffs/INDEX.md"
    ".agent/skills/kickoff.md"         = ".agent/skills/kickoff.md"
    ".agent/skills/execute.md"         = ".agent/skills/execute.md"
    ".agent/skills/handoff.md"         = ".agent/skills/handoff.md"
    ".agent/skills/modify.md"          = ".agent/skills/modify.md"
    "scripts/wt-new.ps1"               = "scripts/wt-new.ps1"
    "scripts/wt-done.ps1"              = "scripts/wt-done.ps1"
    "scripts/wt-list.ps1"              = "scripts/wt-list.ps1"
}

foreach ($src in $map.Keys) {
    $dst = $map[$src]
    $dstDir = Split-Path $dst -Parent
    if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir | Out-Null }
    if (-not (Test-Path $dst)) {
        Copy-Item (Join-Path $here $src) $dst
        Write-Host "  + $dst"
    } else {
        Write-Host "  o $dst (exists, skipped)"
    }
}

New-Item -ItemType Directory -Force -Path ".agent/backups" | Out-Null

Write-Host ""
Write-Host "✓ APEX ready."
Write-Host "  1. Fill in .agent/CONTEXT.md and .agent/PREFERENCES.md"
Write-Host "  2. Open in OpenCode Desktop"
Write-Host "  3. If new project: paste '[KICKOFF] I want to build: ...'"
Write-Host "  4. If existing project: fill BLUEPRINT.md manually, mark done phases [x]"

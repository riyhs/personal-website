#!/usr/bin/env pwsh
# wt-new.ps1 — create a git worktree + link agent brain
# Usage: .\scripts\wt-new.ps1 -name <feature-name> [-base main]
param([Parameter(Mandatory)][string]$name, [string]$base = "main")

$repoRoot  = git rev-parse --show-toplevel
$repoName  = Split-Path $repoRoot -Leaf
$branch    = "wt/$name"
$wtPath    = Join-Path (Split-Path $repoRoot -Parent) "$repoName-wt-$name"

if (Test-Path $wtPath) { Write-Host "Already exists: $wtPath"; exit 0 }

$exists = git branch --list $branch
if ($exists) { git worktree add $wtPath $branch }
else         { git worktree add -b $branch $wtPath $base }

if ($LASTEXITCODE -ne 0) { Write-Error "git worktree failed"; exit 1 }

# Link shared agent brain (junction = no admin needed on Windows)
foreach ($dir in @(".agent", "tasks")) {
    $src = Join-Path $repoRoot $dir
    $dst = Join-Path $wtPath $dir
    if ((Test-Path $src) -and -not (Test-Path $dst)) {
        cmd /c "mklink /J `"$dst`" `"$src`"" | Out-Null
    }
}

# Install deps if needed
if (Test-Path (Join-Path $wtPath "package.json")) {
    Push-Location $wtPath; npm install --silent; Pop-Location
}

Write-Host ""
Write-Host "✓ Worktree ready: $wtPath  (branch: $branch)"
Write-Host "→ Open that folder in OpenCode Desktop, then:"
Write-Host "  [IMPL] Read AGENTS.md then execute tasks/todo.md"

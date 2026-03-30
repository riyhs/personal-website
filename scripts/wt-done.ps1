#!/usr/bin/env pwsh
# wt-done.ps1 — merge worktree and clean up
# Usage: .\scripts\wt-done.ps1 -name <feature-name> [-into main] [-noMerge]
param([Parameter(Mandatory)][string]$name, [string]$into = "main", [switch]$noMerge)

$repoRoot = git rev-parse --show-toplevel
$repoName = Split-Path $repoRoot -Leaf
$wtPath   = Join-Path (Split-Path $repoRoot -Parent) "$repoName-wt-$name"
$branch   = "wt/$name"

if (-not (Test-Path $wtPath)) { Write-Warning "Not found: $wtPath"; exit 0 }

Push-Location $wtPath
if (git status --short) { Write-Error "Uncommitted changes. Commit or stash first."; Pop-Location; exit 1 }
Pop-Location

if (-not $noMerge) {
    Push-Location $repoRoot
    git checkout $into
    git merge --no-ff $branch -m "feat: merge $name"
    if ($LASTEXITCODE -ne 0) { Write-Error "Merge conflict. Resolve manually."; Pop-Location; exit 1 }
    Pop-Location
}

git worktree remove $wtPath --force
$del = Read-Host "Delete branch '$branch'? (y/N)"
if ($del -eq "y") { git branch -d $branch }

Write-Host "✓ Done: $name merged and cleaned up."

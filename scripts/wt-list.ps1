#!/usr/bin/env pwsh
# wt-list.ps1 — list all worktrees and their status
git worktree list | ForEach-Object {
    $parts = $_ -split '\s+'
    $path = $parts[0]; $branch = $parts[-1] -replace '[()]',''
    Push-Location $path
    $dirty = if (git status --short) { "dirty" } else { "clean" }
    Pop-Location
    Write-Host "  $branch`t$dirty`t$path"
}

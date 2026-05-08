# Documentation Organization Script
# Moves non-essential markdown files to organized folders

Write-Host "Organizing documentation files..." -ForegroundColor Cyan

# Files to KEEP in root (essential for GitHub)
$keepInRoot = @(
    "README.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "LICENSE.md"
)

# Move SESSION files
Write-Host "Moving session files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "SESSION_*.md" -File | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "docs/archive/sessions/" -Force
    Write-Host "  Moved $($_.Name)" -ForegroundColor Green
}

# Move ACHIEVEMENT files
Write-Host "Moving achievement files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "ACHIEVEMENT*.md" -File | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "docs/archive/achievements/" -Force
    Write-Host "  Moved $($_.Name)" -ForegroundColor Green
}

# Move STATUS files
Write-Host "Moving status files..." -ForegroundColor Yellow
$statusPatterns = @("STATUS*.md", "QUICK_STATUS*.md", "BUILD_STATUS.md", "CURRENT_STATUS*.md")
foreach ($pattern in $statusPatterns) {
    Get-ChildItem -Path . -Filter $pattern -File | ForEach-Object {
        if ($keepInRoot -notcontains $_.Name) {
            Move-Item -Path $_.FullName -Destination "docs/archive/status/" -Force
            Write-Host "  Moved $($_.Name)" -ForegroundColor Green
        }
    }
}

# Move WHATS_NEW files (except current)
Write-Host "Moving what's new files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "WHATS_NEW*.md" -File | ForEach-Object {
    if ($_.Name -ne "WHATS_NEW_V3.1.md") {
        Move-Item -Path $_.FullName -Destination "docs/archive/sessions/" -Force
        Write-Host "  Moved $($_.Name)" -ForegroundColor Green
    }
}

# Move legacy files
Write-Host "Moving legacy files..." -ForegroundColor Yellow
$legacyPatterns = @(
    "COMPLETE.md", "SUCCESS*.md", "READY_TO*.md", "PHASE_*.md",
    "MVP_COMPLETE.md", "PRODUCTION_READY.md", "FEATURES_*.md",
    "CONTINUE*.md", "HANDOFF.md", "SETUP.md", "INDEX.md",
    "BLANK_PAGE*.md", "DEMO_GUIDE.md", "TRY_IT_NOW.md",
    "REALISTIC_PLAN.md", "ROADMAP*.md", "NEXT_*.md",
    "CONTINUATION_PLAN.md", "POLISH_*.md", "PROGRESS_*.md",
    "README_*.md", "RELEASE_NOTES*.md", "QUICK_START_PHASE*.md",
    "*_PERCENT_*.md", "*_SUMMARY.md", "*_COMPLETE.md",
    "FINAL_*.md", "COMPLETE_*.md", "PROJECT_*.md",
    "OMNICUT_*.md", "MILESTONE_*.md", "V3.1_*.md"
)

foreach ($pattern in $legacyPatterns) {
    Get-ChildItem -Path . -Filter $pattern -File | ForEach-Object {
        if ($keepInRoot -notcontains $_.Name) {
            $dest = "docs/archive/legacy/"
            if ($_.Name -like "*_COMPLETE.md" -or $_.Name -like "*_SUMMARY.md") {
                $dest = "docs/archive/sessions/"
            }
            Move-Item -Path $_.FullName -Destination $dest -Force -ErrorAction SilentlyContinue
            Write-Host "  Moved $($_.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "Organization complete!" -ForegroundColor Green
$remaining = (Get-ChildItem -Path . -Filter "*.md" -File).Count
Write-Host "Remaining .md files in root: $remaining" -ForegroundColor Cyan

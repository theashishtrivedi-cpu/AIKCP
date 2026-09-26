# AI-KCP Local Development Auth Bootstrap v1.1
#
# Purpose:
#   Recreate the minimum development Auth dataset for local AI-KCP work.
#
# IMPORTANT:
#   - LOCAL SUPABASE ONLY.
#   - No passwords or service keys are stored in this repository.
#   - Credentials are entered interactively at runtime.
#   - This script intentionally verifies the Auth -> Profile trigger.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " AI-KCP Local Auth Bootstrap v1.1" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$envOutput = npx supabase status -o env

$apiUrl = (
    $envOutput |
    Select-String '^API_URL='
).ToString().Split('=', 2)[1].Trim('"')

$secretKey = (
    $envOutput |
    Select-String '^SERVICE_ROLE_KEY='
).ToString().Split('=', 2)[1].Trim('"')

if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    throw "Unable to determine local Supabase API URL."
}

if ([string]::IsNullOrWhiteSpace($secretKey)) {
    throw "Unable to determine local Supabase service role key."
}

Write-Host "Local API: $apiUrl" -ForegroundColor Green
Write-Host ""

$adminPassword = Read-Host "Password for aikcp.admin@example.test" -AsSecureString
$editorPassword = Read-Host "Password for aikcp.editor@example.test" -AsSecureString
$userPassword = Read-Host "Password for aikcp.user@example.test" -AsSecureString

function ConvertFrom-SecureStringPlainText {
    param(
        [System.Security.SecureString]$SecureString
    )

    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)

    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

$adminPasswordPlain = ConvertFrom-SecureStringPlainText $adminPassword
$editorPasswordPlain = ConvertFrom-SecureStringPlainText $editorPassword
$userPasswordPlain = ConvertFrom-SecureStringPlainText $userPassword

$headers = @{
    "apikey" = $secretKey
    "Authorization" = "Bearer $secretKey"
    "Content-Type" = "application/json"
}

$users = @(
    @{
        email = "aikcp.admin@example.test"
        password = $adminPasswordPlain
        role = "admin"
        status = "active"
        display_name = "AI-KCP Admin"
    },
    @{
        email = "aikcp.editor@example.test"
        password = $editorPasswordPlain
        role = "editor"
        status = "active"
        display_name = "AI-KCP Editor"
    },
    @{
        email = "aikcp.user@example.test"
        password = $userPasswordPlain
        role = "user"
        status = "restricted"
        display_name = "AI-KCP User"
    }
)

foreach ($user in $users) {

    Write-Host "Processing $($user.email)..." -ForegroundColor Yellow

    $existing = Invoke-RestMethod `
        -Method Get `
        -Uri "$apiUrl/auth/v1/admin/users?per_page=100" `
        -Headers $headers

    $existingUser = $existing.users |
        Where-Object { $_.email -eq $user.email } |
        Select-Object -First 1

    if ($existingUser) {

        $userId = $existingUser.id

        Write-Host "  Auth user already exists: $userId" -ForegroundColor DarkYellow

    }
    else {

        $body = @{
            email = $user.email
            password = $user.password
            email_confirm = $true
            user_metadata = @{
                display_name = $user.display_name
            }
        } | ConvertTo-Json -Depth 5

        $created = Invoke-RestMethod `
            -Method Post `
            -Uri "$apiUrl/auth/v1/admin/users" `
            -Headers $headers `
            -Body $body

        $userId = $created.id

        Write-Host "  Auth user created: $userId" -ForegroundColor Green
    }

    # Verify that handle_new_user() created the profile.
    $profile = Invoke-RestMethod `
        -Method Get `
        -Uri "$apiUrl/rest/v1/profiles?id=eq.$userId&select=id,role,status,display_name" `
        -Headers $headers

    if (-not $profile) {
        throw "Profile was not automatically created for $($user.email)."
    }

    Write-Host "  Trigger-created profile verified." -ForegroundColor Green
    Write-Host "  Initial role: $($profile[0].role)" -ForegroundColor DarkGray
    Write-Host "  Initial status: $($profile[0].status)" -ForegroundColor DarkGray

    # Configure the intended development role/status.
    $profileBody = @{
        role = $user.role
        status = $user.status
        display_name = $user.display_name
    } | ConvertTo-Json

    Invoke-RestMethod `
        -Method Patch `
        -Uri "$apiUrl/rest/v1/profiles?id=eq.$userId" `
        -Headers $headers `
        -Body $profileBody | Out-Null

    # Verify final state.
    $finalProfile = Invoke-RestMethod `
        -Method Get `
        -Uri "$apiUrl/rest/v1/profiles?id=eq.$userId&select=id,role,status,display_name" `
        -Headers $headers

    if (-not $finalProfile) {
        throw "Unable to verify final profile for $($user.email)."
    }

    Write-Host "  Final role: $($finalProfile[0].role)" -ForegroundColor Green
    Write-Host "  Final status: $($finalProfile[0].status)" -ForegroundColor Green
    Write-Host ""
}

$adminPasswordPlain = $null
$editorPasswordPlain = $null
$userPasswordPlain = $null
$secretKey = $null

Write-Host "==========================================" -ForegroundColor Green
Write-Host " AI-KCP Auth bootstrap completed" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

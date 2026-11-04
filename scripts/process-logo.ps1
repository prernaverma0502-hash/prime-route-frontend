Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Admin\.gemini\antigravity\brain\577d4106-589b-45af-9881-56317d3ad90e\.user_uploaded\media_1793602362760_6dcb453a.jpg"
$destDir = "c:\Users\Admin\Desktop\prime route\public"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Original dimensions: $($bmp.Width) x $($bmp.Height)"

# We will create a transparent PNG by removing the white background
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
$srcData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $newBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = [Math]::Abs($srcData.Stride) * $bmp.Height
$srcRgbValues = New-Object byte[] $bytes
$dstRgbValues = New-Object byte[] $bytes

[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgbValues, 0, $bytes)

# First pass: find background color near corners (approx 255, 255, 255)
# In 32bppArgb: byte order is B, G, R, A
for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = [int]$srcRgbValues[$i]
    $g = [int]$srcRgbValues[$i + 1]
    $r = [int]$srcRgbValues[$i + 2]
    
    # Calculate brightness and distance from white
    $minChannel = [Math]::Min($r, [Math]::Min($g, $b))
    
    # Check if near white
    if ($r -gt 238 -and $g -gt 238 -and $b -gt 238) {
        # Transparent
        $dstRgbValues[$i] = 0
        $dstRgbValues[$i + 1] = 0
        $dstRgbValues[$i + 2] = 0
        $dstRgbValues[$i + 3] = 0
    } elseif ($minChannel -gt 210) {
        # Smooth alpha feathering on edges
        $alpha = 255 - [int](($minChannel - 210) / (255 - 210) * 255)
        if ($alpha -lt 0) { $alpha = 0 }
        if ($alpha -gt 255) { $alpha = 255 }
        $dstRgbValues[$i] = [byte]$b
        $dstRgbValues[$i + 1] = [byte]$g
        $dstRgbValues[$i + 2] = [byte]$r
        $dstRgbValues[$i + 3] = [byte]$alpha
    } else {
        # Keep original color with full opacity
        $dstRgbValues[$i] = [byte]$b
        $dstRgbValues[$i + 1] = [byte]$g
        $dstRgbValues[$i + 2] = [byte]$r
        $dstRgbValues[$i + 3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstRgbValues, 0, $dstData.Scan0, $bytes)

$bmp.UnlockBits($srcData)
$newBmp.UnlockBits($dstData)
$bmp.Dispose()

# Find bounding box to crop tightly
$minX = $newBmp.Width
$maxX = 0
$minY = $newBmp.Height
$maxY = 0

for ($y = 0; $y -lt $newBmp.Height; $y += 2) {
    for ($x = 0; $x -lt $newBmp.Width; $x += 2) {
        $pixel = $newBmp.GetPixel($x, $y)
        if ($pixel.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: ($minX, $minY) to ($maxX, $maxY)"

# Add padding
$pad = 10
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($newBmp.Width - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($newBmp.Height - $cropY, ($maxY - $minY) + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$croppedBmp = $newBmp.Clone($cropRect, $newBmp.PixelFormat)

# Save the full transparent logo
$outPath = Join-Path $destDir "primeroute-logo.png"
$croppedBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved transparent logo to: $outPath"

# Also create a light/inverted version for dark backgrounds (Sidebar & Login Hero)
# On dark navy backgrounds, the navy "PR" part and "PRIME" should be crisp white or light blue so it stands out vividly!
$darkBmp = New-Object System.Drawing.Bitmap($croppedBmp.Width, $croppedBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $croppedBmp.Height; $y++) {
    for ($x = 0; $x -lt $croppedBmp.Width; $x++) {
        $p = $croppedBmp.GetPixel($x, $y)
        if ($p.A -gt 10) {
            # If the pixel is dark navy (r < 50, g < 60, b < 100), change it to white
            if ($p.R -lt 55 -and $p.G -lt 65 -and $p.B -lt 110) {
                $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, 255, 255, 255))
            } else {
                # Keep bright blue/sky blue as is
                $darkBmp.SetPixel($x, $y, $p)
            }
        }
    }
}

$darkOutPath = Join-Path $destDir "primeroute-logo-dark.png"
$darkBmp.Save($darkOutPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved dark-theme transparent logo to: $darkOutPath"

$newBmp.Dispose()
$croppedBmp.Dispose()
$darkBmp.Dispose()
Write-Host "Done!"


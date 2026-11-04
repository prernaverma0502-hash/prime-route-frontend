Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\Admin\Desktop\prime route\public\primeroute-logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($logoPath)

# The total height is ~514px (from 230 to 724 + padding)
# The emblem is the top ~78% of the image, text is bottom ~22%
# Let's crop just the emblem
$emblemH = [int]($bmp.Height * 0.76)
$emblemRect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $emblemH)
$emblemBmp = $bmp.Clone($emblemRect, $bmp.PixelFormat)

$destDir = "c:\Users\Admin\Desktop\prime route\public"
$emblemBmp.Save((Join-Path $destDir "primeroute-logo-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$darkLogoPath = "c:\Users\Admin\Desktop\prime route\public\primeroute-logo-dark.png"
$darkBmp = [System.Drawing.Bitmap]::FromFile($darkLogoPath)
$darkEmblemBmp = $darkBmp.Clone($emblemRect, $darkBmp.PixelFormat)
$darkEmblemBmp.Save((Join-Path $destDir "primeroute-logo-icon-dark.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$emblemBmp.Dispose()
$darkBmp.Dispose()
$darkEmblemBmp.Dispose()
Write-Host "Emblems generated!"


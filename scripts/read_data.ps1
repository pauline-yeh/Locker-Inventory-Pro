$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $folders = @("C:\Users\ECOCO\Desktop\規格確認", "C:\Users\ECOCO\Desktop")
    $file = $null
    
    foreach ($f in $folders) {
        if (Test-Path $f) {
            # Priority 1: Exact match for user confirmed file
            $file = Get-ChildItem -Path $f -Filter "*.xlsx" | Where-Object { $_.Name -like "*電子儲物櫃*.xlsx" } | Select-Object -First 1
            if ($file) { break }
            
            # Priority 2: Most recently modified file
            $file = Get-ChildItem -Path $f -Filter "*.xlsx" | Where-Object { -not $_.Name.StartsWith("~$") } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ($file) { break }
        }
    }
    
    if (-not $file) {
        Write-Error "Could not find '電子儲物櫃.xlsx' or any Excel files in Desktop or 規格確認 folder."
        return
    }

    Write-Host "選中的檔案: $($file.Name)" -ForegroundColor Yellow
    Write-Host "修改時間: $($file.LastWriteTime)" -ForegroundColor Gray

    $filePath = $file.FullName
    $workbook = $excel.Workbooks.Open($filePath)
    $sheet = $workbook.Sheets.Item(1)
    
    $usedRange = $sheet.UsedRange
    $rows = $usedRange.Rows.Count
    $cols = $usedRange.Columns.Count

    $headers = @()
    for ($c = 1; $c -le $cols; $c++) {
        $h = $sheet.Cells.Item(1, $c).Text
        if (-not $h) { $h = "Column$c" }
        $headers += $h
    }
    
    $data = @()
    for ($r = 2; $r -le $rows; $r++) {
        $rowObj = @{}
        for ($c = 1; $c -le $cols; $c++) {
            $h = $headers[$c-1]
            $val = $sheet.Cells.Item($r, $c).Text
            $rowObj[$h] = $val
        }
        $data += $rowObj
    }
    
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $jsonPath = Join-Path $scriptDir "locker_data.json"
    # Use standard utf8 (Windows PowerShell 5.1 compatibility)
    # Node.js side in generate_interface.js handles the BOM if present.
    $data | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonPath -Encoding utf8
    Write-Output "Successfully updated locker_data.json"
}
catch {
    Write-Error $_.Exception.ToString()
}
finally {
    if ($workbook) { $workbook.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}

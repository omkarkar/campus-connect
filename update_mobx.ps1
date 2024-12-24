# PowerShell script to update components for MobX migration

$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notlike "*\mob\*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Replace imports
    $content = $content -replace "from '\.\.\/store\/hooks'", "from '../store/hooks'"
    $content = $content -replace "from '\.\.\/store\/slices\/[^']*'", "from '../store/hooks'"
    
    # Replace useAppSelector with useAuthStore
    $content = $content -replace "useAppSelector\(\(state\) => [^)]+\)", "useAuthStore()"
    
    # Replace useAppDispatch
    $content = $content -replace "const dispatch = useAppDispatch\(\);", ""
    
    # Add observer import and wrap component
    if ($content -match "export default function (\w+)") {
        $componentName = $matches[1]
        $content = "import { observer } from 'mobx-react-lite';" + [Environment]::NewLine + $content
        $content = $content -replace "export default function $componentName", "const $componentName: React.FC = observer(function $componentName"
        $content = $content -replace "$", ");" + [Environment]::NewLine + [Environment]::NewLine + "export default $componentName;"
    }

    # Write updated content back to file
    $content | Set-Content $file.FullName
}

Write-Host "MobX migration script completed."

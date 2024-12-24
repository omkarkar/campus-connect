#!/bin/pwsh

# Function to update component files
function Update-ComponentFile {
    param (
        [string]$FilePath
    )

    $content = Get-Content $FilePath -Raw

    # Replace Redux imports
    $content = $content -replace 'import { useAppSelector, useAppDispatch } from ''.*?store/hooks''', 'import { observer } from ''mobx-react-lite'''
    $content = $content -replace 'import { useAppSelector } from ''.*?store/hooks''', 'import { observer } from ''mobx-react-lite'''
    $content = $content -replace 'import { useAppDispatch } from ''.*?store/hooks''', 'import { observer } from ''mobx-react-lite'''

    # Add import for root store
    $content = "import { rootStore } from '../store/mob/RootStore';" + $content

    # Remove Redux slice imports
    $content = $content -replace 'import \{.*?\} from ''.*?slices/.*?''', ''

    # Replace useAppSelector with store access
    $content = $content -replace 'const (\w+) = useAppSelector\(\(state\) => state\.(\w+)\.(\w+)\)', '$1 = rootStore.$2.$3'
    $content = $content -replace 'const (\w+) = useAppSelector\(\(state\) => state\.(\w+)\)', '$1 = rootStore.$2'

    # Remove useAppDispatch
    $content = $content -replace 'const dispatch = useAppDispatch\(\);', ''

    # Replace dispatch calls with direct store method calls
    $content = $content -replace 'dispatch\((.*?)\)', 'rootStore.$1'

    # Wrap component with observer
    $content = $content -replace '^(export default function (\w+))', 'export default observer($2)'
    $content = $content -replace '^(const (\w+): React\.FC.*?=)', 'const $2 = observer(() =>'
    $content = $content -replace '}$', '})' -replace '^}$', ''

    # Write updated content back to file
    $content | Set-Content $FilePath
}

# List of component files to update
$componentsToUpdate = @(
    'src/pages/courses/Courses.tsx',
    'src/pages/Students.tsx',
    'src/pages/courses/CourseDetail.tsx',
    'src/pages/notes/Notes.tsx',
    'src/pages/grades/Grades.tsx',
    'src/pages/Dashboard.tsx',
    'src/pages/Calendar.tsx',
    'src/pages/chat/Chat.tsx',
    'src/pages/assignments/Assignments.tsx',
    'src/components/layout/Sidebar.tsx',
    'src/components/layout/Layout.tsx',
    'src/components/layout/Header.tsx'
)

# Update each component
foreach ($component in $componentsToUpdate) {
    Write-Host "Updating $component"
    Update-ComponentFile -FilePath $component
}

Write-Host "MobX component conversion complete!"

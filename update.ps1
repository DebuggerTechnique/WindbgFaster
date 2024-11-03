param([string] $updatestr)
Write-Host "update git repo" -ForegroundColor Green

if ($updatestr -eq ""){
    $updatestr = "update"
}
git add . && git commit -m $updatestr && git push
<#help
 .Synopsis
  Sorts files inside a directory and places them (or their copy) into a different location according to the date & time of creation.

 .Parameter whatIf
  Prints the action that the program would have taken.

 .Example
  Sort-Item -path "D:\Users\Daniel\Desktop\Put on fb\" -mode Copy -target "D:\SortedPhotoes" -whatIf -Verbose
#>

Function Sort-Item{
    param(
  [parameter(Mandatory=$true)]$path,
	[Parameter(Mandatory=$true)]$target,
	[parameter(Mandatory=$true)][ValidateSet("Copy","Move")]$mode,
	[switch]$whatIf)
    process{
            $directories = (Get-ChildItem -path $path -Recurse -Directory);
            $cntCopied = 0;
			if(!($target -match "\\$")){
			    $target = $target + "\";
			}
            $directories | foreach {
				$dir = $_;
				write-host ("Processing directory: "+$dir) -ForegroundColor yellow;
				$files = (Get-ChildItem -path $dir.PSPath -File);
				$SkipThisDirectory = $false;
				
				if(!$SkipThisDirectory){
					$files | foreach{	
						$file = $_;
						$d = get-date $file.lastWriteTime;
						$yearFolder = $d.ToString("yyyy");
						$monthFolder = $d.ToString("MMMM");
						$path = $target + $yearFolder + "\" + $monthFolder;
						if(!(Test-Path $path)){
							if($whatIf){
								Write-Host ("I'd create the path: " + $path);
							}else{
								Write-Verbose ("Creating the path: " + $path);
								New-Item -Path $path -ItemType Directory;
							}
						};
						$path = $path + "\"; 
						$nameReduction = '([\d.\-_, ]*|([a-žA-Ž,\-; ]*))*';
						$dirOldName = ($file.Directory.Name -replace $nameReduction, '$1').Trim();
						$fileOldName = ($file.BaseName -replace $nameReduction, '$1').Trim()						
						$newTitle = "";
						if($dirOldName -eq "" -and $fileOldName -ne ""){
							$newTitle = " -" + $fileOldName;
						}
						if($dirOldName -ne "" -and $fileOldName -eq ""){
							$newTitle = " -" + $dirOldName;
						}
						if($dirOldName -ne "" -and $fileOldName -ne ""){
							if($dirOldName -eq $fileOldName){
								$newTitle = " -"+ $dirOldName;
							}else{
								$newTitle = " -" + $dirOldName + "," + $fileOldName;
							}
						}
						$newName = "Day" + $d.ToString(" d ddd H``mm") + $newTitle + $file.Extension;
						$isRenamed = $false;
						write-host "original new name:$newName";
						while(Test-Path ($path + $newName)){
							$isRenamed = $true;
							$isNumberedFileName = '^(.*?)\((\d+)\)(\.[a-žA-Ž]*)?$';
							if(!($newName -match $isNumberedFileName)){
								<#fileName does not contain a number in brackets#>
								$newName = $newName -replace '(.*)(\.[a-zA-Z0-9]{1,6})$', '$1 (1)$2';
							}else{
								$matches = [regex]::matches($newName, $isNumberedFileName);
								$copyNum = 1 + $matches.Groups[2].Value;
								$newName = $newName -replace $isNumberedFileName, ('$1('+$copyNum+')$3');
							}
						}
						$originalFile = $_;
						$path = $path + $newName;
						switch ($mode){
							"Copy" {
								if($whatIf){
									Write-Host ("I'd copy $file from " + $originalFile.Directory.FullName + " to $path");
								}else{
									Write-Verbose ("Copying $file from " + $originalFile.Directory.FullName + " to $path");
									<# i tried:
									echo f | xcopy $file.FullName $path;
									robocopy $file.Directory.FullName $path $file.Name;
									for testing: $file | new-item -path $path -ItemType File;
									#>
									$file | copy-item -Destination "$path";
								}
							}
							"Move" {
								if($whatIf){
									Write-Host ("I'd move $file from " + $originalFile.Directory.FullName + " to $path");
								}else{
									Write-Host ("Moving $file from " + $originalFile.Directory.FullName + " to $path");
									$file | Move-Item -Destination "$path";
								}
							}
						}
						$cntCopied = $cntCopied + 1;
					}
				}else{
					
				}
            }
            $wif = if($whatIf){"would be"}else{"were"};
            $action = if($mode -eq "Copy"){"copied"}else{"moved"};
			if(!$whatIf){
				Write-Host "$cntCopied files $wif $action!";
			}else{
				Write-Verbose "$cntCopied files $wif $action!";
			}
        }
}
Export-ModuleMember -Function Sort-Item
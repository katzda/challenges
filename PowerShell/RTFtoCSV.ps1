#Taken from: https://gist.github.com/sayedihashimi/02e98613efcb7280d706
function Resolve-FullPath{
    [cmdletbinding()]
    param([Parameter(Mandatory=$true,Position=0,ValueFromPipeline=$true)][string] $path)
    $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($path)
}
  
function _LoadRTFtoTXT{
    param($RTFfile,$OutputPath,$OutputSubdirectory,$RawCopyTextFileName)
    $Rtb = New-Object -TypeName System.Windows.Forms.RichTextBox;
    $fullPath = Resolve-FullPath -path $RTFfile
    $Rtb.Rtf = [System.IO.File]::ReadAllText($fullPath);
    if(!(Test-Path ("{0}\{1}" -f $OutputPath,$OutputSubdirectory))){
        New-Item -ItemType Directory -Path $OutputPath -Name $OutputSubdirectory; 
    }
    $Rtb.Text > ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$RawCopyTextFileName);
}

$Global:CSVdata = [System.Text.StringBuilder]::new();
[void]$Global:CSVdata.Clear();

class BufferFileReader{
    [System.IO.FileInfo]$__file;
    [System.IO.StreamReader] $__streamReader;
    [String[]]$__buffer;
    [int]$__indexRefill;
    [int]$__indexConsume;
    [int]$__count;
    [String]$returned;
    [bool]$__isOpen;
    [bool]$__fileExists;
        
    BufferFileReader([System.IO.FileInfo] $file){
        $this.SetFile($file);
    }

    BufferFileReader([System.IO.FileInfo] $file, [int]$bufferSize){
        $this.SetFile($file,$bufferSize);
    }

    SetFile([System.IO.FileInfo] $file){
        $this.__buffer = [String[]]::new(10);
        $this.__SettingTheFile($file);
    }

    SetFile([System.IO.FileInfo] $file, [int]$bufferSize){
        $this.__buffer = [String[]]::new($bufferSize);
        $this.__SettingTheFile($file);
    }

    __SettingTheFile([System.IO.FileInfo] $file){
        $this.__indexRefill = 0;
        $this.__indexConsume = 0;
        $this.__count = 0;
        $this.__isOpen = $false;
        $this.__file = $file;
        $this.__fileExists = $false;
        if(!(Test-Path $file)){
            Write-Host "File not found, set file properly using `$bufferFileReader.SetFile(`$file)";
        }else{
            $this.__fileExists = $true;
        }
    }

    Open(){
        $ok = $true;
        try{
            $this.__streamReader = [System.IO.StreamReader]::new($this.__file.FullName);
        }catch{
            $ok = $false;
            Write-Warning ("{0}" -f $_.Exception.Message);
        }
        if($ok){
            $this.__isOpen = $true;
            $this.__bufferFillUp();
        }
    }

    Close(){
        $this.__isOpen = $false;
        $this.__streamReader.Close();
    }

    __BufferFillUp(){
        if($this.__isOpen){
            $eof = $false;
            for(; $null -eq $this.__buffer[$this.__indexRefill] ; $this.__indexRefill = ($this.__indexRefill + 1) % $this.__buffer.Length){
                $line = $this.__streamReader.ReadLine();
                if(!($null -eq $line)){
                    $line = $line.Trim();
                }else{
                    $eof = $true;
                    break;
                }
                #en empty string means there's no value in the rtf, it's correct
                $this.__buffer[$this.__indexRefill] = $line;
                $this.__count = $this.__count + 1;
            }
        }
    }
    
    __BufferResize([int]$desiredSize){
        if($this.__buffer.Length -lt $desiredSize){
            $tmp = [String[]]::new($desiredSize);
            $i=0;
            for(; $this.__buffer[$this.__indexConsume] -and ($i -lt $this.__buffer.Length); $this.__indexConsume = ($this.__indexConsume + 1) % $this.__buffer.Length){
                $tmp[$tmp.Length-$this.__count+$i++] = $this.__buffer[$this.__indexConsume];
            }
            $this.__buffer = $tmp;
            $this.__indexConsume = $tmp.Length-$this.__count;
            $this.__indexRefill = 0;
        }
    }

    PushBackLifo([String]$d){
        $this.returned = $d;
        $this.__count++;
    }

    ResetLifo(){
        if($this.__buffer.Length -lt $this.__count){
            $this.__count--;
        }
    }

    [String[]] GetLines([int]$NoLines){
        if($this.__isOpen){
            if($NoLines -gt $this.__buffer.Length){
                $this.__bufferResize($NoLines);
                $this.__bufferFillUp();
            }

            [String[]]$lines = [String[]]::new($NoLines);
            $i=0;
            if($this.__buffer.Length -lt $this.__count){
                $lines[$i++] = $this.returned;
                $this.__count--;
            }
            for(; $this.__buffer[$this.__indexConsume] -and ($i -lt $lines.Length) ; $this.__indexConsume = ($this.__indexConsume + 1) % $this.__buffer.Length){
                $lines[$i++] = $this.__buffer[$this.__indexConsume];
                $this.__buffer[$this.__indexConsume] = $null;
                $test = $this.__buffer[$this.__indexConsume];
                $this.__count--;
            }
            #$this.printBuffer("after get {0} lines"-f $lines.Length);
            $this.__BufferFillUp();
            return $lines;
        }else{
            Write-Warning ("Error: Accessing a closed file '{0}'" -f $this.__file.FullName);
            return [String[]]@();
        }
    }

    printBuffer($msg = ""){
        [System.Text.StringBuilder]$bug = "";
        for($i=0; $i -lt $this.__buffer.Length ; $i++){
            if(!$this.__buffer[$i]){
                $bug.Append("0 ");
            }else{
                $bug.Append("1 ");
            }
        }
        $bug.Append(" : {0}$([System.Environment]::NewLine)" -f $msg);
        for($i=0; $i -lt $this.__buffer.Length ; $i++){
            if($i -eq $this.__indexRefill){
                $bug.Append("- ");
            }else{
                $bug.Append("  ");
            }
        }
        $bug.Append(" : this.__indexRefill");
        $bug.Append([System.Environment]::NewLine);
        for($i=0; $i -lt $this.__buffer.Length ; $i++){
            if($i -eq $this.__indexConsume){
                $bug.Append("- ");
            }else{
                $bug.Append("  ");
            }
        }
        $bug.Append(" : this.__indexConsume");
        Write-Host $bug.ToString();
    }

    [bool] HasNext(){
        return $this.__count -gt 0;
    }
}

function _DebugLogging([ref]$logFile,$msg){
    if(!!$logFile.Value){
        $msg >> $logFile.Value;
    }
}

function _WriteToCSV([ref]$result, [ref]$CSVfile){
    [System.Collections.ArrayList]$collection = New-Object System.Collections.ArrayList($null);
    $collection.Add((New-Object PSObject -Property $result.Value)) | Out-Null;
    $collection | Export-Csv  $CSVfile.Value -NoTypeInformation -Encoding UTF8 -Delimiter '|' -Append
}

function _FinalCorrections([ref]$result){
    
}
  
function _ComposeCSV{
    param($OutputPath,$OutputSubdirectory,$RawCopyTextFileName,$DebugLogFile,$CSVOutputfile);
    $rules = [Array[]]::new(14);
    #last true|false - the read value (index 0) is already to be put as a value not a title
    #RULES DESCRIPTION:
    #[index][rule definition] - Description:
    #[][0] - Number of lines to be read in order to then match it against the next rule regex collection
    #[][1] - Regexes of the next rule after this current rule;
    #[][2] - Hash table key identifying the collection name where the current line will be put.
    #[][3] - $T or $F iff the rule regex represents recognition of an actual value that should be put into the resulting collection.
    #[][4] - Index number of the next rule
    #rule 13 is something like a rule number -1 when no rule is active
    $rules[13] = @(1, "This file was created", "garbage", $false, 0);
    #then I seek the next rule string in the input file outputting lines into the specified collection
    $rules[0] = @(1, "Page (\d+) of \d+", "Room No.", $false, 1);
    $rules[1] = @(1, "Room No.", "garbage", $false, 2);
    $rules[2] = @(1, "Maintenance Remarks", "Entered On", $false, 3);
    $rules[3] = @(2, "Entered On", "Entered Time", $false, 4);
    $rules[4] = @(1, "Time", "Entered By", $false, 5);
    $rules[5] = @(1, "Entered By", "Resolved Date", $false, 6);
    $rules[6] = @(2, "Resolved On", "Resolved Time", $false, 7);
    $rules[7] = @(1, "Time", "Resolved By", $false, 8);
    $rules[8] = @(1, "Resolved By", "Maintenance Remarks", $false, 9);
    $rules[9] = @(1, "^Clean$|^Dirty$|^Out of Order$", "Hsk. Status", $true, 10);
    $rules[10] = @(1, "Hsk. Status", "FO Status", $false, 11);
    $rules[11] = @(2, "FO Status", "garbage", $false, 0);
    $file = get-item ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$RawCopyTextFileName);
    $logFile = "";
    if($DebugLogFile -ne ""){
        $logFile = ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$DebugLogFile);
    }
    $CSVfile = "";
    if($DebugLogFile -ne ""){
        $CSVfile = ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$CSVOutputfile);
    }
    $fileSizeBYTE = $file.Length;
    #More MB the file has means more often I'll be printing out the progress status
    $progressStep = [int]($fileSizeBYTE / 1048576); #(== 1024*1024)
    #this could be a memory problem for a large files like 300MB.
    #in that case I'd have to incrementaly count number of lines using a smaller -ReadCount
    $fileNoLines = (gc $file -ReadCount $fileSizeBYTE).Count;
    $lineIndex = 0;
    $result = @{};
    $ActiveRule = 13;
    $NextRule = $rules[$ActiveRule][4];
    $NumberOfNeededMatches = $rules[$NextRule][0];
    [BufferFileReader] $BufferFileReader = [BufferFileReader]::new($file,2);
    $BufferFileReader.Open();
    $NewRuleBegining = $true;
    $column = $rules[13][2];
    $RuleWasAlsoValue = $rules[13][3];
    $PageNo = 0;
    while($BufferFileReader.HasNext()){
        $lineIndex += $NumberOfNeededMatches;
        $buffer = $BufferFileReader.GetLines($NumberOfNeededMatches);
        $NewRuleBegining = $([regex]::matches(($buffer -join " "), $rules[$ActiveRule][1]));
        if(!!$NewRuleBegining){
            if($NewRuleBegining.Groups.Count -eq 2){
                #unifying number of lines of each column
                _FinalCorrections ([ref]$result);
                #output into csv format
                _WriteToCSV ([ref]$result) ([ref]$CSVfile);
                #clear the array
                $result = @{};
                #output messages
                $PageNo = $NewRuleBegining.Groups[1].Value;
                Write-Progress (("Page number {0}" -f $PageNo));
                _DebugLogging ([ref]$logFile) ("Page {0}." -f $PageNo);
            }
            #old values needed now!
            $column = $rules[$ActiveRule][2];
            $RuleWasAlsoValue = $rules[$ActiveRule][3];
            #next values needed during the next whole page
            $ActiveRule = $NextRule;
            $NextRule = $rules[$ActiveRule][4];
            $NumberOfNeededMatches = $rules[$ActiveRule][0];
            if($RuleWasAlsoValue){
                #assuming if the its a value then there's practivally 
                #no point to load more then one line in a buffer
                if(!!($result[$rules[$ActiveRule][2]] -eq $null)){
                    $result[$column] = @();
                }
                $result[$column] += $buffer[0];
                _DebugLogging ([ref]$logFile) ("New[{0}] += {1}" -f $column,$buffer[0]);
                #so if I needed multiple lines, it's not gonna be a value of the array
            }
            $BufferFileReader.ResetLifo();
            continue;
        }else{
            if($NumberOfNeededMatches -eq 2){
                $BufferFileReader.PushBackLifo($buffer[1]);
                $lineIndex--;
            }
            if($ActiveRule -ne -1){
                if(!!($result[$column] -eq $null)){
                    $result[$column] = @();
                }
                $result[$column] += $buffer[0];
                _DebugLogging ([ref]$logFile) ("[{0}] += {1}" -f $column,$buffer[0]);
            }else{
                _DebugLogging ([ref]$logFile) ("Warning: No active parsing rule at line: {0}" -f $lineIndex);
                continue;
            }
        }
        <#
        if(($lineIndex % $progressStep) -eq 0){
            Write-Progress ("Processing file: {0}% complete." -f ($progressCounter/$fileNoLines));
        }#>
    }
    $BufferFileReader.Close();
}

if((Test-Path Alias:gd) -eq $false){
    New-Alias gd Get-Date;
}

function RBConvert-RTFtoCSV{
    param(
        $InputRTFfile,
        $InputTXTfile,
        [switch]$WhatIf,
        [bool]$SaveToSSD = $true,
        $OutputPath = ".",
        $OutputSubdirectory = ("Date{0}{1}Time{2}{3}" -f (gd -Format dd),(gd -Format MM), (gd -Format HH),(gd -Format mm)),
        $OutputFileName = "Result.csv",
        $OutputRawCopyTextFileName = "Data_raw_copy.txt",
        [switch]$DebugLogFile
    )
    $OutputDebugLogFile = "";
    if($DebugLogFile){
        $OutputDebugLogFile = "log.txt";
    }
    #create output directory
    if(!(Test-Path ("{0}\{1}" -f $OutputPath, $OutputSubdirectory))){
        New-Item -Path ("{0}" -f $OutputPath) -Name $OutputSubdirectory -ItemType Directory;
    }
    #first try input txt file
    if(!!$InputTXTfile){
        #copy and rename
        copy $InputTXTfile -Destination ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$OutputRawCopyTextFileName);
    }else{
        if(!!$InputRTFfile){
            _LoadRTFtoTXT -RTFfile $InputRTFfile -OutputPath $OutputPath -OutputSubdirectory $OutputSubdirectory -RawCopyTextFileName $OutputRawCopyTextFileName;
        }
    }
    if(!(Test-Path -Path ("{0}\{1}\{2}" -f $OutputPath,$OutputSubdirectory,$OutputRawCopyTextFileName))){
        Write-Host "No data provided";
    }else{
        Write-Verbose "Composing CSV format";
        _ComposeCSV -OutputPath $OutputPath -OutputSubdirectory $OutputSubdirectory -RawCopyTextFileName $OutputRawCopyTextFileName -DebugLogFile $OutputDebugLogFile -CSVOutputfile $OutputFileName;
    }
}

Write-Host "New command has been registered:";
Write-Host "RBConvert-RTFtoCSV" -ForegroundColor Green -n; Write-Host " -OutputDirectory <path> [-RTFfile <file>] [-TXTdata <String[]>] [-WhatIf]" -ForegroundColor DarkGray
Write-Host "The RTFfile parameter needs to be provided at least at the first time run. The following executions are able to use a stored TXT value in the current session. Alternatively use the TXTdata parameter to set the TXT variable directly which will bypass the time consuming convertion from RTF to TXT (for larger files). Providing the RTFfile will force a reload from HDD and convertion to this TXT variable again.";
# condition breakpoints

```
bp /w "@$curprocess.Name == \"lsass.exe\"" nt!NtReadFile

bp /w "@$curprocess.Name.Contains(\"CNGClient.exe\")" ksecdd!KsecDispatch

bp /w "@rdx == 0x3ea" cryptsvc!s_SSCertProtectFunction  

// js script to set multi-breakpoint
bp /w "@$scriptContents.xx()" 

// set a condition breakpoint when the current stack contain ..

bp /w "@$curstack.Frames.Where(x => x.Attributes.SourceInformation.FunctionName.Contains(\"ExpGetProcessInformation\")).Count > 0" nt!NtCreateUserProcess



bm /w "@$curstack.Frames.Where(x => x.Attributes.SourceInformation.FunctionName.Contains(\"Process\")).Where(x =>  x.Attributes.SourceInformation.Module.Name.Contain(\"nt\")).Count > 0" nt!NtCreate*
```


# data breakpoint
```
ba r4 [address]
```

# SyntheticTypes
```
.scriptload SynTypes.js
dx Debugger.Utility.Analysis.SyntheticTypes.ReadHeader("D:\\Desktop\\petools\\windbgExt\\js\\demo-struct.h","ntdll")
dx -r2 Debugger.Utility.Analysis.SyntheticTypes.CreateInstance("_test",@rbx)


dx -r3 Debugger.Utility.Analysis.SyntheticTypes.TypeTables.Select(x => new { module = x.Module.Name, header = x.Header, types = x.Types.Select(t => t.Name).Flatten() })
```


# misc
```
// hit the breakpoint with the specified thread
~0  bp xxx

// symbols
dx -r0 @$getsym = (x => Debugger.Utility.Control.ExecuteCommand(".printf\"%y\", " + ((__int64)x).ToDisplayString("x"))[0])
```
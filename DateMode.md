# ListEntry
> https://windows-internals.com/lookaside-list-forensics/   
> Processes, thread, modules, DPCs, IRPs 

## HandleTable
```
dx -g Debugger.Utility.Collections.FromListEntry(*(nt!_LIST_ENTRY*)&nt!HandleTableListHead,"nt!_HANDLE_TABLE","HandleTableList")

// query the specified pid process' handle table from the global handle table
dx Debugger.Utility.Collections.FromListEntry(*(nt!_LIST_ENTRY*)&nt!HandleTableListHead, "nt!_HANDLE_TABLE", "HandleTableList").Where(x => x._HANDLE_TABLE::UniqueProcessId != 0x1970)

// enum all process handle table
dx -g Debugger.Utility.Collections.FromListEntry(*(nt!_LIST_ENTRY*)&nt!HandleTableListHead, "nt!_HANDLE_TABLE", "HandleTableList").Where(h => h.QuotaProcess != 0).Select(h => new { Object = h.QuotaProcess, HandleTable = &h.HandleTableList, Name = ((char*)h.QuotaProcess->ImageFileName).ToDisplayString("sb"), PID = (__int64)h.QuotaProcess->UniqueProcessId})

```

## Process
```
dx -g Debugger.Utility.Collections.FromListEntry(*(nt!_LIST_ENTRY*)&nt!PsActiveProcessHead,"nt!_EPROCESS","ActiveProcessLinks")
```



# Process

```windbg
!dml_proc

dx @$cursession.Processes.Where(x => x.Name.Contains(""))

dx -g @$cursession.Processes.Select(p => new {Name = p.Name, Threads = p.Threads })

dx -g @$cursession.Processes.Select(p => new {Name = p.Name, ThreadCount = p.Threads.Count()}).OrderByDescending(p => p.ThreadCount),d

dx @$cursession.Processes.OrderByDescending(x => x.KernelObject.UniqueProcessId)

dx @$cursession.Processes.Select(p => p.Name),5  
```

## PPL

```
// _PS_PROTECTION  Type  PsProtectedTypeNone
dx -r2 @$cursession.Processes.Select(x => new { name = x.Name, pid = x.KernelObject.UniqueProcessId, protection = x.KernelObject.Protection} ).Where(p => p.protection.Type != 0 )
```

## wow64
```
// wow64
dx -g @$cursession.Processes.Select(x => new { name = x.Name, pid = x.KernelObject.UniqueProcessId,wow64 = x.KernelObject.WoW64Process} ).Where(p => p.wow64 != 0)

dx -g @$cursession.Processes.Select(x => new { name = x.Name, pid = x.KernelObject.UniqueProcessId,wow64 = x.KernelObject.WoW64Process, peb = (*(nt!_EWOW64PROCESS*)&x.KernelObject.WoW64Process).Peb } ).Where(p => p.wow64 != 0)
```

## Mitigations
```
dx -r1 @$cursession.Processes.Where(p => (p.KernelObject.MitigationFlags & 0x20) == 0)


```


## Handle
```
dx -r1 @$curprocess.Io.Handles
```

### Process
```
dx -r1 @$curprocess.Io.Handles.Where(x => x.Type == "Process")

// handle to pid
dx -r1 @$curprocess.Io.Handles.Where(x => x.Type == "Process").Select(x => ((*(nt!_EPROCESS*)&(*(nt!_OBJECT_HEADER*)&x.Object).UnderlyingObject)).UniqueProcessId)

// pid, imagename
dx -g @$curprocess.Io.Handles.Where(x => x.Type == "Process").Select(x => new { pid = ((*(nt!_EPROCESS*)&(*(nt!_OBJECT_HEADER*)&x.Object).UnderlyingObject)).UniqueProcessId, name = (char*)((*(nt!_EPROCESS*)&(*(nt!_OBJECT_HEADER*)&x.Object).UnderlyingObject)).ImageFileName })

dx -g @$curprocess.Io.Handles.Where(x => x.Type == "Process").Select(x => new { pid = ((*(nt!_EPROCESS*)&(*(nt!_OBJECT_HEADER*)&x.Object).UnderlyingObject)).UniqueProcessId, name = ((char*)((*(nt!_EPROCESS*)&(*(nt!_OBJECT_HEADER*)&x.Object).UnderlyingObject)).ImageFileName).ToDisplayString("sb") })
```

### Key
```
dx -r1 @$curprocess.Io.Handles.Where(x => x.Type == "Key").First() 
```




# File

## NtCreateFile
```
// similar with tracing
bp nt!NtCreateFile "dt nt!_OBJECT_ATTRIBUTES @r8 -y ObjectName; g"


// trace with the specified process
bp /w "@$curprocess.Name == \"lsass.exe\" " nt!NtCreateFile "dt nt!_OBJECT_ATTRIBUTES @r8 -y ObjectName; g"

bp /w "@$curprocess.KernelObject.UniqueProcessId == 0xcb0" nt!NtCreateFile "dt nt!_OBJECT_ATTRIBUTES @r8 -y ObjectName; g"
```



# User variables
```windbg
dx @$vars

dx @$vars.Add("bopin","this is a test")
```

# 
# TTD
> https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/getting-started-with-windbg       
> attach TTD    

## ttdext
```
!ttdext.help
!tt  12:1
!tt 0
!tt 100
!events
!positions
dx @$curprocess.TTD.Lifetime

```

## misc
```
// jump or seek to the specified time position
dx -s @$create("Debugger.Models.TTD.Position", 42, 0).SeekTo()


dx @$cursession.TTD.DefaultParameterCount = 8
```

## events
>  Exception  ModuleLoaded    ModuleUnloaded  ThreadCreated   ThreadTerminated      
```
dx @$curprocess.TTD.Events.Where(t => t.Type == "Exception").Select(e => e.Exception) 

dx @$curprocess.TTD.Events.Where(t => t.Type == "ModuleLoaded").Where(t => t.Module.Name.ToLower().Contains("ntdll.dll")) 

dx -g @$curprocess.TTD.Events.Where(t => t.Type == "ThreadCreated").Select(t => t.Thread) 
```

### Thread
```
dx -g @$curprocess.TTD.Events.Where(x => x.Type == "ThreadCreated").OrderBy(t => t.Thread.UniqueId)
dx -g @$curprocess.TTD.Events.Where(x => x.Type == "ThreadTerminated").OrderBy(t => t.Thread.UniqueId)

dx -g @$curprocess.TTD.Events.Where(x => x.Type == "ThreadCreated" || x.Type == "ThreadTerminated").OrderBy(t => t.Thread.UniqueId)

dx -g @$curprocess.TTD.Events.Where(x => x.Type == "ThreadCreated" || x.Type == "ThreadTerminated").OrderBy(t => t.Thread.UniqueId).Select(x => new {Thread = x.Thread, Position = x.Position })
```



## ttd call

### xfg

```

```

### cfg
```

```



### Process
```
// create process  parameters
dx -g @$calls = @$cursession.TTD.Calls("kernel32!CreateProcessWStub").Select(x => new { tid = x.UniqueThreadId, handle = x.ReturnValue, filename = ((wchar_t*)x.Parameters[0]).ToDisplayString("sub")  })

```

### ioctl
```
// ioctl
dx -r2 @$cursession.TTD.Calls("ntdll!NtDeviceIoControlFile").Select(x => x.Parameters)

```

### file
```
// query
dx -g @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").Select(x => new { tid = x.UniqueThreadId, rax = x.ReturnValue })

// createfile
dx -r2 @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").Select(x => new { tid = x.UniqueThreadId, handle = x.ReturnValue, filename = ((wchar_t*)x.Parameters[0]).ToDisplayString("sub")  })

// time sequence orderby
dx -g @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").OrderBy(t => t.TimeStart.Sequence)


// 
dx -g @$calls = @$cursession.TTD.Calls("kernelbase!CreateFileW").OrderBy(t => t.TimeStart.Sequence).Select(x => new { tid = x.ThreadId, function = x.Function, lastfunction = @$getsym(x.ReturnAddress), rax = x.ReturnValue, filename = ((wchar_t*)x.Parameters[0]).ToDisplayString("sub") })
```
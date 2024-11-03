# TTD
> https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/getting-started-with-windbg       
> attach TTD

```
// jump or seek to the specified time position
dx -s @$create("Debugger.Models.TTD.Position", 42, 0).SeekTo()

// query
dx -g @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").Select(x => new { tid = x.UniqueThreadId, rax = x.ReturnValue })


dx @$cursession.TTD.DefaultParameterCount = 8

// createfile
dx -r2 @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").Select(x => new { tid = x.UniqueThreadId, handle = x.ReturnValue, filename = ((wchar_t*)x.Parameters[0]).ToDisplayString("sub")  })

// time sequence orderby
dx -g @$calls = @$cursession.TTD.Calls("kernel32!CreateFilew").OrderBy(t => t.TimeStart.Sequence)
```
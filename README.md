# WindbgFaster
Let's debugging everything faster that previous time.

## RPC
> parse rpcrt4!NdrServerCall args
> how to use?

```windbg
0:011> dx @$scriptContents.show_rpc_message64(@r8)
@$scriptContents.show_rpc_message64(@r8)                 : [object Object]
    offset           : 0x0
    rpc             
    misc            
    Handle           : 0x28ed5529140
    DataRepresentation : 0x28ed5529148
    Buffer           : 0x28ed5529150
    BufferLength     : 0x17
    ProcNum          : 0x1
    TransferSyntax   : 0x28ed5529160
    RpcInterfaceInformation : 0x28ed5529168
    ReservedForRuntime : 0x28ed5529170
    ManagerEpv       : 0x28ed5529178
    ImportContext    : 0x28ed5529180
    RpcFlags         : 0x28ed5529188
    length           : 0x50
    bufferContents      
0:011> dx -r1 @$scriptContents.show_rpc_message64(@r8).bufferContents
@$scriptContents.show_rpc_message64(@r8).bufferContents                
    [0x0]            : 0000028e`d5529378  00 00 02 00 07 00 00 00-00 00 00 00 07 00 00 00  ................
    [0x1]            : 0000028e`d5529388  77 68 6f 61 6d 69 00 73-01 00 00 00 04 5d 88 8a  whoami.s.....]..
    [0x2]            : 0000028e`d5529398  eb 1c c9      
```


## drvier load
```
RtlInitUnicodeString
NtLoadDriver
IopLoadDriverImage
db poi(@rcx+8)
```

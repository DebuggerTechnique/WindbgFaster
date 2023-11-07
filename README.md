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
NtLoadDriver                        db poi(@rcx+8)   // parse args    driver name
IopLoadDriverImage                  db poi(@rcx+8)
IopLoadUnloadDriver
IopLoadDriver                       !handle rcx        // 查看句柄信息
    NtQueryKey
    NtQueryValueKey                // 根据句柄从注册表读取路径
    IopSafebootDriverLoad          db poi(@rcx+8)  // 参数类型是  Unicode_String  

    MmLoadSystemImage            IopLoadDriver 调用MmLoadSystemImage 加载 \??  是 \Global?? 简写
        nt!MmLoadSystemImage:
        fffff800`80f53920 4883ec38        sub     rsp,38h
        0: kd> db poi(@rcx+8)
        ffffe30f`f515b7c0  5c 00 3f 00 3f 00 5c 00-43 00 3a 00 5c 00 55 00  \.?.?.\.C.:.\.U.
        ffffe30f`f515b7d0  73 00 65 00 72 00 73 00-5c 00 62 00 6f 00 70 00  s.e.r.s.\.b.o.p.
        ffffe30f`f515b7e0  69 00 6e 00 5c 00 44 00-65 00 73 00 6b 00 74 00  i.n.\.D.e.s.k.t.
        ffffe30f`f515b7f0  6f 00 70 00 5c 00 53 00-79 00 73 00 74 00 65 00  o.p.\.S.y.s.t.e.
        ffffe30f`f515b800  6d 00 49 00 6e 00 66 00-6f 00 72 00 6d 00 65 00  m.I.n.f.o.r.m.e.
        ffffe30f`f515b810  72 00 2e 00 73 00 79 00-73 00 00 00 6c 00 00 00  r...s.y.s...l...
        ffffe30f`f515b820  00 00 07 03 4e 74 63 65-f5 cc 13 77 fd d3 76 12  ....Ntce...w..v.
        ffffe30f`f515b830  b0 b4 15 f5 0f e3 ff ff-50 b7 15 f5 0f e3 ff ff  ........P.......
    
```

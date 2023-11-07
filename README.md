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
        // bp nt!MmLoadSystemImage ".if(1==1) {.echo hit MmLoadSystemImage; db poi(@rcx+8);gc;}"
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

    IopBootLog
        ZwSetValueKey   // 写入注册表某个值
        1: kd> !handle rcx
        PROCESS ffffcc850d5b9140
            SessionId: 1  Cid: 0dbc    Peb: 00389000  ParentCid: 0ff8
            DirBase: 5264b002  ObjectTable: ffffe30ff5443c80  HandleCount: 544.
            Image: KmdManager_V1.1.exe
        
        Kernel handle table at ffffe30fec430e40 with 2857 entries in use
        
        8000062c: Object: ffffe30fecfda5b0  GrantedAccess: 000f003f Entry: ffffe30fecedb8b0
        Object: ffffe30fecfda5b0  Type: (ffffcc85036ba4e0) Key
            ObjectHeader: ffffe30fecfda580 (new version)
                HandleCount: 1  PointerCount: 32647
                Directory Object: 00000000  Name: \REGISTRY\MACHINE\SOFTWARE\MICROSOFT\WINDOWS NT\CURRENTVERSION\NOTIFICATIONS\DATA
        
        
        1: kd> r
        rax=00000000000001c0 rbx=ffffffffffffffff rcx=ffffffff8000062c
        rdx=fffff30b140bc878 rsi=000000000000014b rdi=ffffe30ff0e98130
        rip=fffff80080c126f0 rsp=fffff30b140bc818 rbp=fffff30b140bcb80
         r8=0000000000000000  r9=0000000000000003 r10=0000000000000000
        r11=ffffe30ff326e1bc r12=00000000077eeb88 r13=00000000000001bc
        r14=ffffe30ff326e000 r15=ffffcc850d5b9140
        iopl=0         nv up ei pl zr na po nc
        cs=0010  ss=0018  ds=002b  es=002b  fs=0053  gs=002b             efl=00040246
        nt!ZwSetValueKey:
        fffff800`80c126f0 488bc4          mov     rax,rsp
        1: kd> db poi(@rdx+8)
        fffff30b`140bc8c0  34 00 31 00 38 00 41 00-30 00 37 00 33 00 41 00  4.1.8.A.0.7.3.A.
        fffff30b`140bc8d0  41 00 33 00 42 00 43 00-33 00 34 00 37 00 35 00  A.3.B.C.3.4.7.5.
        fffff30b`140bc8e0  00 00 00 00 00 00 00 00-71 82 31 76 ed db ff ff  ........q.1v....
        fffff30b`140bc8f0  00 00 00 00 00 00 00 00-80 6d 43 ec 0f e3 ff ff  .........mC.....
        fffff30b`140bc900  01 50 3b 00 00 00 00 00-00 00 00 00 00 00 00 00  .P;.............
        fffff30b`140bc910  00 00 00 00 00 00 00 00-fd e4 e8 80 00 f8 ff ff  ................
        fffff30b`140bc920  bc 01 00 00 00 00 00 00-00 00 00 00 00 00 00 00  ................
        fffff30b`140bc930  80 cb 0b 14 0b f3 ff ff-bc 01 00 00 00 00 00 00  ................

```

```
bp nt!MmGetSystemRoutineAddress ".if(1 == 1) {.echo hit MmGetSystemRoutineAddress; db poi(@rcx+8); gc;}"

kd> bp nt!ObRegisterCallbacks
kd> bp nt!ObUnRegisterCallbacks
```




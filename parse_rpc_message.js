"use strict";

function initializeScript()
{
    //
    // Return an array of registration objects to modify the object model of the debugger
    // See the following for more details:
    //
    //     https://aka.ms/JsDbgExt
    //
    return [
            new host.apiVersionSupport(1, 7),
            new host.functionAlias(show_rpc_message64,'rpcmessage64'),
        ];
}
class IMemory{
    constructor(){
        this.name = "interface memory management r/w";
        this.version = 1;
        this.description = "windbg javascript memory operation";
        this.filesystem = host.namespace.Debugger.Utility.FileSystem;
    }
    get toString(){
        return {
            name : this.name,
            version : this.version,
            description : this.description
        }
    }
 
    read_memory(address,size,print,pad,separator)
    {
        var buffer = host.memory.readMemoryValues(address,size);
        let padding = 16;
        if(pad)
        {
            padding = pad;
        }
        if(print)
        {
            for(let i = 0;i < buffer.length;i++)
            {
                if(i % padding == 0)
                {
                    printline();
                }
                printhex(buffer[i]); printmsg(separator);
            }
            printmsg();
        }
        return buffer;
    }

    read_string(address)
    {
        return host.memory.readString(address);
    }

    read_unicodestr(address)
    {
        return host.memory.readWideString(address);
    }

    read_mem(address,size)
    {
        return host.memory.readMemoryValues(address,size);
    }

    _bufferNum(address,len)
    {
        var mem = this.read_mem(address,len);
        var buffer = new ArrayBuffer(len);
        var uintarray = new Uint8Array(buffer);
        var dataview = new DataView(uintarray.buffer);
        for(var i =0;i < mem.length;i++)
        {
            dataview.setInt8(i,mem[i],true);
        }
        uintarray.reverse();
        return dataview;
    }

    // little endian
    read_int32(address)
    {
        return this._bufferNum(address,4).getInt32(0);
    }

    read_int8(address)
    {
        return read_mem(address,1);
    }

    read_int16(address)
    {
        return this._bufferNum(address,2).getInt16(0);
    }

    read_int64(address)
    {
        return this._bufferNum(address,8);
    }

    read_pvoid(address)
    {
        return "0x" + address.toString(16);
    }

    read_pvoid_array(address,size)
    {
        const arr = [];
        for(let i =0; i< size;i++)
        {
            arr[i] = address + i * 8;
        }
        return arr;
    }
}

class IMisc{
    constructor(){
        this.name = "interface misc or utilities";
        this.version = 1;
        this.description = "windbg javascript misc operation";
        this.filesystem = host.namespace.Debugger.Utility.FileSystem;
    }
    get toString(){
        return {
            name : this.name,
            version : this.version,
            description : this.description
        }
    }
    writeConsole(msg){
        host.diagnostics.debugLog(msg);
    }
    writeConsoleLine(msg){
        host.diagnostics.debugLog(`${msg}\n`);
    }
    exec(cmd){
        var result = [];
        var obj = host.namespace.Debugger.Utility.Control.ExecuteCommand(cmd);
        // js  of not in
        for(var l of obj){
            result.push(l + "\n");
        }
        return result;
    }
    exec2(cmd){
        return host.namespace.Debugger.Utility.Control.ExecuteCommand(cmd);
    }
}



/*
0x50 bytes
typedef struct _RPC_MESSAGE {
  RPC_BINDING_HANDLE     Handle;
  unsigned long          DataRepresentation;
  void                   *Buffer;
  unsigned int           BufferLength;
  unsigned int           ProcNum;
  PRPC_SYNTAX_IDENTIFIER TransferSyntax;
  void                   *RpcInterfaceInformation;
  void                   *ReservedForRuntime;
  RPC_MGR_EPV            *ManagerEpv;
  void                   *ImportContext;
  unsigned long          RpcFlags;
} RPC_MESSAGE, *PRPC_MESSAGE;

 */
class rpcmessage64{
    constructor(address)
    {
        this.offset = 0;
        this.rpc = new IMemory();
        this.misc = new IMisc();

        this.Handle = this.rpc.read_pvoid(address + this.offset); this.offset += 8;
        this.DataRepresentation = this.rpc.read_pvoid(address + this.offset); this.offset += 8;
        this.Buffer = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.BufferLength = this.rpc.read_int32(address + this.offset);this.offset += 4;
        this.ProcNum = this.rpc.read_int32(address + this.offset);this.offset += 4;
        this.TransferSyntax = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.RpcInterfaceInformation = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.ReservedForRuntime = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.ManagerEpv = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.ImportContext = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.RpcFlags = this.rpc.read_pvoid(address + this.offset);this.offset += 8;
        this.length = this.offset;
        this.offset = 0;
        this.bufferContents = this._autoDeref(this.Buffer,this.BufferLength);
    }
    _autoDeref(obj,len){
        return this.misc.exec2(`db poi ${obj} L${len}`);
    }
}

function show_rpc_message64(address){
    return new rpcmessage64(address);
}

"use strict";

/**
 * 
 */
class IJs{
    constructor(){
        this.name = "interface js";
        this.version = 1;
        this.description = "windbg javascript abstract type";
    }
    get toString(){
        return {
            name : this.name,
            version : this.version,
            description : this.description
        }
    }
}
/**
 * static  read/write operation
 */
class IFileSystem{
    constructor(){
        this.name = "interface file system";
        this.version = 1;
        this.description = "windbg javascript file operation";
        this.filesystem = host.namespace.Debugger.Utility.FileSystem;
    }
    get toString(){
        return {
            name : this.name,
            version : this.version,
            description : this.description
        }
    }
    /*
    https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/dbgmodel-object-text-writer

     */
    writeFile(name,message)
    {
    var file = this.filesystem.CreateFile(name);
    var textWriter = this.filesystem.CreateTextWriter(file);
    textWriter.WriteLine(message);
    file.Close();
    }

    writeFileCollection(name,msgArray,newLine = true)
    {
    var file = this.filesystem.CreateFile(name);
    var textWriter = this.filesystem.CreateTextWriter(file);
    if(newLine){
        textWriter.WriteLineContents(message);
    }else{
        textWriter.WriteContents(message);
    }

    file.Close();
    }

    readFile(name)
    {
    var file = this.filesystem.OpenFile(name);
    var textReader = this.filesystem.CreateTextReader(file);
    for(const fcon of textReader.ReadLineContents()){
        if(fcon.toString().length > 0){
            host.diagnostics.debugLog(`${fcon}\n`);
        }
    }
    file.Close();
    }
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

    read_int32(address)
    {
        var mem = read_mem(address,4);
        var buffer = new ArrayBuffer(4);
        var dataview = new DataView(buffer);
        for(var i =0;i < mem.length;i++)
        {
            dataview.setInt8(i,mem[i],true);
        }
        return dataview.getInt32(0);
    }

    read_int8(address)
    {
        return read_mem(address,1);
    }

    read_int16(address)
    {
        var mem = read_mem(address,2);
        var buffer = new ArrayBuffer(2);
        var dataview = new DataView(buffer);
        for(var i =0;i < mem.length;i++)
        {
            dataview.setInt8(i,mem[i],true);
        }
        return dataview.getInt16(0);
    }

    read_int64(address)
    {
        return read_mem(address,8);
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
}

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

           ];
}

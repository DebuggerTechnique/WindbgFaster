"use strict";
/*
author          : bopin
uodate datetime : 2024-11-02 
*/

function initializeScript()
{
    return [
        new host.functionAlias(__constants,'exttest'),
        new host.functionAlias(test,'test'),
        new host.functionAlias(__listprocess,'lp'),
        new host.functionAlias(__switchto,'swt'),
        new host.functionAlias(__ttd_jump,'ttdseek'),
        new host.functionAlias(usage,'help_windbgex'),
        new host.functionAlias(__load_type,'ldt'),
        new host.functionAlias(__list_types,'lt'),
        new host.functionAlias(__add_vars,'registervars'),
        new host.functionAlias(__unmarshal,'unmarshal'),
        new host.apiVersionSupport(1, 7)
        ];
}

function usage(){
    print("!lp  \t list process \n")
    print("!swt(\"lsass.exe\")         switch to the specified process context only for kernel context\n")
    print("!swt [pid]                 switch to the specified process context only for kernel context\n")
    print("!ttdseek(sequence,step)   !ttdseek(0x1A,0)  \n")
    print("!help_windbgex   print this help usage information\n")
    print("!ldt(filename,module)      load_type  \n")
    print("!lt      list types  \n")
    print("!unmarshal(structname, address) \n")
    print("!registervars   register @$vars\n")
}

class IGlobal{
    constructor(){
        this.ishellexec = host.namespace.Debugger.Utility.Control;
        this.iprint = host.diagnostics;
    }
}


function __listprocess(){
    // var process_iterator = host.namespace.Debugger.Utility.Collections.FromListEntry( pAddrOfPsActiveProcessHead, "nt!_EPROCESS", "ActiveProcessLinks")
    return new IGlobal().ishellexec.ExecuteCommand("dx -g @$cursession.Processes.Select(p => new {Name = p.Name, Threads = p.Threads })")
}

function __ttd_jump(seq,step){
    return new IGlobal().ishellexec.ExecuteCommand(`"dx -s @$create(\"Debugger.Models.TTD.Position\", ${seq}, ${step}).SeekTo()"`);
}

function __add_vars(){
    var ishell = host.namespace.Debugger.Utility.Control;
    
    ishell.ExecuteCommand("dx -r0 @$getsym = (x => Debugger.Utility.Control.ExecuteCommand(\".printf\"%y\", \" + ((__int64)x).ToDisplayString(\"x\"))[0])");

    // https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ps/eprocess/mitigationflags.htm
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_ControlFlowGuardEnabled\",0x1)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_ControlFlowGuardExportSuppressionEnabled\",0x2)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_ControlFlowGuardStrict\",0x4)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_DisallowStrippedImages\",0x8)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_HighEntropyASLREnabled\",0x20)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_StackRandomizationDisabled\",0x40)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_DisableDynamicCode\",0x100)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_DisallowWin32kSystemCalls\",0x1000)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_AuditDisallowWin32kSystemCalls\",0x2000)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations_IsolateSecurityDomain\",0x80000000)");

    // https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ps/eprocess/mitigationflags2.htm
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_EnableExportAddressFilter\",0x1)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_AuditExportAddressFilter\",0x2)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_EnableExportAddressFilterPlus\",0x4)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_AuditExportAddressFilterPlus\",0x8)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_EnableRopStackPivot\",0x10)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_AuditRopStackPivot\",0x20)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_EnableRopCallerCheck\",0x40)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_CetShadowStacks\",0x4000)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_CetUserShadowStacks\",0x4000)");
    ishell.ExecuteCommand("dx @$vars.Add(\"process_mitigations2_AuditCetUserShadowStacks\",0x8000)");
}


function __switchto(process){
    print(`"${process}\t switch successfully\n"`)
    if(typeof process == "string"){
        return host.currentSession.Processes.Where(x => x.Name == process).First().SwitchTo()
    }
    return host.currentSession.Processes.Where(x => x.Id == process).First().SwitchTo()
}
/*

*/
function __load_type(filename,module){
    print(`"dx Debugger.Utility.Analysis.SyntheticTypes.ReadHeader(\"${filename}\",\"${module}\")"`);
    return new IGlobal().ishellexec.ExecuteCommand(`"dx Debugger.Utility.Analysis.SyntheticTypes.ReadHeader(\"${filename}\",\"${module}\")"`);
}

function __unmarshal(structname,address){
    print(`"dx Debugger.Utility.Analysis.SyntheticTypes.CreateInstance(\"${structname}\",${address})"`);
    return new IGlobal().ishellexec.ExecuteCommand(`"dx Debugger.Utility.Analysis.SyntheticTypes.CreateInstance(\"${structname}\",${address})"`);
}

function __list_types(){
    return new IGlobal().ishellexec.ExecuteCommand("dx -g Debugger.Utility.Analysis.SyntheticTypes.TypeTables.Select(x => new { module = x.Module.Name, header = x.Header, types = x.Types.Select(t => t.Name) })")
}

function __constants()
{
    return {
        math_constants :{
            pi :  3.1415926535 ,
            e :  2.7182818284
        },
        description: "pi and e"
    };
}

function print(msg)
{
    host.diagnostics.debugLog(msg);
}

function test()
{
    print('javascript export');
    print('\n')
}
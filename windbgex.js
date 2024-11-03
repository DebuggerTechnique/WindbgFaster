"use strict";
/*
author          : bopin
uodate datetime : 2024-11-02 
*/

function initializeScript()
{
    Usage();

    return [
        new host.functionAlias(__constants,'exttest'),
        new host.functionAlias(test,'test'),
        new host.functionAlias(__listprocess,'lp'),
        new host.functionAlias(__switchto,'swt'),
        new host.functionAlias(__ttd_jump,'ttdseek'),
        new host.apiVersionSupport(1, 7)
        ];
}

function Usage(){
    print("!lp\n")
    print("!switchto(\"lsass.exe\")\n")
    print("!switchto2 [pid]\n")
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
.scriptload SynTypes.js
dx Debugger.Utility.Analysis.SyntheticTypes.ReadHeader("D:\\Desktop\\petools\\windbgExt\\js\\demo-struct.h","ntdll")
dx -r2 Debugger.Utility.Analysis.SyntheticTypes.CreateInstance("_test",@rbx)
*/
function __unmarshal(header,structname,address){

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
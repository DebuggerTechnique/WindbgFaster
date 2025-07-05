"use strict";

function initializeScript() {
    return [
        new host.apiVersionSupport(1, 7),
        new host.functionAlias(show_format_mask, "format_mask")
    ];
}

function show_format_mask(mask) {
    let maskValue = parseInt(mask, 16);
    host.diagnostics.debugLog(`Parsing ACL Mask: 0x${maskValue.toString(16).padStart(8, '0')}\n\n`);

    const ACCESS_RIGHTS = {
        0x80000000: "GENERIC_ALL",
        0x40000000: "GENERIC_EXECUTE",
        0x20000000: "GENERIC_WRITE",
        0x10000000: "GENERIC_READ",
        0x00010000: "WRITE_OWNER",
        0x00020000: "WRITE_DAC",
        0x00040000: "READ_CONTROL",
        0x00080000: "DELETE",
        0x000F0000: "STANDARD_RIGHTS_ALL",
        0x000F01FF: "SPECIFIC_RIGHTS_ALL",
        0x00000100: "ACCESS_SYSTEM_SECURITY",
        0x00000200: "MAXIMUM_ALLOWED",
        0x00000001: "FILE_READ_DATA",
        0x00000002: "FILE_WRITE_DATA",
        0x00000004: "FILE_APPEND_DATA",
        0x00000008: "FILE_READ_EA",
        0x00000010: "FILE_WRITE_EA",
        0x00000020: "FILE_EXECUTE",
        0x00000040: "FILE_DELETE_CHILD",
        0x00000080: "FILE_READ_ATTRIBUTES",
        0x00000100: "FILE_WRITE_ATTRIBUTES"
    };

    let found = false;
    for (let [mask, name] of Object.entries(ACCESS_RIGHTS)) {
        let maskNum = parseInt(mask);
        if ((maskValue & maskNum) === maskNum) {
            host.diagnostics.debugLog(`0x${maskNum.toString(16).padStart(8, '0')}: ${name}\n`);
            found = true;
        }
    }

    if (!found) {
        host.diagnostics.debugLog("No standard rights found in the mask.\n");
    }

    host.diagnostics.debugLog("\nBinary breakdown:\n");
    for (let i = 31; i >= 0; i--) {
        let bit = (maskValue & (1 << i)) ? 1 : 0;
        host.diagnostics.debugLog(bit.toString());
        if (i % 4 === 0) host.diagnostics.debugLog(" ");
    }
    host.diagnostics.debugLog("\n");
}

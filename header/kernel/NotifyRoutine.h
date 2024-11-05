typedef struct _EX_CALLBACK_ROUTINE_BLOCK
{
    _EX_RUNDOWN_REF RundownProtect;
    void* Function;
    void* Context;
} EX_CALLBACK_ROUTINE_BLOCK, *PEX_CALLBACK_ROUTINE_BLOCK;
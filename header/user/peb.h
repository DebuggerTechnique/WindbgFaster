typedef struct _peb
{
    unsigned char InheritedAddressSpace;
    unsigned char ReadImageFileExecOptions;
    unsigned char BeingDebugged;
    union
    {
        unsigned char BitField;
        struct
        {
            unsigned char ImageUsesLargePages : 1;
        };
        
    };
    unsigned int Padding0;
    
} peb, *peb;
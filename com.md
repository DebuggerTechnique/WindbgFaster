# guid

```windbg
0:000> bp combase!CoCreateInstance ".if(1 == 1) {.echo hit CoCreateInstance;dt combase!Guid @rcx gc;}"
0:000> bp combase!CoCreateInstanceEx ".if(1 == 1) {.echo hit CoCreateInstance;dt combase!Guid @rcx gc;}"
```

/*
 * @Author: bopin bopin.me@gmail.com
 * @Date: 2024-11-03 09:13:42
 * @LastEditors: bopin bopin.me@gmail.com
 * @LastEditTime: 2024-11-03 09:13:48
 * @FilePath: \WindbgFaster\header\kernel\NotifyRoutine.h
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
typedef struct _EX_CALLBACK_ROUTINE_BLOCK
{
    _EX_RUNDOWN_REF RundownProtect;
    void* Function;
    void* Context;
} EX_CALLBACK_ROUTINE_BLOCK, *PEX_CALLBACK_ROUTINE_BLOCK;
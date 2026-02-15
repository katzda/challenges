; I need to find out what cmp does
; Compare sets flags as if a subtraction had been carried out. If the value in the accumulator is equal or greater than the compared value, the Carry will be set.

lda #$02
cmp #$01
brk
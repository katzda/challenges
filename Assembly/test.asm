; I need to find out what cmp does
; Compare sets flags as if a subtraction had been carried out. If the value in the accumulator is equal or greater than the compared value, the Carry will be set.

lda #$ff
and #$1F
cmp #$1f
brk
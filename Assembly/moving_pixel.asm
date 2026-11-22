; NON-POINTERS
define ASCII_w      $77
define ASCII_a      $61
define ASCII_s      $73
define ASCII_d      $64
define button_A     $0d
define button_B     $20
define arrowUp      1
define arrowRight   2
define arrowDown    4
define arrowLeft    8

; POINTERS
define sysRandom    $fe
define sysLastKey   $ff

; application
define displayPointer $00       ; 2 bytes needed
define sleepDuration $02
define min $03
define max $04
define displayHighMIN $05
define displayHighMax $06
define tmp $07


jsr initMemory
jsr main
brk

initMemory:
    ldx #$01 ; incrementor 
    lda #$00
    sta min
    lda #$ff
    sta max
    lda #$50
    sta sleepDuration
    lda #$06
    sta displayHighMax
    lda #$01
    sta displayHighMIN
    
    ; display
    lda #$00
    STA displayPointer
    LDA #$02
    STA displayPointer,x    ; increment pointer, store value
    rts

incrementPixel:
    ldy #$00
    lda (displayPointer),y  ; retrieve value from memory
    clc
    adc #$01
    cmp max		    ; compare does A - max; then Set CARRY if A >= M
    bcc skip_reset_pixel    ; branch if carry = 0; A was lower; result was negative
    lda min
    skip_reset_pixel:
    sta (displayPointer),y
    rts

readKeys:
    ldx sysLastKey
    cpx #ASCII_w
    beq upHandler_call
    cpx #ASCII_s
    beq downHandler_call
    cpx #ASCII_d
    beq rightHandler_call
    cpx #ASCII_a
    beq leftHandler_call
    
    rts
    
    downHandler_call:
	jsr downHandler
	jsr clearKeys
	rts
    upHandler_call:
	jsr upHandler
	jsr clearKeys
	rts
    rightHandler_call:
	jsr rightHandler
	jsr clearKeys
	rts
    leftHandler_call:
	jsr leftHandler
	jsr clearKeys
	rts

clearKeys:
    ldx #$00
    stx sysLastKey
    rts


; Display boundaries: 0600 - 0200 = $400 => 1024 dec. Each row is $20 bytes long => 32 dec bytes.
; This means we have 32 x 32 display. 2^8=32. This means take & mask 5x1 => 11111 => 1F on low byte of address 
; to strip left bits. You get values from 1 to 32 representing which column we're on. Any higher bits represent rows, 
; but we just need to detect the first and last so can be hardcoded.
    
upHandler:
    ; check if incrementing will be successful
    ldx #$43
    ldx #$01
    lda displayPointer
    sec
    sbc #$20			    ; 1F is 1 row
    sta tmp			    ; backup LOW
    lda displayPointer,x
    sbc #$00			    ; add carry only
    tax				    ; backup HIGH
    
    cmp displayHighMIN		    ; displayPointer - displayHighMIN; Z: A = M
    beq upHandler_boundary
            
    ; reset original pixel to black
    lda #$00
    ldy #$00
    sta (displayPointer),y
    
    ; move pointer to another location
    lda tmp ; load LOW
    stx tmp ; backup HIGH
    ldx #$01
    sta displayPointer
    lda tmp
    sta displayPointer,x
    upHandler_boundary:
    rts
 
downHandler:
    ; check if I'm on the bottom border, that is high bit is 6
    ldx #$01
    lda displayPointer,x
    and #$06    ; dont care about any other higher bits
    cmp #$06    ; however this allows 1 extra row so we need to
    beq downHandler_boundary
    
    ; reset original pixel to black
    lda #$00
    ldy #$00
    sta (displayPointer),y
    
    ; increment low
    lda displayPointer
    clc
    adc #$20			    ; 1F is 1 row
    sta displayPointer
    
    ; increment high
    ldx #$01
    lda displayPointer,x
    adc #$00			    ; add carry only
    sta displayPointer,x
    
    downHandler_boundary:
    rts
    
rightHandler:
    ; check if I'm on the right border
    lda displayPointer
    and #$1F    ; dont care about any other higher bits
    cmp #$1f    ; only 0011111 value is the right border    
    beq rightHandler_boundary
    
    ; reset original pixel to black
    lda #$00
    ldy #$00
    sta (displayPointer),y
    
    ; increment low
    lda displayPointer
    clc
    adc #$01
    sta displayPointer
    
    ; increment high
    ldx #$01
    lda displayPointer,x
    adc #$00			    ; add carry only
    ldx #$01
    sta displayPointer,x
    
    rightHandler_boundary:
    rts
    

leftHandler:
    ; check if I'm on the right border
    lda displayPointer
    and #$1F    ; dont care about any other higher bits
    cmp #$00    ; only 0000000 value is the left border    
    beq leftHandler_boundary
    
    ; reset original pixel to black
    lda #$00
    ldy #$00
    sta (displayPointer),y
    
    ; increment low
    lda displayPointer
    sec
    sbc #$01
    sta displayPointer
                
    ; increment high
    ldx #$01
    lda displayPointer,x
    sbc #$00			    ; add carry only
    sta displayPointer,x
    
    leftHandler_boundary:
    rts
  
main:
    jsr incrementPixel
    jsr readKeys    
    jsr sleep
    jmp main
 

sleep:
    ldx #$44
    ldx sleepDuration
    do_sleep:
	nop
	nop
	nop
	nop
	nop
	nop
	dex
    bne do_sleep
    rts
  
  
  
  
  
  




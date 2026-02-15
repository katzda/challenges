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
define displayHighMIN $02
define displayHighMax $05
define tmp $06

; Start

jsr initMemory
jsr main
brk

initMemory:
    ldx #$01 ; incrementor 
    lda #$00
    sta min
    lda #$ff
    sta max
    lda #$01
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
    bcc upHandler_boundary
            
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
    ; check if incrementing will be successful
    ldx #$44
    ldx #$01
    lda displayPointer
    clc
    adc #$20			    ; 1F is 1 row
    sta tmp			    ; backup LOW
    lda displayPointer,x
    adc #$00			    ; add carry only
    
    tax				    ; backup HIGH
    
    cmp displayHighMax		    ; displayPointer - displayHighMax; Z: A = M
    bcs downHandler_boundary
            
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
    downHandler_boundary:
    rts
    
rightHandler:
    ; check if incrementing will be successful
    ldx #$45
    ldx #$01
    lda displayPointer
    clc
    adc #$01			    ; 1F is 1 row
    sta tmp			    ; backup LOW
    lda displayPointer,x
    adc #$00			    ; add carry only
    
    tax				    ; backup HIGH
    
    cmp displayHighMax		    ; displayPointer - displayHighMax; Z: A = M
    bcs rightHandler_boundary
            
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
    rightHandler_boundary:
    rts
    

leftHandler:
    ; check if incrementing will be successful
    ldx #$46
    ldx #$01
    lda displayPointer
    sec
    sbc #$01			    ; 1F is 1 row
    sta tmp			    ; backup LOW
    lda displayPointer,x
    sbc #$00			    ; add carry only
    tax				    ; backup HIGH
    
    cmp displayHighMIN		    ; displayPointer - displayHighMIN; Z: A = M
    bcc leftHandler_boundary
            
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
    leftHandler_boundary:
    rts
  
main:
    jsr incrementPixel
    jsr readKeys    
    jmp main
 

pause:
    ldx sleepDuration
    spinloop:
	nop
	nop
	dex
    bne spinloop
    rts
  
  
  
  
  
  




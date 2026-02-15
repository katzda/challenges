;define pos $0200

;LDA #$01
;STA pos

;ldx #$10 ; offset

;adc #01

;sta pos,X ;dereferences to $02f0

; ----------------------------------------------------------------------------------------
; # 1
;LDX #$01
;STA $0200,X ;Store the value of A at memory location $0201

; ----------------------------------------------------------------------------------------
; # 2
;LDY #$ff  ; THE VALUE we want in A register stored in 0705 obscure location
;STY $0705

; Pointers
;LDX #$01 ; increment value

;LDA #$05
;STA $01
;LDA #$07
;STA $02

;LDA ($00,X) ; increment address by X before dereferencing, then create final address from the zero page address

; ----------------------------------------------------------------------------------------
; # 3
;LDY #$01  ; increment value
;LDA #$03
;STA $01
;LDA #$07
;STA $02
;LDX #$0a
;STX $0704
;LDA ($01),Y ; dereference $01: grab two values from $01 and $02, switch them like *$2*$1 (will result in value 0703)
; this dereferenced address is incremented by Y.


; ----------------------------------------------------------------------------------------
; # 4
;define displayPointer $00

;lda #$01
;sta $0205

;LDA #$05
;STA $00
;LDA #$02
;STA $01
;LDA #$00

;ldx #$01
;LDA displayPointer,x ; incremements pointer, then just load the value


; ----------------------------------------------------------------------------------------
; # 5

ldy #$01
LDA displayPointer,y ; WRONG !!!!!!!!!! NEVER DO THIS !!!!!!!!!!


  















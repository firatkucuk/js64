import {Ram} from './ram';

enum Flag {
    Carry            = 0,
    Zero             = 1,
    InterruptDisable = 2,
    DecimalMode      = 3,
    Break            = 4,
    Overflow         = 6,
    Sign             = 7
}

export class Cpu {

    // 8 Bit Registers
    private accumulator: number;
    private registerX: number;
    private registerY: number;
    private stackPointer: number;
    private status: number;

    // 16 Bit Registers (8+8)
    private programCounter: number;

    // Other
    private ram: Ram;

    public constructor(ram: Ram) {

        this.ram = ram;
    }

    public decode(count: number): void {

        const start  = this.programCounter;
        const memory = this.ram.memory;

        while (this.programCounter < start + count) {

            let instruction = memory[this.programCounter++];

            if (instruction === 0x00) { // BRK
            } else if (instruction === 0x01) { // ORA - (Indirect,X)
            } else if (instruction === 0x05) { // ORA - Zero Page
            } else if (instruction === 0x06) { // ASL - Zero Page
            } else if (instruction === 0x08) { // PHP
            } else if (instruction === 0x09) { // ORA - Immediate
            } else if (instruction === 0x0A) { // ASL - Accumulator
            } else if (instruction === 0x0D) { // ORA - Absolute
            } else if (instruction === 0x0E) { // ASL - Absolute
            } else if (instruction === 0x10) { // BPL
            } else if (instruction === 0x11) { // ORA - (Indirect),Y
            } else if (instruction === 0x15) { // ORA - Zero Page,X
            } else if (instruction === 0x16) { // ASL - Zero Page,X
            } else if (instruction === 0x18) { // CLC
                this.status &= 0b11111110;
            } else if (instruction === 0x19) { // ORA - Absolute,Y
            } else if (instruction === 0x1D) { // ORA - Absolute,X
            } else if (instruction === 0x1E) { // ASL - Absolute,X
            } else if (instruction === 0x20) { // JSR
            } else if (instruction === 0x21) { // AND - (Indirect,X)
            } else if (instruction === 0x24) { // BIT - Zero Page
            } else if (instruction === 0x25) { // AND - Zero Page
            } else if (instruction === 0x26) { // ROL - Zero Page
            } else if (instruction === 0x28) { // PLP
            } else if (instruction === 0x29) { // AND - Immediate
            } else if (instruction === 0x2A) { // ROL - Accumulator
            } else if (instruction === 0x2C) { // BIT - Absolute
            } else if (instruction === 0x2D) { // AND - Absolute
            } else if (instruction === 0x2E) { // ROL - Absolute
            } else if (instruction === 0x30) { // BMI
            } else if (instruction === 0x31) { // AND - (Indirect),Y
            } else if (instruction === 0x35) { // AND - Zero Page,X
            } else if (instruction === 0x36) { // ROL - Zero Page,X
            } else if (instruction === 0x38) { // SEC
                this.status |= 0b00000001;
            } else if (instruction === 0x39) { // AND - Absolute,Y
            } else if (instruction === 0x3D) { // AND - Absolute,X
            } else if (instruction === 0x3E) { // ROL - Absolute,X
            } else if (instruction === 0x40) { // RTI
            } else if (instruction === 0x41) { // EOR - (Indirect,X)
            } else if (instruction === 0x45) { // EOR - Zero Page
            } else if (instruction === 0x46) { // LSR - Zero Page
            } else if (instruction === 0x48) { // PHA
            } else if (instruction === 0x49) { // EOR - Immediate
            } else if (instruction === 0x4A) { // LSR - Accumulator
            } else if (instruction === 0x4C) { // JMP - Absolute
            } else if (instruction === 0x4D) { // EOR - Absolute
            } else if (instruction === 0x4E) { // LSR - Absolute
            } else if (instruction === 0x50) { // BVC
            } else if (instruction === 0x51) { // EOR - (Indirect),Y
            } else if (instruction === 0x55) { // EOR - Zero Page,X
            } else if (instruction === 0x56) { // LSR - Zero Page,X
            } else if (instruction === 0x58) { // CLI
                this.status &= 0b11111011;
            } else if (instruction === 0x59) { // EOR - Absolute,Y
            } else if (instruction === 0x50) { // EOR - Absolute,X
            } else if (instruction === 0x5E) { // LSR - Absolute,X
            } else if (instruction === 0x60) { // RTS
            } else if (instruction === 0x61) { // ADC - (Indirect,X)
            } else if (instruction === 0x65) { // ADC - Zero Page
            } else if (instruction === 0x66) { // ROR - Zero Page
            } else if (instruction === 0x68) { // PLA
            } else if (instruction === 0x69) { // ADC - Immediate
                const result = this.accumulator + memory[this.programCounter++] + this.getFlag(Flag.Carry);

                this.setFlags(result);
                this.accumulator = result & 0xFF;
            } else if (instruction === 0x6A) { // ROR - Accumulator
            } else if (instruction === 0x6C) { // JMP - Indirect
            } else if (instruction === 0x6D) { // ADC - Absolute
            } else if (instruction === 0x6E) { // ROR - Absolute
            } else if (instruction === 0x70) { // BVS
            } else if (instruction === 0x71) { // ADC - (Indirect),Y
            } else if (instruction === 0x75) { // ADC - Zero Page,X
            } else if (instruction === 0x76) { // ROR - Zero Page,X
            } else if (instruction === 0x78) { // SEI
                this.status |= 0b00000100;
            } else if (instruction === 0x79) { // ADC - Absolute,Y
            } else if (instruction === 0x70) { // ADC - Absolute,X
            } else if (instruction === 0x7E) { // ROR - Absolute,X
            } else if (instruction === 0x81) { // STA - (Indirect,X)
            } else if (instruction === 0x84) { // STY - Zero Page
            } else if (instruction === 0x85) { // STA - Zero Page
            } else if (instruction === 0x86) { // STX - Zero Page
            } else if (instruction === 0x88) { // DEY
            } else if (instruction === 0x8A) { // TXA
            } else if (instruction === 0x8C) { // STY - Absolute
            } else if (instruction === 0x80) { // STA - Absolute
            } else if (instruction === 0x8E) { // STX - Absolute
            } else if (instruction === 0x90) { // BCC
            } else if (instruction === 0x91) { // STA - (Indirect),Y
            } else if (instruction === 0x94) { // STY - Zero Page,X
            } else if (instruction === 0x95) { // STA - Zero Page,X
            } else if (instruction === 0x96) { // STX - Zero Page,Y
            } else if (instruction === 0x98) { // TYA
            } else if (instruction === 0x99) { // STA - Absolute,Y
            } else if (instruction === 0x9A) { // TXS
            } else if (instruction === 0x90) { // STA - Absolute,X
            } else if (instruction === 0xA0) { // LDY - Immediate
            } else if (instruction === 0xA1) { // LDA - (Indirect,X)
            } else if (instruction === 0xA2) { // LDX - Immediate
            } else if (instruction === 0xA4) { // LDY - Zero Page
            } else if (instruction === 0xA5) { // LDA - Zero Page
            } else if (instruction === 0xA6) { // LDX - Zero Page
            } else if (instruction === 0xA8) { // TAY
            } else if (instruction === 0xA9) { // LDA - Immediate
            } else if (instruction === 0xAA) { // TAX
            } else if (instruction === 0xAC) { // LDY - Absolute
            } else if (instruction === 0xAD) { // LDA - Absolute
            } else if (instruction === 0xAE) { // LDX - Absolute
            } else if (instruction === 0xB0) { // BCS
            } else if (instruction === 0xB1) { // LDA - (Indirect),Y
            } else if (instruction === 0xB4) { // LDY - Zero Page,X
            } else if (instruction === 0xB5) { // LDA - Zero Page,X
            } else if (instruction === 0xB6) { // LDX - Zero Page,Y
            } else if (instruction === 0xB8) { // CLV
                this.status &= 0b10111111;
            } else if (instruction === 0xB9) { // LDA - Absolute,Y
            } else if (instruction === 0xBA) { // TSX
            } else if (instruction === 0xBC) { // LDY - Absolute,X
            } else if (instruction === 0xBD) { // LDA - Absolute,X
            } else if (instruction === 0xBE) { // LDX - Absolute,Y
            } else if (instruction === 0xC0) { // Cpy - Immediate
            } else if (instruction === 0xC1) { // CMP - (Indirect,X)
            } else if (instruction === 0xC4) { // CPY - Zero Page
            } else if (instruction === 0xC5) { // CMP - Zero Page
            } else if (instruction === 0xC6) { // DEC - Zero Page
            } else if (instruction === 0xC8) { // INY
            } else if (instruction === 0xC9) { // CMP - Immediate
            } else if (instruction === 0xCA) { // DEX
            } else if (instruction === 0xCC) { // CPY - Absolute
            } else if (instruction === 0xCD) { // CMP - Absolute
            } else if (instruction === 0xCE) { // DEC - Absolute
            } else if (instruction === 0xD0) { // BNE
            } else if (instruction === 0xD1) { // CMP   (Indirect@,Y
            } else if (instruction === 0xD5) { // CMP - Zero Page,X
            } else if (instruction === 0xD6) { // DEC - Zero Page,X
            } else if (instruction === 0xD8) { // CLD
                this.status &= 0b11110111;
            } else if (instruction === 0xD9) { // CMP - Absolute,Y
            } else if (instruction === 0xDD) { // CMP - Absolute,X
            } else if (instruction === 0xDE) { // DEC - Absolute,X
            } else if (instruction === 0xE0) { // CPX - Immediate
            } else if (instruction === 0xE1) { // SBC - (Indirect,X)
            } else if (instruction === 0xE4) { // CPX - Zero Page
            } else if (instruction === 0xE5) { // SBC - Zero Page
            } else if (instruction === 0xE6) { // INC - Zero Page
            } else if (instruction === 0xE8) { // INX
            } else if (instruction === 0xE9) { // SBC - Immediate
            } else if (instruction === 0xEA) { // NOP
                // Pass
            } else if (instruction === 0xEC) { // CPX - Absolute
            } else if (instruction === 0xED) { // SBC - Absolute
            } else if (instruction === 0xEE) { // INC - Absolute
            } else if (instruction === 0xF0) { // BEQ
            } else if (instruction === 0xF1) { // SBC - (Indirect),Y
            } else if (instruction === 0xF5) { // SBC - Zero Page,X
            } else if (instruction === 0xF6) { // INC - Zero Page,X
            } else if (instruction === 0xF8) { // SED
                this.status |= 0b00001000;
            } else if (instruction === 0xF9) { // SBC - Absolute,Y
            } else if (instruction === 0xFD) { // SBC - Absolute,X
            } else if (instruction === 0xFE) { // INC - Absolute,X
            }
        }
    }

    public load(data: number[]): void {

        this.ram.write(Ram.PAGE2_START, data);
        this.programCounter = Ram.PAGE2_START;

        this.decode(data.length);
    }

    public reset(): void {

        this.accumulator    = 0x00;
        this.programCounter = 0x0000;
        this.registerX      = 0x00;
        this.registerY      = 0x00;
        this.stackPointer   = 0x00;

        //              SVRBDIZC
        this.status = 0b00100000;

        this.ram.reset();
    }

    private getFlag(flag: Flag): number {

        return (this.status >> flag) & 0b00000001;
    }

    private setFlags(result: number): void {

        if (result === 0) {
            this.status |= 0b00000010; // Set zero flag
        } else {

            this.status &= 0b11111101; // Clear zero flag

            if (result > 0xFF) {
                this.status |= 0b00000001; // Set carry flag
                this.status |= 0b01000000; // Set overflow flag
            } else {
                this.status &= 0b11111110; // Clear carry flag
                this.status &= 0b10111111; // Clear overflow flag
            }

            if ((result & 0b10000000) >> 7 == 1) { // if > 0x80
                this.status |= 0b10000000; // Set sign flag
            } else {
                this.status &= 0b01111111; // Set sign flag
            }
        }
    }
}
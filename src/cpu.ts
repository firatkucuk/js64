import {AddressBus} from './adress-bus';

export enum CpuFlag {
    Carry            = 0,
    Zero             = 1,
    InterruptDisable = 2,
    DecimalMode      = 3,
    Break            = 4,
    Overflow         = 6,
    Sign             = 7
}

/**
 * Emulates MOS 6502 compatible CPU
 */
export class Cpu {

    // Fields ----------------------------------------------------------------------------------------------------------

    // 8 Bit Registers
    private _accumulator: number;
    private _registerX: number;
    private _registerY: number;
    private _stackPointer: number;
    private _status: number;

    // 16 Bit Registers (8+8)
    private _programCounter: number;

    // Other
    private _addressBus: AddressBus;
    private _halt: boolean;

    // Constructors ----------------------------------------------------------------------------------------------------

    public constructor(addressBus: AddressBus) {

        this._addressBus = addressBus;
    }

    // Public Methods --------------------------------------------------------------------------------------------------

    public decode(): void {

        while (!this._halt) {

            const opcode = this.consumeByte();

            if (opcode === 0x00) { // BRK
                // BReaK
                //TODO: Better implementation is needed.
                this._halt = true;
            } else if (opcode === 0x01) { // ORA - (Indirect,X)
                // bitwise OR with Accumulator
            } else if (opcode === 0x05) { // ORA - Zero Page
                // bitwise OR with Accumulator

                const zeroPageAddress = this.consumeByte();
                this.accumulator |= this._addressBus.getByte(zeroPageAddress);
                //TODO: flag operation needed.
            } else if (opcode === 0x06) { // ASL - Zero Page
            } else if (opcode === 0x08) { // PHP
            } else if (opcode === 0x09) { // ORA - Immediate
            } else if (opcode === 0x0A) { // ASL - Accumulator
            } else if (opcode === 0x0D) { // ORA - Absolute
            } else if (opcode === 0x0E) { // ASL - Absolute
            } else if (opcode === 0x10) { // BPL
            } else if (opcode === 0x11) { // ORA - (Indirect),Y
            } else if (opcode === 0x15) { // ORA - Zero Page,X
            } else if (opcode === 0x16) { // ASL - Zero Page,X
            } else if (opcode === 0x18) { // CLC
                this._status &= 0b11111110;
            } else if (opcode === 0x19) { // ORA - Absolute,Y
            } else if (opcode === 0x1D) { // ORA - Absolute,X
            } else if (opcode === 0x1E) { // ASL - Absolute,X
            } else if (opcode === 0x20) { // JSR
            } else if (opcode === 0x21) { // AND - (Indirect,X)
            } else if (opcode === 0x24) { // BIT - Zero Page
            } else if (opcode === 0x25) { // AND - Zero Page
            } else if (opcode === 0x26) { // ROL - Zero Page
            } else if (opcode === 0x28) { // PLP
            } else if (opcode === 0x29) { // AND - Immediate
            } else if (opcode === 0x2A) { // ROL - Accumulator
            } else if (opcode === 0x2C) { // BIT - Absolute
            } else if (opcode === 0x2D) { // AND - Absolute
            } else if (opcode === 0x2E) { // ROL - Absolute
            } else if (opcode === 0x30) { // BMI
            } else if (opcode === 0x31) { // AND - (Indirect),Y
            } else if (opcode === 0x35) { // AND - Zero Page,X
            } else if (opcode === 0x36) { // ROL - Zero Page,X
            } else if (opcode === 0x38) { // SEC
                this._status |= 0b00000001;
            } else if (opcode === 0x39) { // AND - Absolute,Y
            } else if (opcode === 0x3D) { // AND - Absolute,X
            } else if (opcode === 0x3E) { // ROL - Absolute,X
            } else if (opcode === 0x40) { // RTI
            } else if (opcode === 0x41) { // EOR - (Indirect,X)
            } else if (opcode === 0x45) { // EOR - Zero Page
            } else if (opcode === 0x46) { // LSR - Zero Page
            } else if (opcode === 0x48) { // PHA
            } else if (opcode === 0x49) { // EOR - Immediate
            } else if (opcode === 0x4A) { // LSR - Accumulator
            } else if (opcode === 0x4C) { // JMP - Absolute
            } else if (opcode === 0x4D) { // EOR - Absolute
            } else if (opcode === 0x4E) { // LSR - Absolute
            } else if (opcode === 0x50) { // BVC
            } else if (opcode === 0x51) { // EOR - (Indirect),Y
            } else if (opcode === 0x55) { // EOR - Zero Page,X
            } else if (opcode === 0x56) { // LSR - Zero Page,X
            } else if (opcode === 0x58) { // CLI
                this._status &= 0b11111011;
            } else if (opcode === 0x59) { // EOR - Absolute,Y
            } else if (opcode === 0x50) { // EOR - Absolute,X
            } else if (opcode === 0x5E) { // LSR - Absolute,X
            } else if (opcode === 0x60) { // RTS
            } else if (opcode === 0x61) { // ADC - (Indirect,X)
            } else if (opcode === 0x65) { // ADC - Zero Page
            } else if (opcode === 0x66) { // ROR - Zero Page
            } else if (opcode === 0x68) { // PLA
            } else if (opcode === 0x69) { // ADC - Immediate
                // TODO: Check for decimal operationss
                const result = this._accumulator + this.consumeByte() + this.getFlag(CpuFlag.Carry);

                this.setFlags(result);
                this._accumulator = result & 0xFF;
            } else if (opcode === 0x6A) { // ROR - Accumulator
            } else if (opcode === 0x6C) { // JMP - Indirect
            } else if (opcode === 0x6D) { // ADC - Absolute
            } else if (opcode === 0x6E) { // ROR - Absolute
            } else if (opcode === 0x70) { // BVS
                //TODO: It must be relative
                // if (this.getFlag(Flag.Overflow) === 1) {
                //     this.programCounter = memory[this.programCounter];
                // }
            } else if (opcode === 0x71) { // ADC - (Indirect),Y
            } else if (opcode === 0x75) { // ADC - Zero Page,X
            } else if (opcode === 0x76) { // ROR - Zero Page,X
            } else if (opcode === 0x78) { // SEI
                this._status |= 0b00000100;
            } else if (opcode === 0x79) { // ADC - Absolute,Y
            } else if (opcode === 0x70) { // ADC - Absolute,X
            } else if (opcode === 0x7E) { // ROR - Absolute,X
            } else if (opcode === 0x81) { // STA - (Indirect,X)
            } else if (opcode === 0x84) { // STY - Zero Page
            } else if (opcode === 0x85) { // STA - Zero Page
            } else if (opcode === 0x86) { // STX - Zero Page
            } else if (opcode === 0x88) { // DEY
            } else if (opcode === 0x8A) { // TXA
            } else if (opcode === 0x8C) { // STY - Absolute
            } else if (opcode === 0x80) { // STA - Absolute
            } else if (opcode === 0x8E) { // STX - Absolute
            } else if (opcode === 0x90) { // BCC
            } else if (opcode === 0x91) { // STA - (Indirect),Y
            } else if (opcode === 0x94) { // STY - Zero Page,X
            } else if (opcode === 0x95) { // STA - Zero Page,X
            } else if (opcode === 0x96) { // STX - Zero Page,Y
            } else if (opcode === 0x98) { // TYA
            } else if (opcode === 0x99) { // STA - Absolute,Y
            } else if (opcode === 0x9A) { // TXS
            } else if (opcode === 0x90) { // STA - Absolute,X
            } else if (opcode === 0xA0) { // LDY - Immediate
            } else if (opcode === 0xA1) { // LDA - (Indirect,X)
            } else if (opcode === 0xA2) { // LDX - Immediate
            } else if (opcode === 0xA4) { // LDY - Zero Page
            } else if (opcode === 0xA5) { // LDA - Zero Page
            } else if (opcode === 0xA6) { // LDX - Zero Page
            } else if (opcode === 0xA8) { // TAY
            } else if (opcode === 0xA9) { // LDA - Immediate
            } else if (opcode === 0xAA) { // TAX
            } else if (opcode === 0xAC) { // LDY - Absolute
            } else if (opcode === 0xAD) { // LDA - Absolute
            } else if (opcode === 0xAE) { // LDX - Absolute
            } else if (opcode === 0xB0) { // BCS
            } else if (opcode === 0xB1) { // LDA - (Indirect),Y
            } else if (opcode === 0xB4) { // LDY - Zero Page,X
            } else if (opcode === 0xB5) { // LDA - Zero Page,X
            } else if (opcode === 0xB6) { // LDX - Zero Page,Y
            } else if (opcode === 0xB8) { // CLV
                this._status &= 0b10111111;
            } else if (opcode === 0xB9) { // LDA - Absolute,Y
            } else if (opcode === 0xBA) { // TSX
            } else if (opcode === 0xBC) { // LDY - Absolute,X
            } else if (opcode === 0xBD) { // LDA - Absolute,X
            } else if (opcode === 0xBE) { // LDX - Absolute,Y
            } else if (opcode === 0xC0) { // Cpy - Immediate
            } else if (opcode === 0xC1) { // CMP - (Indirect,X)
            } else if (opcode === 0xC4) { // CPY - Zero Page
            } else if (opcode === 0xC5) { // CMP - Zero Page
            } else if (opcode === 0xC6) { // DEC - Zero Page
            } else if (opcode === 0xC8) { // INY
            } else if (opcode === 0xC9) { // CMP - Immediate
            } else if (opcode === 0xCA) { // DEX
            } else if (opcode === 0xCC) { // CPY - Absolute
            } else if (opcode === 0xCD) { // CMP - Absolute
            } else if (opcode === 0xCE) { // DEC - Absolute
            } else if (opcode === 0xD0) { // BNE
            } else if (opcode === 0xD1) { // CMP   (Indirect@,Y
            } else if (opcode === 0xD5) { // CMP - Zero Page,X
            } else if (opcode === 0xD6) { // DEC - Zero Page,X
            } else if (opcode === 0xD8) { // CLD
                this._status &= 0b11110111;
            } else if (opcode === 0xD9) { // CMP - Absolute,Y
            } else if (opcode === 0xDD) { // CMP - Absolute,X
            } else if (opcode === 0xDE) { // DEC - Absolute,X
            } else if (opcode === 0xE0) { // CPX - Immediate
            } else if (opcode === 0xE1) { // SBC - (Indirect,X)
            } else if (opcode === 0xE4) { // CPX - Zero Page
            } else if (opcode === 0xE5) { // SBC - Zero Page
            } else if (opcode === 0xE6) { // INC - Zero Page
            } else if (opcode === 0xE8) { // INX
            } else if (opcode === 0xE9) { // SBC - Immediate
            } else if (opcode === 0xEA) { // NOP
                // Pass
            } else if (opcode === 0xEC) { // CPX - Absolute
            } else if (opcode === 0xED) { // SBC - Absolute
            } else if (opcode === 0xEE) { // INC - Absolute
            } else if (opcode === 0xF0) { // BEQ
            } else if (opcode === 0xF1) { // SBC - (Indirect),Y
            } else if (opcode === 0xF5) { // SBC - Zero Page,X
            } else if (opcode === 0xF6) { // INC - Zero Page,X
            } else if (opcode === 0xF8) { // SED
                this._status |= 0b00001000;
            } else if (opcode === 0xF9) { // SBC - Absolute,Y
            } else if (opcode === 0xFD) { // SBC - Absolute,X
            } else if (opcode === 0xFE) { // INC - Absolute,X
            }
        }
    }

    public reset(): void {

        this._accumulator    = 0x00;
        this._programCounter = 0x0000;
        this._registerX      = 0x00;
        this._registerY      = 0x00;
        this._stackPointer   = 0xff;

        //              SVRBDIZC
        this._status = 0b00100000;
        this._halt   = false;

        this.decode();
    }

    // Private Methods -------------------------------------------------------------------------------------------------

    /**
     * Gets byte from memory that program counter shows. Beside this it increments program for reading next byte
     * @returns {number}
     */
    private consumeByte(): number {
        return this._addressBus.getByte(this._programCounter++)
    }

    private getFlag(flag: CpuFlag): number {

        return (this._status >> flag) & 0b00000001;
    }

    private setFlags(result: number): void {

        if (result === 0) {
            this._status |= 0b00000010; // Set zero flag
        } else {

            this._status &= 0b11111101; // Clear zero flag

            if (result > 0xFF) {
                this._status |= 0b00000001; // Set carry flag
                this._status |= 0b01000000; // Set overflow flag
            } else {
                this._status &= 0b11111110; // Clear carry flag
                this._status &= 0b10111111; // Clear overflow flag
            }

            if ((result & 0b10000000) >> 7 == 1) { // if > 0x80
                this._status |= 0b10000000; // Set sign flag
            } else {
                this._status &= 0b01111111; // Set sign flag
            }
        }
    }

    // Accessors -------------------------------------------------------------------------------------------------------

    get accumulator(): number {
        return this._accumulator;
    }

    get registerX(): number {
        return this._registerX;
    }

    get registerY(): number {
        return this._registerY;
    }

    get stackPointer(): number {
        return this._stackPointer;
    }

    get programCounter(): number {
        return this._programCounter;
    }

    get status(): number {
        return this._status;
    }

    set programCounter(value: number) {

        // TODO: this operation must be async
        this._programCounter = value;
        this._halt           = false;
        this.decode();
    }
}
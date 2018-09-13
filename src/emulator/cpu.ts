import {AddressBus} from './adress-bus';
import {Ram} from './ram';

export enum CpuFlag {
    Carry            = 0,
    Zero             = 1,
    InterruptDisable = 2,
    DecimalMode      = 3,
    Break            = 4,
    Overflow         = 6,
    Negative         = 7
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

    private OPCODE_FUNCTION = {

        0x00: function (): void { // BRK : BReaK                                 | -

            // TODO: Better implementation is needed.
            this._halt = true;
        },
        0x01: function (): void { // ORA : bitwise OR with Accumulator           | Indirect,X

            const zeroPageAddress  = this.consumeByte(); // Address is 0x00XX
            const zeroPageXAddress = (zeroPageAddress + this._registerX) & 0xFF;
            const indirectXAddress = this._addressBus.getWord(zeroPageXAddress);

            this.accumulator |= this._addressBus.getByte(indirectXAddress);

            this.updateNegativeFlag(this.accumulator);
            this.updateZeroFlag(this.accumulator);
        },
        0x05: function (): void { // ORA : bitwise OR with Accumulator           | Zero Page

            const zeroPageAddress = this.consumeByte(); // Address is 0x00XX

            this.accumulator |= this._addressBus.getByte(zeroPageAddress);

            this.updateNegativeFlag(this.accumulator);
            this.updateZeroFlag(this.accumulator);
        },
        0x06: function (): void { // ASL : Arithmetic Shift Left                 | Zero Page

            const zeroPageAddress = this.consumeByte(); // Address is 0x00XX
            const referencedValue = this._addressBus.getByte(zeroPageAddress);

            this.updateCarryFlag(referencedValue);

            const shiftedValue = (referencedValue << 1) & 0xFF;

            this._addressBus.setByte(zeroPageAddress, shiftedValue);

            this.updateNegativeFlag(shiftedValue);
            this.updateZeroFlag(shiftedValue);
        },
        0x08: function (): void { // PHP : PusH Processor status                 | -

            this.pushToStack(this._status);
        },
        0x09: function (): void { // ORA : bitwise OR with Accumulator           | Immediate

            this._accumulator |= this.consumeByte(); // Immediate value

            this.updateNegativeFlag(this.accumulator);
            this.updateZeroFlag(this.accumulator);
        },
        0x0A: function (): void { // ASL : Arithmetic Shift Left                 | Accumulator

            this.updateCarryFlag(this._accumulator);

            this._accumulator = (this._accumulator << 1) & 0xFF;

            this.updateNegativeFlag(this._accumulator);
            this.updateZeroFlag(this._accumulator);
        },
        0x0D: function (): void { // ORA : bitwise OR with Accumulator           | Absolute

            const address = this.pullFromStack();

            this._accumulator |= this._addressBus.getByte(address);

            this.updateNegativeFlag(this.accumulator);
            this.updateZeroFlag(this.accumulator);
        },
        0x0E: function (): void { // ASL : Arithmetic Shift Left                 | Absolute

            const absouluteAddress = this.consumeWord();
            const referencedValue  = this._addressBus.getByte(absouluteAddress);

            this.updateCarryFlag(referencedValue);

            const shiftedValue = (referencedValue << 1) & 0xFF;

            this._addressBus.setByte(absouluteAddress, shiftedValue);

            this.updateNegativeFlag(shiftedValue);
            this.updateZeroFlag(shiftedValue);
        },
        0x10: function (): void { // BPL : Branch on PLus                        | -

            if (this.getFlag(CpuFlag.Negative) !== 1) {

            }
        },
        0x11: function (): void { // ORA : bitwise OR with Accumulator           | Indirect,Y
        },
        0x15: function (): void { // ORA : bitwise OR with Accumulator           | Zero Page,X
        },
        0x16: function (): void { // ASL : Arithmetic Shift Left                 | Zero Page,X
        },
        0x18: function (): void { // CLC : CLear Carry                           | -

            this.clearFlag(CpuFlag.Carry);
        },
        0x19: function (): void { // ORA : bitwise OR with Accumulator           | Absolute,Y
        },
        0x1D: function (): void { // ORA : bitwise OR with Accumulator           | Absolute,X
        },
        0x1E: function (): void { // ASL : Arithmetic Shift Left                 | Absolute,X
        },
        0x20: function (): void { // JSR : Jump to SubRoutine                    | -
        },
        0x21: function (): void { // AND : bitwise AND with accumulator          | Indirect,X
        },
        0x24: function (): void { // BIT : test BITs                             | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x25: function (): void { // AND : bitwise AND with accumulator          | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x26: function (): void { // ROL : ROtate Left                           | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x28: function (): void { // PLP : PuLl Processor status                 | -
        },
        0x29: function (): void { // AND : bitwise AND with accumulator          | Immediate
        },
        0x2A: function (): void { // ROL : ROtate Left                           | Accumulator
        },
        0x2C: function (): void { // BIT : test BITs                             | Absolute
        },
        0x2D: function (): void { // AND : bitwise AND with accumulator          | Absolute
        },
        0x2E: function (): void { // ROL : ROtate Left                           | Absolute
        },
        0x30: function (): void { // BMI : Branch on MInus                       | -
        },
        0x31: function (): void { // AND : bitwise AND with accumulator          | Indirect,Y
        },
        0x35: function (): void { // AND : bitwise AND with accumulator          | Zero Page,X
        },
        0x36: function (): void { // ROL : ROtate Left                           | Zero Page,X
        },
        0x38: function (): void { // SEC : SEt Carry                             | -

            this._status |= 0b00000001;
        },
        0x39: function (): void { // AND : bitwise AND with accumulator          | Absolute,Y
        },
        0x3D: function (): void { // AND : bitwise AND with accumulator          | Absolute,X
        },
        0x3E: function (): void { // ROL : ROtate Left                           | Absolute,X
        },
        0x40: function (): void { // RTI : ReTurn from Interrupt                 | -
        },
        0x41: function (): void { // EOR : bitwise Exclusive OR                  | Indirect,X
        },
        0x45: function (): void { // EOR : bitwise Exclusive OR                  | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x46: function (): void { // LSR : Logical Shift Right                   | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x48: function (): void { // PHA : PusH Accumulator                      | -

            this.pushToStack(this._accumulator);
        },
        0x49: function (): void { // EOR : bitwise Exclusive OR                  | Immediate
        },
        0x4A: function (): void { // LSR : Logical Shift Right                   | Accumulator
        },
        0x4C: function (): void { // JMP : JuMP                                  | Absolute
        },
        0x4D: function (): void { // EOR : bitwise Exclusive OR                  | Absolute
        },
        0x4E: function (): void { // LSR : Logical Shift Right                   | Absolute
        },
        0x50: function (): void { // BVC : Branch on oVerflow Clear              | -
        },
        0x51: function (): void { // EOR : bitwise Exclusive OR                  | Indirect,Y
        },
        0x55: function (): void { // EOR : bitwise Exclusive OR                  | Zero Page,X
        },
        0x56: function (): void { // LSR : Logical Shift Right                   | Zero Page,X
        },
        0x58: function (): void { // CLI : CLear Interrupt                       | -

            this._status &= 0b11111011;
        },
        0x59: function (): void { // EOR : bitwise Exclusive OR                  | Absolute,Y
        },
        0x5D: function (): void { // EOR : bitwise Exclusive OR                  | Absolute,X
        },
        0x5E: function (): void { // LSR : Logical Shift Right                   | Absolute,X
        },
        0x60: function (): void { // RTS : ReTurn from Subroutine                | -
        },
        0x61: function (): void { // ADC : ADd with Carry                        | Indirect,X
        },
        0x65: function (): void { // ADC : ADd with Carry                        | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x66: function (): void { // ROR : ROtate Right                          | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x68: function (): void { // PLA : PuLl Accumulator                      | -
        },
        0x69: function (): void { // ADC : ADd with Carry                        | Immediate

            // TODO: Check for decimal operationss
            const result = this._accumulator + this.consumeByte() + this.getFlag(CpuFlag.Carry);

            this.setFlags(result);
            this._accumulator = result & 0xFF;
        },
        0x6A: function (): void { // ROR : ROtate Right                          | Accumulator
        },
        0x6C: function (): void { // JMP : JuMP                                  | Indirect
        },
        0x6D: function (): void { // ADC : ADd with Carry                        | Absolute
        },
        0x6E: function (): void { // ROR : ROtate Right                          | Absolute
        },
        0x70: function (): void { // BVS : Branch on oVerflow Set                | -

            //TODO: It must be relative
            // if (this.getFlag(Flag.Overflow) === 1) {
            //     this.programCounter = memory[this.programCounter];
            // }
        },
        0x71: function (): void { // ADC : ADd with Carry                        | Indirect,Y
        },
        0x75: function (): void { // ADC : ADd with Carry                        | Zero Page,X
        },
        0x76: function (): void { // ROR : ROtate Right                          | Zero Page,X
        },
        0x78: function (): void { // SEI : SEt Interrupt                         | -

            this._status |= 0b00000100;
        },
        0x79: function (): void { // ADC : ADd with Carry                        | Absolute,Y
        },
        0x7D: function (): void { // ADC : ADd with Carry                        | Absolute,X
        },
        0x7E: function (): void { // ROR : ROtate Right                          | Absolute,X
        },
        0x81: function (): void { // STA : STore Accumulator                     | Indirect,X
        },
        0x84: function (): void { // STY : STore Y register                      | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x85: function (): void { // STA : STore Accumulator                     | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x86: function (): void { // STX : STore X register                      | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0x88: function (): void { // DEY : DEcrement Y                           | -
        },
        0x8A: function (): void { // TXA : Transfer X to A                       | -
        },
        0x8C: function (): void { // STY : STore Y register                      | Absolute
        },
        0x80: function (): void { // STA : STore Accumulator                     | Absolute
        },
        0x8E: function (): void { // STX : STore X register                      | Absolute
        },
        0x90: function (): void { // BCC : Branch on Carry Clear                 | -
        },
        0x91: function (): void { // STA : STore Accumulator                     | Indirect,Y
        },
        0x94: function (): void { // STY : STore Y register                      | Zero Page,X
        },
        0x95: function (): void { // STA : STore Accumulator                     | Zero Page,X
        },
        0x96: function (): void { // STX : STore X register                      | Zero Page,Y
        },
        0x98: function (): void { // TYA : Transfer Y to A                       | -
        },
        0x99: function (): void { // STA : STore Accumulator                     | Absolute,Y
        },
        0x9A: function (): void { // TXS : Transfer X to Stack ptr               | -
        },
        0x9D: function (): void { // STA : STore Accumulator                     | Absolute,X
        },
        0xA0: function (): void { // LDY : LoaD Y register                       | Immediate
        },
        0xA1: function (): void { // LDA : LoaD Accumulator                      | Indirect,X
        },
        0xA2: function (): void { // LDX : LoaD X register                       | Immediate
        },
        0xA4: function (): void { // LDY : LoaD Y register                       | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xA5: function (): void { // LDA : LoaD Accumulator                      | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xA6: function (): void { // LDX : LoaD X register                       | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xA8: function (): void { // TAY : Transfer A to Y                       | -
        },
        0xA9: function (): void { // LDA : LoaD Accumulator                      | Immediate
        },
        0xAA: function (): void { // TAX : Transfer A to X                       | -
        },
        0xAC: function (): void { // LDY : LoaD Y register                       | Absolute
        },
        0xAD: function (): void { // LDA : LoaD Accumulator                      | Absolute
        },
        0xAE: function (): void { // LDX : LoaD X register                       | Absolute
        },
        0xB0: function (): void { // BCS : Branch on Carry Set                   | -
        },
        0xB1: function (): void { // LDA : LoaD Accumulator                      | Indirect,Y
        },
        0xB4: function (): void { // LDY : LoaD Y register                       | Zero Page,X
        },
        0xB5: function (): void { // LDA : LoaD Accumulator                      | Zero Page,X
        },
        0xB6: function (): void { // LDX : LoaD X register                       | Zero Page,Y
        },
        0xB8: function (): void { // CLV : CLear oVerflow                        | -

            this._status &= 0b10111111;
        },
        0xB9: function (): void { // LDA : LoaD Accumulator                      | Absolute,Y
        },
        0xBA: function (): void { // TSX : Transfer Stack ptr to X               | -
        },
        0xBC: function (): void { // LDY : LoaD Y register                       | Absolute,X
        },
        0xBD: function (): void { // LDA : LoaD Accumulator                      | Absolute,X
        },
        0xBE: function (): void { // LDX : LoaD X register                       | Absolute,Y
        },
        0xC0: function (): void { // CPY : ComPare Y register                    | Immediate
        },
        0xC1: function (): void { // CMP : CoMPare accumulator                   | Indirect,X
        },
        0xC4: function (): void { // CPY : ComPare Y register                    | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xC5: function (): void { // CMP : CoMPare accumulator                   | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xC6: function (): void { // DEC : DECrement memory                      | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xC8: function (): void { // INY : INcrement Y                           | -
        },
        0xC9: function (): void { // CMP : CoMPare accumulator                   | Immediate
        },
        0xCA: function (): void { // DEX : DEcrement X                           | -
        },
        0xCC: function (): void { // CPY : ComPare Y register                    | Absolute
        },
        0xCD: function (): void { // CMP : CoMPare accumulator                   | Absolute
        },
        0xCE: function (): void { // DEC : DECrement memory                      | Absolute
        },
        0xD0: function (): void { // BNE : Branch on Not Equal                   | -
        },
        0xD1: function (): void { // CMP : CoMPare accumulator                   | Indirect,Y
        },
        0xD5: function (): void { // CMP : CoMPare accumulator                   | Zero Page,X
        },
        0xD6: function (): void { // DEC : DECrement memory                      | Zero Page,X
        },
        0xD8: function (): void { // CLD : CLear Decimal                         | -

            this._status &= 0b11110111;
        },
        0xD9: function (): void { // CMP : CoMPare accumulator                   | Absolute,Y
        },
        0xDD: function (): void { // CMP : CoMPare accumulator                   | Absolute,X
        },
        0xDE: function (): void { // DEC : DECrement memory                      | Absolute,X
        },
        0xE0: function (): void { // CPX : ComPare X register                    | Immediate
        },
        0xE1: function (): void { // SBC : SuBtract with Carry                   | Indirect,X
        },
        0xE4: function (): void { // CPX : ComPare X register                    | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xE5: function (): void { // SBC : SuBtract with Carry                   | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xE6: function (): void { // INC : INCrement memory                      | Zero Page

            const zeroPageAddress = this.consumeByte();
        },
        0xE8: function (): void { // INX : INcrement X                           | -
        },
        0xE9: function (): void { // SBC : SuBtract with Carry                   | Immediate
        },
        0xEA: function (): void { // NOP : No OPeration                          | -

            // Pass
        },
        0xEC: function (): void { // CPX : ComPare X register                    | Absolute
        },
        0xED: function (): void { // SBC : SuBtract with Carry                   | Absolute
        },
        0xEE: function (): void { // INC : INCrement memory                      | Absolute
        },
        0xF0: function (): void { // BEQ : Branch on EQual                       | -
        },
        0xF1: function (): void { // SBC : SuBtract with Carry                   | Indirect,Y
        },
        0xF5: function (): void { // SBC : SuBtract with Carry                   | Zero Page,X
        },
        0xF6: function (): void { // INC : INCrement memory                      | Zero Page,X
        },
        0xF8: function (): void { // SED : SEt Decimal                           | -

            this._status |= 0b00001000;
        },
        0xF9: function (): void { // SBC : SuBtract with Carry                   | Absolute,Y
        },
        0xFD: function (): void { // SBC : SuBtract with Carry                   | Absolute,X
        },
        0xFE: function (): void { // INC : INCrement memory                      | Absolute,X
        }
    };

    // Constructors ----------------------------------------------------------------------------------------------------

    public constructor(addressBus: AddressBus) {

        this._addressBus = addressBus;
    }

    // Public Methods --------------------------------------------------------------------------------------------------

    public decode(): void {

        while (!this._halt) {

            this.OPCODE_FUNCTION[this.consumeByte()]();
        }
    }

    public reset(): void {

        this._accumulator    = 0x00;
        this._programCounter = 0x0000;
        this._registerX      = 0x00;
        this._registerY      = 0x00;
        this._stackPointer   = 0xff;

        //               NVRBDIZC
        this._status = 0b00100000;
        this._halt   = false;

        //this.decode();
    }

    // Private Methods -------------------------------------------------------------------------------------------------

    private clearFlag(flag: CpuFlag): void {

        this._status &= 0b11111111 ^ (0b00000001 << flag);
    }

    /**
     * Gets byte from memory that program counter shows. Beside this it increments program for reading next byte
     * @returns {number}
     */
    private consumeByte(): number {

        return this._addressBus.getByte(this._programCounter++);
    }

    /**
     * Gets word from memory that program counter shows. Beside this it increments program
     * @returns {number}
     */
    private consumeWord(): number {

        const word = this._addressBus.getWord(this._programCounter);

        this._programCounter += 2;

        return word;
    }

    private getFlag(flag: CpuFlag): number {

        return (this._status >> flag) & 0b00000001;
    }

    private isFlagSet(flag: CpuFlag, value: number): boolean {

        return ((value >> flag) & 0b00000001) === 1;
    }

    private pullFromStack(): number {

        const value = this._addressBus.getByte(Ram.STACK_START + this._stackPointer);

        if (this._stackPointer !== 0xFF) {
            this._stackPointer++;
        }

        return value;
    }

    private pushToStack(value): void {

        this._addressBus.setByte(Ram.STACK_START + this._stackPointer, value & 0xFF);

        if (this._stackPointer === 0) {
            // TODO: Instead of exception emulate stackpointer.
            throw new Error("Stack Overflowed!");
        } else {
            this._stackPointer--;
        }
    }

    private setFlag(flag: CpuFlag): void {

        this._status |= (0b00000001 << flag);
    }

    private updateCarryFlag(value: number): void {

        if (this.isFlagSet(CpuFlag.Carry, value)) {
            this.setFlag(CpuFlag.Carry);
        } else {
            this.clearFlag(CpuFlag.Carry);
        }
    }

    private updateNegativeFlag(value: number): void {

        if (this.isFlagSet(CpuFlag.Negative, value)) {
            this.setFlag(CpuFlag.Negative);
        } else {
            this.clearFlag(CpuFlag.Negative);
        }
    }

    private updateZeroFlag(value: number): void {

        if (value === 0) {
            this.setFlag(CpuFlag.Zero);
        } else {
            this.clearFlag(CpuFlag.Zero);
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

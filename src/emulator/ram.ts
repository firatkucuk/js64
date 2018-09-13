import {AddressBus} from './adress-bus';

/**
 * Emulates 64K C64 RAM
 */
export class Ram {

    // Fields ----------------------------------------------------------------------------------------------------------

    public static PAGE0_START = 0x0000;
    public static PAGE0_END   = 0x00FF;
    public static PAGE1_START = 0x0100;
    public static STACK_START = 0x0100;
    public static PAGE1_END   = 0x01FF;
    public static STACK_END   = 0x01FF;
    public static PAGE2_START = 0x0200;
    public static VIDEO_START = 0x0200;
    public static VIDEO_END   = 0x05FF;

    private _memory: number[] = [];
    private _addressBus: AddressBus;

    // Constructors ----------------------------------------------------------------------------------------------------

    public constructor(addressBus: AddressBus) {

        this._addressBus = addressBus;
    }

    // Public Methods --------------------------------------------------------------------------------------------------

    getByte(address: number): number {

        return this._memory[address & 0xFFFF];
    }

    getWord(address: number): number {

        return (this.getByte(address + 1) << 8) + this.getByte(address);
    }

    public reset(): void {

        for (let i = 0; i < 65536; i++) {
            this._memory[i] = 0;
        }
    }

    setByte(address: number, value: number) {

        this._memory[address & 0xFFFF] = value & 0xFF;
    }

    public store(address: number, data: number[]): void {

        for (let i = 0; i < data.length; i++) {
            this._memory[address + i] = data[i];
        }
    }
}
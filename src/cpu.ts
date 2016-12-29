'use strict';

import {Ram} from './ram';
import {InstructionDecoder} from './instruction-decoder';

export class Cpu {

    // Registers
    private accumulator: number;
    private registerX: number;
    private registerY: number;
    private programCounter: number;
    private stackPointer: number;
    private status: number;

    // Other
    private ram: Ram;
    private instructionDecoder: InstructionDecoder;

    public constructor(ram: Ram) {

        this.ram                = ram;
        this.instructionDecoder = new InstructionDecoder(this, ram);
    }

    public reset(): void {

        this.accumulator    = 0;
        this.registerX      = 0;
        this.registerY      = 0;
        this.programCounter = 0;
        this.stackPointer   = 0;

        //              SVRBDIZC
        this.status = 0b00100000;

        this.ram.reset();
    }
}
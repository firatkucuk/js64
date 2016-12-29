'use strict';
import {Cpu} from './cpu';
import {Ram} from './ram';

export class InstructionDecoder {

    private cpu: Cpu;
    private ram: Ram;

    public constructor(cpu: Cpu, ram: Ram) {

        this.cpu = cpu;
        this.ram = ram;
    }
}
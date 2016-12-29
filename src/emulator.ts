import {Cpu} from './cpu';
import {Ram} from './ram';

export class Emulator {

    private cpu: Cpu;
    private ram: Ram;

    public constructor() {

        this.ram = new Ram();
        this.cpu = new Cpu(this.ram);

        this.cpu.reset();
    }

    execute(data: number[]) {

        this.cpu.load(data);
    }
}
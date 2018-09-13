import {AddressBus} from './adress-bus';
import {Cpu} from './cpu';
import {Ram} from './ram';
import {VideoController} from './video-controller';

export class Emulator {

    // Fields ----------------------------------------------------------------------------------------------------------

    private _addressBus: AddressBus;
    private _cpu: Cpu;
    private _ram: Ram;
    private _vic: VideoController;

    // Constructors ----------------------------------------------------------------------------------------------------

    public constructor(container: HTMLDivElement) {

        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 200;

        container.appendChild(canvas);

        this._addressBus = new AddressBus();

        this._cpu = new Cpu(this._addressBus);
        this._ram = new Ram(this._addressBus);
        this._vic = new VideoController(this._addressBus);

        this._addressBus.cpu = this._cpu;
        this._addressBus.ram = this._ram;
        this._addressBus.vic = this._vic;

        this._ram.reset();
        this._vic.reset();
        this._cpu.reset();
    }

    // Public Methods --------------------------------------------------------------------------------------------------

    // /**
    //  * This method is temporary. Direct code execution must not be allowed
    //  * @param data
    //  */
    // execute(data: number[]) {
    //
    //     this._ram.store(Ram.PAGE2_START, data);
    //     this._cpu.programCounter = Ram.PAGE2_START;
    // }

    public start(): void {
        console.log('started 5!');
    }
}

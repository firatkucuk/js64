import {Cpu} from './cpu';
import {Ram} from './ram';
import {VideoController} from './video-controller';

/**
 * This class makes a connection between main emulator components. Components never speaks eachother directly
 */
export class AddressBus {

    // Fields ----------------------------------------------------------------------------------------------------------

    private _cpu: Cpu;
    private _ram: Ram;
    private _vic: VideoController;

    // Public Methods --------------------------------------------------------------------------------------------------

    getByte(address: number): number {

        return this._ram.getByte(address);
    }

    getWord(address: number): number {

        return this._ram.getWord(address);
    }

    setByte(address: number, value: number) {

        this._ram.setByte(address, value);

        if (address >= Ram.VIDEO_START && address <= Ram.VIDEO_END) {
            this._vic.updatePixel(address);
        }
    }

    // Accessors -------------------------------------------------------------------------------------------------------

    set cpu(cpu: Cpu) {
        this._cpu = cpu;
    }

    set ram(ram: Ram) {
        this._ram = ram;
    }

    set vic(vic: VideoController) {
        this._vic = vic;
    }
}
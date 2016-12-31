import {AddressBus} from './adress-bus';

/**
 * Emulates 6567 VIC (Video Interface Chip)
 */
export class VideoController {

    // Fields ----------------------------------------------------------------------------------------------------------

    private _addressBus: AddressBus;

    // Constructors ----------------------------------------------------------------------------------------------------

    public constructor(addressBus: AddressBus) {

        this._addressBus = addressBus;
    }

    // Public Methods --------------------------------------------------------------------------------------------------

    updatePixel(address: number): void {

    }

    reset() {

    }
}
'use strict';

export class Ram {

    private memory: number[];


    reset(): void {

        for (let i = 0; i < 65536; i++) {
            this.memory[i] = 0;
        }
    }
}
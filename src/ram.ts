export class Ram {

    public static PAGE0_START = 0x0000;
    public static PAGE0_END   = 0x00FF;
    public static PAGE1_START = 0x0100;
    public static PAGE1_END   = 0x01FF;
    public static PAGE2_START = 0x0200;

    private _memory: number[] = [];

    get memory(): number[] {

        return this._memory;
    }

    public reset(): void {

        for (let i = 0; i < 65536; i++) {
            this._memory[i] = 0;
        }
    }

    public write(offset: number, data: number[]): void {

        for (let i = 0; i < data.length; i++) {
            this._memory[offset + i] = data[i];
        }
    }
}
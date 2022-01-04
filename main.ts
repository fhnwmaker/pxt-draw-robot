/**
 * Custom blocks
 */
//% weight=100 color=#43bae3 icon="\uf1fc"
namespace drawrobot {
    //%block="draw"
    export function drive(path: () => void) {
        path();
        basic.showIcon(IconNames.Skull);
    }

    //%block="pathelement with $left revolutions left, and $right revolutions right"
    export function move(left: number, right: number) {
        let driveCommand = pins.createBuffer(10);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);
        driveCommand.setNumber(NumberFormat.UInt32LE, 2, left*100);
        driveCommand.setNumber(NumberFormat.UInt32LE, 6, right*100);
        pins.i2cWriteBuffer(
            8,
            driveCommand,
            false
        )
        basic.pause(100);
    }

    //%block="stop move for $sec seconds"
    export function halt(sec: number) {
        let haltCommand = pins.createBuffer(4);
        haltCommand.setNumber(NumberFormat.UInt8LE, 0, 35);
        haltCommand.setNumber(NumberFormat.UInt8LE, 1, 83);
        haltCommand.setNumber(NumberFormat.UInt16LE, 2, sec);
        pins.i2cWriteBuffer(
            8,
            haltCommand,
            false
        )
        basic.pause(100);
    }
}

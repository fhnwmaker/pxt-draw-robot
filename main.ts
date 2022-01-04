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
        const vel = 0; // velocity is not used yet!

        // IMPORTANT: buffer must correspond to application on arduino
        let driveCommand = pins.createBuffer(12);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);
        driveCommand.setNumber(NumberFormat.UInt16LE, 2, vel);
        driveCommand.setNumber(NumberFormat.UInt32LE, 4, left*100);
        driveCommand.setNumber(NumberFormat.UInt32LE, 8, right * 100);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            8,
            driveCommand,
            false
        )
        basic.pause(100);
    }

    //%block="stop move for $sec seconds"
    export function halt(sec: number) {
        // IMPORTANT: buffer must correspond to application on arduino
        let haltCommand = pins.createBuffer(4);
        haltCommand.setNumber(NumberFormat.UInt8LE, 0, 35);
        haltCommand.setNumber(NumberFormat.UInt8LE, 1, 83);
        haltCommand.setNumber(NumberFormat.UInt16LE, 2, sec);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            8,
            haltCommand,
            false
        )
        basic.pause(100);
    }
}

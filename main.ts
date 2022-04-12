/**
 * Custom blocks
 */
//% weight=100 color=#ff8800 icon="\uf1fc"
namespace drawrobot {

    //%block="drive with $left revolutions left, and $right revolutions right"
    export function drive(left: number, right: number) {
        let vel = 0; // not used yet!
        // IMPORTANT: buffer must correspond to application on arduino
        let driveCommand = pins.createBuffer(10);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);
        driveCommand.setNumber(NumberFormat.UInt32LE, 2, right*1000);
        driveCommand.setNumber(NumberFormat.UInt32LE, 6, left*1000);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            8,
            driveCommand,
            false
        )
        while (isRunning()) {
            basic.pause(50);
        }
    }

    function isRunning(): boolean {
        let buffer = pins.createBuffer(1);
        buffer = pins.i2cReadBuffer(8, 1, false);
        let status = buffer.getNumber(NumberFormat.UInt8LE, 0);
        return (status == 1);
    }
}

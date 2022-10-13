enum OnOff {
    //%block="on"
    On = 1,
    //%block="off"
    Off = 0
}

/**
 * Custom blocks
 */
//% weight=100 color=#ff8800 icon="\uf1fc"
namespace drawrobot {
    const I2C_ARDUINO_ADDRESS = 8

    //%block="drive with $left revolutions left, and $right revolutions right"
    export function drive(left: number, right: number) {
        // IMPORTANT: buffer must correspond to application on arduino
        let driveCommand = pins.createBuffer(11);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);  // 77 => M
        driveCommand.setNumber(NumberFormat.UInt8LE, 2, 0);
        driveCommand.setNumber(NumberFormat.UInt32LE, 3, right*1000);
        driveCommand.setNumber(NumberFormat.UInt32LE, 7, left*1000);
        
        // send commend to the arduino with i2c_address=8
        pins.i2cWriteBuffer(
            I2C_ARDUINO_ADDRESS,
            driveCommand,
            false
        )
        basic.pause(20);
        while (isRunning()) {
            basic.pause(20);
        }
    }

    //%block="switch motors to $onoff"
    export function power(onoff: OnOff) {
        // IMPORTANT: buffer must correspond to application on arduino
        let powerCommand = pins.createBuffer(3);
        powerCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        powerCommand.setNumber(NumberFormat.UInt8LE, 1, 80);  // 80 => P
        powerCommand.setNumber(NumberFormat.UInt8LE, 2, onoff);
        
        // send commend to the arduino with i2c_address=8
        pins.i2cWriteBuffer(
            I2C_ARDUINO_ADDRESS,
            powerCommand,
            false
        )
        basic.pause(20);
        while (isRunning()) {
            basic.pause(20);
        }
    }

    function isRunning(): boolean {
        let buffer = pins.createBuffer(1);
        buffer = pins.i2cReadBuffer(I2C_ARDUINO_ADDRESS, 1, false);
        let status = buffer.getNumber(NumberFormat.UInt8LE, 0);
        return (status == 1);
    }
}

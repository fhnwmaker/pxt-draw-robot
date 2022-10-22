enum OnOff {
    //%block="off"
    Off = 0,
    //%block="on"
    On = 1
}

enum Vel {
    //%block="slow"
    Slow = 0,
    //%block="medium"
    Medium = 1,
    //%block="fast"
    Fast = 2
}

enum Accel {
    //%block="low"
    Low = 0,
    //%block="medium"
    Medium = 1,
    //%block="high"
    High = 2
}


/**
 * Custom blocks
 */
//% weight=100 color=#ff8800 icon="\uf1fc"
namespace drawrobot {
    // IMPORTANT: must correspond to the setting on the arduino
    const I2C_ARDUINO_ADDRESS = 8

    function isRunning(): boolean {
        let buffer = pins.createBuffer(1);
        buffer = pins.i2cReadBuffer(I2C_ARDUINO_ADDRESS, 1, false);
        let status = buffer.getNumber(NumberFormat.UInt8LE, 0);
        return (status == 1);
    }

    function wait_until_command_is_finished() {
        // give command some time; download and startup
        basic.pause(50);  
        while (isRunning()) {
            basic.pause(20);
        }
    }

    //%block="drive with $left revolutions left, and $right revolutions right"
    export function drive(left: number, right: number) {
        // IMPORTANT: buffer must correspond to application on the arduino
        let driveCommand = pins.createBuffer(11);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);  // 77 => M
        driveCommand.setNumber(NumberFormat.UInt8LE, 2, 0);
        driveCommand.setNumber(NumberFormat.UInt32LE, 3, right*1000);
        driveCommand.setNumber(NumberFormat.UInt32LE, 7, left*1000);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            I2C_ARDUINO_ADDRESS,
            driveCommand,
            false
        )
        wait_until_command_is_finished();
    }

    //%block="switch motors to $onoff"
    export function power(onoff: OnOff) {
        // IMPORTANT: buffer must correspond to application on arduino
        let powerCommand = pins.createBuffer(3);
        powerCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        powerCommand.setNumber(NumberFormat.UInt8LE, 1, 80);  // 80 => P
        powerCommand.setNumber(NumberFormat.UInt8LE, 2, onoff);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            I2C_ARDUINO_ADDRESS,
            powerCommand,
            false
        )
        wait_until_command_is_finished();
    }

    //%block="set speed to $vel and acceleration to %accel"
    export function setup(vel: Vel, accel: Accel) {
        // IMPORTANT: buffer must correspond to application on arduino
        let setupCommand = pins.createBuffer(3);
        // pack 'vel' and 'accel' into one byte
        let msg = vel << 4;  // left shift 'vel' to the higher order bits
        msg = msg + accel;  // add 'accel'
        setupCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        setupCommand.setNumber(NumberFormat.UInt8LE, 1, 83);  // 83 => S
        setupCommand.setNumber(NumberFormat.UInt8LE, 2, msg);
        
        // send commend to the arduino
        pins.i2cWriteBuffer(
            I2C_ARDUINO_ADDRESS,
            setupCommand,
            false
        )
    }    

}

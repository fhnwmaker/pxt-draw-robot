/**
 * Custom blocks
 */
//% weight=100 color=#43bae3 icon="\uf1fc"
namespace drawrobot {
    // witdth of car in m
    let halveCarWidth = 0.25;
    //max drive Speed in m/s
    let maxSpeed = 0.4;
    //speed of the Chalk 0.2 m/s
    let chalkSpeed = 0.15;
    //left Pull 6.5
    export let leftPull = 3.25;
    //right Pull
    export let rightPull = 0;
    let angleTimeMatcher = 0.4;


    let stop = true;
    let isStraight = false;

    //%block="drive"
    export function drive(path: () => void) {
        radio.setGroup(1);
        path();
        kitronik_motor_driver.motorOff(kitronik_motor_driver.Motors.Motor1)
        kitronik_motor_driver.motorOff(kitronik_motor_driver.Motors.Motor2)
        basic.showIcon(IconNames.Skull);
    }

    //%block="to the left with angle $angle ° and radius $cmradius cm"
    //% angle.min=1 angle.max=360 angle.defl=90
    //% cmradius.min=10 cmradius.max=1000 cmradius.defl=100
    export function left(angle: number, cmradius: number) {
        let radius = cmradius / 100;
        let innerRadius = radius - halveCarWidth;
        let outerRadius = radius + halveCarWidth;
        let outerPath = getPath(outerRadius, angle);
        let innerPath = getPath(innerRadius, angle);
        let chalkpath = getPath(radius, angle);
        let time = driveTime(chalkpath);
        let mChalkpath = getPath(radius, angle * angleTimeMatcher)
        let matchedTime = driveTime(mChalkpath);
        let leftPercent = percentNew(innerPath, time) - leftPull;
        let rightPercent = percentNew(outerPath, time);
        isStraight = false;
        driveCheckStopAndConfig(matchedTime, leftPercent, rightPercent);
    }

    //%block="to the right with angle $angle ° and radius $cmradius cm"
    //% angle.min=1 angle.max=360 angle.defl=90
    //% cmradius.min=10 cmradius.max=1000 cmradius.defl=100
    export function right(angle: number, cmradius: number) {
        let radius2 = cmradius / 100;
        let innerRadius2 = radius2 - halveCarWidth;
        let outerRadius2 = radius2 + halveCarWidth;
        let outerPath2 = getPath(outerRadius2, angle);
        let innerPath2 = getPath(innerRadius2, angle);
        let chalkpath2 = getPath(radius2, angle);
        let time2 = driveTime(chalkpath2);
        let mChalkpath2 = getPath(radius2, angle * angleTimeMatcher)
        let matchedTime2 = driveTime(mChalkpath2);
        let leftPercent2 = percentNew(innerPath2, time2) - leftPull;
        let rightPercent2 = percentNew(outerPath2, time2);
        isStraight = false;
        driveCheckStopAndConfig(matchedTime2, leftPercent2, rightPercent2);
    }

    //%block="straight ahead for $time sec"
    //% time.min=0 time.max=60 time.defl=1
    export function straight(time: number) {
        isStraight = true;
        driveCheckStopAndConfig(time, 100 - leftPull, 100 - rightPull);
    }

    function getPath(radius: number, angle: number): number {
        let circumference = 2 * Math.PI * radius;
        let sector = angle / 360;
        let sectorLength = circumference * sector
        return sectorLength;
    }

    function percentNew(path: number, time: number) {
        let speed = path / time;
        let percent = (speed * 100) / maxSpeed;
        return percent;
    }


    function driveTime(path: number): number {
        let time3 = path / chalkSpeed;
        return time3;
    }

    function driveCheckStopAndConfig(time: number, motor1: number, motor2: number) {
        kitronik_motor_driver.motorOn(kitronik_motor_driver.Motors.Motor1, kitronik_motor_driver.MotorDirection.Forward, motor1)
        kitronik_motor_driver.motorOn(kitronik_motor_driver.Motors.Motor1, kitronik_motor_driver.MotorDirection.Forward, motor2)
        let stopped = false;
        let orgMotor1 = motor1;
        let orgMotor2 = motor2

        radio.onReceivedString(receivedString => {
            if (receivedString == "stop") {
                stop = !stop;
                stopped = true;
            }
        })

        while (time > 0) {
            if (stop) {
                radio.onReceivedString(receivedString => {
                    if (receivedString == "stop") {
                        stop = !stop;
                        stopped = true;
                    }
                    if (receivedString == "left") {
                        motor1 = motor1 - (orgMotor1 * 0.5);
                        motor2 = orgMotor2
                        stopped = true;
                    }
                    if (receivedString == "right") {
                        motor1 = orgMotor2;
                        motor2 = motor2 - (orgMotor2 * 0.5);
                        stopped = true;
                    }
                })
                kitronik_motor_driver.motorOff(kitronik_motor_driver.Motors.Motor1)
                kitronik_motor_driver.motorOff(kitronik_motor_driver.Motors.Motor2)
                basic.pause(250);
                stopped = true;
            } else {
                if (stopped) {
                    kitronik_motor_driver.motorOn(kitronik_motor_driver.Motors.Motor1, kitronik_motor_driver.MotorDirection.Forward, motor2)
                    kitronik_motor_driver.motorOn(kitronik_motor_driver.Motors.Motor1, kitronik_motor_driver.MotorDirection.Forward, motor1)
                    stopped = false;
                }
                if (time < 1) {
                    basic.pause(time * 1000);
                    time = 0;
                }
                else {
                    basic.pause(1000);
                    time = time - 1;
                }
            }
        }
    }
}

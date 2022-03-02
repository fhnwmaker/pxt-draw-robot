# Development HowTo

## Introduction

This app is intended for the [micro:bit platform](https://www.microbit.org/). The micro:bit can be programmed in several ways:

 - Block Editor: see **Blocks** of the [MakeCode Editor](https://makecode.microbit.org/#) 
 - JavaScript: see **JavaScript** of the [MakeCode Editor](https://makecode.microbit.org/#)
 - Micro Pyton: see [Python Editor v1.1](https://python.microbit.org/v/1.1)

The micro:bit development environment for the Blocks and JavaScript Editor is based on the open source project [Microsoft Programming Experience Toolkit (PXT)](https://makecode.com/docs) from Microsoft. It is possible to run this environment locally on your computer.

## Setup the PXT Development Environment

To use the PXT Develpoment Environment you have to install the corrsponding [Command Line Interface](https://makecode.microbit.org/cli). Use the instructions in [LET'S GET STARTED](https://makecode.com/cli) to setup the tool for micro:bit.

## Development

You have to develop own applications within the workspace of the PXT enviroment. In the [Command Line Tool](https://makecode.com/cli) documentation refer to the section **Creating a new project** the create a new project.

## Installation ot the Extension

**WARING**: Do not clone this project into the folder ``projects`` of your PXT environment.

Within folder ``projects`` follow these steps to setup the ```controller``` project:

```script
$ mkdir controller
$ cd controller
$ pxt init
$ rm .gitignore Makefile README.md main.ts pxt.json test.ts tsconfig.json
$ git init
$ git remote add origin git@gitlab.fhnw.ch:makerstudio/paint-robot/controller.git
$ git pull origin master
$ git branch --set-upstream-to=origin/master master
```

**Happy coding!**

Start with Visual Studio Code

```script
$ code .
```

then run app on your micro:bit

```script
$ pxt
```

and within an other terminal type

```script
$ pxt console
```

to see the log messages.


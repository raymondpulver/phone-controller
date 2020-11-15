# phone-controller

Script file and backend to be used with Tasker on Android

Creates a socket.io server on the backend, run bundle.js as a JavaScript task with Tasker, and set to start at boot. This will give you JS repl access to the Tasker JS environment on your device, so you can execute any code remotely.

## Usage

Run yarn start on the server, then you will get a readline prompt

Connections come in and notify the screen, if there is only one client connected it will target that device, otherwise you must run `target name-goes-here`

Type `exit` to leave the dialog where you have targeted a device

You can run `list` in the untargeted context to list all available clients

Once targeted, you can insert executable JS statements and make use of the Tasker JS API as if you were running a prebuilt script

## Author

 Raymond Pulver IV

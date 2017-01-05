# scope

> Scope is a chatroom application for users close to you.


## Installation Guide

#### Start with developing

    npm install -g gulp
    npm install

#### Prepare a cordova build

    npm install -g cordova
    cd cordova && cordova platforms add android --save
    
##### check the requirements before building:

    cordova requirements

> If every dependency of your application is installed, you can continue

##### Make the build
    
    cd ..
    npm run cordova
    
> The build APK will be located at `cordova/platforms/android/build/outputs/apk`

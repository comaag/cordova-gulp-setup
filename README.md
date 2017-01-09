# Gulp combined with Apache Cordova

> This is a simple rocket start setup for an application with Apache Cordova combined with Gulp and browser-sync for development.
Enjoy the force and try it out.

## Installation Guide

#### Start with developing (with browser-sync)

    npm install -g gulp
    npm install
    npm run watch

#### Prepare a cordova build

    npm install -g cordova
    cordova create cordova
    cd cordova && cordova platform add android --save
    
##### check the requirements before building:

    cordova requirements

> If every dependency of your application is installed, you can continue

##### Make the build
    
    cd ..
    npm run cordova
    
> The build APK will be located at `cordova/platforms/android/build/outputs/apk`

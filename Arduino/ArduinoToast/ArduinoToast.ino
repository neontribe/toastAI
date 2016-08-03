/* Sweep
 by BARRAGAN <http://barraganstudio.com>
 This example code is in the public domain.

 modified 8 Nov 2013
 by Scott Fitzgerald
 http://www.arduino.cc/en/Tutorial/Sweep
*/

#include <Servo.h>

Servo Settings;  // create servo object to control a servo
// twelve servo objects can be created on most boards
Servo Lever;
int ToastSettings;
int SettingsInt = 0 ;                 






void setup() {
  Settings.attach(9);  // attaches the servo on pin 9 to the servo object
  Lever.attach(4);
  Lever.write(0);
  Serial.begin(9600); 
}

void loop() {
   if (Serial.available() > 0) {
    int SettingsIntOld = SettingsInt;
    int SettingsInt = Serial.parseInt();
    if (SettingsInt == 0) {
      SettingsInt = SettingsIntOld; 
    }else{
      Settings.write(SettingsInt);
      Serial.println(SettingsInt); 
      delay(1000);
    }
    Lever.write(90);
    delay(1000);
    Lever.write(0);
    delay(1000);
        
   }

  
}


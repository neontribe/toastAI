#include <Servo.h>

Servo Settings;  // create servo object to control a servo
// twelve servo objects can be created on most boards
Servo Lever;
int ToastSettings;
int SettingsInt = 0 ;                 






void setup() {
  Settings.attach(9);  // attaches the servo on pin 9 to the servo object
  Serial.begin(9600);
  while (true){
     int Ready = Serial.parseInt(); 
     if(Ready == 1){
      break;
      }
  
     }
 Serial.println(2);   
    
  
  
  
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
    }
    
        
   }

  
}
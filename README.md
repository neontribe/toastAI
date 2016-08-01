# toastAI

**TOAST (The Over-engineeed AI Super Toaster** aims to:

* Automatically toast bread
* Work out the best settings for any individual
* Remember and recognise a user, storing their preferences

## Potential Strategies

### Automatically toast bread

#### Setting the settings

* Servo motor
* Stepper motor

Servo motors can be controlled more easily and are better suited for turning knobs.

#### Pushing down and releasing

* Massive servo motor that Adam has
* "Linear" "Actuator"
* "Some kind of pulley thing" ~ Adam, 2016

Initially we will try to use the large servo. If this not work, other alternatives will be explored; it is quite hard to anticipate at this stage how successful each method would be without attempting any.

### Work out the best settings for any individual

#### Collecting the data

* Quiz/evaluation
* Automatically evaluate from image, temperature, etc
* Aggregation of profiles
* Physical rating
* Storing past preferences

Initially, the user's default settings would be found by aggregating the profiles (sensible defaults). Our program will remember user's settings from the past. Ideally, we will be able to recommend settings based on past experiences at a time found from quiz responses.

#### Crunching the data

* Machine learning
* Regression
* Persistant settings

Persistant settings will be implemented initially. If machine learning is feasible then we will attempt that, otherwise regression may be simpler and more efficient.

### Remember and recognise a user, storing their preferences

#### Interfacing with the user

* Number pad with buttons/keypad
* Camera
* User's phone

Using a user's phone will give the most control over the interface and requires no additional hardware, as every user would likely be in possession of a smartphone. Potentially we could add a simple fallback system.
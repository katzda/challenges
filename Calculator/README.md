This file shows how I choose to structure code in terms of OOP and SOLID principles.

This calculator is written in a modular way as a component which generates its own html and it is powered by a simple regex.

This may not be very obvious from the fact that its written in vanilla JavaScript but there is an actual inheritance even though I didn't actually set any prototype because there was no need to be honest. I tried having a dedicated function-class but since this would only serve as an interface, the abstract function would have to have an empty body and since there is no real type-safety enforcement, it basically served no real purpose.

You can create a new instance of the Calculator under any div and it will generate its own HTML and if you assign it to a variable, you can interact with it using the command-line.

Preview here: https://katzda.github.io/challenges/

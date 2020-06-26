This file shows how I choose to structure code in terms of OOP and SOLID principles. 

It may not be very obvious but I used a javascript-style inheritance without actually setting prototype because there was no need to be honest. 
I tried it and the parent function would have to be empty and since there is no real type-safety enforcement, it basically served no purpose.

You can create a new instance of the Calculator under any div and it will generate its own HTML and if you assign it to a variable, you can interact with it using the command-line.

Preview here: https://katzda.github.io/challenges/

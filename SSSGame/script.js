function MemoryGame(){
    var table = [];
    this.seedError = false;
    var seedEl = document.getElementById('seed');
    var seedName = 0;
    var seedCountry = 0;
    var seedFruit = 0;
    var seedAnimal = 0;
    var seedSport = 0;
    var step = 0;
    var roundNumber = 0;

    var noChairsEl = document.getElementById('noChairs');
    var UpdateUI_NoChairs = function(){
        noChairsEl.innerText = table.length;
    }

    var roundEl = document.getElementById('round');
    var UpdateUI_Round = function(){
        roundEl.innerText = roundNumber;
    }

    var isVisible = false;
    var tableEl = document.getElementById('table');
    var UpdateUI_TableVisibility = function(){
        tableEl.style.display = isVisible ? 'table' : 'none';
    }

    function UpdateUI_Table() {
        tableEl.innerHTML = ''; // Clear the table before updating

        var tableHeadingEl = document.createElement('tr');
        var tableHeadingNumberEl = document.createElement('th');
        var tableHeadingNameEl = document.createElement('th');
        var tableHeadingCountryEl = document.createElement('th');
        var tableHeadingFruitEl = document.createElement('th');
        var tableHeadingAnimalEl = document.createElement('th');
        var tableHeadingSportEl = document.createElement('th');
        var tableHeadingNextSeatPointerEl = document.createElement('th');

        tableHeadingNumberEl.classList.add('table-cell');
        tableHeadingNameEl.classList.add('table-cell');
        tableHeadingCountryEl.classList.add('table-cell');
        tableHeadingFruitEl.classList.add('table-cell');
        tableHeadingAnimalEl.classList.add('table-cell');
        tableHeadingSportEl.classList.add('table-cell');
        tableHeadingNextSeatPointerEl.classList.add('table-cell');

        tableHeadingNumberEl.innerText = '#';
        tableHeadingNameEl.innerText = 'Name';
        tableHeadingCountryEl.innerText = 'Country';
        tableHeadingFruitEl.innerText = 'Fruit';
        tableHeadingAnimalEl.innerText = 'Animal';
        tableHeadingSportEl.innerText = 'Sport';
        tableHeadingNextSeatPointerEl.innerText = 'Next Seat Pointer';

        tableHeadingEl.appendChild(tableHeadingNumberEl);
        tableHeadingEl.appendChild(tableHeadingNameEl);
        tableHeadingEl.appendChild(tableHeadingCountryEl);
        tableHeadingEl.appendChild(tableHeadingFruitEl);
        tableHeadingEl.appendChild(tableHeadingAnimalEl);
        tableHeadingEl.appendChild(tableHeadingSportEl);
        tableHeadingEl.appendChild(tableHeadingNextSeatPointerEl);

        tableEl.appendChild(tableHeadingEl);

        for (var i = 0; i < table.length; i++) {
            var person = table[i];

            var tableCellNumberEl = document.createElement('td');
            var tableCellNameEl = document.createElement('td');
            var tableCellCountryEl = document.createElement('td');
            var tableCellFruitEl = document.createElement('td');
            var tableCellAnimalEl = document.createElement('td');
            var tableCellSportEl = document.createElement('td');
            var tableRowEl = document.createElement('tr');
            var tableCellPointer = document.createElement('td');

            if(i == nextFreeSeat){
                tableCellPointer.innerText = '<---';
            }

            if (person !== null) {
                tableCellNameEl.innerText = person['name'];
                tableCellCountryEl.innerText = person['country'];
                tableCellFruitEl.innerText = person['fruit'];
                tableCellAnimalEl.innerText = person['animal'];
                tableCellSportEl.innerText = person['sport'];
            }else{
                tableCellNameEl.innerText = '-';
                tableCellCountryEl.innerText = '-';
                tableCellFruitEl.innerText = '-';
                tableCellAnimalEl.innerText = '-';
                tableCellSportEl.innerText = '-';
            }

            tableCellNumberEl.innerText = i+1;

            tableRowEl.appendChild(tableCellNumberEl);
            tableRowEl.appendChild(tableCellNameEl);
            tableRowEl.appendChild(tableCellCountryEl);
            tableRowEl.appendChild(tableCellFruitEl);
            tableRowEl.appendChild(tableCellAnimalEl);
            tableRowEl.appendChild(tableCellSportEl);
            tableRowEl.appendChild(tableCellPointer);

            tableRowEl.classList.add('table-row');

            tableCellNumberEl.classList.add('table-cell');
            tableCellNameEl.classList.add('table-cell');
            tableCellCountryEl.classList.add('table-cell');
            tableCellFruitEl.classList.add('table-cell');
            tableCellAnimalEl.classList.add('table-cell');
            tableCellSportEl.classList.add('table-cell');
            tableCellPointer.classList.add('table-cell');

            tableEl.appendChild(tableRowEl);
        }
        tableEl.classList.add('table');
        tableEl.classList.add('w-full');
    }

    function UpdateUI(){
        UpdateUI_NoChairs();
        UpdateUI_Table();
        UpdateUI_Error();
        UpdateUI_Round();
        UpdateUI_TableVisibility();
    }

    var seedErrorEl = document.getElementById('seedErrorMessage');
    var nameEl = document.getElementById('name');
    var sportEl = document.getElementById('sport');
    var fruitEl = document.getElementById('fruit');
    var countryEl = document.getElementById('country');
    var animalEl = document.getElementById('animal');

    var names = ['Jack','Emma','Liam','Olivia','Noah','Ava','Lucas','Sophia','Ethan','Isabella','Mason','Mia','Logan','Charlotte','Jacob','Amelia','Aiden','Nicole','Benjamin','Evelyn','William','Abigail','James','Emily','Oliver','Elizabeth','Elijah','Avery','Alexander','Sofia','Michael','Ella','Daniel','Scarlett','Henry','Grace','Jackson','Chloe','Sebastian','Lily','Matthew','Addison','Samuel','Natalie','David','Victoria','Joseph','Zoey','Carter','Penelope','Gabriel','Layla','Luke','Riley','Anthony','Aubrey','Isaac','Nora','Dylan','Skylar','Wyatt','Hannah','Andrew','Zoey','Joshua','Brooklyn','Christopher','Savannah','Grayson','Audrey','Nathan','Leah','Eli','Claire','Samuel','Stella','Owen','Agnes','Connor','Ellie','Landon','Maya','Ryan','Violet','Isaiah','Aria','Christian','Aurora','Hunter','Sarah','Cameron','Caroline','Thomas','Naomi','Charles','Anna','Julian','Samantha','Aaron','Eliana'];
    var sports = ['Football','Basketball','American Football','Baseball','Tennis','Golf','Rugby','Cricket','Volleyball','Table Tennis','Badminton','Hockey','Swimming','Running','Boxing','Martial Arts','Wrestling','Gymnastics','Cycling','Surfing','Skateboarding','Snowboarding','Skiing','Weightlifting','Archery','Shooting','Fencing','Diving','Sailing','Rowing','Canoeing/Kayaking','Equestrian','Triathlon','Triathlon','Pole Vault','High Jump','Long Jump','Javelin Throw','Hammer Throw','Discus Throw','Decathlon/Heptathlon','Bobsleigh','Bungee Jumping','Rock Climbing','Mountaineering','Paragliding','Kite Surfing','Windsurfing','Handball','Lacrosse'];
    var fruits = ['Apple','Orange','Banana','Pear','Strawberry','Grape','Blueberry','Raspberry','Pineapple','Watermelon','Kiwi','Mango','Papaya','Peach','Cherry','Plum','Lemon','Lime','Avocado','Fig','Cranberry','Blackberry','Cantaloupe','Honeydew melon','Grapefruit','Pomegranate','Coconut','Passion fruit','Lychee','Dragon fruit','Guava','Persimmon','Tangerine','Nectarine','Apricot','Jackfruit','Star fruit','Elderberry','Raspberry','Boysenberry','Mulberry','Gooseberry','Ackee','Plantain','Date','Quince','Rambutan','Longan','Durian','Kiwano'];
    var countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein'];
    var animals = ['Dog','Cat','Elephant','Lion','Tiger','Giraffe','Zebra','Hippopotamus','Rhinoceros','Gorilla','Chimpanzee','Bear','Panda','Koala','Kangaroo','Cheetah','Jaguar','Leopard','Wolf','Fox','Deer','Moose','Elk','Bison','Yak','Camel','Alpaca','Llama','Horse','Donkey','Mule','Goat','Sheep','Cow','Bull','Pig','Boar','Warthog','Rhinoceros','Hyena','Wildebeest','Antelope','Gazelle','Ostrich','Emu','Flamingo','Penguin','Toucan','Parrot','Eagle','Hawk','Falcon','Owl','Pelican','Seagull','Swan','Duck','Goose','Chicken','Rooster','Pigeon','Sparrow','Hummingbird','Crow','Magpie','Blue Jay','Cardinal','Robin','Goldfish','Clownfish','Angelfish','Betta fish','Swordfish','Shark','Dolphin','Whale','Seal','Sea lion','Walrus','Otter','Beaver','Platypus','Crocodile','Alligator','Turtle','Tortoise','Snake','Lizard','Gecko','Iguana','Chameleon','Frog','Toad','Salamander','Newt','Tarantula','Scorpion','Spider','Centipede','Millipede'];

    function getRandomElement(arr, seed) {
        let x = predictableRandom(seed);
        return arr[Math.floor(x * arr.length)];
    }

    function predictableRandom(seed) {
      return Math.abs(Math.sin((seed+step)/10));
    }

    function Generate() {
        return {
            "name": getRandomElement(names, seedName),
            "sport": getRandomElement(sports, seedSport),
            "fruit": getRandomElement(fruits, seedFruit),
            "country": getRandomElement(countries, seedCountry),
            "animal": getRandomElement(animals, seedAnimal)
        };
    }

    function UpdateUI_Person(person){
        nameEl.innerText = person['name'] ?? "";
        countryEl.innerText = person['country'] ?? "";
        fruitEl.innerText = person['fruit'] ?? "";
        animalEl.innerText = person['animal'] ?? "";
        sportEl.innerText = person['sport'] ?? "";
    }

    function UpdateUI_Error(){
        seedErrorEl.style.display = this.seedError ? "inline" : "none";
    }

    var nextFreeSeat = 0;
    function Remember(person){
        table[nextFreeSeat] = person;
        nextFreeSeat = nextFreeSeat < table.length-1 ? nextFreeSeat + 1 : 0;
    }

    function isSeedInvalid(){
      return seedEl.value != "" && seedEl.value.length < 6;
    }

    this.next = function(){
        if(isSeedInvalid()){
            return;
        }
        step+=6;
        roundNumber++;
        var person = Generate();
        Remember(person);
        UpdateUI_Person(person);
        UpdateUI();
    }

    this.addChair = function(){
        table[table.length] = null;
        if(table[nextFreeSeat] != null){
            nextFreeSeat = table.length - 1;
        }
        UpdateUI();
    }

    this.removeChair = function(){
        table.length -= 1;
        if(nextFreeSeat = table.length){
            nextFreeSeat = 0;
        }
        UpdateUI();
    }

    var gameMaxSeed = 100000000;
    function NewGame(){
        this.seedError = isSeedInvalid();

        if(this.seedError){
            UpdateUI();
            return;
        }

        table.length = 1;
        step=0;
        roundNumber = 0;

        table = [];
        for(var i=0; i<table.length; i++){
            table[i] = null;
        }

        if(seedEl.value == ""){
            seedEl.value = Math.floor(Math.random() * gameMaxSeed);
        }

        seedName = seedEl.value.substr(0,1);
        seedCountry = seedEl.value.substr(1,2);
        seedFruit = seedEl.value.substr(2,3);
        seedAnimal = seedEl.value.substr(3,4);
        seedSport = seedEl.value.substr(4,5);

        UpdateUI_Person([]);
        UpdateUI();
    }

    this.toggleVisibility = function(){
        isVisible = !isVisible;
        UpdateUI();
    }

    NewGame();

    this.setSeed = function(){
        seed = seedEl.value;
        NewGame();
    }
}

var game = new MemoryGame();

document.getElementById('generateButton').addEventListener('click', game.next);
document.getElementById('addChair').addEventListener('click', game.addChair);
document.getElementById('removeChair').addEventListener('click', game.removeChair);
document.getElementById('setSeed').addEventListener('click', game.setSeed);
document.getElementById('toggleVisibility').addEventListener('click', game.toggleVisibility);

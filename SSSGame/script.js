function MemoryGame(noChairs = 1){
    var table = [];

    function InitializeTable(){
        table = [];
        for(var i=0; i<noChairs; i++){
            table[i] = null;
        }
    }
    InitializeTable();

    var tableEl = document.getElementById('table');
    var personEl = document.getElementById('person');

    var nameEl = document.getElementById('name');
    var sportEl = document.getElementById('sport');
    var fruitEl = document.getElementById('fruit');
    var countryEl = document.getElementById('country');
    var animalEl = document.getElementById('animal');

    var names = ['Jack','Emma','Liam','Olivia','Noah','Ava','Lucas','Sophia','Ethan','Isabella','Mason','Mia','Logan','Charlotte','Jacob','Amelia','Aiden','Nicole','Benjamin','Evelyn','William','Abigail','James','Emily','Oliver','Elizabeth','Elijah','Avery','Alexander','Sofia','Michael','Ella','Daniel','Scarlett','Henry','Grace','Jackson','Chloe','Sebastian','Lily','Matthew','Addison','Samuel','Natalie','David','Victoria','Joseph','Zoey','Carter','Penelope','Gabriel','Layla','Luke','Riley','Anthony','Aubrey','Isaac','Nora','Dylan','Skylar','Wyatt','Hannah','Andrew','Zoey','Joshua','Brooklyn','Christopher','Savannah','Grayson','Audrey','Nathan','Leah','Eli','Claire','Samuel','Stella','Owen','Paisley','Connor','Ellie','Landon','Maya','Ryan','Violet','Isaiah','Aria','Christian','Aurora','Hunter','Sarah','Cameron','Caroline','Thomas','Naomi','Charles','Anna','Julian','Samantha','Aaron','Eliana'];
    var sports = ['Football','Basketball','American Football','Baseball','Tennis','Golf','Rugby','Cricket','Volleyball','Table Tennis','Badminton','Hockey','Swimming','Running','Boxing','Martial Arts','Wrestling','Gymnastics','Cycling','Surfing','Skateboarding','Snowboarding','Skiing','Weightlifting','Archery','Shooting','Fencing','Diving','Sailing','Rowing','Canoeing/Kayaking','Equestrian','Triathlon','Triathlon','Pole Vault','High Jump','Long Jump','Javelin Throw','Hammer Throw','Discus Throw','Decathlon/Heptathlon','Bobsleigh','Bungee Jumping','Rock Climbing','Mountaineering','Paragliding','Kite Surfing','Windsurfing','Handball','Lacrosse'];
    var fruits = ['Apple','Orange','Banana','Pear','Strawberry','Grape','Blueberry','Raspberry','Pineapple','Watermelon','Kiwi','Mango','Papaya','Peach','Cherry','Plum','Lemon','Lime','Avocado','Fig','Cranberry','Blackberry','Cantaloupe','Honeydew melon','Grapefruit','Pomegranate','Coconut','Passion fruit','Lychee','Dragon fruit','Guava','Persimmon','Tangerine','Nectarine','Apricot','Jackfruit','Star fruit','Elderberry','Raspberry','Boysenberry','Mulberry','Gooseberry','Ackee','Plantain','Date','Quince','Rambutan','Longan','Durian','Kiwano'];
    var countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein'];
    var animals = ['Dog','Cat','Elephant','Lion','Tiger','Giraffe','Zebra','Hippopotamus','Rhinoceros','Gorilla','Chimpanzee','Bear','Panda','Koala','Kangaroo','Cheetah','Jaguar','Leopard','Wolf','Fox','Deer','Moose','Elk','Bison','Yak','Camel','Alpaca','Llama','Horse','Donkey','Mule','Goat','Sheep','Cow','Bull','Pig','Boar','Warthog','Rhinoceros','Hyena','Wildebeest','Antelope','Gazelle','Ostrich','Emu','Flamingo','Penguin','Toucan','Parrot','Eagle','Hawk','Falcon','Owl','Pelican','Seagull','Swan','Duck','Goose','Chicken','Rooster','Pigeon','Sparrow','Hummingbird','Crow','Magpie','Blue Jay','Cardinal','Robin','Goldfish','Clownfish','Angelfish','Betta fish','Swordfish','Shark','Dolphin','Whale','Seal','Sea lion','Walrus','Otter','Beaver','Platypus','Crocodile','Alligator','Turtle','Tortoise','Snake','Lizard','Gecko','Iguana','Chameleon','Frog','Toad','Salamander','Newt','Tarantula','Scorpion','Spider','Centipede','Millipede'];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function Generate() {
        return {
            "name": getRandomElement(names),
            "sport": getRandomElement(sports),
            "fruit": getRandomElement(fruits),
            "country": getRandomElement(countries),
            "animal": getRandomElement(animals)
        };
    }

    function UpdateUI_Person(person){
        nameEl.innerText = person['name'];
        countryEl.innerText = person['country'];
        fruitEl.innerText = person['fruit'];
        animalEl.innerText = person['animal'];
        sportEl.innerText = person['sport'];
    }

    function UpdateUI_Table() {
        tableEl.innerHTML = ''; // Clear the table before updating

        for (var i = 0; i < table.length; i++) {
            var person = table[i];
            var personDiv = document.createElement('div');

            if (person !== null) {
                personDiv.innerText =
                    person['name'] + '|' +
                    person['country'] + '|' +
                    person['fruit'] + '|' +
                    person['animal'] + '|' +
                    person['sport'];
            } else {
                personDiv.innerText = '-';
            }

            tableEl.appendChild(personDiv);
        }
    }

    var nextFreeSeat = 0;
    function Remember(person){
        table[nextFreeSeat] = person;
        nextFreeSeat = nextFreeSeat < table.length-1 ? nextFreeSeat + 1 : 0;
    }

    this.next = function(){
        var person = Generate();
        UpdateUI_Person(person);
        Remember(person);
        UpdateUI_Table();
    }

    this.addChair = function(){
        table[table.length] = null;
        nextFreeSeat = table.length - 1;
    }
}

var game = new MemoryGame();

document.getElementById('generateButton').addEventListener('click', game.next);

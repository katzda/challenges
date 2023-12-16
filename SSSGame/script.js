function MemoryGame() {

    let table = [];

    let noChairsEl = document.getElementById('noChairs');
    let UpdateUI_NoChairs = function () {
        noChairsEl.innerText = table.length;
    }

    let roundEl = document.getElementById('round');
    let roundNumber = 0;
    let UpdateUI_Round = function () {
        roundEl.innerText = roundNumber;
    }

    let isVisible = false;
    let tableEl = document.getElementById('table');
    let UpdateUI_TableVisibility = function () {
        tableEl.style.display = isVisible ? 'table' : 'none';
    }

    let toggleCountryEl = document.getElementById('toggleCountry');
    let toggleFruitEl = document.getElementById('toggleFruit');
    let toggleAnimalEl = document.getElementById('toggleAnimal');
    let toggleSportEl = document.getElementById('toggleSport');

    function UpdateUI_Table() {
        tableEl.innerHTML = ''; // Clear the table before updating

        let tableHeadingEl = document.createElement('tr');
        let tableHeadingNumberEl = document.createElement('th');
        let tableHeadingNameEl = document.createElement('th');
        let tableHeadingCountryEl = document.createElement('th');
        let tableHeadingFruitEl = document.createElement('th');
        let tableHeadingAnimalEl = document.createElement('th');
        let tableHeadingSportEl = document.createElement('th');
        let tableHeadingNextSeatPointerEl = document.createElement('th');

        tableHeadingNumberEl.classList.add('table-cell');
        tableHeadingNameEl.classList.add('table-cell');
        tableHeadingCountryEl.classList.add('table-cell', 'country');
        tableHeadingFruitEl.classList.add('table-cell', 'fruit');
        tableHeadingAnimalEl.classList.add('table-cell', 'animal');
        tableHeadingSportEl.classList.add('table-cell', 'sport');

        tableHeadingCountryEl.style.display = toggleCountryEl.checked ? '' : 'none';
        tableHeadingFruitEl.style.display = toggleFruitEl.checked ? '' : 'none';
        tableHeadingAnimalEl.style.display = toggleAnimalEl.checked ? '' : 'none';
        tableHeadingSportEl.style.display = toggleSportEl.checked ? '' : 'none';

        tableHeadingNextSeatPointerEl.classList.add('table-cell', 'text-left');

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

        for (let i = 0; i < table.length; i++) {
            let person = table[i];

            let tableCellNumberEl = document.createElement('td');
            let tableCellNameEl = document.createElement('td');
            let tableCellCountryEl = document.createElement('td');
            let tableCellFruitEl = document.createElement('td');
            let tableCellAnimalEl = document.createElement('td');
            let tableCellSportEl = document.createElement('td');
            let tableRowEl = document.createElement('tr');
            let tableCellPointer = document.createElement('td');

            if (i == nextFreeSeat) {
                tableCellPointer.innerText = '<---';
            }

            if (person !== null) {
                tableCellNameEl.innerText = person['name'];
                tableCellCountryEl.innerText = person['country'];
                tableCellFruitEl.innerText = person['fruit'];
                tableCellAnimalEl.innerText = person['animal'];
                tableCellSportEl.innerText = person['sport'];
            } else {
                tableCellNameEl.innerText = '-';
                tableCellCountryEl.innerText = '-';
                tableCellFruitEl.innerText = '-';
                tableCellAnimalEl.innerText = '-';
                tableCellSportEl.innerText = '-';
            }

            tableCellNumberEl.innerText = i + 1;

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
            tableCellCountryEl.classList.add('table-cell', 'country');
            tableCellFruitEl.classList.add('table-cell', 'fruit');
            tableCellAnimalEl.classList.add('table-cell', 'animal');
            tableCellSportEl.classList.add('table-cell', 'sport');
            tableCellPointer.classList.add('table-cell', 'text-left');

            tableCellCountryEl.style.display = toggleCountryEl.checked ? '' : 'none';
            tableCellFruitEl.style.display = toggleFruitEl.checked ? '' : 'none';
            tableCellAnimalEl.style.display = toggleAnimalEl.checked ? '' : 'none';
            tableCellSportEl.style.display = toggleSportEl.checked ? '' : 'none';

            tableEl.appendChild(tableRowEl);
        }
        tableEl.classList.add('table');
        tableEl.classList.add('w-full');
    }

    function UpdateUI() {
        UpdateUI_NoChairs();
        UpdateUI_Table();
        UpdateUI_TableVisibility();
        UpdateUI_Round();
    }

    let vocab = {
        'name': ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Sandra','Mark','Margaret','Donald','Ashley','Steven','Kimberly','Andrew','Emily','Paul','Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Melissa','George','Deborah','Timothy','Stephanie','Ronald','Dorothy','Jason','Rebecca','Edward','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Amy','Gary','Kathleen','Nicholas','Angela','Eric','Shirley','Jonathan','Brenda','Stephen','Emma','Larry','Anna','Justin','Pamela','Scott','Nicole','Brandon','Samantha','Benjamin','Katherine','Samuel','Christine','Gregory','Helen','Alexander','Debra','Patrick','Rachel','Frank','Carolyn','Raymond','Janet','Jack','Maria','Dennis','Catherine','Jerry','Heather','Tyler','Diane','Aaron','Olivia','Jose','Julie','Adam','Joyce','Nathan','Victoria','Henry','Ruth','Zachary','Virginia','Douglas','Lauren','Peter','Kelly','Kyle','Christina','Noah','Joan','Ethan','Evelyn','Jeremy','Judith','Walter','Andrea','Christian','Hannah','Keith','Megan','Roger','Cheryl','Terry','Jacqueline','Austin','Martha','Sean','Madison','Gerald','Teresa','Carl','Gloria','Harold','Sara','Dylan','Janice','Arthur','Ann','Lawrence','Kathryn','Jordan','Abigail','Jesse','Sophia','Bryan','Frances','Billy','Jean','Bruce','Alice','Gabriel','Judy','Joe','Isabella','Logan','Julia','Alan','Grace','Juan','Amber','Albert','Denise','Willie','Danielle','Elijah','Marilyn','Wayne','Beverly','Randy','Charlotte','Vincent','Natalie','Mason','Theresa','Roy','Diana','Ralph','Brittany','Bobby','Doris','Russell','Kayla','Bradley','Alexis','Philip','Lori','Eugene','Marie'],
        'country': ['India','China','United States','Indonesia','Pakistan','Nigeria','Brazil','Bangladesh','Russia','Mexico','Ethiopia','Japan','Philippines','Egypt','DR Congo','Vietnam','Iran','Turkey','Germany','Thailand','United Kingdom','Tanzania','France','South Africa','Italy','Kenya','Myanmar','Colombia','South Korea','Uganda','Sudan','Spain','Argentina','Algeria','Iraq','Afghanistan','Poland','Canada','Morocco','Saudi Arabia','Ukraine','Angola','Uzbekistan','Yemen','Peru','Malaysia','Ghana','Mozambique','Nepal','Madagascar','Côte dIvoire','Venezuela','Cameroon','Niger','Australia','North Korea','Taiwan','Mali','Burkina Faso','Syria','Sri Lanka','Malawi','Zambia','Romania','Chile','Kazakhstan','Chad','Ecuador','Somalia','Guatemala','Senegal','Netherlands','Cambodia','Zimbabwe','Guinea','Rwanda','Benin','Burundi','Tunisia','Bolivia','Haiti','Belgium','Jordan','Dominican Republic','Cuba','South Sudan','Sweden','Honduras','Czech Republic (Czechia)','Azerbaijan','Greece','Papua New Guinea','Portugal','Hungary','Tajikistan','United Arab Emirates','Belarus','Israel','Togo','Austria','Switzerland','Sierra Leone','Laos','Hong Kong','Serbia','Nicaragua','Libya','Paraguay','Kyrgyzstan','Bulgaria','Turkmenistan','El Salvador','Congo','Singapore','Denmark','Slovakia','Central African Republic','Finland','Norway','Liberia','State of Palestine','Lebanon','New Zealand','Costa Rica','Ireland','Mauritania','Oman','Panama','Kuwait','Croatia','Eritrea','Georgia','Mongolia','Moldova','Uruguay','Puerto Rico','Bosnia and Herzegovina','Albania','Jamaica','Armenia','Gambia','Lithuania','Qatar','Botswana','Namibia','Gabon','Lesotho','Guinea-Bissau','Slovenia','North Macedonia','Latvia','Equatorial Guinea','Trinidad and Tobago','Bahrain','Timor-Leste','Estonia','Mauritius','Cyprus'],
        'fruit': ['Apple', 'Orange', 'Banana', 'Pear', 'Strawberry', 'Grape', 'Blueberry', 'Raspberry', 'Pineapple', 'Watermelon', 'Kiwi', 'Mango', 'Papaya', 'Peach', 'Cherry', 'Plum', 'Lemon', 'Lime', 'Avocado', 'Fig', 'Cranberry', 'Blackberry', 'Cantaloupe', 'Honeydew melon', 'Grapefruit', 'Pomegranate', 'Coconut', 'Passion fruit', 'Lychee', 'Dragon fruit', 'Guava', 'Persimmon', 'Tangerine', 'Nectarine', 'Apricot', 'Jackfruit', 'Star fruit', 'Elderberry', 'Raspberry', 'Boysenberry', 'Mulberry', 'Gooseberry', 'Ackee', 'Plantain', 'Date', 'Quince', 'Rambutan', 'Longan', 'Durian', 'Kiwano'],
        'animal': ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Giraffe', 'Zebra', 'Hippopotamus', 'Rhinoceros', 'Gorilla', 'Chimpanzee', 'Bear', 'Panda', 'Koala', 'Kangaroo', 'Cheetah', 'Jaguar', 'Leopard', 'Wolf', 'Fox', 'Deer', 'Moose', 'Elk', 'Bison', 'Yak', 'Camel', 'Alpaca', 'Llama', 'Horse', 'Donkey', 'Mule', 'Goat', 'Sheep', 'Cow', 'Bull', 'Pig', 'Boar', 'Warthog', 'Rhinoceros', 'Hyena', 'Wildebeest', 'Antelope', 'Gazelle', 'Ostrich', 'Emu', 'Flamingo', 'Penguin', 'Toucan', 'Parrot', 'Eagle', 'Hawk', 'Falcon', 'Owl', 'Pelican', 'Seagull', 'Swan', 'Duck', 'Goose', 'Chicken', 'Rooster', 'Pigeon', 'Sparrow', 'Hummingbird', 'Crow', 'Magpie', 'Blue Jay', 'Cardinal', 'Robin', 'Goldfish', 'Clownfish', 'Angelfish', 'Betta fish', 'Swordfish', 'Shark', 'Dolphin', 'Whale', 'Seal', 'Sea lion', 'Walrus', 'Otter', 'Beaver', 'Platypus', 'Crocodile', 'Alligator', 'Turtle', 'Tortoise', 'Snake', 'Lizard', 'Gecko', 'Iguana', 'Chameleon', 'Frog', 'Toad', 'Salamander', 'Newt', 'Tarantula', 'Scorpion', 'Spider', 'Centipede', 'Millipede'],
        'sport': ['Football', 'Basketball', 'American Football', 'Baseball', 'Tennis', 'Golf', 'Rugby', 'Cricket', 'Volleyball', 'Table Tennis', 'Badminton', 'Hockey', 'Swimming', 'Running', 'Boxing', 'Martial Arts', 'Wrestling', 'Gymnastics', 'Cycling', 'Surfing', 'Skateboarding', 'Snowboarding', 'Skiing', 'Weightlifting', 'Archery', 'Shooting', 'Fencing', 'Diving', 'Sailing', 'Rowing', 'Canoeing/Kayaking', 'Equestrian', 'Triathlon', 'Pole Vault', 'High Jump', 'Long Jump', 'Javelin Throw', 'Hammer Throw', 'Discus Throw', 'Decathlon/Heptathlon', 'Bobsleigh', 'Bungee Jumping', 'Rock Climbing', 'Mountaineering', 'Paragliding', 'Kite Surfing', 'Windsurfing', 'Handball', 'Lacrosse'],
    };
    let vocabTopics = Object.keys(vocab);

    let UpdateUI_ELVisibility = function (obj) {
        var el = obj.target;
        if(obj.tagName == 'LABEL'){
            el = document.getElementById(obj.target.getAttribute('for'));
        }
        let toggledText = document.getElementById(el.dataset['el']).parentNode;
        let tableELs = document.getElementsByClassName(el.dataset['el']);

        toggledText.style.display = el.checked ? '' : 'none';

        for(let i=0; i<tableELs.length; i++){
            tableELs[i].style.display = el.checked ? '' : 'none';
        }
    }
    toggleCountryEl.addEventListener('change', UpdateUI_ELVisibility);
    toggleFruitEl.addEventListener('change', UpdateUI_ELVisibility);
    toggleAnimalEl.addEventListener('change', UpdateUI_ELVisibility);
    toggleSportEl.addEventListener('change', UpdateUI_ELVisibility);

    let UI_elements = vocabTopics.reduce((acc, cur) => {
        acc[cur] = document.getElementById(cur);
        return acc;
    }, {});

    let step = 0;
    function zeroToArrayLengthMinusOne(length, seed) {
        return ((seed * step) % length);
    }

    function zeroToArrayLengthMinusOneLess(length, seed) {
        return ((seed * step + 0.00001) % length);
    }

    function toRad(length, seed) {
        return Math.PI * zeroToArrayLengthMinusOneLess(length * 2, seed) / (length * 2);
    }

    /** returns 0 or -1 */
    function zeroToNegOne(length, seed) {
        return Math.floor(Math.cos(toRad(length, seed)));
    }

    /** returns 0 or -1 */
    function predictableRandom(length, seed) {
        return Math.abs(zeroToNegOne(length - 1, seed) * (length - 1) + zeroToArrayLengthMinusOne(length - 1, seed));
    }

    function getRandomElement(arr, seed) {
        return arr[predictableRandom(arr.length, seed)];
    }

    let seeds;
    function Generate() {
        return vocabTopics.reduce((acc, cur, index, arr) => {
            acc[cur] = getRandomElement(vocab[cur], seeds[arr.length - index - 1]);
            return acc;
        }, {});
    }

    function UpdateUI_Person(person) {
        vocabTopics.forEach((topic)=>{
            UI_elements[topic].innerText = person[topic] ?? "";
        });
    }

    let nextFreeSeat = 0;
    function Remember(person) {
        table[nextFreeSeat] = person;
        nextFreeSeat = nextFreeSeat < table.length - 1 ? nextFreeSeat + 1 : 0;
    }

    this.next = function () {
        step++;
        roundNumber++;
        let person = Generate();
        Remember(person);
        UpdateUI_Person(person);
        UpdateUI();
    }

    this.addChair = function () {
        table[table.length] = null;
        nextFreeSeat = table.indexOf(null);
        UpdateUI();
    }

    this.removeChair = function () {
        table.length -= 1;
        if (nextFreeSeat = table.length) {
            nextFreeSeat = 0;
        }
        UpdateUI();
    }

    let primes = [7,11,13,17,19];
    function calcSeeds(gameSeed) {
        return vocabTopics.map((val, index) => (primes[index] * gameSeed) % vocab[val].length);
    }

    let seedEl = document.getElementById('seed');
    let NewGame = function () {
        if(table.length == 0) {
            table.length = 1;
        }
        step = 0;
        roundNumber = 0;

        for (let i = 0; i < table.length; i++) {
            table[i] = null;
        }
        nextFreeSeat = table.indexOf(null);

        if (seedEl.value == "") {
            seedEl.value = Math.floor(Math.random() * 500);
        }else{
            seedEl.value = Number.parseInt(seedEl.value);
        }

        seeds = calcSeeds(Number.parseInt(seedEl.value));

        UpdateUI_Person([]);
        UpdateUI();
    }

    this.toggleVisibility = function () {
        isVisible = !isVisible;
        UpdateUI();
    }

    this.setSeed = function () {
        NewGame();
    }

    NewGame();
}

let game = new MemoryGame();

document.getElementById('generateButton').addEventListener('click', game.next);
document.getElementById('addChair').addEventListener('click', game.addChair);
document.getElementById('removeChair').addEventListener('click', game.removeChair);
document.getElementById('setSeed').addEventListener('click', game.setSeed);
document.getElementById('toggleVisibility').addEventListener('click', game.toggleVisibility);

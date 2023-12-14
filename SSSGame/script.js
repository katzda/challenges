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

    function UpdateUI() {
        UpdateUI_NoChairs();
        UpdateUI_Table();
        UpdateUI_TableVisibility();
        UpdateUI_Round();
    }

    let vocab = {
        'name': ['Jack', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Lucas', 'Sophia', 'Ethan', 'Isabella', 'Mason', 'Mia', 'Logan', 'Charlotte', 'Jacob', 'Amelia', 'Aiden', 'Nicole', 'Benjamin', 'Evelyn', 'William', 'Abigail', 'James', 'Emily', 'Oliver', 'Elizabeth', 'Elijah', 'Avery', 'Alexander', 'Sofia', 'Michael', 'Ella', 'Daniel', 'Scarlett', 'Henry', 'Grace', 'Jackson', 'Chloe', 'Sebastian', 'Lily', 'Matthew', 'Addison', 'Samuel', 'Natalie', 'David', 'Victoria', 'Joseph', 'Zoey', 'Carter', 'Penelope', 'Gabriel', 'Layla', 'Luke', 'Riley', 'Anthony', 'Aubrey', 'Isaac', 'Nora', 'Dylan', 'Skylar', 'Wyatt', 'Hannah', 'Andrew', 'Zoey', 'Joshua', 'Brooklyn', 'Christopher', 'Savannah', 'Grayson', 'Audrey', 'Nathan', 'Leah', 'Eli', 'Claire', 'Samuel', 'Stella', 'Owen', 'Agnes', 'Connor', 'Ellie', 'Landon', 'Maya', 'Ryan', 'Violet', 'Isaiah', 'Aria', 'Christian', 'Aurora', 'Hunter', 'Sarah', 'Cameron', 'Caroline', 'Thomas', 'Naomi', 'Charles', 'Anna', 'Julian', 'Samantha', 'Aaron', 'Eliana'],
        'sport': ['Football', 'Basketball', 'American Football', 'Baseball', 'Tennis', 'Golf', 'Rugby', 'Cricket', 'Volleyball', 'Table Tennis', 'Badminton', 'Hockey', 'Swimming', 'Running', 'Boxing', 'Martial Arts', 'Wrestling', 'Gymnastics', 'Cycling', 'Surfing', 'Skateboarding', 'Snowboarding', 'Skiing', 'Weightlifting', 'Archery', 'Shooting', 'Fencing', 'Diving', 'Sailing', 'Rowing', 'Canoeing/Kayaking', 'Equestrian', 'Triathlon', 'Pole Vault', 'High Jump', 'Long Jump', 'Javelin Throw', 'Hammer Throw', 'Discus Throw', 'Decathlon/Heptathlon', 'Bobsleigh', 'Bungee Jumping', 'Rock Climbing', 'Mountaineering', 'Paragliding', 'Kite Surfing', 'Windsurfing', 'Handball', 'Lacrosse'],
        'fruit': ['Apple', 'Orange', 'Banana', 'Pear', 'Strawberry', 'Grape', 'Blueberry', 'Raspberry', 'Pineapple', 'Watermelon', 'Kiwi', 'Mango', 'Papaya', 'Peach', 'Cherry', 'Plum', 'Lemon', 'Lime', 'Avocado', 'Fig', 'Cranberry', 'Blackberry', 'Cantaloupe', 'Honeydew melon', 'Grapefruit', 'Pomegranate', 'Coconut', 'Passion fruit', 'Lychee', 'Dragon fruit', 'Guava', 'Persimmon', 'Tangerine', 'Nectarine', 'Apricot', 'Jackfruit', 'Star fruit', 'Elderberry', 'Raspberry', 'Boysenberry', 'Mulberry', 'Gooseberry', 'Ackee', 'Plantain', 'Date', 'Quince', 'Rambutan', 'Longan', 'Durian', 'Kiwano'],
        'country': ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein'],
        'animal': ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Giraffe', 'Zebra', 'Hippopotamus', 'Rhinoceros', 'Gorilla', 'Chimpanzee', 'Bear', 'Panda', 'Koala', 'Kangaroo', 'Cheetah', 'Jaguar', 'Leopard', 'Wolf', 'Fox', 'Deer', 'Moose', 'Elk', 'Bison', 'Yak', 'Camel', 'Alpaca', 'Llama', 'Horse', 'Donkey', 'Mule', 'Goat', 'Sheep', 'Cow', 'Bull', 'Pig', 'Boar', 'Warthog', 'Rhinoceros', 'Hyena', 'Wildebeest', 'Antelope', 'Gazelle', 'Ostrich', 'Emu', 'Flamingo', 'Penguin', 'Toucan', 'Parrot', 'Eagle', 'Hawk', 'Falcon', 'Owl', 'Pelican', 'Seagull', 'Swan', 'Duck', 'Goose', 'Chicken', 'Rooster', 'Pigeon', 'Sparrow', 'Hummingbird', 'Crow', 'Magpie', 'Blue Jay', 'Cardinal', 'Robin', 'Goldfish', 'Clownfish', 'Angelfish', 'Betta fish', 'Swordfish', 'Shark', 'Dolphin', 'Whale', 'Seal', 'Sea lion', 'Walrus', 'Otter', 'Beaver', 'Platypus', 'Crocodile', 'Alligator', 'Turtle', 'Tortoise', 'Snake', 'Lizard', 'Gecko', 'Iguana', 'Chameleon', 'Frog', 'Toad', 'Salamander', 'Newt', 'Tarantula', 'Scorpion', 'Spider', 'Centipede', 'Millipede'],
    };
    let vocabTopics = Object.keys(vocab);
    let UI_elements = vocabTopics.reduce((acc, cur) => {
        acc[cur] = document.getElementById(cur);
        return acc;
    }, {});

    let step = 0;
    function zeroToArrayLengthMinusOne(length, seed) {
        return ((seed + step) % length);
    }

    function zeroToArrayLengthMinusOneLess(length, seed) {
        return ((seed + step + 0.00001) % length);
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
        return vocabTopics.reduce((acc, cur, index) => {
            acc[cur] = getRandomElement(vocab[cur], seeds[index]);
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

    function calcSeeds(finalNumberOfTheCombination, arraySizes, currentDepth, startingIndex, counter) {
        if (typeof currentDepth === 'undefined') {
            currentDepth = 0;
        }
        if (typeof startingIndex === 'undefined') {
            startingIndex = 0;
        }
        if (typeof counter === 'undefined') {
            var counter = 0;
        }
        for (let i = startingIndex; i < arraySizes[currentDepth]; i++) {
            if (currentDepth == arraySizes.length - 1) {
                if (counter == finalNumberOfTheCombination) {
                    results = [];
                    results.length = arraySizes.length;
                    results[currentDepth] = i;
                    return results;
                } else {
                    counter++;
                    continue;
                }
            } else {
                let results = calcSeeds(finalNumberOfTheCombination, arraySizes, currentDepth + 1, 0, counter);
                if (typeof results == 'number') {
                    counter = results;
                } else {
                    results[currentDepth] = i;
                    return results;
                }
            }
        }
        if (counter <= finalNumberOfTheCombination) {
            return counter;
        }
    }

    function getVocabSizes() {
        return vocabTopics.map((topic) => vocab[topic].length);
    }

    let vocabSizes = getVocabSizes();
    let seedEl = document.getElementById('seed');
    let NewGame = function () {
        table.length = 1;
        step = 0;
        roundNumber = 0;

        table = [];
        for (let i = 0; i < table.length; i++) {
            table[i] = null;
        }

        if (seedEl.value == "") {
            seedEl.value = Math.floor(Math.random() * 50000);
        }else{
            seedEl.value = Math.min(Number.parseInt(seedEl.value), 50000);
        }

        seeds = calcSeeds(Number.parseInt(seedEl.value), vocabSizes);

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

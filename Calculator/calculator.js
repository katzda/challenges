function Calculator(selector){
    var that = this;

    (function CSS() {
        var css = `
            .calculator {
                display: inline-block;
                border: 1px solid gray;
                box-shadow: 4px 5px 3px grey;
                padding: 3px;
            }
            .calculator thead input {
                width: 100%;
                box-sizing: border-box;
                text-align: right;
            }
            .calculator tbody td {
                background: #DDD;
                text-align: center;
                cursor: pointer;
                width: 50px;
                height: 50px;
                border-style: outset;

                /* no text selection */
                -webkit-touch-callout: none; /* iOS Safari */
                  -webkit-user-select: none; /* Safari */
                   -khtml-user-select: none; /* Konqueror HTML */
                     -moz-user-select: none; /* Old versions of Firefox */
                      -ms-user-select: none; /* Internet Explorer/Edge */
                          user-select: none; /* Non-prefixed version, currently
                                                supported by Chrome, Edge, Opera and Firefox */
            }
            .calculator tbody td.pressed {
                border-style: inset;
            }
        `;
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    })();

    var buttons_viewtext = {
        'add' : '+',
        'sub' : '-',
        'mul' : '*',
        'div' : '/',
        'sqr' : '√',
        'zero' : '0',
        'one' : '1',
        'two' : '2',
        'three' : '3',
        'four' : '4',
        'five' : '5',
        'six' : '6',
        'seven' : '7',
        'eight' : '8',
        'nine' : '9',
        'delete' : '←',
        'eval' : '=',
        'ans' : 'ANS',
        'decimal' : '.'
    }
    var display_commands, display_result, elem;
    (function HTML() {
        var existingElement = null;
        try {
            existingElement = document.querySelector(selector);
        }catch(e){
            existingElement = document.querySelector("body");
        }finally {
            if(existingElement === null) {
                existingElement = document.querySelector("body");
            }
        }
        elem = document.createElement("div");
        existingElement.appendChild(elem);
        elem.innerHTML = `
            <table class="calculator">
                <thead>
                    <tr>
                        <td colspan="4">
                            <input class="commandline" value="" type="text" readonly="true"></input></br>
                            <input class="result" value="" type="text" readonly="true"></input>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="add"></td>
                        <td class="sub"></td>
                        <td class="mul"></td>
                        <td class="div">/</td>
                    </tr>
                    <tr>
                        <td class="seven"></td>
                        <td class="eight"></td>
                        <td class="nine"></td>
                        <td class="sqr"></td>
                    </tr>
                    <tr>
                        <td class="four"></td>
                        <td class="five"></td>
                        <td class="six"></td>
                        <td class="nonregex delete"></td>
                    </tr>
                    <tr>
                        <td class="one"></td>
                        <td class="two"></td>
                        <td class="three"></td>
                        <td class="nonregex eval"></td>
                    </tr>
                    <tr>
                        <td class="zero"></td>
                        <td class="nonregex ans"></td>
                        <td class="decimal"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `;
        display_commands = elem.querySelector("input.commandline");
        display_result = elem.querySelector("input.result");

        Object.keys(buttons_viewtext).forEach((key) => {
            var btn = elem.querySelector(`tbody .${key}`);
            if(!!btn){
                btn.innerText = buttons_viewtext[key];
            }
        });
    })();

    var lastResult;
    (function API() {
        /* Back-end functionality */
        function Addition() {
            this.Calculate = function(operand) {
                return Number.parseFloat(operand[0]) + Number.parseFloat(operand[1]);
            }
        }
        function Subtraction() {
            this.Calculate = function(operand) {
                return Number.parseFloat(operand[0]) - Number.parseFloat(operand[1]);
            }
        }
        function Multiplication() {
            this.Calculate = function(operand) {
                return Number.parseFloat(operand[0]) * Number.parseFloat(operand[1]);
            }
        }
        function Division() {
            this.Calculate = function(operand) {
                return Number.parseFloat(operand[0]) / Number.parseFloat(operand[1]);
            }
        }
        function Sqrt() {
            this.Calculate = function(operand) {
                return Math.sqrt(operand[0]);
            }
        }

        var ServiceContainer = {};
        ServiceContainer[buttons_viewtext['add']] = new Addition();
        ServiceContainer[buttons_viewtext['sub']] = new Subtraction();
        ServiceContainer[buttons_viewtext['mul']] = new Multiplication();
        ServiceContainer[buttons_viewtext['div']] = new Division();
        ServiceContainer[buttons_viewtext['sqr']] = new Sqrt();

        var RgX = {
            Number: "\\d+(?:\\.\\d+)?"
        }
        var supportedSyntax = new RegExp(`(?:(${RgX.Number})([+\\-*/])(${RgX.Number}))|(?:([√])(${RgX.Number}))`);

        var commands = '';
        function SetDisplay(command, result){
            if(command != null) display_commands.value = command;
            if(result != null) display_result.value = result;
        }
        that.Enter = function(symbol) {
            commands += symbol;
            SetDisplay(commands);
        }
        that.Delete = function Delete() {
            commands = commands.substr(0, commands.length - 1);
            SetDisplay(commands);
        }
        function Calculate(parsed) {
            /* Ternary ifs for operator and operands instead of looping through an interfaced syntax recognition set of classes to distinguish between two syntaxes:
                a) number operator number (1 + 1)
                b) operator number (sqrt 50)
               That would be ideal but for now an overkill since I know of just these two syntaxes
            */
            const operator = parsed.length == 2 ? parsed[0] : parsed[1];
            const operands = parsed.length == 2 ? [parsed[1]] : [parsed[0], parsed[2]];
            return ServiceContainer[operator].Calculate(operands);
        }
        that.Evaluate = function(){
            if(!!commands){
                if(supportedSyntax.test(commands)){
                    let parsedline = commands.match(supportedSyntax);
                    do {
                        parsedline.shift();
                    } while(parsedline[0] == null);
                    lastResult = Calculate(parsedline);
                    commands = "";
                    SetDisplay(commands, lastResult);
                }else{
                    SetDisplay(null, "Unsupported syntax");
                }
            }
        }
    })();

    (function EventListeners() {
        function AddPressedClass(mouseEvent){
            mouseEvent.target.classList.add("pressed");
        }
        function RemovePressedClass(mouseEvent){
            mouseEvent.target.classList.remove("pressed");
        }
        function HandleSymbol(mouseEvent){
            that.Enter(mouseEvent.target.innerText);
        }


        /* all buttons */
        elem.querySelectorAll("tbody td").forEach((button) => {
            button.addEventListener("mousedown", AddPressedClass);
            button.addEventListener("mouseup", RemovePressedClass);
            button.addEventListener("mouseleave", RemovePressedClass);
        });
        /* buttons: operands and operators */
        elem.querySelectorAll("tbody td:not(.nonregex)").forEach((button) => {
            button.addEventListener("mousedown", HandleSymbol);
        });

        /* functional buttons */
        elem.querySelector("tbody td.delete").addEventListener("mousedown", function (mouseEvent){
            that.Delete();
        });
        elem.querySelector("tbody td.eval").addEventListener("mousedown", function (mouseEvent){
            that.Evaluate();
        });
        elem.querySelector("tbody td.ans").addEventListener("mousedown", function (mouseEvent){
            that.Enter(lastResult);
        });
    })();
    return this;
}
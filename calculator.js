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
        that.elem = document.createElement("div");
        that.elem.innerHTML = `
            <table class="calculator">
                <thead>
                    <tr>
                        <td>
                            <input class="display" value="" type="text" readonly="true"></input>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>+</td>
                        <td>-</td>
                        <td>*</td>
                        <td>/</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>¬</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td class="nonregex delete">←</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td class="nonregex eval">=</td>
                    </tr>
                </tbody>
            </table>
        `;
        that.elem.querySelector("thead td").setAttribute("colspan", 4);
        existingElement.appendChild(that.elem);

        that.display = that.elem.querySelector("input.display");
    })();

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

        var ServiceContainer = {
            '+' : new Addition(),
            '-' : new Subtraction(),
            '*' : new Multiplication(),
            '/' : new Division(),
            '¬' : new Sqrt(),
        }

        var reg = /(?:(\d+)([+\-*/])(\d+))|(?:([¬])(\d+))/;

        var commands = '';
        that.SetDisplay = function(value){
            that.display.value = value;
        }
        that.Enter = function(symbol) {
            commands += symbol;
            that.SetDisplay(commands);
        }
        that.Delete = function Delete() {
            commands = commands.substr(0, commands.length - 1);
            that.SetDisplay(commands);
        }
        function Calculate() {
            let todo = commands.match(reg);
            do {
                todo.shift();
            } while(todo[0] == null);
            /* Ternary ifs for operator and operands instead of looping through an interfaced syntax
                recognition set of classes to distinguish between two syntaxes: a) number operator number (1 + 1)
                            b) operator number (sqrt 50)
                That would be ideal but for now an overkill since I know of just these two syntaxes
            */
            const operator = todo.length == 2 ? todo[0] : todo[1];
            const operands = todo.length == 2 ? [todo[1]] : [todo[0], todo[2]];
            return ServiceContainer[operator].Calculate(operands);
        }
        that.Evaluate = function(){
            if(!!commands){
                that.SetDisplay(Calculate());
                commands = "";
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
        function HandleDeleteAction(mouseEvent){
            that.Delete();
        }
        function HandleEvaluateAction(mouseEvent){
            that.Evaluate();
        }
        /* all buttons */
        that.elem.querySelectorAll("tbody td").forEach((button) => {
            button.addEventListener("mousedown", AddPressedClass);
            button.addEventListener("mouseup", RemovePressedClass);
        });
        /* buttons: operands and operators */
        that.elem.querySelectorAll("tbody td:not(.nonregex)").forEach((button) => {
            button.addEventListener("mousedown", HandleSymbol);
        });
        /* delete */
        that.elem.querySelectorAll("tbody td.delete").forEach((button) => {
            button.addEventListener("mousedown", HandleDeleteAction);
        });
        /* evaluate */
        that.elem.querySelectorAll("tbody td.eval").forEach((button) => {
            button.addEventListener("mousedown", HandleEvaluateAction);
        });
    })();
    return this;
}
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vehicle = /** @class */ (function () {
    function Vehicle(VIN, speed) {
        if (speed === void 0) { speed = 0; }
        this.VIN = VIN;
        this.speed = speed;
    }
    Vehicle.prototype.GetVIN = function () {
        return this.VIN;
    };
    Vehicle.prototype.SetSpeed = function (speed) {
        this.speed = speed;
    };
    ;
    Vehicle.prototype.GetStatus = function () {
        return this.VIN + ": speed: " + this.speed;
    };
    return Vehicle;
}());
/// <reference path="Vehicle.ts" />
var Bus = /** @class */ (function (_super) {
    __extends(Bus, _super);
    function Bus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bus;
}(Vehicle));
var Operator = /** @class */ (function () {
    function Operator() {
    }
    Operator.prototype.Perform = function (vehicle, person) {
        console.log(person.GetName() + " is driving " + vehicle.GetVIN());
        vehicle.SetSpeed(5);
        console.log(vehicle.GetStatus());
        // Do I have a good mental picture of what I want to accomplish
        // Do I have a good mental picture of the types of classes I will need to create
        // Do I need a diagram to help navigate in the big picture
        // Have I thought of all requirements
        // Is the solution I have thought of modular and extendable
        // 1. does syntax make sense                - compile type errors
        // 2. does the semantics make sense         - programmer's reasoning / common sense
    };
    return Operator;
}());
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.GetName = function () {
        return this.name;
    };
    Person.prototype.SetName = function (name) {
        this.name = name;
    };
    return Person;
}());
var Truck = /** @class */ (function (_super) {
    __extends(Truck, _super);
    function Truck(VIN, load) {
        var _this = _super.call(this, VIN) || this;
        _this.load = load;
        return _this;
    }
    Truck.prototype.GetStatus = function () {
        return _super.prototype.GetStatus.call(this) + (", load: " + this.load);
    };
    return Truck;
}(Vehicle));
var op = new Operator();
var v1 = new Truck('ABC', 12);
var v2 = new Bus('DEF');
var person = new Person('Rob');
op.Perform(v2, person);

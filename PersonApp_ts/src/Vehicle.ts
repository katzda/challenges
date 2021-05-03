abstract class Vehicle
{
    protected VIN: String;
    protected speed: number;

    public constructor(VIN: String, speed: number = 0){
        this.VIN = VIN;
        this.speed = speed;
    }
    public GetVIN(){
        return this.VIN;
    }

    public SetSpeed(speed: number){
        this.speed = speed;
    };

    public GetStatus(){
        return `${this.VIN}: speed: ${this.speed}`;
    }
}
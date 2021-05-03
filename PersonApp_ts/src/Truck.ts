class Truck extends Vehicle
{
    private load : number;

    public constructor(VIN: String, load : number){
        super(VIN);
        this.load = load;
    }

    public GetStatus(){
        return super.GetStatus() + `, load: ${this.load}`;
    }
}
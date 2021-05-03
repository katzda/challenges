class Person {
    private name: String;

    public constructor(name: String){
        this.name = name;
    }

    public GetName(){
        return this.name;
    }
    public SetName(name: String){
        this.name = name;
    }
}
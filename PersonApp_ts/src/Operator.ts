class Operator {

    public Perform(vehicle: Vehicle, person: Person)
    {
        console.log(`${person.GetName()} is driving ${vehicle.GetVIN()}`);
        vehicle.SetSpeed(5);
        console.log(vehicle.GetStatus());

        // Do I have a good mental picture of what I want to accomplish
        // Do I have a good mental picture of the types of classes I will need to create
        // Do I need a diagram to help navigate in the big picture
        // Have I thought of all needed requirements
        // Is the solution I have thought of modular and extendable
        // 1. does syntax make sense                - compile type errors
        // 2. does the semantics make sense         - programmer's reasoning / common sense
        // 3. Where, in what scope or level of abstraction should this variable be placed in the most meaningful way?
        // 4. if I am confused, ask myself - is everything CLEARLY defined: names of variables, single responsibility,
        //    good design, mental picture, ... Go back over the above questions.
    }
}
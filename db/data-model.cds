namespace my.parkinglot;

entity Users
{
    key ID : UUID;
    name : String;
    phoneNumber : String;
    email : String;
    address : String;
}

entity AllSlots
{
    key ID : UUID;
    slotNumber : String;
    serviceType : String;
    status : String;
}

entity AllocatedSlots
{
    key ID : UUID;
    vehType : String;
    vehNumber : String;
    driverNumber : String;
    driverName : String;
    inTime : DateTime;
    slot : Association to one AllSlots;
}

entity AvailableSlots
{
    key ID : UUID;
    availSlot : Association to one AllSlots;
}

entity TotalHistory
{
    key ID : UUID;
    allocate : Association to one AllocatedSlots;
    allslots123 : Association to one AllSlots;
}
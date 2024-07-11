namespace my.parkinglot;

entity Users {
    key ID          : UUID;
        name        : String;
        phoneNumber : String;
        email       : String;
        address     : String;
}

entity AllSlots {
    key ID          : UUID;
        slotNumber  : String;
        serviceType : String;
        status      : String;
}

entity AllocatedSlots {
    key ID            : UUID;
        vehicleType   : String;
        vehicleNumber : String;
        driverNumber  : String;
        driverName    : String;
        serviceType   : String;
        inTime        : DateTime;
        slotNum       : Association to one AllSlots;
}

// entity AvailableSlots {
//     key ID        : UUID;
//         availSlot : Association to one AllSlots;
// }

entity TotalHistory {
    key ID            : UUID;
        slotNumber    : String;
        vehicleType   : String;
        vehicleNumber : String;
        driverNumber  : String;
        driverName    : String;
        serviceType   : String;
        inTime        : DateTime;
        outTime       : DateTime;
//allslots123 : Association to one AllSlots;
}

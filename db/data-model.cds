namespace my.parkinglot;

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

entity Reservations {
    key ID            : UUID;
        vendorName    : String;
        vendorNumber  : String;
        driverName    : String;
        driverNumber  : String;
        vehicleType   : String;
        vehicleNumber : String;
        serviceType   : String;
        inTime        : DateTime;

}

entity ReservedSlots {
    key ID            : UUID;
        vendorName    : String;
        vendorNumber  : String;
        driverName    : String;
        driverNumber  : String;
        vehicleType   : String;
        vehicleNumber : String;
        serviceType   : String;
        reserveSlot   : Association to AllSlots;
}

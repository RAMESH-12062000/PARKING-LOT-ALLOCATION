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
      status      : String; // Free, Reserved, Occupied
}

entity AllocatedSlots {
  key ID           : UUID;
      vehNumber    : String;
      driverNumber : String;
      driverName   : String;
      inTime       : Timestamp;
      outTime      : Timestamp;
      slot         : Association to AllSlots;
}

entity AvailableSlots {
  key ID        : UUID;
      availSlot : Association to AllSlots;
}

entity TotalHistory {
  key ID          : UUID;
      allocate    : Association to AllocatedSlots;
      allslots123 : Association to AllSlots;
}

// entity Reservations {
//   key ID          : UUID;
//       slot        : Association to ParkingAllSlots;
//       user        : Association to Users;
//       reservedAt  : Timestamp;
//       status      : String; // Pending, Accepted, Rejected
// }

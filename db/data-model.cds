namespace my.parkinglot;


entity users {
  key ID          : UUID;
      name        : String;
      phoneNumber : String;
      email       : String;
      address     : String;
}


entity ParkingAllSlots {
  key ID       : UUID;
      slotNumber : Integer;
      type       : String;
      status     : String; // Free, Reserved, Occupied
}

// entity Reservation {
//   key ID          : UUID;
//       slot        : Association to ParkingSlot;
//       user        : Association to users;
//       reservedAt  : Timestamp;
//       status      : String; // Pending, Accepted, Rejected
// }

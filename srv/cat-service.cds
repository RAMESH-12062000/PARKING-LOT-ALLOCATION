using my.parkinglot as my from '../db/data-model';


@path: '/ParkingLotAllocationApp'
service CatalogService {
    entity users as projection on my.users;
    entity ParkingSlots as projection on my.ParkingAllSlots;
    
    //entity Reservations as projection on my.Reservation;
}

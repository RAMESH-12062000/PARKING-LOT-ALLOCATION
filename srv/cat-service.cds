using my.parkinglot as my from '../db/data-model';


@path: '/ParkingLotAllocationApp'
service CatalogService {
    entity AllSlots as projection on my.AllSlots;
    entity AllocatedSlots as projection on my.AllocatedSlots;
    entity TotalHistory as projection on my.TotalHistory;
    entity Reservations as projection on my.Reservations;
    entity ReservedSlots as projection on my.ReservedSlots;
    //entity Notify as projection on my.Notify;

    
    //entity users as projection on my.users;
    //entity AvailableSlots as projection on my.AvailableSlots;

}

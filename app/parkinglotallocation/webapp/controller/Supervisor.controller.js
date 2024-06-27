sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
  ],
  function (BaseController, JSONModel, Fragment) {
    "use strict";

    return BaseController.extend("com.app.parkinglotallocation.controller.Supervisor", {
      onInit: function () {

        // Supervisor details
        var oSupervisorData = {
          name: "Ramesh P",
          position: "Parking Lot Allocator",
          contact: "rameshp9000@gmail.com.com",
          phone: "+91 9000727831"
        };

        // Create a JSON model and set the data
        var oSupervisorModel = new JSONModel(oSupervisorData);
        this.getView().setModel(oSupervisorModel, "supervisor");
      },
      onNavPress:async function(oEvent){
        var sSection = oEvent.getSource().getText();
        var oDynamicContent = this.byId("dynamicContent"); 
        oDynamicContent.removeAllItems();

        var sFragmentName;
        switch(sSection){
          case "PARKING LOT ASSIGNMENT":
          sFragmentName = "ParkingLotAssignment";
          break;
        
        default:
          oDynamicContent.addItem(new sap.m.Image({ src: "./Images/image2.jpeg", width: "100%", height: "auto" }));
                    return;
        }

      }
    });
  }
);

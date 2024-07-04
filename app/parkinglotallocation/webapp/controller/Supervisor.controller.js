// sap.ui.define(
//   [
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/core/Fragment"
//   ],
//   function (BaseController, JSONModel, Fragment) {
//     "use strict";

//     return BaseController.extend("com.app.parkinglotallocation.controller.Supervisor", {
//       onInit: function () {

//       },
//     });
//   }
// );

sap.ui.define([
  "sap/ui/Device",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],
  function (Device, Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.app.parkinglotallocation.controller.Supervisor", {

      onInit: function () {

        //Supervisor details
        var oSupervisorData = {
          name: "Ramesh P",
          position: "Parking Lot Allocator",
          contact: "rameshp9000@gmail.com.com",
          phone: "+91 9000727831"
        };
        //Create a JSON model and set the data
        var oSupervisorModel = new JSONModel(oSupervisorData);
        this.getView().setModel(oSupervisorModel, "supervisor");
      },

      onItemSelect: function (oEvent) {
        var oItem = oEvent.getParameter("item");
        this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));

        switch (oItem) {
          case "Slot Assignment:":
            navContainer.to(this.getView().createId("root1"));
            break;
          case "All Slots:":
            navContainer.to(this.getView().createId("root2"));
            break;
          case "Allocated Slots:":
            navContainer.to(this.getView().createId("root3"));
            break;
          case "Available Slots:":
            navContainer.to(this.getView().createId("root4"));
            break;
          case "History:":
            navContainer.to(this.getView().createId("root5"));
            break;

          default:
            //oDynamicContent.addItem(new sap.m.Image({ src: "./Images/image2.jpeg", width: "100%" }));
            break;
        }
      },

      onEdit: function () {
        // this.aProductCollection = deepExtend([], this.oModel.getProperty("/ProductCollection"));
        this.byId("editButton").setVisible(false);
        this.byId("saveButton").setVisible(true);
        this.byId("cancelButton").setVisible(true);
        this.rebindTable(this.oEditableTemplate, "Edit");
      },

      onCancel: function () {
        this.byId("cancelButton").setVisible(false);
        this.byId("saveButton").setVisible(false);
        this.byId("editButton").setVisible(true);
        //this.oModel.setProperty("/ProductCollection", this.aProductCollection);
        this.rebindTable(this.oReadOnlyTemplate, "Navigation");
      },

      //if click on menu btn then opens side bar..
      onSideNavButtonPress: function () {
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();

        this._setToggleButtonTooltip(bSideExpanded);

        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },

      //Tooltp msgs for menu btn when cursor moveing on the Menu Btn... 
      _setToggleButtonTooltip: function (bLarge) {
        var oToggleButton = this.byId('sideNavigationToggleButton');
        if (bLarge) {
          oToggleButton.setTooltip('Large Size Navigation');
        } else {
          oToggleButton.setTooltip('Small Size Navigation');
        }
      },



      //Search anything from History...
      onLiveSearchAnything: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue");
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          new Filter("allslots123/slotNumber", FilterOperator.Contains, sQuery);
          aFilters.push(new Filter("allocate/vehNumber", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/driverNumber", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/driverName", FilterOperator.Contains, sQuery));

          var a

          this.getView().byId("idHistoryTable").getBinding("items").filter(oFinalFilter);
        } else {
          this.getView().byId("idHistoryTable").getBinding("items").filter([]);
        }
      },
    });
  });

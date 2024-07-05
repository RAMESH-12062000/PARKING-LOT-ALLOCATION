sap.ui.define([
  "sap/ui/Device",
  "./BaseController",
  //"sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
],
  function (Device, Controller, JSONModel, Filter, FilterOperator, MessageBox, MessageToast) {
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


        //Assign a slot to vehicle first create model...
        var oAssignmentData = {
          slot: {
            slotNumber:""
          },
          driverName: "",
          driverNumber: "",
          vehicleNumber: "",
          vehicleType: "",
          serviceType: "",
          inTime:""
        };
        var oAssignmentModel = new JSONModel(oAssignmentData);
        this.getView().setModel(oAssignmentModel, "assignmentModel");
      },

      onItemSelect: function (oEvent) {
        var oItem = oEvent.getParameter("item");
        this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));

        // switch (oItem) {
        //   case "Slot Assignment:":
        //     navContainer.to(this.getView().createId("root1"));
        //     break;
        //   case "All Slots:":
        //     navContainer.to(this.getView().createId("root2"));
        //     break;
        //   case "Allocated Slots:":
        //     navContainer.to(this.getView().createId("root3"));
        //     break;
        //   case "Available Slots:":
        //     navContainer.to(this.getView().createId("root4"));
        //     break;
        //   case "History:":
        //     navContainer.to(this.getView().createId("root5"));
        //     break;

        //   default:
        //     //oDynamicContent.addItem(new sap.m.Image({ src: "./Images/image2.jpeg", width: "100%" }));
        //     break;
        // }
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

      //I have used radiobuttons for inward and outward so need to get the data of you selected button, this below required...
      onServiceTypeChange: function (oEvent) {
        var sSelectedText = oEvent.getSource().getText().toLowerCase();
        this.getView().getModel("assignmentModel").setProperty("/serviceType", sSelectedText);
      },


      //Assign a Slot to Vehicle...
      onAssignSlotPress: async function () {
        debugger
        const oAssignmentModel = this.getView().getModel("assignmentModel");
        const oPayload = oAssignmentModel.getProperty("/"),
          oModel = this.getView().getModel("ModelV2");
        oPayload.inTime = new Date().toLocaleString();
        console.log("Payload: ", oPayload);

        

        try {
          await this.createData(oModel, oPayload, "/AllocatedSlots");
          this.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
          MessageToast.show("Slot assigned successfully");
        } catch (error) {
          console.error("Error: ", error);
          MessageBox.error("Some technical issue");
        }
      },

      //After Assigning a slot to vehicle and clear those items...
      onClearPress: function () {
        this.getView().getModel("assignmentModel").setProperty("/", {
          slotNumber: "",
          driverName: "",
          driverNumber: "",
          vehicleNumber: "",
          vehicleType: "",
          serviceType: ""
        });
      },



      



      //Search anything from History...
      onLiveSearchAnything: function (oEvent) {
        var sQuery = oEvent.getSource().getValue();
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          var filterSlotNumber = new Filter("allslots123/slotNumber", FilterOperator.Contains, sQuery);
          var filtervehNumber = new Filter("allocate/vehNumber", FilterOperator.Contains, sQuery);
          var filterdriverNumber = new Filter("allocate/driverNumber", FilterOperator.Contains, sQuery);
          var filterdriverName = new Filter("allocate/driverName", FilterOperator.Contains, sQuery);

          var allFilter = new Filter({
            filters: [filterSlotNumber, filtervehNumber, filterdriverNumber, filterdriverName],
            and: false
          });

          var oList = this.byId("idHistoryTable");
          var oBinding = oList.getBinding("items");
          oBinding.filter(allFilter);
        }
      }
    });
  });
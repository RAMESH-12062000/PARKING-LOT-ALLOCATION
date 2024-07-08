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

        // //Assign a slot to vehicle first create model...
        // var oAssignmentData = {
        //   slot: {
        //     slotNumber: sSlotNumber
        //   },
        //   driverName: "",
        //   driverNumber: "",
        //   vehicleNumber:"",
        //   vehicleType: "",
        //   serviceType: "",
        //   inTime: ""
        // };
        // var sSlotNumber = this.byId("idslotNumber").getSelectedKey();
        // var sServiceType = this.byId("idTypeOfDelivery").getSelectedKey();
        // var sDriverName = this.byId("driverName").getSelectedKey();
        // var sDriverNumber = this.byId("driverNumber").getSelectedKey();
        // var sVehicleNumber = this.byId("idTypeOfDelivery").getSelectedKey();
        // var sVehicleType = this.byId("idTypeOfDelivery").getSelectedKey();
        // var sServiceType = this.byId("idTypeOfDelivery").getSelectedKey();
        // var oAssignmentModel = new JSONModel(oAssignmentData);
        // this.getView().setModel(oAssignmentModel, "assignmentModel");
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
      // onServiceTypeChange: function (oEvent) {
      //   var sSelectedText = oEvent.getSource().getText().toLowerCase();
      //   this.getView().getModel("assignmentModel").setProperty("/serviceType", sSelectedText);
      // },


      //Assign a Slot to Vehicle...
      onAssignSlotPress: async function () {
        debugger
        var sSlotNumber = this.getView().byId("idSelectSlot").getSelectedKey();
        var sVehicleNumber = this.getView().byId("idvehicleNumber").getValue();
        var sVehicleType = this.getView().byId("idvehicleType").getValue();
        var sDriverNumber = this.getView().byId("driverNumber").getValue();
        var sDriverName = this.getView().byId("driverName").getValue();
        var sServiceType = this.getView().byId("idTypeOfDelivery").getSelectedKey();


        const assignmentModel = new sap.ui.model.json.JSONModel({
          vehicleType: sDriverName,
          vehicleNumber: sVehicleNumber,
          vehicleType: sVehicleType,
          driverNumber: sDriverNumber,
          serviceType: sServiceType,
          driverName: sDriverName,
          inTime: new Date(),
          slot_ID: sSlotNumber
        })
        this.getView().setModel(assignmentModel, "assignmentModel");
        const oPayload = this.getView().getModel("assignmentModel").getProperty("/");
        //const oPayload = oAssignmentModel.getProperty("/"),
        const oModel = this.getView().getModel("ModelV2");

        //for currents date and time...
        const now = new Date();
        const formattedDateTime = now.toISOString(); // This will give you the required format
        oPayload.inTime = formattedDateTime;

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



      // onUnAssignPress: function (oEvent) {
      //   const oItem = oEvent.getSource().getParent();
      //   const oContext = oItem.getBindingContext();
      //   const sPath = oContext.getPath();
      //   const oModel = this.getView().getModel("ModelV2");
      //   const oAllocatedData = oContext.getObject();
      //   const oThis = this;

      //   MessageBox.confirm(
      //     `Are you sure you want to unassign slot '${oAllocatedData.slot.slotNumber}'?`,
      //     {
      //       actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      //       onClose: function (sAction) {
      //         if (sAction === MessageBox.Action.YES) {
      //           debugger
      //           // Remove the entry from AllocatedSlots
      //           oModel.remove(sPath, {
      //             success: function () {
      //               // Add entry to History table
      //               let oHistoryModel = oThis.getView().getModel("HistoryModel");
      //               let oHistoryData = oHistoryModel.getData();
      //               oAllocatedData.outTime = new Date().toISOString();
      //               oHistoryData.TotalHistory.push(oAllocatedData);
      //               oHistoryModel.setData(oHistoryData);

      //               // Update the AllSlots status to Available
      //               let oAllSlotsModel = oThis.getView().getModel("AllSlotsModel");
      //               let aAllSlots = oAllSlotsModel.getData().AllSlots;
      //               let oSlot = aAllSlots.find(slot => slot.slotNumber === oAllocatedData.slot.slotNumber);
      //               if (oSlot) {
      //                 oSlot.status = "Available";
      //                 oAllSlotsModel.setData({ AllSlots: aAllSlots });
      //               }

      //               MessageBox.success(`Slot '${oAllocatedData.slot.slotNumber}' unassigned successfully.`);
      //               oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
      //               oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
      //               oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
      //             },
      //             error: function () {
      //               MessageBox.error(`Failed to unassign slot '${oAllocatedData.slot.slotNumber}'.`);
      //             }
      //           });
      //         }
      //       }
      //     }
      //   );
      // },







      //Search anything from AllocatedSlots Table...(this way also works fine)
      onLiveSearchAllocatedPress: function (oEvent) {
        var sQuery = oEvent.getSource().getValue();
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          var filterSlotNumber = new Filter("slot/slotNumber", FilterOperator.Contains, sQuery);
          var filtervehType = new Filter("vehicleType", FilterOperator.Contains, sQuery);
          var filtervehNumber = new Filter("vehicleNumber", FilterOperator.Contains, sQuery);
          var filterdriverNumber = new Filter("driverNumber", FilterOperator.Contains, sQuery);
          var filterdriverName = new Filter("driverName", FilterOperator.Contains, sQuery);

          var allFilter = new Filter({
            filters: [filterSlotNumber, filtervehType, filtervehNumber, filterdriverNumber, filterdriverName],
            and: false
          });
          aFilters.push(allFilter);

          var oList = this.byId("AllocatedSlotsTable");
          var oBinding = oList.getBinding("items");
          oBinding.filter(allFilter);
        }
      },

      //Search anything from History Table...
      onLiveSearchAnythingPress: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue");
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          aFilters.push(new Filter("allocate/slot/slotNumber", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/vehicleType", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/vehicleNumber", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/driverNumber", FilterOperator.Contains, sQuery));
          aFilters.push(new Filter("allocate/driverName", FilterOperator.Contains, sQuery));

          var oFinalFilter = new Filter({
            filters: aFilters,
            and: false
          });

          this.getView().byId("idHistoryTable").getBinding("items").filter(oFinalFilter);
        } else {
          this.getView().byId("idHistoryTable").getBinding("items").filter([]);
        }
      },
    });
  });
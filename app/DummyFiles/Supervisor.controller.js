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
      onServiceTypeChange: function (oEvent) {
        var sSelectedText = oEvent.getSource().getText().toLowerCase();
        this.getView().getModel("assignmentModel").setProperty("/serviceType", sSelectedText);
      },


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



      onUnAssignPress: function (oEvent) {
        const oItem = oEvent.getSource().getParent();
        const oContext = oItem.getBindingContext();
        const sPath = oContext.getPath();
        const oModel = this.getView().getModel("ModelV2");
        const oAllocatedData = oContext.getObject();
        const oThis = this;

        MessageBox.confirm(
          `Are you sure you want to unassign slot '${oAllocatedData.slot.slotNumber}'?`,
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.YES) {
                debugger
                // Remove the entry from AllocatedSlots
                oModel.remove(sPath, {
                  success: function () {
                    // Add entry to History table
                    let oHistoryModel = oThis.getView().getModel("HistoryModel");
                    let oHistoryData = oHistoryModel.getData();
                    oAllocatedData.outTime = new Date().toISOString();
                    oHistoryData.TotalHistory.push(oAllocatedData);
                    oHistoryModel.setData(oHistoryData);

                    // Update the AllSlots status to Available
                    let oAllSlotsModel = oThis.getView().getModel("AllSlotsModel");
                    let aAllSlots = oAllSlotsModel.getData().AllSlots;
                    let oSlot = aAllSlots.find(slot => slot.slotNumber === oAllocatedData.slot.slotNumber);
                    if (oSlot) {
                      oSlot.status = "Available";
                      oAllSlotsModel.setData({ AllSlots: aAllSlots });
                    }

                    MessageBox.success(`Slot '${oAllocatedData.slot.slotNumber}' unassigned successfully.`);
                    oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
                    oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                    oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                  },
                  error: function () {
                    MessageBox.error(`Failed to unassign slot '${oAllocatedData.slot.slotNumber}'.`);
                  }
                });
              }
            }
          }
        );
      },




      //For Un Assign a Slot and it Will trigger at History Table...
      onUnAssignPress: async function (oEvent) {
        debugger
        const oItem = oEvent.getSource().getParent();
        const oContext = oItem.getBindingContext();
        const sPath = oContext.getPath();
        const oModel = this.getView().getModel("ModelV2");
        const oAllocatedData = oContext.getObject();
        const oThis = this;

        MessageBox.confirm(
          `Are you sure you want to unassign slot '${oAllocatedData.slot_ID}'?`,
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: async function (sAction) {
              if (sAction === MessageBox.Action.YES) {
                try {
                  // Remove the entry from AllocatedSlots
                  await oModel.remove(sPath);
                  MessageBox.success(`Slot unassigned successfully, Pls chechk once in History..!`);
                  debugger

                  // Add entry to History table
                  const oHistoryPayload = {
                    vehicleType: oAllocatedData.vehicleType,
                    vehicleNumber: oAllocatedData.vehicleNumber,
                    driverNumber: oAllocatedData.driverNumber,
                    driverName: oAllocatedData.driverName,
                    serviceType: oAllocatedData.serviceType,
                    inTime: oAllocatedData.inTime,
                    outTime: new Date().toISOString(),
                    slotNumber: oAllocatedData.slot.slotNumber
                  };

                  console.log("Payload: ", oHistoryPayload);

                  await new Promise((resolve, reject) => {
                    oModel.create("/TotalHistory", oHistoryPayload, {
                      success: resolve,
                      error: reject
                    });
                  });
                  oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();

                  //Not working Properly this...
                  // const sSlotPath = `/AllSlots('${oAllocatedData.slot.slotNumber}')`;
                  // debugger
                  // oModel.read(sSlotPath, {
                  //     success: function (oData) {
                  //         oData.status = "Available";
                  //         oModel.update(sSlotPath, oData, {
                  //             success: function () {
                  //                 oModel.refresh(); // Refresh the model to get the latest data
                  //                 MessageToast.show("Slot status updated to 'Available'.");
                  //             },
                  //             error: function (oError) {
                  //                 MessageBox.error("Failed to update slot status: " + oError.message);
                  //             }
                  //         });
                  //     },
                  //     error: function (oError) {
                  //         MessageBox.error("Failed to fetch slot data: " + oError.message);
                  //     }
                  // });


                  // Refresh the tables
                  oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                  oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                } catch (error) {
                  MessageBox.error("Failed to unassign slot or add to history.");
                  console.error("Error: ", error);
                }
              }
            }
          }
        );
      },






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

      //Assign a Slot to Vehicle...

      onAssignSlotPress: async function () {
        const oUserView = this.getView();

        var sSlotNumber = this.byId("idparkingLotSelect").getSelectedKey();
        var sVehicleNumber = this.byId("idvehicleNumber").getValue();
        var sDriverName = this.byId("iddriverName").getValue();
        var sDriverNumber = this.byId("iddriverNumber").getValue();
        var sVehicleType = this.byId("idvehicleType").getValue();
        var sServiceType = this.byId("idTypeOfDelivery").getSelectedKey();

        const assignmentModel = new sap.ui.model.json.JSONModel({
          driverName: sDriverName,
          driverNumber: sDriverNumber,
          vehicleNumber: sVehicleNumber,
          vehicleType: sVehicleType,
          serviceType: sServiceType,
          inTime: new Date(),
          slot: {
            slotNumber: sSlotNumber
          }
        });

        var bValid = true;

        // Driver Name Validation
        if (!sDriverName || sDriverName.length < 4) {
          oUserView.byId("iddriverName").setValueState("Error");
          oUserView.byId("iddriverName").setValueStateText("Name Must Contain at least 4 Characters");
          bValid = false;
        } else {
          oUserView.byId("iddriverName").setValueState("None");
        }

        // Driver Number Validation
        if (!sDriverNumber || sDriverNumber.length !== 10 || !/^\d+$/.test(sDriverNumber)) {
          oUserView.byId("iddriverNumber").setValueState("Error");
          oUserView.byId("iddriverNumber").setValueStateText("Driver number must be a 10-digit numeric value");
          bValid = false;
        } else {
          oUserView.byId("iddriverNumber").setValueState("None");
        }

        // Vehicle Number Validation
        if (!sVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(sVehicleNumber)) {
          oUserView.byId("idvehicleNumber").setValueState("Error");
          oUserView.byId("idvehicleNumber").setValueStateText("Vehicle number should follow this pattern AP12BG1234");
          bValid = false;
        } else {
          oUserView.byId("idvehicleNumber").setValueState("None");
        }

        // Vehicle Type Validation
        if (!sVehicleType) {
          oUserView.byId("idvehicleType").setValueState("Error");
          bValid = false;
        } else {
          oUserView.byId("idvehicleType").setValueState("None");
        }

        // Service Type Validation
        if (!sServiceType) {
          oUserView.byId("idTypeOfDelivery").setValueState("Error");
          bValid = false;
        } else {
          oUserView.byId("idTypeOfDelivery").setValueState("None");
        }

        // Slot Number Validation
        if (!sSlotNumber) {
          oUserView.byId("idparkingLotSelect").setValueState("Error");
          bValid = false;
        } else {
          oUserView.byId("idparkingLotSelect").setValueState("None");
        }

        if (!bValid) {
          MessageToast.show("Please enter correct data");
          return;
        } else {
          this.getView().setModel(assignmentModel, "assignmentModel");
          const oPayload = this.getView().getModel("assignmentModel").getProperty("/");
          const oModel = this.getView().getModel("ModelV2");

          try {
            // Create the assignment in AllocatedSlots
            await this.createData(oModel, oPayload, "/AllocatedSlots");

            // Update the status of the selected slot in AllSlots to "Occupied"
            var sUpdatePath = `/AllSlots('${sSlotNumber}')`;
            var oUpdatePayload = {
              status: "Occupied"
            };
            await this.updateData(oModel, sUpdatePath, oUpdatePayload);

            this.getView().byId("idSlotsTable").getBinding("items").refresh();
            this.oAssignedslotDialog.close();
            MessageToast.show("Slot assigned successfully");
          } catch (error) {
            console.error("Error: ", error);
            MessageBox.error("Some technical issue");
          }
        }
      },
    });
  });
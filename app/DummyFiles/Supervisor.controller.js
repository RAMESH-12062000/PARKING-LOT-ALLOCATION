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

      //Assigning with Validations and sms and Announcement....
      onAssignSlotPress: async function () {
        debugger;
        var sSlotNumber = this.getView().byId("idparkingLotSelect").getSelectedKey();
        var sVehicleNumber = this.getView().byId("idvehicleNumber").getValue();
        var sVehicleType = this.getView().byId("idvehicleType").getValue();
        var sDriverNumber = this.getView().byId("iddriverNumber").getValue();
        var sDriverName = this.getView().byId("iddriverName").getValue();
        var sServiceType = this.getView().byId("idTypeOfDelivery").getSelectedKey();

        var valid = true;
        if (!sSlotNumber) {
          this.getView().byId("idparkingLotSelect").setValueState(sap.ui.core.ValueState.Error);
          valid = false;
        } else {
          this.getView().byId("idparkingLotSelect").setValueState(sap.ui.core.ValueState.None);
        }

        if (!sVehicleNumber.match(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/)) {
          this.getView().byId("idvehicleNumber").setValueState(sap.ui.core.ValueState.Error);
          this.getView().byId("idvehicleNumber").setValueStateText("Vehicle Numbers follows this pattern 'AP09AB1234'");
          valid = false;
        } else {
          this.getView().byId("idvehicleNumber").setValueState(sap.ui.core.ValueState.None);
        }

        if (!sVehicleType) {
          this.getView().byId("idvehicleType").setValueState(sap.ui.core.ValueState.Error);
          valid = false;
        } else {
          this.getView().byId("idvehicleType").setValueState(sap.ui.core.ValueState.None);
        }

        if (!sDriverNumber.match(/^\d{10}$/)) {
          this.getView().byId("iddriverNumber").setValueState(sap.ui.core.ValueState.Error);
          this.getView().byId("iddriverNumber").setValueStateText("Mobile Numbers should contain at least '10 Digits!'");

          valid = false;
        } else {
          this.getView().byId("iddriverNumber").setValueState(sap.ui.core.ValueState.None);
        }

        if (sDriverName.length < 4) {
          this.getView().byId("iddriverName").setValueState(sap.ui.core.ValueState.Error);
          this.getView().byId("iddriverName").setValueStateText("Names contains at least '4Letters!'");
          valid = false;
        } else {
          this.getView().byId("iddriverName").setValueState(sap.ui.core.ValueState.None);
        }

        if (!sServiceType) {
          this.getView().byId("idTypeOfDelivery").setValueState(sap.ui.core.ValueState.Error);
          this.getView().byId("idTypeOfDelivery").setValueStateText("Select Service Type in 'Dropdown'");
          valid = false;
        } else {
          this.getView().byId("idTypeOfDelivery").setValueState(sap.ui.core.ValueState.None);
        }

        if (!valid) {
          MessageBox.error("Please fill all fields correctly.");
          return;
        }
        const assignmentModel = new sap.ui.model.json.JSONModel({
          vehicleType: sVehicleType,
          vehicleNumber: sVehicleNumber,
          driverNumber: sDriverNumber,
          driverName: sDriverName,
          serviceType: sServiceType,
          inTime: new Date().toISOString(),
          slotNum_ID: sSlotNumber // Ensure the association is correctly set
        });
        this.getView().setModel(assignmentModel, "assignmentModel");
        const oPayload = this.getView().getModel("assignmentModel").getProperty("/");
        const oModel = this.getView().getModel("ModelV2");

        console.log("Payload: ", oPayload);

        try {
          // Create the assignment in AllocatedSlots
          await this.createData(oModel, oPayload, "/AllocatedSlots");

          //Update the slot status in All Slots table
          debugger
          const sSlotFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sSlotNumber);
          oModel.read("/AllSlots", {
            filters: [sSlotFilter],
            success: function (oData) {
              if (oData.results.length > 0) {
                var oSlotData = oData.results[0];
                oSlotData.status = "Occupied"; // Change the status to "Occupied"
                const sSlotPath = `/AllSlots(${sSlotNumber})`; // Assuming 'ID' is the key field
                oModel.update(sSlotPath, oSlotData, {
                  success: function () {
                    MessageToast.show("Slot status updated to 'Occupied'.");
                    this.getView().byId("allSlotsTable").getBinding("items").refresh(); // Refresh the model to get the latest data
                  }, error: function (oError) {
                    MessageBox.error("Failed to update slot status: " + oError.message);
                  }
                });
              } else {
                MessageBox.error("Slot not found.");
              }
            },
            error: function (oError) {
              MessageBox.error("Failed to fetch slot data: " + oError.message);
            }
          });

          //After Assigning the Announcement will be raised...
          function makeAnnouncement(message, lang = 'en-US') {
            // Check if the browser supports the Web Speech API
            if ('speechSynthesis' in window) {
              // Create a new instance of SpeechSynthesisUtterance
              var utterance = new SpeechSynthesisUtterance(message);

              // Set properties (optional)
              utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
              utterance.rate = 0.77;  // Range between 0.1 (lowest) and 10 (highest)
              utterance.volume = 1; // Range between 0 (lowest) and 1 (highest)
              utterance.lang = lang; // Set the language

              // Speak the utterance
              window.speechSynthesis.speak(utterance);
            } else {
              console.log('Sorry, your browser does not support the Web Speech API.');
            }
          }

          // Example usage
          makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${sVehicleNumber} को स्लॉट नंबर ${sSlotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');
          makeAnnouncement(`దయచేసి వినండి. వాహనం నంబర్ ${sVehicleNumber} కు స్లాట్ నంబర్ ${sSlotNumber} కేటాయించబడింది.`, 'te-IN');

          // Refresh the tables
          this.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
          MessageToast.show("Slot assigned successfully");
          this.getView().byId("idparkingLotSelect").setSelectedKey("");
          this.getView().byId("idvehicleNumber").setValue("");
          this.getView().byId("idvehicleType").setValue("");
          this.getView().byId("iddriverNumber").setValue("");
          this.getView().byId("iddriverName").setValue("");
          this.getView().byId("idTypeOfDelivery").setSelectedKey("");

          var driverPhoneFull = "+91" + sDriverNumber;

          // Twilio API credentials
          const accountSid = 'AC9418cec2d41b4131132454d424d9f90c';
          const authToken = '047d24b2591bc6a8391c11c22cbcefea';
          const fromNumber = '+16187243098';

          const messageBody = `Hello ${sDriverName}, your vehicle with number ${sVehicleNumber} has been assigned to slot number ${sSlotNumber}.`;

          const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

          const payload = {
            To: driverPhoneFull,
            From: fromNumber,
            Body: messageBody
          };

          $.ajax({
            url: url,
            type: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
            },
            data: payload,
            success: function (data) {
              console.log('SMS sent successfully:', data);
              sap.m.MessageToast.show('SMS sent successfully to the driver.');
            },
            error: function (xhr, status, error) {
              console.error('Error sending SMS:', error);
              sap.m.MessageToast.show('Failed to send SMS: ' + error);
            }
          });

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

      /* This Bellow functionality is from Allocated Slots and you need add Method called "oBinding.filter([])" yo need add this one in Refresh btn function,
      then only it Crossmark(*) works.. */
      onLiveSearchAllocatedPress: function (oEvent) {
        var sQuery = oEvent.getSource().getValue();
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          var filterSlotNumber = new Filter("slotNum/slotNumber", FilterOperator.Contains, sQuery);
          var filtervehType = new Filter("vehicleType", FilterOperator.Contains, sQuery);
          var filtervehNumber = new Filter("vehicleNumber", FilterOperator.Contains, sQuery);
          var filterdriverNumber = new Filter("driverNumber", FilterOperator.Contains, sQuery);
          var filterdriverName = new Filter("driverName", FilterOperator.Contains, sQuery);
          var filterServiceType = new Filter("serviceType", FilterOperator.Contains, sQuery);

          var allFilter = new Filter({
            filters: [filterSlotNumber, filtervehType, filtervehNumber, filterdriverNumber, filterdriverName, filterServiceType],
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

      //After Recieving a Slot request from vendors then admin can Accept or Reject, this bellow code for Acceptance...
      // onConfirmRequestSlotPress: async function () {
      //     var oSelected = this.byId("idReservationsTable").getSelectedItem();
      //     if (oSelected) {
      //         debugger
      //         var oID = oSelected.getBindingContext().getObject().ID
      //         var oVendorName = oSelected.getBindingContext().getObject().vendorName
      //         var oVendorNumber = oSelected.getBindingContext().getObject().vendorNumber
      //         var oDriverName = oSelected.getBindingContext().getObject().driverName
      //         var oDriverNumber = oSelected.getBindingContext().getObject().driverNumber
      //         var oVehicleType = oSelected.getBindingContext().getObject().vehicleType
      //         var oVehicleNumebr = oSelected.getBindingContext().getObject().vehicleNumber
      //         var oServiceType = oSelected.getBindingContext().getObject().serviceType

      //         const oConfirmRequestModel = new JSONModel({
      //             ID: oID,
      //             vendorName: oVendorName,
      //             vendorNumber: oVendorNumber,
      //             driverName: oDriverName,
      //             driverNumber: oDriverNumber,
      //             vehicleType: oVehicleType,
      //             vehicleNumber: oVehicleNumebr,
      //             serviceType: oServiceType
      //         });
      //         this.getView().setModel(oConfirmRequestModel, "oConfirmRequestModel");
      //         if (!this.onRequestConfirmSlotDialog) {
      //             this.onRequestConfirmSlotDialog = await this.loadFragment("ReserveSlot")
      //         }
      //         this.onRequestConfirmSlotDialog.open();
      //     } else {
      //         MessageToast.show("Please Select a Vendor to Confirm A Slot Reservation..!")
      //     }
      // },
      onReserveSlotBtnPress: async function () {
        try {
          var oConfirmRequestModel = this.getView().getModel("oConfirmRequestModel").getData();
          var oSelectedSlot = this.byId("idselectSlotReserve").getSelectedItem();

          var oSlotContext = oSelectedSlot.getBindingContext().getObject();
          var oModel = this.getView().getModel("ModelV2");
          const oThis = this

          debugger
          oModel.update("/AllSlots(" + oSlotContext.ID + ")", { status: 'Reserved' }, {
            success: function () {
              sap.m.MessageToast.show("Slot Status Updated to Reserved..!!");
            }, error: function (oError) {
              sap.m.MessageBox.error(oError);
            }
          })

          // Create new entry in Reserved Slots table
          var oReservedSlotEntry = {
            vendorName: oConfirmRequestModel.vendorName,
            vendorNumber: oConfirmRequestModel.vendorNumber,
            driverName: oConfirmRequestModel.driverName,
            driverNumber: oConfirmRequestModel.driverNumber,
            vehicleType: oConfirmRequestModel.vehicleType,
            vehicleNumber: oConfirmRequestModel.vehicleNumber,
            reserveSlot: {
              ID: oSlotContext.ID,
              slotNumber: oSlotContext.slotNumber
            }
          };

          // Add the reserved slot entry
          debugger
          await new Promise((resolve, reject) => {
            oModel.create("/ReservedSlots", oReservedSlotEntry, {
              success: () => {
                sap.m.MessageToast.show("Slot reserved successfully!");
                this.getView().byId("idReservedslotsTable").getBinding("items").refresh();
                resolve();
              },
              error: (oError) => {
                sap.m.MessageBox.error(oError.message);
                reject(oError);
              }
            });
          });

          //Remove That request after confirm or reject
          var oSelectedItem = this.byId("idReservationsTable").getSelectedItem();
          if (oSelectedItem) {
            var sPath = oSelectedItem.getBindingContext().getPath();

            // Remove the request from Reservations table
            await new Promise((resolve, reject) => {
              oModel.remove(sPath, {
                success: () => {
                  sap.m.MessageToast.show("Request removed successfully.");
                  oThis.getView().byId("idReservationsTable").getBinding("items").refresh();
                  resolve();
                },
                error: (oError) => {
                  sap.m.MessageBox.error(oError.message);
                  reject(oError);
                }
              });
            });
          } else {
            sap.m.MessageToast.show("No selected request to remove.");
          }

          // Show success message
          sap.m.MessageToast.show("Slot reserved successfully!");

          // Close the dialog if needed
          if (this.onRequestConfirmSlotDialog) {
            this.onRequestConfirmSlotDialog.close();
          }
        } catch (error) {
          sap.m.MessageBox.error("Failed to reserve slot: " + error.message);
          console.error("Error: ", error);
        }
      },

      //For Reject Request and delete that one...
      onRejectConfirmSlotPress: function () {
        var oSelectedItem = this.getView().byId("idReservationsTable").getSelectedItem();
        if (!oSelectedItem) {
          MessageToast.show("Please select a reservation to reject.");
          return;
        }

        var sPath = oSelectedItem.getBindingContext().getPath();
        var oModel = this.getView().getModel("ModelV2");
        var oThis = this;

        MessageBox.warning(
          "Are you sure you want to Reject this RESERVATION..?",
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: async function (sAction) {
              if (sAction === MessageBox.Action.YES) {
                try {
                  // Remove the entry from Reservations
                  await new Promise((resolve, reject) => {
                    oModel.remove(sPath, {
                      success: function () {
                        MessageBox.success("Reservation rejected successfully.");
                        oThis.getView().byId("idReservationsTable").getBinding("items").refresh();
                        resolve();
                      },
                      error: function (oError) {
                        MessageBox.error("Failed to reject reservation: " + oError.message);
                        reject(oError);
                      }
                    });
                  });
                } catch (error) {
                  MessageBox.error("An error occurred: " + error.message);
                  console.error("Error: ", error);
                }
              }
            }
          }
        );
      },

      //From the Reserved Slots Table Assigning the slot to vehicle..
      //"ASSIGN Btn" (in Pop-up), Without a Msg to DriverNumber...
      onReserveSlotConfirmAssignBtnPress: async function () {
        debugger;
        try {
          const oSelectedItem = this.getView().byId("idReservedslotsTable").getSelectedItem();
          if (!oSelectedItem) {
            MessageToast.show("Please select a reserved slot to confirm assignment.");
            return;
          }

          const oSelectedData = oSelectedItem.getBindingContext().getObject();

          const oDriverName = this.byId("idDriverNameInput").getValue();
          const oDriverNumber = this.byId("idMobileNumberInput").getValue();
          const oVehicleType = this.byId("idVehTypeInput").getValue();
          const oVehicleNumber = this.byId("idVehNumberInput").getValue();
          const oServiceType = this.byId("idselectTransportType").getSelectedKey();
          const oSlotNumber = this.byId("idReservedSlotInput").getValue();

          const oThis = this
          const oModel = this.getView().getModel("ModelV2");

          // Validation: Check if all fields are filled
          if (!oDriverName || !oDriverNumber || !oVehicleType || !oVehicleNumber || !oServiceType || !oSlotNumber) {
            MessageBox.error("All fields are required.");
            return;
          }

          // Validation: Check if driver name contains at least 4 letters
          if (oDriverName.length < 4) {
            this.byId("idDriverNameInput").setValueState("Error");
            this.byId("idDriverNameInput").setValueStateText("Driver name should contain at least 4 letters.");
            return;
          } else {
            this.byId("idDriverNameInput").setValueState("None");
          }

          // Validation: Check if mobile number follows the format and uniqueness
          const mobileNumberPattern = /^[0-9]{10}$/;
          if (!mobileNumberPattern.test(oDriverNumber)) {
            this.byId("idMobileNumberInput").setValueState("Error");
            this.byId("idMobileNumberInput").setValueStateText("Mobile Number should contain 10 digits.");
            return;
          }

          // Validation: Check if vehicle number follows the format
          const vehicleNumberPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
          if (!vehicleNumberPattern.test(oVehicleNumber)) {
            this.byId("idVehNumberInput").setValueState("Error");
            this.byId("idVehNumberInput").setValueStateText("Vehicle Number should be in the format 'AP00AA0000'.");
            return;
          }

          // Check if driver number already exists in Allocated Slots
          const allocatedSlotsData = await new Promise((resolve, reject) => {
            oModel.read("/AllocatedSlots", {
              success: function (oData) {
                resolve(oData.results);
              },
              error: function (oError) {
                reject(oError);
              }
            });
          });

          const bDriverNumberExists = allocatedSlotsData.some(slot => slot.driverNumber === oDriverNumber);
          if (bDriverNumberExists) {
            MessageBox.error("Driver Number already Existed..!");
            this.byId("idMobileNumberInput").setValueState("Error");
            this.byId("idMobileNumberInput").setValueStateText("Mobile Number should be unique.");
            return;
          }

          const bVehicleNumberExists = allocatedSlotsData.some(slot => slot.vehicleNumber === oVehicleNumber);
          if (bVehicleNumberExists) {
            MessageBox.error("Vehicle Number already Existed..!");
            this.byId("idVehNumberInput").setValueState("Error");
            this.byId("idVehNumberInput").setValueStateText("Vehicle Number should be in the format 'AP00AA0000'.");
            return;
          }

          //New entry JSON to Allocated Slots...
          const oNewAllocatedSlot = {
            vehicleType: oVehicleType,
            vehicleNumber: oVehicleNumber,
            driverNumber: oDriverNumber,
            driverName: oDriverName,
            serviceType: oServiceType,
            inTime: new Date(),
            slotNum: {
              ID: oSelectedData.reserveSlot.ID,
              slotNumber: oSlotNumber
            }
          };

          // Create a new entry in AllocatedSlots
          await new Promise((resolve, reject) => {
            oModel.create("/AllocatedSlots", oNewAllocatedSlot, {
              success: () => {
                MessageBox.success("Slot assigned successfully!");
                resolve();
              },
              error: (oError) => {
                MessageBox.error("Failed to assign slot: " + oError.message);
                reject(oError);
              }
            });
          });

          // Update the slot status in AllSlots to "Occupied"
          await new Promise((resolve, reject) => {
            oModel.update("/AllSlots(" + oSelectedData.reserveSlot.ID + ")", { status: 'Occupied' }, {
              success: () => {
                MessageBox.success("Slot status changed to Occupied!");
                resolve();
              },
              error: (oError) => {
                MessageBox.error("Failed to update slot status: " + oError.message);
                reject(oError);
              }
            });
          });

          //Remove That request after confirm or reject
          const sReservedSlotPath = oSelectedItem.getBindingContext().getPath();
          await new Promise((resolve, reject) => {
            oModel.remove(sReservedSlotPath, {
              success: () => {
                MessageToast.show("Reserved slot entry removed successfully.");
                oThis.getView().byId("idReservedslotsTable").getBinding("items").refresh();
                resolve();
              },
              error: (oError) => {
                MessageBox.error("Failed to remove reserved slot entry: " + oError.message);
                reject(oError);
              }
            });
          });

          // Close the dialog
          this.onAssignReserveSlotConfirmDialog.close();
        } catch (error) {
          MessageBox.error("An error occurred: " + error.message);
          console.error("Error: ", error);
        }
      },

      //this is second way to print the slip..
      //this.printAssignmentDetails(oPayload);


      printAssignmentDetails: function (oPayload) {
        var SlotNumber = this.getView().byId("idparkingLotSelect").mProperties.value;
        // Generate barcode data
        var barcodeData = `Vehicle Number: ${oPayload.vehicleNumber}`;
        // Create a new window for printing
        var printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Slot Assigned Details</title > ');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sansserif; }');
        printWindow.document.write('.details-table { width: 100%; border - collapse: collapse;}');
        printWindow.document.write('.details-table th, .details-table td { border: 1px solid #000; padding: 8px; text- align: left;}');
        printWindow.document.write('.details-table th { backgroundcolor: #f2f2f2; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="print-container">');
        printWindow.document.write('<h1>Parking-Slot Assigned Details Slip:</h1 > ');
        printWindow.document.write('</div>');
        printWindow.document.write('<table class="details-table">');
        printWindow.document.write('<tr><th>Field</th><th>Details</th></tr > ');
        printWindow.document.write('<tr><td>Parking Slot Number</td><td>' + SlotNumber + '</td></tr>');
        printWindow.document.write('<tr><td>Driver Name</td><td>' + oPayload.driverName + '</td></tr>');
        printWindow.document.write('<tr><td>Driver Number</td><td>' + oPayload.driverNumber + '</td></tr>');
        printWindow.document.write('<tr><td>Vehicle Type</td><td>' + oPayload.vehicleType + '</td></tr>');
        printWindow.document.write('<tr><td>Vehicle Number</td><td>' + oPayload.vehicleNumber + '</td></tr>');
        printWindow.document.write('<tr><td>Service Type</td><td>' + oPayload.serviceType + '</td></tr>');
        printWindow.document.write('</table>');
        printWindow.document.write('<div class="barcodecontainer"><svg id="barcode"></svg></div>');
        // Include JsBarcode library
        printWindow.document.write('<script src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js" > </script > ');
        printWindow.document.write('<script>JsBarcode("#barcode", "' + barcodeData + '");</script>');
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        // Print the contents of the new window
        printWindow.print();
      },

    });
  });

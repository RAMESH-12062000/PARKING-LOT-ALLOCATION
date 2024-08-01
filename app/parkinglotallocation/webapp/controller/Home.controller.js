sap.ui.define([
    "sap/ui/Device",
    "./BaseController",
    //"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],
    function (Device, Controller, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("com.app.parkinglotallocation.controller.Home", {

            onInit: function () {
                // var oModel = new JSONModel(sap.ui.require.toUrl("com/app/parkinglotallocation/model/data.json"));
                // this.getView().setModel(oModel);
                // this._setToggleButtonTooltip(!Device.system.desktop);

                //AllSlots Data Visuals...
                this._setParkingLotModel();

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

                // var oReservedSlotsModel = new JSONModel({
                //     ReservedSlots: []
                // });
                // this.getView().setModel(oReservedSlotsModel, "reservedSlotsModel");
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

            //For settings button in Slot Assignment...
            onPressSettingsBtn: async function () {
                if (!this.TermsAndConditions) {
                    this.TermsAndConditions = await this.loadFragment("TermsAndConditions")
                }
                this.TermsAndConditions.open();
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
                var oTable = this.byId("AllocatedSlotsTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    MessageToast.show("Please select a slot to edit.");
                    return;
                }

                var oVBox = oSelectedItem.getCells()[0];
                var oText = oVBox.getItems()[0];
                var oComboBox = oVBox.getItems()[1];

                oText.setVisible(false);
                oComboBox.setVisible(true);

                this.byId("editButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("cancelButton").setVisible(true);
            },

            onSave: function () {
                const oView = this.getView()
                var oModel = oView.getModel("ModelV2");
                var oTable = this.byId("AllocatedSlotsTable");
                var aSelectedItems = oTable.getSelectedItems();
                var oSelected = this.byId("AllocatedSlotsTable").getSelectedItem();

                if (oSelected) {
                    var oContext = oSelected.getBindingContext().getObject();
                    var dID = oContext.ID;
                    var sOldSlotNumber = oContext.parkinglot.parkingLotNumber;

                    // To get the selected parking lot number from the Select element
                    var oSelect = oSelected.getCells()[0].getItems()[1]; // Assuming the Select is the second item in the first cell
                    var sSlotNumber = oSelect.getSelectedKey();


                    // create a record in history
                    const oNewUpdate = new sap.ui.model.json.JSONModel({
                        driverName: sDriverName,
                        phoneNumber: sDriverMobile,
                        vehicleNumber: sVehicle,
                        trasnporTtype: sTypeofDelivery,
                        inTime: new Date(),
                        ID: dID,
                        parkinglot: {
                            parkingLotNumber: sSlotNumber
                        }
                    })
                    this.getView().setModel(oNewUpdate, "oNewUpdate");

                    var oPayload = this.getView().getModel("oNewUpdate").getData();
                    var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model


                    // Assuming your update method is provided by your OData V2 model
                    oDataModel.update("/AssignedLots(" + oPayload.ID + ")", oPayload, {
                        success: function () {
                            const updatedParkingLot = {
                                status: "Occupied" // Assuming false represents empty parking
                                // Add other properties if needed
                            };
                            oDataModel.update("/ParkingLot('" + sSlotNumber + "')", updatedParkingLot, {
                                success: function () {
                                    const updatedParkingLotNumber = {
                                        status: "Available" // Assuming false represents empty parking
                                        // Add other properties if needed

                                    };
                                    oDataModel.update("/ParkingLot('" + sOldSlotNumber + "')", updatedParkingLotNumber, {
                                        success: function () {
                                            oModel.refresh();
                                            oTable.getBinding("items").refresh();
                                            MessageToast.show("Slot updated successfully");
                                            var oAssignedSlotsDropdown = oView.byId("parkingLotSelectComboBox"); // Replace with the actual ID of the dropdown in the fragment
                                            if (oAssignedSlotsDropdown) {
                                                var oAssignedSlotsDropdownBinding = oAssignedSlotsDropdown.getBinding("items");
                                                if (oAssignedSlotsDropdownBinding) {
                                                    oAssignedSlotsDropdownBinding.refresh();
                                                }
                                            }

                                            // Refresh the combobox in the table (if applicable)
                                            var oParkingLotSelect = oView.byId("parkingLotSelect"); // Replace with the actual ID of the combobox
                                            if (oParkingLotSelect) {
                                                var oParkingLotSelectBinding = oParkingLotSelect.getBinding("items");
                                                if (oParkingLotSelectBinding) {
                                                    oParkingLotSelectBinding.refresh();
                                                }
                                            }
                                        },
                                        error: function (oError) {
                                            sap.m.MessageBox.error("Failed to update new slot: " + oError.message);
                                        }
                                    });
                                },
                                error: function (oError) {
                                    sap.m.MessageBox.error("Failed to update old slot: " + oError.message);
                                }
                            });
                        },
                        error: function (oError) {
                            sap.m.MessageBox.error("Failed to update the slot: " + oError.message);
                        }
                    });

                }

                aSelectedItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        var aVBoxItems = oCell.getItems();
                        aVBoxItems[0].setVisible(true); // Hide Text
                        aVBoxItems[1].setVisible(false); // Show Input
                    });
                });
                this.byId("editButton").setVisible(true);
                this.byId("saveButton").setVisible(false);
                this.byId("cancelButton").setVisible(false);
            },

            // onSave: async function () {
            //     const oView = this.getView();
            //     const oModel = oView.getModel("ModelV2");
            //     const oTable = this.byId("AllocatedSlotsTable");
            //     const oSelectedItem = oTable.getSelectedItem();

            //     if (!oSelectedItem) {
            //         sap.m.MessageToast.show("Please select a slot to save.");
            //         return;
            //     }

            //     const oVBox = oSelectedItem.getCells()[0];
            //     const oText = oVBox.getItems()[0];
            //     const oComboBox = oVBox.getItems()[1];

            //     const sNewSlotNumber = oComboBox.getSelectedKey();
            //     if (!sNewSlotNumber) {
            //         sap.m.MessageToast.show("Please select a new slot number.");
            //         return;
            //     }

            //     const oContext = oSelectedItem.getBindingContext();
            //     const oData = oContext.getObject();
            //     const sOldSlotNumber = oData.slotNum.slotNumber;

            //     // Start batch operations
            //     oModel.setDeferredGroups(["updateGroup"]);

            //     // Update allocated slot with new slot number
            //     const oAllocatedSlotUpdate = {
            //         slotNum: { slotNumber: sNewSlotNumber }
            //     };
            //     oModel.update(oContext.getPath(), oAllocatedSlotUpdate, {
            //         groupId: "updateGroup"
            //     });

            //     // Update new parking slot status to "Occupied"
            //     oModel.read("/AllSlots", {
            //         filters: [new sap.ui.model.Filter("slotNumber", sap.ui.model.FilterOperator.EQ, sNewSlotNumber)],
            //         success: function (oData) {
            //             if (oData.results.length > 0) {
            //                 const oNewSlotPath = `/AllSlots(${oData.results[0].ID})`;
            //                 const oNewSlotUpdate = {
            //                     status: "Occupied"
            //                 };
            //                 oModel.update(oNewSlotPath, oNewSlotUpdate, {
            //                     groupId: "updateGroup"
            //                 });
            //             } else {
            //                 sap.m.MessageToast.show("Something went wrong");
            //             }
            //         },
            //         error: function () {
            //             sap.m.MessageToast.show("Something went wrong");
            //         }
            //     });

            //     // Update old parking slot status to "Available"
            //     oModel.read("/AllSlots", {
            //         filters: [new sap.ui.model.Filter("slotNumber", sap.ui.model.FilterOperator.EQ, sOldSlotNumber)],
            //         success: function (oData) {
            //             if (oData.results.length > 0) {
            //                 const oOldSlotPath = `/AllSlots(${oData.results[0].ID})`;
            //                 const oOldSlotUpdate = {
            //                     status: "Available"
            //                 };
            //                 oModel.update(oOldSlotPath, oOldSlotUpdate, {
            //                     groupId: "updateGroup"
            //                 });
            //             } else {
            //                 sap.m.MessageToast.show("Something went wrong");
            //             }
            //         },
            //         error: function () {
            //             sap.m.MessageToast.show("Something went wrong");
            //         }
            //     });

            //     // Submit batch operation
            //     oModel.submitChanges({
            //         groupId: "updateGroup",
            //         success: function () {
            //             oModel.refresh(true); // Refresh the model to get the latest data
            //             //oThis.getView().byId("idAllSlots").getBinding("items").refresh();

            //             // Update the UI
            //             oComboBox.setVisible(false);
            //             oText.setVisible(true);
            //             oText.setText(sNewSlotNumber);

            //             // Hide Save and Cancel buttons, show Edit button
            //             oThis.byId("editButton").setVisible(true);
            //             oThis.byId("saveButton").setVisible(false);
            //             oThis.byId("cancelButton").setVisible(false);
            //         },
            //         error: function () {
            //             sap.m.MessageToast.show("Something went wrong");
            //         }
            //     });
            // },



            onCancel: function () {
                var oTable = this.byId("AllocatedSlotsTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    MessageToast.show("Please select a slot to cancel.");
                    return;
                }

                var oVBox = oSelectedItem.getCells()[0];
                var oText = oVBox.getItems()[0];
                var oComboBox = oVBox.getItems()[1];

                oComboBox.setVisible(false);
                oText.setVisible(true);

                this.byId("editButton").setVisible(true);
                this.byId("saveButton").setVisible(false);
                this.byId("cancelButton").setVisible(false);
            },

            //Refresh Btn in AllSlots Table
            onRefreshBtnPress: function () {
                var oTable = this.getView().byId("allSlotsTable");
                var oBinding = oTable.getBinding("items");
                var oComboBox = this.getView().byId("idComboAllslots");
                // Clear the selection in the ComboBox
                oComboBox.setSelectedKey(null);
                // Clear the filter on the table binding to show all items
                oBinding.filter([]);
                //Refresh the Table...
                this.getView().byId("allSlotsTable").getBinding("items").refresh();
            },
            //Refresh Btn in AllocatedSlots Table
            onRefresAllocated: function () {
                var oTable = this.getView().byId("AllocatedSlotsTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter([]);
                oBinding.refresh();
            },
            //Refresh Btn in Reservations Table
            onRefreshReservations: function () {
                this.getView().byId("idReservationsTable").getBinding("items").filter([]);
                this.getView().byId("idReservationsTable").getBinding("items").refresh();
            },
            //Refresh Btn in History Table
            onRefreshBtnTotalHistoryTable: function () {
                this.getView().byId("idHistoryTable").getBinding("items").filter([]);
                this.getView().byId("idHistoryTable").getBinding("items").refresh();
            },

            //Assign a slot to vehicle...(1st window)
            onAssignSlotPress: async function () {
                debugger;
                var sSlotNumber = this.getView().byId("idparkingLotSelect").getSelectedKey();
                var sVehicleNumber = this.getView().byId("idvehicleNumber").getValue();
                var sVehicleType = this.getView().byId("idvehicleType").getValue();
                var sDriverNumber = this.getView().byId("iddriverNumber").getValue();
                var sDriverName = this.getView().byId("iddriverName").getValue();
                var sServiceType = this.getView().byId("idTypeOfDelivery").getSelectedKey();
                var oThis = this;

                var valid = true;
                if (!sSlotNumber) {
                    this.getView().byId("idparkingLotSelect").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("idparkingLotSelect").setValueStateText("Select Slot from 'Dropdown'");
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

                const oModel = this.getView().getModel("ModelV2");

                try {
                    // Check if vehicle number or driver number already exist in Allocated Slots
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

                    const bVehicleNumberExists = allocatedSlotsData.some(slot => slot.vehicleNumber === sVehicleNumber);
                    const bDriverNumberExists = allocatedSlotsData.some(slot => slot.driverNumber === sDriverNumber);

                    if (bVehicleNumberExists) {
                        MessageBox.error("Vehicle Number already exists.");
                        this.getView().byId("idvehicleNumber").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("idvehicleNumber").setValueStateText("Vehicle Number should be unique.");
                        return;
                    }

                    if (bDriverNumberExists) {
                        MessageBox.error("Driver Number already exists.");
                        this.getView().byId("iddriverNumber").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("iddriverNumber").setValueStateText("Driver Number should be unique.");
                        return;
                    }

                    // If no duplicates are found, proceed with the assignment
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
                    //console.log("Payload: ", oPayload);

                    // Create the assignment in AllocatedSlots
                    await this.createData(oModel, oPayload, "/AllocatedSlots");

                    // Update the slot status in All Slots table
                    debugger;
                    const sSlotFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sSlotNumber);
                    oModel.read("/AllSlots", {
                        filters: [sSlotFilter],
                        success: async function (oData) {
                            if (oData.results.length > 0) {
                                var oSlotData = oData.results[0];
                                oSlotData.status = "Occupied"; // Change the status to "Occupied"
                                const sSlotPath = `/AllSlots(${sSlotNumber})`; // Assuming 'ID' is the key field
                                await new Promise((resolve, reject) => {
                                    oModel.update(sSlotPath, oSlotData, {
                                        success: function () {
                                            MessageToast.show("Slot status updated to 'Occupied'.");
                                            oThis.getView().byId("allSlotsTable").getBinding("items").refresh(); // Refresh the model to get the latest data
                                            oThis.getView().byId("idparkingLotSelect").getBinding("items").refresh(); // Refresh the model to get the latest data
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            MessageBox.error("Failed to update slot status: " + oError.message);
                                            reject(oError);
                                        }
                                    });
                                });

                                // // Fetch slot number for the SMS
                                // const sSlotIDFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sSlotNumber);
                                // await new Promise((resolve, reject) => {
                                //     oModel.read("/AllSlots", {
                                //         filters: [sSlotIDFilter],
                                //         success: function (oData) {
                                //             if (oData.results.length > 0) {
                                //                 var oSlotDetails = oData.results[0];
                                //                 var slotNumberForSMS = oSlotDetails.slotNumber; // Assume 'slotNumber' is the actual slot number field
                                //                 resolve(slotNumberForSMS);
                                //             } else {
                                //                 MessageBox.error("Slot details not found.");
                                //                 reject("Slot details not found");
                                //             }
                                //         },
                                //         error: function (oError) {
                                //             MessageBox.error("Failed to fetch slot details: " + oError.message);
                                //             reject(oError);
                                //         }
                                //     });
                                // }).then(async (slotNumberForSMS) => {
                                //     // Send SMS to driver
                                //     var driverPhoneFull = "+91" + sDriverNumber;

                                //     // Twilio API credentials
                                //     const accountSid = 'AC9418cec2d41b4131132454d424d9f90c';
                                //     const authToken = '328ec7413f4a2e353a72b9b3bed216b7';
                                //     const fromNumber = '+16187243098';

                                //     const messageBody = `Hello ${sDriverName}, \n\nPlease park your Vehicle at the following slot:\nVehicle Number:${sVehicleNumber} \nSlot Number:${slotNumberForSMS} \n\nThank you.\nBest regards,\nArtihcus Pvt Ltd.`;

                                //     const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

                                //     const payload = {
                                //         To: driverPhoneFull,
                                //         From: fromNumber,
                                //         Body: messageBody
                                //     };

                                //     $.ajax({
                                //         url: url,
                                //         type: 'POST',
                                //         headers: { 'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken) },
                                //         data: payload,
                                //         success: function (data) {
                                //             //console.log('SMS sent successfully:', data);
                                //             sap.m.MessageBox.success('SMS sent successfully to the Driver..!');
                                //         },
                                //         error: function (xhr, status, error) {
                                //             //console.error('Error sending SMS:', error);
                                //             sap.m.MessageToast.show('Failed to send SMS: ' + error);
                                //         }
                                //     });
                                // });
                            } else {
                                MessageBox.error("Slot not found.");
                            }
                        }.bind(this),
                        error: function (oError) {
                            MessageBox.error("Failed to fetch slot data: " + oError.message);
                        }
                    });

                    // After Assigning the Announcement will be raised...
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
                    // Example usage Voice
                    makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${sVehicleNumber} को स्लॉट नंबर ${sSlotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');
                    makeAnnouncement(`దయచేసి వినండి. వాహనం నంబర్ ${sVehicleNumber} కు స్లాట్ నంబర్ ${sSlotNumber} కేటాయించబడింది.`, 'te-IN');

                    //Generating the Barcode data and Slot Details Slip... 
                    var SlotNumber = this.getView().byId("idparkingLotSelect").mProperties.value;
                    // Generate barcode data for this only
                    var barcodeData = `Vehicle Number: ${oPayload.vehicleNumber}`;
                    // Create a new window for printing
                    var printWindow = window.open('', '', 'height=600,width=800');
                    printWindow.document.write('<html><head><title>Assigned Slot Details Slip:</title > ');
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
                    printWindow.document.write('<tr><th>Property</th><th>Details</th></tr > ');
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

                    // Refresh the tables
                    this.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
                    MessageToast.show("Slot assigned successfully");
                    this.getView().byId("idparkingLotSelect").setSelectedKey("");
                    this.getView().byId("idvehicleNumber").setValue("");
                    this.getView().byId("idvehicleType").setValue("");
                    this.getView().byId("iddriverNumber").setValue("");
                    this.getView().byId("iddriverName").setValue("");
                    this.getView().byId("idTypeOfDelivery").setSelectedKey("");
                } catch (error) {
                    console.error("Error assigning slot: ", error);
                    MessageBox.error("Failed to assign slot: " + error.message);
                }
            },

            //Clearing the You Enterd Deatils..
            onClearSlotDetailsPress: function () {
                this.getView().byId("idparkingLotSelect").setSelectedKey("");
                this.getView().byId("idvehicleNumber").setValue("");
                this.getView().byId("idvehicleType").setValue("");
                this.getView().byId("iddriverNumber").setValue("");
                this.getView().byId("iddriverName").setValue("");
                this.getView().byId("idTypeOfDelivery").setSelectedKey("");
            },

            //Un Assign the slot after the vehical leavs the Parking Space...
            onUnAssignPress: async function (oEvent) {
                debugger;
                const oItem = oEvent.getSource().getParent();
                const oContext = oItem.getBindingContext();
                const sPath = oContext.getPath();
                const oModel = this.getView().getModel("ModelV2");
                const oAllocatedData = oContext.getObject();
                const oThis = this;

                MessageBox.confirm(
                    `Are you sure you want to Unassign slot '${oAllocatedData.slotNum.slotNumber}'?`,
                    {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: async function (sAction) {
                            if (sAction === MessageBox.Action.YES) {
                                try {
                                    // Remove the entry from AllocatedSlots
                                    await new Promise((resolve, reject) => {
                                        oModel.remove(sPath, {
                                            success: resolve,
                                            error: reject
                                        });
                                    });
                                    MessageBox.success(`Slot unassigned successfully, Please check once in History..!`);
                                    debugger;
                                    // Add entry to History table
                                    const oHistoryPayload = {
                                        vehicleType: oAllocatedData.vehicleType,
                                        vehicleNumber: oAllocatedData.vehicleNumber,
                                        driverNumber: oAllocatedData.driverNumber,
                                        driverName: oAllocatedData.driverName,
                                        serviceType: oAllocatedData.serviceType,
                                        inTime: oAllocatedData.inTime,
                                        outTime: new Date().toISOString(),
                                        slotNumber: oAllocatedData.slotNum.slotNumber
                                    };

                                    console.log("Payload: ", oHistoryPayload);
                                    //var t = temp.replace(/\s/g, '');
                                    await new Promise((resolve, reject) => {
                                        oModel.create("/TotalHistory", oHistoryPayload, {
                                            success: resolve,
                                            error: reject
                                        });
                                    });

                                    // Update the slot status in All Slots table..
                                    const slotStatus = oAllocatedData.slotNum.ID
                                    oModel.update("/AllSlots(" + slotStatus + ")", { status: 'Available' }, {
                                        success: function () {
                                            sap.m.MessageToast.show("Slot Status Updated in Available..!!");
                                            oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                                            oThis.getView().byId("idparkingLotSelect").getBinding("items").refresh();
                                        }, error: function (oError) {
                                            sap.m.MessageBox.error(oError);
                                        }
                                    })
                                    // Refresh the tables
                                    oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
                                    oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                                } catch (error) {
                                    MessageBox.error("Failed to unassign slot or add to history.");
                                    console.error("Error: ", error);
                                }
                            }
                        }
                    }
                );
            },

            //Add a new Slot to Parking Space...
            onAddNewSlotPress: async function () {
                if (!this.onAddNewSlotDialog) {
                    this.onAddNewSlotDialog = await this.loadFragment("AddNewSlot")
                }
                this.onAddNewSlotDialog.open()
            },
            onNewSlotAddingPress: async function () {
                var oView = this.getView();
                var sSlotNumber = oView.byId("idTitleInput").getValue();
                var sServiceType = oView.byId("idComboboxAddslot").getSelectedKey();
                var oThis = this;

                // Validate required fields
                if (!sSlotNumber || !sServiceType) {
                    MessageBox.error("All fields are required.");
                    return;
                }
                // Validate slot number format
                if (!/^PSlot\d{3}$/.test(sSlotNumber)) {
                    oView.byId("idTitleInput").setValueState("Error").setValueStateText("Slot number format should be 'PSlot<3Digits(0-9)>'.");
                    return;
                } else {
                    oView.byId("idTitleInput").setValueState("None");
                }
                // Check if slot number already exists
                var oModel = this.getView().getModel("ModelV2");
                var bSlotNumberExists = await this.checkIfExists(oModel, "/AllSlots", "slotNumber", sSlotNumber);
                if (bSlotNumberExists) {
                    MessageBox.error("Slot number already exists.");
                    return;
                }
                // Create new slot
                var oPayload = {
                    slotNumber: sSlotNumber,
                    serviceType: sServiceType,
                    status: "Available"
                };

                try {
                    await this.createData(oModel, oPayload, "/AllSlots");
                    MessageBox.success("New slot added successfully.");
                    // Clear the input fields after successful creation
                    oView.byId("idTitleInput").setValue("");
                    oView.byId("idComboboxAddslot").setSelectedKey("");
                } catch (error) {
                    console.error("Error: ", error);
                    MessageBox.error("Some technical issue occurred.");
                }
                this.onAddNewSlotDialog.close();
                // Refresh the AllSlots table
                this.getView().byId("allSlotsTable").getBinding("items").refresh();
            },
            checkIfExists: function (oModel, sEntitySet, sProperty, sValue) {
                return new Promise((resolve, reject) => {
                    oModel.read(sEntitySet, {
                        filters: [new sap.ui.model.Filter(sProperty, sap.ui.model.FilterOperator.EQ, sValue)],
                        success: (oData) => {
                            resolve(oData.results.length > 0);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            //Closing for Add a New Slot Dialog..
            onCloseaddslotDialog: function () {
                this.onAddNewSlotDialog.close();
            },

            //Filter By Status only...(AllSlots Table)
            onFilterButtonPress: function () {
                var oComboBox = this.byId("idComboAllslots");
                var bVisible = oComboBox.getVisible();
                oComboBox.setVisible(!bVisible);
            },
            onFilterStatusChange: function (oEvent) {
                var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
                var oTable = this.byId("allSlotsTable");
                var oBinding = oTable.getBinding("items");

                if (sSelectedKey) {
                    var aFilters = [];
                    aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sSelectedKey));
                    oBinding.filter(aFilters);
                }
            },

            //Search anything from AllocatedSlots Table...(this way also works fine)
            onLiveSearchAllocatedPress: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new Filter("slotNum/slotNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleType", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverName", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("serviceType", FilterOperator.Contains, sQuery));

                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("AllocatedSlotsTable").getBinding("items").filter(oFinalFilter);
                } else {
                    this.getView().byId("AllocatedSlotsTable").getBinding("items").filter([]);
                }
            },


            //Search fields in Reservations Table...
            onLiveSearchReservationsPress: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new Filter("vendorName", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vendorNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleType", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverName", FilterOperator.Contains, sQuery));

                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("idReservationsTable").getBinding("items").filter(oFinalFilter);
                } else {
                    this.getView().byId("idReservationsTable").getBinding("items").filter([]);
                }
            },

            //Search field In Reserved Slots Table...
            onLiveSearchReservedSlotsPress: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new Filter("reserveSlot/slotNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vendorName", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vendorNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleType", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverName", FilterOperator.Contains, sQuery));

                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("idReservedslotsTable").getBinding("items").filter(oFinalFilter);
                } else {
                    this.getView().byId("idReservedslotsTable").getBinding("items").filter([]);
                }
            },
            //Search anything from History Table...
            onLiveSearchAnythingPress: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new Filter("slotNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleType", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("vehicleNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverNumber", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("driverName", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("serviceType", FilterOperator.Contains, sQuery));

                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("idHistoryTable").getBinding("items").filter(oFinalFilter);
                } else {
                    this.getView().byId("idHistoryTable").getBinding("items").filter([]);
                }
            },

            //=============================================================>For Vendor View operations...!!
            //For Rejection on Request for a slot...
            onRejectConfirmSlotPress: function () {
                debugger
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

                                    // Retrieve vendor number from the selected item
                                    //debugger
                                    // var oContext = oSelectedItem.getBindingContext().getObject();
                                    // var vendorPhoneFull = "+91" + oContext.vendorNumber;
                                    // var messageBody = `Your Request for Slot was Rejected.\n\nDear Vendor,\n\nWe regret to inform you that there are no available slots in the parking space at the moment. We apologize for any inconvenience this may cause. Please try again after some time.\n\nThank you for choosing us.\n\nBest regards,\nArtihcus Global Pvt Ltd.`;

                                    // // Send SMS to vendor
                                    // const accountSid = 'AC9418cec2d41b4131132454d424d9f90c';
                                    // const authToken = '328ec7413f4a2e353a72b9b3bed216b7';
                                    // const fromNumber = '+16187243098';
                                    // const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

                                    // const payload = {
                                    //     To: vendorPhoneFull,
                                    //     From: fromNumber,
                                    //     Body: messageBody
                                    // };

                                    // await $.ajax({
                                    //     url: url,
                                    //     type: 'POST',
                                    //     headers: { 'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken) },
                                    //     data: payload,
                                    //     success: function (data) {
                                    //         //console.log('SMS sent successfully:', data);
                                    //         sap.m.MessageToast.show('SMS sent successfully to the vendor.');
                                    //     },
                                    //     error: function (xhr, status, error) {
                                    //         //console.error('Error sending SMS:', error);
                                    //         sap.m.MessageToast.show('Failed to send SMS: ' + error);
                                    //     }
                                    // });

                                } catch (error) {
                                    MessageBox.error("An error occurred: " + error.message);
                                    console.error("Error: ", error);
                                }
                            }
                        }
                    }
                );
            },

            //Vendor reservation request for slot..."ONCONFIRM" Btn from Reservations..
            onConfirmRequestSlotPress: async function () {
                var oSelected = this.byId("idReservationsTable").getSelectedItem();
                if (oSelected) {
                    debugger
                    var oID = oSelected.getBindingContext().getObject().ID
                    var oVendorName = oSelected.getBindingContext().getObject().vendorName
                    var oVendorNumber = oSelected.getBindingContext().getObject().vendorNumber
                    var oDriverName = oSelected.getBindingContext().getObject().driverName
                    var oDriverNumber = oSelected.getBindingContext().getObject().driverNumber
                    var oVehicleType = oSelected.getBindingContext().getObject().vehicleType
                    var oVehicleNumebr = oSelected.getBindingContext().getObject().vehicleNumber

                    const oConfirmRequestModel = new JSONModel({
                        ID: oID,
                        vendorName: oVendorName,
                        vendorNumber: oVendorNumber,
                        driverName: oDriverName,
                        driverNumber: oDriverNumber,
                        vehicleType: oVehicleType,
                        vehicleNumber: oVehicleNumebr
                    });
                    this.getView().setModel(oConfirmRequestModel, "oConfirmRequestModel");
                    if (!this.onRequestConfirmSlotDialog) {
                        this.onRequestConfirmSlotDialog = await this.loadFragment("ReserveSlot")
                    }
                    this.onRequestConfirmSlotDialog.open();
                } else {
                    MessageToast.show("Please Select a Vendor to Confirm A Slot Reservation..!")
                }
            },

            //After recieving a request from vendor then the Admin will Accept that request and reserve a slot for him...
            onReserveSlotBtnPress: async function () {
                try {
                    // Retrieve the required models and selected slot information
                    const oView = this.getView();
                    const oConfirmRequestModel = oView.getModel("oConfirmRequestModel").getData();
                    const oSelectedSlot = this.byId("idselectSlotReserve").getSelectedItem();
                    const oModel = oView.getModel("ModelV2");
                    const oThis = this;

                    if (!oSelectedSlot) {
                        sap.m.MessageToast.show("Please select a slot to reserve.");
                        return;
                    }

                    const oSlotContext = oSelectedSlot.getBindingContext().getObject();
                    const sNewSlotNumber = oSlotContext.slotNumber;

                    // Update the status of the selected slot to 'Reserved'
                    await new Promise((resolve, reject) => {
                        oModel.update("/AllSlots(" + oSlotContext.ID + ")", { status: 'Reserved' }, {
                            success: resolve,
                            error: reject
                        });
                    });

                    sap.m.MessageToast.show("Slot status updated to Reserved.");

                    // Create a new entry in the Reserved Slots table
                    const oReservedSlotEntry = {
                        vendorName: oConfirmRequestModel.vendorName,
                        vendorNumber: oConfirmRequestModel.vendorNumber,
                        driverName: oConfirmRequestModel.driverName,
                        driverNumber: oConfirmRequestModel.driverNumber,
                        vehicleType: oConfirmRequestModel.vehicleType,
                        vehicleNumber: oConfirmRequestModel.vehicleNumber,
                        reserveSlot: {
                            ID: oSlotContext.ID,
                            slotNumber: sNewSlotNumber
                        }
                    };

                    await new Promise((resolve, reject) => {
                        oModel.create("/ReservedSlots", oReservedSlotEntry, {
                            success: () => {
                                sap.m.MessageBox.success("Slot reserved successfully..!");
                                oView.byId("idReservedslotsTable").getBinding("items").refresh();
                                oThis.getView().byId("idselectSlotReserve").getBinding("items").refresh();
                                oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                                resolve();
                            },
                            error: (oError) => {
                                sap.m.MessageBox.error(oError.message);
                                reject(oError);
                            }
                        });
                    });

                    // Send SMS to vendor with the reservation details
                    //debugger
                    //                     const vendorPhoneFull = "+91" + oConfirmRequestModel.vendorNumber;
                    //                     const messageBody = `Hello, Your request for a slot was accepted. \n\nDear Vendor,\n\nThank you for your request. We're pleased to inform you that we have successfully Reserved a slot for you. Here are the details of your reserved slot:
                    // Driver Name: ${oConfirmRequestModel.driverName},
                    // Driver Number: ${oConfirmRequestModel.driverNumber},
                    // Vehicle Number: ${oConfirmRequestModel.vehicleNumber},
                    // Slot Number: ${sNewSlotNumber}.
                    // Please send your truck to our warehouse.\n
                    // Thank you for choosing us.\n\nBest regards,\nArtihcus Global Pvt Ltd.`;

                    //                     const accountSid = 'AC9418cec2d41b4131132454d424d9f90c';
                    //                     const authToken = '328ec7413f4a2e353a72b9b3bed216b7';
                    //                     const fromNumber = '+16187243098';
                    //                     const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

                    //                     const payload = {
                    //                         To: vendorPhoneFull,
                    //                         From: fromNumber,
                    //                         Body: messageBody
                    //                     };

                    //                     await $.ajax({
                    //                         url: url,
                    //                         type: 'POST',
                    //                         headers: { 'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken) },
                    //                         data: payload,
                    //                         success: function (data) {
                    //                             //console.log('SMS sent successfully:', data);
                    //                             sap.m.MessageBox.success('SMS sent successfully to the vendor, Please cross check once..!');
                    //                         },
                    //                         error: function (xhr, status, error) {
                    //                             //console.error('Error sending SMS:', error);
                    //                             sap.m.MessageToast.show('Failed to send SMS: ' + error);
                    //                         }
                    //                     });

                    // Remove the confirmed or rejected request from the Reservations table
                    debugger
                    const oSelectedItem = this.byId("idReservationsTable").getSelectedItem();
                    if (oSelectedItem) {
                        const sPath = oSelectedItem.getBindingContext().getPath();

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

                    // Show success message and close the dialog if needed
                    sap.m.MessageToast.show("Slot reserved successfully!");
                    if (this.onRequestConfirmSlotDialog) {
                        this.onRequestConfirmSlotDialog.close();
                    }
                } catch (error) {
                    sap.m.MessageBox.error("Failed to reserve slot: " + error.message);
                    console.error("Error: ", error);
                }
            },

            //After confirming Slot, now Supervisor will assign that reserved slot to vendor...Here You can change the details like name, Number, etc...
            onAssignConfirmReserveSlot: async function () {
                debugger
                var oSelected = this.byId("idReservedslotsTable").getSelectedItem();

                if (oSelected) {
                    var oID = oSelected.getBindingContext().getObject().ID
                    var oSelectSlot = oSelected.getBindingContext().getObject().reserveSlot.slotNumber
                    var oDriverName = oSelected.getBindingContext().getObject().driverName
                    var oDriverNumber = oSelected.getBindingContext().getObject().driverNumber
                    var oVehicleType = oSelected.getBindingContext().getObject().vehicleType
                    var oVehicleNumebr = oSelected.getBindingContext().getObject().vehicleNumber

                    const oConfirmReservedSlotModel = new JSONModel({
                        ID: oID,
                        slotNumber: oSelectSlot,
                        driverName: oDriverName,
                        driverNumber: oDriverNumber,
                        vehicleType: oVehicleType,
                        vehicleNumber: oVehicleNumebr
                    });
                    this.getView().setModel(oConfirmReservedSlotModel, "oConfirmReservedSlotModel");
                    if (!this.onAssignReserveSlotConfirmDialog) {
                        this.onAssignReserveSlotConfirmDialog = await this.loadFragment("ParkingLotAssignment")
                    }
                    this.onAssignReserveSlotConfirmDialog.open();
                } else {
                    MessageToast.show("Please Select a Reserved slot to confirm for the Assignment..!")
                }
            },

            //This is 2nd Method for, After confirming Slot, now Supervisor will assign that reserved slot to vendor & Here You cannot change the details like name, slot, etc...
            // onAssignConfirmReserveSlot: async function () {
            //     var oSelected = this.byId("idReservedslotsTable").getSelectedItem();

            //     if (oSelected) {
            //         var oSelectedData = oSelected.getBindingContext().getObject();

            //         const oConfirmReservedSlotModel = new JSONModel({
            //             ID: oSelectedData.ID,
            //             slotNumber: oSelectedData.reserveSlot.slotNumber,
            //             driverName: oSelectedData.driverName,
            //             driverNumber: oSelectedData.driverNumber,
            //             vehicleType: oSelectedData.vehicleType,
            //             vehicleNumber: oSelectedData.vehicleNumber
            //         });
            //         this.getView().setModel(oConfirmReservedSlotModel, "oConfirmReservedSlotModel");

            //         if (!this.onAssignReserveSlotConfirmDialog) {
            //             this.onAssignReserveSlotConfirmDialog = await this.loadFragment("ParkingLotAssignment");
            //         }
            //         this.onAssignReserveSlotConfirmDialog.open();
            //     } else {
            //         MessageToast.show("Please Select a Reserved slot to confirm for the Assignment..!");
            //     }
            // },


            /** After Getting the Reserved Slot Data, Before assign the slot pls check the details, here u can change(here slot can't changed.!).
            press on the Assign buttin the slot will trigger at Allocated slots and slot status will be Changed... */
            //"ASSIGN Btn" from Reserved Slots(in Pop-up)
            onReserveSlotConfirmAssignBtnPress: async function () {
                debugger;
                try {
                    const oView = this.getView();
                    const oSelectedItem = oView.byId("idReservedslotsTable").getSelectedItem();
                    if (!oSelectedItem) {
                        sap.m.MessageToast.show("Please select a reserved slot to confirm assignment.");
                        return;
                    }

                    const oSelectedData = oSelectedItem.getBindingContext().getObject();

                    const oDriverName = this.byId("idDriverNameInput").getValue();
                    const oDriverNumber = this.byId("idMobileNumberInput").getValue();
                    const oVehicleType = this.byId("idVehTypeInput").getValue();
                    const oVehicleNumber = this.byId("idVehNumberInput").getValue();
                    const oServiceType = this.byId("idselectTransportType").getSelectedKey();
                    const oSlotNumber = this.byId("idReservedSlotInput").getValue();

                    const oThis = this;
                    const oModel = oView.getModel("ModelV2");

                    // Validation: Check if all fields are filled
                    if (!oDriverName || !oDriverNumber || !oVehicleType || !oVehicleNumber || !oServiceType || !oSlotNumber) {
                        sap.m.MessageBox.error("All fields are required.");
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
                        sap.m.MessageBox.error("Driver Number already existed.");
                        this.byId("idMobileNumberInput").setValueState("Error");
                        this.byId("idMobileNumberInput").setValueStateText("Mobile Number should be unique.");
                        return;
                    }

                    const bVehicleNumberExists = allocatedSlotsData.some(slot => slot.vehicleNumber === oVehicleNumber);
                    if (bVehicleNumberExists) {
                        sap.m.MessageBox.error("Vehicle Number already existed.");
                        this.byId("idVehNumberInput").setValueState("Error");
                        this.byId("idVehNumberInput").setValueStateText("Vehicle Number should be in the format 'AP00AA0000'.");
                        return;
                    }

                    // New entry JSON to Allocated Slots
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
                        debugger
                        oModel.create("/AllocatedSlots", oNewAllocatedSlot, {
                            success: () => {
                                sap.m.MessageBox.success("Slot assigned successfully!");
                                oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
                                resolve();
                            },
                            error: (oError) => {
                                sap.m.MessageBox.error("Failed to assign slot: " + oError.message);
                                reject(oError);
                            }
                        });
                    });

                    // Update the slot status in AllSlots to "Occupied"
                    await new Promise((resolve, reject) => {
                        debugger
                        oModel.update("/AllSlots(" + oSelectedData.reserveSlot.ID + ")", { status: 'Occupied' }, {
                            success: () => {
                                sap.m.MessageBox.success("Slot status changed to Occupied!");
                                oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                                resolve();
                            },
                            error: (oError) => {
                                sap.m.MessageBox.error("Failed to update slot status: " + oError.message);
                                reject(oError);
                            }
                        });
                    });

                    // Send SMS to driver
                    // const driverPhoneFull = "+91" + oDriverNumber;
                    // const messageBody = `Hello ${oDriverName},\n\nPlease park your vehicle at the following slot:\nSlot Number: ${oSlotNumber} \nVehicle Number: ${oVehicleNumber}\n\nThank you.\nBest regards,\nArithcus Global Pvt Ltd.`;

                    // const accountSid = 'AC9418cec2d41b4131132454d424d9f90c';
                    // const authToken = '328ec7413f4a2e353a72b9b3bed216b7';
                    // const fromNumber = '+16187243098';
                    // const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

                    // const payload = {
                    //     To: driverPhoneFull,
                    //     From: fromNumber,
                    //     Body: messageBody
                    // };

                    // await $.ajax({
                    //     url: url,
                    //     type: 'POST',
                    //     headers: {
                    //         'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                    //     },
                    //     data: payload,
                    //     success: function (data) {
                    //         console.log('SMS sent successfully:', data);
                    //         sap.m.MessageToast.show('SMS sent successfully to the driver.');
                    //     },
                    //     error: function (xhr, status, error) {
                    //         console.error('Error sending SMS:', error);
                    //         sap.m.MessageToast.show('Failed to send SMS: ' + error);
                    //     }
                    // });

                    // Remove the reserved slot entry after confirming assignment
                    const sReservedSlotPath = oSelectedItem.getBindingContext().getPath();
                    debugger
                    await new Promise((resolve, reject) => {
                        oModel.remove(sReservedSlotPath, {
                            success: () => {
                                sap.m.MessageToast.show("Reserved slot entry removed successfully.");
                                oThis.getView().byId("idReservedslotsTable").getBinding("items").refresh();
                                resolve();
                            },
                            error: (oError) => {
                                sap.m.MessageBox.error("Failed to remove reserved slot entry: " + oError.message);
                                reject(oError);
                            }
                        });
                    });
                    // Close the dialog
                    this.onAssignReserveSlotConfirmDialog.close();
                } catch (error) {
                    sap.m.MessageBox.error("An error occurred: " + error.message);
                    console.error("Error: ", error);
                }
            },

            //for closing Opened Dialog in Reserved Slots table...
            onCloseReserveSlotConfirm: function () {
                if (this.onAssignReserveSlotConfirmDialog) {
                    this.onAssignReserveSlotConfirmDialog.close();
                }
            },

            //for closing Opened Dialog in Reservations Table...
            onCloseReserveSlotDialog: function () {
                if (this.onRequestConfirmSlotDialog) {
                    this.onRequestConfirmSlotDialog.close();
                }
            },

            //Notifications from Vendor reservation slot details...
            onNotificationPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this._pPopover) {
                    this._pPopover = this.loadFragment("ReserveSlotNotify").then(function (oPopover) {
                        oView.addDependent(oPopover);
                        oPopover.bindElement("");
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            //Data Visualization from Supervisor page, which is fetches the data from All slots Table...
            onGeographicBtnPress: async function () {
                if (!this.onDatavisualizationDialog) {
                    this.onDatavisualizationDialog = await this.loadFragment("DataVisualization")
                }
                this.onDatavisualizationDialog.open();
            },
            //Having one calling method in Init Function...(for this only)
            _setParkingLotModel: function () {
                // Fetch data from OData service
                var oModel = this.getOwnerComponent().getModel("ModelV2");
                var that = this;

                oModel.read("/AllSlots", {
                    success: function (oData) {
                        var aItems = oData.results;
                        var availableCount = aItems.filter(item => item.status === "Available").length;
                        var occupiedCount = aItems.filter(item => item.status === "Occupied").length;
                        var ReservedCount = aItems.filter(item => item.status === "Reserved").length;

                        var aChartData = {
                            Items: [
                                {
                                    status: "Available",
                                    Count: availableCount
                                },
                                {
                                    status: "Occupied",
                                    Count: occupiedCount
                                },
                                {
                                    status: "Reserved",
                                    Count: ReservedCount
                                }
                            ]
                        };
                        var oParkingLotModel = new JSONModel();
                        oParkingLotModel.setData(aChartData);
                        that.getView().setModel(oParkingLotModel, "ParkingLotModel");
                    },
                    error: function (oError) {
                        // Handle error
                        console.error(oError);
                    }
                });
            },



            // onScanSuccess: function (oEvent) {
            //     if (oEvent.getParameter("cancelled")) {
            //         MessageToast.show("Scan cancelled", { duration: 1000 });
            //     } else {
            //         const vehicleNumber = oEvent.getParameter("text");
            //         if (vehicleNumber) {
            //             MessageBox.confirm(
            //                 `Are you sure you want to unassign the slot for vehicle number '${vehicleNumber}'?`,
            //                 {
            //                     actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //                     onClose: async function (sAction) {
            //                         if (sAction === MessageBox.Action.YES) {
            //                             try {
            //                                 await this._unassignSlotByVehicleNumber(vehicleNumber);
            //                                 MessageToast.show("Slot unassigned successfully.");
            //                             } catch (error) {
            //                                 MessageBox.error("Failed to unassign slot or add to history.");
            //                                 console.error("Error: ", error);
            //                             }
            //                         }
            //                     }.bind(this)
            //                 }
            //             );
            //         } else {
            //             MessageToast.show("No data found in barcode.");
            //         }
            //     }
            // },


            // _unassignSlotByVehicleNumber: async function (vehicleNumber) {
            //     const oModel = this.getView().getModel("ModelV2");

            //     // Retrieve the slot data based on the vehicle number
            //     const sFilter = new sap.ui.model.Filter("vehicleNumber", sap.ui.model.FilterOperator.EQ, vehicleNumber);
            //     const slotData = await new Promise((resolve, reject) => {
            //         oModel.read("/AllocatedSlots", {
            //             filters: [sFilter],
            //             success: function (oData) {
            //                 resolve(oData.results[0]); // Assuming vehicleNumber is unique
            //             },
            //             error: function (oError) {
            //                 reject(oError);
            //             }
            //         });
            //     });

            //     if (!slotData) {
            //         throw new Error("No allocated slot found for the vehicle number.");
            //     }

            //     // Remove the entry from AllocatedSlots
            //     const sPath = `/AllocatedSlots(${slotData.ID})`;
            //     await new Promise((resolve, reject) => {
            //         oModel.remove(sPath, {
            //             success: function () {
            //                 resolve();
            //             },
            //             error: function (oError) {
            //                 reject(oError);
            //             }
            //         });
            //     });

            //     // Create a new entry in TotalHistory
            //     const oHistoryPayload = {
            //         vehicleType: slotData.vehicleType,
            //         vehicleNumber: slotData.vehicleNumber,
            //         driverNumber: slotData.driverNumber,
            //         driverName: slotData.driverName,
            //         serviceType: slotData.serviceType,
            //         inTime: slotData.inTime,
            //         outTime: new Date().toISOString(),
            //         slotNumber: slotData.slotNum.slotNumber
            //     };

            //     await new Promise((resolve, reject) => {
            //         oModel.create("/TotalHistory", oHistoryPayload, {
            //             success: function () {
            //                 resolve();
            //             },
            //             error: function (oError) {
            //                 reject(oError);
            //             }
            //         });
            //     });

            //     // Update the slot status in All Slots to "Available"
            //     const sSlotPath = `/AllSlots(${slotData.slotNum.ID})`;
            //     await new Promise((resolve, reject) => {
            //         oModel.update(sSlotPath, { status: 'Available' }, {
            //             success: function () {
            //                 resolve();
            //             },
            //             error: function (oError) {
            //                 reject(oError);
            //             }
            //         });
            //     });

            //     // Refresh the tables
            //     //this.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
            //     //this.getView().byId("idHistoryTable").getBinding("items").refresh();
            //     //this.getView().byId("allSlotsTable").getBinding("items").refresh();
            // },


            onScanSuccess: async function (oEvent) {
                debugger;
                if (oEvent.getParameter("cancelled")) {
                    MessageToast.show("Scan cancelled", { duration: 1000 });
                } else {
                    var VehicleNumber = oEvent.getParameter("text");

                    var sVehicleNumber = VehicleNumber.split(':').pop().trim();

                    if (sVehicleNumber) {
                        // Fetch the model
                        var oModel = this.getView().getModel("ModelV2");
                        var oThis = this;

                        // Find the allocated slot using the vehicle number
                        try {
                            const allocatedSlotData = await new Promise((resolve, reject) => {
                                debugger;
                                oModel.read("/AllocatedSlots", {
                                    filters: [new sap.ui.model.Filter("vehicleNumber", sap.ui.model.FilterOperator.EQ, sVehicleNumber)],
                                    success: function (oData) {
                                        resolve(oData.results);
                                    },
                                    error: function (oError) {
                                        reject(oError);
                                    }
                                });
                            });

                            const oAllocatedData = allocatedSlotData[0]; // Assuming only one slot per vehicle number

                            MessageBox.confirm(
                                `Are you sure you want to unassign slot for vehicle '${sVehicleNumber}'?`,
                                {
                                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                    onClose: async function (sAction) {
                                        if (sAction === MessageBox.Action.YES) {
                                            try {
                                                // Remove the entry from AllocatedSlots
                                                const sKey = oModel.createKey("/AllocatedSlots", { ID: oAllocatedData.ID });

                                                // Remove the entry from AllocatedSlots
                                                await new Promise((resolve, reject) => {
                                                    oModel.remove(sKey, {
                                                        success: resolve,
                                                        error: reject
                                                    });
                                                });

                                                //Add entry to History table
                                                const oHistoryPayload = {
                                                    vehicleType: oAllocatedData.vehicleType,
                                                    vehicleNumber: oAllocatedData.vehicleNumber,
                                                    driverNumber: oAllocatedData.driverNumber,
                                                    driverName: oAllocatedData.driverName,
                                                    serviceType: oAllocatedData.serviceType,
                                                    inTime: oAllocatedData.inTime,
                                                    outTime: new Date().toISOString(),
                                                    slotNumber: oAllocatedData.ID
                                                };

                                                await new Promise((resolve, reject) => {
                                                    debugger
                                                    oModel.create("/TotalHistory", oHistoryPayload, {
                                                        success: resolve,
                                                        error: reject
                                                    });
                                                });

                                                // Update the slot status in All Slots table
                                                const sSlotPath = `/AllSlots(${oAllocatedData.slotNum.ID})`;
                                                debugger
                                                await new Promise((resolve, reject) => {
                                                    oModel.update(sSlotPath, { status: 'Available' }, {
                                                        success: resolve,
                                                        error: reject
                                                    });
                                                });

                                                sap.m.MessageToast.show("Slot status updated to 'Available'.");

                                                // Refresh the tables
                                                //oThis.getView().byId("AllocatedSlotsTable").getBinding("items").refresh();
                                                //oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                                                //oThis.getView().byId("allSlotsTable").getBinding("items").refresh();
                                                //oThis.getView().byId("idparkingLotSelect").getBinding("items").refresh();

                                            } catch (error) {
                                                MessageBox.error("Failed to unassign slot or add to history.");
                                                console.error("Error: ", error);
                                            }
                                        }
                                    }
                                }
                            );
                        } catch (error) {
                            MessageBox.error("Error finding allocated slot: " + error.message);
                        }
                    }
                }
            },








            //for closing Pie Chart for Data visualization...
            onClosePiechartDialog: function () {
                if (this.onDatavisualizationDialog) {
                    this.onDatavisualizationDialog.close();
                }
            },
            onRefresh: function () {
                this.getView().getModel("ModelV2").refresh(true);
            },
        });
    });
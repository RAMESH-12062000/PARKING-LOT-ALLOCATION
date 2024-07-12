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

        return Controller.extend("com.app.parkinglotallocation.controller.Home", {

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

                var oReservedSlotsModel = new JSONModel({
                    ReservedSlots: []
                });
                this.getView().setModel(oReservedSlotsModel, "reservedSlotsModel");
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

            //Assign a slot to vehicle...
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
                    this.getView().byId("idvehicleNumber").setValueStateText("Vehicle Number follows this pattern 'AP09AB1234'");
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
                    this.getView().byId("iddriverNumber").setValueStateText("Driver Number should contain '10 Digits!'");

                    valid = false;
                } else {
                    this.getView().byId("iddriverNumber").setValueState(sap.ui.core.ValueState.None);
                }

                if (sDriverName.length < 4) {
                    this.getView().byId("iddriverName").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("iddriverName").setValueStateText("Driver Name contains at least '4Letters!'");
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
                    console.error("Error: ", error);
                    MessageBox.error("Some technical issue");
                }
            },

            //Refresh Btn in AllSlots Table
            onRefreshBtnPress: function () {
                this.getView().byId("allSlotsTable").getBinding("items").refresh();
            },

            onUnAssignPress: async function (oEvent) {
                debugger;
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
                                            this.getView().byId("allSlotsTable").getBinding("items").refresh();
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


            //Search anything from AllocatedSlots Table...(this way also works fine)
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
            onRequestConfirmSlotPress: async function () {
                var oSelected = this.byId("idReservationsTable").getSelectedItem();
                if (oSelected) {
                    debugger
                    var oID = oSelected.getBindingContext().getObject().ID
                    var oVendorName = oSelected.getBindingContext().getObject().vendorName
                    var oVendorNumber = oSelected.getBindingContext().getObject().vendorNumber
                    var oDriverName = oSelected.getBindingContext().getObject().driverName
                    var oDriverNumber = oSelected.getBindingContext().getObject().driverName
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
                    MessageToast.show("Please Select a Vendor to Confirm A Slot..!")
                }
            },

            //After recieving a request from vendor then the Admin will Accept that request and reserve a slot for him...
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
            }

        });
    });
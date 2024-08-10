sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    function (Controller, JSONModel, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("com.app.vendorpage.controller.Vendor", {
            onInit: function () {

            },

            //without validation checks code refferal...
            // onSubmitPress: async function () {
            //     debugger
            //     var sVendorName = this.getView().byId("idVendornameInput").getValue();
            //     var sVendorNumber = this.getView().byId("idVendorNumberInput").getValue();
            //     var sDriverName = this.getView().byId("idDrivernameInput").getValue();
            //     var sDriverNumber = this.getView().byId("idDriverNumberInput").getValue();
            //     var sVehicleType = this.getView().byId("idVehTypeInput").getValue();
            //     var sVehicleNumber = this.getView().byId("idVehNumberInput").getValue();
            //     var oThis = this

            //     const reservationModel = new sap.ui.model.json.JSONModel({
            //         vendorName: sVendorName,
            //         vendorNumber: sVendorNumber,
            //         driverName: sDriverNumber,
            //         driverNumber: sDriverName,
            //         vehicleType: sDriverName,
            //         vehicleNumber: sVehicleType,
            //         vehicleNumber: sVehicleNumber
            //     });
            //     this.getView().setModel(reservationModel, "reservationModel");
            //     const oPayload = this.getView().getModel("reservationModel").getProperty("/");
            //     const oModel = this.getView().getModel("ModelV2");

            //     console.log("Payload: ", oPayload);

            //     try {
            //         await this.createData(oModel, oPayload, "/Reservations");
            //         debugger
            //         //this.getView().byId("idReservationsTable").getBinding("items").refresh();
            //         MessageToast.show("Your Details registerd successfully..!");
            //         this.getView().byId("idVendornameInput").setValue("");
            //         this.getView().byId("idVendorNumberInput").setValue("");
            //         this.getView().byId("idDrivernameInput").setValue("");
            //         this.getView().byId("idDriverNumberInput").setValue("");
            //         this.getView().byId("idVehTypeInput").setValue("");
            //         this.getView().byId("idVehNumberInput").setValue("");
            //     } catch (error) {
            //         console.error("Error: ", error);
            //         MessageBox.error("Some technical issue");
            //     }
            // },
            onSubmitPress: async function () {
                debugger;
                var sVendorName = this.getView().byId("idVendornameInput").getValue();
                var sVendorNumber = this.getView().byId("idVendorNumberInput").getValue();
                var sDriverName = this.getView().byId("idDrivernameInput").getValue();
                var sDriverNumber = this.getView().byId("idDriverNumberInput").getValue();
                var sVehicleType = this.getView().byId("idVehTypeInput").getValue();
                var sVehicleNumber = this.getView().byId("idVehNumberInput").getValue();
                var sServiceType = this.getView().byId("idTypeofTransport").getSelectedKey();
                var oThis = this;
                let bValid = true;

                // Validate all required fields
                if (!sVendorName || !sVendorNumber || !sDriverName || !sDriverNumber || !sVehicleType || !sVehicleNumber || !sServiceType) {
                    MessageBox.error("All fields are required.");
                    return;
                }

                // Validate name length
                if (sVendorName.length < 4 || sDriverName.length < 4 || sVehicleType.length < 3) {
                    MessageBox.error("Names & Vehicle Type must contain at least 3 to 4 letters.");
                    this.getView().byId("idVendornameInput").setValueState("Error").setValueStateText("Names Vehicle Type should be '3 to 4 Letters'.");
                    this.getView().byId("idDrivernameInput").setValueState("Error").setValueStateText("Names Vehicle Type should be '3 to 4 Letters'.");
                    this.getView().byId("idVehTypeInput").setValueState("Error").setValueStateText("Names Vehicle Type should be '3 to 4 Letters'.");
                    bValid = false;
                } else {
                    this.getView().byId("idVendornameInput").setValueState("None");
                    this.getView().byId("idDrivernameInput").setValueState("None");
                    this.getView().byId("idVehTypeInput").setValueState("None");
                }

                // Validate phone numbers and vehicle number
                if (!/^\d{10}$/.test(sVendorNumber)) {
                    this.getView().byId("idVendorNumberInput").setValueState("Error").setValueStateText("Mobile number must be a '10-digit number'.");
                    bValid = false;
                } else {
                    this.getView().byId("idVendorNumberInput").setValueState("None");
                }

                if (!/^\d{10}$/.test(sDriverNumber)) {
                    this.getView().byId("idDriverNumberInput").setValueState("Error").setValueStateText("Mobile number must be a '10-digit number'.");
                    bValid = false;
                } else {
                    this.getView().byId("idDriverNumberInput").setValueState("None");
                }

                if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(sVehicleNumber)) {  // Example format: XX00XX0000
                    this.getView().byId("idVehNumberInput").setValueState("Error").setValueStateText("Vehicle number format Should be like this 'AP09AA1234'.");
                    bValid = false;
                } else {
                    this.getView().byId("idVehNumberInput").setValueState("None");
                }

                if (!sServiceType) {
                    this.getView().byId("idTypeofTransport").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("idTypeofTransport").setValueStateText("Select Service Type in 'Dropdown'");
                    bValid = false;
                } else {
                    this.getView().byId("idTypeofTransport").setValueState(sap.ui.core.ValueState.None);
                }

                if (!bValid) {
                    return;
                }

                // Check if vendor mobile number, driver mobile number, or vehicle number already exists
                var oModel = this.getView().getModel("ModelV2");
                var bVendorNumberExists = await this.checkIfExists(oModel, "/Reservations", "vendorNumber", sVendorNumber);
                var bDriverNumberExists = await this.checkIfExists(oModel, "/Reservations", "driverNumber", sDriverNumber);
                var bVehicleNumberExists = await this.checkIfExists(oModel, "/Reservations", "vehicleNumber", sVehicleNumber);

                if (bVendorNumberExists || bDriverNumberExists || bVehicleNumberExists) {
                    MessageBox.error("Vendor number, driver number, or vehicle number already exists.");
                    return;
                }

                const reservationModel = new sap.ui.model.json.JSONModel({
                    vendorName: sVendorName,
                    vendorNumber: sVendorNumber,
                    driverName: sDriverName,
                    driverNumber: sDriverNumber,
                    vehicleType: sVehicleType,
                    vehicleNumber: sVehicleNumber,
                    serviceType: sServiceType,
                    inTime: new Date().toISOString()
                });

                this.getView().setModel(reservationModel, "reservationModel");
                const oPayload = this.getView().getModel("reservationModel").getProperty("/");
                console.log("Payload: ", oPayload);

                try {
                    await this.createData(oModel, oPayload, "/Reservations");
                    MessageBox.success("Your details have been registered for requesting a slot and sent to the warehouse..!");

                    // After successfully passing the test cases and created, the details will be cleared...
                    this.getView().byId("idVendornameInput").setValue("");
                    this.getView().byId("idVendorNumberInput").setValue("");
                    this.getView().byId("idDrivernameInput").setValue("");
                    this.getView().byId("idDriverNumberInput").setValue("");
                    this.getView().byId("idVehTypeInput").setValue("");
                    this.getView().byId("idVehNumberInput").setValue("");
                    this.getView().byId("idTypeofTransport").setSelectedKey("");
                } catch (error) {
                    console.error("Error: ", error);
                    MessageBox.error("Some technical issue");
                }
            },
            // This one checks the numbers if they already exist...
            checkIfExists: async function (oModel, sEntitySet, sProperty, sValue) {
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

            onCancelPress: function () {
                // Clear button functionality
            },

            //If click on the Book a slot function then a Pop-up slowly appear...
            onBookSlotPress: function () {
                var oLoginContainer = this.byId("idVBoxLoginContainer");
                var oMainContainer = this.byId("idVBoxMain");
                var oDescriptionContainer = this.byId("idVBoxDescription");

                if (oLoginContainer.hasStyleClass("hidden")) {
                    oLoginContainer.removeStyleClass("hidden");
                    oLoginContainer.addStyleClass("slideDown");
                    oLoginContainer.addStyleClass("rightAligned");

                    oMainContainer.removeStyleClass("centered");
                    oMainContainer.addStyleClass("leftAligned");

                    oDescriptionContainer.addStyleClass("leftAligned");
                } else {
                    oLoginContainer.addStyleClass("hidden");
                    oLoginContainer.removeStyleClass("slideDown");
                    oLoginContainer.removeStyleClass("rightAligned");

                    oMainContainer.removeStyleClass("leftAligned");
                    oMainContainer.addStyleClass("centered");

                    oDescriptionContainer.removeStyleClass("leftAligned");
                }
            },

            onNotifyReservationsBtnPress: async function () {
                if (!this.onNotifyAcceptRejectDialog) {
                    this.onNotifyAcceptRejectDialog = await this.loadFragment("ReservationAcceptReject")
                }
                this.onNotifyAcceptRejectDialog.open();
            },
        });
    });

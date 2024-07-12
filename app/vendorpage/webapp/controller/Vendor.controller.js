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
                var oThis = this;
            
                // Validate all required fields
                if (!sVendorName || !sVendorNumber || !sDriverName || !sDriverNumber || !sVehicleType || !sVehicleNumber) {
                    MessageBox.error("All fields are required.");
                    return;
                }
            
                // Validate name length
                if (sVendorName.length < 4 || sDriverName.length < 4) {
                    MessageBox.error("Vendor and Driver names must contain at least 4 letters.");
                    return;
                }
            
                // Validate phone numbers and vehicle number
                if (!/^\d{10}$/.test(sVendorNumber)) {
                    this.getView().byId("idVendorNumberInput").setValueState("Error").setValueStateText("Mobile number must be a '10-digit number'.");
                    return;
                } else {
                    this.getView().byId("idVendorNumberInput").setValueState("None");
                }
            
                if (!/^\d{10}$/.test(sDriverNumber)) {
                    this.getView().byId("idDriverNumberInput").setValueState("Error").setValueStateText("Mobile number must be a '10-digit number'.");
                    return;
                } else {
                    this.getView().byId("idDriverNumberInput").setValueState("None");
                }
            
                if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(sVehicleNumber)) {  // Example format: XX00XX0000
                    this.getView().byId("idVehNumberInput").setValueState("Error").setValueStateText("Vehicle number format Should be like this 'AP09AA1234'.");
                    return;
                } else {
                    this.getView().byId("idVehNumberInput").setValueState("None");
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
                    vehicleNumber: sVehicleNumber
                });
            
                this.getView().setModel(reservationModel, "reservationModel");
                const oPayload = this.getView().getModel("reservationModel").getProperty("/");
                console.log("Payload: ", oPayload);
            
                try {
                    await this.createData(oModel, oPayload, "/Reservations");
                    debugger;
                    MessageToast.show("Your details registered successfully!");
                    //After succefully pass the test cases and create and Cleared...
                    this.getView().byId("idVendornameInput").setValue("");
                    this.getView().byId("idVendorNumberInput").setValue("");
                    this.getView().byId("idDrivernameInput").setValue("");
                    this.getView().byId("idDriverNumberInput").setValue("");
                    this.getView().byId("idVehTypeInput").setValue("");
                    this.getView().byId("idVehNumberInput").setValue("");
                } catch (error) {
                    console.error("Error: ", error);
                    MessageBox.error("Some technical issue");
                }
            },
            //this one checking the Numbers if already existed...
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
                const oLoginContainer = this.getView().byId("idVBoxLoginContainer");
                oLoginContainer.toggleStyleClass("slideDown");
                oLoginContainer.toggleStyleClass("hidden");
            }
        });
    });

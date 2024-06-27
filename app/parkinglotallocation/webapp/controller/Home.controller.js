sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("com.app.parkinglotallocation.controller.Home", {
            onInit: function () {

            },
            onLoginPress: async function () {
                debugger
                const oRouter = this.getOwnerComponent().getRouter();
                MessageToast.show("Successfully Login..!");
                oRouter.navTo("RouteSupervisor")
            },
        });
    });

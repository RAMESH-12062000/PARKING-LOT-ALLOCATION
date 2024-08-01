sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter"
  ],
  function (BaseController, Fragment, Sorter) {
    "use strict";

    return BaseController.extend("com.app.parkinglotallocation.controller.BaseController", {
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
      loadFragment: async function (sFragmentName) {
        const oFragment = await Fragment.load({
          id: this.getView().getId(),
          name: `com.app.parkinglotallocation.fragments.${sFragmentName}`,
          controller: this
        });
        this.getView().addDependent(oFragment);
        return oFragment
      },

      createData: function (oModel, oPayload, sPath) {
        return new Promise(function (resolve, reject) {
          oModel.create(sPath, oPayload, {
            refreshAfterChange: true,
            success: function () {
              resolve();
            },
            error: function (oError) {
              reject(oError);
            }
          });
        });
      },
      //Status Colour...
      statusColorFormatter: function (sStatus) {
        switch (sStatus) {
          case "Occupied":
            return "Error"; // Red
          case "Available":
            return "Success"; // Green
          case "Reserved":
            return "Warning"; // Orange
          default:
            return "None"; // Default color
        }
      },

      //Sorting in AllSlots Table...
      onSortingAllSlotsTable: function () {
        this.byId("allSlotsTable").getBinding("items").sort(new Sorter("slotNumber", false));
      },
      //Sorting in History Table...
      onSortingHistoryTable: function () {
        this.byId("idHistoryTable").getBinding("items").sort(new sap.ui.model.Sorter("slotNumber", false));
      },
      //Sorting in Allocated Slots Table...
      onSortBtnAllocatedSlots: function () {
        var oTable = this.byId("AllocatedSlotsTable");
        var oBinding = oTable.getBinding("items");
        var oSorter = new Sorter("slotNum/slotNumber", false); // 'false' for ascending, 'true' for descending..
        // Apply the sorter to the binding..
        oBinding.sort(oSorter);
      },
    });
  }
);
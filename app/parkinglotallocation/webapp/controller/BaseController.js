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

      onFilterButtonPress: function () {
        var oComboBox = this.byId("idComboAllslots");
        var bVisible = oComboBox.getVisible();
        oComboBox.setVisible(!bVisible);
      },

      //Filter by Status and Service Type...
      onFilterStatusChange: function (oEvent) {
        var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
        var oTable = this.byId("allSlotsTable");
        var oBinding = oTable.getBinding("items");

        var aFilters = [];
        if (sSelectedKey === "Available" || sSelectedKey === "Occupied" || sSelectedKey === "Reserved") {
          aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sSelectedKey));
        } else if (sSelectedKey === "InBound" || sSelectedKey === "OutBound") {
          aFilters.push(new sap.ui.model.Filter("serviceType", sap.ui.model.FilterOperator.EQ, sSelectedKey));
        }
        oBinding.filter(aFilters);
      },

      //Filtered Available slots based on Service Type...
      onServiceTypeChange: function (oEvent) {
        var sServiceType = oEvent.getSource().getSelectedKey();
        var oSlotsComboBox = this.getView().byId("idparkingLotSelect");

        if (sServiceType) {
          var aFilters = [
            new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Available"),
            new sap.ui.model.Filter("serviceType", sap.ui.model.FilterOperator.EQ, sServiceType)
          ];
          oSlotsComboBox.getBinding("items").filter(aFilters);
        } else {
          oSlotsComboBox.getBinding("items").filter([]);
        }
      }

    });
  }
);
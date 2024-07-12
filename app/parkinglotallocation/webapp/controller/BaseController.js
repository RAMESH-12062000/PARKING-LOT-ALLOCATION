sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
  ],
  function (BaseController, Fragment) {
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
      }
    });
  }
);
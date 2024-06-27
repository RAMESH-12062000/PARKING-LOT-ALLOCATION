sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.parkinglotallocation.controller.BaseController", {
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
      loadFragment: async function (sFragmentName) {
        const oFragment = await oFragment.load({
          id: this.getView().getId(),
          name: `com.app.parkinglotallocation.fragments.${sFragmentName}`,
          controller: this
        });
        this.getView().addDependent(oFragment);
        return oFragment
      },
    });
  }
);

sap.ui.define([
    "sap/ui/core/UIComponent",
    "interactivebot/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("interactivebot.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            const oChatModel = new sap.ui.model.json.JSONModel({
                sessions: {}
            });
            this.setModel(oChatModel, "chat");

            // enable routing
            this.getRouter().initialize();
        }
    });
});
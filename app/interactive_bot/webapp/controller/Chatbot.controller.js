sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("interactivebot.controller.Chatbot", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("chatbot").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sessionId = oEvent.getParameter("arguments").sessionId;

            // pass sessionId to ChatContainer controller
            const oChatContainer = this.byId("chatContainer");
            if (oChatContainer) {
                oChatContainer.getController().loadSession(sessionId);
            }
        }

    });
});
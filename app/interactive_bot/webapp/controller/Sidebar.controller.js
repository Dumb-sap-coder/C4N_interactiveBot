sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/StandardListItem"
], (Controller, StandardListItem) => {
    "use strict";

    return Controller.extend("interactivebot.controller.Sidebar", {
        onInit() {
            this.getOwnerComponent().getRouter().navTo("nochat");
            this._loadChatList();
            sap.ui.getCore().getEventBus().subscribe("chat", "sessionUpdated", this._loadChatList, this);
            //sap.ui.getCore().getEventBus().publish("chat", "forceReset");
        },

        _loadChatList() {
            const oList = this.byId("_IDGenList");
            oList.removeAllItems();

            const sessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");

            Object.keys(sessions).reverse().forEach(sessionId => {
                const title = sessions[sessionId].title || "New Chat";

                // Skip empty or default "New Chat" sessions
                if (!title || title === "New Chat") {
                    return;
                }

                const item = new StandardListItem({
                    title: title,
                    type: "Active"
                });
                item.data("sessionId", sessionId);
                oList.addItem(item);
            });
        },


        onSessionSelect(oEvent) {
            const sessionId = oEvent.getParameter("listItem").data("sessionId");
            // Publish event to ChatContainer
            sap.ui.getCore().getEventBus().publish("chat", "loadSession", { sessionId });
        },
        onNewChat() {
            // this._cleanupEmptySessions();
            // const newId = "temp_" + Date.now();

            // Notify ChatContainer to load this new session
            sap.ui.getCore().getEventBus().publish("chat", "resetChatContainer" );

            console.log("New chat started:", newId);
        },

      



    });
});
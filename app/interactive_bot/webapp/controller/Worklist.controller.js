sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/export/Spreadsheet"
], function (Controller, JSONModel, History, Spreadsheet) {
    "use strict";

    return Controller.extend("interactivebot.controller.Worklist", {

        onInit: function () {
            // Dummy data
            const aDummyLogs = [
                {
                    lognumber: "000000000000001",
                    object: "/SAPSLL/CUHD_MAP",
                    subobject: "/SAPSLL/CUHD_MAP_INB",
                    extnumber: "1D0A1234",
                    aldate: "2025-08-20",
                    altime: "10:24:23",
                    aluser: "RFCUSER",
                    text: "No schedule lines due for delivery up to selected date"
                },
                {
                    lognumber: "000000000000002",
                    object: "/SAPSLL/CUHD_MAP",
                    subobject: "/SAPSLL/CUHD_MAP_INB",
                    extnumber: "1D0A5678",
                    aldate: "2025-08-21",
                    altime: "11:15:12",
                    aluser: "RFCUSER",
                    text: "Customer BPUS21 does not exist (please change entry in plant US21)"
                }
            ];

            const oModel = new JSONModel({ WorklistItems: aDummyLogs });
            this.getView().setModel(oModel);
        },

        onAskBot: function () {
            const oTable = this.byId("worklistTable");
            const iSelectedIndex = oTable.getSelectedIndex();
            let oData = null;

            if (iSelectedIndex >= 0) {
                oData = oTable.getContextByIndex(iSelectedIndex).getObject();
            }

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            // Navigate to the Chatbot view
            oRouter.navTo("chatbot"); 

            // After navigation, delay EventBus publish slightly
            const bus = sap.ui.getCore().getEventBus();

            if (oData) {
                const sessionId = "session_" + Date.now();
                setTimeout(() => {
                    bus.publish("chat", "loadSessionWithText", {
                        sessionId,
                        text: oData.text,
                        rowData: oData
                    });
                }, 300); 
            } else {
                setTimeout(() => {
                    bus.publish("chat", "resetChatContainer");
                });
            }
        },

        onExportExcel: function () {
            const oTable = this.byId("worklistTable");
            const oBinding = oTable.getBinding("rows");

            const aCols = [
                { label: "Log Number", property: "lognumber" },
                { label: "Object", property: "object" },
                { label: "Subobject", property: "subobject" },
                { label: "External Number", property: "extnumber" },
                { label: "Date", property: "aldate" },
                { label: "Time", property: "altime" },
                { label: "User", property: "aluser" },
                { label: "Text", property: "text" }
            ];

            const oSettings = {
                workbook: { columns: aCols },
                dataSource: oBinding,
                fileName: "WorklistExport.xlsx"
            };

            const oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(() => oSheet.destroy());
        },

        onFilterChange: function () {
            const oTable = this.byId("worklistTable");
            const oBinding = oTable.getBinding("rows");

            const aFilters = [];

            const sLog = this.byId("filterLogNumber").getValue();
            const sUser = this.byId("filterUser").getValue();
            const dDate = this.byId("filterDate").getDateValue();

            if (sLog) {
                aFilters.push(new sap.ui.model.Filter("lognumber", sap.ui.model.FilterOperator.Contains, sLog));
            }
            if (sUser) {
                aFilters.push(new sap.ui.model.Filter("aluser", sap.ui.model.FilterOperator.Contains, sUser));
            }
            if (dDate) {
                const sDateStr = dDate.toISOString().split("T")[0];
                aFilters.push(new sap.ui.model.Filter("aldate", sap.ui.model.FilterOperator.EQ, sDateStr));
            }

            oBinding.filter(aFilters);
        },

        onClearFilters: function () {
            this.byId("filterLogNumber").setValue("");
            this.byId("filterUser").setValue("");
            this.byId("filterDate").setValue(null);

            const oTable = this.byId("worklistTable");
            const oBinding = oTable.getBinding("rows");
            oBinding.filter([]); 
        }

    });
});

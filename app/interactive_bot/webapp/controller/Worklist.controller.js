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
                },
                {
                    lognumber: "00000000000001118631",
                    object: "/MM/PUR",
                    subobject: "PO_PROCESS",
                    extnumber: "MAT191",
                    aldate: "2025-08-20",
                    altime: "09:15:10",
                    aluser: "PURUSER",
                    text: "Account assignment mandatory for material 191 (enter acc. ass. cat.)"
                },
                {
                    lognumber: "00000000000001118632",
                    object: "/MM/PLANT",
                    subobject: "MATERIAL",
                    extnumber: "MAT191",
                    aldate: "2025-08-20",
                    altime: "10:05:44",
                    aluser: "PURUSER",
                    text: "Material 191 not maintained in plant LHMP"
                },
                {
                    lognumber: "00000000000001118633",
                    object: "/MM/SUPPLIER",
                    subobject: "VENDOR",
                    extnumber: "SUP100168",
                    aldate: "2025-08-20",
                    altime: "11:12:35",
                    aluser: "PURUSER",
                    text: "Supplier 100168 has not been created for purchasing organization 7050"
                },
                {
                    lognumber: "00000000000001118634",
                    object: "/MM/ORG",
                    subobject: "CONFIG",
                    extnumber: "PORG7050",
                    aldate: "2025-08-21",
                    altime: "08:45:20",
                    aluser: "ADMUSER",
                    text: "Company code 0001 not defined for purchasing organization 7050"
                },
                {
                    lognumber: "00000000000001118635",
                    object: "/SD/PRICING",
                    subobject: "COND",
                    extnumber: "ZPIO",
                    aldate: "2025-08-21",
                    altime: "09:20:41",
                    aluser: "SDUSER",
                    text: "Condition ZPIO is missing in pricing procedure A M RM0000"
                },
                {
                    lognumber: "00000000000001118636",
                    object: "/SD/CUSTOMER",
                    subobject: "MASTER",
                    extnumber: "BP5507",
                    aldate: "2025-08-21",
                    altime: "10:05:18",
                    aluser: "SDUSER",
                    text: "Sold-to party 5507 not maintained for sales area DEZ1 01 01"
                },
                {
                    lognumber: "00000000000001118637",
                    object: "/SD/ORDER",
                    subobject: "SALES",
                    extnumber: "ORD123456",
                    aldate: "2025-08-21",
                    altime: "10:42:50",
                    aluser: "SDUSER",
                    text: "Order is incomplete - maintain the order"
                },
                {
                    lognumber: "00000000000001118638",
                    object: "/SD/DELIVERY",
                    subobject: "CHECK",
                    extnumber: "ORD123456",
                    aldate: "2025-08-21",
                    altime: "11:12:22",
                    aluser: "SDUSER",
                    text: "Order cannot be delivered (see long text)"
                },
                {
                    lognumber: "00000000000001118639",
                    object: "/SD/DELIVERY",
                    subobject: "SPLIT",
                    extnumber: "ITEM000010",
                    aldate: "2025-08-21",
                    altime: "11:30:15",
                    aluser: "SDUSER",
                    text: "Item 000010: delivery split because of different shipping points"
                },
                {
                    lognumber: "00000000000001118640",
                    object: "/MM/SCHED",
                    subobject: "DELIVERY",
                    extnumber: "SCHED001",
                    aldate: "2025-08-21",
                    altime: "11:55:47",
                    aluser: "PURUSER",
                    text: "No schedule lines due for delivery up to selected date"
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

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/HBox",
    "sap/m/VBox"
], function (Controller, MessageToast, Text, HBox, VBox) {
    "use strict";

    if (!window.marked) {
        jQuery.sap.includeScript("libs/marked.min.js");
    }

    const URLS = {
        normalQuery: "https://n8n.archlynk.com/webhook/chat_error_resolution",
    };

    const AUTH = {
        username: "ArchAI_User",
        password: "archAI_user",
        getBasicAuthHeader() {
            return "Basic " + btoa(this.username + ":" + this.password);
        }
    };

    return Controller.extend("interactivebot.controller.ChatContainer", {
        onInit() {
            this._chatSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
            this._sessionId = null;
            this._newSessionFlags = {};

            // Subscribe to event bus: Sidebar tells us which session to load
            // sap.ui.getCore().getEventBus().subscribe("chat", "loadSession", this._onLoadSession, this);
            const bus = sap.ui.getCore().getEventBus();
            bus.subscribe("chat", "loadSession", this._onLoadSession, this);
            bus.subscribe("chat", "resetChatContainer", this._onResetChat, this);
            bus.subscribe("chat", "loadSessionWithText", this._onLoadSessionWithText, this);
        },

        _onResetChat() {
            this._sessionId = null;           // No active session
            this.resetChat();                 // Clear chat container
        },


        _onLoadSessionWithText(channel, event, data) {
            const { sessionId, text, rowData } = data;

            // Create session
            this._chatSessions[sessionId] = { title: "", messages: [] };
            this._newSessionFlags[sessionId] = true;
            this._sessionId = sessionId;

            this.resetChat();

            // Add the row text as first user message
            this._addMessage(text, "user", sessionId);

            // Auto-send it to bot
            this.onSendTextAutomatically(text, sessionId, rowData);
        },

        onSendTextAutomatically(text, sessionId, rowData) {
            const thinking = this._showBotThinking();

            fetch(URLS.normalQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": AUTH.getBasicAuthHeader()
                },
                body: JSON.stringify({ sessionId, query: text, rowData })
            })
                .then(response => response.ok ? response.text() : Promise.reject())
                .then(botReply => {
                    this.byId("chatMessagesBox").removeItem(thinking.container);
                    this.byId("sendButton").setEnabled(true);

                    let reply = botReply;
                    try {
                        const json = JSON.parse(botReply);
                        reply = json.output || json.response || botReply;
                    } catch (e) { }

                    this._addMessage(reply, "bot", sessionId);
                })
                .catch(() => {
                    this.byId("chatMessagesBox").removeItem(thinking.container);
                    this._addMessage("⚠️ Unable to reach the bot. Please try again.", "bot", sessionId);
                    this.byId("sendButton").setEnabled(true);
                });
        },

        _onLoadSession(channelId, eventId, data) {
            const sessionId = data.sessionId;

            // If session doesn't exist yet, create a temporary session
            if (!this._chatSessions[sessionId]) {
                this._chatSessions[sessionId] = { title: "", messages: [] };
                this._newSessionFlags[sessionId] = true;
            } else {
                this._newSessionFlags[sessionId] = false;
            }

            // Set current session
            this._sessionId = sessionId;
            this.resetChat();

            // Render existing messages if any
            const session = this._chatSessions[sessionId];
            session.messages.forEach(msg => this._renderMessage(msg.text, msg.role, msg.timestamp));
        },

        onSend() {
            const oInput = this.getView().byId("messageInput");
            const sMessage = oInput.getValue().trim();
            if (!sMessage) {
                MessageToast.show("Please enter a message");
                return;
            }

            // If no active session, create a real session now
            if (!this._sessionId) {
                this._sessionId = "session_" + Date.now();
                this._chatSessions[this._sessionId] = { title: "", messages: [] };
                this._newSessionFlags[this._sessionId] = true;
            }

            const activeSessionId = this._sessionId;

            this._addMessage(sMessage, "user", activeSessionId);

            const thinking = this._showBotThinking();

            fetch(URLS.normalQuery, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": AUTH.getBasicAuthHeader()
                },
                body: JSON.stringify({ sessionId: activeSessionId, query: sMessage })
            })
                .then(response => response.ok ? response.text() : Promise.reject())
                .then(text => {
                    this.byId("chatMessagesBox").removeItem(thinking.container);
                    this.byId("sendButton").setEnabled(true);

                    let botReply = text;
                    try {
                        const json = JSON.parse(text);
                        botReply = json.output || json.response || text;
                    } catch (e) { }

                    this._addMessage(botReply, "bot", activeSessionId);
                })
                .catch(() => {
                    this.byId("chatMessagesBox").removeItem(thinking.container);
                    this._addMessage("⚠️ Unable to reach the bot. Please try again.", "bot", activeSessionId);
                    this.byId("sendButton").setEnabled(true);
                });

            oInput.setValue("");
        },

        _addMessage(text, role, sessionId) {
            const session = this._chatSessions[sessionId];

            if (role === "user" && this._newSessionFlags[sessionId]) {
                session.title = text.length > 25 ? text.slice(0, 25) + "..." : text;
                this._newSessionFlags[sessionId] = false;
                this._saveSessions(); // Save only real sessions
            }

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            session.messages.push({ text, role, timestamp });

            if (this._sessionId === sessionId) {
                this._renderMessage(text, role, timestamp);
            }
        },



        _renderMessage(text, role, timestamp) {
            const isUser = role === "user";
            const time = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let oMessageText;
            if (role === "bot") {
                const html = this._convertMarkdownToHTML(text);
                oMessageText = new sap.ui.core.HTML({ content: `<div class="botMessage">${html}</div>` });
            } else {
                oMessageText = new Text({ text, wrapping: true }).addStyleClass("userMessage");
            }

            const oTimestampText = new Text({ text: time }).addStyleClass("timestampText");
            const oTimestampHBox = new HBox({ justifyContent: isUser ? "End" : "Start", items: [oTimestampText] });
            const oMessageVBox = new VBox({ items: [oMessageText, oTimestampHBox] });
            const oMessageHBox = new HBox({ justifyContent: isUser ? "End" : "Start", items: [oMessageVBox] });

            this.byId("chatMessagesBox").addItem(oMessageHBox);
            this._scrollToBottom();
        },

        resetChat() {
            this.byId("chatMessagesBox").removeAllItems();
            this.byId("messageInput").setValue("").setVisible(true);
        },

        _saveSessions() {
            localStorage.setItem("chatSessions", JSON.stringify(this._chatSessions));
            sap.ui.getCore().getEventBus().publish("chat", "sessionUpdated");
        },

        _scrollToBottom() {
            const oScroll = this.byId("chatScroll");
            setTimeout(() => {
                if (oScroll && oScroll.getDomRef()) oScroll.scrollTo(0, oScroll.getDomRef().scrollHeight, 500);
            }, 100);
        },

        _showBotThinking() {
            const oMessageText = new Text({ text: "Analyzing...", wrapping: true }).addStyleClass("botMessage botTyping");
            const oTimestampText = new Text({ text: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }).addStyleClass("timestampText");
            const oTimestampHBox = new HBox({ justifyContent: "Start", items: [oTimestampText] });
            const oMessageVBox = new VBox({ items: [oMessageText, oTimestampHBox] });
            const oMessageHBox = new HBox({ justifyContent: "Start", items: [oMessageVBox] });

            this.byId("chatMessagesBox").addItem(oMessageHBox);
            this._scrollToBottom();
            this.byId("sendButton").setEnabled(false);

            return { container: oMessageHBox, textControl: oMessageText };
        },

        _convertMarkdownToHTML(markdownText) {
            if (window.marked) {
                const renderer = new marked.Renderer();
                renderer.link = function (token) {
                    const href = token.href || "#";
                    const text = token.text || token.href || "link";
                    const titleAttr = token.title ? ` title="${token.title}"` : "";
                    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
                };
                return marked.parse(markdownText, { renderer, breaks: true });
            } else return markdownText;
        }
    });
});

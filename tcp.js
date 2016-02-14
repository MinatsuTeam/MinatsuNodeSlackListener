"use strict";
var Net = require("net");
var Log = require('log');
var EventEmitter = require('events').EventEmitter;

class tcp extends EventEmitter {
    constructor(HOST, PORT) {
        super();
        var self = this;
        self.HOST = HOST || "127.0.0.1";
        self.PORT = PORT || "6868";
        self.timeout = 0;
        self.connected = false;
        self.logger = new Log(process.env.TCP_LOG_LEVEL || "info");
        self.client = new Net.Socket();

        self.client.on("error", function() {
            self.connected = false;
            self.logger.debug("Can't connect, trying to reconnect.");
            self.client.destroy();
            self.connect();
        });

        self.client.on("data", function(data) {
            self.logger.debug("Recieved: " + data);

            var dataJson = JSON.parse(data.toString());

            if (!(dataJson instanceof Object)) {
                self.logger.debug("The data is not a object.");
                self.logger.debug("DATA " + self.client.remoteAddress + ": " + dataJson);
                return;
            }

            if (dataJson.event == "sendMessage") self.emit("message", dataJson.message);
        });

        self.client.on("close", function() {
            self.logger.info("TCP connection closed on %s:%s", self.HOST, self.PORT);
            self.connected = false;
        });
    }

    connect() {
        var self = this;
        if (self.timeout > 0) self.logger.debug("Trying to connect in %d seconds.", self.timeout);

        setTimeout(function () {
            self.logger.debug("Trying to connect to TCP");
            self.client.connect(self.PORT, self.HOST, function() {
                self.logger.info("TCP connection success on %s:%s", self.HOST, self.PORT);
                self.connected = true;

                 self.sendRaw({
                    "event" : "connection",
                    "name" : "Node Slack",
                    "type" : "Slack",
                    "versionStandard" : "0.0.1",
                    "versionListener" : "0.0.1"
                });

                self.timeout = 0;
            })
        }, self.timeout * 1000);

        self.timeout = (self.timeout <= 60) ? self.timeout+10 : self.timeout;
    }

    sendRaw(data) {
        if (!this.connected) return this.logger.debug("Trying to send message, but no connection is established.");

        var dataString = JSON.stringify(data);

        this.logger.debug("Sending data to TCP: " + dataString);
        this.client.write(dataString + "\n");
    }

    sendMessage(data) {
        var dataString = {
            "event" : "chatMessage",
            "channel" : data.channel,
            "message" : data.text,
            "from" : data.user
        };

        this.sendRaw(dataString);
    }
}

module.exports = tcp;

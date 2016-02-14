"use strict";
var slack = require("slack-client");
var TCP = require("./tcp.js");

var RtmClient = slack.RtmClient;
var RTM_EVENTS = slack.RTM_EVENTS;

var token = process.env.SLACK_API_CLIENT || '';
console.log(token);
var rtm = new RtmClient(token, {logLevel: 'info'});
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
     tcp.sendMessage(message);
})

var tcp = new TCP();
tcp.connect();

var sendMessages = function(data) {
    if (!Array.isArray(data)) sendMessage(data);

    for (var key in data) {
        console.log(data[key]);
        sendMessage(data[key]);
    }
}

var sendMessage = function(data) {
    if (!(data instanceof Object)) {
        console.log("The data is not a object.")
        console.log("DATA " + tcp.client.remoteAddress + ": " + data);
        return;
    }

    data.message = data.message.replace(new RegExp("(&[0-9|a-f])|({(dark_)?(bl(ue|ack)|gr(ay|een)|aqua|red|purple|yellow|gold|white)})", 'g'), "");

    rtm.sendMessage(data.message, data.channel);
}

tcp.on("message", sendMessages)

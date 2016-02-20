#Minatsu Listener for Slack
##Standards
Send message will hold 2 parameters.

First one is a string for channel/chat.

Second is the message, the message can be either a string or an array.

If its an array the loop through it and then send it to the channel/chat.

Also supports colours and stuff.

On connection to TCP server, the listener will provide some connection information.
* Type
* Name
* IP
* Version Standard - Required
* Version listener

The listener has 2 different versions, Version standard is the listener standard
this version type will be the same over all, incase we make some changes to the
listener standard then this version will increase while version listener is the
version for this specific listener.

So if a plugin or another listener needs to talk to a listener, they just need
to check the version standard to make sure they are sending the correct information.

The only information that is required is the Version Standard, the rest is preferably
but not required.

##Colours
Right now this is just for reference.

When I have more listeners I will make a more permanent list with formatting and such too.

* &0 - {black}
* &1 - {dark_blue}
* &2 - {dark_green}
* &3 - {dark_aqua}
* &4 - {dark_red}
* &5 - {dark_purple}
* &6 - {gold}
* &7 - {gray}
* &8 - {dark_gray}
* &9 - {blue}
* &a - {green}
* &b - {aqua}
* &c - {red}
* &d - {purple}
* &e - {yellow}
* &f - {white}

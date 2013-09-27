/**
 * Main Controller
 * @author: Alex Lazar
 * @extends Ext.data.Controller
 * Chat Controller, handles the chat activity
 */

Ext.define('ModusTalk.controller.Chat', {
    extend : 'Ext.app.Controller',
    config : {
        views   : [
            'Message',
            'ChatPrompt',
            'ChatRoom'
        ],
        refs    : {
            chatPrompt  : 'chat-prompt',
            chatMessage : 'chat-message',
            chatRoom    : 'chat-room'
        },
        control : {
            'chatMessage' : {
                'sendmessage' : 'onSendMessage'
            }

        }
    },

    onSendMessage : function (view, message) {
        var MessagesStore = Ext.getStore('Messages'),
            Message,
            now,
            CurrentUser,
            socket,
            chatPrompt,
            scroller;
        message = message ? message.trim() : '';
        if (message) {
            socket = ModusTalk.app.getController('Socket').socket;
            CurrentUser = ModusTalk.app.currentUser;
            now = new Date();
            chatPrompt = this.getChatPrompt();
            scroller = chatPrompt.container.getScrollable().getScroller();
            Message = Ext.create('ModusTalk.model.Message', {
                name    : CurrentUser ? CurrentUser.name : '?',
                message : message,
                date    : now.toLocaleString()
            });
            MessagesStore.add(Message);
            //MessagesStore.sync();

            socket.emit('typingchange', Message.data);
            Ext.defer(function () {
                scroller.scrollToEnd();
            }, 10);
        }
    },
    updateMessage : function (message) {

        if (message) {
            var MessagesStore = Ext.getStore('Messages'),
                Message = new Ext.create('ModusTalk.model.Message', message),
                chatPrompt = this.getChatPrompt(),
                scroller = chatPrompt.container.getScrollable().getScroller();
            MessagesStore.add(Message);
            //MessagesStore.sync();
            Ext.defer(function () {
                scroller.scrollToEnd();
            }, 100);
        }
    }
})
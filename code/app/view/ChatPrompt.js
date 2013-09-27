/**
 * ChatPrompt
 * @author: Alex Lazar
 * @extends Ext.dataview.List
 * The list of messages sent over the chat
 */
Ext.define('ModusTalk.view.ChatPrompt', {
    extend : 'Ext.dataview.List',
    xtype  : 'chat-prompt',
    config : {
        cls     : 'chat-prompt',
        itemTpl : new Ext.XTemplate(
            ''.concat(
                '<div class="message <tpl if="ModusTalk.app.currentUser.name == name">current</tpl>"><span class="user">{name}</span> : {message}</div>',
                '<div class="time">{[this.getFormatTime(values.date)]}</div>'
            ),
            {
                getFormatTime : function (time) {
                    var hours   = time.getHours().toString().length > 1 ? time.getHours() : '0'+ time.getHours(),
                        minutes = time.getMinutes().toString().length > 1 ? time.getMinutes() : '0'+ time.getMinutes(),
                        seconds = time.getSeconds().toString().length > 1 ? time.getSeconds() : '0'+ time.getSeconds();
                    return hours + ':' + minutes + ':' + seconds;
                }
            }
        ),
        store   : 'Messages'
    }
});
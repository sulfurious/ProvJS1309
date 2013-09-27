/**
 * Main
 * @author: Alex Lazar
 * @extends Ext.Container
 * Main view of the application
 */
Ext.define('ModusTalk.view.Main', {
    extend     : 'Ext.Container',
    xtype      : 'main',

    requires: [
        'ModusTalk.view.UserMenu',
        'ModusTalk.view.ChatRoom',
        'ModusTalk.view.Message'
    ],
    fullscreen : true,
    config     : {
        layout: 'fit',
        items : [
            {
                xtype: 'user-menu'
            },

            {
                xtype : 'chat-room'
            }
        ]
    }
});
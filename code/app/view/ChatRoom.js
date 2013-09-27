Ext.define('ModusTalk.view.ChatRoom', {
    extend : 'Ext.Container',
    xtype  : 'chat-room',

    requires : [
        'ModusTalk.view.ChatPrompt',
        'ModusTalk.view.Message',
        'ModusTalk.view.Video'
    ],

    config : {
        cls        : 'chat-room',
        title      : 'Modus Talk',
        scrollable : null,
        layout     : 'fit',
        items      : [
            {
                xtype : 'chat-video',
                type  : 'remote',
                cls   : 'remote'

            },
            {
                xtype        : 'chat-video',
                type         : 'local',
                remoteCls    : 'remote-video-play',
                remoteWidth  : '25%',
                remoteHeight : '25%'
            },

            {
                xtype  : 'container',
                cls    : 'chat-container',
                layout : 'vbox',
                width  : '25%',
                bottom : 0,
                items  : [
                    {
                        xtype : 'chat-prompt',
                        cls   : 'chat-prompt',
                        flex  : 1
                    },
                    {
                        xtype : 'chat-message',
                        cls   : 'chat-message'
                    }
                ]
            }
        ]
    }
});
Ext.define('ModusTalk.store.Messages', {
    extend   : 'Ext.data.Store',
    requires : [
        'Ext.data.proxy.Memory',
        'ModusTalk.model.Message'
    ],

    config : {
        storeId  : 'Messages',
        autoLoad : true,
        autoSync : true,
        model    : 'ModusTalk.model.Message',
        proxy    : {
            type   : 'memory',
            reader : {
                type : 'json',
                rootProperty : 'messages'
            }
        }
    }
});
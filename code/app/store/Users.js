/**
 * Users Store
 * @author: Alex Lazar
 * @extends Ext.data.Store
 * It is used to define the Users Store with a proxy to local-storage
 */

Ext.define('ModusTalk.store.Users', {
    extend  :'Ext.data.Store',
    requires:[
        'Ext.data.proxy.Memory',
        'ModusTalk.model.User'
    ],

    config  :{
        storeId:'Users',
        model  :'ModusTalk.model.User',
        /*proxy  :{
            type:'sessionstorage',
            id  :'mc-users'
        },*/
        autoLoad:true,
        autoSync: true
    }
});
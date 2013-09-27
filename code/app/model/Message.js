Ext.define('ModusTalk.model.Message', {
    extend : 'Ext.data.Model',

    config : {
        identifier: 'sequential',
        fields:[
            { name:'name', type:'string' },
            { name:'message', type:'string' },
            { name:'date', type:'date' }
        ]
    }
});
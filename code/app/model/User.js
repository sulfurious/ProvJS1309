/**
 * User
 * @author: Alex Lazar
 * @extends Ext.Model
 * It is used to define the User model
 */
Ext.define('ModusTalk.model.User', {
    extend : 'Ext.data.Model',
    config : {
        identifier : {
            type : 'uuid'
        },
        //identifier : 'sequential',
        fields     : [
            { name : 'id', type : 'int' },
            { name : 'name', type : 'string' },
            { name : 'organizer', type : 'boolean'},
            { name : 'code', type : 'string' }
        ]
    }
});
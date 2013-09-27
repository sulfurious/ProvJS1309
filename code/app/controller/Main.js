/**
 * Main Controller
 * @author: Alex Lazar
 * @extends Ext.data.Controller
 * Base controller of the application
 */

Ext.define('ModusTalk.controller.Main', {
    extend          : 'Ext.app.Controller',
    config          : {
        models  : [
            'User'
        ],
        stores  : [
            'Users'
        ],
        views   : [
            'Main',
            'Login',
            'UserMenu'
        ],
        refs    : {
            main  : 'main',
            login : 'login',
            menu  : 'user-menu'
        },
        control : {
            'menu'  : {
                'logout' : 'onLogOut'
            },
            'main'  : {
                'back' : 'onBack'
            },
            'login' : {
                'createsession' : 'onCreateSession',
                'login'         : 'onLogin'
            }

        }
    },
    init: function(app) {

    },
    onBack          : function () {
        var navigationView = this.getMain();
        navigationView.pop();
    },
    onCreateSession : function () {
        var me = this,
            loginForm = this.getLogin(),
            values = loginForm.getValues(),
            User,
            UsersStore = Ext.getStore('Users'),
            callback,
            UserObject;

        if (values['create_name']) {
            UserObject = { name: values['create_name'] };

            callback = function(data) {

                UserObject.code = data.code;
                UserObject.organizer = true;
                User = new Ext.create('ModusTalk.model.User', UserObject);
                UsersStore.add(User);
                UsersStore.sync();
                loginForm && loginForm.destroy();

                Ext.Viewport.add({
                    xtype : 'main'
                });
                me.getMenu().updateData(UserObject);
            };
            ModusTalk.app.currentUser = UserObject;
            ModusTalk.app.fireEvent('createsession', UserObject, callback);
        }
    },
    onLogin : function () {
        var me = this,
            loginForm = this.getLogin(),
            values = loginForm.getValues(),
            userData,
            callback;

        if (values['login_name'] && values['code']) {
           userData = { name: values['login_name'], code: values['code'], organizer: false };

           callback = function(data) {
               if (data.success)  {

                   loginForm && loginForm.destroy();
                   Ext.Viewport.add({
                       xtype : 'main'
                   });

                   me.getMenu().updateData(userData);
                   me.hideInputCode();
               } else {
                   Ext.Msg.alert("Oops", data.failureMessage ? data.failureMessage : "Error trying to sign in");
               }

           };
           ModusTalk.app.currentUser = userData;
           ModusTalk.app.fireEvent('login', userData, callback);
        }
    },
    onLogOut        : function () {
        Ext.Msg.confirm('Log Out', 'Are you sure you want to log out?', this.onLogOutConfirm, this);
    },
    onLogOutConfirm : function (button, value, scope) {
        if (button == "yes") {
            this.logoutPerform();
        }
    },
    logoutPerform: function() {
        var app = ModusTalk.app;
        Ext.getStore('Users').removeAll();
        Ext.Viewport.removeAll();
        Ext.Viewport.add({
            xtype : 'login'
        });
        if (app.currentUser.organizer) {
            app.fireEvent('disconnect');
        } else {
            app.fireEvent('logout');
        }
        app.currentUser = null;

        app.getController('WebRtc').endConnection();
    },
    launch          : function () {
        var me = this;
        Ext.Viewport.setMasked({
            xtype : 'loadmask'
        });
        Ext.getStore('Users').load({
            callback : me.onUserLoad,
            scope    : me
        });

    },
    onUserLoad      : function (users) {
        Ext.Viewport.setMasked(false);
        if (users && users.length > 0) {
            Ext.Viewport.add({
                xtype : 'main'
            });
            this.getMenu().updateData(users[0].data);
        } else {
            Ext.Viewport.add({
                xtype : 'login'
            });
        }
    },
    hideInputCode: function() {
        this.getMenu().element.down('#code-show').hide();
    }
})
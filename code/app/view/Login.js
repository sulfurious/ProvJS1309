/**
 * Login
 * @author: Alex Lazar
 * @extends Ext.form.Panel
 * Login view of the app
 */

Ext.define('ModusTalk.view.Login', {
    extend   : 'Ext.form.Panel',
    xtype    : 'login',
    requires : ['Ext.form.FieldSet', 'Ext.field.Email'],
    config   : {
        title : 'Modus Talk',
        cls   : 'login-view',
        items : [
            {
                xtype : 'component',
                cls   : 'title-home',
                html  : '<h1>Welcome to Modus Talk</h1>'
            },
            {
                xtype        : 'fieldset',
                width        : '350px',
                cls          : 'sign-in-form',
                instructions : 'Enter your name and create a new session. A new code will be generated that you will have to share with your correspondent',
                items        : [
                    {
                        xtype       : 'textfield',
                        name        : 'create_name',
                        placeHolder : 'Your Name'
                    },
                    {
                        xtype        : 'button',
                        cls          : 'sign-in',
                        text         : 'Create Session',
                        bubbleEvents : ['createsession'],
                        handler      : function () {
                            this.fireEvent('createsession');
                        }
                    }
                ]
            },

            {
                xtype        : 'fieldset',
                width        : '350px',
                cls          : 'sign-in-form',
                instructions : 'Have a Code already? Enter your name and the code and join the session',
                items        : [
                    {
                        xtype       : 'textfield',
                        name        : 'login_name',
                        placeHolder : 'Your Name'
                    },
                    {
                        xtype       : 'textfield',
                        name        : 'code',
                        maxLength   : 150,
                        placeHolder : 'Your Code (eg. "123")'
                    },
                    {
                        xtype        : 'button',
                        cls          : 'sign-in',
                        text         : 'Sign In',
                        bubbleEvents : ['login'],
                        handler      : function () {
                            this.fireEvent('login');
                        }
                    }
                ]
            },

            {
                xtype : 'component',
                cls   : 'legal-bottom',
                html  : ' <div class="copy-right">Copyrights &copy;Modus Create <br /> Alex Lazar & Tim Eagan</div>'
            }
        ]
    }

});
/**
 * Message
 * @author: Alex Lazar
 * @extends Ext.Toolbar
 * Toolbar that contains the text field and the send button of the chat interface
 */
Ext.define('ModusTalk.view.Message', {
    extend : 'Ext.Toolbar',
    xtype  : 'chat-message',

    config : {
        textfield : null,
        bubbleEvents: ['sendmessage'],
        items     : [
            {
                xtype       : 'textfield',
                placeHolder : 'Your message here ...',
                flex        : 1
            },
            {
                xtype  : 'button',
                text   : 'Send',
                ui     : 'confirm',
                action : 'sendMessage'
            }
        ],

        control : {
            'button' : {
                tap : 'handleButtonTap'
            },
            'textfield' : {
                action : 'handleTextfieldAction',
                keyup  : 'handleTextfieldKey'
            }
        }
    },

    getMessage : function() {
        var field = this.getTextfield();

        if (!field) {
            this.setTextfield(
                field = this.down('textfield')
            );
        }

        return field.getValue();
    },
    cleanMessage: function() {
       this.getTextfield().setValue('');
    },

    handleButtonTap : function() {
        var message = this.getMessage(),
            me = this;

        me.fireEvent('sendmessage', me, message);
        me.cleanMessage();
        Ext.defer(function() {
            me.getTextfield().focus();
        }, 200);
    },

    handleTextfieldAction : function(field, e) {
        if (e.browserEvent.keyCode === 13) {
            this.handleButtonTap();
        }
    },

    handleTextfieldKey : function(field, e) {
        if (e.browserEvent.keyCode !== 13) {
            this.fireEvent('keyup', this, field, e);
        }
    }
});
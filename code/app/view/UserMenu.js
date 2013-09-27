/**
 * UserMenu
 * @author: Alex Lazar
 * @extends Ext.Toolbar
 * The upper user menu, containing the Welcome and the Logout button
 */
Ext.define('ModusTalk.view.UserMenu', {
    extend       : 'Ext.Toolbar',
    xtype        : 'user-menu',
    config       : {
        docked : 'top',
        cls    : 'user-menu',
        tpl    : '<div class="user-name">Welcome, {name}</div> <div id="code-show" class="show-code">Your Session Code: <span class="code">{code}</span></div> <div class="menu-action" data-event="logout">Logout</div>',
        data   : {}
    },
    initialize   : function () {
        this.callParent();
        var me = this;
        me.element.on({
            touchstart : me.onTouchStart,
            touchend   : me.onTouchEnd,
            tap        : me.onTap,
            scope      : me
        });

    },
    onTouchStart : function (evtObj) {
        var btn = evtObj.getTarget('.menu-action', null, true);
        if (btn) {
            Ext.fly(btn).addCls("pressed");
        }
    },
    onTouchEnd   : function (evtObj) {
        var btn = evtObj.getTarget('.menu-action', null, true);
        if (btn) {
            Ext.fly(btn).removeCls("pressed");
        }
    },
    onTap        : function (evtObj) {
        var btn = evtObj.getTarget('.menu-action', null, true),
            event;
        if (btn) {
            event = btn.dom.dataset ? btn.dom.dataset['event'] : btn.dom.getAttribute('data-event');
            this.fireEvent(event);
        }
    }
});

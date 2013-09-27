/**
 * Video
 * @author: Tim Eagan
 * @extends Ext.Video
 * Adds properties and methods to support webRTC
 */
Ext.define('ModusTalk.view.Video', {
    extend : 'Ext.Video',
    xtype  : 'chat-video',

    config : {
        cls          : 'video-component',
        width        : '100%',
        // for local video - used to change styling when remote video is flowing
        remoteCls    : null,
        remoteWidth  : null,
        remoteHeight : null,
        filterClasses: ['grayscale', 'sepia', 'blur'],
        useAudio : true,
        useVideo : true,
        type     : 'local' // local or remote
    },

    initialize : function () {
        this.callParent();

        this.media.setWidth(this.getWidth());
        this.media.setHeight(this.getHeight());

        if (this.getType() == 'local') {
            this.setMuted(true);
            this.setEnableControls(false);
            this.startVideo();
        }
        this.element.on({
            tap: this.handleVideoTap,
            scope: this
        })
    },

    startVideo : function () {
        var constraints = {
            audio : this.getUseAudio(),
            video : this.getUseVideo()
        };

        if (getUserMedia) {
            getUserMedia(constraints, Ext.bind(this.getUserMediaSuccess, this), Ext.bind(this.getUserMediaFailure, this));
        } else {
            console.log("You're broswer does not seem to support WebRTC.");
        }
    },

    stopVideo : function () {
        this.updateUrl('');
        this.stop();
    },

    getUserMediaSuccess : function (stream) {
        this.stream = stream;
        attachMediaStream(this.media.dom, this.stream);
        this.updateUrl(this.stream);

        this.play();
        this.media.show();

        this.fireEvent('streamadded', this);
    },

    getUserMediaFailure : function (error) {
        console.log("getUserMedia error: ", error);
    },

    // called externally by the WebRtc controller once remote video is flowing
    setRemoteStyles     : function () {
        if (this.getRemoteCls()) {
            this.addCls(this.getRemoteCls());
        }
        if (this.getRemoteWidth()) {
            this.setWidth(this.getRemoteWidth());
        }
        if (this.getRemoteHeight()) {
            this.setWidth(this.getRemoteHeight());
        }
    },

    isStreamFlowing : function () {
        var dom = this.media.dom;
        return !(dom.readyState <= dom.HAVE_CURRENT_DATA || dom.paused || dom.currentTime <= 0);
    },
    handleVideoTap: function(evt) {
        var filters = this.getFilterClasses(),
            filter,
            me = this,
            dom = me.media.dom;
        if (!me.inc) {
            me.inc = 1;
        } else {
            me.inc ++;
        }
        if (me.inc > filters.length) {
            delete me.inc;
        }
        filters.forEach(function(item) {
            Ext.fly(dom).removeCls(item)
        });

        if (me.inc) {
            filter = filters[me.inc - 1];
            if (!Ext.fly(dom).hasCls(filter)) {
                Ext.fly(dom).addCls(filter);
            }
        }
    }
});

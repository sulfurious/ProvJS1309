/**
 * WebRTC Controller
 * @author: Timothy Eagan
 * @extends Ext.app.Controller
 * WebRTC Abstraction Controller
 */
Ext.define('ModusTalk.controller.WebRtc', {
    extend : 'Ext.app.Controller',

    config : {
        control : {
            'video' : {
                initialize  : 'onVideoShow',
                streamadded : 'onLocalStreamAdded'
            }
        }
    },

    launch : function (app) {
        var me = this;

        console.log('Launching WebRTC');

        me.stunUrl          = 'stun:stun.l.google.com:19302',
        me.mediaConstraints = {
            'mandatory': {
                'OfferToReceiveAudio': true,
                'OfferToReceiveVideo': true
            }
        };

        me.reset();

        app.on({
            gotpeer           : me.onGotPeer,
            receivertcmessage : me.onReceiveRtcMessage,
            scope             : me
        });

    },

    onVideoShow: function (video) {
        var type = video.getType();

        if (type === 'local') {
            this.localVideo = video;
        } else {
            this.remoteVideo = video;
        }
    },

    onLocalStreamAdded: function (video) {
        console.log('Local stream added');

        this.sendMessage({
            type: 'videoenabled'
        });

        if (video.getType() === 'local') {
            this.startRtc();
        }
    },

    onGotPeer: function () {
        this.gotChannelPeer = true;
        this.startRtc();
    },

    startRtc: function() {
        var me = this;

        if (me.localVideo.stream && me.gotChannelPeer && !me.rtcStarted && me.remoteReady) {
            me.createOffer();
        }
    },

    reset: function() {
        var me = this;

        me.role        = 'offerer'; // offerer or answerer
        me.remoteReady = false;
        me.rtcStarted  = false;

        if (me.pc) {
            me.pc.close();
        }

        me.pc = null;
    },

    createOffer: function () {
        var me = this;

        if (!me.rtcStarted) {
            me.createPeerConnection();
        }

        if (me.pc) {
            me.pc.addStream(me.localVideo.stream);
            me.pc.createOffer(Ext.bind(me.setLocalDescription, me), null, me.mediaConstraints);
        }

        console.log('Offer created', me.pc, me);
    },

    createAnswer: function (msg) {
        var me = this;

        me.role = 'answerer';

        if (!me.rtcStarted) {
            me.createPeerConnection();
        }

        if (me.pc) {
            if (me.localVideo.stream) {
                me.pc.addStream(me.localVideo.stream);
            }
            me.setRemoteDescription( new RTCSessionDescription(msg) );
            me.pc.createAnswer(Ext.bind(me.setLocalDescription, me), null, me.mediaConstraints);
        }
        
        // apply styles to local video
        this.localVideo.setRemoteStyles();

        console.log('Answer created', me.pc, me);
    },

    // create peer connection
    createPeerConnection : function () {
        var me     = this,
            config = {
                iceServers : [
                    { url: me.stunUrl }
                ]
            };

        // Temp requirement for Firefox - Chrome interop
        if (webrtcDetectedBrowser === "chrome") {
            config.optional = [
                { 'DtlsSrtpKeyAgreement': 'true' }
            ];
        }

        try {
            me.pc = new RTCPeerConnection(config);
        } catch (e) {
            Ext.Msg.alert('Oops', 'Can\'t create the RTCPeerConnection. WebRTC may not be supported by this browser');
        }

        console.log('Peer Connection Created', me.pc);

        if (me.pc) {
            me.pc.onicecandidate = Ext.bind(me.onIceCandidate, me);
            me.pc.onconnecting   = Ext.bind(me.onSessionConnecting, me);
            me.pc.onopen         = Ext.bind(me.onSessionOpened, me);
            me.pc.onaddstream    = Ext.bind(me.onRemoteStreamAdded, me);
            me.pc.onremovestream = Ext.bind(me.onRemoteStreamRemoved, me);
        }

        me.rtcStarted = true;
    },

    onIceCandidate: function (event) {
        if (event.candidate) {
            console.log('Setting IceCandidate', arguments);

            this.sendMessage({
                type      : 'candidate',
                label     : event.candidate.sdpMLineIndex,
                id        : event.candidate.sdpMid,
                candidate : event.candidate.candidate
            });
        }
    },

    addRemoteIceCandidate: function (msg) {
        console.log('Adding Remote IceCandidate', arguments);

        var candidate = new RTCIceCandidate({
                sdpMLineIndex : msg.label,
                candidate     : msg.candidate
            });

        this.pc.addIceCandidate(candidate);
    },

    onSessionConnecting: function(event) {
        console.log('onSessionConnecting', arguments);
    },
    onSessionOpened: function(event) {
        console.log('onSessionOpened', arguments);
    },

    onRemoteStreamAdded : function (event) {
        console.log('onRemoteStreamAdded', arguments);

        // add remote video
        this.remoteStream = event.stream;
        this.remoteVideo.getUserMediaSuccess(event.stream);

        // apply styles to local video
        this.localVideo.setRemoteStyles();
    },

    onRemoteStreamRemoved : function (event) {
        console.log('Removing Remote Stream', arguments);
        this.remoteVideo.stopVideo();
    },

    setLocalDescription: function (sessionDesc) {
        console.log('Setting local Description', sessionDesc);
        this.pc.setLocalDescription(sessionDesc);
        this.sendMessage(sessionDesc);
    },

    // set remote description
    setRemoteDescription: function (sessionDesc) {
        console.log('Setting Remote Description', sessionDesc);
        this.pc.setRemoteDescription(sessionDesc);
    },

    endConnection: function() {
        this.reset();
        this.sendMessage({
            type: 'end'
        });
    },

    onRemoteEndConnection : function() {
        console.log('Remote Connection ended', arguments);
        this.reset();
    },

    // send signal message 
    sendMessage: function(message) {
        ModusTalk.app.fireEvent('sendrtcmessage', message);
    },

    // receive signal message
    onReceiveRtcMessage: function(message) {
        var me = this;

        if (message.type === 'offer') {
            me.createAnswer(message);

        } else if (message.type === 'videoenabled') {
            me.remoteReady = true;
            me.startRtc();

        } else if (message.type === 'answer' && me.rtcStarted) {
            me.setRemoteDescription( new RTCSessionDescription(message) );

        } else if (message.type === 'candidate' && me.rtcStarted && !me.remoteVideo.isStreamFlowing()) {
            me.addRemoteIceCandidate(message);

        } else if (message.type === 'end' && me.rtcStarted) {
            me.onRemoteEndConnection();
        }
    }

});
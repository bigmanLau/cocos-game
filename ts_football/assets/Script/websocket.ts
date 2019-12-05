
var websocket = {
    sock: null,
    action: null,
    url: null,
    on_open: function (e) {
        this.onopen(e);
    },

    on_message: function (event) {
        console.log("[onmessage]", event)
        this.onmessage(event)
    },
    onclose: function (e) {

    },
    on_close: function (e) {
        this.onclose(e)
        this.reconnect();
    },

    on_error: function (e) {
        this.onclose(e)
        this.reconnect();
    },

    close: function () {
        // if(this.sock){
        //     this.sock.close();
        //     this.sock = null;
        // }
    },

    connect: function (url) {
        this.url = url;
        this.sock = new WebSocket(url);
        this.sock.binaryType = "arraybuffer";
        this.sock.onopen = this.on_open.bind(this);
        this.sock.onmessage = this.on_message.bind(this);
        this.sock.onclose = this.on_close.bind(this);
        this.sock.onerror = this.on_error.bind(this);
    },

    send_data: function (data) {
        this.sock.send(data);
    },

    onopen(e) {

    },

    onmessage(e) {

    },

    reconnect() {
        setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
            this.sock = new WebSocket(this.url);
            this.sock.binaryType = "arraybuffer";
            this.sock.onopen = this.on_open.bind(this);
            this.sock.onmessage = this.on_message.bind(this);
            this.sock.onclose = this.on_close.bind(this);
            this.sock.onerror = this.on_error.bind(this);
            this.sock.onclose = function () {
                this.reconnect()
            }.bind(this);
            this.sock.onerror = function () {
                this.reconnect()
            }.bind(this);
        }.bind(this), 2000);
    }

}

export default websocket;





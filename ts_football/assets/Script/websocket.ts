
var websocket = {
    sock: null,
    action:null,
    on_open: function (e) {
        this.onopen(e);
    },
    
    on_message: function (event) {
        console.log("[onmessage]",event)
       this.onmessage(event)
    },
 
    on_close: function () {
        this.close();
    },
 
    on_error: function () {
        this.close();
    },
    
    close: function () {
        if(this.sock){
            this.sock.close();
            this.sock = null;
        }
    },
 
    connect: function (url) {
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

    onopen(e){

    },

    onmessage(e){

    }
 
}
 
export default websocket;





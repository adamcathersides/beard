soundcraft = require ( 'soundcraft-ui-connection' )
express = require('express')
osc_client = require('node-osc')

app = express()

mixerIP = "192.168.1.77"
conn = new soundcraft.SoundcraftUI(mixerIP)
conn.connect()
osc = new osc_client.Client('192.168.1.102', 8000) 

app.get('/input/chn/*/level', function (req, res) {
    chn = req.params[0]
    db = req.query['db']
    conn.master.input(req.params[0]).setFaderLevelDB(req.query['db'])
    console.log("Channel %s: %s dB", chn, db)
    res.end("OK!")
})

app.get('/input/chn/*/togglemute', function (req, res) {
    chn = req.params[0]
    conn.master.input(req.params[0]).toggleMute()
    console.log("Channel %s: toggle mute", chn)
    res.end("OK!")
})

app.get('/input/chn/dave/dist', function (req, res) {
    chn = req.params[0]
    enabled = (Boolean(req.query['enabled'] === 'true'))
    console.log("Dave Dist: %s", enabled)
    if (enabled) {
        conn.master.input(11).mute()
        conn.master.input(22).unmute()
        osc.send('/track/6/mute', 0) 
    } else {
        conn.master.input(11).unmute()
        conn.master.input(22).mute()
        osc.send('/track/6/mute', 1)
    }



    res.end("OK!")
})

server = app.listen(8081, function () {
   host = server.address().address
   port = server.address().port
   console.log("Listening at http://%s:%s", host, port)
})

/* conn.disconnect(); // close connection */


















/* conn.reconnect(); // close connection and reconnect after timeout */

soundcraft = require ( 'soundcraft-ui-connection' )
express = require('express')
osc_client = require('node-osc')

app = express()

mixerIP = "192.168.1.77"
conn = new soundcraft.SoundcraftUI(mixerIP)
conn.connect()
osc = new osc_client.Client('192.168.1.102', 22752) 

let fx_state = {
    dave: {
        in_chn: 11,
        fx_chn: 21,
        dist: {
            state: false,
            rack_position: 3
        },
        slap: {
            state: false,
            rack_position: 0
        }
    },
    jon: {
        in_chn: 12,
        fx_chn: 22,
        dist: {
            state: false,
            rack_position: 4
        },
        slap: {
            state: false,
            rack_position: 1
        }
    },
    adam: {
        in_chn: 13,
        fx_chn: 23,
        dist: { 
            state: false, 
            rack_position: 5 
        },
        slap: {
            state: false,
            rack_position: 2
        }
    },
    paul: {
        in_chn: 14,
        fx_chn: 24,
        dist: {
            state: false,
            rack_position: 6
        },
        slap: {
            state: false,
            rack_position: 3
        }
    }
}

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

app.get('/input/person/*/dist', function (req, res) {
    person = req.params[0]
    fx_state[person]['dist']['state'] = Boolean(req.query['enabled'] === 'true')
    osc_address = "/Carla/" + fx_state[person]['dist']['rack_position'] + "/set_drywet"
    if (fx_state[person]['dist']['state']) {
        
        sendOSC(osc_address, 'f', 1.0)
        console.log("%s distortion enabled", person)
    } else {
        sendOSC(osc_address, 'f', 0.0)
        console.log("%s distortion disabled", person)
    }

    setGlobalFxState(person)
    res.end(JSON.stringify(fx_state))
})

app.get('/input/person/*/slap', function (req, res) {
    person = req.params[0]
    fx_state[person]['slap']['state'] = Boolean(req.query['enabled'] === 'true') 
    
    osc_address = "/Carla/" + fx_state[person]['slap']['rack_position'] + "/set_drywet"
    if (fx_state[person]['slap']['state']) {
        sendOSC(osc_address, 'f', 1.0)
        console.log("%s distortion enabled", person)
    } else {
        sendOSC(osc_address, 'f', 0.0)
        console.log("%s distortion disabled", person)
    }

    setGlobalFxState(person)
    res.end(JSON.stringify(fx_state))
})

function sendOSC(address, type, value, retries=3) {

    for (let i = 0; i < retries; i++) {
        console.log('sent')
        osc.send(address, {type:type, value:value})
    }
}

function setGlobalFxState(person) {
    
    if (fx_state[person]['dist']['state'] || fx_state[person]['slap']['state'] ) {
        conn.master.input(fx_state[person]['in_chn']).mute()
        conn.master.input(fx_state[person]['fx_chn']).unmute()
        console.log("%s fx enabled", person)
    } else {
        conn.master.input(fx_state[person]['in_chn']).unmute()
        conn.master.input(fx_state[person]['fx_chn']).mute()
        console.log("%s fx disabled", person)
    }

}

server = app.listen(8081, function () {
   host = server.address().address
   port = server.address().port
   console.log("Listening at http://%s:%s", host, port)
})



















/* conn.reconnect(); // close connection and reconnect after timeout */

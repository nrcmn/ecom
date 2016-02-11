/********************************************
            WebSocket CONNECTION MODULE
                  Statuses table
         ________________________________
         | status number | description  |
         |---------------|--------------|
         |       20      |      ok      |--->+
         |---------------|--------------|    |
         |       10      |need to update|--->+
         |---------------|--------------|    |--- Client socket statuses
         |               |update notify |    |
         |       15      |    sended    |--->+
         |---------------|--------------|
         |       5       | app status OK|--->+
         |---------------|--------------|    |--- Admin socket statuses
         |       1       |get shops list|--->+
         |_______________|______________|

**********************************************/

// Open connection listener
global.wss.on("connection", function(ws) {
    if (ws.upgradeReq.url == '/') {
        main(ws);
    }
    else if (ws.upgradeReq.url == '/admin') {
        admin(ws);
    }
})


// WebSocket logic for main page
function main (ws) {
    ws.send(JSON.stringify({
        actualVersion: global.version.actualVersion,
        shops: global.version.shops,
        needToUpdate: false
    }));

    ws.on('message', function(data, flags) {
        if (JSON.parse(data).status == 20) {
            ws.send(JSON.stringify({
                actualVersion: global.version.actualVersion,
                shops: global.version.shops,
                needToUpdate: false
            }));
        }
        else if (JSON.parse(data).status == 15) {
            ws.send(JSON.stringify({
                actualVersion: version.actualVersion,
                shops: version.shops,
                needToUpdate: true
            }));
        }
        else if (JSON.parse(data).status == 10) {
            ws.send(JSON.stringify({
                actualVersion: version.actualVersion,
                shops: version.shops,
                needToUpdate: true
            }));
        }

        // add to global variable for admin socket
        global.appStatus[JSON.parse(data).id] = {
            id: JSON.parse(data).id,
            ver: JSON.parse(data).ver,
            status: JSON.parse(data).status,
            time: new Date().getTime()
        }

        ws.ping(0);
    });

    ws.on("close", function(code) {
        console.log("WebSocket connection close. Main page")
    })
}

// WebSocket logic for admin page
function admin (ws) {
    // get actual list of shops
    var filesystem = global.fs.readdirSync('./app/shops');

    if (filesystem.indexOf('.DS_Store') > -1) {
        filesystem.splice(filesystem.indexOf('.DS_Store'), 1);
    }

    filesystem.forEach(function (item, i ,arr) {
        if (global.appStatus[item] && global.appStatus[item].time > (new Date().getTime() - 100)) {
            arr[i] = {
                id: item,
                data: global.appStatus[item]
            };
        }
        else {
            arr[i] = {
                id: item,
                data: {
                    id: item,
                    ver: null,
                    status: 0
                }
            };
        }
    })

    ws.send(JSON.stringify(filesystem))
    ws.on('message', function(data, flags) {
        if (JSON.parse(data).status == 1 || JSON.parse(data).status == 5) {
            // updateShopsStatuses()

            filesystem.forEach(function (item, i, arr) {
                // console.log(global.appStatus[item.id], 'global.appStatus');
                if (global.appStatus[item.id] && global.appStatus[item.id].time > (new Date().getTime() - 100)) {
                    item.data = global.appStatus[item.id]
                }
                else {
                    item.data = {
                        id: item.id,
                        ver: null,
                        status: 0
                    }
                }
            })

            // console.log(filesystem);
            ws.send(JSON.stringify(filesystem))
        }

        ws.ping(0);
    })

    ws.on("close", function() {
        console.log("WebSocket connection close. Admin page")
    })
}

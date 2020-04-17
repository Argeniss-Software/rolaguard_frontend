import io from 'socket.io-client';

const WS_HOST = window.RUNTIME_WS_HOST ? window.RUNTIME_WS_HOST : 'http://localhost.rolaguard:30003/';

let socket = null;
const cbForNewNotification = {};
const cbForNewAlert = {};
const cbForUpdatedDataCollector = {};


function handleNewAlert(msg) {
    
    for (let idx in cbForNewAlert) {
        const cb = cbForNewAlert[idx];
        if (cb)
            cb(msg);
    }
}

function handleNewNotification(msg) {
    for (let idx in cbForNewNotification) {
        const cb = cbForNewNotification[idx];
        if (cb)
            cb(msg);
    }
}

function handleUpdatedDataCollector(msg) {
    for(let idx in cbForUpdatedDataCollector) {
        const cb = cbForUpdatedDataCollector[idx]
        if (cb)
            cb(msg);
    }
}

function connect() {
    socket = io.connect(WS_HOST);
    socket.on('connect', () => {
        let token = localStorage.getItem("token");
        socket.emit('authorization', {token});
        socket.on('new_notification', handleNewNotification);
        socket.on('new_alert', handleNewAlert);
        socket.on('updated_data_collector', handleUpdatedDataCollector);
    });

}

function disconnect() {
    if(socket) {
        socket.disconnect();
        socket = null;
    }
}

function emit(topic, msg) {
    if(socket)
        socket.emit(topic, msg);
}

function subscribeToNewAlertEvents(callback) {
    const id = new Date().getUTCMilliseconds();
    cbForNewAlert[id] = callback;
    return id;
}

function unsubscribeFromNewAlertEvents(id) {
    delete cbForNewAlert[id];
}

function subscribeToNewNotificationEvents(callback) {
    const id = new Date().getUTCMilliseconds();
    cbForNewNotification[id] = callback;
    return id;
}

function unsubscribeFromNewNotificationEvents(id) {
    delete cbForNewNotification[id];
}

function subscribeToUpdatedDataCollectorEvents(callback) {
    const id = new Date().getUTCMilliseconds();
    cbForUpdatedDataCollector[id] = callback;
    return id;
}

function unsubscribeFromUpdatedDataCollectorEvents(id) {
    delete cbForUpdatedDataCollector[id];
}

let token = localStorage.getItem("token");
if(token) {
    connect();
}

export {subscribeToNewAlertEvents, subscribeToNewNotificationEvents, subscribeToUpdatedDataCollectorEvents, unsubscribeFromNewAlertEvents, unsubscribeFromNewNotificationEvents, unsubscribeFromUpdatedDataCollectorEvents, connect, disconnect, emit};
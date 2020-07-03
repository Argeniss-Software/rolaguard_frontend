import authStore from "./auth.store";
import deviceStore from "./device.store"
import alarmStore from "./alarm.store"
import usersStore from "./users.store"
import messageStore from "./message.store"
import generalDataStore from "./general.data.store"
import rolesStore from "./roles.store"
import alertStore from "./alert.store"
import dataCollectorStore from './data_collector.store'
import policyStore from './policy.store'
import notificationStore from './notification.store'
import inventoryAssetsStore from './inventory_asset.store'

const stores = {
    authStore,
    deviceStore,
    alarmStore,
    usersStore,
    messageStore,
    generalDataStore,
    rolesStore,
    alertStore,
    dataCollectorStore,
    policyStore,
    notificationStore,
    inventoryAssetsStore
};

export default stores
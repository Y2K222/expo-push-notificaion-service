import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, StyleSheet } from "react-native";

/**
 * This handler determines how your app handles
 * notifications that comes in while the app is foregrounded
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert   : true,
    shouldPlaySound   : true,
    shouldSetBadge    : false,
  }),
});

const App = () => {

  // Application states
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification]   = useState(false)

  // Listener references
  const notificationListener  = useRef()
  const responseListener      = useRef()

  // To generate current device's expo push token
  const registerForPushNotificationAsync = async () => {
    /**
     * We should also make sure the app is
     * running on physical device, since push notification
     * won't work on a simulator
     */
    let finalStatus
    if (Device.isDevice) {
      // Check the current notification permission
      const notificationPermission = await Notifications.getPermissionsAsync()
      /**
       * If current device have not granted request for the new
       * notification permission
       */
      finalStatus = notificationPermission.status
      if (notificationPermission.status !== "granted") {  
        let newNotificationPermission = await Notifications.requestPermissionsAsync() 
        finalStatus = newNotificationPermission.status
      }
      /**
       * If final notification permission is not 'granted' 
       * unalbe to generate a push token and exist from the current function
       */
      if (finalStatus !== "granted") {
        alert("Failed to get push token. Please allow notification.")
        return
      }

      /**
       * ================================================================
       *            REQUESTED PERMISSON SUCCESSFULLY
       * 
       * Notification permission is request successfully.Now we can generate
       * the expo push token when can be used in pushing notificaions.
       * ================================================================
       */

      const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data
      setExpoPushToken(expoPushToken)

    }
  }

  useEffect(() => {
    registerForPushNotificationAsync()
  })

  return (
    <View style={styles.perfectCenter}>
      {/* For expo push token */}
      <Text style={{...styles.textCenter, ...styles.label}}>Your expo push token</Text>
      <View style={styles.smSpace}/>
      <Text style={{...styles.textCenter, ...styles.text}}>{expoPushToken}</Text>
      <View style={styles.smSpace}/>
      {/* <View style={styles.center}>
        <Text>Title : {notification && notification.request.content.title}</Text>
        <Text>Body  : {notification && notification.request.content.body}</Text>
        <Text>Data  : {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  perfectCenter: {
    flex            : 1,
    justifyContent  : "center",
    alignItems      : "center",
  },
  center: {
    justifyContent  : "center",
    alignItems      : "center"
  },
  textCenter: {
    justifyContent: "center"
  },
  smSpace: {
    height: 30
  },
  label: {
    fontSize: 14,
    fontWeight: "300",
    color: "#888"
  },
  text: {
    fontSize: 15,
    fontWeight: "300",
    color: "#040404"
  }
})

export default App
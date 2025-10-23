import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';


async function setupFCMListeners() {

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in background:', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
        console.log('foreground message received:', remoteMessage);
        Alert.alert('New Notice Posted', remoteMessage.notification?.title);
    });


    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened from background state:', remoteMessage);

        //Todo: React to the notification by navigating to the relevant screen
    });

    const initialMessage = await messaging().getInitialNotification();
    if (initialMessage) {
        console.log('Notification opened from quit state:', initialMessage.notification);

        //Todo: React to the notification by navigating to the relevant screen
    }

    console.log('Notice Listeners set up');

}

async function setupFCM() {
    // Request permission to receive notifications (important for IOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;


    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;

}




export { setupFCM, setupFCMListeners };
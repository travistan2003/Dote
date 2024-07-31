import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, push, set, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyB7i1N72BLlU8JL0HO346FeAQJithJlpzY",
  authDomain: "dote-98a6a.firebaseapp.com",
  databaseURL: "https://dote-98a6a-default-rtdb.firebaseio.com",
  projectId: "dote-98a6a",
  storageBucket: "dote-98a6a.appspot.com",
  messagingSenderId: "845461337163",
  appId: "1:845461337163:web:7d0fc2b9e0bb42bf1dc9ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('reminder-form').addEventListener('submit', function(event) {
    event.preventDefault();
    scheduleReminder();
});

function checkUserLogin() {
    const userInfo = sessionStorage.getItem("user-info");
    if (!userInfo) {
        window.location.href = 'index.html';
    } else {
        const user = JSON.parse(userInfo);
        loadUserReminders(user.uid);
    }
}

function loadUserReminders(uid) {
    const reminderRef = ref(database, 'users/' + uid + '/reminders');
    onValue(reminderRef, (snapshot) => {
        const tableBody = document.getElementById("reminderTableBody");
        tableBody.innerHTML = '';

        if (snapshot.exists()) {
            const reminders = snapshot.val();
            for (const key in reminders) {
                const reminder = reminders[key];
                addReminder(key, reminder.title, reminder.information, reminder.dateTime);
                scheduleNotification(key, reminder.title, reminder.information, reminder.dateTime);
            }
        } else {
            console.log("No reminders available");
        }
    });
}

function saveUserReminder(uid, reminder) {
    const newReminderRef = push(ref(database, 'users/' + uid + '/reminders'));
    set(newReminderRef, reminder).then(() => {
        console.log("Reminder added to database:", reminder);
    }).catch((error) => {
        console.error("Error adding reminder to database:", error);
    });
}

function deleteUserReminder(uid, reminderId) {
    const reminderRef = ref(database, 'users/' + uid + '/reminders/' + reminderId);
    remove(reminderRef).then(() => {
        console.log("Reminder deleted successfully.");
    }).catch((error) => {
        console.error("Error deleting reminder:", error);
    });
}

function scheduleReminder() {
    const userInfo = sessionStorage.getItem("user-info");
    if (!userInfo) {
        alert('User not logged in.');
        window.location.href = '/index.html';
        return;
    }

    const user = JSON.parse(userInfo);
    const uid = user.uid;

    const title = document.getElementById("title").value.trim();
    const information = document.getElementById("information").value.trim();
    const date = document.getElementById("date").value.trim();
    const time = document.getElementById("time").value.trim();
    const dateTimeString = date + " " + time;

    if (!title || !date || !time) {
        alert("Please fill in the title, date, and time.");
        return;
    }

    const reminder = {
        title: title,
        information: information,
        dateTime: dateTimeString
    };

    saveUserReminder(uid, reminder);
}

function addReminder(key, title, information, dateTimeString) {
    const tableBody = document.getElementById("reminderTableBody");

    const row = tableBody.insertRow();
    row.setAttribute('data-key', key);
    row.addEventListener('click', () => confirmDeleteReminder(key, row));

    const titleCell = row.insertCell(0);
    const informationCell = row.insertCell(1);
    const dateTimeCell = row.insertCell(2);

    titleCell.innerHTML = title;
    informationCell.innerHTML = information;
    dateTimeCell.innerHTML = dateTimeString;
}

function confirmDeleteReminder(key, row) {
    const confirmation = confirm("Are you sure you want to delete this reminder?");
    if (confirmation) {
        deleteReminder(key, row);
    }
}

function deleteReminder(key, row) {
    const userInfo = sessionStorage.getItem("user-info");
    if (!userInfo) {
        alert('User not logged in.');
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userInfo);
    const uid = user.uid;

    deleteUserReminder(uid, key);
    row.remove();
}

function scheduleNotification(key, title, information, dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    const delay = dateTime.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(() => {
            new Notification(title, {
                body: information,
                tag: key
            });
        }, delay);
    }
}

window.onload = checkUserLogin;


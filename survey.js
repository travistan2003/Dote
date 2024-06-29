import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, push, set, get, child, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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

document.getElementById('survey-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting by default

    // Check if all questions are answered
    if (validateForm()) {
        // Hide error message
        document.getElementById('error-message').style.display = 'none';
        // Save survey responses
        saveSurveyResponses();
        // Display thank you message and hide form
        document.getElementById('survey-form').style.display = 'none';
        document.getElementById('thank-you').style.display = 'block';
    } else {
        // Display error message
        document.getElementById('error-message').style.display = 'inline-block';
    }
});

function validateForm() {
    var form = document.getElementById('survey-form');
    var radioGroups = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
    
    for (var i = 0; i < radioGroups.length; i++) {
        var radios = document.getElementsByName(radioGroups[i]);
        var isChecked = false;
        
        for (var j = 0; j < radios.length; j++) {
            if (radios[j].checked) {
                isChecked = true;
                break;
            }
        }
        
        if (!isChecked) {
            return false; // Return false if any radio group is not checked
        }
    }
    return true; // All questions are answered
}

function saveSurveyResponses() {
    const userInfo = sessionStorage.getItem("user-info");
    if (!userInfo) {
        alert('User not logged in.');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userInfo);
    const uid = user.uid;
    const surveyResponses = {
        q1: document.querySelector('input[name="q1"]:checked').value,
        q2: document.querySelector('input[name="q2"]:checked').value,
        q3: document.querySelector('input[name="q3"]:checked').value,
        q4: document.querySelector('input[name="q4"]:checked').value,
        q5: document.querySelector('input[name="q5"]:checked').value,
        q6: document.querySelector('input[name="q6"]:checked').value,
    };

    const surveyRef = ref(database, 'users/' + uid + '/surveys');

    // Check if there are existing survey responses and delete them
    get(surveyRef).then((snapshot) => {
        if (snapshot.exists()) {
            // Delete existing responses
            remove(surveyRef).then(() => {
                console.log("Existing survey responses deleted.");
                // Save new responses
                set(push(surveyRef), surveyResponses).then(() => {
                    console.log("Survey responses saved successfully.");
                }).catch((error) => {
                    console.error("Error saving survey responses: ", error);
                });
            }).catch((error) => {
                console.error("Error deleting existing survey responses: ", error);
            });
        } else {
            // Save new responses directly
            set(push(surveyRef), surveyResponses).then(() => {
                console.log("Survey responses saved successfully.");
            }).catch((error) => {
                console.error("Error saving survey responses: ", error);
            });
        }
    }).catch((error) => {
        console.error("Error checking existing survey responses: ", error);
    });
}
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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

// Function to check user's survey response and show/hide date ideas
function checkSurveyResponses() {
  const userInfo = sessionStorage.getItem("user-info");
  if (!userInfo) {
    alert('User not logged in.');
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userInfo);
  const uid = user.uid;
  const surveyRef = ref(database, 'users/' + uid + '/surveys');

  get(surveyRef).then((snapshot) => {
    if (snapshot.exists()) {
      const surveys = snapshot.val();
      let showBoardGames = false;
      let showVideoGames = false;
      let showMovie = false;
      let showPerfume = false;
      let showBowling = false;
      let showHiking = false;
      let showMiniGolf = false;
      let showPicnic = false;
      let showMuseum = false;
      let showPottery = false;
      let showTufting = false;
      let showHomeCooked = false;
      let showWalk = false;
      let showLoveBook = false;

      // Check the most recent survey responses
      const recentSurvey = Object.values(surveys).pop();

      if (recentSurvey.q1 === 'staying-in') {
        showBoardGames = true;
        showVideoGames = true;
        showMovie = true;
      } else if (recentSurvey.q1 === 'going-out') {
        showPerfume = true;
      } else if (recentSurvey.q1 === 'both') {
        showBoardGames = true;
        showVideoGames = true;
        showMovie = true;
        showPerfume = true;
      }

      if (recentSurvey.q2 === 'yes') {
        showBowling = true;
        showHiking = true;
        showMiniGolf = true;
      }

      if (recentSurvey.q3 === 'yes') {
        showPicnic = true;
      }

      if (recentSurvey.q5 === 'physical-touch') {
        showMovie = true;
        showWalk = true;
      } else if (recentSurvey.q5 === 'quality-time') {
        showMuseum = true;
        showWalk = true;
      } else if (recentSurvey.q5 === 'gifts') {
        showPottery = true;
        showTufting = true;
      } else if (recentSurvey.q5 === 'aos') {
        showHomeCooked = true;
      } else if (recentSurvey.q5 === 'woa') {
        showLoveBook = true;
      }

      // Show/hide date ideas based on the survey responses
      document.querySelector('.board-games').style.display = showBoardGames ? 'block' : 'none';
      document.querySelector('.video-games').style.display = showVideoGames ? 'block' : 'none';
      document.querySelector('.movie').style.display = showMovie ? 'block' : 'none';
      document.querySelector('.perfume').style.display = showPerfume ? 'block' : 'none';
      document.querySelector('.bowling').style.display = showBowling ? 'block' : 'none';
      document.querySelector('.hiking').style.display = showHiking ? 'block' : 'none';
      document.querySelector('.mini-golf').style.display = showMiniGolf ? 'block' : 'none';
      document.querySelector('.picnic').style.display = showPicnic ? 'block' : 'none';
      document.querySelector('.museum').style.display = showMuseum ? 'block' : 'none';
      document.querySelector('.pottery').style.display = showPottery ? 'block' : 'none';
      document.querySelector('.tufting').style.display = showTufting ? 'block' : 'none';
      document.querySelector('.home-cooked').style.display = showHomeCooked ? 'block' : 'none';
      document.querySelector('.walk').style.display = showWalk ? 'block' : 'none';
      document.querySelector('.love-book').style.display = showLoveBook ? 'block' : 'none';

      // Show the date ideas section
      document.getElementById('date-ideas').style.display = 'block';
      // Hide the survey prompt
      document.getElementById('survey-prompt').style.display = 'none';
    } else {
      // No survey responses found, show the survey prompt
      document.getElementById('date-ideas').style.display = 'none';
      document.getElementById('survey-prompt').style.display = 'block';
    }
  }).catch((error) => {
    console.error("Error checking survey responses: ", error);
  });
}

// Call the function to check survey responses on page load
checkSurveyResponses();
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
    window.location.href = '/index.html';
    return;
  }

  const user = JSON.parse(userInfo);
  const uid = user.uid;
  const surveyRef = ref(database, 'users/' + uid + '/surveys');

  get(surveyRef).then((snapshot) => {
    if (snapshot.exists()) {
      const surveys = snapshot.val();
      const recentSurvey = Object.values(surveys).pop();

      // Logic to determine which date ideas to show based on survey responses
      const showBoardGames = recentSurvey.q1 === 'staying-in' || recentSurvey.q1 === 'both';
      const showVideoGames = recentSurvey.q1 === 'staying-in' || recentSurvey.q1 === 'both';
      const showMovie = recentSurvey.q1 === 'staying-in' || recentSurvey.q1 === 'both' || recentSurvey.q5 === 'physical-touch';
      const showPerfume = recentSurvey.q1 === 'going-out' || recentSurvey.q1 === 'both';
      const showBowling = recentSurvey.q2 === 'yes';
      const showHiking = recentSurvey.q2 === 'yes';
      const showMiniGolf = recentSurvey.q2 === 'yes';
      const showPicnic = recentSurvey.q3 === 'yes';
      const showMuseum = recentSurvey.q5 === 'quality-time';
      const showPottery = recentSurvey.q5 === 'gifts';
      const showTufting = recentSurvey.q5 === 'gifts';
      const showHomeCooked = recentSurvey.q5 === 'aos';
      const showWalk = recentSurvey.q5 === 'physical-touch' || recentSurvey.q5 === 'quality-time';
      const showLoveBook = recentSurvey.q5 === 'woa';

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
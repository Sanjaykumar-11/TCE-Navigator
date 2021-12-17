var firebaseConfig = {
  apiKey: "AIzaSyCG8nCS-Eqax-dUtwQKzAdpjMqX8ThBu7c",
  authDomain: "tce-navigator.firebaseapp.com",
  databaseURL: "https://tce-navigator-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tce-navigator",
  storageBucket: "tce-navigator.appspot.com",
  messagingSenderId: "938064250614",
  appId: "1:938064250614:web:885a5bf98a4fcd40380ed7",
  measurementId: "G-V6DJK8FJ6E"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()


function login () {
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser
    var database_ref = database.ref()
    var user_data = {
      last_login : Date.now()
    }
    database_ref.child('users/' + user.uid).update(user_data)
    alert('User Logged In!!')
    window.open("http://localhost/tcenavigator/addevents.html");
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
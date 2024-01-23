function login() {
  window.location.assign("loginPage.html");
}
function home() {
  window.location.assign("index.html");
}
function about() {
  window.location.assign("aboutPage.html");
}

function signUp() {
  var user_email = document.getElementById("user_email").value;
  var user_psw = document.getElementById("user_psw").value;
  var user_name = document.getElementById("user_name").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(user_email, user_psw)
    .then((userCredential) => {
      const db = firebase.firestore();
      var docData = {
        Name: user_name,
        Email: user_email,
        Password: user_psw,
        Courses: {},
      };
      db.collection("Students")
        .doc(userCredential.user.uid)
        .set(docData)
        .then(() => {
          alert("You have successfully registered!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      alert(error.message);
    });
}

function signIn() {
  var user_email = document.getElementById("login_email").value;
  var user_psw = document.getElementById("login_psw").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(user_email, user_psw)
    .then(async (userCredential) => {
      localStorage.setItem("idUser", userCredential.user.uid);
      window.location.assign("main.html");
    })
    .catch((error) => {
      alert(error.message);
    });
}

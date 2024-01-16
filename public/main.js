document.addEventListener('DOMContentLoaded', function() {
    const idUser = localStorage.getItem("idUser"); 
    const db = firebase.firestore();
    var docRefid = db.collection("Students").doc(idUser);    

    docRefid.get().then((doc) => {
        if (doc.exists) {
            document.getElementById("studentName").innerHTML = "Hello " + doc.data().Name + "👋, welcome to your gradebook!";
            if (doc.data().hasOwnProperty("Courses")) {
                var coursesData = doc.data().Courses;
                restoreValuesOnLogin(coursesData);
                calculator(idUser);
            }
        } else {
            console.log("No such document (ID: " + idUser + ")");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

function restoreValuesOnLogin(coursesData) {
    for (const key in coursesData) {
        if (Object.hasOwnProperty.call(coursesData, key)) {
            const courseDetails = coursesData[key];
            idInUse.push(Number(key));
            viewCourses(key);
            document.getElementById(`year${key}`).value = `${courseDetails["Year"]}`;
            document.getElementById(`semester${key}`).value = `${courseDetails["Semester"]}`;
            document.getElementById(`name_course${key}`).value = `${courseDetails["NameCourse"]}`;
            document.getElementById(`credits${key}`).value = `${courseDetails["Credits"]}`;
            document.getElementById(`grade${key}`).value = `${courseDetails["Grade"]}`;
        }
    }
}
function viewCourses(key) {
    var targetDiv = document.getElementById("target");
    var newForm = document.createElement("form");

    newForm.setAttribute("id", key);
    newForm.setAttribute("class", "courseContainer");
    //newForm.setAttribute("style", "margin-top: 20px; background: transparent; box-shadow: 0px 0px 50px 5px;");

    var yearSelect = createSelect("year" + key, "Year", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    var semesterSelect = createSelect("semester" + key, "Semester", ["A", "B", "S"]);
    var nameInput = createInput("text", "name_course" + key, "Name course", "Name course");
    var creditsInput = createInput("number", "credits" + key, "Credits", "");
    var gradeInput = createInput("number", "grade" + key, "Final grade", "");
    var deleteButton = createButton("deleteCourse(this, '" + key + "')", "Delete", "20%", "fa fa-trash");

    newForm.appendChild(yearSelect);
    newForm.appendChild(semesterSelect);
    newForm.appendChild(nameInput);
    newForm.appendChild(creditsInput);
    newForm.appendChild(gradeInput);
    newForm.appendChild(deleteButton);

    targetDiv.appendChild(newForm);
}

var idInUse = [];

function addNewCourse() {

    if (idInUse.length < 100){
        var targetDiv = document.getElementById("target");
        var uniqueRandomId = generateUniqueRandomId();
    
        var newForm = document.createElement("form");
        newForm.setAttribute("id", uniqueRandomId);
        newForm.setAttribute("class", "courseContainer");
        //newForm.setAttribute("style", "margin-top: 20px; background: transparent; box-shadow: 0px 0px 50px 5px;");
    
        var yearSelect = createSelect("year" + uniqueRandomId, "Year", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        var semesterSelect = createSelect("semester" + uniqueRandomId, "Semester", ["A", "B", "S"]);
        var nameInput = createInput("text", "name_course" + uniqueRandomId, "Name course", "Name course");
        var creditsInput = createInput("number", "credits" + uniqueRandomId, "Credits", "");
        var gradeInput = createInput("number", "grade" + uniqueRandomId, "Final grade", "");
        var deleteButton = createButton("deleteCourse(this, '" + uniqueRandomId + "')", "Delete", "20%", "fa fa-trash");
    
        newForm.appendChild(yearSelect);
        newForm.appendChild(semesterSelect);
        newForm.appendChild(nameInput);
        newForm.appendChild(creditsInput);
        newForm.appendChild(gradeInput);
        newForm.appendChild(deleteButton);
    
        targetDiv.appendChild(newForm);
        idInUse.push(uniqueRandomId);

    } else {
        alert("You have reached the maximum number of courses.");
    }

}

function createSelect(id, placeholder, options) {
    var select = document.createElement("select");
    select.setAttribute("class", "category");
    select.setAttribute("id", id);
    select.setAttribute("placeholder", placeholder);

    var defaultOption = document.createElement("option");
    defaultOption.setAttribute("selected", "selected");
    defaultOption.appendChild(document.createTextNode(placeholder));
    select.appendChild(defaultOption);

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(options[i]));
        select.appendChild(option);
    }
    return select;
}

function createInput(type, id, placeholder, value) {
    var input = document.createElement("input");
    input.setAttribute("class", "category");
    input.setAttribute("type", type);
    input.setAttribute("id", id);
    input.setAttribute("placeholder", placeholder);
    input.setAttribute("value", value);

    return input;
}

function createButton(onclick, text, width, iconClass) {
    var button = document.createElement("button");
    button.setAttribute("class", "category");
    button.setAttribute("onclick", onclick);
    button.setAttribute("style", "width: " + width + ";");
    
    var icon = document.createElement("i");
    icon.setAttribute("class", iconClass);
    button.appendChild(icon);

    return button;
}

function deleteCourse(item, idCourse) {
    var formToRemove = document.getElementById(idCourse);
    formToRemove.remove();

    const idUser = localStorage.getItem("idUser");
    const db = firebase.firestore();
    var docRef = db.collection("Students").doc(idUser);

    docRef.get().then((doc) => {
        if (doc.data().hasOwnProperty("Courses")) {
            //var nameCourseDeleted = doc.data().Courses[idCourse].NameCourse; //אם לא הוכנס לקורס שם (כלומר מוחקת שורה ריקה) נוצרת שגיאה
            docRef.update({
                [`Courses.${idCourse}`] : firebase.firestore.FieldValue.delete()
            }).then(() => {
                calculator(idUser);
                idInUse.pop(idCourse);
                alert(`course successfully deleted!`)
                //alert(`${nameCourseDeleted} course successfully deleted!`)
            })
            .catch((error) => {
                console.error("Error delete course: ", error);
            });
        }
    });

}
        
function save() {

    const idUser = localStorage.getItem("idUser");
    var db = firebase.firestore();
    var courseData = {};
    var forms = document.getElementById("target").getElementsByTagName("form");
    var docRef = db.collection("Students").doc(idUser);

    docRef.get().then((doc) => {
        if (doc.exists && doc.data().Courses) { 
            var idCourses = Object.keys(doc.data().Courses);
            for (var i = 0; i < forms.length; i++) {
                var formId = forms[i].id; 
                if (idCourses.includes(formId)) {
                    courseData[formId] = {
                        Year: document.getElementById("year" + formId).value,
                        Semester: document.getElementById("semester" + formId).value,
                        NameCourse: document.getElementById("name_course" + formId).value,
                        Credits: document.getElementById("credits" + formId).value,
                        Grade: document.getElementById("grade" + formId).value
                    };
                } else {
                    courseData[formId] = {
                        Year: document.getElementById("year" + formId).value,
                        Semester: document.getElementById("semester" + formId).value,
                        NameCourse: document.getElementById("name_course" + formId).value,
                        Credits: document.getElementById("credits" + formId).value,
                        Grade: document.getElementById("grade" + formId).value
                    };
                }
            } 
            return docRef.update({ 
                Courses: courseData
            })
            .then(() => {
                calculator(idUser);
                alert("Courses saved successfully!");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });       
        }
    });
};
           
function calculator(idUser) {
    var allAverages = 0;
    var allCredits = 0;
    const db = firebase.firestore();
    var docRef = db.collection("Students").doc(idUser);

    docRef.get().then((doc) => {
        if (doc.data().hasOwnProperty("Courses")) {
            var coursesData = doc.data().Courses;
            for (const key in coursesData) {
                if (Object.hasOwnProperty.call(coursesData, key)) {
                    const courseDetails = coursesData[key];
                    var credits = Number(`${courseDetails["Credits"]}`);
                    allCredits += credits;
                    var grade = Number(`${courseDetails["Grade"]}`);
                    allAverages += credits * grade;
                }
            }
        }
        var average = (allAverages/allCredits).toFixed(2);
        if (average > 0) {
            document.getElementById("result").innerHTML = average;
        } else {
            document.getElementById("result").innerHTML = "0";
        }
    });
}
        
function generateUniqueRandomId() {
    var randomNumber = Math.floor(Math.random() * 101);

    if (idInUse.includes(randomNumber)) {
        return generateUniqueRandomId();
    } else {
        return randomNumber;
    }
}

function logout(){
    firebase.auth().signOut().then(() => {
        window.location.assign("loginPage.html");
    }).catch((error) => {
        console.log(error);
    });
};

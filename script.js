/*
document.createElement("smth") 
    smth -> div [ creates a new HTML container], button , option , li etc 
    -> this command is used to create that element in browser's memory (dynamically)
document.getElementById("smth")
    smth -> some unique name from html 
*/

let currentFilter = "all"; 
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
/*
localStorage = browser storage (small database) 
this is used to retain the data (avoid losing it while refreshing)
returns string if data exists or null o/w.

parse => converts string -> to js object / array 
*/

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    /*
    args -> key = "tasks", value = string version of array
    JSON.stringify(tasks) - converts JS array to string
    this saves data in browser 
    */
}

function renderTasks() {
    /*
    clears UI , rebuilds it from scratch 
    */
    let list = document.getElementById("taskList"); 
    /*
    finds <ul id="taskList"> from html 
    */
    list.innerHTML = ""; 
    /* removes all existing tasks from screen 
        we don't update UI manually , we rebuild it */

    tasks.forEach((task , index) => {
    /*
    loop over each task , task = current task object 
    index = position (0, 1, 2, ...)
    */
        if((task.done && currentFilter=="pending") || (!task.done && currentFilter=="done")) {
            return;  
        }
        let li = document.createElement("li"); 

        // It adds a CSS class (either done or pending) to each <li> based on its state
        if(task.done) {
            li.classList.add("done"); 
        } else {
            li.classList.add("pending");
        }
        /* creates <li> element */
        li.innerText = task.text; /* sets text inside <li> */
        if(task.done) {
            li.style.textDecoration = "line-through"; 
        }
        li.onclick = function() {
            tasks[index].done = !tasks[index].done; 
            saveTasks(); 
            renderTasks();  
        }; 
        
        let menuBtn = document.createElement("button");
        menuBtn.innerText = "⋮";
        menuBtn.className = "menu-btn";

        let menu = document.createElement("div"); // creates a HTML container in browser's memory 
        menu.style.display = "none"; // initially the element will be hidden
        
        let editBtn = document.createElement("button"); 
        editBtn.innerText = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = function(e) {
            e.stopPropagation(); // shouldn't affect the parent i.e. <li>
            
            // 1st way - uses prompt , then write the newText in the new window itself
            let newText = prompt("Edit Task:", task.text);

            if(newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim(); 
                saveTasks(); 
                renderTasks(); 
            }
        };
        let deleteBtn = document.createElement("button"); 
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "Delete"; 
        // what is e here ? e = event object , e can be click, keypress , mousemove.
        // here it is button-click
        deleteBtn.onclick = function(e) {
            // runs when delete button is clicked
            e.stopPropagation(); // o/w clicking delete also triggers li.onclick 
            tasks.splice(index, 1); // removes 1 element at position index 
            saveTasks(); 
            renderTasks(); 
        };
        // toggle menu 
        menuBtn.onclick = function(e) {
            e.stopPropagation();
            menu.style.display = (menu.style.display === "none") ? "block" : "none"; 
            // this is a toggle , if menu is hidden => show it, and hide it o/w.
        }

        /* --> this was for explicity adding delete and edit buttons on each task 


        // buttons : delete-btn and edit-btn 
        let deleteBtn = document.createElement("button"); 
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "Delete"; 
        // what is e here ? e = event object , e can be click, keypress , mousemove.
        // here it is button-click
        deleteBtn.onclick = function(e) {
            // runs when delete button is clicked
            e.stopPropagation(); // o/w clicking delete also triggers li.onclick 
            tasks.splice(index, 1); // removes 1 element at position index 
            saveTasks(); 
            renderTasks(); 
        }
        let editBtn = document.createElement("button"); 
        editBtn.innerText = "Edit";
        editBtn.onclick = function(e) {
            e.stopPropagation(); // shouldn't affect the parent i.e. <li>
            
            // 1st way - uses prompt , then write the newText in the new window itself
            let newText = prompt("Edit Task:", task.text);

            if(newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim(); 
                saveTasks(); 
                renderTasks(); 
            }
            
            // 2nd way - create input element

//            // li.innerHTML = ""; // what does this do exactly ? like what is the content it captures ? does this include the buttons as well?
            // let input = document.createElement("input"); 
            // input.value = task.text; // why this update ? won't it change the content of input.value

            // li.firstChild.nodeValue = ""; 

            // input.focus(); // puts cursor inside the input box
            // input.onkeypress = function(e) {
            //     if(e.key == "Enter") {
            //         if(input.value.trim() !== "")
            //         tasks[index].text = input.value.trim();
            //         saveTasks();
            //         renderTasks(); 
            //     }
            // }

            // input.onblur = function() {
            //     renderTasks(); 
            // }
        }
        */
        li.appendChild(menuBtn);
        li.appendChild(menu); 

        menu.appendChild(deleteBtn); 
        menu.appendChild(editBtn); // o/w this edit button won't appear
        /* put button inside <li> */
        list.appendChild(li); 
        /* add <li> to <ul> */
    });
}
function filter() {
    let filtered = document.getElementById("filterTasks").value; /* why .value is used */
    currentFilter = filtered || "all";
    renderTasks(); 
}

// function editTasks() {
//     let input = document.createElement("input");
// }
function addTask() {
    let input = document.getElementById("taskInput");

    /*
    document.getElementById("taskInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
    */
    if(input.value.trim()==="") {
        alert("Tasks is invalid");
        renderTasks();  
        return; 
    }
    tasks.push({
        /* defining that task has two properties : text and done */
        text: input.value, 
        done: false
    });

    saveTasks(); 
    currentFilter = "all";
    renderTasks(); 
    input.value = ""; /* why this is made empty --> this clears the input box after clicking the button */
}

/* 
    add edit task -> done using prompt method
    add filters -> done 
    add deadline 
    add dark Mode 
*/
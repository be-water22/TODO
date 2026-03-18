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
        
        let deleteBtn = document.createElement("button"); 
        deleteBtn.innerText = "Delete"; 
        deleteBtn.onclick = function(e) {
            /* runs when delete button is clicked */
            e.stopPropagation(); /* o/w clicking delete also triggers li.onclick */
            tasks.splice(index, 1); /* removes 1 element at position index */
            saveTasks(); 
            renderTasks(); 
        };

        li.appendChild(deleteBtn); 
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

function addTask() {
    let input = document.getElementById("taskInput");

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
    add edit task
    add filters -> done 
    add deadline 
    add dark Mode 
*/
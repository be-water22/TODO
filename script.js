/*
document.createElement("smth") 
    smth -> div [ creates a new HTML container], button , option , li etc 
    -> this command is used to create that element in browser's memory (dynamically)
document.getElementById("smth")
    smth -> some unique name from html 

addEventListener() : is a built-in method used to attach an event handler (a function) to a specific element in the Document Object Model (DOM). 
                   : It allows a web page to "listen" for user interactions—such as clicks, key presses, or mouse movements—and execute code in response.
*/
let contextMenu = document.createElement("div");
contextMenu.className = "context-menu"; 
document.body.appendChild(contextMenu); // why this is needed anyway ?? 
    // you created this element in memory but it won't show on screen unless you add it to DOM
let currentFilter = "myDay"; 
// let today = new Date();
// today.setHours(0, 0, 0, 0);
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
/*
localStorage = browser storage (small database) 
this is used to retain the data (avoid losing it while refreshing)
returns string if data exists or null o/w.

parse => converts string -> to js object / array 
*/

document.addEventListener("click", function(e) {
    // Listens to every click on the page
    // parameters - event, function // another eg .onclick 
    if(!contextMenu.contains(e.target)) {
        contextMenu.style.display = "none";
    }
});
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    // why not just document.addEventListener() as it is done above?
        // You can, but:
            // document.addEventListener() → listens to ALL keypresses on page
            // getElementById("taskInput") → listens only inside input box, so it works only when the text cursor is in the input box 
    if(e.key == "Enter") {
        addTask();
    }
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    /*
    args -> key = "tasks", value = string version of array
    JSON.stringify(tasks) - converts JS array to string
    this saves data in browser 
    */
}

function renderTasks() {
    // sorting logic : compare (date, done/pending, important)
    tasks.sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date); // newer to older
        if(dateDiff) return dateDiff;
        const pend = a.done - b.done; 
        if(pend) return pend; 
        const impp = b.imp - a.imp; 
        if(impp) return impp;
        return 0; 
    });
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
        if(currentFilter == "myDay") {
            if(task.date !== new Date().toDateString()) {
                // console.log(task.date , today.getTime());
                return;
            } 
        }
        if(currentFilter == "Imp") {
            if(!task.imp) return; 
        }

        let li = document.createElement("li"); 

        // It adds a CSS class (either done or pending) to each <li> based on its state
        
        // if(task.done) {
        //     li.classList.add("done"); 
        // } else {
        //     li.classList.add("pending");
        // }

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

        let impBtn = document.createElement("button"); 
        impBtn.innerText = task.imp ? "★" : "☆";        
        impBtn.className = "imp-btn";

        impBtn.onclick = function(e) {
            e.stopPropagation();
            task.imp = !task.imp;
            saveTasks(); 
            renderTasks(); 
        }

        li.oncontextmenu = function(e) { // function called on the right click
            e.preventDefault(); // stops the browswer's default menu
            showMenu(e, index); 
        }
        li.appendChild(impBtn);
        // tmpList.appendChild(li);
        list.appendChild(li); 
        /* add <li> to <ul> */
    });
}
function filter() {
    let filtered = document.getElementById("filterTasks").value; /* why .value is used */
    currentFilter = filtered || "myDay";
    renderTasks(); 
}

function showMenu(e, index) {
    contextMenu.innerHTML = ""; 

    // edit button 
    let editBtn = document.createElement("button"); 
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = function(e) {
        // e.stopPropagation(); // shouldn't affect the parent i.e. <li>
        
        // 1st way - uses prompt , then write the newText in the new window itself
        let newText = prompt("Edit Task:", tasks[index].text);

        if(newText !== null && newText.trim() !== "") {
            tasks[index].text = newText.trim(); 
            saveTasks(); 
            renderTasks(); 
        }
        contextMenu.style.display = "none";
    };
    // delete button 
    let deleteBtn = document.createElement("button"); 
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete"; 
    // what is e here ? e = event object , e can be click, keypress , mousemove.
    // here it is button-click
    deleteBtn.onclick = function(e) {
        // runs when delete button is clicked
        // e.stopPropagation(); // o/w clicking delete also triggers li.onclick 
        tasks.splice(index, 1); // removes 1 element at position index 
        saveTasks(); 
        renderTasks(); 
        contextMenu.style.display = "none";
    };

    contextMenu.appendChild(editBtn); 
    contextMenu.appendChild(deleteBtn);

    contextMenu.style.left = e.pageX + "px"; // appending a px unit only 
    contextMenu.style.top = e.pageY + "px";

    contextMenu.style.display = "block";
}

function addTask() {
    let input = document.getElementById("taskInput");

    if(input.value.trim()==="") {
        alert("Tasks is invalid");
        renderTasks();  
        return; 
    }

    let today = new Date(); 
    today.setHours(0, 0, 0, 0);
    /*
    - what we have used is removing time from the timestamp by making it all zero
    - new Date() returns date + time 
    let today = new Date();
    today.getMonth() -> 1-12, .getFullYear() -> 2026 , .getDate() -> 1-31
     */
    tasks.push({
        /* defining that task has two properties : text and done */
        text: input.value, 
        done: false,
        imp : false,
        date : new Date().toDateString()
    });

    saveTasks(); 
    currentFilter = "myDay";
    renderTasks(); 
    input.value = ""; /* why this is made empty --> this clears the input box after clicking the button */
}

/* 
    add edit task -> done using prompt method
    add filters -> done 
    add deadline 
    add dark Mode 
*/
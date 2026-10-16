// Get the task list from HTML
var list = document.getElementById("todo-list");
var TName = document.getElementById("todo-title");
var TDescription = document.getElementById("todo-description");

var editingId = null;
//---------------------------------------------------------------------------------------------------------------------------
// Get tasks from API
async function Insert() {

    if (TName.value.trim() === "" || TDescription.value.trim() === "") {
        alert("Please enter both title and description!");
        return;
    }
    var resp = await fetch("https://api.freeapi.app/api/v1/todos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: TName.value,
            description: TDescription.value
        })
    });

    var data = await resp.json();

    if (resp.ok) {
        console.log(data, "Task Added Successfully");

        TName.value = "";
        TDescription.value = "";
    } else {
        console.log("Failed to add task:", data);
    }
}
//--------------------------------------------------------------------------------------------------------------------
//show all tasks from API
async function show() {
    var showResponse = await fetch(
        'https://api.freeapi.app/api/v1/todos/'
    );

    const showData = await showResponse.json();

    list.replaceChildren();

    showData.data.forEach(element => {
        var divs = document.createElement("div");
        divs.className = "todo-card";

        var title = document.createElement("h3");
        var description = document.createElement("p");
        var editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        
        var deleteButton = document.createElement("button"); // deleete button 
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        title.textContent = element.title;
        description.textContent = element.description || "";

        editButton.addEventListener("click", function () {
            TName.value = element.title;
            TDescription.value = element.description || "";

            editingId = element._id;
        });

        deleteButton.addEventListener("click", function () {
            var answer = confirm("Are you sure you want to delete this task?");

            if (answer) {
                deleteTask(element._id);
            }
        });

        divs.appendChild(title);
        divs.appendChild(description);
        divs.appendChild(editButton);
        divs.appendChild(deleteButton);

        list.appendChild(divs);



    });
}


//--------------------------------------------------------------------------------------------------------------------------------------------------
//upadte task from API
async function update() {
    if (editingId === null) {
        alert("Please select a task to edit.");
        return;
    }

    var updResponse = await fetch(
        `https://api.freeapi.app/api/v1/todos/${editingId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: TName.value,
                description: TDescription.value
            })
        }
    );

    var updData = await updResponse.json();
    console.log(updData);

    if (updResponse.ok) {
        editingId = null;
        TName.value = "";
        TDescription.value = "";

        await show();
    } else {
        console.log("Update failed:", updData);
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//delete task from API
async function deleteTask(id) {
    try {
        var delResponse = await fetch(
            `https://api.freeapi.app/api/v1/todos/${id}`,
            {
                method: "DELETE"
            }
        );

        console.log("Response status:", delResponse.status);

        if (delResponse.ok) {
            alert("Task deleted successfully!");
            await show();
        } else {
            alert("Delete failed. Status: " + delResponse.status);
        }
    } 
    catch (error) {
        console.log("Delete error:", error);
        alert("Network error. Please try again.");
    }
}
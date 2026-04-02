// For local storage
var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// New li elements
var idLi = 0;
var idChk = "checkbox_" + idLi;

function makeNewTask(text, date) {
  // Check symbol limit
  if (text.length < 3 || text.length > 255) {
    alert("Tekst musi mieć od 3 do 255 znaków");
    return;
  }

  // If list with specific ID exists (for refreshing the page)
  var taskID = document.getElementById(idLi);

  if (taskID !== null) {
    idLi++;
    idChk = "checkbox_" + idLi;
    makeNewTask(text, date);
    return;
  }

  const array = [text, date];
  var idDel = "delete_" + idLi;

  const task = document.createElement("li");
  task.setAttribute("id", idLi);

  // New li string
  task.innerHTML =
    "<input type='checkbox' id='" + idChk + "' onchange='saveCheckboxStatus(" + idLi + ", this.checked)'>"
    + "<span class='taskText' ondblclick='editTask(" + idLi + ", \"text\")'>" + array[0] + "</span> <span class='taskDate' ondblclick='editTask(" + idLi + ", \"date\")'>" + array[1] + "</span>"
    + "<button type='button' onclick='deleteTask(" + idLi + ")' id='" + idDel + "'>Usuń</button>";


  document.getElementById("list").appendChild(task);

  // Save to local storage
  tasks.push({ id: idLi, text: text, date: date, checked: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  localStorage.setItem("texts", text);
  localStorage.setItem("dates", date);

  idLi++;
  idChk = "checkbox_" + idLi;
}

function deleteTask(id) {
  document.getElementById(id).remove();

  // Delete from local storage
  tasks = tasks.filter( t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function reloadTasks(text, date, id, checked) {
  var task = document.createElement("li");
  task.setAttribute("id", id);

  var idChk = "checkbox_" + id;
  var idDel = "delete_" + id;

  var checkedAttr = checked ? "checked" : "";

  task.innerHTML =
    "<input type='checkbox' id='" + idChk + "' onchange='saveCheckboxStatus(" + id + ", this.checked)' " + checkedAttr + ">" + "<span class='taskText' ondblclick='editTask(" + id + ", \"text\")'>"
    + text + "</span> <span class='taskDate' ondblclick='editTask(" + id + ", \"date\")'>" + date + "</span>" + "<button type='button' class='butDel' onclick='deleteTask(" + id + ")' id='"
    + idDel + "'>Usuń</button>";


  document.getElementById("list").appendChild(task);
}

// Save checkbox status
function saveCheckboxStatus(id, isChecked) {
  var task = tasks.find(t => t.id === id);
  if (task) {
    task.checked = isChecked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Load tasks
tasks.forEach((t, index) => {
  reloadTasks(t.text, t.date, t.id, t.checked);
});

// Search
function searchTasks() {
  var input = document.getElementById("search");
  var filter = input.value;

  var ul = document.getElementById("list");
  var li = ul.getElementsByTagName("li");

  for (let i = 0; i < li.length; i++) {
    let span = li[i].querySelector(".taskText");
    let original = span.innerText;

    // Reset highlight
    span.innerHTML = original;

    // Highlight
    if (filter.length > 0) {
      let regex = new RegExp(filter, "gi");
      let highlighted = original.replace(regex, m => `<span class="highlight">${m}</span>`);
      span.innerHTML = highlighted;
    }

    // Search after 2 characters
    if (filter.length < 2) {
      li[i].style.display = "";
    } else {
      if (original.toLowerCase().includes(filter.toLowerCase())) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
}

// Editing tasks
function editTask(id, type) {
  var task = tasks.find(t => t.id === id);
  if (!task) return;

  var li = document.getElementById(id);
  var element = type === "text" ? li.querySelector(".taskText") : li.querySelector(".taskDate");
  var oldValue = type === "text" ? task.text : task.date;

  var input = document.createElement("input");
  input.type = type === "date" ? "date" : "text";
  input.value = oldValue || "";
  input.style.width = element.offsetWidth + "px";

  element.style.display = "none";
  element.parentNode.insertBefore(input, element);
  input.focus();

  function saveEdit() {
    var newValue = input.value;
    if (type === "text" && (newValue.length < 3 || newValue.length > 255)) {
      alert("Tekst musi mieć od 3 do 255 znaków");
      input.remove();
      element.style.display = "";
      return;
    }

    if (type === "text") {
      task.text = newValue;
      element.textContent = newValue;
    } else {
      task.date = newValue;
      element.textContent = newValue || "Brak daty";
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.remove();
    element.style.display = "";
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });
}

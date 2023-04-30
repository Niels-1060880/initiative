import { io } from "socket.io-client";
// const io = require("socket.io-client")

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
  socket.emit("custom-event", "Hi");
});

socket.on("place-card", (message) => {
  alert(message);
});
socket.on("bloodied-card", (message) => {
  alert(message);
});
socket.on("unbloodied-card", (message) => {
  alert(message);
});
socket.on("death-card", (message) => {
  alert(message);
});
socket.on("dragstart-card", (message) => {
  alert(message);
});
socket.on("dragdrop-card", (message) => {
  alert(message);
});
socket.on("new-round", (message) => {
  alert(message);
});

// Handles new round
const doneList = document.getElementById("done-list");
const waitList = document.getElementById("wait-list");

// Handles bloodied toggle
const graveStones = document.getElementsByClassName("grave-stone");
function bloodied(e) {
  if (e.classList.contains("bloodied")) {
    e.classList.remove("bloodied");
    let graveStone = graveStones[e.id - 1];
    graveStone.style.backgroundColor = "transparent";
    socket.emit("unbloodied-card", "card unbloodied");
  } else {
    e.classList.add("bloodied");
    let graveStone = graveStones[e.id - 1];
    graveStone.style.backgroundColor = "white";
    socket.emit("bloodied-card", "card bloodied");
  }
}

function deathToggle(e) {
  e.parentElement.remove();
  socket.emit("death-card", "card died");
}

// Handles adding of new card
const selectables = document.getElementsByClassName("selectable");
let id = 1;
for (let selectable of selectables) {
  selectable.addEventListener("click", () => {
    for (let child of selectable.children) {
      let newChild = child.cloneNode(true);
      newChild.id = id;
      id++;
      socket.emit("place-card", "card placed");
      waitList.appendChild(newChild);
    }
  });
}

waitList.addEventListener("dragstart", (e) => {
  // Change the source element's background color
  // to show that drag has started
  e.currentTarget.classList.add("dragging");
  // Clear the drag data cache (for all formats/types)
  e.dataTransfer.clearData();
  // Set the drag's format and data.
  // Use the event target's id for the data
  e.dataTransfer.setData("text/plain", e.target.id);
  socket.emit("dragstart-card", "card startdrag");
});

doneList.addEventListener("dragenter", (e) => {
  e.preventDefault();
  e.target.classList.add("drag-over");
});

doneList.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.target.classList.add("drag-over");
});

doneList.addEventListener("dragleave", (e) => {
  e.target.classList.remove("drag-over");
});

doneList.addEventListener("drop", (e) => {
  e.preventDefault();
  e.target.classList.remove("drag-over");
  // get the draggable element
  const id = e.dataTransfer.getData("text");
  const draggable = document.getElementById(id);
  // add it to the drop target
  e.target.appendChild(draggable);
  socket.emit("dragdrop-card", "card dropped");
});

// Checks if wait list is empty
let divCheckingInterval = setInterval(() => {
  if (waitList.children.length == 0) {
    newRound(doneList.children);
  }
}, 500);

// Puts all cards back in wait list
function newRound(children) {
  let cards = [];
  for (let card of children) {
    cards.push(card);
  }
  for (let card of cards) {
    waitList.appendChild(card);
  }
  // socket.emit("new-round", "new round");
}
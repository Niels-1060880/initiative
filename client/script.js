import { io } from "socket.io-client";
// const io = require("socket.io-client")

const socket = io("http://localhost:3000");

const doneList = document.getElementById("done-list");
const waitList = document.getElementById("wait-list");
const graveStoneDivs = document.getElementsByClassName("grave-stone-div");
const graveStones = document.getElementsByClassName("grave-stone");
const selectables = document.getElementsByClassName("selectable");
const reset = document.getElementById("reset");
let counter = document.getElementById("counter");
let enemyCounter = document.getElementById("enemy-counter");

socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
  socket.emit("custom-event", "Hi");
});

socket.on("place-card", (id, cardClass, name) => {
  let markup = "";
  if (name == "Boss") {
    markup = `
            <div
              id="${id}"
              class="card ${cardClass}-card"
              draggable="true"
            >
              <div class="boss-banner"></div>
              <p>${name}</p>
              <div class="grave-stone-div">
                <object
                  data="../icons/gravestone.svg"
                  class="grave-stone"
                  type=""
                ></object>
              </div>
            </div>`;
  } else {
    markup = `
            <div
              id="${id}"
              class="card ${cardClass}-card"
              draggable="true"
            >
              <p>${name}</p>
              <div class="grave-stone-div">
                <object
                  data="../icons/gravestone.svg"
                  class="grave-stone"
                  type=""
                ></object>
              </div>
            </div>`;
  }
  waitList.insertAdjacentHTML("beforeend", markup);
  if (cardClass == "enemy") enemyCounter.innerHTML++;
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
socket.on("dragdrop-card", (cardId) => {
  const card = document.getElementById(cardId);
  waitList.removeChild(card);
  doneList.appendChild(card);
});
socket.on("reset-game", () => {
  waitList.innerHTML = "";
  doneList.innerHTML = "";
  counter.innerHTML = 0;
  enemyCounter.innerHTML = 0;
});

const cards = document.getElementsByClassName("card");
for (let card of cards) {
  // console.log(card);
  card.addEventListener("dblclick", () => {
    console.log("card click");
  });
}

// Handles bloodied toggle
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

// Handles the death of a card
for (let graveStone of graveStoneDivs) {
  graveStone.addEventListener("click", () => {
    console.log("click");
  });
}

function deathToggle(e) {
  e.parentElement.remove();
  socket.emit("death-card", "card died");
}

// Handles adding of new card
let id = 1;
for (let selectable of selectables) {
  selectable.addEventListener("click", () => {
    let cardClass = selectable.classList[1];
    let name = selectable.getElementsByTagName("*")[1].innerHTML;
    if (name == "") name = selectable.getElementsByTagName("*")[2].innerHTML;
    socket.emit("place-card", id, cardClass, name);
    id++;
  });
}

// Handles the dragging functionality
waitList.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
  socket.emit("dragstart-card", e.target.id);
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
  const id = e.dataTransfer.getData("text");
  socket.emit("dragdrop-card", id);
});

// Handles new round
// Checks if wait list is empty
let divCheckingInterval = setInterval(() => {
  if (waitList.children.length == 0 && doneList.childElementCount != 0) {
    newRound(doneList.children);
    counter.innerHTML++;
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
}

// Handles game reset
reset.addEventListener("click", () => {
  socket.emit("reset-game");
});

// Checks how many enemies are on the board

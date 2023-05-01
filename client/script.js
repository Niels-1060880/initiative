import { io } from "socket.io-client";
// const io = require("socket.io-client")

const socket = io("http://localhost:3000");

const doneList = document.getElementById("done-list");
const waitList = document.getElementById("wait-list");
let counter = document.getElementById("counter");

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
});

const cards = document.querySelectorAll(".card");
for (let card = 0; card <= cards.length; card++) {
  console.log(cards[card]);
  // card.addEventListener('click', () => {
  //   console.log('card click');
  // })
}

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

// Handles the death of a card
const graveStoneDivs = document.getElementsByClassName("grave-stone-div");
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
const selectables = document.getElementsByClassName("selectable");
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

// Handles reset
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  socket.emit("reset-game");
});

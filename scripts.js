// Notification
if (Notification.permission === "default") {
  Notification.requestPermission();
}

// Geolokacja
function getLocation() {
  if (! navigator.geolocation) {
    alert("Przepraszam, geolokalizacja nie jest dostępna!");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    document.getElementById("latitude").innerText = position.coords.latitude;
    document.getElementById("longitude").innerText = position.coords.longitude;
    console.log(`Twoja lokalizacja: ${position.coords.latitude}, ${position.coords.longitude}`);

    marker.setLatLng([position.coords.latitude, position.coords.longitude]);
    map.setView([position.coords.latitude, position.coords.longitude]);

    // Powiadomienie
    if (Notification.permission === "granted") {
      new Notification("Lokalizacja pobrana!");
    } else {
      Notification.requestPermission();
    }

  }, (positionError) => {
    console.error(positionError);
  },{
    enableHighAccuracy: false
  });
}

// Geolokacja z mapką
let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    // canvas
    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0, 300, 150);
  });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    let lat = position.coords.latitude; // position.coords.latitude;
    let lon = position.coords.longitude; // position.coords.longitude;

    map.setView([lat, lon]);
  }, positionError => {
    console.error(positionError);
  });
});

// Drag and drop
let items = document.querySelectorAll('.item');
for (let item of items) {
  item.addEventListener("dragstart", function(event) {

    this.style.border = "5px dashed #D8D8FF";
    event.dataTransfer.setData("text", this.id);
  });

  item.addEventListener("dragend", function(event) {
    this.style.borderWidth = "0";
  });
}

let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
  target.addEventListener("dragenter", function (event) {
    this.style.border = "2px solid #7FE9D9";
  });
  target.addEventListener("dragleave", function (event) {
    this.style.border = "2px dashed #7f7fe9";
  });
  target.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  target.addEventListener("drop", function (event) {
    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
    this.appendChild(myElement)
    this.style.border = "2px dashed #7f7fe9";

    checkPuzzle();
  }, false);
}

// Generate puzzle
// Tutaj użyłem copilota Microsoftu do poprawnego dzielenia części

// Generate puzzle
function generatePuzzle() {
  // Clear past
  const containers = document.querySelectorAll('.drag-target');
  containers.forEach(container => {
    while (container.firstChild) container.removeChild(container.firstChild);
  });

  let mapCanvas = document.getElementById("rasterMap");
  let width = mapCanvas.width;
  let height = mapCanvas.height;

  const puzzleSize = 1; // 4x4

  let pieceWidth = width / puzzleSize;
  let pieceHeight = height / puzzleSize;

  let positions = [];

  for (let row = 0; row < puzzleSize; row++) {
    for (let col = 0; col < puzzleSize; col++) {
      positions.push({
        x: col * pieceWidth,
        y: row * pieceHeight,
        correctIndex: row * puzzleSize + col
      });
    }
  }

  // Mieszanie
  for (let j = positions.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [positions[j], positions[k]] = [positions[k], positions[j]];
  }

  let i = 0;

  for (let row = 0; row < puzzleSize; row++) {
    for (let col = 0; col < puzzleSize; col++) {
      let widthStart = positions[i].x;
      let heightStart = positions[i].y;

      const newCanvas = document.createElement("canvas");
      newCanvas.id = "piece" + i;
      newCanvas.dataset.correctIndex = positions[i].correctIndex;

      const target2 = document.getElementById('target2');
      target2.appendChild(newCanvas);

      const canvas = document.getElementById("piece" + i);

      canvas.setAttribute("width", pieceWidth.toString());
      canvas.setAttribute("height", pieceHeight.toString());
      canvas.setAttribute("draggable", "true");

      newCanvas.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text", this.id);
      });

      newCanvas.addEventListener("dragover", function (event) {
        event.preventDefault();
      });

      newCanvas.addEventListener("drop", function (event) {
        event.preventDefault();

        const draggedId = event.dataTransfer.getData("text");
        const draggedEl = document.getElementById(draggedId);
        const targetEl = this;

        if (draggedEl === targetEl) return;

        const parent = targetEl.parentNode;

        const draggedNext = draggedEl.nextSibling;
        const targetNext = targetEl.nextSibling;

        parent.insertBefore(draggedEl, targetNext);
        parent.insertBefore(targetEl, draggedNext);

        checkPuzzle();
      });

      const ctx = canvas.getContext("2d");
      const image = document.getElementById("rasterMap");
      ctx.drawImage(image, widthStart, heightStart, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

      i++;
    }
  }
}

// Check puzzle
function checkPuzzle() {
  const container = document.querySelectorAll(".drag-target")[0]; // TARGET 1
  const pieces = Array.from(container.children);

  const totalPieces = document.querySelectorAll('canvas[id^="piece"]').length;

  if (pieces.length !== totalPieces) return false;

  for (let i = 0; i < pieces.length; i++) {
    if (parseInt(pieces[i].dataset.correctIndex) !== i) {
      return false;
    }
  }

  // Win
  if (Notification.permission === "granted") {
    new Notification("Ułożone");
    console.debug("Ułożone");
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Ułożone");
        console.debug("Ułożone");
      }
    });
  }
  return true;
}

//.  https://en.wikipedia.org/wiki/Carcassonne_(board_game)

const grid = document.getElementById('grid');

let gridSize = 15; // Change this to change the grid size (e.g., 8 for 8x8, 20 for 20x20)

const straightImage = "url('img/stright.webp')";
const straightRoad = [0, 1, 0, 1];
// Example road data for a straight road (up, right, down, left)
const TImage = "url('img/T.webp')";
const TRoad = [1, 1, 0, 1];

const cornerImage = "url('img/corner.webp')";
const cornerRoad = [1, 0, 0, 1];

const XImage = "url('img/X.webp')";
const XRoad = [1, 1, 1, 1];

const cityImage = "url('img/city.webp')";
const cityRoad = [0, 0, 0, 1];
const cityNoRoadData = [0, 0, 0, 0];
const cityWithNoRoadImage = "url('img/cityNoRoad.webp')"; 

const forest1edgeImage = "url('img/forestOneEdge.webp')";
const forest1edgeData = [2, 0, 0, 0];

const forest2edgeImage = "url('img/forest2edge.webp')";
const forest2edgeData = [2, 0, 2, 0];

const TwithBImage = "url('img/TwithB.webp')";
const TwithBRoad = [2, 1, 1, 1];

const rwithBImage = "url('img/rwithB.webp')";
const rwithBRoad = [2, 1, 1, 0];

const lwithBImage = "url('img/lwithB.webp')";
const lwithBRoad = [2, 0, 1, 1];
const allBImage = "url('img/allb.webp')";
const allBRoad = [2, 2, 2, 2];

const st8withBImage = "url('img/str8withB.webp')";
const st8withBRoad = [2, 1, 0, 1];

const BcornerImage = "url('img/Bcorner.webp')";
const BcornerRoad = [2, 2, 0, 0];
const RoadIntoBrownImage = "url('img/rintoB.webp')";
const RoadIntoBrownData = [2, 2, 1, 2];

const cornerwith2bImage = "url('img/cornerwith2b.webp')";
const cornerwith2bData = [2, 2, 1, 1];

const mostBnoRoadImage = "url('img/mostBnoR.webp')";
const mostBnoRoadData = [2, 2, 0, 2];

const forestMiddleImage = "url('img/forestMiddle.webp')";
const forestMiddleData = [0, 2, 0, 2];

const rivertoMiddleImage = "url('img/riverwend.webp')";
const rivertoMiddleData = [0, 0, 3, 0];

const st8riverImage = "url('img/st8river.webp')";
const st8riverData = [3, 0, 3, 0];

const cornerRiverImage = "url('img/cornerriver.webp')";
const cornerRiverData = [0, 0, 3, 3];

const conerBwithRiverImage = "url('img/cornerBwithriver.webp')";
const conerBwithRiverData = [2, 2, 3, 3];

const riverbetweenbImage = "url('img/riverbtweenb.webp')";
const riverbetweenbData = [3, 2, 3, 2];

const roadoverRiverImage = "url('img/roadoverriver.webp')";
const roadoverRiverData = [1, 3, 1, 3];

const riverroadcityImage = "url('img/riverroadcity.webp')";
const riverroadcityData = [0, 3, 1, 3];

const briverroadImage = "url('img/briverroad.webp')";
const briverroadData = [2, 3, 1, 3];

const riverroadcornerImage = "url('img/river\ road\ corner.webp')";
const riverroadcornerData = [1, 1, 3, 3];



let LASTTOUCHED = null;




// Set CSS variables for dynamic grid
document.documentElement.style.setProperty('--gridCols', gridSize);
document.documentElement.style.setProperty('--gridRows', gridSize);

// Add event listener for 'f' key press
document.addEventListener('keydown', function(event) {
   if (event.key === 'n' || event.key === 'N') {
    if (LASTTOUCHED) {
        let passed = false;
        let trys = 0;
         while (!passed) {
            console.log("Attempting to place road, try number: " + trys);
            let tile = GetTile();
            console.log("Drawn tile: ", tile);
            if (tile === undefined) {
                alert("No more tiles in the deck.");
                return;
            }
            let available = GetActionableCellsBasedOn(tile[1]);

            console.log("Available cells to place road: ", available);
            if (available == undefined ) {
                available = GetActionableCells();
            }
            
            // Get all empty cells adjacent to placed tiles
            let adjacentEmpty = [];
            for (let cell of grid.children) {
                if (cell.title !== "") {
                    let ci = getCellIndexAsXY(cell);
                    if (ci.y > 0) {
                        let up = GetCellAt(ci.x, ci.y - 1);
                        if (up.title === "") adjacentEmpty.push(up);
                    }
                    if (ci.x < gridSize - 1) {
                        let right = GetCellAt(ci.x + 1, ci.y);
                        if (right.title === "") adjacentEmpty.push(right);
                    }
                    if (ci.y < gridSize - 1) {
                        let down = GetCellAt(ci.x, ci.y + 1);
                        if (down.title === "") adjacentEmpty.push(down);
                    }
                    if (ci.x > 0) {
                        let left = GetCellAt(ci.x - 1, ci.y);
                        if (left.title === "") adjacentEmpty.push(left);
                    }
                }
            }
            // Remove duplicates
            adjacentEmpty = [...new Set(adjacentEmpty)];

            // If no adjacent empty (first tile), use all empty
            if (adjacentEmpty.length === 0) {
                adjacentEmpty = Array.from(grid.children).filter(cell => cell.title === "");
            }
            
            if (trys >  gridSize * gridSize) {
                Deck.push(tile); // Return the tile back to the deck
                // alert("Exceeded maximum number of tries to place a road.");
                return;
            }
            if (adjacentEmpty.length == 0) {
                console.log("No available cells to place a road.");
                Deck.push(tile);
                return;
            }
            // First try preferred cells (adjacent to same type component)
            let triedCells = new Set();
            if (available.length > 0) {
                for (let cell of available) {
                    if (cell.title !== "") continue; // Skip if not empty
                    triedCells.add(cell);
                    let roadData = tile[1];
                    for (let rot = 0; rot < 4; rot++) {
                        if (checkIfValidPlacement(cell, roadData)) {
                            PlaceRoad(cell, tile[0], tile[1], rot);
                            LASTTOUCHED = cell;
                            passed = true;
                            break;
                        }
                        roadData = rotateRoad(roadData);
                    }
                    if (passed) break;
                }
            }
            // If not placed, try remaining adjacent empty
            if (!passed) {
                for (let cell of adjacentEmpty) {
                    if (triedCells.has(cell) || cell.title !== "") continue; // Skip if already tried or not empty
                    let roadData = tile[1];
                    for (let rot = 0; rot < 4; rot++) {
                        if (checkIfValidPlacement(cell, roadData)) {
                            PlaceRoad(cell, tile[0], tile[1], rot);
                            LASTTOUCHED = cell;
                            passed = true;
                            break;
                        }
                        roadData = rotateRoad(roadData);
                    }
                    if (passed) break;
                }
            }
            if (!passed) {
                Deck.push(tile); // Return the tile back to the deck
            }
            trys++;
        }
        updatePreview();
        updateScore();
    } else {
      console.log('No cell has been touched yet.');
    }
  } else if (event.key === 'a' || event.key === 'A') {
    if (Deck.length === 0) {
        Deck = buildDeck();
        updatePreview();
    }
    autoPlaceAll();
  } else if (event.key === 's' || event.key === 'S') {
    updateScore();
  }

});

for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.title = ""; // Ensure cell is empty initially
    cell.onclick = EventRotateCell;
    cell.onmouseenter = PrintData;
    // Keyboard events only fire if the element is focusable
    cell.tabIndex = 0; // Make cell focusable
    cell.addEventListener('keyup', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            PrintData(event);
        }
    });
    // Add drag and drop listeners
    cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        cell.classList.add('drag-over');
    });
    cell.addEventListener('dragleave', () => {
        cell.classList.remove('drag-over');
    });
    cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('drag-over');
        const tileIndex = e.dataTransfer.getData('text/plain');
        if (tileIndex !== '' && cell.title === '') {
            const tile = Deck[tileIndex];
            if (tile) {
                const draggedTile = previewTiles.find(t => t.dataset.tileIndex == tileIndex);
                const rotation = draggedTile ? parseInt((draggedTile.style.transform || 'rotate(0deg)').match(/\d+/)[0]) / 90 : 0;
                PlaceRoad(cell, tile[0], tile[1], rotation);
                Deck.splice(tileIndex, 1);
                updatePreview();
                updateScore();
            }
        }
    });
    grid.appendChild(cell);
}


function buildDeck() {
    let deck = [];
    deck.push(...Array(4).fill([cityWithNoRoadImage, cityNoRoadData]));
    deck.push(...Array(2).fill([cityImage, cityRoad]));
    deck.push(...Array(8).fill([straightImage, straightRoad]));
    deck.push(...Array(9).fill([cornerImage, cornerRoad]));
    deck.push(...Array(4).fill([TImage, TRoad]));
    deck.push(...Array(1).fill([XImage, XRoad]));
    deck.push(...Array(5).fill([forest1edgeImage, forest1edgeData]));
    deck.push(...Array(4).fill([st8withBImage, st8withBRoad]));
    deck.push(...Array(3).fill([rwithBImage, rwithBRoad]));
    deck.push(...Array(3).fill([lwithBImage, lwithBRoad]));
    deck.push(...Array(3).fill([TwithBImage, TwithBRoad]));
    deck.push(...Array(3).fill([forest2edgeImage, forest2edgeData]));
    deck.push(...Array(7).fill([BcornerImage, BcornerRoad]));
    deck.push(...Array(3).fill([forestMiddleImage, forestMiddleData]));
    deck.push(...Array(5).fill([cornerwith2bImage, cornerwith2bData]));
    deck.push(...Array(4).fill([mostBnoRoadImage, mostBnoRoadData]));
    deck.push(...Array(3).fill([RoadIntoBrownImage, RoadIntoBrownData]));
    deck.push(...Array(1).fill([allBImage, allBRoad]));
    deck.push(...Array(1).fill([rivertoMiddleImage, rivertoMiddleData]));
    deck.push(...Array(2).fill([st8riverImage, st8riverData]));
    deck.push(...Array(2).fill([cornerRiverImage, cornerRiverData]));
    deck.push(...Array(1).fill([riverroadcityImage, riverroadcityData]));
    deck.push(...Array(1).fill([roadoverRiverImage, roadoverRiverData]));
    deck.push(...Array(1).fill([riverroadcornerImage, riverroadcornerData]));
    deck.push(...Array(1).fill([briverroadImage, briverroadData]));
    deck.push(...Array(1).fill([riverbetweenbImage, riverbetweenbData]));
    deck.push(...Array(1).fill([conerBwithRiverImage, conerBwithRiverData]));
    deck = deck.sort(() => Math.random() - 0.5);
    // console.log("Deck built with " + deck.length + " cards.");
    return deck;
}

let Deck = buildDeck();

const previewTiles = [document.getElementById('tile1'), document.getElementById('tile2'), document.getElementById('tile3')];

function updatePreview() {
    for (let i = 0; i < 3; i++) {
        if (Deck.length > i) {
            previewTiles[i].style.backgroundImage = Deck[Deck.length - 1 - i][0];
            previewTiles[i].style.transform = 'rotate(0deg)'; // Reset rotation
        } else {
            previewTiles[i].style.backgroundImage = 'none';
            previewTiles[i].style.transform = 'rotate(0deg)';
        }
    }
}

updatePreview();

function makeDraggable() {
    previewTiles.forEach((tile, index) => {
        tile.draggable = true;
        tile.addEventListener('dragstart', (e) => {
            const tileIndex = Deck.length - 1 - index;
            e.dataTransfer.setData('text/plain', tileIndex.toString());
            e.dataTransfer.effectAllowed = 'move';
        });
        tile.addEventListener('click', () => {
            // Rotate the tile data in the deck
            const tileIndex = Deck.length - 1 - index;
            if (Deck[tileIndex]) {
                Deck[tileIndex][1] = rotateRoad(Deck[tileIndex][1]);
                // Update the visual rotation
                const currentRotation = tile.style.transform || 'rotate(0deg)';
                const rotationDeg = parseInt(currentRotation.match(/\d+/)[0]) || 0;
                tile.style.transform = `rotate(${rotationDeg + 90}deg)`;
            }
        });
    });
}

makeDraggable();

document.getElementById('shuffleBtn').addEventListener('click', () => {
    // Move the first 3 tiles to the back of the deck
    if (Deck.length > 3) {
        Deck.push(...Deck.splice(0, 3));
    }
    updatePreview();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (window.self !== window.top) {
        // In iframe, reset game state without refreshing
        for (let cell of grid.children) {
            cell.style.backgroundImage = '';
            cell.title = '';
            cell.style.transform = 'rotate(0deg)';
            cell.style.border = ''; // Reset any borders from longest component
        }
        Deck = buildDeck();
        updatePreview();
        LASTTOUCHED = null;
    } else {
        // Not in iframe, refresh the page
        location.reload();
    }
});

document.getElementById('helpBtn').addEventListener('click', () => {
    const popover = document.getElementById('helpPopover');
    if (popover.style.display === 'block') {
        popover.style.display = 'none';
    } else {
        popover.style.display = 'block';
    }
});

// Hide popover when clicking outside
document.addEventListener('click', (event) => {
    const popover = document.getElementById('helpPopover');
    const helpBtn = document.getElementById('helpBtn');
    if (!popover.contains(event.target) && !helpBtn.contains(event.target)) {
        popover.style.display = 'none';
    }
});

function autoPlaceAll() {
    while (Deck.length > 0) {
        let tile = GetTile();
        if (!tile) break;
        let placed = false;

        // Get all empty cells adjacent to placed tiles
        let adjacentEmpty = [];
        for (let cell of grid.children) {
            if (cell.title !== "") {
                let ci = getCellIndexAsXY(cell);
                if (ci.y > 0) {
                    let up = GetCellAt(ci.x, ci.y - 1);
                    if (up.title === "") adjacentEmpty.push(up);
                }
                if (ci.x < gridSize - 1) {
                    let right = GetCellAt(ci.x + 1, ci.y);
                    if (right.title === "") adjacentEmpty.push(right);
                }
                if (ci.y < gridSize - 1) {
                    let down = GetCellAt(ci.x, ci.y + 1);
                    if (down.title === "") adjacentEmpty.push(down);
                }
                if (ci.x > 0) {
                    let left = GetCellAt(ci.x - 1, ci.y);
                    if (left.title === "") adjacentEmpty.push(left);
                }
            }
        }
        // Remove duplicates
        adjacentEmpty = [...new Set(adjacentEmpty)];

        // If no adjacent empty (first tile), use all empty
        if (adjacentEmpty.length === 0) {
            adjacentEmpty = Array.from(grid.children).filter(cell => cell.title === "");
        }

        // Try to place on each adjacent empty with rotations
        for (let cell of adjacentEmpty) {
            if (cell.title !== "") continue; // Skip if not empty
            let roadData = tile[1];
            for (let rot = 0; rot < 4; rot++) {
                if (checkIfValidPlacement(cell, roadData)) {
                    PlaceRoad(cell, tile[0], tile[1], rot);
                    updateScore();
                    placed = true;
                    break;
                }
                roadData = rotateRoad(roadData);
            }
            if (placed) break;
        }

        if (!placed) {
            console.log("No valid placement for tile, skipping");
        }
    }
    updatePreview();
}

function checkIfValidPlacement(cell, roadData) {
    let ci = getCellIndexAsXY(cell);
    let up = ci.y > 0 ? GetCellAt(ci.x, ci.y - 1) : null;
    let right = ci.x < gridSize - 1 ? GetCellAt(ci.x + 1, ci.y) : null;
    let down = ci.y < gridSize - 1 ? GetCellAt(ci.x, ci.y + 1) : null;
    let left = ci.x > 0 ? GetCellAt(ci.x - 1, ci.y) : null;

    if (up && up.title) {
        let upData = JSON.parse(up.title);
        if (roadData[0] !== upData[2]) return false;
    }
    if (right && right.title) {
        let rightData = JSON.parse(right.title);
        if (roadData[1] !== rightData[3]) return false;
    }
    if (down && down.title) {
        let downData = JSON.parse(down.title);
        if (roadData[2] !== downData[0]) return false;
    }
    if (left && left.title) {
        let leftData = JSON.parse(left.title);
        if (roadData[3] !== leftData[1]) return false;
    }
    return true;
}

function GetTile() {
    return Deck.pop();
}

function getLargestComponent(type) {
    let visited = new Set();
    let maxSize = 0;
    
    for (let i = 0; i < grid.children.length; i++) {
        const cell = grid.children[i];
        if (cell.title && !visited.has(i)) {
            let data = JSON.parse(cell.title);
            if (data.some(d => d === type)) {
                let size = bfs(i, type, visited);
                maxSize = Math.max(maxSize, size);
            }
        }
    }
    return maxSize;
}

function bfs(startIndex, type, visited) {
    let queue = [startIndex];
    visited.add(startIndex);
    let size = 1;
    
    while (queue.length > 0) {
        let idx = queue.shift();
        let cell = grid.children[idx];
        let ci = getCellIndexAsXY(cell);
        let d = JSON.parse(cell.title);
        
        // Check up
        if (ci.y > 0) {
            let upIdx = idx - gridSize;
            let upCell = grid.children[upIdx];
            if (upCell.title && !visited.has(upIdx)) {
                let upData = JSON.parse(upCell.title);
                if (d[0] === type && upData[2] === type) {
                    visited.add(upIdx);
                    queue.push(upIdx);
                    size++;
                }
            }
        }
        // Check right
        if (ci.x < gridSize - 1) {
            let rightIdx = idx + 1;
            let rightCell = grid.children[rightIdx];
            if (rightCell.title && !visited.has(rightIdx)) {
                let rightData = JSON.parse(rightCell.title);
                if (d[1] === type && rightData[3] === type) {
                    visited.add(rightIdx);
                    queue.push(rightIdx);
                    size++;
                }
            }
        }
        // Check down
        if (ci.y < gridSize - 1) {
            let downIdx = idx + gridSize;
            let downCell = grid.children[downIdx];
            if (downCell.title && !visited.has(downIdx)) {
                let downData = JSON.parse(downCell.title);
                if (d[2] === type && downData[0] === type) {
                    visited.add(downIdx);
                    queue.push(downIdx);
                    size++;
                }
            }
        }
        // Check left
        if (ci.x > 0) {
            let leftIdx = idx - 1;
            let leftCell = grid.children[leftIdx];
            if (leftCell.title && !visited.has(leftIdx)) {
                let leftData = JSON.parse(leftCell.title);
                if (d[3] === type && leftData[1] === type) {
                    visited.add(leftIdx);
                    queue.push(leftIdx);
                    size++;
                }
            }
        }
    }
    return size;
}

function getScore() {
    let roadScore = getLargestComponent(1);
    let cityScore = getLargestComponent(2);
    return Math.max(roadScore, cityScore);
}

function PrintData(event) {
    event.preventDefault();
    const cell = event.target;
    console.log(getCellIndexAsXY(cell));
    console.log(cell.title);
}

function PlacePreviewTileOnCell(cell) {
    if (cell.title === "" && Deck.length > 0) {
        // Place the first tile
        const tile = Deck.pop();
        updatePreview();
        PlaceRoad(cell, tile[0], tile[1]);
        updateScore();
    } else {
        rotateCell(cell);
    }
}

function EventRotateCell(event) {
    const cell = event.target;
    PlacePreviewTileOnCell(cell);
}


function rotateCell(cell) {
    // console.log("Rotating cell at ", getCellIndexAsXY(cell));

      getCellIndexAsXY(cell);
  if (cell.title == "") {
    PlaceRoad(cell, straightImage, straightRoad);
        return;
  }
    let roadData = JSON.parse(cell.title);
    
    if (cell.style.transform == "rotate(0deg)" ) {
        cell.style.transform = "rotate(90deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(90deg)") {
        cell.style.transform = "rotate(180deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(180deg)") {
        cell.style.transform = "rotate(270deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(270deg)") {
        cell.style.transform = "rotate(0deg)";
        roadData = rotateRoad(roadData);
    } else {
        cell.style.transform = "rotate(0deg)";
    }    
    cell.title = JSON.stringify(roadData);
    // console.log(cell.title);
}


function rotateRoad(roadData) {
    return [roadData[3], roadData[0], roadData[1], roadData[2]];
   
}


function PlaceNextRoadGood(cell, roadTypeImage, roadTypeData, depth=0, cellindex = null) {
    // TEST.style.backgroundImage = roadTypeImage;
    if (depth > 3) {
        // console.log("Max depth reached");
        return false;
    }
    let up = null;
    let right = null;
    let down = null;
    let left = null;


    console.log("Placing next road at ", getCellIndexAsXY(cell));
    console.log("Road data: ", roadTypeData);

    if (cellindex == null) {
        cellindex = getCellIndexAsXY(cell);
    }
    if (cellindex.x < gridSize - 1 ){
        right = GetCellAt(cellindex.x + 1, cellindex.y);
    } 
    if (cellindex.x  -1 >= 0 ){
        left = GetCellAt(cellindex.x - 1, cellindex.y);
    } 
    if (cellindex.y < gridSize - 1 ){
        down = GetCellAt(cellindex.x, cellindex.y + 1);
    } 
    if (cellindex.y - 1 >= 0 ){
        up = GetCellAt(cellindex.x, cellindex.y - 1);
    }
    const cellData = JSON.parse(cell.title);
    let directions = ['up', 'right', 'down', 'left'];
    // Try each direction: right, up, left, down
    const directionsMap = [
        { dir: 'right', cell: right, check: CheckRight },
        { dir: 'up', cell: up, check: CheckUp },
        { dir: 'left', cell: left, check: CheckLeft },
        { dir: 'down', cell: down, check: CheckDown }
    ];

    for (const { cell: dirCell, check } of directionsMap) {
        if (dirCell && dirCell.title === "") {
            // Try all 4 rotations
            let tempRoadData = roadTypeData;
            for (let rot = 0; rot < 4; rot++) {
                if (check(dirCell, tempRoadData)) {
                    PlaceRoad(dirCell, roadTypeImage, roadTypeData, rot);
                    LASTTOUCHED = dirCell;
                    return true;
                }
                tempRoadData = rotateRoad(tempRoadData);
            }
        }
    }

    // If cell is empty (all zeros), place on first actionable cell
    if (cellData.every(v => v === 0)) {
        let ac = GetActionableCells();
        if (ac.length > 0) {
            PlaceRoad(ac[0], roadTypeImage, roadTypeData, 0);
            LASTTOUCHED = ac[0];
            return true;
        }
    }

    console.log("No valid placement found");
    return false;

}



    
function CheckUp(UPcell, upCellData) {
    let cellIndex = getCellIndexAsXY(UPcell);
    let upright =  (cellIndex.x + 1 < gridSize ) ?  GetCellAt(cellIndex.x + 1, cellIndex.y ) : null;
    let upleft = (cellIndex.x - 1 >= 0) ? GetCellAt(cellIndex.x - 1, cellIndex.y ) : null;
    let upup = (cellIndex.y - 1 >= 0) ? GetCellAt(cellIndex.x, cellIndex.y - 1) : null;
    let uprightData = (upright != null && upright.title != "") ? JSON.parse(upright.title) : null;
    let upleftData = (upleft != null && upleft.title != "") ? JSON.parse(upleft.title) : null;
    let upupData = (upup != null && upup.title != "") ? JSON.parse(upup.title) : null;
    let down = GetCellAt(cellIndex.x, cellIndex.y + 1);
    let downData = (down != null && down.title != "") ? JSON.parse(down.title) : null;
    // down 
    if (downData == null ? upCellData[2] == 1 : Number(upCellData[2]) != Number(downData[0])) {
        console.log("fail down check");
        return false ;}
    // up up
    if ((upupData != null)) if ( (Number(upupData[2]) !=  Number(upCellData[0])) ) {
        console.log("fail up up check");
        return false;}
    // right 
    if (uprightData != null) if   ((Number(uprightData[3]) !=  Number(upCellData[1])) ? true :  false) {
        console.log("fail right check");
        
        return false;}
    //left
    if (upleftData != null) if (!(Number(upleftData[1]) ==  Number(upCellData[3])))  { 
        console.log("fail left check");
        return false;}

    
    return true;
}


function CheckRight(RIGHTcell, rightCellData) {
    let cellIndex = getCellIndexAsXY(RIGHTcell);
    let rightup = null
    if (cellIndex.y - 1 >= 0 ) rightup = GetCellAt(cellIndex.x, cellIndex.y - 1);
    let rightdown = null;
    if (cellIndex.y + 1 < gridSize ) rightdown = GetCellAt(cellIndex.x, cellIndex.y + 1);
    let rightright = null;
    if (cellIndex.x + 1 < gridSize ) rightright = GetCellAt(cellIndex.x + 1, cellIndex.y);
    let rightupData = (rightup != null && rightup.title != "") ? JSON.parse(rightup.title) : null;
    let rightdownData = (rightdown != null && rightdown.title != "") ? JSON.parse(rightdown.title) : null;
    let rightrightData = (rightright != null && rightright.title != "") ? JSON.parse(rightright.title) : null;
    let left = GetCellAt(cellIndex.x - 1, cellIndex.y);
    let leftData = (left != null && left.title != "") ? JSON.parse(left.title) : null;
    // check left Data
    if (leftData != null) {
        if (!(Number(leftData[1]) == Number(rightCellData[3]) && leftData[1] != 0)) {
            console.log(leftData);
            console.log(rightCellData);
            console.log("fail left check");
            return false;
        }
    } else if (rightCellData[3] == 1) {
        console.log("fail left edge check");
        return false;
    }
    // check right of right 
    if (rightrightData != null) {
        if  (!(Number(rightrightData[3]) ==  Number(rightCellData[1]))) { console.log("fail right of right check"); return false; } }
        // no roads off right side of board
        // else if (rightCellData[1] == 1) { return false; }
        // check up of right
    if ((rightupData != null)) if  (Number(rightupData[2]) !=  Number(rightCellData[0]) ) { console.log("fail up of right check"); return false;}
    // check down of right
    if ((rightdownData != null)) { if  (Number(rightdownData[0]) !=  Number(rightCellData[2]) ){ console.log("fail down of right check"); return false; } }
    return true;
}
    

function CheckLeft(LEFTcell, leftCellData) {
    let cellIndex = getCellIndexAsXY(LEFTcell);
    let leftup = (cellIndex.y - 1 >= 0 ) ? GetCellAt(cellIndex.x, cellIndex.y - 1) : null;
    let leftdown = (cellIndex.y + 1 < gridSize ) ? GetCellAt(cellIndex.x, cellIndex.y + 1) : null;
    let leftleft = (cellIndex.x - 1 >= 0) ? GetCellAt(cellIndex.x - 1, cellIndex.y) : null;
    let leftupData = (leftup != null && leftup.title != "") ? JSON.parse(leftup.title) : null;
    let leftdownData = (leftdown != null && leftdown.title != "") ? JSON.parse(leftdown.title) : null;
    let leftleftData = (leftleft != null && leftleft.title != "") ? JSON.parse(leftleft.title) : null;
    let right = GetCellAt(cellIndex.x + 1, cellIndex.y);
    let rightData = (right != null && right.title != "") ? JSON.parse(right.title) : null;
    // check right Data
    if (rightData != null) {
        if (!(Number(rightData[3]) == Number(leftCellData[1]) && rightData[3] != 0)) {
            return false;
        }
    } else if (leftCellData[1] == 1) {
        return false;
    }
    // check left of left 
    if (leftleftData != null) {
        if  (!(Number(leftleftData[1]) ==  Number(leftCellData[3]))) {
            return false;
        } }
    
    // check up of left
    if ((leftupData != null)) if  (Number(leftupData[2]) !=  Number(leftCellData[0]) ) {
        return false;
    }
    // check down of left
    if ((leftdownData != null)) { if  (Number(leftdownData[0]) !=  Number(leftCellData[2]) ){
        return false; } }
    return true;
}
    

function CheckDown(DOWNcell, downCellData) {
    let cellIndex = getCellIndexAsXY(DOWNcell);
    let downright = (cellIndex.x + 1 < gridSize ) ?  GetCellAt(cellIndex.x + 1, cellIndex.y ) : null;
    let downleft = (cellIndex.x - 1 >= 0) ? GetCellAt(cellIndex.x - 1, cellIndex.y ) : null;
    let downdown = (cellIndex.y + 1 < gridSize) ? GetCellAt(cellIndex.x, cellIndex.y + 1) : null;
    let downrightData = (downright != null && downright.title != "") ? JSON.parse(downright.title) : null;
    let downleftData = (downleft != null && downleft.title != "") ? JSON.parse(downleft.title) : null;
    let downdownData = (downdown != null && downdown.title != "") ? JSON.parse(downdown.title) : null;
    let up = GetCellAt(cellIndex.x, cellIndex.y - 1);
    let upData = (up != null && up.title != "") ? JSON.parse(up.title) : null;
    // up 
    if (Number(downCellData[0]) !=  Number(upData[2]) && upData[2] != 0) return false ;
    // down down
    if ((downdownData != null)) if ( (Number(downdownData[0]) !=  Number(downCellData[2])) ) {return false;}
    // right 
    if (downrightData != null) if   ((Number(downrightData[3]) !=  Number(downCellData[1])) ? true :  false) {return false;}
    //left
    if (downleftData != null) if (!(Number(downleftData[1]) ==  Number(downCellData[3])))  { return false;}

    // console.log(downCellData);
    return true;
}



/**
 * 
 * @param {*} cell 
 * @param {*} roadTypeImage 
 * @param {*} roadTypeData 
 * @param {*} rotation  must be 0, 1, 2, or 3
 */
function PlaceRoad(cell, roadTypeImage, roadTypeData, rotation=0) {
    if (cell.title !== "") return; // Don't overwrite existing tiles
    // console.log(getCellIndexAsXY(cell));
    LASTTOUCHED = cell;
    // console.log(LASTTOUCHED);
    cell.style.backgroundImage = roadTypeImage;
    cell.style.transform = "rotate(0deg)";
    cell.title = JSON.stringify(roadTypeData);
    // cell.textContent = cell.title;
    // cell.style.color = "green";
    
    for (let i = 0; i < rotation; i++) {
        // console.log("Rotating for placement");
        rotateCell(cell);
    }
    // console.log("placeroad " + cell.title);

    
}

function GetCellAt(x, y) {
    let tempCell = grid.children[y * gridSize + x];
    
    return tempCell;
}


function getCellIndexAsXY(cell) {
    const index = Array.from(grid.children).indexOf(cell);
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    if (cell !== GetCellAt(x, y)) {
        return null;
    }
    return { x, y };
}




function GetActionableCells() {


    let actionableCells = [];
    for (let i = 0; i < grid.children.length; i++) {
        const cell = grid.children[i];
        if (cell.title != "") {
            let cellIndex = getCellIndexAsXY(cell);
            let up = GetCellAt(cellIndex.x, cellIndex.y - 1);
            let right = GetCellAt(cellIndex.x + 1, cellIndex.y);
            let down = GetCellAt(cellIndex.x, cellIndex.y + 1);
            let left = GetCellAt(cellIndex.x - 1, cellIndex.y);
            // console.log(up, right, down, left);
            // console.log(up?.title, right?.title, down?.title, left?.title);
            if ((up && up.title == "") || (right && right.title == "") || (down && down.title == "") || (left && left.title == "")) {
                actionableCells.push(cell);
            }
        }
    }
    return actionableCells;
}

function GetActionableCellsBasedOn(CellData){
    let actionableCells = [];
    if (1 in CellData){
        console.log("Getting actionable cells for road");
        actionableCells = longestComponent(1);
    } else if (3 in CellData){
        console.log("Getting actionable cells for river");
        actionableCells = longestComponent(3);
    }
     else if (2 in CellData){
        console.log("Getting actionable cells for forest");
        actionableCells = longestComponent(2);
     }
    
    let temp = [];
    for (let idx of actionableCells){
        temp.push(grid.children[idx]);
    }
    let istemptruelyActionable = [];
     for (let i = 0; i < temp.length; i++) {
        const cell = temp[i];
        if (cell.title != "") {
            let cellIndex = getCellIndexAsXY(cell);
            let up = GetCellAt(cellIndex.x, cellIndex.y - 1);
            let right = GetCellAt(cellIndex.x + 1, cellIndex.y);
            let down = GetCellAt(cellIndex.x, cellIndex.y + 1);
            let left = GetCellAt(cellIndex.x - 1, cellIndex.y);
            // console.log(up, right, down, left);
            // console.log(up?.title, right?.title, down?.title, left?.title);
            if ((up && up.title == "") || (right && right.title == "") || (down && down.title == "") || (left && left.title == "")) {
                istemptruelyActionable.push(cell);
            }
        }
    }

    return istemptruelyActionable;
}

function longestComponent(type = 1) {
    let visited = new Set();
    let longest = [];
    let allSegments = [];

    // Helper to get cells of the given type (road=1, forest=2, river=3)
    function isType(cell) {
        if (!cell.title) return false;
        let data = JSON.parse(cell.title);
        return data.some(d => d === type);
    }

    // BFS to find connected segment of the given type
    function bfsType(startIdx) {
        let queue = [startIdx];
        let segment = [];
        visited.add(startIdx);

        while (queue.length > 0) {
            let idx = queue.shift();
            let cell = grid.children[idx];
            segment.push(idx);
            let data = JSON.parse(cell.title);
            let ci = getCellIndexAsXY(cell);

            // up
            if (ci.y > 0) {
                let upIdx = idx - gridSize;
                let upCell = grid.children[upIdx];
                if (isType(upCell) && !visited.has(upIdx)) {
                    let upData = JSON.parse(upCell.title);
                    if (data[0] === type && upData[2] === type) {
                        visited.add(upIdx);
                        queue.push(upIdx);
                    }
                }
            }
            // right
            if (ci.x < gridSize - 1) {
                let rightIdx = idx + 1;
                let rightCell = grid.children[rightIdx];
                if (isType(rightCell) && !visited.has(rightIdx)) {
                    let rightData = JSON.parse(rightCell.title);
                    if (data[1] === type && rightData[3] === type) {
                        visited.add(rightIdx);
                        queue.push(rightIdx);
                    }
                }
            }
            // down
            if (ci.y < gridSize - 1) {
                let downIdx = idx + gridSize;
                let downCell = grid.children[downIdx];
                if (isType(downCell) && !visited.has(downIdx)) {
                    let downData = JSON.parse(downCell.title);
                    if (data[2] === type && downData[0] === type) {
                        visited.add(downIdx);
                        queue.push(downIdx);
                    }
                }
            }
            // left
            if (ci.x > 0) {
                let leftIdx = idx - 1;
                let leftCell = grid.children[leftIdx];
                if (isType(leftCell) && !visited.has(leftIdx)) {
                    let leftData = JSON.parse(leftCell.title);
                    if (data[3] === type && leftData[1] === type) {
                        visited.add(leftIdx);
                        queue.push(leftIdx);
                    }
                }
            }
        }
        return segment;
    }

    // Find all segments of the given type
    for (let i = 0; i < grid.children.length; i++) {
        if (isType(grid.children[i]) && !visited.has(i)) {
            let segment = bfsType(i);
            allSegments.push(segment);
            if (segment.length > longest.length) longest = segment;
        }
    }

    // Reset all borders
    for (let i = 0; i < grid.children.length; i++) {
        grid.children[i].style.border = "";
    }

    // Highlight longest segment
    // longest.forEach(idx => {
    //     grid.children[idx].style.border = "8px solid red";
    // });
    console.log(`Longest component of type ${type} has length ${longest.length}`
        , longest
    );
    return longest;
}

// Usage:
// longestComponent(1) // road
// longestComponent(2) // forest
// longestComponent(3) // river



function outlineLongestComponent(array) {
    // Reset all borders
console.log("Outlining longest component");
console.log(array);

    // Highlight longest segment
   for (let idx of array) {
        grid.children[idx].style.border = "8px solid red";
    }
}

function getAllComponents(type) {
    let visited = new Set();
    let components = [];
    for (let i = 0; i < grid.children.length; i++) {
        if (!visited.has(i) && grid.children[i].title) {
            let data = JSON.parse(grid.children[i].title);
            if (data.some(d => d === type)) {
                let component = new Set();
                bfsComponent(i, type, visited, component);
                components.push(component);
            }
        }
    }
    return components;
}

function bfsComponent(startIndex, type, visited, component) {
    let queue = [startIndex];
    visited.add(startIndex);
    component.add(startIndex);
    while (queue.length > 0) {
        let idx = queue.shift();
        let cell = grid.children[idx];
        let ci = getCellIndexAsXY(cell);
        let d = JSON.parse(cell.title);
        let directions = [
            {dir: 0, dx: 0, dy: -1, opp: 2},
            {dir: 1, dx: 1, dy: 0, opp: 3},
            {dir: 2, dx: 0, dy: 1, opp: 0},
            {dir: 3, dx: -1, dy: 0, opp: 1}
        ];
        for (let {dir, dx, dy, opp} of directions) {
            if (d[dir] === type) {
                let nx = ci.x + dx;
                let ny = ci.y + dy;
                if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                    let nidx = ny * gridSize + nx;
                    let ncell = grid.children[nidx];
                    if (ncell.title && !visited.has(nidx)) {
                        let nd = JSON.parse(ncell.title);
                        if (nd[opp] === type) {
                            visited.add(nidx);
                            component.add(nidx);
                            queue.push(nidx);
                        }
                    }
                }
            }
        }
    }
}

function getCompletedCities() {
    let visited = new Set();
    let completed = [];
    for (let i = 0; i < grid.children.length; i++) {
        if (!visited.has(i) && grid.children[i].title) {
            let data = JSON.parse(grid.children[i].title);
            if (data.every(v => v === 0)) {
                let component = new Set();
                bfsCity(i, visited, component);
                // Check if completed
                let isCompleted = true;
                for (let idx of component) {
                    let cell = grid.children[idx];
                    let ci = getCellIndexAsXY(cell);
                    let d = JSON.parse(cell.title);
                    let directions = [
                        {dir: 0, dx: 0, dy: -1},
                        {dir: 1, dx: 1, dy: 0},
                        {dir: 2, dx: 0, dy: 1},
                        {dir: 3, dx: -1, dy: 0}
                    ];
                    for (let {dir, dx, dy} of directions) {
                        let nx = ci.x + dx;
                        let ny = ci.y + dy;
                        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                            let nidx = ny * gridSize + nx;
                            let ncell = grid.children[nidx];
                            if (!ncell.title) {
                                isCompleted = false;
                                break;
                            }
                        }
                    }
                    if (!isCompleted) break;
                }
                if (isCompleted) completed.push(component);
            }
        }
    }
    return completed;
}

function bfsCity(startIndex, visited, component) {
    let queue = [startIndex];
    visited.add(startIndex);
    component.add(startIndex);
    while (queue.length > 0) {
        let idx = queue.shift();
        let cell = grid.children[idx];
        let ci = getCellIndexAsXY(cell);
        let d = JSON.parse(cell.title);
        let directions = [
            {dir: 0, dx: 0, dy: -1, opp: 2},
            {dir: 1, dx: 1, dy: 0, opp: 3},
            {dir: 2, dx: 0, dy: 1, opp: 0},
            {dir: 3, dx: -1, dy: 0, opp: 1}
        ];
        for (let {dir, dx, dy, opp} of directions) {
            let nx = ci.x + dx;
            let ny = ci.y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                let nidx = ny * gridSize + nx;
                let ncell = grid.children[nidx];
                if (ncell.title && !visited.has(nidx)) {
                    let nd = JSON.parse(ncell.title);
                    if (nd.every(v => v === 0)) {
                        visited.add(nidx);
                        component.add(nidx);
                        queue.push(nidx);
                    }
                }
            }
        }
    }
}

function getBorderingFields(completedCities) {
    let bordering = new Map();
    for (let i = 0; i < completedCities.length; i++) {
        let comp = completedCities[i];
        let fields = new Set();
        for (let idx of comp) {
            let cell = grid.children[idx];
            let ci = getCellIndexAsXY(cell);
            let d = JSON.parse(cell.title);
            let directions = [
                {dir: 0, dx: 0, dy: -1, opp: 2},
                {dir: 1, dx: 1, dy: 0, opp: 3},
                {dir: 2, dx: 0, dy: 1, opp: 0},
                {dir: 3, dx: -1, dy: 0, opp: 1}
            ];
            for (let {dir, dx, dy, opp} of directions) {
                if (d[dir] === 0) {
                    let nx = ci.x + dx;
                    let ny = ci.y + dy;
                    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                        let nidx = ny * gridSize + nx;
                        let ncell = grid.children[nidx];
                        if (ncell.title) {
                            let nd = JSON.parse(ncell.title);
                            if (nd[opp] === 2) {
                                fields.add(nidx);
                            }
                        }
                    }
                }
            }
        }
        bordering.set(i, fields);
    }
    return bordering;
}

function calculateScore() {
    let completedCities = getCompletedCities();
    let bordering = getBorderingFields(completedCities);
    let fieldComponents = getAllComponents(2);
    let fieldScore = 0;
    for (let comp of fieldComponents) {
        let cities = new Set();
        for (let cellIdx of comp) {
            for (let [cityIdx, fields] of bordering) {
                if (fields.has(cellIdx)) {
                    cities.add(cityIdx);
                }
            }
        }
        fieldScore += 3 * cities.size;
    }
    let roadComponents = getAllComponents(1);
    let roadScore = 0;
    for (let comp of roadComponents) {
        roadScore += comp.size;
    }
    let cityScore = 0;
    for (let comp of completedCities) {
        cityScore += comp.size;
    }
    let total = roadScore + cityScore + fieldScore;
    return {roadScore, cityScore, fieldScore, total};
}

function updateScore() {
    let score = calculateScore();
    let html = `<h1>Score</h1>
<p>Roads: ${score.roadScore}</p>
<p>Cities: ${score.cityScore}</p>
<p>Fields: ${score.fieldScore}</p>
<p>Total: ${score.total}</p>`;
    document.getElementById('scorePanel').innerHTML = html;
}
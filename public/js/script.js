//.  https://en.wikipedia.org/wiki/Carcassonne_(board_game)

const grid = document.getElementById('grid');
const TEST = document.getElementById('TEST');

let gridSize = 9; // Change this to change the grid size (e.g., 8 for 8x8, 20 for 20x20)

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

let LASTTOUCHED = null;

const allRoads = [ [straightImage, straightRoad],
                    [TImage, TRoad],
                    [cornerImage, cornerRoad],
                    [XImage, XRoad],
                    [cityImage, cityRoad],
                    [cityWithNoRoadImage, cityNoRoadData],
                    [forest1edgeImage, forest1edgeData],
                    [forest2edgeImage, forest2edgeData],
                    [TwithBImage, TwithBRoad],
                    [rwithBImage, rwithBRoad],
                    [lwithBImage, lwithBRoad],
                    [allBImage, allBRoad],
                    [st8withBImage, st8withBRoad],
                    [BcornerImage, BcornerRoad], 
                    [RoadIntoBrownImage, RoadIntoBrownData]
                 ];

// Set CSS variables for dynamic grid
document.documentElement.style.setProperty('--gridCols', gridSize);
document.documentElement.style.setProperty('--gridRows', gridSize);

// Add event listener for 'f' key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'f' || event.key === 'F') {
    PlaceRoad(grid.children[1], straightImage, straightRoad);
  } else if (event.key === 'l' || event.key === 'L') {
    if (LASTTOUCHED) {
      console.log('Last touched cell:', getCellIndexAsXY(LASTTOUCHED));
    } else {
      console.log('No cell has been touched yet.');
    }
  } else if (event.key === 'n' || event.key === 'N') {
    if (LASTTOUCHED) {
        let passed = false;
        let trys = 0;
        while (!passed) {
            console.log("Attempting to place road, try number: " + trys);
        let randomRoadIndex = Math.floor(Math.random() * allRoads.length);
        let available = GetActionableCells();
        
        if (trys > allRoads.length * available.length) {
            // alert("Exceeded maximum number of tries to place a road.");
            return;
        }
        if (available.length == 0) {
            console.log("No available cells to place a road.");
            return;
        }
        let randomActionableIndex = Math.floor(Math.random() * available.length);
        TEST.style.backgroundImage = allRoads[randomRoadIndex][0];
      passed = PlaceNextRoadGood(available[randomActionableIndex], allRoads[randomRoadIndex][0], allRoads[randomRoadIndex][1]);
        trys++;
        }
    } else {
      console.log('No cell has been touched yet.');
    }
  } else if (event.key === 't' || event.key === 'T') {
    PlaceNextRoadGood(LASTTOUCHED, cityWithNoRoadImage, cityNoRoadData);
  }
  else if (event.key === 'a' || event.key === 'A') {
    const actionableCells = GetActionableCells();
    console.log('Actionable cells:', actionableCells.map(cell => getCellIndexAsXY(cell)));
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
    grid.appendChild(cell);
}


function PrintData(event) {
    event.preventDefault();
    const cell = event.target;
    console.log(getCellIndexAsXY(cell));
    console.log(cell.title);
}

function EventRotateCell(event) {
    const cell = event.target;
    rotateCell(cell);
}


function rotateCell(cell) {
    // console.log("Rotating cell at ", getCellIndexAsXY(cell));

      getCellIndexAsXY(cell);
  if (cell.title == "") {
    PlaceRoad(cell, straightImage, straightRoad);
        return;
  }
    let roadData = JSON.parse(cell.title);
    
    if (cell.style.transform == "rotate(1deg)" ) {
        cell.style.transform = "rotate(90deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(90deg)") {
        cell.style.transform = "rotate(180deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(180deg)") {
        cell.style.transform = "rotate(270deg)";
        roadData = rotateRoad(roadData);
    } else if (cell.style.transform == "rotate(270deg)") {
        cell.style.transform = "rotate(1deg)";
        roadData = rotateRoad(roadData);
    } else {
        cell.style.transform = "rotate(1deg)";
    }    
    cell.title = JSON.stringify(roadData);
    // console.log(cell.title);
}


function rotateRoad(roadData) {
    return [roadData[3], roadData[0], roadData[1], roadData[2]];
   
}

function isStraightRoad(roadData) {
    return ( ( Number(roadData[0]) == Number(roadData[2])) && (Number(roadData[1]) ==  Number(roadData[3])) ) ||
           ( (Number(roadData[1]) ==  Number(roadData[3]) ) && (Number(roadData[0]) ==  Number(roadData[2]) ) );
}


function PlaceNextRoadGood(cell, roadTypeImage, roadTypeData, depth=0, cellindex = null) {
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
    //right
    if (right != null && right.title == "") {
        if (CheckRight(right, roadTypeData)) {
            PlaceRoad(right, roadTypeImage, roadTypeData, 0);
            LASTTOUCHED = right;
            return true;
        } else if (!isStraightRoad(roadTypeData)) {
            let tempRoadData = roadTypeData;
            for (let i = 1; i <= 4; i++) {
                tempRoadData= rotateRoad(tempRoadData);
                if (CheckRight(right, tempRoadData)) {
                    PlaceRoad(right, roadTypeImage, roadTypeData, i );
                    LASTTOUCHED = right;
                    return true;
                }
            }
        }
        console.log("fail right check");
    }
    // up
    if (up != null && up.title == "") {
        console.log("checking up");
        if (CheckUp(up, roadTypeData)) {
            PlaceRoad(up, roadTypeImage, roadTypeData, 1);
            LASTTOUCHED = up;
            return true;} 
        if (!isStraightRoad(roadTypeData)) {
            let tempRoadData = roadTypeData;
            for (let i = 1; i <= 4; i++) {
                tempRoadData= rotateRoad(tempRoadData);
                if (CheckUp(up, tempRoadData)) {
                    PlaceRoad(up, roadTypeImage, roadTypeData, i  );
                    LASTTOUCHED = up;
                    return true;
                }}
        }
    
    console.log("fail up check");}
    //left
    console.log("fail up");
    if ( left != null && left.title == "") {
        if (CheckLeft(left, roadTypeData)) {
            PlaceRoad(left, roadTypeImage, roadTypeData, 0);
            LASTTOUCHED = left;
            // console.log("Placed on left");
            return true;
        } 
        // console.log("fail 1st left check");
        if (!isStraightRoad(roadTypeData)) {
            let tempRoadData = roadTypeData;
            for (let i = 1; i <= 4; i++) {
                tempRoadData= rotateRoad(tempRoadData);
                if (CheckLeft(left, tempRoadData)) {
                    PlaceRoad(left, roadTypeImage, roadTypeData, i  );
                    LASTTOUCHED = left;
                    return true;
                }
                // console.log(i);
            }}
        console.log("fail left check");
    }
    // down
    if ( down != null && down.title == "") {
        if (CheckDown(down, roadTypeData)) {
            PlaceRoad(down, roadTypeImage, roadTypeData, 0);
            LASTTOUCHED = down;
            return true;
        } 
        if (!isStraightRoad(roadTypeData)) {
            let tempRoadData = roadTypeData;
            for (let i = 1; i <= 4; i++) {
                tempRoadData= rotateRoad(tempRoadData);
                if (CheckDown(down, tempRoadData)) {
                    PlaceRoad(down, roadTypeImage, roadTypeData, i  );
                    LASTTOUCHED = down;
                    return true;
                }
            }
        }
        console.log("fail down check");
    }
    TEST.style.backgroundImage = roadTypeImage;
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
    if (Number(upCellData[2]) !=  Number(downData[0])) {
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
    if (leftData != null) if  (!(Number(leftData[1]) ==  Number(rightCellData[3])))  {
        console.log(leftData);
        console.log(rightCellData);
        console.log("fail left check");
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
    if (rightData != null) if  (!(Number(rightData[3]) ==  Number(leftCellData[1]))) {
        return false;}
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
    if (Number(downCellData[0]) !=  Number(upData[2])) return false ;
    // down down
    if ((downdownData != null)) if ( (Number(downdownData[0]) !=  Number(downCellData[2])) ) {return false;}
    // right 
    if (downrightData != null) if   ((Number(downrightData[3]) !=  Number(downCellData[1])) ? true :  false) {return false;}
    //left
    if (downleftData != null) if (!(Number(downleftData[1]) ==  Number(downCellData[3])))  { return false;}

    // console.log(downCellData);
    return true;
}


function PlaceNextRoad(cell, roadTypeImage, roadTypeData) {
    const cellData = JSON.parse(cell.title);
    let right = null;
    let left = null;
    let down = null;
    let downData = null;
    let up = null;
    let upData = null;
    let cellIndex = getCellIndexAsXY(cell);
    if (cellIndex.x < gridSize - 1 ){
        right = GetCellAt(cellIndex.x + 1, cellIndex.y);
    } 
    if (cellIndex.x  -1 >= 0 ){
        left = GetCellAt(cellIndex.x - 1, cellIndex.y);
    } 
    if (cellIndex.y < gridSize - 1 ){
        down = GetCellAt(cellIndex.x, cellIndex.y + 1);
    } 
    if (cellIndex.y - 1 >= 0 ){
        up = GetCellAt(cellIndex.x, cellIndex.y - 1);
    }
    console.log(cellData);
    console.log(cellData[1] == 1)
    // right
    if (cellData[1] == 1){
        if (right != null) {
            let rightIndex = getCellIndexAsXY(right);
            console.log(right.title);
            if (right.title != null &&right.title == ""  ) {
                let rightup = GetCellAt(rightIndex.x, rightIndex.y - 1);
                let rightdown = GetCellAt(rightIndex.x, rightIndex.y + 1);
                let rightupData = null;
                let rightdownData = null;
                if (rightup != null && rightup.title != "" ){
                    rightupData = JSON.parse(rightup.title);
                }
                if (rightdown != null && rightdown.title != "" ){
                    rightdownData = JSON.parse(rightdown.title);
                }
                if (roadTypeData[0] == 1){
                    if (rightup != null &&(rightup.title == "" || rightupData[2] == 1)){
                        PlaceRoad(right, roadTypeImage, roadTypeData, 0);
                        return;
                    } else if (rightdown.title == "" || rightdownData[0] == 1){
                        PlaceRoad(right, roadTypeImage, roadTypeData, 2);
                        return;
                    }
                }   
                PlaceRoad(right, roadTypeImage, roadTypeData, 0);
                return;
            }
        }
} 
 // up 
if (cellData[0] == 1){
    console.log("checking up");
    if (up != null) {
        // up has to be empty
        if (up.title == "" ) {
            // has to check right and left of up
            if (roadTypeData[1] == 1){
                let cellToUp = getCellIndexAsXY(up);
                let CellToUpRight = GetCellAt(cellToUp.x + 1, cellToUp.y);
                console.log(CellToUpRight);
                let cellToUpLeft = GetCellAt(cellToUp.x - 1, cellToUp.y);
                let cellToUpLeftData = null;
                let cellToUpRightData = null;
                // console.log("line 160");
                // console.log(getCellIndexAsXY(CellToUpRight) == { x: cellToUp.x + 1, y: cellToUp.y });
                if (cellIndex.x != (gridSize-1) && CellToUpRight.title == "" ){
                    
                    PlaceRoad(up, roadTypeImage, roadTypeData, 1);
                    return;
                } else if (cellToUpRightData != null){
                    cellToUpRightData = JSON.parse(CellToUpRight.title);
                    if (cellData[1] == 1 && cellToUpRightData[3] == 1){
                        PlaceRoad(up, roadTypeImage, roadTypeData, 1);
                        return;
                    } 
                }
                if (cellToUpLeftData == null || cellToUpLeftData[2] == 1){
                    PlaceRoad(up, roadTypeImage, roadTypeData, 2);
                    return;
                }
            PlaceRoad(up, roadTypeImage, roadTypeData, 1);
            return;
        }}}
}

console.log("No valid placement found");
}

/**
 * 
 * @param {*} cell 
 * @param {*} roadTypeImage 
 * @param {*} roadTypeData 
 * @param {*} rotation  must be 0, 1, 2, or 3
 */
function PlaceRoad(cell, roadTypeImage, roadTypeData, rotation=0) {
    // console.log(getCellIndexAsXY(cell));
    LASTTOUCHED = cell;
    // console.log(LASTTOUCHED);
    cell.style.backgroundImage = roadTypeImage;
    cell.style.transform = "rotate(1deg)";
    cell.title = JSON.stringify(roadTypeData);
    cell.textContent = cell.title;
    cell.style.color = "green";
    
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
            
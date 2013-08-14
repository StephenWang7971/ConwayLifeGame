var protoCell={row:0,col:0,status:1,next:0};
protoCell.render = function(){
    if (this.status == 0) {
        document.getElementById(this.row + "_" + this.col).style.backgroundColor="#CCC";
    } else if (this.status == 1) {
         document.getElementById(this.row + "_" + this.col).style.backgroundColor="#333";
    }
}

protoCell.isThis = function(r, c) {
    return this.row == r && this.col == c;
}

protoCell.reverse = function() {
    this.status = 1 - this.status;
}

protoCell.setStatus = function (s) {
    this.status = s;
}

protoCell.getStatus = function() {
    return this.status;
}

protoCell.prepareEvolution = function(count) {
    switch (this.status) {
    case 0:
        this.tryBorn(count);
        break;
    case 1:
        this.tryLive(count);
        break;
    default:
        break;
    }
}

protoCell.evolute = function() {
    this.status = this.next;
    this.next = 0;
}

protoCell.tryBorn = function(count) {
    if (count == 3) {
        this.next = 1;
    } else {
        this.next = 0;
    }
}

protoCell.tryLive = function(count) {
    if (count < 2 || count > 3) {
        this.next = 0;
    } else {
        this.next =1;
    }
}

function Cell( r,  c,  s) {
    this.__proto__ = protoCell;
    this.row = r;
    this.col = c;
    this.status = s;
    this.next = 0;
}

var protoWorld = {world:0, rowCount:4, columnCount:8};
protoWorld.isOutOfRange = function( r,  c) {
    return r < 0 || r >= this.rowCount || c < 0 || c >= this.columnCount;
}

protoWorld.getCellStatus = function(row, col, status) {
    return this.world[this.getPos(row, col)].getStatus();
}

protoWorld.setCellStatus = function(row, col, status) {
    this.world[this.getPos(row, col)].setStatus(status);
}

    
protoWorld.getPos = function(row,  col) {
    return row * this.columnCount + col;
}
    
protoWorld.countLivingNeighbor = function( cell) {
    var count = 0;
    for (var row = cell.row - 1;  row <= cell.row + 1; row++) {
        for (var col = cell.col - 1; col <= cell.col + 1; col++) {
            if (!this.isOutOfRange(row, col) && !cell.isThis(row, col)) {
                count += this.getCellStatus(row, col);
            }
        }
    }
    return count;
}

protoWorld.getCell = function(row, col) {
    return this.world[this.getPos(row, col)];
}

protoWorld.reverse = function(row, col) {
    if(reversable) {
        this.getCell(row, col).reverse();
        this.getCell(row, col).render();
    }
}

protoWorld.clear = function () {
    for (var row = 0; row < this.rowCount; row ++) {
        for (var col = 0; col < this.columnCount; col ++) {
            this.getCell(row, col).setStatus(0);
        }
    }
}

function World() {
    this.__proto__ = protoWorld;
    this.world = new Array();
    
    this.init = function() {
        for (var row = 0; row < this.rowCount; row++) {
            for (var col = 0; col < this.columnCount; col++) {
                this.world[this.getPos(row,col)] = new Cell(row, col, 0);
            }
        }
    }
    
    this.fillPage = function () {
        var table = "";
        table += "<table>";
        for (var row = 0; row < this.rowCount; row++) {
            table += "<tr>";
            for (var col = 0; col < this.columnCount; col++) {
                table += "<td style='width:40px;height:40px;background-color:#CCC;' id='"+ row + "_" + col +"' onclick='world.reverse("+row+","+ col+")'>";
                table += "</td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        document.write(table);
    }
    
    this.evolute = function () {
        for (var row = 0; row < this.rowCount; row ++) {
            for (var col = 0; col < this.columnCount; col++) {
                 var cell = this.world[this.getPos(row, col)];
                 var count = this.countLivingNeighbor(cell);
                 cell.prepareEvolution(count);
            }
        }
                for (var row = 0; row < this.rowCount; row ++) {
            for (var col = 0; col < this.columnCount; col++) {
                 var cell = this.world[this.getPos(row, col)];
                 cell.evolute();
            }
        }
    }
    
    this.render = function() {
        for (var row =0; row < this.rowCount; row++) {
            for (var col =0 ; col < this.columnCount; col++) {
                this.world[this.getPos(row, col)].render();
            }
        }
    }
}

var assertProto = {};
function Assert() { 
    this.__proto__ = assertProto;
    
    this.areEqual = function(expected, actual, msg) {
        if (expected != actual) {
            alert("Failed! Expected is " + expected +", but got " + actual + "\n" + msg);
        }
    }
}

var world = new World();
var assert = new Assert();
world.init();
world.fillPage();

var reversable = true;
function clear(){
    reversable = true;
    world.clear();
    world.render();
}

function start() {
    reversable = false;
}

function evolute() {
    world.evolute();
    world.render();
}


/*
 THE FOLLOWING ARE A DEMO OF TEST CODES.
 
world.setCellStatus(0,1,1);
assert.areEqual(1, world.getCellStatus(0, 1) ,"Round 0, @(0,1)");
world.setCellStatus(1,1,1);
assert.areEqual(1, world.getCellStatus(1, 1),"Round 0, @(1,1)");
world.setCellStatus(1,2,1);
assert.areEqual(1, world.getCellStatus(1, 2),"Round 0, @(1,2)");
world.setCellStatus(1,3,1);
assert.areEqual(1, world.getCellStatus(1, 3),"Round 0, @(1,3)");
world.render();

world.evolute();
world.render();

assert.areEqual(1, world.getCellStatus(0, 1),"Round 1, @(0,1)");
assert.areEqual(1, world.getCellStatus(1, 1),"Round 1, @(1,1)");
assert.areEqual(1, world.getCellStatus(1, 2),"Round 1, @(1,2)");
assert.areEqual(1, world.getCellStatus(2, 2),"Round 1, @(2,2)");

world.evolute();
world.render();

assert.areEqual(1, world.getCellStatus(0, 1),"Round 2, @(0,1)");
assert.areEqual(1, world.getCellStatus(0, 2),"Round 2, @(0,2)");
assert.areEqual(1, world.getCellStatus(1, 1),"Round 2, @(1,1)");
assert.areEqual(1, world.getCellStatus(1, 2),"Round 2, @(1,2)");
assert.areEqual(1, world.getCellStatus(2, 1),"Round 2, @(2,1)");
assert.areEqual(1, world.getCellStatus(2, 2),"Round 2, @(2,2)");

world.evolute();
world.render();

assert.areEqual(1, world.getCellStatus(0, 1),"Round 3, @(0,1)");
assert.areEqual(1, world.getCellStatus(0, 2),"Round 3, @(0,2)");
assert.areEqual(1, world.getCellStatus(1, 0),"Round 3, @(1,0)");
assert.areEqual(1, world.getCellStatus(1, 3),"Round 3, @(1,3)");
assert.areEqual(1, world.getCellStatus(2, 1),"Round 3, @(2,1)");
assert.areEqual(1, world.getCellStatus(2, 2),"Round 3, @(2,2)");

alert("PASS!");
*/

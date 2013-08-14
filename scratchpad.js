function Cell( r,  c,  s) {
    this.row = r;
    this.col = c;
    this.status = s;
    this.next = 0;
}

Cell.prototype.render = function(){
    if (this.status == 0) {
        document.getElementById(this.row + "_" + this.col).style.backgroundColor="#CCC";
    } else if (this.status == 1) {
         document.getElementById(this.row + "_" + this.col).style.backgroundColor="#333";
    }
}

Cell.prototype.isThis = function(r, c) {
    return this.row == r && this.col == c;
}

Cell.prototype.reverse = function() {
    this.status = 1 - this.status;
}

Cell.prototype.setStatus = function (s) {
    this.status = s;
}

Cell.prototype.getStatus = function() {
    return this.status;
}

Cell.prototype.prepareEvolution = function(count) {
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

Cell.prototype.evolute = function() {
    this.status = this.next;
    this.next = 0;
}

Cell.prototype.tryBorn = function(count) {
    if (count == 3) {
        this.next = 1;
    } else {
        this.next = 0;
    }
}

Cell.prototype.tryLive = function(count) {
    if (count < 2 || count > 3) {
        this.next = 0;
    } else {
        this.next =1;
    }
}


function World() {
	this.rowCount = 8;
	this.columnCount = 8;
    this.world = new Array();
}

World.prototype.isOutOfRange = function( r,  c) {
    return r < 0 || r >= this.rowCount || c < 0 || c >= this.columnCount;
}

World.prototype.getCellStatus = function(row, col, status) {
    return this.world[this.getPos(row, col)].getStatus();
}

World.prototype.setCellStatus = function(row, col, status) {
    this.world[this.getPos(row, col)].setStatus(status);
}

    
World.prototype.getPos = function(row,  col) {
    return row * this.columnCount + col;
}
    
World.prototype.countLivingNeighbor = function( cell) {
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

World.prototype.getCell = function(row, col) {
    return this.world[this.getPos(row, col)];
}

World.prototype.reverse = function(row, col) {
    if(reversable) {
        this.getCell(row, col).reverse();
        this.getCell(row, col).render();
    }
}

World.prototype.clear = function () {
    for (var row = 0; row < this.rowCount; row ++) {
        for (var col = 0; col < this.columnCount; col ++) {
            this.getCell(row, col).setStatus(0);
        }
    }
}


World.prototype.init = function() {
        for (var row = 0; row < this.rowCount; row++) {
            for (var col = 0; col < this.columnCount; col++) {
                this.world[this.getPos(row,col)] = new Cell(row, col, 0);
            }
        }
    }
    
World.prototype.fillPage = function () {
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
    
 World.prototype.evolute = function () {
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
    
   World.prototype.render = function() {
        for (var row =0; row < this.rowCount; row++) {
            for (var col =0 ; col < this.columnCount; col++) {
                this.world[this.getPos(row, col)].render();
            }
        }
    }

function Assert() {     
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

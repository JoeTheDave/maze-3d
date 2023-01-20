//This page must be displayed in Safari in order to display correctly.

//control variables
var dimensionX = 15;
var dimensionY = 15;
var mazeSegmentLength = 2;

//global variables
var rX = 0;
var rY = 0;
var rZ = 0;
var tX = 0;
var tY = 0;
var tZ = 0;
var dir = 1;
var active = false;
var maze = null;

var paper;
var txt;

//Move User Into Maze
function EnterMaze() {
    $('.Maze').removeClass('slowTransition').addClass('moderateTransition');
    if (dir == 1) { tZ += 800; }
    if (dir == 2) { tX -= 800; }
    if (dir == 3) { tZ -= 800; }
    if (dir == 4) { tX += 800; }
    $('.Maze').css('-webkit-transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg) translateX(' + tX + 'px) translateY(' + tY + 'px) translateZ(' + tZ + 'px)');
    setTimeout('ActivateMaze()', 5000);
}
//Turn Control Over To The User
function ActivateMaze() {
    $('.Maze').removeClass('slowTransition').addClass('fastTransition');
    maze.currentPosition = maze.mazeEntrance;
    if (maze.mazeEntrance.nNeighbor == null) { maze.mazeEntrance.nWall = true; }
    if (maze.mazeEntrance.eNeighbor == null) { maze.mazeEntrance.eWall = true; }
    if (maze.mazeEntrance.sNeighbor == null) { maze.mazeEntrance.sWall = true; }
    if (maze.mazeEntrance.wNeighbor == null) { maze.mazeEntrance.wWall = true; }
    active = true;
}
//Finish Maze Animation
function MazeConquered() {
    $('.Maze').removeClass('fastTransition').addClass('slowTransition');
    rX = -45;
    rY += 180;
    tY = 3000;
	active = false;
    $('.Maze').css('-webkit-transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg) translateX(' + tX + 'px) translateY(' + tY + 'px) translateZ(' + tZ + 'px)');
}

//page Load
$(function () {
    maze = CreateMazeObject(dimensionX, dimensionY);
    maze.Initialize();

    //Set Start Location
    tX = maze.mazeEntrance.x * 400;
    tZ = maze.mazeEntrance.y * 400;
    if (maze.mazeEntrance.x == 0) { rY = -90; dir = 4; }
    if (maze.mazeEntrance.x == 14) { rY = 90; dir = 2; }
    if (maze.mazeEntrance.y == 14) { rY = 180; dir = 3; }
    $('.Maze').css('-webkit-transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg) translateX(' + tX + 'px) translateY(' + tY + 'px) translateZ(' + tZ + 'px)');
    setTimeout('EnterMaze()', 15000);

    //Create Keyboard Events
    document.onkeyup = function (e) {
        if (active) {
            var KeyID = (window.event) ? event.keyCode : e.keyCode;
            if (KeyID == 38) {
                //forward
                if (dir == 1 && maze.currentPosition.sWall == false) { tZ += 400; maze.currentPosition = maze.currentPosition.sNeighbor; }
                if (dir == 2 && maze.currentPosition.wWall == false) { tX -= 400; maze.currentPosition = maze.currentPosition.wNeighbor; }
                if (dir == 3 && maze.currentPosition.nWall == false) { tZ -= 400; maze.currentPosition = maze.currentPosition.nNeighbor; }
                if (dir == 4 && maze.currentPosition.eWall == false) { tX += 400; maze.currentPosition = maze.currentPosition.eNeighbor; }
            } else if (KeyID == 39) {
                //right
                rY += 90;
                if (dir == 1) { tZ -= 800; tX -= 800; }
                if (dir == 2) { tZ -= 800; tX += 800; }
                if (dir == 3) { tZ += 800; tX += 800; }
                if (dir == 4) { tZ += 800; tX -= 800; }
                dir++; if (dir == 5) { dir = 1; }
            } else if (KeyID == 40) {
                //back
                if (dir == 1 && maze.currentPosition.nWall == false) { tZ -= 400; maze.currentPosition = maze.currentPosition.nNeighbor; }
                if (dir == 2 && maze.currentPosition.eWall == false) { tX += 400; maze.currentPosition = maze.currentPosition.eNeighbor; }
                if (dir == 3 && maze.currentPosition.sWall == false) { tZ += 400; maze.currentPosition = maze.currentPosition.sNeighbor; }
                if (dir == 4 && maze.currentPosition.wWall == false) { tX -= 400; maze.currentPosition = maze.currentPosition.wNeighbor; }
            } else if (KeyID == 37) {
                //left
                rY -= 90;
                if (dir == 1) { tZ -= 800; tX += 800; }
                if (dir == 2) { tZ += 800; tX += 800; }
                if (dir == 3) { tZ += 800; tX -= 800; }
                if (dir == 4) { tZ -= 800; tX -= 800; }
                dir--; if (dir == 0) { dir = 4; }
            }
            $('.Maze').css('-webkit-transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg) translateX(' + tX + 'px) translateY(' + tY + 'px) translateZ(' + tZ + 'px)');
            if (maze.currentPosition == null) {
                setTimeout('MazeConquered()', 1000);
            }
			//logInfo();
        }
    }
    //Navigation Control Panel Slider Controls
    $('.slider').draggable({
        containment: 'parent',
        drag: function (event, ui) {
            var position = (ui.offset.left - $(this).parent().offset().left) - 1;
            if ($(this).attr('id') == 'rotX') {
                rX = (position * 2) - 360;
                $(this).next().html(rX)
            }
            if ($(this).attr('id') == 'rotY') {
                rY = (position * 2) - 360;
                $(this).next().html(rY)
            }
            if ($(this).attr('id') == 'rotZ') {
                rZ = (position * 2) - 360;
                $(this).next().html(rZ)
            }

            if ($(this).attr('id') == 'transX') {
                tX = Math.round(((10000 / 360) * position) - 5000);
                $(this).next().html(tX)
            }
            if ($(this).attr('id') == 'transY') {
                tY = Math.round(((10000 / 360) * position) - 5000);
                $(this).next().html(tY)
            }
            if ($(this).attr('id') == 'transZ') {
                tZ = Math.round(((10000 / 360) * position) - 5000);
                $(this).next().html(tZ)
            }
            $('.Maze').css('-webkit-transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg) translateX(' + tX + 'px) translateY(' + tY + 'px) translateZ(' + tZ + 'px)');
        }
    });
    //Create Graphical Walls
    var content = '';
    for (var x = 0; x < maze.sections.length; x++) {
        content += '<div class="Cube" style="-webkit-transform: translateZ(' + (maze.sections[x].y * -400) + 'px) translateX(' + (maze.sections[x].x * -400) + 'px);">';
        if (maze.sections[x].nWall) {
            content += '<div class="Bulkhead" style="-webkit-transform: rotateY(0deg) translateZ(200px);' + (maze.sections[x].nNeighbor != null ? ' -webkit-backface-visibility: hidden;' : '') + '"></div>';
        }
        if (maze.sections[x].wWall) {
            content += '<div class="Bulkhead" style="-webkit-transform: rotateY(90deg) translateZ(200px);' + (maze.sections[x].wNeighbor != null ? ' -webkit-backface-visibility: hidden;' : '') + '"></div>';
        }
        if (maze.sections[x].sWall) {
            content += '<div class="Bulkhead" style="-webkit-transform: rotateY(180deg) translateZ(200px);' + (maze.sections[x].sNeighbor != null ? ' -webkit-backface-visibility: hidden;' : '') + '"></div>';
        }
        if (maze.sections[x].eWall) {
            content += '<div class="Bulkhead" style="-webkit-transform: rotateY(270deg) translateZ(200px);' + (maze.sections[x].eNeighbor != null ? ' -webkit-backface-visibility: hidden;' : '') + '"></div>';
        }
        if (maze.sections[x].isEntrance) {
            if (maze.sections[x].nNeighbor == null) {
                content += '<div class="Bulkhead" style="-webkit-transform: rotateY(180deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].wNeighbor == null) {
                content += '<div class="Bulkhead" style="-webkit-transform: rotateY(270deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].sNeighbor == null) {
                content += '<div class="Bulkhead" style="-webkit-transform: rotateY(0deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].eNeighbor == null) {
                content += '<div class="Bulkhead" style="-webkit-transform: rotateY(90deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
        }
        if (maze.sections[x].isExit) {
            if (maze.sections[x].nNeighbor == null) {
                content += '<div id="CanvasContainer" class="Bulkhead" style="-webkit-transform: rotateY(180deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].wNeighbor == null) {
                content += '<div id="CanvasContainer" class="Bulkhead" style="-webkit-transform: rotateY(270deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].sNeighbor == null) {
                content += '<div id="CanvasContainer" class="Bulkhead" style="-webkit-transform: rotateY(0deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
            if (maze.sections[x].eNeighbor == null) {
                content += '<div id="CanvasContainer" class="Bulkhead" style="-webkit-transform: rotateY(90deg) translateZ(-200px); -webkit-backface-visibility: hidden;"></div>';
            }
        }
        content += '</div>';
    }
    $('.Maze').html(content);

        paper = Raphael($('#CanvasContainer')[0], 200, 200);
        txt = paper.text(100, 100, "EXIT");
        txt.attr({ "font-size": "60px", "font-weight": "900", fill: "#000000", stroke: "#FFFFFF" });

        AddAsset();
        var m = setInterval('AddAsset()', 500);

        TextVariation();
        var n = setInterval('TextVariation()', 2000);
});
//Maze Section Object Factory
function CreateMazeSection(id) {
    return {
        ID: id,
        nNeighbor: null,
        eNeighbor: null,
        sNeighbor: null,
        wNeighbor: null,
        nWall: true,
        eWall: true,
        sWall: true,
        wWall: true,
        isEntrance: false,
        isOnEntrancePath: false,
        isExit: false,
        isOnExitPath: false,
		isOnMazePath: false,
		distanceFromOpening: 0,
		x: 0,
        y: 0,
        WallCount: function () {
            var walls = 0;
            if (this.nWall) { walls++; }
            if (this.eWall) { walls++; }
            if (this.sWall) { walls++; }
            if (this.wWall) { walls++; }
            return walls;
        },
        NeighborCount: function () {
            var neighbors = 0;
            if (this.nNeighbor) { neighbors++; }
            if (this.eNeighbor) { neighbors++; }
            if (this.sNeighbor) { neighbors++; }
            if (this.wNeighbor) { neighbors++; }
            return neighbors;
        },
        RandomIsolatedNeighbor: function () {
            var options = [];
            if (this.nNeighbor != null && (!this.nNeighbor.isOnEntrancePath) && (!this.nNeighbor.isOnExitPath)) { options.push(this.nNeighbor) }
            if (this.eNeighbor != null && (!this.eNeighbor.isOnEntrancePath) && (!this.eNeighbor.isOnExitPath)) { options.push(this.eNeighbor) }
            if (this.sNeighbor != null && (!this.sNeighbor.isOnEntrancePath) && (!this.sNeighbor.isOnExitPath)) { options.push(this.sNeighbor) }
            if (this.wNeighbor != null && (!this.wNeighbor.isOnEntrancePath) && (!this.wNeighbor.isOnExitPath)) { options.push(this.wNeighbor) }
            if (options.length > 0) {
                return options[Math.floor(Math.random() * options.length)];
            }
            else {
                return null;
            }
        }
    };
}
//Maze Object Factory
function CreateMazeObject(dimensionX, dimensionY) {
    return {
        dimX: dimensionX,
        dimY: dimensionY,
        sections: [],
        wallSections: [],
        cornerSections: [],
        onPathSections: [],
        mazeEntrance: null,
        mazeExit: null,
        mazeDistance: 0,
        currentPosition: null,
        Initialize: function () {
            //Create Maze Sections
            for (var x = 0; x < this.dimX * this.dimY; x++) {
                this.sections.push(CreateMazeSection(x));
            }
            //InterLink Maze Sections
            for (var x = 0; x < this.sections.length; x++) {
                if ((x + 1) % this.dimX != 0) {
                    this.sections[x].eNeighbor = this.sections[x + 1];
                }
                if (x % this.dimX != 0) {
                    this.sections[x].wNeighbor = this.sections[x - 1];
                }
                if (x > this.dimX - 1) {
                    this.sections[x].nNeighbor = this.sections[x - this.dimX];
                }
                if (x < (this.dimX * this.dimY) - this.dimX) {
                    this.sections[x].sNeighbor = this.sections[x + this.dimX];
                }
            }
            //Make sections self aware of location withing grid
            for (var x = 0; x < this.sections.length; x++) {
                if (this.sections[x].nNeighbor != null) {
                    this.sections[x].y = this.sections[x].nNeighbor.y + 1;
                }
                if (this.sections[x].wNeighbor != null) {
                    this.sections[x].x = this.sections[x].wNeighbor.x + 1;
                }
            }
            //Identify Maze Walls and Corners
            var section = this.sections[0];
            var dir = 1;
            do {
                this.wallSections.push(section);
                if (dir == 1) { if (section.eNeighbor != null) { section = section.eNeighbor; } else { dir = 2; } }
                if (dir == 2) { if (section.sNeighbor != null) { section = section.sNeighbor; } else { dir = 3; } }
                if (dir == 3) { if (section.wNeighbor != null) { section = section.wNeighbor; } else { dir = 4; } }
                if (dir == 4) { if (section.nNeighbor != null) { section = section.nNeighbor; } else { dir = 1; } }
            } while (section.ID != 0);
            //Place Maze Entrance/Exit
            this.mazeEntrance = null;
            this.mazeExit = null;
            while (this.mazeEntrance == null) {
                var attempt = Math.floor(Math.random() * this.wallSections.length);
                if (this.wallSections[attempt].NeighborCount() == 3) {
                    this.mazeEntrance = this.wallSections[attempt];
                    this.mazeEntrance.isEntrance = true;
                    this.mazeEntrance.isOnEntrancePath = true;
                    this.onPathSections.push(this.mazeEntrance);
                    if (this.mazeEntrance.nNeighbor == null) { this.mazeEntrance.nWall = false; }
                    if (this.mazeEntrance.eNeighbor == null) { this.mazeEntrance.eWall = false; }
                    if (this.mazeEntrance.sNeighbor == null) { this.mazeEntrance.sWall = false; }
                    if (this.mazeEntrance.wNeighbor == null) { this.mazeEntrance.wWall = false; }
                    this.mazeExit = this.wallSections[(attempt + (this.wallSections.length / 2) > this.wallSections.length - 1) ? (attempt + (this.wallSections.length / 2) - this.wallSections.length) : (attempt + (this.wallSections.length / 2))];
                    this.mazeExit.isExit = true;
                    this.mazeExit.isOnExitPath = true;
                    this.onPathSections.push(this.mazeExit);
                    if (this.mazeExit.nNeighbor == null) { this.mazeExit.nWall = false; }
                    if (this.mazeExit.eNeighbor == null) { this.mazeExit.eWall = false; }
                    if (this.mazeExit.sNeighbor == null) { this.mazeExit.sWall = false; }
                    if (this.mazeExit.wNeighbor == null) { this.mazeExit.wWall = false; }
                }
            }
            //Build Maze Path
            this.PathFind(this.mazeEntrance)
            this.PathFind(this.mazeExit)
            do {
                var proposedSection = null;
                while (proposedSection == null) {
                    proposedSection = this.onPathSections[Math.floor(Math.random() * this.onPathSections.length)];
                    if (proposedSection.RandomIsolatedNeighbor() == null) {
                        proposedSection = null;
                    }
                }
                this.PathFind(proposedSection);
            } while (this.Completeness() < 1.00);
            //Connect Entrance and Exit Paths
            var section1 = null;
            var section2 = null;
            var distance = 0;
            for (var x = 0; x < this.sections.length; x++) {
                if ((this.sections[x].eNeighbor != null) && ((this.sections[x].isOnEntrancePath && this.sections[x].eNeighbor.isOnExitPath) || (this.sections[x].isOnExitPath && this.sections[x].eNeighbor.isOnEntrancePath))) {
                    if (this.sections[x].distanceFromOpening + this.sections[x].eNeighbor.distanceFromOpening > distance) {
                        distance = this.sections[x].distanceFromOpening + this.sections[x].eNeighbor.distanceFromOpening;
                        section1 = this.sections[x];
                        section2 = this.sections[x].eNeighbor;
                    }
                }
                if ((this.sections[x].sNeighbor != null) && ((this.sections[x].isOnEntrancePath && this.sections[x].sNeighbor.isOnExitPath) || (this.sections[x].isOnExitPath && this.sections[x].sNeighbor.isOnEntrancePath))) {
                    if (this.sections[x].distanceFromOpening + this.sections[x].sNeighbor.distanceFromOpening > distance) {
                        distance = this.sections[x].distanceFromOpening + this.sections[x].sNeighbor.distanceFromOpening;
                        section1 = this.sections[x];
                        section2 = this.sections[x].sNeighbor;
                    }
                }
            }
            this.mazeDistance = distance;
            this.CombineSections(section1, section2, false);
            this.currentPosition = this.mazeEntrance;
            //Define Actual Maze Path
            var cursor = section1;
            while (cursor.distanceFromOpening > 0) {
                cursor.isOnMazePath = true;
                if (cursor.nWall == false && cursor.nNeighbor != null && cursor.nNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.nNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.nNeighbor;
                }
                else if (cursor.eWall == false && cursor.eNeighbor != null && cursor.eNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.eNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.eNeighbor;
                }
                else if (cursor.sWall == false && cursor.sNeighbor != null && cursor.sNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.sNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.sNeighbor;
                }
                else if (cursor.wWall == false && cursor.wNeighbor != null && cursor.wNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.wNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.wNeighbor;
                }
            }
            cursor = section2;
            while (cursor.distanceFromOpening > 0) {
                cursor.isOnMazePath = true;
                if (cursor.nWall == false && cursor.nNeighbor != null && cursor.nNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.nNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.nNeighbor;
                }
                else if (cursor.eWall == false && cursor.eNeighbor != null && cursor.eNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.eNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.eNeighbor;
                }
                else if (cursor.sWall == false && cursor.sNeighbor != null && cursor.sNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.sNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.sNeighbor;
                }
                else if (cursor.wWall == false && cursor.wNeighbor != null && cursor.wNeighbor.isOnEntrancePath == cursor.isOnEntrancePath && cursor.wNeighbor.distanceFromOpening == cursor.distanceFromOpening - 1) {
                    cursor = cursor.wNeighbor;
                }
            }
        }, //End of Initialize function
        CombineSections: function (section1, section2, progressive) {
            if (typeof progressive == 'undefined') { progressive = true }
            if (section1.nNeighbor != null && section1.nNeighbor.ID == section2.ID) {
                section1.nWall = false;
                section2.sWall = false;
            }
            else if (section1.eNeighbor != null && section1.eNeighbor.ID == section2.ID) {
                section1.eWall = false;
                section2.wWall = false;
            }
            else if (section1.sNeighbor != null && section1.sNeighbor.ID == section2.ID) {
                section1.sWall = false;
                section2.nWall = false;
            }
            else if (section1.wNeighbor != null && section1.wNeighbor.ID == section2.ID) {
                section1.wWall = false;
                section2.eWall = false;
            }
            if (progressive) {
                if (section1.isOnEntrancePath) { section2.isOnEntrancePath = true; }
                if (section1.isOnExitPath) { section2.isOnExitPath = true; }
                section2.distanceFromOpening = section1.distanceFromOpening + 1;
            }
        },
        PathFind: function (extender) {
            for (var x = 0; x < mazeSegmentLength; x++) {
                var next = extender.RandomIsolatedNeighbor();
                if (next != null) {
                    this.CombineSections(extender, next);
                    this.onPathSections.push(next);
                    extender = next;
                }
                else {
                    break;
                }
            }
        },
        Completeness: function () {
            return this.onPathSections.length / this.sections.length
        }
    };
}
//Functions to Create Exit Graphic
function AddAsset() {
    var size = Math.floor(Math.random() * 131) + 50; // 50 - 180
    var width = Math.floor(Math.random() * 16) + 5; // 5 - 20
    var color = Math.floor(Math.random() * 11) + 3; // 3 - 14
    var rotation = Math.floor(Math.random() * 720) + 360; // 360 - 1080
    var direction = Math.floor(Math.random() * 2);
    if (direction == 1) {
        rotation *= -1;
    }
    var path = paper.path("M" + ((200 - size) / 2) + " 100a1 1 -30 0 1 " + size + " 0h-" + width + "a1 1 -30 0 0 -" + (size - (width * 2)) + " 0z");
    path.attr({ fill: "#" + color.toString(16) + color.toString(16) + color.toString(16), stroke: "#" + color.toString(16) + color.toString(16) + color.toString(16), opacity: 0.0 });
    txt.toFront();
    path.animate({
        rotation: rotation + ", 100, 100"
    }, 5000);
    path.animate({
        opacity: "1.0"
    }, 2500, function () {
        path.animate({
            opacity: "0.0"
        }, 2500, function () {
            path.remove();
        });
    });
}
function TextVariation() {
    txt.animate({
        opacity: "0.3"
    }, 1000, function () {
        txt.animate({
            opacity: "1.0"
        }, 1000);
    });
}

function logInfo() {
	console.log({
		RX: rX,
		RY: rY,
		RZ: rZ,
		TX: tX,
		TY: tY,
		TZ: tZ,
		Dir : dir,
		Maze : maze
	});
}
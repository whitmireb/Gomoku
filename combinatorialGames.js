/**
 * Contains Classes and functions for use with Combinatorial Games.
 *
 * authors: Kyle Webster Burke, paithanq@gmail.com, Raymond Riddell, Christina Shatney Garfield,
 * This software is licensed under the MIT License:
The MIT License (MIT)

Copyright (c) 2024 Kyle W. Burke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 **/

//used https://jbkflex.wordpress.com/2011/06/21/creating-dynamic-svg-elements-in-javascript/ as template for adding svg elements.  I don't know why the other stuff doesn't work.

/**
 *  TABLE OF CONTENTS:
 *      ABSTRACT GAME CLASS:
 *          CombinatorialGame
 *            ScoringCombinatorialGame
 *          HumanPlayer
 *          ComputerPlayer
 *      GAMES:
 *         Arc Kayles (Non-Disconnecting)
 *         Amazons
 *         Atropos
 *         Binary Geography
 *         Blackout
 *         Buttons and Scissors
 *         Clobber
 *         Clobbineering
 *         Col aka Grid Distance Game
 *         Connect Four
 *         Demi-Quantum Nim
 *         Domineering
 *         Flag Coloring
 *         Forced Capture Hnefatafl
 *         Gorgons
 *         Manalath  (Coded by Chrissy Shatney)
 *         Martian Chess (Coded by Cam Jefferys, Jake Andersen, and Jake Roman.)
 *         No Can Do
 *         Node Kayles (Non-Disconnecting) TODO: move all these to just be under Kayles.
 *         NoGo
 *         Paint Cans
 *         Popping Balloons
 *         Quantum Nim
 *         Reverse Clobber aka Anti-Clobber
 *         Toads and Frogs (Coded by Christopher Villegas)
 *          - Elephants and Rhinos (Coded by Christopher Villegas)
 *          - Slamming Toads and Frogs (Coded by Christopher Villegas)
 *         Transverse Waves
 *      PLAYER OPTIONS:
 *          GetCommonPlayerOptions
 *          GetCommonMCTSOptions
 *          GetCommonAIOptions
 *      Referee
 *      Random Player
 *      Monte Carlo Tree Search
 *      AI Player
 * 
 * (Table added by Raymond Riddell
 */

/**
 *  Abstract Class for combinatorial rulesets.
 *  Requirements for any subclass:
 *   * must contain a clone method
 *   * must contain a getOptionsForPlayer method
 *   * must have an equals method
 *   * must have a playerNames field.  E.g. ["Left", "Right"]
 */

const CombinatorialGame = Class.create({

    /**
     * Determines whether the given player has an option
     */
    hasOption: function (player, position) {
        if (position == null || position === undefined) {
            return false;
        }
        var options = this.getOptionsForPlayer(player);
        // console.log("Player " + player + " has " + options.length + " options.");
        for (var i = 0; i < options.length; i++) {
            // console.log("The option is: " + options[i]);
            if (options[i].equals(position)) return true;
        }
        return false;
    }

    /**
     * Returns a simplified form of this game, which must be equivalent.  This should be implemented in subclasses to improve performance for dynamic-programming AIs I haven't written yet. :-P
     */
    , simplify: function () {
        return this.clone();
    }

    /**
     * Gets the player's identity (Blue/Black/Vertical/etc) as a string.
     */
    , getPlayerName: function (playerIndex) {
        return this.__proto__.PLAYER_NAMES[playerIndex];
    }


});
//declare constants
CombinatorialGame.prototype.LEFT = 0;
CombinatorialGame.prototype.RIGHT = 1;
CombinatorialGame.prototype.PLAYER_NAMES = ["Left", "Right"];
CombinatorialGame.prototype.DRAW = 2;

//end of CombinatorialGame

/**
 * Superclass for Scoring Games.  (They just have to include the getScore method.)
 */
const ScoringCombinatorialGame = Class.create(CombinatorialGame, {
    //implement this method and return the appropriate score.
    getScore: function () {
        return 0;
    }

});

/**
 * A human interactive player.
 */
var HumanPlayer = Class.create({
    /**
     * Constructor
     */
    initialize: function (viewFactory) {
        this.viewFactory = viewFactory;
    }

    /**
     * Whether this uses a view.
     */
    , hasView: function () {
        return true;
    }

    /**
     * Returns the view.
     */
    , getView: function () {
        return this.view;
    }

    /**
     * Chooses a move.
     */
    , givePosition: function (playerIndex, position, referee) {
        this.playerIndex = playerIndex;
        this.position = position;
        this.referee = referee;
        this.view = this.viewFactory.getInteractiveBoard(position);
        this.view.draw(this.referee.getViewContainer(), this);
    }

    /**
     * Handle a mouse click, possibly getting a new position.
     */
    , handleClick: function (event) {
        var option = this.view.getNextPositionFromClick(event, this.playerIndex, this.referee.getViewContainer(), this);
        this.sendMoveToRef(option);
        //console.log("Human sent move to the ref.");
    }

    /**
     * Sends a move to the Referee.  Confirms that option is a legal move.
     */
    , sendMoveToRef: function (option) {
        if (option == null || option == undefined || option === undefined) {
            return;
        } else if (this.position.hasOption(this.playerIndex, option)) {
            this.referee.moveTo(option);
        } else {
            //TODO: comment this out for production
            console.log("Tried to move to a non-option, child stored in global childGame; parent stored in global parentGame");
            // console.log(universalBlock[0]);
            // console.log(universalDomino[0]);
            // console.log("Blocks around domino: " + universalBlocksAroundDomino);
            childGame = option;
            parentGame = this.position;
            return;
        }
    }

    /**
     * toString
     */
    , toString: function () {
        return "A Human player.";
    }
}); //end of HumanPlayer

/**
 * Abstract class for an automated player.
 */
var ComputerPlayer = Class.create({

    /**
     * Handle a mouse click, possibly getting a new position.
     */
    handleClick: function (event) { /*do nothing */ }

    , hasView: function () {
        return false;
    }

}); //end of Computer Player




/////////////// Arc Kayles ///////////////

var NonDisconnectingArcKayles = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (width, height) {
        this.playerNames = CombinatorialGame.prototype.PLAYER_NAMES;
        this.adjacencies = new Map(); //vertices are by id that can be converted to coordinates, by two functions below 
        this.width = width;
        this.height = height;
        //randomly generate the edges
        //first put an edge in each of the four corners
        var corner = 0;
        var cornerNeighbor = randomChoice([[0, 1], [1, 0], [1, 1]]);
        var neighbor = this.coordsToId(cornerNeighbor);
        this.addAdjacency(corner, neighbor);

        corner = this.width - 1;
        cornerNeighbor = randomChoice([[this.width - 2, 0], [this.width - 2, 1], [this.width - 1, 1]]);
        neighbor = this.coordsToId(cornerNeighbor);
        this.addAdjacency(corner, neighbor);

        var cornerCoords = [0, this.height - 1];
        corner = this.coordsToId(cornerCoords);
        cornerNeighbor = randomChoice([[1, this.height - 1], [1, this.height - 2], [0, this.height - 2]]);
        neighbor = this.coordsToId(cornerNeighbor);
        this.addAdjacency(corner, neighbor);

        var cornerCoords = [this.width - 1, this.height - 1];
        corner = this.coordsToId(cornerCoords);
        cornerNeighbor = randomChoice([[this.width - 2, this.height - 1], [this.width - 2, this.height - 2], [this.width - 1, this.height - 2]]);
        neighbor = this.coordsToId(cornerNeighbor);
        this.addAdjacency(corner, neighbor);

        while (!this.isConnected()) {
            const numToAdd = Math.floor(Math.random() * Math.max(this.width, this.height));
            for (var i = 0; i < numToAdd;) {
                //add a random edge
                const aCoords = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
                const direction = randomChoice([[-1, -1], [-1, 0], [0, -1], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]]);
                const bCoords = [aCoords[0] + direction[0], aCoords[1] + direction[1]];
                if (bCoords[0] >= 0 && bCoords[0] < this.width && bCoords[1] >= 0 && bCoords[1] < this.height) {
                    const aId = this.coordsToId(aCoords);
                    const bId = this.coordsToId(bCoords);
                    //enforce the planarity; no crossing edges
                    if (aCoords[0] != bCoords[0] && aCoords[1] != bCoords[1]) {
                        //create the coordinates of the crossing edge
                        const cCoords = [aCoords[0], bCoords[1]];
                        const dCoords = [bCoords[0], aCoords[1]];
                        const cId = this.coordsToId(cCoords);
                        const dId = this.coordsToId(dCoords);
                        const cNeighbors = this.adjacencies.get(cId);
                        if (cNeighbors != undefined && arrayContains(cNeighbors, dId)) {
                            continue;
                        }
                    }
                    this.addAdjacency(aId, bId);
                    i++;
                }
            }

        }
    }

    /**
     * Adds an adjaceny.
     */
    , addAdjacency: function (idA, idB) {
        if (!this.areAdjacent(idA, idB)) {
            if (this.adjacencies.has(idA)) {
                const neighbors = this.adjacencies.get(idA);
                neighbors.push(idB);
            } else {
                this.adjacencies.set(idA, [idB]);
            }
            if (this.adjacencies.has(idB)) {
                const neighbors = this.adjacencies.get(idB);
                neighbors.push(idA);
            } else {
                this.adjacencies.set(idB, [idA]);
            }
        }
    }

    /**
     * Converts a vertex id to the coordinates.
     */
    , idToCoords: function (id) {
        return [id % this.width, Math.floor(id / this.width)];
    }

    /**
     * Converts coordinates to an id.
     */
    , coordsToId: function (coords) {
        return coords[0] + (coords[1] * this.width);
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.width;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return this.height;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        return omniEquals(this.adjacencies, other.adjacencies);
    }

    /**
     * Clone.
     */
    , clone: function () {
        var clone = new NonDisconnectingArcKayles(this.getWidth(), this.getHeight());
        clone.adjacencies = new Map();
        for (const key of this.adjacencies.keys()) {
            const ogNeighbors = this.adjacencies.get(key);
            const cloneNeighbors = [];
            for (var i = 0; i < ogNeighbors.length; i++) {
                cloneNeighbors.push(ogNeighbors[i]);
            }
            clone.adjacencies.set(key, cloneNeighbors);
        }
        return clone;
    }

    /**
     * Returns whether idA and idB are adjacent.
     */
    , areAdjacent: function (idA, idB) {
        if (this.adjacencies.has(idA)) {
            const neighbors = this.adjacencies.get(idA);
            return arrayContains(neighbors, idB);
        } else {
            //TODO: is this what should happen??
            return false;
        }
    }

    /**
     * Returns whether this is a connected graph.
     */
    , isConnected: function () {
        if (this.adjacencies.size == 0) {
            return true;
        }
        //make a table of connected pieces
        const connected = [];
        for (var i = 0; i < this.width * this.height; i++) {
            connected.push(false);
        }
        const newInComponent = [];
        for (const first of this.adjacencies.keys()) {
            newInComponent.push(first);
            break;
        }
        for (var i = 0; i < newInComponent.length; i++) {
            const currentV = newInComponent[i];
            if (!connected[currentV]) {
                //we haven't seen currentV yet.
                connected[currentV] = true;
                const neighbors = this.adjacencies.get(currentV);
                //console.log("currentV: " + currentV);
                //console.log(this);
                for (var j = 0; j < neighbors.length; j++) {
                    newInComponent.push(neighbors[j]);
                }
            }
        }

        //now let's check to see if everything got marked
        for (const key of this.adjacencies.keys()) {
            if (!connected[key]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const options = [];
        for (const key of this.adjacencies.keys()) {
            const neighbors = this.adjacencies.get(key);
            for (var i = 0; i < neighbors.length; i++) {
                const idB = neighbors[i];
                if (key < idB) {
                    const option = this.getOptionFromMove(key, idB);
                    //console.log("testing an option, from (" + key + ", " + idB + ")");
                    console.log(option);
                    if (option.isConnected()) {
                        options.push(option);
                        //console.log("Just added an option!");
                        //console.log(option);
                    }
                }
            }
        }
        return options;
    }

    /**
     * Returns the option for going in one direction.  Horizontal Delta and Vertical Delta are both in [-1, 0, 1].  Doesn't check that the result is an option.
     */
    , getOptionFromMove: function (idA, idB) {
        const option = this.clone();
        option.deleteVertex(idA);
        option.deleteVertex(idB);
        return option;
        /*
        if (option.isConnected()) {
            return option;
        } else {
            return null;
        }*/

    }

    /**
     * Removes a vertex.
     */
    , deleteVertex: function (id) {
        if (this.adjacencies.has(id)) {
            const neighbors = this.adjacencies.get(id);
            this.adjacencies.delete(id);
            for (var i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                const neighborList = this.adjacencies.get(neighbor);
                //console.log("neighborList: " + neighborList);
                removePrimitiveFromArray(neighborList, id);
                //console.log("removed " + id + " from list from " + neighbor + ".  Now: " + neighborList);
                /*
                if (neighborList.length == 0) {
                    this.adjacencies.delete(neighbor);
                    console.log("Removed list for " + neighbor);
                }
                */
            }
        } else {
            console.log("no vertex with id: " + id);
        }
    }

});  //end of NonDisconnectingArcKayles class



const InteractiveNonDisconnectingArcKaylesView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        var boardWidth = Math.min(getAvailableHorizontalPixels(containerElement), window.innerWidth - 200);
        var boardPixelSize = Math.min(window.innerHeight, boardWidth);
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100
        boardSvg.setAttributeNS(null, "width", boardPixelSize);
        boardSvg.setAttributeNS(null, "height", boardPixelSize);

        //get some dimensions based on the canvas size
        var maxCircleWidth = (boardPixelSize - 10) / width;
        var maxCircleHeight = (boardPixelSize - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var boxSide = maxDiameter;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //console.log("boxSide:" + boxSide);


        //draw the board
        for (const v1 of this.position.adjacencies.keys()) {
            const neighbors = this.position.adjacencies.get(v1);
            const v1Coords = this.position.idToCoords(v1);
            //draw v1
            var element = document.createElementNS(svgNS, "circle");
            element.setAttributeNS(null, "cx", (v1Coords[0] + .5) * boxSide);
            element.setAttributeNS(null, "cy", (v1Coords[1] + .5) * boxSide);
            element.setAttributeNS(null, "r", .25 * boxSide);
            element.style.stroke = "black";
            element.style.fill = "black";
            boardSvg.appendChild(element);
            for (var i = 0; i < neighbors.length; i++) {
                const v2 = neighbors[i];
                if (v1 < v2) {
                    const v2Coords = this.position.idToCoords(v2);
                    element = document.createElementNS(svgNS, "line");
                    element.setAttributeNS(null, "x1", (v1Coords[0] + .5) * boxSide);
                    element.setAttributeNS(null, "y1", (v1Coords[1] + .5) * boxSide);
                    element.setAttributeNS(null, "x2", (v2Coords[0] + .5) * boxSide);
                    element.setAttributeNS(null, "y2", (v2Coords[1] + .5) * boxSide);
                    element.style.stroke = "black";
                    element.style.strokeWidth = "8";
                    boardSvg.appendChild(element);
                    if (listener != undefined) {
                        var player = listener;
                        element.onclick = function (event) { player.handleClick(event); }
                        element.idA = v1;
                        element.idB = v2;
                    }
                }
            }

        }
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        const idA = event.target.idA;
        const idB = event.target.idB;
        console.log("Getting option from click...");
        const option = this.position.getOptionFromMove(idA, idB);
        console.log("Got option from click...");
        return option;
    }

}); //end of InteractiveNonDisconnectingArcKaylesView



/**
 * View Factory for NonDisconnectingArcKayles
 */
var InteractiveNonDisconnectingArcKaylesViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveNonDisconnectingArcKaylesView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveNonDisconnectingArcKaylesViewFactory

/**
 * Launches a new NonDisconnectingArcKayles game.
 */
function newNonDisconnectingArcKaylesGame() {
    var viewFactory = new InteractiveNonDisconnectingArcKaylesViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new NonDisconnectingArcKayles(width, height);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of NonDisconnectingArcKayles




/////////////// AMAZONS ///////////////

var Amazons = Class.create(CombinatorialGame, {

    initialize: function (size, numBlueAmazons, numRedAmazons) {
        numBlueAmazons = numBlueAmazons || numRedAmazons;
        this.playerNames = Amazons.prototype.PLAYER_NAMES;
        const width = size;
        const height = size;

        this.board = [];
        for (var i = 0; i < width; i++) {
            const column = [];
            for (var j = 0; j < height; j++) {
                column.push("blank");
            }
            this.board.push(column);
        }

        this.board[3][0] = "amazon blue";
        this.board[6][0] = "amazon blue";
        this.board[0][3] = "amazon blue";
        this.board[9][3] = "amazon blue";

        this.board[0][6] = "amazon red";
        this.board[9][6] = "amazon red";
        this.board[3][9] = "amazon red";
        this.board[6][9] = "amazon red";

        if (numBlueAmazons < 0 || numRedAmazons < 0) {
            console.log("ERROR: trying to create a game with negative Amazons!");
            return;
        } else if (Math.max(numBlueAmazons, numRedAmazons) > (width + height) / 2) {
            console.log("ERROR: too many Amazons chosen, so we're going down to " + size + " Amazons per side.");
        }
    },

    getBoard: function () {
        return this.board;
    },

    getWidth: function () {
        return this.board.length;
    },

    getHeight: function () {
        return this.board[0].length;
    },

    getNumAmazons: function () {
        var count = 0;
        const pieceName = "amazon " + (playerId == 0 ? "blue" : "red");
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] == pieceName) {
                    count++;
                }
            }
        }
        return count;
    },

    /**
     * Equals!
     */
    equals: function (other) {
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] != other.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    },

    clone: function () {
        var clone = new Amazons(this.getWidth(), 0, 0);
        clone.board = [];
        for (var i = 0; i < this.getWidth(); i++) {
            const col = [];
            for (var j = 0; j < this.getHeight(); j++) {
                col.push(this.board[i][j]);
            }
            clone.board.push(col);
        }
        return clone;
    },

    coordinatesEquals: function (coordsA, coordsB) {
        return coordsA[0] == coordsB[0] && coordsA[1] == coordsB[1];
    },

    // Returns the locations of the Amazons for a specified player.
    getAmazons: function (playerId) {
        const amazons = [];
        const amazonName = "amazon " + (playerId == 0 ? "blue" : "red");
        // console.log(amazonName);
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                const contents = this.board[i][j];
                if (contents == amazonName) {
                    amazons.push([i, j]);
                }
            }
        }
        return amazons;
    },

    // returns a list of available tiles for the Amazon to move to
    movableTiles: function (amazonLoc, board, ignore = null) {
        //const ignore_tile = ignore ? true : (amazonLoc[0] != i || amazonLoc[1] != j);
        const moves = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (board[i][j] != "stone" && this.canMoveQueenly(amazonLoc[0], amazonLoc[1], i, j, ignore) && (amazonLoc[0] != i || amazonLoc[1] != j)) {
                    moves.push([i, j]);
                }
            }
        }

        return moves;
    },

    canMoveQueenly: function (selected_col, selected_row, move_col, move_row, ignore = null) {

        function difference(x, y) {
            if (x > y) {
                return -1;
            } else if (x < y) {
                return 1;
            } else {
                return 0;
            }
        }

        const board = this.getBoard();
        var playerId = board[selected_col][selected_row];
        var ignore_row;
        var ignore_col;

        if (ignore != null) {
            ignore_col = ignore[0];
            ignore_row = ignore[1];
        }

        // can't move anything but your own piece
        if (board[selected_col][selected_row] != playerId) {
            return false;
        }

        // piece must move
        if (selected_col == move_col && selected_row == move_row) {
            return false;
        }

        // move must be horizontal, vertical, or diagonal
        if (selected_row != move_row && selected_col != move_col && Math.abs(parseFloat(selected_row - move_row) / (selected_col - move_col)) != 1) {
            return false;
        }

        var current_row = selected_row + difference(selected_row, move_row);
        var current_col = selected_col + difference(selected_col, move_col);

        while (current_row != move_row || current_col != move_col) {
            if (ignore != null) {
                if (current_row == ignore_row && current_col == ignore_col) {

                } else if (board[current_col][current_row] != 'blank') {
                    return false;
                }
            } else {
                if (board[current_col][current_row] != 'blank') {
                    return false;
                }
            }
            current_row += difference(current_row, move_row);
            current_col += difference(current_col, move_col);
        }
        if (board[current_col][current_row] != 'blank' && !(current_row == ignore_row && current_col == ignore_col)) {
            return false;
        }
        return true;

    },

    getOptionsForPlayer: function (playerId) {
        const amazons = this.getAmazons(playerId);
        const options = [];

        for (var i = 0; i < amazons.length; i++) {
            var amazon = amazons[i];
            const oneAmazonsHalfMoves = this.movableTiles(amazon, this.board);

            for (var j = 0; j < oneAmazonsHalfMoves.length; j++) {
                const copy = this.clone();
                // Move the Amazon to the new space
                copy.getBoard()[oneAmazonsHalfMoves[j][0]][oneAmazonsHalfMoves[j][1]] = "amazon " + (playerId == 0 ? "blue" : "red");
                // Change the Amazon's old space to a blank
                copy.getBoard()[amazon[0]][amazon[1]] = "blank";
                // Change current amazon's poisition to reflect movement
                var amazonHalfway = [oneAmazonsHalfMoves[j][0], oneAmazonsHalfMoves[j][1]];
                // Gather the places that Amazon can shoot
                var oneAmazonsMoves = this.movableTiles(amazonHalfway, copy.getBoard(), amazon);
                // Parse
                for (var k = 0; k < oneAmazonsMoves.length; k++) {
                    const newClone = copy.clone();
                    newClone.getBoard()[oneAmazonsMoves[k][0]][oneAmazonsMoves[k][1]] = "stone";
                    // Yeet that bitch (respectfully)
                    options.push(newClone);
                }
            }
        }
        return options;
    },

    getOptionFromMove: function (amazonTile, moveToTile, stoneTile) {
        if (this.canMoveQueenly(amazonTile[0], amazonTile[1], moveToTile[0], moveToTile[1]) && this.canMoveQueenly(moveToTile[0], moveToTile[1], stoneTile[0], stoneTile[1], ignore = amazonTile)) {
            const option = this.clone();
            const amazonString = option.board[amazonTile[0]][amazonTile[1]];
            option.board[moveToTile[0]][moveToTile[1]] = amazonString;
            option.board[amazonTile[0]][amazonTile[1]] = "blank";
            option.board[stoneTile[0]][stoneTile[1]] = "stone";

            return option;
        }
        else {
            return null;
        }
    }
});
Amazons.prototype.PLAYER_NAMES = ["Blue", "Red"];

const InteractiveAmazonsView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
        this.selectedMove = undefined;
    },

    draw: function (containerElement, listener) {
        this.selectedTile = undefined;
        //let's write the board contents out so we can traverse it that way
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        var boardWidth = Math.min(getAvailableHorizontalPixels(containerElement), window.innerWidth - 200);
        var boardPixelSize = Math.min(window.innerHeight, boardWidth);
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100
        boardSvg.setAttributeNS(null, "width", boardPixelSize);
        boardSvg.setAttributeNS(null, "height", boardPixelSize);

        //get some dimensions based on the canvas size
        var maxCircleWidth = (boardPixelSize - 10) / width;
        var maxCircleHeight = (boardPixelSize - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var boxSide = maxDiameter;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var text = "";
                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                square.style.stroke = "black";
                square.style.strokeWith = 2;
                square.style.fill = "white";
                var content = this.position.board[colIndex][rowIndex];
                if (content.includes("stone")) {
                    square.style.fill = "gray";
                }
                if (content.includes("amazon")) {
                    text = "A";
                    //text = "ï¿¼ï¿¼ï¿¼ðŸ"; //this is a green snake
                }
                const textColor = (content.includes("blue")) ? "blue" : "red";

                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.box = square; // so the text and this can both refer to the square itself
                    square.onclick = function (event) { player.handleClick(event); }
                    square.text = text;
                    square.color = textColor;
                }
                boardSvg.appendChild(square);

                if (text != "") {
                    const textBuffer = Math.ceil(.17 * boxSide);
                    const textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", x + textBuffer);//+ 20);
                    textElement.setAttributeNS(null, "y", y + boxSide - textBuffer);//+ 20);
                    const textSize = Math.ceil(.8 * boxSide);
                    textElement.setAttributeNS(null, "font-size", textSize);
                    //textElement.setAttributeNS(null, "color", textColor);
                    textElement.style.fill = textColor;

                    textElement.textContent = text;
                    textElement.column = colIndex;
                    textElement.row = rowIndex;
                    textElement.box = square;
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "single";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.box = square; // so the text and this can both refer to the square itself
                        square.onclick = function (event) { player.handleClick(event); }
                        textElement.onclick = function (event) { player.handleClick(event); }
                    }
                    boardSvg.appendChild(textElement);
                }
            }
        }
        this.graphics = boardSvg;
    },

    selectTile: function (tile) {
        this.selectedTile = tile;
        //this.selectedTile.oldColor = this.selectedTile.style.fill;
        //this.selectedTile.style.fill = "yellow";
        this.addXs(this.selectedTile.box.column, this.selectedTile.box.row);
    },

    deselectTile: function () {
        //this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
        this.removeXs();
    },

    selectMoveTile: function (tile) {
        this.removeXs();
        this.selectedMove = tile;
        //this.selectedMove.oldColor = this.selectedMove.style.fill;
        //this.selectedMove.style.fill = "yellow";
        this.addXs(this.selectedMove.box.column, this.selectedMove.box.row);
    },

    deselectMoveTile: function (tile) {
        //this.selectedMove.style.fill = this.selectedMove.oldColor;
        this.selectedMove = undefined;
        this.removeXs();
    },

    addXs: function (col, row) {
        this.stoneOptionXs = [];
        const boardPixelWidth = this.graphics.getAttributeNS(null, "width");
        const boardPixelHeight = this.graphics.getAttributeNS(null, "height");
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        var maxCircleWidth = (boardPixelWidth - 10) / width;
        var maxCircleHeight = (boardPixelHeight - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        const boxSide = maxDiameter;
        //const boxSide = boardPixelWidth / width;
        var svgNS = "http://www.w3.org/2000/svg";
        //console.log("boardPixelSize: " + boardPixelSize);
        const amazonLoc = [col, row];
        const oldAmazonLoc = [this.selectedTile.column, this.selectedTile.row];
        const locations = this.position.movableTiles(amazonLoc, this.position.getBoard(), oldAmazonLoc);

        for (var i = 0; i < locations.length; i++) {
            const location = locations[i];

            const x = 5 + Math.floor(location[0] * boxSide);
            const y = 5 + Math.floor(location[1] * boxSide);
            const topLeft = [x, y];
            const topRight = [x + boxSide, y];
            const bottomLeft = [x, y + boxSide];
            const bottomRight = [x + boxSide, y + boxSide];
            const textPadding = 10;
            const line1 = document.createElementNS(svgNS, "line");
            line1.setAttributeNS(null, "x1", topLeft[0]);
            line1.setAttributeNS(null, "y1", topLeft[1]);
            line1.setAttributeNS(null, "x2", bottomRight[0]);
            line1.setAttributeNS(null, "y2", bottomRight[1]);
            line1.style.stroke = "black";
            line1.style.strokeWidth = "2";
            line1.height = "" + boxSide;
            line1.width = "" + boxSide;
            this.graphics.appendChild(line1);
            this.stoneOptionXs.push(line1);
            const line2 = document.createElementNS(svgNS, "line");
            line2.setAttributeNS(null, "x1", topRight[0]);
            line2.setAttributeNS(null, "y1", topRight[1]);
            line2.setAttributeNS(null, "x2", bottomLeft[0]);
            line2.setAttributeNS(null, "y2", bottomLeft[1]);
            line2.style.stroke = "black";
            line2.style.strokeWidth = "2";
            line2.height = "" + boxSide;
            line2.width = "" + boxSide;
            this.graphics.appendChild(line2);
            this.stoneOptionXs.push(line2);

        }
    },

    removeXs: function () {
        for (var i = 0; i < this.stoneOptionXs.length; i++) {
            this.graphics.removeChild(this.stoneOptionXs[i]);
        }
        this.stoneOptionXs = [];
    },

    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target.box;
        // Determine the Amazon the player wants to move
        if (this.selectedTile === undefined) {
            //console.log("First case!");
            const text = clickedTile.text;
            const amazonPlayer = clickedTile.color == "blue" ? 0 : 1;
            if (text == "A" && amazonPlayer == currentPlayer) {
                this.selectTile(clickedTile);
            }
            return null;
        }
        // Determine where the player wants to move the Amazon
        else if (this.selectedMove === undefined) {
            // Takesies-backsies
            if (clickedTile == this.selectedTile) {
                this.deselectTile();
                return null;
            }
            const text = clickedTile.text;
            const amazonLoc = [this.selectedTile.column, this.selectedTile.row];
            const selectedMoveTile = [clickedTile.column, clickedTile.row];

            const board = this.position.getBoard();
            const possibleMovements = this.position.movableTiles(amazonLoc, board);

            var flag = false;
            for (var i = 0; i < possibleMovements.length; i++) {
                const possibleMove = possibleMovements[i];

                if (text != "stone" && this.position.coordinatesEquals(selectedMoveTile, possibleMove)) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                this.selectMoveTile(clickedTile);
            }
        }
        // Determine which tile the Amazon should destroy
        else {
            const text = clickedTile.text;
            const oldAmazonLoc = [this.selectedTile.column, this.selectedTile.row];
            const newAmazonLoc = [this.selectedMove.column, this.selectedMove.row];
            const destroyedTile = [clickedTile.column, clickedTile.row];

            if (clickedTile == this.selectedMove) {
                this.deselectMoveTile();
                this.selectTile(this.selectedTile);
                return null;
            }

            const board = this.position.getBoard();

            possibleTiles = this.position.movableTiles(newAmazonLoc, board, oldAmazonLoc);
            //console.log(possibleTiles);

            for (var i = 0; i < possibleTiles.length; i++) {
                const possibleTile = possibleTiles[i];

                if (text != "stone" && this.position.coordinatesEquals(destroyedTile, possibleTile)) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                const amazonTile = [this.selectedTile.column, this.selectedTile.row];
                const moveTile = [this.selectedMove.column, this.selectedMove.row];

                const option = this.position.getOptionFromMove(amazonTile, moveTile, destroyedTile);

                this.deselectTile();
                this.deselectMoveTile();
                return option;
            }
        }
    }
});

/**
 * View Factory for Amazons
 */
var InteractiveAmazonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    },

    /**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveAmazonsView(position);
    },

    /**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    },

}); //end of InteractiveAmazonsViewFactory

function newAmazonsGame() {
    var viewFactory = new InteractiveAmazonsViewFactory();
    var playDelay = 1000;
    var size = 10;
    var numBlueAmazons = 4;
    var numRedAmazons = 4;
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new Amazons(size, numBlueAmazons, numRedAmazons);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};





/////////////////////////////////////// Atropos //////////////////////////////////////////////////////


/**
 * Class for Atropos ruleset.
 */
const Atropos = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (sideLength, lastPlay, filledCirclesAndColors) {
        this.playerNames = ["Left", "Right"];
        this.sideLength = sideLength;
        this.lastPlay = null;
        if (lastPlay != undefined && this.lastPlay != null) {
            this.lastPlay = [lastPlay[0], lastPlay[1]];
        }
        if (filledCirclesAndColors == undefined) {
            filledCirclesAndColors = this.getStartingColoredCircles();
        }
        filledCirclesAndColors = filledCirclesAndColors || [];
        this.filledCircles = [];
        for (var i = 0; i < filledCirclesAndColors.length; i++) {
            // console.log(filledCirclesAndColors);
            var circle = filledCirclesAndColors[i];
            // console.log("circle: " + circle);
            if (circle[2] != Atropos.prototype.UNCOLORED) {
                // console.log("Circle array thing: " + [circle[0], circle[1], circle[2]]);
                this.filledCircles.push([circle[0], circle[1], circle[2]]);
            }
        }
    }

    /**
     * Returns the starting colors based on this.sideLength.
     */
    , getStartingColoredCircles: function () {
        var startingCircles = [];
        //bottom row: yellow and blue
        for (var column = 1; column < this.sideLength + 2; column++) {
            var row = 0;
            var possibleColors = [Atropos.prototype.YELLOW, Atropos.prototype.BLUE];
            startingCircles.push([row, column, possibleColors[column % 2]]);
        }
        //left hand side: blue and red
        for (var row = 1; row < this.sideLength + 2; row++) {
            var column = 0;
            var possibleColors = [Atropos.prototype.BLUE, Atropos.prototype.RED];
            startingCircles.push([row, column, possibleColors[row % 2]]);
        }
        //right hand side: red and yellow
        for (var row = 1; row < this.sideLength + 2; row++) {
            var column = this.sideLength + 2 - row;
            var possibleColors = [Atropos.prototype.RED, Atropos.prototype.YELLOW];
            startingCircles.push([row, column, possibleColors[row % 2]]);
        }
        return startingCircles;
    }

    /**
     * Returns the color of a circle.
     */
    , getCircleColor: function (row, angledColumn) {
        for (var i = 0; i < this.filledCircles.length; i++) {
            var circle = this.filledCircles[i];
            if (circle[0] == row && circle[1] == angledColumn) {
                return circle[2];
            }
        }
        return Atropos.prototype.UNCOLORED;
    }

    /**
     * Returns whether a circle is colored.
     */
    , isColored: function (row, column) {
        return this.getCircleColor(row, column) != 3;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        if (this.sideLength != other.sideLength) {
            return false;
        }
        if ((this.lastPlay == null && other.lastPlay != null) ||
            (this.lastPlay != null && other.lastPlay == null) ||
            (this.lastPlay != null && other.lastPlay != null &&
                (this.lastPlay[0] != other.lastPlay[0] ||
                    this.lastPlay[1] != other.lastPlay[1]))) {
            return false;
        }
        if (this.filledCircles.length != other.filledCircles.length) {
            return false;
        }
        for (var i = 0; i < this.filledCircles.length; i++) {
            var circle = this.filledCircles[i];
            var row = circle[0];
            var column = circle[1];
            var color = circle[2];
            if (other.getCircleColor(row, column) != color) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clone!
     */
    , clone: function () {
        return new Atropos(this.sideLength, this.lastPlay, this.filledCircles);
    }

    /**
     * Gets any colors that can't be played adjacent to the two given circle locations.
     */
    , getIllegalColorsNearTwo: function (circleARow, circleAColumn, circleBRow, circleBColumn) {
        if (this.isColored(circleARow, circleAColumn) && this.isColored(circleBRow, circleBColumn)) {
            var colorA = this.getCircleColor(circleARow, circleAColumn);
            var colorB = this.getCircleColor(circleBRow, circleBColumn);
            if (colorA != colorB) {
                return [3 - (colorA + colorB)];
            }
        }
        return [];
    }

    /**
     * Gets an ordered list of the 6 coordinates around a given point.
     */
    , getNeighboringCoordinates: function (row, column) {
        var neighbors = [];
        neighbors.push([row + 1, column - 1]);
        neighbors.push([row, column - 1]);
        neighbors.push([row - 1, column]);
        neighbors.push([row - 1, column + 1]);
        neighbors.push([row, column + 1]);
        neighbors.push([row + 1, column]);
        return neighbors;
    }

    /**
     * Returns whether a location is surrounded by colored spaces.
     */
    , isSurrounded: function (row, column) {
        var neighbors = this.getNeighboringCoordinates(row, column);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!this.isColored(neighbor[0], neighbor[1])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether the next play is a jump.
     */
    , nextIsJump: function () {
        return this.lastPlay == null || this.isSurrounded(this.lastPlay[0], this.lastPlay[1]);
    }

    /**
     * Gets any colors that can't be played a certain location.
     */
    , getIllegalColorsAt: function (row, column) {
        var neighbors = this.getNeighboringCoordinates(row, column);
        var illegalColors = [];
        for (var i = 0; i < neighbors.length; i++) {
            var neighborA = neighbors[i];
            var neighborB = neighbors[(i + 1) % neighbors.length];
            var moreIllegal = this.getIllegalColorsNearTwo(neighborA[0], neighborA[1], neighborB[0], neighborB[1]);
            for (var j = 0; j < moreIllegal.length; j++) {
                var illegalColor = moreIllegal[j];
                if (illegalColors.indexOf(illegalColor) < 0) {
                    illegalColors.push(moreIllegal[j]);
                }
            }
        }
        //console.log("illegal colors at (" + row + ", " + column + "): " + illegalColors);
        return illegalColors;
    }

    /**
     * Gets any colors that can be played at a location.
     */
    , getLegalColorsAt: function (row, column) {
        var allColors = [Atropos.prototype.RED, Atropos.prototype.BLUE, Atropos.prototype.YELLOW];
        var illegalColors = this.getIllegalColorsAt(row, column);
        var legalColors = [];
        for (var i = 0; i < allColors.length; i++) {
            if (illegalColors.indexOf(allColors[i]) < 0) {
                legalColors.push(allColors[i]);
            }
        }
        return legalColors;
    }

    //override
    , getOptionsForPlayer: function (playerId) {
        var options = [];
        if (this.nextIsJump()) {
            for (var row = 1; row < this.sideLength + 2; row++) {
                for (var column = 1; column < this.sideLength + 2 - row; column++) {
                    var optionsAtLocation = this.getOptionsAt(row, column);
                    options = options.concat(optionsAtLocation);
                }
            }
        } else {
            //console.log("not a jump");
            options = this.getOptionsAround(this.lastPlay[0], this.lastPlay[1]);
        }
        return options;
    }

    /**
     * Returns a move option with an added circle.  Does not check that this isn't already colored!
     */
    , getOptionWith: function (row, column, color) {
        var clone = this.clone();
        clone.filledCircles.push([row, column, color]);
        clone.lastPlay = [row, column];
        return clone;
    }

    /**
     * Returns the options around a point.
     */
    , getOptionsAround: function (row, column) {
        var options = [];
        var neighbors = this.getNeighboringCoordinates(row, column);
        for (var i = 0; i < neighbors.length; i++) {
            options = options.concat(this.getOptionsAt(neighbors[i][0], neighbors[i][1]));
        }
        return options;
    }

    /**
     * Returns an array of all the options at a specific row and column.
     */
    , getOptionsAt: function (row, column) {
        var options = [];
        if (!this.isColored(row, column)) {
            var colors = this.getLegalColorsAt(row, column);
            for (var i = 0; i < colors.length; i++) {
                options.push(this.getOptionWith(row, column, colors[i]));
            }
        }
        return options;
    }

});
//Some Atropos constants
Atropos.prototype.RED = 0;
Atropos.prototype.BLUE = 1;
Atropos.prototype.YELLOW = 2;
Atropos.prototype.UNCOLORED = 3;
//end of Atropos class



var InteractiveAtroposView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedElement = undefined;
        this.popup = null;
    }

    /**
     * Draws the checker board and assigns the listener
     */
    , draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        //var boardPixelSize = Math.min(window.innerHeight, window.innerWidth - 600);
        nicelySizeSVG(boardSvg, containerElement);
        const screenWidth = boardSvg.getAttributeNS(null, "width");
        const screenHeight = boardSvg.getAttributeNS(null, "height");
        const boardPixelSize = Math.min(screenWidth, screenHeight);
        var n = this.position.sideLength + 2;
        var boxSide = boardPixelSize / (n + 1);
        //console.log("boxSide: " + boxSide);
        var circleRadius = (boxSide - 10) / 2;

        //draw the circles
        for (var row = this.position.sideLength + 1; row >= 0; row--) {
            for (var column = Math.max(0, 1 - row); column < n + 1 - Math.max(row, 1); column++) {
                var colorInt = this.position.getCircleColor(row, column);
                var circle = document.createElementNS(svgNS, "circle");
                circle.row = row;
                circle.column = column;
                circle.setAttributeNS(null, "cx", (column * boxSide) + (row * boxSide / 2) + boxSide / 2);
                circle.setAttributeNS(null, "cy", ((n - row) * boxSide));
                circle.setAttributeNS(null, "r", circleRadius);
                if (!this.position.nextIsJump() && circle.row == this.position.lastPlay[0] && circle.column == this.position.lastPlay[1]) {
                    circle.style.stroke = "pink";
                }
                if (colorInt == Atropos.prototype.RED) {
                    circle.setAttributeNS(null, "class", "redPiece");
                } else if (colorInt == Atropos.prototype.BLUE) {
                    circle.setAttributeNS(null, "class", "bluePiece");
                } else if (colorInt == Atropos.prototype.YELLOW) {
                    circle.setAttributeNS(null, "class", "yellowPiece");
                } else {
                    circle.setAttributeNS(null, "class", "whitePiece");
                    //only white circles are clickable
                    if (listener != undefined) {
                        var player = listener;
                        circle.onclick = function (event) {
                            //console.log("clicked on: (" + event.target.row + ", " + event.target.column + ")");
                            player.handleClick(event);
                        };
                    }
                }
                boardSvg.appendChild(circle);
            }
        }
    }

    /**
     * Handles a mouse click.
     * @param currentPlayer  The index for the player, not the player object.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        this.destroyPopup();
        var self = this;
        //create the popup
        this.popup = document.createElement("div");
        var redButton = document.createElement("button");
        redButton.appendChild(toNode("Red"));
        redButton.onclick = function () {
            self.destroyPopup();
            player.sendMoveToRef(self.position.getOptionWith(event.target.row, event.target.column, Atropos.prototype.RED));
        };
        this.popup.appendChild(redButton);

        var blueButton = document.createElement("button");
        blueButton.appendChild(toNode("Blue"));
        blueButton.onclick = function () {
            self.destroyPopup();
            player.sendMoveToRef(self.position.getOptionWith(event.target.row, event.target.column, Atropos.prototype.BLUE));
        };
        this.popup.appendChild(blueButton);

        var yellowButton = document.createElement("button");
        yellowButton.appendChild(toNode("Yellow"));
        yellowButton.onclick = function () {
            self.destroyPopup();
            player.sendMoveToRef(self.position.getOptionWith(event.target.row, event.target.column, Atropos.prototype.YELLOW));
        };
        this.popup.appendChild(yellowButton);

        this.popup.style.position = "fixed";
        this.popup.style.display = "block";
        this.popup.style.opacity = 1;
        this.popup.width = Math.min(window.innerWidth / 2, 100);
        this.popup.height = Math.min(window.innerHeight / 2, 50);
        this.popup.style.left = event.clientX + "px";
        this.popup.style.top = event.clientY + "px";
        document.body.appendChild(this.popup);
        return null;
    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }
});  //end of InteractiveAtroposView

/**
 * View Factory
 */
var InteractiveAtroposViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveAtroposView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveAtroposViewFactory

/**
 * Launches a new Atropos game.
 */
function newAtroposGame() {
    var viewFactory = new InteractiveAtroposViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardSize').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var game = new Atropos(width);
    var players = [leftPlayer, rightPlayer];
    var ref = new Referee(game, players, viewFactory, "atroposBoard", $('messageBox'), controlForm);
}

/**
 * Class for MisereAtropos ruleset.  (It ends when the three-colored triangle is created.)
 */
const MisereAtropos = Class.create(Atropos, {

    /**
     * Constructor.
     */
    initialize: function (sideLength, lastPlay, filledCirclesAndColors) {
        this.playerNames = ["Left", "Right"];
        this.sideLength = sideLength;
        this.lastPlay = null;
        if (lastPlay != undefined && this.lastPlay != null) {
            this.lastPlay = [lastPlay[0], lastPlay[1]];
        }
        if (filledCirclesAndColors == undefined) {
            filledCirclesAndColors = this.getStartingColoredCircles();
        }
        filledCirclesAndColors = filledCirclesAndColors || [];
        this.filledCircles = [];
        for (var i = 0; i < filledCirclesAndColors.length; i++) {
            // console.log(filledCirclesAndColors);
            var circle = filledCirclesAndColors[i];
            // console.log("circle: " + circle);
            if (circle[2] != Atropos.prototype.UNCOLORED) {
                // console.log("Circle array thing: " + [circle[0], circle[1], circle[2]]);
                this.filledCircles.push([circle[0], circle[1], circle[2]]);
            }
        }
    }

    /**
     * Returns whether plays can be made.  (If not, then the last play created a 3-colored triangle.)
     */
    , canPlay: function () {
        if (this.lastPlay == null) {
            return true;
        } else {
            const lastRow = this.lastPlay[0];
            const lastColumn = this.lastPlay[1];
            const lastColor = this.getCircleColor(lastRow, lastColumn);
            const neighbors = this.getNeighboringCoordinates(lastRow, lastColumn);
            for (var i = 0; i < neighbors.length; i++) {
                const circleA = neighbors[i];
                const colorA = this.getCircleColor(circleA[0], circleA[1]);
                const circleB = neighbors[(i + 1) % neighbors.length];
                const colorB = this.getCircleColor(circleB[0], circleB[1]);
                if (this.allThreeColors(lastColor, colorA, colorB)) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Checks whether the three colors are different (and none are uncolored).
     */
    , allThreeColors: function (colorA, colorB, colorC) {
        if (colorA == Atropos.prototype.UNCOLORED || colorB == Atropos.prototype.UNCOLORED || colorC == Atropos.prototype.UNCOLORED) {
            return false;
        } else {
            return colorA != colorB && colorB != colorC && colorC != colorA;
        }
    }

    /**
     * Returns the starting colors based on this.sideLength.
     */
    , getStartingColoredCircles: function () {
        var startingCircles = [];
        //bottom row: yellow and blue
        for (var column = 1; column < this.sideLength + 2; column++) {
            var row = 0;
            var possibleColors = [Atropos.prototype.YELLOW, Atropos.prototype.BLUE];
            startingCircles.push([row, column, possibleColors[column % 2]]);
        }
        //left hand side: blue and red
        for (var row = 1; row < this.sideLength + 2; row++) {
            var column = 0;
            var possibleColors = [Atropos.prototype.BLUE, Atropos.prototype.RED];
            startingCircles.push([row, column, possibleColors[row % 2]]);
        }
        //right hand side: red and yellow
        for (var row = 1; row < this.sideLength + 2; row++) {
            var column = this.sideLength + 2 - row;
            var possibleColors = [Atropos.prototype.RED, Atropos.prototype.YELLOW];
            startingCircles.push([row, column, possibleColors[row % 2]]);
        }
        return startingCircles;
    }

    /**
     * Returns the color of a circle.
     */
    , getCircleColor: function (row, angledColumn) {
        for (var i = 0; i < this.filledCircles.length; i++) {
            var circle = this.filledCircles[i];
            if (circle[0] == row && circle[1] == angledColumn) {
                return circle[2];
            }
        }
        return Atropos.prototype.UNCOLORED;
    }

    /**
     * Returns whether a circle is colored.
     */
    , isColored: function (row, column) {
        return this.getCircleColor(row, column) != 3;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        if (this.sideLength != other.sideLength) {
            return false;
        }
        if ((this.lastPlay == null && other.lastPlay != null) ||
            (this.lastPlay != null && other.lastPlay == null) ||
            (this.lastPlay != null && other.lastPlay != null &&
                (this.lastPlay[0] != other.lastPlay[0] ||
                    this.lastPlay[1] != other.lastPlay[1]))) {
            return false;
        }
        if (this.filledCircles.length != other.filledCircles.length) {
            return false;
        }
        for (var i = 0; i < this.filledCircles.length; i++) {
            var circle = this.filledCircles[i];
            var row = circle[0];
            var column = circle[1];
            var color = circle[2];
            if (other.getCircleColor(row, column) != color) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clone!
     */
    , clone: function () {
        return new MisereAtropos(this.sideLength, this.lastPlay, this.filledCircles);
    }

    /**
     * Gets any colors that can't be played adjacent to the two given circle locations.  (Misere version: you can always play any color.)
     */
    , getIllegalColorsNearTwo: function (circleARow, circleAColumn, circleBRow, circleBColumn) {
        return [];
    }

    /**
     * Gets an ordered list of the 6 coordinates around a given point.
     */
    , getNeighboringCoordinates: function (row, column) {
        var neighbors = [];
        neighbors.push([row + 1, column - 1]);
        neighbors.push([row, column - 1]);
        neighbors.push([row - 1, column]);
        neighbors.push([row - 1, column + 1]);
        neighbors.push([row, column + 1]);
        neighbors.push([row + 1, column]);
        return neighbors;
    }

    /**
     * Returns whether a location is surrounded by colored spaces.
     */
    , isSurrounded: function (row, column) {
        var neighbors = this.getNeighboringCoordinates(row, column);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!this.isColored(neighbor[0], neighbor[1])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether the next play is a jump.
     */
    , nextIsJump: function () {
        return this.lastPlay == null || this.isSurrounded(this.lastPlay[0], this.lastPlay[1]);
    }

    /**
     * Gets any colors that can't be played a certain location.  Misere version: there are no illegal colors anymore.
     */
    , getIllegalColorsAt: function (row, column) {
        return [];
    }

    /**
     * Gets any colors that can be played at a location.  Misere version: it just depends on whether a play can be made.
     */
    , getLegalColorsAt: function (row, column) {
        if (this.canPlay()) {
            return [Atropos.prototype.RED, Atropos.prototype.BLUE, Atropos.prototype.YELLOW];
        } else {
            return [];
        }
    }

    //override
    , getOptionsForPlayer: function (playerId) {
        var options = [];
        if (this.canPlay()) {
            if (this.nextIsJump()) {
                for (var row = 1; row < this.sideLength + 2; row++) {
                    for (var column = 1; column < this.sideLength + 2 - row; column++) {
                        var optionsAtLocation = this.getOptionsAt(row, column);
                        options = options.concat(optionsAtLocation);
                    }
                }
            } else {
                //console.log("not a jump");
                options = this.getOptionsAround(this.lastPlay[0], this.lastPlay[1]);
            }
        }
        return options;
    }

    /**
     * Returns a move option with an added circle.  Does not check that this isn't already colored!
     */
    , getOptionWith: function (row, column, color) {
        var clone = this.clone();
        clone.filledCircles.push([row, column, color]);
        clone.lastPlay = [row, column];
        return clone;
    }

    /**
     * Returns the options around a point.
     */
    , getOptionsAround: function (row, column) {
        var options = [];
        var neighbors = this.getNeighboringCoordinates(row, column);
        for (var i = 0; i < neighbors.length; i++) {
            options = options.concat(this.getOptionsAt(neighbors[i][0], neighbors[i][1]));
        }
        return options;
    }

    /**
     * Returns an array of all the options at a specific row and column.
     */
    , getOptionsAt: function (row, column) {
        var options = [];
        if (this.canPlay()) {
            if (!this.isColored(row, column)) {
                var colors = this.getLegalColorsAt(row, column);
                for (var i = 0; i < colors.length; i++) {
                    options.push(this.getOptionWith(row, column, colors[i]));
                }
            }
        }
        return options;
    }

});
//Some Atropos constants
Atropos.prototype.RED = 0;
Atropos.prototype.BLUE = 1;
Atropos.prototype.YELLOW = 2;
Atropos.prototype.UNCOLORED = 3;
//end of MisereAtropos class

/**
 * Launches a new MisereAtropos game.
 */
function newMisereAtroposGame() {
    var viewFactory = new InteractiveAtroposViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardSize').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var game = new MisereAtropos(width);
    var players = [leftPlayer, rightPlayer];
    var ref = new MisereReferee(game, players, viewFactory, "atroposBoard", $('messageBox'), controlForm);
}





















//end of Atropos stuff!




///////////////////////////// Binary Geography ////////////////////////////////

/**
 * Binary Geography, the impartial version.
 * 
 * Grid is stored as a 2D array of booleans.
 * @author Kyle Burke
 */
const BinaryGeography = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (height, width, blackStartColumn, blackStartRow, whiteStartColumn, whiteStartRow) {

        this.EMPTY = 0;
        this.BLACK = 1;
        this.WHITE = -1;
        this.playerNames = ["Left", "Right"];
        if (blackStartColumn == null) {
            blackStartColumn = Math.floor(Math.random() * width);
        }
        if (blackStartRow == null) {
            blackStartRow = Math.floor(Math.random() * height);
        }
        if (whiteStartColumn == null) {
            whiteStartColumn = Math.floor(Math.random() * width);
        }
        if (whiteStartRow == null) {
            whiteStartRow = Math.floor(Math.random() * height);
        }
        while (whiteStartColumn == blackStartColumn && whiteStartRow == blackStartRow) {
            whiteStartColumn = Math.floor(Math.random() * width);
            whiteStartRow = Math.floor(Math.random() * height);
        }

        this.lastBlackColumn = blackStartColumn;
        this.lastBlackRow = blackStartRow;
        this.lastWhiteColumn = whiteStartColumn;
        this.lastWhiteRow = whiteStartRow;

        this.columns = [];
        for (var colI = 0; colI < width; colI++) {
            var column = [];
            for (var rowI = 0; rowI < height; rowI++) {
                column.push(this.EMPTY);
            }
            this.columns.push(column);
        }
        this.columns[blackStartColumn][blackStartRow] = this.BLACK;
        this.columns[whiteStartColumn][whiteStartRow] = this.WHITE;
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            //we're having a bug, so I'm doing extra work here
            const basicHeight = this.columns[0].length;
            for (var i = 0; i < this.columns.length; i++) {
                const columnHeight = this.columns[i].length;
                if (columnHeight != basicHeight) {
                    console.log("Error!  Column " + i + " has the wrong height!");
                    debugPosition = this;
                }
            }
            return basicHeight;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            console.log("failed dimensions");
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    //console.log("Not equal because of space col = " + col + "  row = " + row);
                    return false;
                }
            }
        }
        if (this.lastBlackColumn != other.lastBlackColumn) {
            //console.log("failed black column");
            return false;
        } else if (this.lastBlackRow != other.lastBlackRow) {
            //console.log("failed black row");
            return false;
        } else if (this.lastWhiteColumn != other.lastWhiteColumn) {
            //console.log("failed white column");
            return false;
        } else if (this.lastWhiteRow != other.lastWhiteRow) {
            //console.log("failed white row");
            return false;
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var height = this.getHeight();
        var width = this.getWidth();
        var other = new BinaryGeography(height, width);
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                other.columns[col][row] = this.columns[col][row];
            }
        }
        other.lastBlackColumn = this.lastBlackColumn;
        other.lastBlackRow = this.lastBlackRow;
        other.lastWhiteColumn = this.lastWhiteColumn;
        other.lastWhiteRow = this.lastWhiteRow;
        return other;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = [];
        //options for adding to the black path
        var lastTokens = [[this.lastBlackColumn, this.lastBlackRow], [this.lastWhiteColumn, this.lastWhiteRow]];
        for (var i = 0; i < lastTokens.length; i++) {
            var color = (i * -2) + 1; //to get BLACK or WHITE
            var token = lastTokens[i];
            var col = token[0];
            var row = token[1];
            var nextTokens = [[col - 1, row], [col, row - 1], [col + 1, row], [col, row + 1]];
            for (var j = 0; j < nextTokens.length; j++) {
                var nextToken = nextTokens[j];
                var nextCol = nextToken[0];
                var nextRow = nextToken[1];
                //check to see whether we can add this option
                if (0 <= nextCol && nextCol < this.getWidth() && 0 <= nextRow && nextRow < this.getHeight() && this.columns[nextCol][nextRow] == this.EMPTY) {
                    //we can add this option!  Do it!
                    var option = this.getOption(color, nextCol, nextRow);
                    options.push(option);
                }
            }
        }
        globalParent = this;
        globalOptions = options;
        return options;
    }

    /**
     * Gets the result of a play.  (This is not a required (inheriting) function.)
     */
    , getOption: function (color, column, row) {
        var option = this.clone();
        option.columns[column][row] = color;
        if (color == this.BLACK) {
            option.lastBlackColumn = column;
            option.lastBlackRow = row;
        } else {
            option.lastWhiteColumn = column;
            option.lastWhiteRow = row;
        }
        x = option;
        return option;
    }

}); //end of BinaryGeography class




var InteractiveBinaryGeographyView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const screenWidth = boardSvg.getAttributeNS(null, "width");
        const screenHeight = boardSvg.getAttributeNS(null, "height");
        var boardPixelSize = Math.min(screenWidth, screenHeight);

        var width = this.position.getWidth();
        var height = this.position.getHeight();

        //get some dimensions based on the canvas size
        var maxCircleWidth = (boardPixelSize - 10) / width;
        var maxCircleHeight = (boardPixelSize - 10) / (height);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var boxSide = maxDiameter;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var circle = document.createElementNS(svgNS, "circle");
                circle.setAttributeNS(null, "cx", 5 + Math.floor((colIndex + .5) * boxSide));
                circle.setAttributeNS(null, "cy", 5 + Math.floor((rowIndex + .5) * boxSide));
                circle.setAttributeNS(null, "r", nodeRadius);
                circle.style.stroke = "black";
                circle.style.strokeWidth = 5;
                if ((colIndex == this.position.lastBlackColumn && rowIndex == this.position.lastBlackRow) || (colIndex == this.position.lastWhiteColumn && rowIndex == this.position.lastWhiteRow)) {
                    circle.style.stroke = "green";
                }
                if (this.position.columns[colIndex][rowIndex] == this.position.BLACK) {
                    circle.style.fill = "black";
                } else if (this.position.columns[colIndex][rowIndex] == this.position.WHITE) {
                    circle.style.fill = "white";
                } else {
                    circle.style.fill = "gray";
                    //if this is distance 1 from either of the last plays...
                    if (Math.abs(colIndex - this.position.lastBlackColumn) + Math.abs(rowIndex - this.position.lastBlackRow) == 1 || Math.abs(colIndex - this.position.lastWhiteColumn) + Math.abs(rowIndex - this.position.lastWhiteRow) == 1) {
                        if (listener != undefined) {
                            var player = listener;
                            circle.column = colIndex;
                            circle.row = rowIndex;
                            circle.onclick = function (event) { player.handleClick(event); }
                        }
                    }
                }
                boardSvg.appendChild(circle);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var column = event.target.column;
        var row = event.target.row;
        var blackDistance = Math.abs(column - this.position.lastBlackColumn) + Math.abs(row - this.position.lastBlackRow);
        var whiteDistance = Math.abs(column - this.position.lastWhiteColumn) + Math.abs(row - this.position.lastWhiteRow);
        var nearLastBlack = blackDistance == 1;
        var nearLastWhite = whiteDistance == 1;
        if (nearLastBlack && !nearLastWhite) {
            var chosenOption = this.position.getOption(this.position.BLACK, column, row);
        } else if (!nearLastBlack && nearLastWhite) {
            var chosenOption = this.position.getOption(this.position.WHITE, column, row);
        } else if (nearLastBlack && nearLastWhite) {
            //I don't know how to handle this case yet!
            this.destroyPopup();
            console.log("Clicked!");
            var self = this;
            //create the popup
            this.popup = document.createElement("div");
            var blackButton = document.createElement("button");
            blackButton.appendChild(toNode("Black"));
            blackButton.onclick = function () {
                self.destroyPopup();
                var option = self.position.getOption(self.position.BLACK, column, row);
                player.sendMoveToRef(option);
            };
            this.popup.appendChild(blackButton);

            var whiteButton = document.createElement("button");
            whiteButton.appendChild(toNode("White"));
            whiteButton.onclick = function () {
                self.destroyPopup();
                var option = self.position.getOption(self.position.WHITE, column, row);
                player.sendMoveToRef(option);
            };
            this.popup.appendChild(whiteButton);

            this.popup.style.position = "fixed";
            this.popup.style.display = "block";
            this.popup.style.opacity = 1;
            this.popup.width = Math.min(window.innerWidth / 2, 100);
            this.popup.height = Math.min(window.innerHeight / 2, 50);
            this.popup.style.left = event.clientX + "px";
            this.popup.style.top = event.clientY + "px";
            document.body.appendChild(this.popup);
            return null;
        } else {
            console.log("The click wasn't near either last play!  This shouldn't happen!");
            console.log("Black Distnace: " + blackDistance);
            console.log("column: " + column);
            console.log("lastBlackColumn: " + this.position.lastBlackColumn);
            console.log("White Distance: " + whiteDistance);
        }
        player.sendMoveToRef(chosenOption);
    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }

}); //end of InteractiveBinaryGeographyView class

/**
 * View Factory for BinaryGeography
 */
var InteractiveBinaryGeographyViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveBinaryGeographyView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveBinaryGeographyViewFactory

/**
 * Launches a new BinaryGeography game.
 */
function newBinaryGeographyGame() {
    var viewFactory = new InteractiveBinaryGeographyViewFactory();
    var playDelay = 1000;
    //var playerOptions = getCommonPlayerOptions(viewFactory, playDelay, 1, 5);
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var players = [leftPlayer, rightPlayer];
    var game = new BinaryGeography(height, width);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);

}




///////////////////////////// Blackout ////////////////////////////////

/**
 * Blackout
 * 
 * Grids are stored as two 2D arrays of booleans.  True means that that switch is connected to the affiliated light; false means it is not.
 * Switches are stored a list of integers (columnsPlayed and rowsPlayed).  -1 means unplayed; 0 means turned off; 1 means turned on.
 * Right has some passes they can use after they turn all their switches, so that's modeled by the integer rightPasses.
 * @author Kyle Burke
 */
var Blackout = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (numLights, numAllOffSwitches, numOneOnSwitches, connectedProbability) {
        this.playerNames = Blackout.prototype.PLAYER_NAMES;
        var connectedPr = connectedProbability || .5;
        this.allOffGrid = [];
        for (var i = 0; i < numLights; i++) {
            const column = [];
            for (var j = 0; j < numAllOffSwitches; j++) {
                //add a connection based on the probability
                column.push(Math.random() < connectedPr);
            }
            this.allOffGrid.push(column);
        }
        //check that no switch has no connections
        for (var switchI = 0; switchI < numAllOffSwitches; switchI++) {
            var connected = false;
            for (var lightI = 0; lightI < numLights; lightI++) {
                if (this.allOffGrid[lightI][switchI] == true) {
                    connection = true;
                    break;
                }
            }
            if (!connected) {
                const connIndex = Math.floor(Math.random() * numLights);
                this.allOffGrid[connIndex][switchI] = true;
            }
        }

        this.allOffSwitches = [];
        for (var i = 0; i < numAllOffSwitches; i++) {
            this.allOffSwitches.push(-1); // switch hasn't been used yet.
        }

        this.oneOnGrid = [];
        for (var i = 0; i < numLights; i++) {
            const column = [];
            for (var j = 0; j < numOneOnSwitches; j++) {
                //add a connection based on the probability
                column.push(Math.random() < connectedPr);
            }
            this.oneOnGrid.push(column);
        }
        //check that no switch has no connections
        for (var switchI = 0; switchI < numOneOnSwitches; switchI++) {
            var connected = false;
            for (var lightI = 0; lightI < numLights; lightI++) {
                if (this.oneOnGrid[lightI][switchI] == true) {
                    connection = true;
                    break;
                }
            }
            if (!connected) {
                const connIndex = Math.floor(Math.random() * numLights);
                this.oneOnGrid[connIndex][switchI] = true;
            }
        }

        this.oneOnSwitches = [];
        for (var i = 0; i < numOneOnSwitches; i++) {
            this.oneOnSwitches.push(-1); // switch hasn't been used yet.
        }
        //Right can pass if they are out of light switches, but Left still has switches.
        this.rightPasses = numAllOffSwitches - numOneOnSwitches;
        this.lights = [];
        for (var i = 0; i < numLights; i++) {
            this.lights.push(true);
        }

    }

    /**
     * Returns the number of lights of this board.
     */
    , getNumLights: function () {
        return this.lights.length;
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.lights.length;
    }

    /**
     * Returns the number of switches for the All Off player.
     */
    , getNumAllOffSwitches: function () {
        return this.allOffSwitches.length;
    }

    /**
     * Returns the number of switches for the One On player.
     */
    , getNumOneOnSwitches: function () {
        return this.oneOnSwitches.length;
    }

    /**
     * Returns the height of this board.  This is the number of total switches.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.allOffSwitches.length + this.oneOnSwitches.length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (!omniEquals(this.allOffGrid, other.allOffGrid)) return false;
        if (!omniEquals(this.allOffSwitches, other.allOffSwitches)) return false;
        if (!omniEquals(this.oneOnGrid, other.oneOnGrid)) return false;
        if (!omniEquals(this.oneOnSwitches, other.oneOnSwitches)) return false;
        if (!omniEquals(this.lights, other.lights)) return false;

        return this.rightPasses == other.rightPasses;
    }

    /**
     * Clone.
     */
    , clone: function () {
        const width = this.getNumLights();
        const numAllOffSwitches = this.getNumAllOffSwitches();
        const numOneOnSwitches = this.getNumOneOnSwitches();
        const other = new Blackout(width, numAllOffSwitches, numOneOnSwitches);
        for (var col = 0; col < width; col++) {
            other.lights[col] = this.lights[col];
            for (var row = 0; row < numAllOffSwitches; row++) {
                other.allOffGrid[col][row] = this.allOffGrid[col][row];
            }
            for (var row = 0; row < numOneOnSwitches; row++) {
                other.oneOnGrid[col][row] = this.oneOnGrid[col][row];
            }
        }
        for (var row = 0; row < numAllOffSwitches; row++) {
            other.allOffSwitches[row] = this.allOffSwitches[row];
        }
        for (var row = 0; row < numOneOnSwitches; row++) {
            other.oneOnSwitches[row] = this.oneOnSwitches[row];
        }
        other.rightPasses = this.rightPasses;
        return other;
    }

    /**
     * Returns whether the board is blacked out, meaning all lights are off.
     */
    , isBlackout: function () {
        for (var col = 0; col < this.getNumLights(); col++) {
            if (this.lights[col]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const options = [];
        const numLights = this.getNumLights();
        //we need to have explicit different parts for Left and Right
        if (playerId == CombinatorialGame.prototype.LEFT) {
            //generate the AllOff player's options
            const numAllOffSwitches = this.getNumAllOffSwitches();
            for (var row = 0; row < numAllOffSwitches; row++) {
                if (this.allOffSwitches[row] == -1) {
                    //add the zero option
                    const zeroOption = this.clone();
                    zeroOption.allOffSwitches[row] = 0;
                    options.push(zeroOption);

                    //add the one option that changes all lights connected to that switch
                    const oneOption = this.clone();
                    oneOption.allOffSwitches[row] = 1;
                    for (var col = 0; col < numLights; col++) {
                        if (this.allOffGrid[col][row]) {
                            //the row-th switch is connected to the col-th light, so toggle that light
                            oneOption.lights[col] = !oneOption.lights[col];
                        }
                    }
                    options.push(oneOption);
                }
            }
        } else if (playerId == CombinatorialGame.prototype.RIGHT) {
            const numOneOnSwitches = this.getNumOneOnSwitches();
            for (var row = 0; row < numOneOnSwitches; row++) {
                if (this.oneOnSwitches[row] == -1) {
                    //add the zero option
                    const zeroOption = this.clone();
                    zeroOption.oneOnSwitches[row] = 0;
                    options.push(zeroOption);

                    //add the one option that flips all lights connected to that switch
                    const oneOption = this.clone();
                    oneOption.oneOnSwitches[row] = 1;
                    for (var col = 0; col < numLights; col++) {
                        if (this.oneOnGrid[col][row]) {
                            //the row-th switch is connected to the col-th light, so toggle that light
                            oneOption.lights[col] = !oneOption.lights[col];
                        }
                    }
                    options.push(oneOption);
                }
            }
            //if the One On player has run out of switches and it's not a blackout, they can use one of their passes.
            if (options.length == 0) {
                //we get to use a pass if it's not a blackout.
                if (this.rightPasses > 0 && !this.isBlackout()) {
                    const option = this.clone();
                    option.rightPasses -= 1;
                    options.push(option);
                }
            }

        }
        return options;
    }

    /**
     * Returns whether Right has chosen settings for all of their switches.
     */
    , allRightSwitchesFlipped: function () {
        const n = this.getNumOneOnSwitches();
        for (var i = 0; i < n; i++) {
            if (this.oneOnSwitches[i] == -1) return false;
        }
        return true;
    }

    /**
     * Returns the pass option, if one exists.  Returns undefined otherwise.
     */
    , optionFromPass: function () {
        if (this.allRightSwitchesFlipped() && !this.isBlackout() && this.rightPasses > 0) {
            const option = this.clone();
            option.rightPasses -= 1;
            return option;
        }
    }

    /**
     * Gets the result of a play.  (This is not a required (inheriting) function.)  It assumes that the play is a legal one and does not validate the parameters.
     */
    , getOption: function (playerId, row, switchOn) {
        console.log("Getting option: " + playerId + ", " + row + ", " + switchOn);
        const option = this.clone();
        const onNumber = switchOn ? 1 : 0;

        //choose the appropriate grid and switches to modify
        const switches = playerId == CombinatorialGame.prototype.LEFT ? option.allOffSwitches : option.oneOnSwitches;
        const grid = playerId == CombinatorialGame.prototype.LEFT ? option.allOffGrid : option.oneOnGrid;
        switches[row] = onNumber;
        if (switchOn) {
            for (var col = 0; col < this.getWidth(); col++) {
                if (grid[col][row]) {
                    //the row-th switch is connected to the col-th light, so let's flip it.
                    option.lights[col] = !option.lights[col];
                }
            }
        }
        return option;
    }

}); //end of Blackout class
Blackout.prototype.PLAYER_NAMES = ["AllOff", "OneOn"];



var InteractiveBlackoutView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Returns the index of the last 1 in a row of a 2-D array indexed first by columns.  Returns a -1 if it's not in there.
     */
    , lastOneIn2D: function (array, rowIndex) {
        for (var col = array.length - 1; col > -1; col--) {
            if (array[col][rowIndex] == 1) {
                return col;
            }
        }
        return col;
    }

    /**
     * Returns the index of the first 1 in an array.
     */
    , firstOne: function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == 1) {
                return i;
            }
        }
        return i;
    }

    /**
     * Returns the index of the last 1 in an array.
     */
    , lastOne: function (array) {
        for (var i = array.length - 1; i > -1; i--) {
            if (array[i] == 1) {
                return i;
            }
        }
        return i;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const screenWidth = boardSvg.getAttributeNS(null, "width");
        const screenHeight = boardSvg.getAttributeNS(null, "height");
        var boardPixelSize = Math.min(screenWidth, screenHeight);

        //calculate the dimensions
        var width = this.position.getWidth() + 1; //one more for the switches
        var height = this.position.getHeight() + 1; //one more for the lights

        //get some dimensions based on the canvas size
        const padding = 2;
        var maxBoxWidth = (boardPixelSize - 10) / (width + 1);
        var maxBoxHeight = (boardPixelSize - 10) / (height + 1);
        var maxBoxSide = Math.floor(Math.min(maxBoxWidth, maxBoxHeight));
        //console.log("maxBoxSide: " + maxBoxSide);
        //console.log("width: " + width);
        //console.log("height: " + height);

        const lightColors = ["black", "yellow", "gray"];

        const switchColors = ["red", "green"];

        //draw the board
        //draw the switches along the left hand side
        var row = 0;
        //first the All Off player's switches
        for (; row < this.position.getNumAllOffSwitches(); row++) {
            if (this.position.allOffSwitches[row] == -1) {
                var onRect = document.createElementNS(svgNS, "rect");
                onRect.setAttributeNS(null, "x", padding);
                onRect.setAttributeNS(null, "y", padding + (row * maxBoxSide));
                onRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                onRect.setAttributeNS(null, "height", Math.floor(maxBoxSide / 2) - padding);
                onRect.style.stroke = "black";
                onRect.style.fill = switchColors[1];
                boardSvg.appendChild(onRect);
                if (listener != undefined) {
                    onRect.playerId = CombinatorialGame.prototype.LEFT;
                    onRect.index = row;
                    onRect.toggle = true;
                    var player = listener;
                    onRect.onclick = function (event) { player.handleClick(event); }
                }

                var offRect = document.createElementNS(svgNS, "rect");
                offRect.setAttributeNS(null, "x", padding);
                offRect.setAttributeNS(null, "y", Math.floor((row + .5) * maxBoxSide));
                offRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                offRect.setAttributeNS(null, "height", Math.floor(maxBoxSide / 2) - padding);
                offRect.style.stroke = "black";
                offRect.style.fill = switchColors[0];
                boardSvg.appendChild(offRect);
                if (listener != undefined) {
                    offRect.playerId = CombinatorialGame.prototype.LEFT;
                    offRect.index = row;
                    offRect.toggle = false;
                    var player = listener;
                    offRect.onclick = function (event) { player.handleClick(event); }
                }
            } else {
                var playedRect = document.createElementNS(svgNS, "rect");
                playedRect.setAttributeNS(null, "x", padding);
                playedRect.setAttributeNS(null, "y", padding + (row * maxBoxSide));
                playedRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                playedRect.setAttributeNS(null, "height", maxBoxSide - 2 * padding);
                playedRect.style.stroke = "black";
                playedRect.style.fill = switchColors[this.position.allOffSwitches[row]];
                boardSvg.appendChild(playedRect);
            }
        }

        row++; //no switches in the row where the lights are 

        //now the One On player's switches
        for (; row < height; row++) {
            const oneOnSwitchIndex = row - (1 + this.position.getNumAllOffSwitches());
            if (this.position.oneOnSwitches[oneOnSwitchIndex] == -1) {
                var onRect = document.createElementNS(svgNS, "rect");
                onRect.setAttributeNS(null, "x", padding);
                onRect.setAttributeNS(null, "y", padding + (row * maxBoxSide));
                onRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                onRect.setAttributeNS(null, "height", Math.floor(maxBoxSide / 2) - padding);
                onRect.style.stroke = "black";
                onRect.style.fill = switchColors[1];
                boardSvg.appendChild(onRect);
                if (listener != undefined) {
                    onRect.playerId = CombinatorialGame.prototype.RIGHT;
                    onRect.index = oneOnSwitchIndex;
                    onRect.toggle = true;
                    onRect.func = "switch";
                    var player = listener;
                    onRect.onclick = function (event) { player.handleClick(event); }
                }

                var offRect = document.createElementNS(svgNS, "rect");
                offRect.setAttributeNS(null, "x", padding);
                offRect.setAttributeNS(null, "y", Math.floor((row + .5) * maxBoxSide));
                offRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                offRect.setAttributeNS(null, "height", Math.floor(maxBoxSide / 2) - padding);
                offRect.style.stroke = "black";
                offRect.style.fill = switchColors[0];
                boardSvg.appendChild(offRect);
                if (listener != undefined) {
                    offRect.playerId = CombinatorialGame.prototype.RIGHT;
                    offRect.index = oneOnSwitchIndex;
                    offRect.toggle = false;
                    offRect.func = "switch";
                    var player = listener;
                    offRect.onclick = function (event) { player.handleClick(event); }
                }
            } else {
                var playedRect = document.createElementNS(svgNS, "rect");
                playedRect.setAttributeNS(null, "x", padding);
                playedRect.setAttributeNS(null, "y", padding + (row * maxBoxSide));
                playedRect.setAttributeNS(null, "width", maxBoxSide - 2 * padding);
                playedRect.setAttributeNS(null, "height", maxBoxSide - 2 * padding);
                playedRect.style.stroke = "black";
                playedRect.style.fill = switchColors[this.position.oneOnSwitches[oneOnSwitchIndex]];
                boardSvg.appendChild(playedRect);
            }
        }


        //now the columns that contain lights
        for (var col = 1; col < width; col++) {
            const lightIndex = col - 1;
            //do the top grid first
            var row = 0;
            const rowOfFirstDot = this.firstOne(this.position.allOffGrid[lightIndex]);
            for (; row < this.position.getNumAllOffSwitches(); row++) {
                const wireColor = this.position.allOffSwitches[row] == -1 ? "black" : "gray";
                //draw the wire coming off the switch if it still exists here
                const columnOfLastDot = 1 + this.lastOneIn2D(this.position.allOffGrid, row);
                //add the column wire, if we should
                if (row >= rowOfFirstDot) {
                    const columnWire = document.createElementNS(svgNS, "line");
                    columnWire.setAttributeNS(null, "x1", (col + .5) * maxBoxSide);
                    columnWire.setAttributeNS(null, "x2", (col + .5) * maxBoxSide);
                    columnWire.setAttributeNS(null, "y1", row * maxBoxSide);
                    columnWire.setAttributeNS(null, "y2", (row + 1) * maxBoxSide);
                    columnWire.style.stroke = "black";
                    if (row == rowOfFirstDot) {
                        columnWire.setAttributeNS(null, "y1", (row + .5) * maxBoxSide);
                    }
                    boardSvg.appendChild(columnWire);
                }
                if (col <= columnOfLastDot) {
                    const wire = document.createElementNS(svgNS, "line");
                    wire.setAttributeNS(null, "x1", col * maxBoxSide);
                    wire.setAttributeNS(null, "x2", (col + 1) * maxBoxSide);
                    wire.setAttributeNS(null, "y1", Math.floor((row + .5) * maxBoxSide));
                    wire.setAttributeNS(null, "y2", Math.floor((row + .5) * maxBoxSide));
                    wire.style.stroke = wireColor; //"black";
                    if (col == columnOfLastDot) {
                        wire.setAttributeNS(null, "x2", (col + .5) * maxBoxSide);
                    }
                    boardSvg.appendChild(wire);
                }
                if (this.position.allOffGrid[lightIndex][row]) {
                    const dot = document.createElementNS(svgNS, "circle");
                    dot.setAttributeNS(null, "cx", Math.floor((col + .5) * maxBoxSide));
                    dot.setAttributeNS(null, "cy", Math.floor((row + .5) * maxBoxSide));
                    dot.setAttributeNS(null, "r", Math.floor(maxBoxSide / 4));
                    dot.style.stroke = wireColor; //"black";
                    dot.style.fill = wireColor; //"black";
                    boardSvg.appendChild(dot);
                }
            }

            //now the light, which is just a circle and a wire going through it
            const lightWires = document.createElementNS(svgNS, "line");
            lightWires.setAttributeNS(null, "x1", (col + .5) * maxBoxSide);
            lightWires.setAttributeNS(null, "x2", (col + .5) * maxBoxSide);
            lightWires.setAttributeNS(null, "y1", row * maxBoxSide);
            lightWires.setAttributeNS(null, "y2", (row + 1) * maxBoxSide);
            lightWires.style.stroke = "black";
            boardSvg.appendChild(lightWires);
            const light = document.createElementNS(svgNS, "circle");
            light.setAttributeNS(null, "cx", Math.floor((col + .5) * maxBoxSide));
            light.setAttributeNS(null, "cy", Math.floor((row + .5) * maxBoxSide));
            light.setAttributeNS(null, "r", Math.floor(maxBoxSide / 2) - padding);
            light.style.stroke = "black";
            if (this.position.lights[lightIndex]) {
                light.style.fill = "yellow";
            } else {
                light.style.fill = "black";
            }
            boardSvg.appendChild(light);


            row++;
            //now the bottom grid
            const rowOfLastDot = this.lastOne(this.position.oneOnGrid[lightIndex]);
            for (; row < height; row++) {
                //draw the wire coming off the switch
                const oneOnSwitchIndex = row - (1 + this.position.getNumAllOffSwitches());
                const columnOfLastDot = 1 + this.lastOneIn2D(this.position.oneOnGrid, oneOnSwitchIndex);
                const wireColor = this.position.oneOnSwitches[oneOnSwitchIndex] == -1 ? "black" : "gray";
                //add the column wire, if we should
                if (oneOnSwitchIndex <= rowOfLastDot) {
                    const columnWire = document.createElementNS(svgNS, "line");
                    columnWire.setAttributeNS(null, "x1", (col + .5) * maxBoxSide);
                    columnWire.setAttributeNS(null, "x2", (col + .5) * maxBoxSide);
                    columnWire.setAttributeNS(null, "y1", row * maxBoxSide);
                    columnWire.setAttributeNS(null, "y2", (row + 1) * maxBoxSide);
                    columnWire.style.stroke = "black";
                    if (oneOnSwitchIndex == rowOfLastDot) {
                        columnWire.setAttributeNS(null, "y2", (row + .5) * maxBoxSide);
                    }
                    boardSvg.appendChild(columnWire);
                }
                if (col <= columnOfLastDot) {
                    const wire = document.createElementNS(svgNS, "line");
                    wire.setAttributeNS(null, "x1", col * maxBoxSide);
                    wire.setAttributeNS(null, "x2", (col + 1) * maxBoxSide);
                    if (col == columnOfLastDot) {
                        wire.setAttributeNS(null, "x2", (col + .5) * maxBoxSide);
                    }
                    wire.setAttributeNS(null, "y1", Math.floor((row + .5) * maxBoxSide));
                    wire.setAttributeNS(null, "y2", Math.floor((row + .5) * maxBoxSide));
                    wire.style.stroke = wireColor; //"black";
                    boardSvg.appendChild(wire);
                }
                if (this.position.oneOnGrid[lightIndex][oneOnSwitchIndex]) {
                    const dot = document.createElementNS(svgNS, "circle");
                    dot.setAttributeNS(null, "cx", Math.floor((col + .5) * maxBoxSide));
                    dot.setAttributeNS(null, "cy", Math.floor((row + .5) * maxBoxSide));
                    dot.setAttributeNS(null, "r", Math.floor(maxBoxSide / 4));
                    dot.style.stroke = wireColor; //"black";
                    dot.style.fill = wireColor; //"black";
                    boardSvg.appendChild(dot);
                }
            }


        }
        //now draw the box for the Right player to click to pass, if they are able to
        if (this.position.allRightSwitchesFlipped() && this.position.rightPasses > 0) {
            const canPass = !(this.position.isBlackout() || this.position.rightPasses <= 0);
            const color = !canPass ? "gray" : "red";
            const passBox = document.createElementNS(svgNS, "rect");
            passBox.setAttributeNS(null, "x", maxBoxSide);
            passBox.setAttributeNS(null, "y", (height) * maxBoxSide);
            passBox.setAttributeNS(null, "width", 2 * maxBoxSide);
            passBox.setAttributeNS(null, "height", .8 * maxBoxSide);
            passBox.style.stroke = color;
            passBox.style.fill = "white";
            boardSvg.appendChild(passBox);
            const textBuffer = Math.ceil(.17 * maxBoxSide);
            const textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", maxBoxSide + textBuffer);//+ 20);
            textElement.setAttributeNS(null, "y", (height + .8) * maxBoxSide - textBuffer);//+ 20);
            var textSize = Math.ceil(.45 * maxBoxSide);
            //textElement.setAttributeNS(null, "color", textColor);
            textElement.style.fill = color;
            textElement.textContent = "Pass x" + this.position.rightPasses
            if (this.position.isBlackout()) {
                textElement.textContent = "Blackout!";
                textSize = Math.ceil(.33 * maxBoxSide);
            }
            textElement.setAttributeNS(null, "font-size", textSize);
            boardSvg.appendChild(textElement);
            if (canPass & listener != undefined) {
                passBox.func = "pass";
                var player = listener;
                passBox.onclick = function (event) { player.handleClick(event); }
                textElement.func = "pass";
                textElement.onclick = function (event) { player.handleClick(event); }
            }

        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        if (event.target.func == "pass") {
            const option = this.position.optionFromPass();
            player.sendMoveToRef(option);
            return;
        }
        const switchClicked = event.target;
        const playerId = switchClicked.playerId;
        if (playerId == currentPlayer) {
            const index = switchClicked.index;
            const toggle = switchClicked.toggle;
            var chosenOption = this.position.getOption(currentPlayer, index, toggle);
            player.sendMoveToRef(chosenOption);
        }
    }

}); //end of InteractiveBlackoutView class


/**
 * View Factory for Blackout
 */
var InteractiveBlackoutViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveBlackoutView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveBlackoutViewFactory

/**
 * Launches a new Blackout game.
 */
function newBlackoutGame() {
    var viewFactory = new InteractiveBlackoutViewFactory();
    var playDelay = 1000;
    var playerOptions = getCommonPlayerOptions(viewFactory, playDelay, 1, 5);
    const numAllOffSwitches = parseInt($('numAllOffSwitches').value);
    const numLights = parseInt($('numLights').value);
    const numOneOnSwitches = parseInt($('numOneOnSwitches').value);
    var controlForm = $('gameOptions');
    var game = new Blackout(numLights, numAllOffSwitches, numOneOnSwitches);
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var players = [leftPlayer, rightPlayer];
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
}

///////////////////////// End of Blackout





/////////////////////////////// Boolean Formula

/**
 * Boolean Formula position, a la Quantified Boolean Formulas and QSAT.
 * 
 * Consists of an array of booleans (for chosen values of variables) and a list (formula) of lists (clauses) of integer-boolean pairs (variable index and sign).
 */
const BooleanFormula = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (numVariables, numClauses, minClauseSize, maxClauseSize) {
        this.playerNames = BooleanFormula.prototype.PLAYER_NAMES;
        minClauseSize = Math.max(1, minClauseSize);
        maxClauseSize = Math.max(minClauseSize, maxClauseSize);
        maxClauseSize = Math.min(numVariables, maxClauseSize);
        this.variables = [];
        for (var i = 0; i < numVariables; i++) {
            this.variables.push(null);
        }
        this.clauses = [];
        while (this.clauses.length < numClauses) {
            const clause = [];
            //build the clause
            const clauseSize = minClauseSize + Math.floor(Math.random() * (maxClauseSize + 1 - minClauseSize));
            //we don't want to repeat a literal in a clause, so we're going to make a list of variables to pick from
            const trueFalse = [true, false];
            const variableOptions = [];
            for (var i = 0; i < this.variables.length; i++) {
                variableOptions.push(i);
            }
            for (var i = 0; i < clauseSize; i++) {
                //add a literal to the clause
                //first, pick the literal
                var variableIndex = -1;
                var indexIntoVarOptions = -1;
                //check that the first index is even
                while ((variableIndex < 0) || (i == 0 && (variableIndex % 2 != 0))) {
                    indexIntoVarOptions = Math.floor(Math.random() * variableOptions.length);
                    variableIndex = variableOptions[indexIntoVarOptions];
                }
                //fix the list of variable options to remove that one.
                variableOptions.splice(indexIntoVarOptions, 1);

                var literalSign = trueFalse[Math.floor(Math.random() * 2)];
                if (variableIndex % 2 == 0) {
                    //even, so let's see if the literal already exists and only has one sign so far.
                    var count = 0;
                    var prevSign = true;
                    for (var clauseI = 0; clauseI < this.clauses.length; clauseI++) {
                        const innerClause = this.clauses[clauseI];
                        for (var literalI = 0; literalI < innerClause.length; literalI++) {
                            if (innerClause[literalI][0] == variableIndex) {
                                count += 1;
                                prevSign = innerClause[literalI][1];
                            }
                        }
                    }

                    if (count == 1) {
                        literalSign = !prevSign;
                    }
                }

                clause.push([variableIndex, literalSign]);

            }
            clause.sort();
            this.clauses.push(clause);
            this.clauses.sort();
            for (var i = 0; i < this.clauses.length - 1;) {
                //check if clause[i] == clause[i+1].  If so, delete the second one.
                const clauseA = this.clauses[i];
                const clauseB = this.clauses[i + 1];
                var clausesEqual = true; //might change
                if (clauseA.length == clauseB.length) {
                    for (var j = 0; j < clauseA.length; j++) {
                        if (clauseA[j][0] != clauseB[j][0] ||
                            clauseA[j][1] != clauseB[j][1]) {

                            clausesEqual = false;
                            break;
                        }
                    }
                } else {
                    clausesEqual = false;
                }
                if (clausesEqual) {
                    //delete the i+1th clause (and don't advance)
                    this.clauses.splice(i + 1, 1);
                    console.log("Just deleted a clause!");
                } else {
                    //didn't need to delete, so move to the next element
                    i++;
                }
            }
        }
    }

    /**
     * Returns the number of clauses.
     */
    , getNumClauses: function () {
        return this.clauses.length;
    }

    /**
     * Returns the number of variables.
     */
    , getNumVariables: function () {
        return this.variables.length;
    }

    /**
     * Returns the turn number.
     */
    , getTurnNumber: function () {
        for (var i = 0; i < this.variables.length; i++) {
            if (this.variables[i] == null) {
                return i;
            }
        }
        return this.variables.length;
    }

    /**
     * Returns the value of a clause so far as a string.  "true": it evaluates concretely to true; "false": it evaluates concretely to false; "undecided": the game is not yet done.
     */
    , evaluateClause: function (i) {
        const clause = this.clauses[i];
        var numFalseLiterals = 0;
        for (var j = 0; j < clause.length; j++) {
            const literalIndex = clause[j][0];
            const sign = clause[j][1];
            if (this.variables[literalIndex] != null) {
                //literal has a value
                if (this.variables[literalIndex] == sign) {
                    return "true";
                } else {
                    numFalseLiterals++;
                }
            }
        }
        if (numFalseLiterals == clause.length) {
            return "false";
        } else {
            return "undecided";
        }
    }

    /**
     * Returns the value of the formula so far as a string.  "true": it evaluates concretely to true; "false": it evaluates concretely to false; "undecided": the game is not yet done.
     */
    , evaluateFormula: function () {
        var numTrueClauses = 0;
        for (var i = 0; i < this.clauses.length; i++) {
            const clauseValue = this.evaluateClause(i);
            if (clauseValue == "true") {
                numTrueClauses++;
            } else if (clauseValue == "false") {
                return "false";
            }
        }
        if (numTrueClauses == this.clauses.length) {
            return "true";
        } else {
            return "undecided";
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the fields are equal
        if (!omniEquals(this.variables, other.variables)) return false;
        if (!omniEquals(this.clauses, other.clauses)) return false;
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        const numVariables = this.getNumVariables();
        const numClauses = this.getNumClauses();
        const other = new BooleanFormula(numVariables, numClauses, 0, 0);
        other.clauses = this.clauses;
        for (var i = 0; i < this.variables.length; i++) {
            other.variables[i] = this.variables[i];
        }
        return other;
    }

    /**
     * Returns the true option for the next player, setting the next variable to be true.  Does not check whether that is a legal option.
     */
    , getTrueOption: function () {
        const turnNumber = this.getTurnNumber();
        const trueOption = this.clone();
        trueOption.variables[turnNumber] = true;
        return trueOption;
    }

    /**
     * Returns whether a player has the true option.
     */
    , canChooseTrue: function (playerId) {
        const trueFalse = ["true", "false"];
        const option = this.getTrueOption();
        const optionValue = option.evaluateFormula();
        return optionValue != trueFalse[1 - playerId];
    }

    /**
     * Returns the false option for the next player, setting the next variable to be false.  Does not check whether this is a legal move!
     */
    , getFalseOption: function () {
        const turnNumber = this.getTurnNumber();
        const falseOption = this.clone();
        falseOption.variables[turnNumber] = false;
        return falseOption;
    }

    /**
     * Returns whether a player has the false option.
     */
    , canChooseFalse: function (playerId) {
        const trueFalse = ["true", "false"];
        const option = this.getFalseOption();
        const optionValue = option.evaluateFormula();
        return optionValue != trueFalse[1 - playerId];
    }

    /**
     * getOptionsForPlayer
     */
    , getOptionsForPlayer: function (playerId) {
        const formulaValue = this.evaluateFormula();
        const trueFalse = ["true", "false"];
        const options = [];
        if (formulaValue == trueFalse[1 - playerId]) {
            //the formula evaluates to the other player's victory, so this player cannot move!
            return options;
        } else {
            const turnNumber = this.getTurnNumber();
            //generate the two options; add them if they're legal moves
            const trueOption = this.clone();
            trueOption.variables[turnNumber] = true;
            const trueOptionValue = trueOption.evaluateFormula();
            if (trueOptionValue != trueFalse[1 - playerId]) {
                options.push(trueOption);
            }

            const falseOption = this.clone();
            falseOption.variables[turnNumber] = false;
            const falseOptionValue = falseOption.evaluateFormula();
            if (falseOptionValue != trueFalse[1 - playerId]) {
                options.push(falseOption);
            }
            return options;
        }
    }
}); //end of BooleanFormula
BooleanFormula.prototype.PLAYER_NAMES = ["True", "False"];



const InteractiveBooleanFormulaView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //console.log("drawing...");
        //console.log(this.position.clauses);
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const screenWidth = boardSvg.getAttributeNS(null, "width");
        const screenHeight = boardSvg.getAttributeNS(null, "height");
        const spaceWidth = screenWidth;
        //console.log("innerWidth:" + window.innerWidth);
        //console.log("spaceWidth:" + spaceWidth);
        //const boardPixelSize = Math.min(window.innerHeight, spaceWidth);
        const boardPixelSize = spaceWidth;
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100

        //calculate the number of characters in the formula
        var numFormulaCharacters = this.position.getNumClauses() * 4 - 2;
        for (var i = 0; i < this.position.clauses.length; i++) {
            const clause = this.position.clauses[i];
            numFormulaCharacters += (clause.length * 2 - 1);
        }
        const width = numFormulaCharacters; //one more for the switches
        const height = 5;


        //get some dimensions based on the canvas size
        const padding = 2;
        var maxBoxWidth = (boardPixelSize - 10) / (width + 1);
        var maxBoxHeight = (boardPixelSize - 10) / (height + 1);
        var maxBoxSide = Math.floor(Math.min(maxBoxWidth, maxBoxHeight));
        //console.log("maxBoxSide: " + maxBoxSide);
        //console.log("width: " + width);
        //console.log("height: " + height);

        const boxSide = .7 * maxBoxSide;
        const textBuffer = Math.ceil(.17 * boxSide);
        const textSize = Math.ceil(1.8 * boxSide);

        //draw the board
        var textElement;

        //first draw the formula
        var row = 1;
        var cursor = 0; //the current index into the string we're printing.
        for (var i = 0; i < this.position.clauses.length; i++) {
            const clauseValue = this.position.evaluateClause(i);
            const clause = this.position.clauses[i];
            const boxStartCursor = cursor;
            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.textContent = "(";
            cursor += textElement.textContent.length;
            boardSvg.appendChild(textElement);
            for (var j = 0; j < clause.length; j++) {
                //draw the internals of the clause
                //draw the x and the not if applicable
                textElement = document.createElementNS(svgNS, "text");
                textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
                textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
                textElement.setAttributeNS(null, "font-size", textSize * 1.3);
                textElement.textContent = "x";
                boardSvg.appendChild(textElement);
                if (!clause[j][1]) {
                    //if the sign is negative, draw the bar above as the not 
                    textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
                    textElement.setAttributeNS(null, "y", 2 * row * boxSide - .5 * textBuffer - .75 * boxSide);
                    textElement.setAttributeNS(null, "font-size", 2.0 * textSize);
                    textElement.textContent = "-";
                    boardSvg.appendChild(textElement);
                }
                cursor += textElement.textContent.length;

                //now draw the index
                const literalIndex = clause[j][0];
                textElement = document.createElementNS(svgNS, "text");
                textElement.setAttributeNS(null, "x", cursor * boxSide + 2.75 * textBuffer);
                textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer + .5 * boxSide);
                textElement.setAttributeNS(null, "font-size", textSize / 1.5);
                textElement.textContent = String(literalIndex);
                boardSvg.appendChild(textElement);
                cursor += textElement.textContent.length;

                //draw the box, if necessary
                if (this.position.variables[literalIndex] != null && clauseValue == "undecided") {
                    const varBox = document.createElementNS(svgNS, "rect");
                    varBox.setAttributeNS(null, "x", (cursor - 2) * boxSide + 1);
                    varBox.setAttributeNS(null, "y", 2 * (row - 1) * boxSide + 1 - 0 * textBuffer);
                    varBox.setAttributeNS(null, "width", 2.3 * boxSide);
                    varBox.setAttributeNS(null, "height", 2.5 * boxSide);
                    varBox.style.fill = "transparent";
                    varBox.style.stroke = "red";
                    if (this.position.variables[literalIndex] == clause[j][1]) {
                        varBox.style.stroke = "blue";
                        //this should never happen
                        console.log("Shouldn't happen!!!");
                    }
                    boardSvg.appendChild(varBox);
                }

                //now move to the next clause variable
                if (j < clause.length - 1) {
                    textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
                    textElement.setAttributeNS(null, "y", 2 * (row - .15) * boxSide - textBuffer);
                    textElement.setAttributeNS(null, "font-size", textSize / 2);
                    textElement.textContent = "or";
                    boardSvg.appendChild(textElement);
                    cursor += 1;
                }


            }

            if (clauseValue != "undecided") {
                const clauseBox = document.createElementNS(svgNS, "rect");
                clauseBox.setAttributeNS(null, "x", boxStartCursor * boxSide + 1);
                clauseBox.setAttributeNS(null, "y", 2 * (row - 1) * boxSide + 1 - 0 * textBuffer);
                clauseBox.setAttributeNS(null, "width", (cursor + 1 - boxStartCursor) * boxSide);
                clauseBox.setAttributeNS(null, "height", 2.5 * boxSide);
                clauseBox.style.fill = "transparent";
                clauseBox.style.stroke = "blue";
                if (clauseValue == "false") {
                    clauseBox.style.stroke = "red";
                }
                boardSvg.appendChild(clauseBox);
            }
            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.textContent = ")";
            cursor += textElement.textContent.length;
            boardSvg.appendChild(textElement);


            if (i < this.position.clauses.length - 1) {
                textElement = document.createElementNS(svgNS, "text");
                textElement.setAttributeNS(null, "x", cursor * boxSide + textBuffer);
                textElement.setAttributeNS(null, "y", 2 * (row - .15) * boxSide - textBuffer);
                textElement.setAttributeNS(null, "font-size", textSize / 2);
                textElement.textContent = "and";
                boardSvg.appendChild(textElement);
                cursor += 2;
            }

        }

        //now draw the list of variables
        console.log(this.position.variables);
        row += 2;

        textElement = document.createElementNS(svgNS, "text");
        textElement.setAttributeNS(null, "x", textBuffer);
        textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
        textElement.setAttributeNS(null, "font-size", textSize);
        textElement.textContent = "Variable:";
        boardSvg.appendChild(textElement);

        for (var i = 0; i < this.position.getNumVariables(); i++) {
            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", (i + 2.5) * boxSide * 4 + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.textContent = "x";
            boardSvg.appendChild(textElement);
            //now the index
            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", (i + 2.8) * boxSide * 4 + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer + .5 * boxSide);
            textElement.setAttributeNS(null, "font-size", textSize / 1.5);
            textElement.textContent = String(i);
            boardSvg.appendChild(textElement);
        }

        row += 1.5;

        textElement = document.createElementNS(svgNS, "text");
        textElement.setAttributeNS(null, "x", textBuffer);
        textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
        textElement.setAttributeNS(null, "font-size", textSize);
        textElement.textContent = "Value:";
        boardSvg.appendChild(textElement);

        const turnNumber = this.position.getTurnNumber()

        for (var i = 0; i < turnNumber; i++) {
            //convert the boolean to a single character
            const stringValue = String(this.position.variables[i]).toUpperCase().charAt(0);
            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", (i + 2.5) * boxSide * 4 + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.textContent = stringValue;
            boardSvg.appendChild(textElement);
        }

        if (turnNumber < this.position.getNumVariables()) {
            //true option "button"
            var boxButton = document.createElementNS(svgNS, "rect");
            boxButton.setAttributeNS(null, "x", (turnNumber + 2.3) * boxSide * 4);
            boxButton.setAttributeNS(null, "y", 2 * (row - 1) * boxSide - 0 * textBuffer);
            boxButton.setAttributeNS(null, "width", 1.6 * boxSide);
            boxButton.setAttributeNS(null, "height", 2.5 * boxSide);
            boxButton.style.fill = "transparent";
            boxButton.style.stroke = "blue";
            boardSvg.appendChild(boxButton);

            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", (turnNumber + 2.3) * boxSide * 4 + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.style.fill = "blue";
            textElement.textContent = "T";
            boardSvg.appendChild(textElement);
            if (listener != undefined) {
                var player = listener;
                textElement.onclick = function (event) { player.handleClick(event); };
                boxButton.onclick = function (event) { player.handleClick(event); };
            }

            //false option "button"
            boxButton = document.createElementNS(svgNS, "rect");
            boxButton.setAttributeNS(null, "x", (turnNumber + 2.72) * boxSide * 4);
            boxButton.setAttributeNS(null, "y", 2 * (row - 1) * boxSide - 0 * textBuffer);
            boxButton.setAttributeNS(null, "width", 1.6 * boxSide);
            boxButton.setAttributeNS(null, "height", 2.5 * boxSide);
            boxButton.style.fill = "transparent";
            boxButton.style.stroke = "red";
            boardSvg.appendChild(boxButton);

            textElement = document.createElementNS(svgNS, "text");
            textElement.setAttributeNS(null, "x", (turnNumber + 2.72) * boxSide * 4 + textBuffer);
            textElement.setAttributeNS(null, "y", 2 * row * boxSide - textBuffer);
            textElement.setAttributeNS(null, "font-size", textSize);
            textElement.style.fill = "red";
            textElement.textContent = "F";
            if (listener != undefined) {
                var player = listener;
                textElement.onclick = function (event) { player.handleClick(event); };
                boxButton.onclick = function (event) { player.handleClick(event); };
            }
            boardSvg.appendChild(textElement);
        }



    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        if (event.target.textContent == "T") {
            if (this.position.canChooseTrue(currentPlayer)) {
                const option = this.position.getTrueOption();
                player.sendMoveToRef(option);
                return;
            }
        } else if (event.target.textContent == "F") {
            if (this.position.canChooseFalse(currentPlayer)) {
                const option = this.position.getFalseOption();
                player.sendMoveToRef(option);
                return;
            }
        }
    }
}); // end of InteractiveBooleanFormulaView


/**
 * View Factory for BooleanFormula
 */
var InteractiveBooleanFormulaViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveBooleanFormulaView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveBooleanFormulaViewFactory

/**
 * Launches a new BooleanFormula game.
 */
function newBooleanFormulaGame() {
    var viewFactory = new InteractiveBooleanFormulaViewFactory();
    var playDelay = 1000;
    const numVariables = parseInt($('numVariables').value);
    const numClauses = parseInt($('numClauses').value);
    const minClauseLength = 3;
    const maxClauseLength = 3;
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new BooleanFormula(numVariables, numClauses, minClauseLength, maxClauseLength);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
}

///////////////////////// End of Blackout





/**************************Buttons and Scissors***************************************/

/**
 * Buttons and Scissors ruleset.
 */
var ButtonsAndScissors = Class.create(CombinatorialGame, {
    /**
     * Constructor.
     */
    initialize: function (width, height, buttons, blocks) {
        this.playerNames = ["Blue", "Red"];
        this.colors = ["blue", "red", "green"];
        this.colorIndices = [0, 1, 2];
        this.width = width;
        this.height = height;
        this.buttons = buttons || [];
        this.blocks = blocks || [];
    }

    /**
     * Returns whether there is a block at coordinates.
     */
    , hasBlockAt: function (row, column) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block[0] == row && block[1] == column) return true;
        }
        return false;
    }

    /**
     * Gets the button color at a location.  Returns -1 if there's no button there.
     */
    , getColorAt: function (row, column) {
        for (var color = 0; color < this.buttons.length; color++) {
            for (var i = 0; i < this.buttons[color].length; i++) {
                var button = this.buttons[color][i];
                if (button[0] == row && button[1] == column) return color;
            }
        }
        return -1;
    }

    /**
     * Returns whether there is a button of a specific color at a position.
     */
    , hasButtonAt: function (row, column, color) {
        for (var i = 0; i < this.buttons[color].length; i++) {
            var button = this.buttons[color][i];
            if (button[0] == row && button[1] == column) return true;
        }
        return false;
    }

    /**
     * Adds random buttons.
     */
    , setRandomButtons: function (density) {
        var buttonsToCreate = Math.floor((Math.random() / 5 + (density - .1)) * this.width * this.height);
        var buttonColors = [];
        var j = 0;
        while (j < .5 * buttonsToCreate) {
            buttonColors.push(0);
            j++;
        }
        while (j < buttonsToCreate) {
            buttonColors.push(1);
            j++;
        }
        //don't add green anymore
        while (j < buttonsToCreate) {
            buttonColors.push(2);
            j++;
        }

        this.buttons = [];
        for (var i = 0; i < this.colors.length; i++) {
            this.buttons.push([]);
        }

        while (buttonColors.length > 0) {
            var row = Math.floor(Math.random() * this.height);
            var column = Math.floor(Math.random() * this.width);
            while (this.hasBlockAt(row, column) || this.getColorAt(row, column) != -1) {
                row = Math.floor(Math.random() * this.height);
                column = Math.floor(Math.random() * this.width);
            }
            var colorIndex = buttonColors.pop();
            this.buttons[colorIndex].push([row, column]);
        }
        /*
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                if (!this.hasBlockAt(row, column) && Math.random() < density) {
                    //this.buttons[randomChoice(this.colorIndices)].push([row, column]);
                    this.buttons[randomChoice([0, 0, 1, 1, 2])].push([row, column]);
                }
            }
        }*/
    }

    /**
     * Adds random blocks.
     */
    , setRandomBlocks: function (density) {
        this.blocks = [];
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                if (this.getColorAt(row, column) == -1 && Math.random() < density) {
                    this.blocks.push([row, column]);
                }
            }
        }
    }

    /**
     * equals
     */
    , equals: function (other) {
        if (this.blocks.length != other.blocks.length || this.buttons[0].length != other.buttons[0].length || this.buttons[1].length != other.buttons[1].length) return false;
        //check that other has all the buttons
        for (var color = 0; color < this.colors.length; color++) {
            for (var i = 0; i < this.buttons[color].length; i++) {
                var button = this.buttons[color][i];
                if (!other.hasButtonAt(button[0], button[1], color)) return false;
            }
        }

        //check that other has all the blocks
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (!other.hasBlockAt(block[0], block[1])) return false;
        }
        return true;
    }

    /**
     * clone
     */
    , clone: function () {
        buttonsCopy = [];
        for (var color = 0; color < this.buttons.length; color++) {
            buttonsCopy.push([]);
            for (var i = 0; i < this.buttons[color].length; i++) {
                var button = this.buttons[color][i];
                buttonsCopy[color].push([button[0], button[1]]);
            }
        }
        blocksCopy = [];
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            blocksCopy.push([block[0], block[1]]);
        }
        return new ButtonsAndScissors(this.width, this.height, buttonsCopy, blocksCopy);
    }

    /**
     * Determines whether two buttons can be cut.
     */
    , areCuttable: function (locationA, locationB, playerIndex) {
        //check that the locations are different
        if (locationA[0] == locationB[0] && locationA[1] == locationB[1]) return false;
        //check that the colors are the same
        var colorA = this.getColorAt(locationA[0], locationA[1]);
        var colorB = this.getColorAt(locationB[0], locationB[1]);
        if (colorA != colorB) return false;
        //check that the player's color is correct
        if (colorA == 1 - playerIndex) return false;
        //check that the two points are connected by 8 cardinal directions
        var xDistance = locationB[0] - locationA[0];
        var yDistance = locationB[1] - locationA[1];
        if (xDistance != 0 && yDistance != 0 && Math.abs(xDistance) != Math.abs(yDistance)) return false;
        //check that everything along the path is not a button with a different color and not a block
        var xStep = xDistance > 0 ? 1 : (xDistance < 0 ? -1 : 0);
        var yStep = yDistance > 0 ? 1 : (yDistance < 0 ? -1 : 0);
        for (var i = 0; i < Math.max(Math.abs(xDistance), Math.abs(yDistance)); i++) {
            var midLocation = [locationA[0] + i * xStep, locationA[1] + i * yStep];
            var colorAtMidLocation = this.getColorAt(midLocation[0], midLocation[1]);
            //console.log("midLocation: " + midLocation + ", color there: " + colorAtMidLocation);
            if ((colorAtMidLocation != -1 && colorAtMidLocation != colorA) || this.hasBlockAt(midLocation[0], midLocation[1])) return false;
        }
        return true;
    }

    /**
     * Removes a button.  Precondition: button must be here!
     */
    , removeButton: function (row, column, colorIndex) {
        var i = 0;
        for (; i < this.buttons[colorIndex].length; i++) {
            var button = this.buttons[colorIndex][i];
            if (button[0] == row && button[1] == column) break;
        }
        //console.log("cutting " + i + "th button: [" + row + ", " + column + "]");
        this.buttons[colorIndex] = this.buttons[colorIndex].slice(0, i).concat(this.buttons[colorIndex].slice(i + 1));
    }

    /**
     * Gets the option from a single cut.  Precondition: assumes the cut can be made.
     */
    , getCutOption: function (locationA, locationB) {
        var color = this.getColorAt(locationA[0], locationA[1]);
        var copy = this.clone();
        var xStep = locationB[0] > locationA[0] ? 1 : (locationB[0] < locationA[0] ? -1 : 0);
        var yStep = locationB[1] > locationA[1] ? 1 : (locationB[1] < locationA[1] ? -1 : 0);
        var x = locationA[0];
        var y = locationA[1];
        while (true) {
            copy.removeButton(x, y, color);
            if (x == locationB[0] && y == locationB[1]) break;
            x += xStep;
            y += yStep;
        }
        //copy.removeButton(locationB[0], locationB[1], color);
        //copy.removeButton(x, y, color);
        return copy;
    }

    /**
     * getOptionsForPlayer
     */
    , getOptionsForPlayer: function (playerId) {
        var options = [];
        for (var colorIndex = 0; colorIndex < this.buttons.length; colorIndex++) {
            for (var i = 0; i < this.buttons[colorIndex].length; i++) {
                for (var j = i + 1; j < this.buttons[colorIndex].length; j++) {
                    var locationA = this.buttons[colorIndex][i];
                    var locationB = this.buttons[colorIndex][j];
                    if (this.areCuttable(locationA, locationB, playerId)) {
                        options.push(this.getCutOption(locationA, locationB));
                    }
                }
            }
        }
        return options;
    }
}); //end of ButtonsAndScissors
ButtonsAndScissors.prototype.PLAYER_NAMES = ["Blue", "Red"];

var InteractiveButtonsAndScissorsView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedPiece = undefined;
    }

    /**
     * Draws the checker board and assigns the listener
     */
    , draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const pixelsPerBoxWide = (canvasWidth - 10) / this.position.width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / this.position.height;
        const boxSide = Math.min(pixelsPerBoxHigh, pixelsPerBoxWide);

        //draw the checker tiles
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                var parityString = "even";
                if ((i + j) % 2 == 1) {
                    parityString = "odd";
                }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", (i * boxSide) + "");
                checkerTile.setAttributeNS(null, "y", (j * boxSide) + "");
                checkerTile.setAttributeNS(null, "width", String(boxSide));
                checkerTile.setAttributeNS(null, "height", String(boxSide));
                checkerTile.setAttributeNS(null, "class", parityString + "Checker");
                boardSvg.appendChild(checkerTile);

            }
        }

        //draw the buttons
        for (var colorIndex = 0; colorIndex < this.position.buttons.length; colorIndex++) {
            for (var i = 0; i < this.position.buttons[colorIndex].length; i++) {
                var button = this.position.buttons[colorIndex][i];
                var svgButton = document.createElementNS(svgNS, "circle");
                var x = button[0];
                var y = button[1];
                svgButton.setAttributeNS(null, "cy", (x + .5) * boxSide);
                svgButton.setAttributeNS(null, "cx", (y + .5) * boxSide);
                svgButton.setAttributeNS(null, "r", .45 * boxSide);
                svgButton.setAttributeNS(null, "class", this.position.colors[colorIndex] + "Piece");
                if (listener != undefined) {
                    var player = listener;
                    svgButton.onclick = function (event) { player.handleClick(event); }
                }
                svgButton.player = colorIndex;
                svgButton.modelData = button;
                boardSvg.appendChild(svgButton);
            }
        }

        //TODO: draw the blocks (this doesn't work yet!)
        for (var i = 0; i < this.position.blocks.length; i++) {
            var block = this.position.blocks[i];
            var svgBlock = document.createElementNS(svgNS, "rect");
            var x = block[0];
            var y = block[1];
            svgBlock.setAttributeNS(null, "y", (x * boxSide) + "");
            svgBlock.setAttributeNS(null, "x", (y * boxSide) + "");
            svgBlock.setAttributeNS(null, "width", String(boxSide));
            svgBlock.setAttributeNS(null, "height", String(boxSide));
            //TODO: don't append it yet.  Also, need to set the class.
        }
    }

    /**
     * Selects a piece.
     */
    , selectPiece: function (piece) {
        this.selectedPiece = piece;
        this.selectedPiece.style.stroke = "Purple";
    }

    /**
     * Deselect piece.
     */
    , deselectPiece: function () {
        if (this.selectedPiece != undefined) {
            this.selectedPiece.style.stroke = "Blue";
            this.selectedPiece = undefined;
        }
    }

    /**
     *  Gets the next position using piece locations.
     */
    , getNextPositionFromPieceLocations: function (firstPiece, secondPiece, containerElement) {
        var buttonA = firstPiece.modelData;
        var buttonB = secondPiece.modelData;
        if (this.position.areCuttable(buttonA, buttonB, buttonA.color)) {
            console.log("Cuttable!");
            this.deselectPiece();
            return this.position.getCutOption(buttonA, buttonB);
        } else {
            this.deselectPiece();
            return null;
        }
    }

    /**
     * Handles a mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedPiece = event.target;
        if (this.selectedPiece == undefined) {
            //select the clicked piece, if appropriate
            if (currentPlayer != 1 - clickedPiece.player) {
                this.selectPiece(clickedPiece);
            }
            return null; //no new move from this
        } else {
            //clicking a second piece
            if (currentPlayer != 1 - clickedPiece.player) {
                //trying to make a move
                console.log("Making a move...");
                var nextPosition = this.getNextPositionFromPieceLocations(this.selectedPiece, clickedPiece, containerElement);
                this.deselectPiece();
                return nextPosition;
            } else {
                this.deselectPiece();
                return null;
            }
        }
    }
}); //end of InteractiveButtonsAndScissorsView

/**
 * View Factory
 */
var InteractiveButtonsAndScissorsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveButtonsAndScissorsView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveButtonsAndScissorsViewFactory

function newButtonsAndScissorsGame() {
    var viewFactory = new InteractiveButtonsAndScissorsViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new ButtonsAndScissors(width, height);
    game.setRandomButtons(.4);
    game.setRandomBlocks(0); //no blocks
    var ref = new Referee(game, players, viewFactory, "buttonsAndScissorsBoard", $('messageBox'), controlForm);
}





/********************************Clobber**********************************************/

/**
 * Class for Clobber ruleset.
 */
var Clobber = Class.create(CombinatorialGame, {

    /**
     * Constructor.  TODO: refactor to only take one positions 2-D list.
     */
    initialize: function (width, height, positions, rightPositions) {
        this.playerNames = ["Blue", "Red"];
        this.width = width;
        this.height = height;
        if (positions == undefined) {
            positions = [this.getStartingPositions(0), this.getStartingPositions(1)];
        } else if (rightPositions != undefined) {
            //TODO: deprecate this case!
            console.log("Called Clobber constructor with 4 params!");
            positions = [positions, rightPositions];
        }
        this.draughts = [new Array(), new Array()];
        for (var i = 0; i < positions.length; i++) {
            for (var j = 0; j < positions[i].length; j++) {
                var coordinates = positions[i][j];
                this.draughts[i].push(coordinates);
            }
        }
        /*
        this.bluePieces = this.pieces[0];
        this.redPieces = this.pieces[1];
        */
    }

    /**
     * Constructor Helper.
     */
    , getStartingPositions: function (playerIndex) {
        var pieces = new Array();
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var coordinates = [i, j];
                if ((i + j) % 2 == playerIndex) {
                    pieces.push(coordinates);
                }
            }
        }
        return pieces;
    }

    ,/**
     * Determines whether this equals another position.  Tests identical equality, not equivalence.
     */
    equals: function (other) {
        if ((this.width != other.width) || (this.height != other.height)) return false;
        //check that other has all this's pieces
        for (var i = 0; i < this.draughts.length; i++) {
            for (var j = 0; j < this.draughts[i].length; j++) {
                var hasPiece = false;
                for (var k = 0; k < other.draughts[i].length; k++) {
                    if (this.draughts[i][j][0] == other.draughts[i][k][0] &&
                        this.draughts[i][j][1] == other.draughts[i][k][1]) hasPiece = true;
                }
                if (hasPiece == false) return false;
            }
        }
        //check that this has all other's pieces
        for (var i = 0; i < other.draughts.length; i++) {
            for (var j = 0; j < other.draughts[i].length; j++) {
                var hasPiece = false;
                for (var k = 0; k < this.draughts[i].length; k++) {
                    if (this.draughts[i][k][0] == other.draughts[i][j][0] &&
                        this.draughts[i][k][1] == other.draughts[i][j][1]) hasPiece = true;
                }
                if (hasPiece == false) return false;
            }
        }
        return true;
    }

    ,/**
     * Returns the distance between two pieces.
     */
    areAdjacent: function (position0, position1) {
        var distance = Math.abs(position0[0] - position1[0]);
        distance += Math.abs(position0[1] - position1[1]);
        return distance == 1;
    }

    ,/**
     * Clones this game.
     */
    clone: function () {
        return new Clobber(this.width, this.height, this.draughts);
    }

    /**
     * Gets the options for a player.
     */
    , getOptionsForPlayer: function (playerId) {
        var otherPlayerId = 1 - playerId;
        var options = new Array();
        var currentPlayerPieces = this.draughts[playerId];
        var otherPlayerPieces = this.draughts[otherPlayerId];
        for (var i = 0; i < currentPlayerPieces.length; i++) {
            var currentPiece = currentPlayerPieces[i];
            for (var j = 0; j < otherPlayerPieces.length; j++) {
                var otherPiece = otherPlayerPieces[j];
                if (this.areAdjacent(currentPiece, otherPiece)) {
                    //generate a new game!
                    var nextPieces = [new Array(), new Array()];

                    //add the current player's pieces
                    for (var k = 0; k < currentPlayerPieces.length; k++) {
                        if (k != i) {
                            //add the unmoving piece
                            nextPieces[playerId].push(currentPlayerPieces[k]);
                        } else {
                            //add the one that clobbered
                            nextPieces[playerId].push(otherPiece)
                        }
                    }

                    //add the other player's pieces
                    for (var k = 0; k < otherPlayerPieces.length; k++) {
                        if (k != j) {
                            //add the piece (skips the clobbered one)
                            nextPieces[otherPlayerId].push(otherPlayerPieces[k]);
                        }
                    }
                    var option = new Clobber(this.width, this.height, nextPieces)
                    options.push(option);
                    //break; //stop checking for neighbors to the current player's piece
                }

            }
        }
        return options;
    }

    /**
     * Gets an option moving from rowA, columnA to rowB, columnB by playerId.
     */
    , getOptionAt: function (playerId, rowA, columnA, rowB, columnB) {
        const rowDist = Math.abs(rowA - rowB);
        const columnDist = Math.abs(columnA - columnB);
        if (rowDist + columnDist != 1) {
            //pieces aren't next to each other.
            return null;
        }
        const playerPieceIndex = omniIndexOf(this.draughts[playerId], [columnA, rowA]);
        const opponentPieceIndex = omniIndexOf(this.draughts[1 - playerId], [columnB, rowB]);
        if (playerPieceIndex == -1 || opponentPieceIndex == -1) {
            //one of the pieces doesn't exist!
            return null;
        }
        const option = this.clone();
        option.draughts[playerId][playerPieceIndex] = [columnB, rowB];
        option.draughts[1 - playerId].splice(opponentPieceIndex, 1);
        return option;
    }

    ,/**
     * toString
     */
    toString: function () {
        var string = "Clobber Position\n";
        for (var i = 0; i < this.draughts.length; i++) {
            string += this.getPlayerName(i) + " positions:\n";
            for (var j = 0; j < this.draughts[i].length; j++) {
                var piece = this.draughts[i][j];
                string += "    [" + piece[0] + ", " + piece[1] + "]\n";
            }
        }
        return string;
    }
}); //end of Clobber
Clobber.prototype.PLAYER_NAMES = ["Blue", "Red"];



var InteractiveSVGClobberView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedPiece = undefined;
    }

    /**
     * Draws the checker board and assigns the listener
     */
    , draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const screenWidth = canvasWidth;
        const screenHeight = canvasHeight;
        const pixelsPerBoxWide = (screenWidth - 20) / this.position.width;
        const pixelsPerBoxHigh = (screenHeight - 20) / this.position.height;
        const boxSide = Math.floor(Math.min(pixelsPerBoxHigh, pixelsPerBoxWide));

        //draw the checker tiles
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                var parityString = "even";
                if ((i + j) % 2 == 1) {
                    parityString = "odd";
                }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", (i * boxSide) + "");
                checkerTile.setAttributeNS(null, "y", (j * boxSide) + "");
                checkerTile.setAttributeNS(null, "width", String(boxSide));
                checkerTile.setAttributeNS(null, "height", String(boxSide));
                checkerTile.setAttributeNS(null, "class", parityString + "Checker");
                boardSvg.appendChild(checkerTile);

            }
        }

        //draw the draughts
        for (var i = 0; i < this.position.draughts.length; i++) {
            for (var j = 0; j < this.position.draughts[i].length; j++) {

                var draught = document.createElementNS(svgNS, "circle");
                var x = this.position.draughts[i][j][0];
                var y = this.position.draughts[i][j][1];
                draught.setAttributeNS(null, "cx", (x + .5) * boxSide);
                draught.setAttributeNS(null, "cy", (y + .5) * boxSide);
                draught.setAttributeNS(null, "r", .45 * boxSide);
                if (i == CombinatorialGame.prototype.LEFT) {
                    draught.setAttributeNS(null, "class", "bluePiece");
                } else {
                    draught.setAttributeNS(null, "class", "redPiece");
                }
                if (listener != undefined) {
                    var player = listener;
                    draught.column = x;
                    draught.row = y;
                    draught.player = i;
                    draught.onclick = function (event) { player.handleClick(event); }
                }
                draught.player = i;
                boardSvg.appendChild(draught);
            }
        }
    }

    ,/**
     * Selects a piece.
     */
    selectPiece: function (piece) {
        this.selectedPiece = piece;
        this.selectedPiece.style.stroke = "Purple";
    }

    ,/**
     * Deselect piece.
     */
    deselectPiece: function () {
        if (this.selectedPiece != undefined) {
            this.selectedPiece.style.stroke = "Black";
            this.selectedPiece = undefined;
        }
    }

    /**
     *  Gets the next position using piece locations.
     */
    , getNextPositionFromPieceLocations: function (firstPiece, secondPiece, containerElement) {
        var xDistance = Math.abs(secondPiece.column - firstPiece.column);
        var yDistance = Math.abs(secondPiece.row - firstPiece.row);
        var pieceDistance = xDistance + yDistance;
        if (pieceDistance == 1) {
            const playerId = firstPiece.player;
            const rowA = firstPiece.row;
            const columnA = firstPiece.column;
            const rowB = secondPiece.row;
            const columnB = secondPiece.column;
            const option = this.position.getOptionAt(playerId, rowA, columnA, rowB, columnB);
            /*
            var nextPieces = [[], []]; //nextPieces: 0th list will be blue, 1th red
            var boardSvg = containerElement.lastChild;
            var boardElements = boardSvg.childNodes;
            for (var i = 0; i < boardElements.length; i++) {
                if (boardElements[i] == firstPiece) {
                    nextPieces[firstPiece.player].push([(secondPiece.cx.baseVal.value - 50) / 100, (secondPiece.cy.baseVal.value - 50) / 100]);
                } else if (boardElements[i] != secondPiece && boardElements[i].player != undefined) {
                    var piece = boardElements[i];
                    nextPieces[piece.player].push([(piece.cx.baseVal.value - 50)/100, (piece.cy.baseVal.value - 50) / 100]);
                }
            }
            */
            this.deselectPiece();
            return option;
            //return new Clobber(this.position.width, this.position.height, nextPieces);

        } else {
            this.deselectPiece();
            return null;
        }

    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedPiece = event.target;
        if (this.selectedPiece == undefined) {
            //select the clicked piece, if appropriate
            if (currentPlayer == clickedPiece.player) {
                this.selectPiece(clickedPiece);
            }
            return null; //no new move from this
        } else {
            if (currentPlayer == clickedPiece.player) {
                this.deselectPiece();
                return null;
            } else {
                /*
                //measure the distance between centers
                var xDistance = Math.abs(clickedPiece.cx.baseVal.value - this.selectedPiece.cx.baseVal.value);
                var yDistance = Math.abs(clickedPiece.cy.baseVal.value - this.selectedPiece.cy.baseVal.value);
                var pieceDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
                if (pieceDistance < 105) {
                    var nextPieces = [[], []]; //nextPieces: 0th list will be blue, 1th red
                    var boardSvg = containerElement.lastChild;
                    var boardElements = boardSvg.childNodes;
                    for (var i = 0; i < boardElements.length; i++) {
                        if (boardElements[i] == this.selectedPiece) {
                            nextPieces[this.selectedPiece.player].push([(clickedPiece.cx.baseVal.value - 50) / 100, (clickedPiece.cy.baseVal.value - 50) / 100]);
                        } else if (boardElements[i] != clickedPiece && boardElements[i].player != undefined) {
                            var piece = boardElements[i];
                            nextPieces[piece.player].push([(piece.cx.baseVal.value - 50)/100, (piece.cy.baseVal.value - 50) / 100]);
                        }
                    }
                    this.deselectPiece();
                    return new Clobber(this.position.width, this.position.height, nextPieces);

                } else {
                    this.deselectPiece();
                    return null;
                }
                */
                var nextPosition = this.getNextPositionFromPieceLocations(this.selectedPiece, clickedPiece, containerElement);
                this.deselectPiece();
                return nextPosition;
            }
        }
    }
}); //end of InteractiveSVGClobberView



/**
 * View Factory
 */
var InteractiveClobberViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function (isReverse) {
        this.isReverse = isReverse || false;
    }

    ,/**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        if (this.isReverse) {
            return new InteractiveSVGReverseClobberView(position);
        } else {
            return new InteractiveSVGClobberView(position);
        }
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveClobberViewFactory


/**
 * Launches a new Clobber game.
 */
function newClobberGame(isReverse) {
    var viewFactory = new InteractiveClobberViewFactory(isReverse);
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    if (isReverse) {
        var game = new ReverseClobber(width, height);
    } else {
        var game = new Clobber(width, height);
    }

    var ref = new Referee(game, players, viewFactory, "clobberBoard", $('messageBox'), controlForm);
}




/**
 * Class for Clobbineering ruleset.
 */
var Clobbineering = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (width, height, draughts, dominoes, blockedSpaces) {
        this.playerNames = ["Blue/Vertical", "Red/Horizontal"];
        this.width = width || 4;
        this.height = height || 4;
        //draughts = draughts || [new Array(), new Array()];
        dominoes = dominoes || [new Array(), new Array()];
        blockedSpaces = blockedSpaces || new Array();
        this.clobber = new Clobber(this.width, this.height, draughts);
        this.domineering = new Domineering(this.width, this.height, dominoes, blockedSpaces);
    }

    ,/**
     * toString
     */
    toString: function () {
        var string = "Clobbineering Position:\n";
        string += this.clobber.toString();
        string += this.domineering.toString();
        return string;
    }

    ,/**
     * equals
     */
    equals: function (other) {
        return this.clobber.equals(other.clobber) && this.domineering.equals(other.domineering);
    }

    ,/**
     * clone
     */
    clone: function () {
        var clone = new Clobbineering(this.width, this.height, this.clobber.draughts, this.domineering.dominoes, this.domineering.blockedSpaces);
        return clone;
    }

    ,/**
     * getOptionsForPlayer
     */
    getOptionsForPlayer: function (playerId) {
        var options = new Array();

        //add the clobber-type moves.
        var clobberMoves = this.clobber.getOptionsForPlayer(playerId);
        for (var i = 0; i < clobberMoves.length; i++) {
            var clobberMove = clobberMoves[i];
            var option = new Clobbineering(this.width, this.height, clobberMove.draughts, this.domineering.dominoes, this.domineering.blockedSpaces);
            options.push(option);
        }

        //add the domineering type moves
        //put the clobber pieces in as blocks
        var domineeringWithClobberBlocks = this.domineering.clone();
        for (var i = 0; i < this.clobber.draughts.length; i++) {
            var clobberPieces = this.clobber.draughts[i];
            for (var j = 0; j < clobberPieces.length; j++) {
                domineeringWithClobberBlocks.blockedSpaces.push([clobberPieces[j][0], clobberPieces[j][1]]);
            }
        }

        var dominoPlacements = domineeringWithClobberBlocks.getDominoMoves(playerId);
        for (var i = 0; i < dominoPlacements.length; i++) {
            var newDomino = dominoPlacements[i];
            var column = newDomino[0];
            var row = newDomino[1];
            var option = this.clone();
            option.domineering.dominoes[playerId].push([column, row]);
            options.push(option);
        }

        return options;
    }

}); //end of Clobbineering
Clobbineering.prototype.PLAYER_NAMES = ["Blue/Vertical", "Red/Horizontal"];


var InteractiveSVGClobbineeringView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedElement = undefined;
    }

    ,/**
     * Draws the checker board and assigns the listener
     */
    draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const pixelsPerBoxWide = (canvasWidth - 10) / this.position.width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / this.position.height;
        const boxSide = Math.min(pixelsPerBoxHigh, pixelsPerBoxWide);

        //draw the checker tiles
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                var parityString = "even";
                if ((i + j) % 2 == 1) {
                    parityString = "odd";
                }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", (i * boxSide) + "");
                checkerTile.setAttributeNS(null, "y", (j * boxSide) + "");
                checkerTile.setAttributeNS(null, "width", String(boxSide));
                checkerTile.setAttributeNS(null, "height", String(boxSide));
                checkerTile.setAttributeNS(null, "class", parityString + "Checker");
                boardSvg.appendChild(checkerTile);
                if (listener != undefined) {
                    var player = listener;
                    checkerTile.column = i;
                    checkerTile.row = j;
                    checkerTile.onclick = function (event) { player.handleClick(event); }
                }
                checkerTile.normalStyleCssText = checkerTile.style.cssText;
                checkerTile.style.fill = "red";
                checkerTile.selectedStyleCssText = checkerTile.style.cssText;
                checkerTile.style.cssText = checkerTile.normalStyleCssText;
            }
        }

        //draw the dominoes
        for (var playerId = 0; playerId < this.position.domineering.dominoes.length; playerId++) {
            var dominoes = this.position.domineering.dominoes[playerId];
            for (var i = 0; i < dominoes.length; i++) {
                var domino = dominoes[i];
                var column = domino[0];
                var row = domino[1];
                var dominoRect = document.createElementNS(svgNS, "rect");
                dominoRect.setAttributeNS(null, "x", new String(10 + column * boxSide));
                dominoRect.setAttributeNS(null, "y", new String(10 + row * boxSide));
                //these two lines round the corners
                dominoRect.setAttributeNS(null, "rx", String(.1 * boxSide));
                dominoRect.setAttributeNS(null, "ry", String(.1 * boxSide));
                dominoRect.setAttributeNS(null, "width", new String(boxSide * (1 + playerId - .2)));
                dominoRect.setAttributeNS(null, "height", new String(boxSide * (2 - playerId - .2)));
                dominoRect.setAttributeNS(null, "class", "domino");
                boardSvg.appendChild(dominoRect);
            }
        }

        //draw the draughts
        for (var i = 0; i < this.position.clobber.draughts.length; i++) {
            var draughts = this.position.clobber.draughts[i];
            for (var j = 0; j < draughts.length; j++) {
                var draughtLocation = draughts[j];
                var draught = document.createElementNS(svgNS, "circle");
                var x = draughtLocation[0];
                var y = draughtLocation[1];
                draught.setAttributeNS(null, "cx", (x + .5) * boxSide);
                draught.setAttributeNS(null, "cy", (y + .5) * boxSide);
                draught.setAttributeNS(null, "r", .45 * boxSide);
                if (i == CombinatorialGame.prototype.LEFT) {
                    draught.setAttributeNS(null, "class", "bluePiece");
                } else {
                    draught.setAttributeNS(null, "class", "redPiece");
                }
                boardSvg.appendChild(draught);
                if (listener != undefined) {
                    var player = listener;
                    draught.column = x;
                    draught.row = y;
                    draught.onclick = function (event) { player.handleClick(event); }
                }
                draught.player = i;
                draught.normalStyleCssText = draught.style.cssText;
                draught.style.stroke = "Purple";
                draught.selectedStyleCssText = draught.style.cssText;
                draught.style.cssText = draught.normalStyleCssText;
            }
        }
    }

    ,/**
     * Selects a piece.
     */
    selectElement: function (element) {
        this.selectedElement = element;
        this.selectedElement.style.cssText = this.selectedElement.selectedStyleCssText;
        this.selectedElement;
    }

    ,/**
     * Deselect piece.
     */
    deselectElement: function () {
        this.selectedElement.style.cssText = this.selectedElement.normalStyleCssText;
        this.selectedElement = undefined;
    }

    ,/**
     * Handles a mouse click.
     * TODO: working on this!
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedElement = event.target; //this will be a tile
        if (this.selectedElement == undefined) {
            this.selectElement(clickedElement);
            return null;
        } else if (this.selectedElement.tagName == clickedElement.tagName) {
            if (clickedElement.tagName == "rect") {
                //make the appropriate domineering move
                var domineeringView = new InteractiveSVGDomineeringView(this.position.domineering);
                var domineeringMove = domineeringView.getNextPositionFromElementLocations(this.selectedElement, clickedElement, containerElement, currentPlayer);
                //var domineeringMove = domineeringView.getNextPositionFromClick(event, currentPlayer, containerElement);
                if (domineeringMove != null) {
                    return new Clobbineering(this.position.width, this.position.height, this.position.clobber.draughts, domineeringMove.dominoes, this.position.domineering.blockedSpaces);
                }
            } else if (clickedElement.tagName == "circle") {
                //make the appropriate clobber move
                var clobberView = new InteractiveSVGClobberView(this.position.clobber);
                var clobberMove = clobberView.getNextPositionFromPieceLocations(this.selectedElement, clickedElement, containerElement);
                if (clobberMove != null) {
                    var newPosition = new Clobbineering(this.position.width, this.position.height, clobberMove.draughts, this.position.domineering.dominoes, this.position.domineering.blockedSpaces);
                    return newPosition;
                }
            } else {
                this.deselectElement();
            }
        }
        this.deselectElement();
        return null;
    }
});  //end of InteractiveSVGClobbineeringView

/**
 * View Factory
 */
var InteractiveSVGClobbineeringViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    ,/**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveSVGClobbineeringView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveSVGClobbineeringViewFactory


/**
 * Launches a new Clobbineering Game.
 */
function newClobbineeringGame() {
    var viewFactory = new InteractiveSVGClobbineeringViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    game = new Clobbineering(width, height);
    ref = new Referee(game, players, viewFactory, "gameCanvas", $('messageBox'), controlForm);
};






// DistanceGames, including Col, Snort, Kayles.  First, GridDistanceGame, for Col.


const TriangularGridCol = Class.create(CombinatorialGame, {

    initialize: function (width, height, colorProbability) {
        this.UNCOLORED = 2;
        this.BLUE = CombinatorialGame.prototype.LEFT;
        this.RED = CombinatorialGame.prototype.RIGHT;
        this.graph = new TriangularGridGraph(width, height, (col, row) => this.UNCOLORED);
        const n = width * height;
        const numEachColor = Math.floor((n * colorProbability) / 2);
        //color some Blue
        for (var i = 0; i < numEachColor;) {
            const col = Math.floor(Math.random() * width);
            const row = Math.floor(Math.random() * height);
            if (this.playerCanPlayAt(col, row, this.BLUE)) {
                this.graph.setValue(col, row, this.BLUE);
                i++;
            }
        }
        for (var i = 0; i < numEachColor;) {
            const col = Math.floor(Math.random() * width);
            const row = Math.floor(Math.random() * height);
            if (this.playerCanPlayAt(col, row, this.RED)) {
                this.graph.setValue(col, row, this.RED);
                i++;
            }
        }
        this.playerNames = ["Blue", "Red"];
    }

    , getWidth: function () {
        return this.graph.width;
    }

    , getHeight: function () {
        return this.graph.height;
    }

    , clone: function () {
        const copy = new TriangularGridCol(this.getWidth(), this.getHeight(), 0.0);
        copy.graph = this.graph.clone();
        return copy;
    }

    , equals: function (other) {
        return this.graph.equals(other.graph);
    }

    , getColorAt: function (col, row) {
        return this.graph.getValue(col, row);
    }

    , playerCanPlayAt: function (col, row, playerId) {
        return this.graph.getValue(col, row) == this.UNCOLORED && !(this.graph.getNeighborValues(col, row)).includes(playerId);
    }

    , getOptionsForPlayer: function (playerId) {
        const options = [];
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.playerCanPlayAt(i, j, playerId)) {
                    const option = this.getOption(i, j, playerId);
                    options.push(option);
                }
            }
        }
        return options;
    }

    , getOption: function (col, row, playerId) {
        const option = this.clone();
        option.graph.setValue(col, row, playerId);
        return option;
    }

}); //end of TriangularGridCol
TriangularGridCol.prototype.PLAYER_NAMES = ["Blue", "Red"];


var TriangularGridColInteractiveView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.getWidth();
        var height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        var maxDiameter = boxSide; //Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var circle = document.createElementNS(svgNS, "circle");
                var centerX = 5 + Math.floor((colIndex + .5) * boxSide);
                if (rowIndex % 2 == 0) {
                    centerX += boxSide / 2;
                }
                circle.setAttributeNS(null, "cx", centerX);
                var centerY = 5 + Math.floor((rowIndex + .5) * boxSide);
                circle.setAttributeNS(null, "cy", centerY);
                circle.setAttributeNS(null, "r", nodeRadius);
                circle.style.stroke = "black";
                circle.style.strokeWidth = 5;
                if (this.position.getColorAt(colIndex, rowIndex) == CombinatorialGame.prototype.LEFT) {
                    circle.style.fill = "blue";
                } else if (this.position.getColorAt(colIndex, rowIndex) == CombinatorialGame.prototype.RIGHT) {
                    circle.style.fill = "red";
                } else {
                    circle.style.fill = "white";
                    if (listener != undefined) {
                        var player = listener;
                        //circle will be event.target, so give it some extra attributes.
                        circle.column = colIndex;
                        circle.row = rowIndex;
                        circle.onclick = function (event) { player.handleClick(event); }
                    }
                }
                //wait to add the circle until after we've added the edges

                //now add the edges
                if (colIndex < width - 1) {
                    //line to the circle to the left
                    var line = document.createElementNS(svgNS, "line");
                    line.setAttributeNS(null, "x1", centerX + nodeRadius);
                    line.setAttributeNS(null, "y1", centerY);
                    line.setAttributeNS(null, "x2", centerX + boxSide - nodeRadius);
                    line.setAttributeNS(null, "y2", centerY);
                    line.style.stroke = "black";
                    line.style.strokeWidth = 5;
                    boardSvg.appendChild(line);
                }
                if (rowIndex < height - 1) {
                    //line to the circle below and to the left
                    if (colIndex > 0 || this.position.graph.isRowShiftedRight(rowIndex)) {
                        const line = document.createElementNS(svgNS, "line");
                        line.setAttributeNS(null, "x1", centerX);
                        line.setAttributeNS(null, "y1", centerY);
                        line.setAttributeNS(null, "x2", centerX - boxSide / 2 + nodeRadius / 2);
                        line.setAttributeNS(null, "y2", centerY + boxSide - Math.sqrt(3) * nodeRadius / 2);
                        line.style.stroke = "black";
                        line.style.strokeWidth = 5;
                        boardSvg.appendChild(line);
                    }
                    if (colIndex < this.position.getWidth() - 1 || this.position.graph.isRowShiftedLeft(rowIndex)) {
                        const line = document.createElementNS(svgNS, "line");
                        line.setAttributeNS(null, "x1", centerX);
                        line.setAttributeNS(null, "y1", centerY);
                        line.setAttributeNS(null, "x2", centerX + boxSide / 2 - nodeRadius / 2);
                        line.setAttributeNS(null, "y2", centerY + boxSide - Math.sqrt(3) * nodeRadius / 2);
                        line.style.stroke = "black";
                        line.style.strokeWidth = 5;
                        boardSvg.appendChild(line);
                    }
                }

                //finally, add the circle
                boardSvg.appendChild(circle);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var column = event.target.column;
        var row = event.target.row;

        if (this.position.playerCanPlayAt(column, row, currentPlayer)) {
            var option = this.position.getOption(column, row, currentPlayer);
            player.sendMoveToRef(option);
        }
    }

}); //end of TriangularGridColInteractiveView class

/**
 * View Factory for GridDistance Games
 */
var TriangularGridColInteractiveViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new TriangularGridColInteractiveView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of TriangularGridColInteractiveViewFactory

/**
 * Launches a new TriangularGridCol game.
 */
function newTriangularGridColGame() {
    var viewFactory = new TriangularGridColInteractiveViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new TriangularGridCol(width, height, .2);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);

};



//Now Col .  

const GridDistanceGame = Class.create(CombinatorialGame, {

    /**
     * Constructor.  Creates a distance game on a grid where you aren't allowed to play at the sameDistances or differentDistances.  Either columnsOrWidth and height are both natural numbers as the dimensions, or height is undefined and columnsOrWidth is the columns to copy.
     */
    initialize: function (sameDistances, differentDistances, columnsOrWidth, height) {
        this.UNCOLORED = 2;
        this.sameDistances = sameDistances || [];
        this.differentDistances = differentDistances || [];
        if (height === undefined) {
            //no fourth parameter, so columnsOrWidth represents the columns.
            this.columns = columnsOrWidth; //this will get replaced shortly
            this.columns = this.cloneColumns(columnsOrWidth);
        } else {
            this.columns = [];
            for (var i = 0; i < columnsOrWidth; i++) {
                var column = [];
                this.columns.push(column);
                for (var j = 0; j < height; j++) {
                    column.push(this.UNCOLORED);
                }
            }
        }
        this.playerNames = ["Blue", "Red"];
    }

    /**
     * Clones the columns.
     */
    , cloneColumns: function (columns) {
        var columnsClone = [];
        for (var i = 0; i < this.getWidth(); i++) {
            var columnClone = [];
            columnsClone.push(columnClone);
            for (var j = 0; j < this.getHeight(); j++) {
                columnClone.push(columns[i][j]);
            }
        }
        return columnsClone;
    }

    /**
     * Clones this.
     */
    , clone: function () {
        return new GridDistanceGame(this.sameDistances, this.differentDistances, this.columns);
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.columns[0].length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Gets an array of all coordinates (2-tuple) that are at a given distance from the given coordinates on this board.
     */
    , getDistanceCoordinatesFrom: function (column, row, distance) {
        var coordinates = [];
        //these will be laid out in a diamond from (column, row).

        //first do those along the top-right edge
        for (var i = 0; i < distance; i++) {
            var coordinate = [column + i, row - distance + i];
            if (coordinate[0] < this.getWidth() && coordinate[1] >= 0) {
                coordinates.push(coordinate);
            }
        }
        //now the bottom-right edge
        for (var i = 0; i < distance; i++) {
            var coordinate = [column + distance - i, row + i];
            if (coordinate[0] < this.getWidth() && coordinate[1] < this.getHeight()) {
                coordinates.push(coordinate);
            }
        }
        //now the bottom-left edge
        for (var i = 0; i < distance; i++) {
            var coordinate = [column - i, row + distance - i];
            if (coordinate[0] >= 0 && coordinate[1] < this.getHeight()) {
                coordinates.push(coordinate);
            }
        }
        //now the top-left edge
        for (var i = 0; i < distance; i++) {
            var coordinate = [column - distance + i, row - i];
            if (coordinate[0] >= 0 && coordinate[1] >= 0) {
                coordinates.push(coordinate);
            }
        }
        return coordinates;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = [];

        for (var column = 0; column < this.getWidth(); column++) {
            for (var row = 0; row < this.getHeight(); row++) {
                if (this.columns[column][row] == this.UNCOLORED) {
                    if (this.isMoveLegal(column, row, playerId)) {
                        //the move is legal!  Let's put it in there! :)
                        var option = this.getOption(column, row, playerId);
                        options.push(option);
                    }
                }
            }
        }
        return options;
    }

    /**
     * Gets a single option.  This assumes that the move is legal.
     */
    , getOption: function (column, row, playerId) {
        var option = this.clone();
        option.columns[column][row] = playerId;
        return option;
    }

    /**
     * Checks that changing the vertex at [column, row] to color is a legal move.
     */
    , isMoveLegal: function (column, row, color) {
        //
        if (this.columns[column][row] != this.UNCOLORED) {
            return false;
        } else {
            //[column, row] is uncolored, good!

            //now check that the vertices at the illegal same distances have a different color
            for (var i = 0; i < this.sameDistances; i++) {
                var distance = this.sameDistances[i];
                var coordinates = this.getDistanceCoordinatesFrom(column, row, distance);
                for (var j = 0; j < coordinates.length; j++) {
                    var coordinate = coordinates[j];
                    var colorAtCoordinate = this.columns[coordinate[0]][coordinate[1]];
                    //make sure none of these have the same color  (color won't be uncolored, so we're safe there too!)
                    if (colorAtCoordinate == color) {
                        return false;
                    }
                }
            }

            //now check that it doesn't have a different color from the illegal different distances
            for (var i = 0; i < this.differentDistances; i++) {
                var distance = this.differentDistances[i];
                var coordinates = this.getDistanceCoordinatesFrom(column, row, distance);
                for (var j = 0; j < coordinates.length; j++) {
                    var coordinate = coordinates[j];
                    var colorAtCoordinate = this.columns[coordinate[0]][coordinate[1]];
                    //make sure none of these have the same color  (color won't be uncolored, so we're safe there too!)
                    if (colorAtCoordinate != this.UNCOLORED && colorAtCoordinate != color) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

}); //end of GridDistanceGame class
GridDistanceGame.prototype.PLAYER_NAMES = ["Blue", "Red"];


var GridDistanceGameInteractiveView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        var maxDiameter = boxSide; //Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var circle = document.createElementNS(svgNS, "circle");
                var centerX = 5 + Math.floor((colIndex + .5) * boxSide);
                circle.setAttributeNS(null, "cx", centerX);
                var centerY = 5 + Math.floor((rowIndex + .5) * boxSide);
                circle.setAttributeNS(null, "cy", centerY);
                circle.setAttributeNS(null, "r", nodeRadius);
                circle.style.stroke = "black";
                circle.style.strokeWidth = 5;
                if (this.position.columns[colIndex][rowIndex] == CombinatorialGame.prototype.LEFT) {
                    circle.style.fill = "blue";
                } else if (this.position.columns[colIndex][rowIndex] == CombinatorialGame.prototype.RIGHT) {
                    circle.style.fill = "red";
                } else {
                    circle.style.fill = "white";
                    if (listener != undefined) {
                        var player = listener;
                        //circle will be event.target, so give it some extra attributes.
                        circle.column = colIndex;
                        circle.row = rowIndex;
                        circle.onclick = function (event) { player.handleClick(event); }
                    }
                }
                boardSvg.appendChild(circle);
                //now add the edges
                if (colIndex < width - 1) {
                    var line = document.createElementNS(svgNS, "line");
                    line.setAttributeNS(null, "x1", centerX + nodeRadius);
                    line.setAttributeNS(null, "y1", centerY);
                    line.setAttributeNS(null, "x2", centerX + boxSide - nodeRadius);
                    line.setAttributeNS(null, "y2", centerY);
                    line.style.stroke = "black";
                    line.style.strokeWidth = 5;
                    boardSvg.appendChild(line);
                }
                if (rowIndex < height - 1) {
                    var line = document.createElementNS(svgNS, "line");
                    line.setAttributeNS(null, "x1", centerX);
                    line.setAttributeNS(null, "y1", centerY + nodeRadius);
                    line.setAttributeNS(null, "x2", centerX);
                    line.setAttributeNS(null, "y2", centerY + boxSide - nodeRadius);
                    line.style.stroke = "black";
                    line.style.strokeWidth = 5;
                    boardSvg.appendChild(line);
                }
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var column = event.target.column;
        var row = event.target.row;

        if (this.position.isMoveLegal(column, row, currentPlayer)) {
            var option = this.position.getOption(column, row, currentPlayer);
            player.sendMoveToRef(option);
        }
    }

}); //end of GridDistanceGameInteractiveView class

/**
 * View Factory for GridDistance Games
 */
var GridDistanceGameInteractiveViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new GridDistanceGameInteractiveView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of GridDistanceGameInteractiveViewFactory

/**
 * Launches a new Col game.
 */
function newColGame() {
    var viewFactory = new GridDistanceGameInteractiveViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new GridDistanceGame([1], [], width, height);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);

};


//TODO: make a SquareGridGame class that all these grid games inherit from.




/**
 * Class for ConnectFour ruleset.
 */
var ConnectFour = Class.create(CombinatorialGame, {
    /**
     * Constructor.
     */
    initialize: function (width, height, blockers) {
        this.blocks = [new Array(), new Array()];
        blockers = blockers || [new Array(), new Array()];
        for (var playerId = 0; playerId < blockers.length; playerId++) {
            for (var i = 0; i < blockers[playerId].length; i++) {
                var block = blockers[playerId][i];
                this.blocks[playerId].push([block[0], block[1]]);
            }
        }
        this.playerNames = ["Yellow", "Red"];
        this.width = width;
        this.height = height;
    }

    ,/**
     * toString
     */
    toString: function () {
        for (var i = 0; i < this.blocks.length; i++) {
            if (i == 0) {
                string = "Yellow player currently has blocks at: ";
            }
            else {
                string = "Red player currently has blocks at: ";
            }
            for (var j = 0; j < this.blocks[i].length; j++) {
                string += this.blocks[i][j] + ",";
            }
        }
    }

    ,/**
     * Returns the move options.
     */
    getOptionsForPlayer: function (playerId) {
        var moves = new Array();

        var numberOfBlocks = this.blocks[0].length + this.blocks[1].length;
        for (var player = 0; player < 2; player++) {
            for (var blockNumber = 0; blockNumber < this.blocks[player].length; blockNumber++) {
                var blockX = this.blocks[player][blockNumber][0];
                var blockY = this.blocks[player][blockNumber][1];
                var threeToTheRight = 0;
                if (this.indexOf(this.blocks[player], [blockX + 1, blockY]) != -1) {
                    threeToTheRight++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 2, blockY]) != -1) {
                    threeToTheRight++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 3, blockY]) != -1) {
                    threeToTheRight++;
                }
                if (threeToTheRight == 3) {
                    return moves;
                }

                var threeGoingDown = 0;
                if (this.indexOf(this.blocks[player], [blockX, blockY + 1]) != -1) {
                    threeGoingDown++;
                }
                if (this.indexOf(this.blocks[player], [blockX, blockY + 2]) != -1) {
                    threeGoingDown++;
                }
                if (this.indexOf(this.blocks[player], [blockX, blockY + 3]) != -1) {
                    threeGoingDown++;
                }
                if (threeGoingDown == 3) {
                    return moves;
                }

                var threeGoingUpDiagonally = 0;
                if (this.indexOf(this.blocks[player], [blockX + 1, blockY - 1]) != -1) {
                    threeGoingUpDiagonally++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 2, blockY - 2]) != -1) {
                    threeGoingUpDiagonally++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 3, blockY - 3]) != -1) {
                    threeGoingUpDiagonally++;
                }
                if (threeGoingUpDiagonally == 3) {
                    return moves;
                }

                var threeGoingDownDiagonally = 0;
                if (this.indexOf(this.blocks[player], [blockX + 1, blockY + 1]) != -1) {
                    threeGoingDownDiagonally++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 2, blockY + 2]) != -1) {
                    threeGoingDownDiagonally++;
                }
                if (this.indexOf(this.blocks[player], [blockX + 3, blockY + 3]) != -1) {
                    threeGoingDownDiagonally++;
                }
                if (threeGoingDownDiagonally == 3) {
                    return moves;
                }

            }
        }

        for (var column = 0; column < this.width; column++) {
            var row = this.height - 1;
            while ((this.indexOf(this.blocks[0], [column, row]) != -1) || (this.indexOf(this.blocks[1], [column, row]) != -1)) {
                if (row < 0) {
                    break;
                }
                row--;
            }
            if (row >= 0) {
                var option = this.clone();
                option.blocks[playerId].push([column, row]);
                moves.push(option);
            }
        }
        return moves;
    }

    /**
     * Returns whether there is a checker at a given location.
     */
    , hasCheckerAt: function (row, column) {
        return this.indexOf(this.blocks[0], [column, row]) != -1 || this.indexOf(this.blocks[1], [column, row]) != -1;
    }

    /**
     * Returns the row where the top checker sits in a column.  (Rows are backwards; zero is at top.)  If there is no checker in the column, it returns the height.
     */
    , topCheckerRowInColumn: function (column) {
        for (var row = 0; row < this.height; row++) {
            if (this.hasCheckerAt(row, column)) {
                return row;
            }
        }
        return this.height;
    }

    ,/**
     * equals
     */
    equals: function (other) {
        for (var player = 0; player < this.blocks.length; player++) {
            for (var i = 0; i < this.blocks[player].length; i++) {
                var block = this.blocks[player][i];
                var otherHasBlock = false;
                for (var j = 0; j < other.blocks[player].length; j++) {
                    var otherBlock = other.blocks[player][j];
                    if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                        otherHasBlock = true;
                        break;
                    }
                }
                if (!otherHasBlock) return false;
            }
        }

        for (var player = 0; player < other.blocks.length; player++) {
            for (var i = 0; i < other.blocks[player].length; i++) {
                var otherBlock = other.blocks[player][i];
                var thisHasBlock = false;
                for (var j = 0; j < this.blocks[player].length; j++) {
                    var block = this.blocks[player][j];
                    if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                        thisHasBlock = true;
                        break;
                    }
                }
                if (!thisHasBlock) return false;
            }
        }
        return true;
    }

    ,/**
     * Clones
     */
    clone: function () {
        return new ConnectFour(this.width, this.height, this.blocks);
    }

    ,/**
     * Creates an indexOf with arrays in arrays
     */
    indexOf: function (array, element) {
        for (var i = 0; i < array.length; i++) {
            if ((array[i][0] == element[0]) && (array[i][1] == element[1])) {
                return i;
            }
        }
        return -1;
    }

}); //end of ConnectFour class
ConnectFour.prototype.PLAYER_NAMES = ["Yellow", "Red"];


var InteractiveSVGConnectFourView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
    }

    ,/**
     * Draws the checker board and assigns the listener
     */
    draw: function (containerElement, listener) {
        console.log("Top checkered row in column 0: " + this.position.topCheckerRowInColumn(0));
        console.log("Top checkered row in column 1: " + this.position.topCheckerRowInColumn(1));
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.width;
        var height = this.position.height;
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw the checker tiles
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                // var parityString = "even";
                // if ((i+j) % 2 == 1) {
                //     parityString = "odd";
                // }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", String((i * boxSide) + 5));
                checkerTile.setAttributeNS(null, "y", String((j * boxSide) + 5));
                checkerTile.setAttributeNS(null, "width", String(boxSide));
                checkerTile.setAttributeNS(null, "height", String(boxSide));
                // checkerTile.setAttributeNS(null, "class", parityString + "Checker");
                checkerTile.setAttributeNS(null, "class", "connectFour");
                boardSvg.appendChild(checkerTile);
                if (listener != undefined && this.position.topCheckerRowInColumn(i) == j + 1) {
                    var player = listener;
                    checkerTile.column = i;
                    checkerTile.row = j;
                    checkerTile.onclick = function (event) { player.handleClick(event); }
                }

            }
        }

        //draw the pieces
        for (var playerId = 0; playerId < 2; playerId++) {
            for (var i = 0; i < this.position.blocks[playerId].length; i++) {
                var block = this.position.blocks[playerId][i];
                var column = block[0];
                var row = block[1];
                var piece = document.createElementNS(svgNS, "circle");
                piece.setAttributeNS(null, "cx", new String((5 + (column + .5) * boxSide)));
                piece.setAttributeNS(null, "cy", new String((5 + (row + .5) * boxSide)));
                //these two lines round the corners
                piece.setAttributeNS(null, "r", String(.45 * boxSide));
                // dominoRect.setAttributeNS(null, "ry", "10");
                // dominoRect.setAttributeNS(null, "width", new String(100 * (1 + playerId) - 20));
                // dominoRect.setAttributeNS(null, "height", new String(100 * (2 - playerId) - 20));
                piece.setAttributeNS(null, "class", "piece");
                if (playerId == 1) {
                    piece.setAttributeNS(null, "class", "red");
                }
                if (playerId == 0) {
                    piece.setAttributeNS(null, "class", "yellow");
                }
                boardSvg.appendChild(piece);
            }
        }

    }

    ,/**
     * Selects a tile.
     */
    selectTile: function (tile) {
        this.selectedTile = tile;
        this.selectedTile.oldColor = this.selectedTile.style.fill;
        this.selectedTile.style.fill = "red";
    }

    ,/**
     * Deselect piece.
     */
    deselectTile: function () {
        this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
    }

    ,/**
     *
     */
    getNextPositionFromElementLocations: function (element, containerElement, currentPlayer) {
        const column = element.column;
        const row = element.row;
        var nextPosition = this.position.clone();
        //console.log("New domino at [" + column + ", " + row + "]");
        nextPosition.blocks[currentPlayer].push([column, row]);
        return nextPosition;
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target; //this will be a tile
        //console.log("clickedTile: " + clickedTile);
        // if (this.selectedTile == undefined) {
        //     this.selectTile(clickedTile);
        //     return null;
        // } else {
        var nextPosition = this.getNextPositionFromElementLocations(clickedTile, containerElement, currentPlayer);
        // this.deselectTile();
        return nextPosition;
        /*
        //measure the distance between rectangle corners
        var xDistance = Math.abs(clickedTile.x.baseVal.value - this.selectedTile.x.baseVal.value);
        var yDistance = Math.abs(clickedTile.y.baseVal.value - this.selectedTile.y.baseVal.value);
        //make sure this is correct for the current player
        if ((xDistance == 100 * currentPlayer) && (yDistance == 100*(1-currentPlayer))) {
            var column = parseInt(Math.min(clickedTile.x.baseVal.value, this.selectedTile.x.baseVal.value) / 100);
            var row = parseInt(Math.min(clickedTile.y.baseVal.value, this.selectedTile.y.baseVal.value) / 100);
            var nextPosition = this.position.clone();
            //console.log("New domino at [" + column + ", " + row + "]");
            nextPosition.dominoes[currentPlayer].push([column, row]);
            this.deselectTile();
            return nextPosition;
        } else {
            this.deselectTile();
            return null;
        }
        */
        // }
    }
});  //end of InteractiveSVGConnectFourView

var InteractiveSVGConnectFourViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    ,/**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveSVGConnectFourView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveSVGConnectFourViewFactory

function newConnectFourGame() {
    var viewFactory = new InteractiveSVGConnectFourViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    game = new ConnectFour(width, height);
    ref = new Referee(game, players, viewFactory, "gameCanvas", $('messageBox'), controlForm);
};




/////////////////////////////// Demi-Quantum Nim /////////////////////////////////////////

/**
 * Demi-Quantum Nim position.
 * 
 * Piles are stored in a 2D array of ints.  Each element is a realization.
 */
var DemiQuantumNim = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (numRealizations, numPiles, maxPileSize) {
        this.playerNames = ["Left", "Right"];
        this.realizations = new Array();
        for (var i = 0; i < numRealizations; i++) {
            var realization = new Array();
            for (var j = 0; j < numPiles; j++) {
                var pile = Math.floor(Math.random() * (maxPileSize + 1));
                realization.push(pile);
            }
            this.realizations.push(realization);
        }
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        if (this.getHeight() == 0) {
            return 0;
        } else {
            return this.realizations[0].length;
        }
    }

    /**
     * Returns the number of realizations.
     */
    , getNumRealizations: function () {
        return this.getHeight();
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return this.realizations.length;
    }

    /**
     * Returns the number of piles.
     */
    , getNumPiles: function () {
        return this.getWidth();
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var realization = 0; realization < this.realizations.length; realization++) {
            for (var pile = 0; pile < this.realizations[realization].length; pile++) {
                if (this.realizations[realization][pile] != other.realizations[realization][pile]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var other = new DemiQuantumNim(height, width, 5);
        for (var realization = 0; realization < height; realization++) {
            for (var pile = 0; pile < width; pile++) {
                other.realizations[realization][pile] = this.realizations[realization][pile];
            }
        }
        return other;
    }

    /**
     * Returns whether a realization is collapsed out.
     */
    , isRealizationCollapsed: function (realizationIndex) {
        //console.log("realizationIndex: " + realizationIndex);
        for (var pileIndex = 0; pileIndex < this.getNumPiles(); pileIndex++) {
            if (this.realizations[realizationIndex][pileIndex] < 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether a player can play on one of the columns.
     */
    , canPlayPile: function (pileIndex) {
        //var column = this.columns[columnIndex];
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (this.realizations[rIndex][pileIndex] > 0 && !this.isRealizationCollapsed(rIndex)) {
                //there are positive sticks in this pile in a non-collapsed realization
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether a player can play on one of the columns.
     */
    , maxTakeableFromPile: function (pileIndex) {
        //var column = this.columns[columnIndex];
        var maxPileSize = 0;
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (!this.isRealizationCollapsed(rIndex)) {
                maxPileSize = Math.max(maxPileSize, this.realizations[rIndex][pileIndex]);
            }
        }
        return maxPileSize;
    }

    /**
     * Returns the position that results in a player playing in a column.
     */
    , playAtPile: function (pileIndex, numSticks) {
        if (this.maxTakeableFromPile(pileIndex) < numSticks) {
            return null;  //TODO: throw an error?
        }
        var option = this.clone();
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (!this.isRealizationCollapsed(rIndex)) {
                var realization = option.realizations[rIndex];
                realization[pileIndex] -= numSticks;
            }
        }
        return option;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = new Array();
        for (var pileIndex = 0; pileIndex < this.getNumPiles(); pileIndex++) {
            var maxSticks = this.maxTakeableFromPile(pileIndex);
            for (var numSticks = 1; numSticks <= maxSticks; numSticks++) {
                options.push(this.playAtPile(pileIndex, numSticks));
            }
        }
        return options;
    }

}); //end of DemiQuantumNim class




var InteractiveDemiQuantumNimView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.getWidth();
        var height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / (height + 1);
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //get some dimensions based on the canvas size
        var maxBoxSide = boxSide; //Math.min(maxBoxWidth, maxBoxHeight);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the triangle at the top of the column
            if (this.position.canPlayPile(colIndex)) {
                //draw the triangle above the column.  This is where the player will press to select the column.
                //from Robert Longson's answer here: https://stackoverflow.com/questions/45773273/draw-svg-polygon-from-array-of-points-in-javascript
                var triangle = document.createElementNS(svgNS, "polygon");
                triangle.style.stroke = "black";
                var topLeftPoint = boardSvg.createSVGPoint();
                topLeftPoint.x = colIndex * maxBoxSide + 15;
                topLeftPoint.y = 10;
                triangle.points.appendItem(topLeftPoint);
                var topRightPoint = boardSvg.createSVGPoint();
                topRightPoint.x = (colIndex + 1) * maxBoxSide + 5;
                topRightPoint.y = 10;
                triangle.points.appendItem(topRightPoint);
                var bottomPoint = boardSvg.createSVGPoint();
                bottomPoint.x = (colIndex + .5) * maxBoxSide + 10;
                bottomPoint.y = 5 + maxBoxSide;
                triangle.points.appendItem(bottomPoint);
                triangle.style.fill = "black";
                boardSvg.appendChild(triangle);
                //set the listener for the triangle
                if (listener != undefined) {
                    triangle.column = colIndex;
                    var player = listener;
                    triangle.onclick = function (event) { player.handleClick(event); }
                }
                console.log("drawing triangle: " + triangle);
            }
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var box = document.createElementNS(svgNS, "rect");
                var boxX = (10 + colIndex * maxBoxSide);
                var boxY = (10 + (rowIndex + 1) * maxBoxSide);
                box.setAttributeNS(null, "x", boxX + "");
                box.setAttributeNS(null, "y", boxY + "");
                box.setAttributeNS(null, "width", maxBoxSide + "");
                box.setAttributeNS(null, "height", maxBoxSide + "");
                //box.setAttributeNS(null, "class", parityString + "Checker");
                box.style.stroke = "black";
                box.style.fill = "white";
                boardSvg.appendChild(box);

                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                var textX = boxX + maxBoxSide / 3;
                var textY = boxY + 2 * maxBoxSide / 3;
                text.style.fontSize = maxBoxSide / 2 + "px";
                text.setAttributeNS(null, "x", textX + "");
                text.setAttributeNS(null, "y", textY + "");
                text.innerHTML = "" + this.position.realizations[rowIndex][colIndex];
                if (this.position.isRealizationCollapsed(rowIndex)) {
                    text.style.fill = "red";
                } else {
                    text.style.fill = "black";
                }
                boardSvg.appendChild(text);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var pileIndex = event.target.column;
        var maxSticks = this.position.maxTakeableFromPile(pileIndex);
        this.destroyPopup();
        //console.log("Clicked triangle!");
        var self = this;
        //create the popup
        this.popup = document.createElement("div");
        for (var i = 1; i <= maxSticks; i++) {
            var button = document.createElement("button");
            button.appendChild(toNode("" + i));
            button.number = i;
            var extraNum = i;
            button.onclick = function (event) {
                //console.log("event: " + event);
                var source = event.currentTarget;
                //console.log("source: " + source);
                //console.log("I think my number is: " + source.number);
                //console.log("Other possible number: " + i);
                //console.log("Other possible number: " + extraNum);
                self.destroyPopup();
                var option = self.position.playAtPile(pileIndex, source.number);
                player.sendMoveToRef(option);
            };
            this.popup.appendChild(button);
        }

        this.popup.style.position = "fixed";
        this.popup.style.display = "block";
        this.popup.style.opacity = 1;
        this.popup.width = Math.min(window.innerWidth / 2, 100);
        this.popup.height = Math.min(window.innerHeight / 2, 50);
        this.popup.style.left = event.clientX + "px";
        this.popup.style.top = event.clientY + "px";
        document.body.appendChild(this.popup);
        return null;


    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }


});  //end of InteractiveDemiQuantumNimView

/**
 * View Factory for Demi-Quantum Nim
 */
var InteractiveDemiQuantumNimViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveDemiQuantumNimView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveDemiQuantumNimViewFactory

/**
 * Launches a new Demi-Quantum Nim game.
 * TODO: add an option to choose the initial density of purple cells
 */
function newDemiQuantumNimGame() {
    var viewFactory = new InteractiveDemiQuantumNimViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new DemiQuantumNim(height, width, 4);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};




/**
 * Class for Domineering ruleset.
 */
var Domineering = Class.create(CombinatorialGame, {

    /**
     * Constructor
     */
    initialize: function (width, height, startingDominoes, blockedSpaces) {
        startingDominoes = startingDominoes || [new Array(), new Array()];
        this.dominoes = [new Array(), new Array()];
        for (var i = 0; i < startingDominoes.length; i++) {
            for (var j = 0; j < startingDominoes[i].length; j++) {
                var startingDomino = startingDominoes[i][j];
                this.dominoes[i].push([startingDomino[0], startingDomino[1]]);
            }
        }
        blockedSpaces = blockedSpaces || new Array();
        this.blockedSpaces = new Array();
        for (var i = 0; i < blockedSpaces.length; i++) {
            var blockedSpace = blockedSpaces[i];
            this.blockedSpaces.push([blockedSpace[0], blockedSpace[1]]);
        }
        this.width = width;
        this.height = height;
        //this.playerNames = ["Vertical", "Horizontal"];
        //console.log("New domineering game created with " + (this.dominoes[0].length + this.dominoes[1].length) + " dominoes and " + this.blockedSpaces.length + " blocked spaces.");
    }

    ,/**
     * toString
     */
    toString: function () {
        var string = "Domineering position\n";
        for (var i = 0; i < this.dominoes.length; i++) {
            string += this.playerNames[i] + "'s dominoes (top-left corner) are at:\n";
            for (var j = 0; j < this.dominoes[i].length; j++) {
                string += "  " + this.dominoes[i][j] + "\n";
            }
        }
        string += "Blocked Spaces:\n";
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            string += "  " + this.blockedSpaces[i] + "\n";
        }
        return string;
    }

    ,/**
     * Clones this, but replaces dominoes with blocked spaces
     */
    simplify: function () {
        var clone = this.clone();
        for (var playerId = 0; playerId < 2; playerId++) {
            while (clone.dominoes[playerId].length > 0) {
                //domino is upper-left corner of domino
                var domino = clone.dominoes[playerId].pop();
                //console.log("Pushing the domino: " + domino);
                clone.blockedSpaces.push(domino);
                clone.blockedSpaces.push([domino[0] + playerId, domino[1] + (1 - playerId)]);
            }
        }
        return clone;
    }

    ,/**
     * Returns the move options.
     */
    getOptionsForPlayer: function (playerId) {
        var options = new Array();
        var dominoPlacements = this.getDominoMoves(playerId);
        for (var i = 0; i < dominoPlacements.length; i++) {
            var newDomino = dominoPlacements[i];
            var column = newDomino[0];
            var row = newDomino[1];
            var option = this.clone();
            option.dominoes[playerId].push([column, row]);
            //console.log("[" + column + ", " + row + "]");
            options.push(option);
            // console.log("options: " + options);
        }
        /*
        //don't look at the bottom row for vertical player
        for (var row = 0; row < this.height + playerId - 1; row++) {

            //don't look at the right-most column for horizontal
            for (var column = 0; column < this.width - playerId; column++) {
                //the two spaces the domino would take up
                var dominoSpaces = new Array();
                dominoSpaces.push([column, row]);
                dominoSpaces.push([column + playerId, row + (1-playerId)]);

                //create the version of this with dominoes replaced by blocked spots
                var allBlocks = this.simplify();

                var blocked = false;
                //make sure no blocked spaces are in the way
                for (var blockIndex = 0; blockIndex < allBlocks.blockedSpaces.length; blockIndex++) {
                    var block = allBlocks.blockedSpaces[blockIndex]
                    for (var i= 0; i < dominoSpaces.length; i++) {
                        var dominoSpace = dominoSpaces[i];
                        if (block[0] == dominoSpace[0] && block[1] == dominoSpace[1]) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked) break;
                }
                if (!blocked) {
                    var option = this.clone();
                    option.dominoes[playerId].push([column, row]);
                    //console.log("[" + column + ", " + row + "]");
                    options.push(option);
                }
            }
        }*/
        return options;
    }

    ,/**
     * Gets a list of single-domino placement options for the next player.  Does not return entire game states!
     */
    getDominoMoves: function (playerId) {
        var moves = new Array();
        //don't look at the bottom row for vertical player
        for (var row = 0; row < this.height + playerId - 1; row++) {

            //don't look at the right-most column for horizontal
            for (var column = 0; column < this.width - playerId; column++) {
                //the two spaces the domino would take up
                var dominoSpaces = new Array();
                dominoSpaces.push([column, row]);
                dominoSpaces.push([column + playerId, row + (1 - playerId)]);

                //create the version of this with dominoes replaced by blocked spots
                var allBlocks = this.simplify();

                var blocked = false;
                //make sure no blocked spaces are in the way
                for (var blockIndex = 0; blockIndex < allBlocks.blockedSpaces.length; blockIndex++) {
                    var block = allBlocks.blockedSpaces[blockIndex]
                    for (var i = 0; i < dominoSpaces.length; i++) {
                        var dominoSpace = dominoSpaces[i];
                        if (block[0] == dominoSpace[0] && block[1] == dominoSpace[1]) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked) break;
                }
                if (!blocked) {
                    moves.push([column, row]);
                }
            }
        }
        return moves;
    }

    ,/**
     * clone
     */
    clone: function () {
        //
        return new Domineering(this.width, this.height, this.dominoes, this.blockedSpaces);
    }

    ,/**
     * equals
     */
    equals: function (other) {
        //Check that we have matching dominoes.

        //check that other has all of our dominoes
        for (var player = 0; player < this.dominoes.length; player++) {
            for (var i = 0; i < this.dominoes[player].length; i++) {
                var domino = this.dominoes[player][i];
                var otherHasDomino = false;
                for (var j = 0; j < other.dominoes[player].length; j++) {
                    var otherDomino = other.dominoes[player][j];
                    if (domino[0] == otherDomino[0] && domino[1] == otherDomino[1]) {
                        otherHasDomino = true;
                        break;
                    }
                }
                if (!otherHasDomino) return false;
            }
        }

        //now check that we have all of other's dominoes
        //(We don't compare sizes in case there are any repeats.)
        for (var player = 0; player < other.dominoes.length; player++) {
            for (var i = 0; i < other.dominoes[player].length; i++) {
                var otherDomino = other.dominoes[player][i];
                var thisHasDomino = false;
                for (var j = 0; j < this.dominoes[player].length; j++) {
                    var domino = this.dominoes[player][j];
                    if (domino[0] == otherDomino[0] && domino[1] == otherDomino[1]) {
                        thisHasDomino = true;
                        break;
                    }
                }
                if (!thisHasDomino) return false;
            }
        }

        //now check that blocked spaces match

        //check that other has all of our blocked spaces
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            var block = this.blockedSpaces[i];
            var hasBlock = false;
            for (var j = 0; j < other.blockedSpaces.length; j++) {
                var otherBlock = other.blockedSpaces[j];
                if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                    hasBlock = true;
                    break;
                }
            }
            if (!hasBlock) return false;
        }

        //check that this has all of other's blocked spaces
        for (var i = 0; i < other.blockedSpaces.length; i++) {
            var otherBlock = other.blockedSpaces[i]
            var hasBlock = false;
            for (var j = 0; j < this.blockedSpaces.length; j++) {
                var block = this.blockedSpaces[j];
                if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                    hasBlock = true;
                    break;
                }
            }
            if (!hasBlock) return false;
        }

        //all things match! :)
        return true;
    }


}); //end of Domineering class
Domineering.prototype.PLAYER_NAMES = ["Vertical", "Horizontal"];


var InteractiveSVGDomineeringView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
    }

    ,/**
     * Draws the checker board and assigns the listener
     */
    draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.width;
        var height = this.position.height;
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw the checker tiles
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                var parityString = "even";
                if ((i + j) % 2 == 1) {
                    parityString = "odd";
                }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", (i * boxSide) + "");
                checkerTile.setAttributeNS(null, "y", (j * boxSide) + "");
                checkerTile.setAttributeNS(null, "width", String(boxSide));
                checkerTile.setAttributeNS(null, "height", String(boxSide));
                checkerTile.setAttributeNS(null, "class", parityString + "Checker");
                boardSvg.appendChild(checkerTile);
                if (listener != undefined) {
                    var player = listener;
                    checkerTile.row = j;
                    checkerTile.column = i;
                    checkerTile.onclick = function (event) { player.handleClick(event); }
                }

            }
        }

        //draw the dominoes
        for (var playerId = 0; playerId < 2; playerId++) {
            for (var i = 0; i < this.position.dominoes[playerId].length; i++) {
                var domino = this.position.dominoes[playerId][i];
                var column = domino[0];
                var row = domino[1];
                var dominoRect = document.createElementNS(svgNS, "rect");
                dominoRect.setAttributeNS(null, "x", new String((column + .1) * boxSide));
                dominoRect.setAttributeNS(null, "y", new String((row + .1) * boxSide));
                //these two lines round the corners
                dominoRect.setAttributeNS(null, "rx", String(.1 * boxSide));
                dominoRect.setAttributeNS(null, "ry", String(.1 * boxSide));
                dominoRect.setAttributeNS(null, "width", new String(boxSide * (1 + playerId - .2)));
                dominoRect.setAttributeNS(null, "height", new String(boxSide * (2 - playerId - .2)));
                dominoRect.setAttributeNS(null, "class", "domino");
                boardSvg.appendChild(dominoRect);
            }
        }

        //draw the blocked spaces
        for (var i = 0; i < this.position.blockedSpaces.length; i++) {
            // console.log("Adding the block: " + this.position.blockedSpaces[i]);
            var block = this.position.blockedSpaces[i];
            var column = block[0];
            var row = block[1];
            var blockRect = document.createElementNS(svgNS, "rect");
            blockRect.setAttributeNS(null, "x", new String(5 + column * boxSide));
            blockRect.setAttributeNS(null, "y", new String(5 + row * boxSide));
            blockRect.setAttributeNS(null, "width", String(.9 * boxSide));
            blockRect.setAttributeNS(null, "height", String(.9 * boxSide));
            blockRect.setAttributeNS(null, "class", "domino");
            boardSvg.appendChild(blockRect);
        }

    }

    ,/**
     * Selects a tile.
     */
    selectTile: function (tile) {
        this.selectedTile = tile;
        this.selectedTile.oldColor = this.selectedTile.style.fill;
        this.selectedTile.style.fill = "red";
    }

    ,/**
     * Deselect piece.
     */
    deselectTile: function () {
        this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
    }

    ,/**
     *
     */
    getNextPositionFromElementLocations: function (firstElement, secondElement, containerElement, currentPlayer) {
        //measure the distance between rectangle corners
        var xDistance = Math.abs(secondElement.column - firstElement.column);
        var yDistance = Math.abs(secondElement.row - firstElement.row);
        //make sure this is correct for the current player
        if ((xDistance == currentPlayer) && (yDistance == (1 - currentPlayer))) {
            var column = Math.min(firstElement.column, secondElement.column); //parseInt(Math.min(secondElement.x.baseVal.value, firstElement.x.baseVal.value) / 100);
            var row = Math.min(firstElement.row, secondElement.row); //parseInt(Math.min(secondElement.y.baseVal.value, firstElement.y.baseVal.value) / 100);
            var nextPosition = this.position.clone();
            //console.log("New domino at [" + column + ", " + row + "]");
            nextPosition.dominoes[currentPlayer].push([column, row]);
            return nextPosition;
        } else {
            return null;
        }
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target; //this will be a tile
        if (this.selectedTile == undefined) {
            this.selectTile(clickedTile);
            return null;
        } else {
            var nextPosition = this.getNextPositionFromElementLocations(this.selectedTile, clickedTile, containerElement, currentPlayer);
            this.deselectTile();
            return nextPosition;
        }
    }
});  //end of InteractiveSVGDomineeringView

/**
 * View Factory
 */
var InteractiveSVGDomineeringViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    ,/**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveSVGDomineeringView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveSVGDomineeringViewFactory





/**
 * Launches a new Domineering Game.
 */
function newDomineeringGame() {
    var viewFactory = new InteractiveSVGDomineeringViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    game = new Domineering(width, height);
    ref = new Referee(game, players, viewFactory, "gameCanvas", $('messageBox'), controlForm);
};




///////////////////////////// Flag Coloring ////////////////////////////////

/**
 * Flag Coloring.
 * 
 * Grid is stored as a 2D array of strings.
 * @author Kyle Burke
 */
var FlagColoring = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (height, width, colorsList) {
        this.colorsList = colorsList || ["red", "yellow", "green", "blue", "black", "white"];

        this.playerNames = ["Left", "Right"];

        this.columns = new Array();
        for (var colI = 0; colI < width; colI++) {
            var column = new Array();
            for (var rowI = 0; rowI < height; rowI++) {
                column.push(this.colorsList[Math.floor(Math.random() * this.colorsList.length)]);
            }
            this.columns.push(column);
        }
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.columns[0].length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    return false;
                    //} else {
                    //    console.log(col + ", " + row + ": " + this.columns[col][row] + " == " + other.columns[col][row]);
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var other = new FlagColoring(height, width, this.colorsList);
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                other.columns[col][row] = this.columns[col][row];
            }
        }
        return other;
    }

    /**
     * Gets two lists, a list of the vertices in the same region as the current vertex and the neighbors of that region.
     */
    , getRegionAndNeighbors: function (column, row) {

        //unmark all the vertices
        var marks = [];
        for (var i = 0; i < this.getWidth(); i++) {
            var columnMarks = [];
            for (var j = 0; j < this.getHeight(); j++) {
                columnMarks.push(false);
            }
            marks.push(columnMarks);
        }

        //clone the current board (might not need this)
        var clone = this.clone();

        //grow the region out from the current vertex
        var region = [];
        var neighbors = [];

        var regionColor = this.columns[column][row];

        this.getRegionAndNeighborsHelper(column, row, regionColor, marks, region, neighbors);

        return [region, neighbors];
    }

    /**
     * Helper function for getRegionAndNeighbors.  This is void, instead modifying marks, region, and neighbors.
     */
    , getRegionAndNeighborsHelper: function (column, row, regionColor, marks, region, neighbors) {
        if (marks[column][row]) {
            return;
        }
        marks[column][row] = true;

        //check whether we're in the same region
        if (regionColor == this.columns[column][row]) {
            //yes!  Add and keep expanding
            region.push([column, row]);

            //check the four adjacent vertices to keep expanding
            //first to the left
            var nextCol = column - 1;
            var nextRow = row;
            if (nextCol >= 0) {
                this.getRegionAndNeighborsHelper(nextCol, nextRow, regionColor, marks, region, neighbors);
            }

            //next above
            nextCol = column;
            nextRow = row - 1;
            if (nextRow >= 0) {
                this.getRegionAndNeighborsHelper(nextCol, nextRow, regionColor, marks, region, neighbors);
            }

            //next right
            nextCol = column + 1;
            nextRow = row;
            if (nextCol <= this.getWidth() - 1) {
                this.getRegionAndNeighborsHelper(nextCol, nextRow, regionColor, marks, region, neighbors);
            }

            //next below
            nextCol = column;
            nextRow = row + 1;
            if (nextRow <= this.getHeight() - 1) {
                this.getRegionAndNeighborsHelper(nextCol, nextRow, regionColor, marks, region, neighbors);
            }

        } else {
            //we're just a neighbor
            neighbors.push([column, row]);
        }

    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = new Array();
        var width = this.getWidth();
        var height = this.getHeight();

        //check which vertices we've already seen using an array of booleans
        var inRegionAlreadySeen = [];
        for (var col = 0; col < width; col++) {
            var inRegionAlreadySeenColumn = [];
            for (var row = 0; row < height; row++) {
                inRegionAlreadySeenColumn.push(false);
            }
            inRegionAlreadySeen.push(inRegionAlreadySeenColumn);
        }

        //traverse all vertices and add the options there if we haven't yet
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                if (!inRegionAlreadySeen[col][row]) {
                    var regionAndNeighbors = this.getRegionAndNeighbors(col, row);
                    var region = regionAndNeighbors[0];
                    var neighbors = regionAndNeighbors[1];
                    //get all the neighboring colors
                    var neighborColors = [];
                    for (var i = 0; i < neighbors.length; i++) {
                        var neighbor = neighbors[i];
                        var neighborColor = this.columns[neighbor[0]][neighbor[1]];
                        var hasColor = false;
                        if (neighborColor === this.columns[col][row]) {
                            console.log("Tried to add the same color as an option!");
                            break;
                        }
                        for (var j = 0; j < neighborColors.length; j++) {
                            if (neighborColors[j] == neighborColor) {
                                hasColor = true;
                                break;
                            }
                        }
                        if (!hasColor) {
                            neighborColors.push(neighborColor);
                        }
                    }

                    //add moves to each color
                    for (var i = 0; i < neighborColors.length; i++) {
                        var option = this.colorRegion(region, neighborColors[i]);
                        //if (this.equals(option)) {
                        //    console.log("Can't be your own option!");
                        //    console.log("Mine:" + this.columns);
                        //    console.log("Option:" + option.columns);
                        //} else {
                        options.push(option);
                        //}
                    }

                    //mark all vertices in the region as already seen
                    for (var i = 0; i < region.length; i++) {
                        var vertex = region[i];
                        inRegionAlreadySeen[vertex[0]][vertex[1]] = true;
                    }
                }
            }
        }
        return options;
    }

    /**
     * Gets a new position where the given region (list of coordinates) is colored.
     */
    , colorRegion: function (region, color) {
        var clone = this.clone();
        for (var i = 0; i < region.length; i++) {
            var vertex = region[i];
            clone.columns[vertex[0]][vertex[1]] = color;
        }
        return clone;
    }

}); //end of FlagColoring class


var NonInteractiveFlagColoringView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.getWidth();
        var height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the vertices in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {

                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                //square.style.stroke = "black";
                square.style.strokeWidth = 1;
                square.style.fill = this.position.columns[colIndex][rowIndex]; //value is the color
                boardSvg.appendChild(square);
            }
        }
    }

}); //end of NonInteractiveFlagColoringView class.

/**
 * Non-interactive View Factory for FlagColoring
 */
var NonInteractiveFlagColoringViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getNonInteractiveBoard: function (position) {
        return new NonInteractiveFlagColoringView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getNonInteractiveBoard(position);
    }

}); //end of InteractiveFlagColoringViewFactory




var InteractiveFlagColoringView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.getWidth();
        var height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {

                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                //square.style.stroke = "black";
                square.style.strokeWith = 0;
                square.style.fill = this.position.columns[colIndex][rowIndex];
                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.onclick = function (event) { player.handleClick(event); }
                }
                boardSvg.appendChild(square);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        this.destroyPopup();
        console.log("Clicked!");
        var self = this;
        var circle = event.target;
        var column = event.target.column;
        var row = event.target.row;

        //get the list of colors (as neighborColors)

        var regionAndNeighbors = this.position.getRegionAndNeighbors(column, row);
        var region = regionAndNeighbors[0];
        var neighbors = regionAndNeighbors[1];
        //get all the neighboring colors
        var neighborColors = [];
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            var neighborColor = this.position.columns[neighbor[0]][neighbor[1]];
            var hasColor = false;
            for (var j = 0; j < neighborColors.length; j++) {
                if (neighborColors[j] == neighborColor) {
                    hasColor = true;
                    break;
                }
            }
            if (!hasColor) {
                neighborColors.push(neighborColor);
            }
        }

        //console.log("neighborColors: " + neighborColors);


        //create the popup
        this.popup = document.createElement("div");
        for (var i = 0; i < neighborColors.length; i++) {
            var color = neighborColors[i];
            //console.log("color: " + color);
            var button = document.createElement("button");
            button.appendChild(toNode(color));
            const colorX = color;
            button.onclick = function () {
                console.log("Button!");
                self.destroyPopup();
                player.sendMoveToRef(self.position.colorRegion(region, colorX));
            }
            this.popup.appendChild(button);
        }

        this.popup.style.position = "fixed";
        this.popup.style.display = "block";
        this.popup.style.opacity = 1;
        this.popup.width = Math.min(window.innerWidth / 2, 100);
        this.popup.height = Math.min(window.innerHeight / 2, 50);
        this.popup.style.left = event.clientX + "px";
        this.popup.style.top = event.clientY + "px";
        document.body.appendChild(this.popup);
        return null;
    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }

}); //end of InteractiveFlagColoringView class

/**
 * View Factory for FlagColoring
 */
var InteractiveFlagColoringViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveFlagColoringView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveFlagColoringViewFactory

/**
 * Launches a new FlagColoring game.
 */
function newFlagColoringGame() {
    var viewFactory = new InteractiveFlagColoringViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new FlagColoring(height, width);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
}

///////////////////////// End of Flag Coloring





///////////////////////////// Hnefatafl ////////////////////////////////

/**
 * Forced-Capture Hnefatafl.
 * 
 * Grid is represented as:
 *  - Single size that represents the number of squares on a side (must be odd).
 *  - Location (x,y) of the King.
 *  - List of defenders' locations.
 *  - List of attackers' locations.
 * @author Kyle Burke
 */
//var FlagColoring = Class.create(CombinatorialGame, {
var ForcedCaptureHnefatafl = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (size, numDefenders) {
        if (size % 2 != 1) {
            console.log("ERROR: the game doesn't have an odd size!  size: " + size);
            return;
        } else if (numDefenders % 4 != 0) {
            console.log("ERROR: the number of defenders needs to be a multiple of four!  numDefenders: " + numDefenders);
            return;
        }
        this.size = size;
        const mid = (size - 1) / 2;
        this.king = [mid, mid];
        const numAttackers = 2 * numDefenders;
        const numAttackersOnSide = numDefenders / 2;
        //place the attackers
        this.attackers = [];
        var attackersLeftOnSide = numAttackersOnSide;
        var row;
        for (row = 0; attackersLeftOnSide > 0; row++) {
            //size-4 is used because attackers cannot go in the havens and no starting positions contain the spaces next to them.
            //The other number is the largest odd number less than the number of attackers on one side
            var attackersInRow = Math.min(2 * (Math.ceil(attackersLeftOnSide / 2)) - 1, size - Math.max(4, 2 * row));
            if (attackersInRow <= 0) {
                console.log("The number of attackers in the row is zero!  row: " + row + "  attackersLeftOnSide: " + attackersLeftOnSide + "  attackersInRow: " + attackersInRow);
            }
            //attacker in middle of left quadrant
            this.attackers.push([row, mid]);
            //right quadrant
            this.attackers.push([size - row - 1, mid]);
            //top quadrant
            this.attackers.push([mid, row]);
            //bottom quadrant
            this.attackers.push([mid, size - row - 1]);
            for (var i = 1; i < attackersInRow; i += 2) {
                const offset = Math.ceil(i / 2);
                //attackers in left quadrant
                this.attackers.push([row, mid + offset]);
                this.attackers.push([row, mid - offset]);
                //right quadrant
                this.attackers.push([size - row - 1, mid + offset]);
                this.attackers.push([size - row - 1, mid - offset]);
                //top quadrant
                this.attackers.push([mid + offset, row]);
                this.attackers.push([mid - offset, row]);
                //bottom quadrant
                this.attackers.push([mid + offset, size - row - 1]);
                this.attackers.push([mid - offset, size - row - 1]);
            }
            attackersLeftOnSide -= attackersInRow;
        }

        //row is now the first row (moving up from the throne) that doesn't have attackers.  (Is that correct?)
        const minRow = row;

        //now do the defenders
        this.defenders = [];
        //var defenderRowsLeft = mid-row;
        //console.log("defenderRowsLeft: " + defenderRowsLeft);
        var defendersLeftOnSide = numDefenders / 4;
        //console.log("defendersLeftOnSide: " + defendersLeftOnSide);
        var defenderRowMin = 1; //increases by 2 each time so we have at most a square.
        var defendersRowMax = 2; //increases by 1 each time.
        for (row = mid - 1; defendersLeftOnSide > 0; row--) {
            if (row < minRow) {
                console.log("There isn't enough space to place all the defenders!");
                break;
            }
            //in each iteration, put defenders in the given row, then do the same on all sides.
            const defenderRowsLeft = row + 1 - minRow;
            var defendersInRow = defenderRowMin;
            if (defenderRowsLeft == 1) {
                //only one side left, so place all the pieces
                defendersInRow = Math.min(defendersRowMax, defendersLeftOnSide);
            } else if (defendersLeftOnSide >= defenderRowsLeft * defendersRowMax) {
                //we want to place as many as possible
                defendersInRow = defendersRowMax;
            } else {
                defendersInRow = Math.min(defendersRowMax, Math.ceil(defendersLeftOnSide / defenderRowsLeft));
            }
            //const avgDefendersInRow = defendersLeftOnSide / defenderRowsLeft;
            //console.log("avgDefendersInRow: " + avgDefendersInRow);
            if (defenderRowsLeft <= 2) {
                defendersInRow = Math.min(defendersRowMax, Math.ceil(defendersLeftOnSide / defenderRowsLeft));
            } else {
                defendersInRow = Math.min(defendersRowMax, Math.ceil(defendersLeftOnSide / defenderRowsLeft)) + 1;
            }
            //defendersInRow = Math.min(defendersRowMax, Math.ceil(defendersLeftOnSide / defenderRowsLeft));
            //const maxDefendersInSquare = Math.pow(2 * (defenderRowsLeft - 1) + 1, 2) - 1;
            //var thisRowMin = Math.max(defenderRowMin, defendersLeftOnSide - maxDefendersInSquare/4);
            //const defendersInRow = Math.min(defendersLeftOnSide, thisRowMin); //the actual min 

            const parity = (defendersInRow + (mid - row)) % 2;
            //if it's in the middle, place it
            if (parity == 1) {
                //middle defender in left quadrant
                this.defenders.push([row, mid]);
                //right quadrant
                this.defenders.push([size - 1 - row, mid]);
                //top quadrant
                this.defenders.push([mid, row]);
                //bottom quadrant
                this.defenders.push([mid, size - 1 - row]);
            }
            console.log("parity:" + parity + "  defendersInRow: " + defendersInRow);
            for (var i = parity; i < defendersInRow; i += 1) {
                console.log("i:" + i);
                const offset = Math.ceil(i / 2);
                //defenders in left quadrant
                this.defenders.push([row, mid + (Math.pow(-1, i + 1) * offset)]);
                //this.defenders.push([row, mid - offset]); //TODO: this one maybe shouldn't be here.  if i = defendersInRow-1. Right???
                //right quadrant
                //this.defenders.push([size - 1 - row, mid + offset]);
                this.defenders.push([size - 1 - row, mid - (Math.pow(-1, i + 1) * offset)]); //TODO: this one maybe shouldn't be here.  if i = defendersInRow-1. Right???
                //top quadrant
                //this.defenders.push([mid + (Math.pow(-1, i+1) * offset), row]);
                this.defenders.push([mid - (Math.pow(-1, i + 1) * offset), row]); //TODO: this one maybe shouldn't be here.  if i = defendersInRow-1. Right???
                //bottom quadrant
                this.defenders.push([mid + (Math.pow(-1, i + 1) * offset), size - 1 - row]);
                //this.defenders.push([mid - (Math.pow(-1, i+1) * offset), size - 1 - row]); //TODO: this one maybe shouldn't be here.  if i = defendersInRow-1. Right???

            }
            defendersLeftOnSide -= defendersInRow;
            defendersRowMax += 1;
            //defenderRowMin += 2;
        }

        this.attackers.sort();
        this.defenders.sort();


        this.playerNames = ["Attackers", "Defenders"];
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.size;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return this.size;
    }

    /**
     * Returns the number of pieces in this game.
     */
    , getNumPieces: function () {
        var numPieces = this.attackers.length + this.defenders.length;
        if (this.king[0] != -1) {
            numPieces++;
        }
        return numPieces;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.size != other.size || this.king[0] != other.king[0] || this.king[1] != other.king[1] || this.defenders.length != other.defenders.length || this.attackers.length != other.attackers.length) {
            return false;
        }

        //the lists of attackers and defenders need to remain sorted, so we can just traverse them to check equality.  Sadly, we can't just use array.equals.  
        for (var i = 0; i < this.attackers.length; i++) {
            if (this.attackers[i][0] != other.attackers[i][0] || this.attackers[i][1] != other.attackers[i][1]) {
                return false;
            }
        }
        for (var i = 0; i < this.defenders.length; i++) {
            if (this.defenders[i][0] != other.defenders[i][0] || this.defenders[i][1] != other.defenders[i][1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var other = new ForcedCaptureHnefatafl(this.size, 0);
        other.king = this.king;
        other.attackers = [];
        for (var i = 0; i < this.attackers.length; i++) {
            const attacker = this.attackers[i];
            other.attackers.push([attacker[0], attacker[1]]);
        }
        other.defenders = [];
        for (var i = 0; i < this.defenders.length; i++) {
            const defender = this.defenders[i];
            other.defenders.push([defender[0], defender[1]]);
        }
        return other;
    }

    /**
     * Returns whether there's nothing but space between two pieces (and that the pieces are lined up).  kingToMove is a boolean that explains whether the king is the one to move.
     */
    , clearBetween: function (startCol, startRow, endCol, endRow, includeEnd) {
        if (includeEnd === undefined) {
            includeEnd = false;
        }
        if (includeEnd) {
            const actualEnd = [endCol, endRow];
            if (startCol == endCol) {
                if (startRow > endRow) {
                    actualEnd[1] = endRow - 1;
                } else if (startRow < endRow) {
                    actualEnd[1] = endRow + 1;
                } else {
                    return false;
                }
            } else if (startRow == endRow) {
                if (startCol > endCol) {
                    actualEnd[0] = endCol - 1;
                } else if (startCol < endCol) {
                    actualEnd[0] = endCol + 1;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            return this.clearBetween(startCol, startRow, actualEnd[0], actualEnd[1], false);
        }
        const kingToMove = startCol == this.king[0] && startRow == this.king[1];
        const mid = (this.size - 1) / 2;
        if (startRow == endRow) {
            const lowerCol = Math.min(startCol, endCol);
            const upperCol = Math.max(startCol, endCol);
            if ((!kingToMove) && startRow == mid && lowerCol < mid && upperCol > mid) {
                //throne is in the way 
                return false;
            }
            if (upperCol - lowerCol <= 1) {
                return false; //pieces are adjacent; can't move
            }
            if (this.king[1] == startRow && this.king[0] < upperCol && this.king[0] > lowerCol) {
                return false; //king is between
            }
            for (var i = 0; i < this.attackers.length; i++) {
                var attacker = this.attackers[i];
                if (attacker[1] == startRow && attacker[0] < upperCol && attacker[0] > lowerCol) {
                    return false;
                }
            }
            for (var i = 0; i < this.defenders.length; i++) {
                var defender = this.defenders[i];
                if (defender[1] == startRow && defender[0] < upperCol && defender[0] > lowerCol) {
                    return false;
                }
            }
        } else if (startCol == endCol) {
            const lowerRow = Math.min(startRow, endRow);
            const upperRow = Math.max(startRow, endRow);
            if ((!kingToMove) && startCol == mid && lowerRow < mid && upperRow > mid) {
                //throne is in the way. 
                return false;
            }
            if (upperRow - lowerRow <= 1) {
                return false; //pieces are adjacent; can't move
            }
            if (this.king[0] == startCol && this.king[1] < upperRow && this.king[1] > lowerRow) {
                return false; //king is between
            }
            for (var i = 0; i < this.attackers.length; i++) {
                var piece = this.attackers[i];
                if (piece[0] == startCol && piece[1] < upperRow && piece[1] > lowerRow) {
                    return false; //attacker piece between
                }
            }
            for (var i = 0; i < this.defenders.length; i++) {
                var piece = this.defenders[i];
                if (piece[0] == startCol && piece[1] < upperRow && piece[1] > lowerRow) {
                    return false; //defender piece between
                }
            }
        } else {
            return false; //they aren't even lined up together.
        }
        return true;
    }

    /**
     * Removes a piece from the board.  The playerId is the owner of the piece.
     */
    , removePieceAt: function (coords, playerId) {
        //first check for the king
        if (playerId == 1 && this.coordinatesEquals(coords, this.king)) {
            this.king = [-1, -1];
        } else {
            const pieces = playerId == 0 ? this.attackers : this.defenders;
            var removed = false;
            for (var i = 0; i < pieces.length; i++) {
                if (this.coordinatesEquals(coords, pieces[i])) {
                    pieces.splice(i, 1);
                    removed = true;
                    break;
                }
            }
            if (!removed) {
                throw new Error("Didn't remove a piece!  coords: " + coords);
            }
        }
    }

    /**
     * Returns whether there is a piece for the given player at the specified index.
     */
    , hasPieceForPlayer: function (coords, playerId) {
        if (playerId == 1 && this.coordinatesEquals(coords, this.king)) {
            return true;
        }
        const pieces = playerId == 0 ? this.attackers : this.defenders;
        for (var i = 0; i < pieces.length; i++) {
            if (this.coordinatesEquals(coords, pieces[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether the specified piece is moveable for the given player.
     */
    , isMoveablePiece: function (coords, playerId) {
        //first check whether there's a piece for that player at that position
        if (!this.hasPieceForPlayer(coords, playerId)) {
            return false;
        }
        const options = this.getOptionsForPlayer(playerId);
        for (var i = 0; i < options.length; i++) {
            const option = options[i];
            if (!option.hasPieceForPlayer(coords, playerId)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        if (this.isGameOver()) {
            return [];
        }
        const captureOptions = [];
        const nonCaptureOptions = [];
        const mine = playerId == 0 ? this.attackers : this.defenders;
        var numMine = mine.length;
        if (playerId == 1) {
            numMine++; //one more for the king
        }
        for (var i = 0; i < numMine; i++) {
            var piece;
            var isKing;
            if (i == mine.length) { //and it must be the defenders player
                piece = this.king;
                isKing = true;
            } else {
                piece = mine[i];
                isKing = false;
            }
            var col = piece[0];
            var row = piece[1];
            //look above
            for (row -= 1; row >= 0; row--) {
                if (this.canMoveThrough([col, row], isKing)) {
                    this.addOption(piece, [col, row], playerId, captureOptions, nonCaptureOptions);
                    //options.push(this.getOption(i, col, row, playerId));
                } else {
                    break;
                }
            }
            //look below
            for (row = piece[1] + 1; row < this.size; row++) {
                if (this.canMoveThrough([col, row], isKing)) {
                    this.addOption(piece, [col, row], playerId, captureOptions, nonCaptureOptions);
                    //options.push(this.getOption(i, col, row, playerId));
                } else {
                    break;
                }
            }
            //look left
            row = piece[1]; //reset the row
            for (col--; col >= 0; col--) {
                if (this.canMoveThrough([col, row], isKing)) {
                    this.addOption(piece, [col, row], playerId, captureOptions, nonCaptureOptions);
                    //options.push(this.getOption(i, col, row, playerId));
                } else {
                    break;
                }
            }
            //look right
            for (col = piece[0] + 1; col < this.size; col++) {
                if (this.canMoveThrough([col, row], isKing)) {
                    this.addOption(piece, [col, row], playerId, captureOptions, nonCaptureOptions);
                    //options.push(this.getOption(i, col, row, playerId));
                } else {
                    break;
                }
            }
        }

        if (captureOptions.length > 0) {
            //console.log("There are capture moves.");
            return captureOptions;
        } else {
            //console.log("No capture moves.");
            return nonCaptureOptions;
        }
    }

    /**
     * Adds an option to the appropriate list.
     */
    , addOption: function (source, destination, playerId, captureOptions, nonCaptureOptions) {
        const option = this.getOptionFromMove(source, destination, playerId);
        if (this.isCaptureMove(source, destination, playerId)) {
            captureOptions.push(option);
        } else {
            nonCaptureOptions.push(option);
        }
    }

    /**
     * Returns an option from a move.
     */
    , getOptionFromMove: function (source, destination, playerId) {
        //check whether the piece can legally move 
        if (!this.clearBetween(source[0], source[1], destination[0], destination[1], true)) {
            return this; //failed move
        }
        const option = this.clone();
        if (option.isCaptureMove(source, destination, playerId)) {
            //we need to remove all of the victims 
            const victimsAndAnvils = option.getVictimAndAnvilsCoordinates(source, destination);
            for (var i = 0; i < victimsAndAnvils.length; i++) {
                const victimSpace = victimsAndAnvils[i][0];
                const anvilSpace = victimsAndAnvils[i][1];
                if (option.containsVictim(victimSpace, playerId) && option.containsAnvil(anvilSpace, playerId)) {
                    option.removePieceAt(victimSpace, 1 - playerId);
                }
            }
        }

        //now move the piece that shifted
        if (playerId == 1 && option.coordinatesEquals(option.king, source)) {
            option.king = destination;
        } else {
            const pieces = playerId == 0 ? option.attackers : option.defenders;
            for (var i = 0; i < pieces.length; i++) {
                const piece = pieces[i];
                if (option.coordinatesEquals(piece, source)) {
                    pieces[i] = destination;
                }
            }
            pieces.sort();
        }
        return option;

    }

    /**
     * Returns whether there's a capture move available with a hammer and an anvil.  (Assumes that the anvil is a valid anvil.)  
     */
    , isCaptureMove: function (source, destination, playerId) {
        if (!this.clearBetween(source[0], source[1], destination[0], destination[1], true)) {
            return false;
        }
        const victimsAndAnvils = this.getVictimAndAnvilsCoordinates(source, destination);
        for (var i = 0; i < victimsAndAnvils.length; i++) {
            const victimSpace = victimsAndAnvils[i][0];
            const anvilSpace = victimsAndAnvils[i][1];
            if (this.containsVictim(victimSpace, playerId) && this.containsAnvil(anvilSpace, playerId)) {
                return true;
            }
        }
        //now check whether the king is safe.  (That counts!)
        if (this.coordinatesEquals(source, this.king)) {
            const last = this.size - 1;
            return (this.coordinatesEquals(destination, [0, 0]) || this.coordinatesEquals(destination, [0, last]) || this.coordinatesEquals(destination, [last, 0]) || this.coordinatesEquals(destination, [last, last]));
        }
        return false;

    }


    /**
     * Determines whether a player has a capturing move.
     */
    , hasCaptureMove: function (playerId) {
        if (this.isGameOver()) {
            return false;
        }
        const mine = playerId == 0 ? this.attackers : this.defenders;
        var numMine = mine.length;
        if (playerId == 1) {
            numMine++; //one more for the king
        }
        for (var i = 0; i < numMine; i++) {
            var piece;
            var isKing;
            if (i == mine.length) { //and it must be the defenders player
                piece = this.king;
                isKing = true;
            } else {
                piece = mine[i];
                isKing = false;
            }
            var col = piece[0];
            var row = piece[1];
            //look above
            for (row -= 1; row >= 0; row--) {
                if (this.canMoveThrough([col, row], isKing)) {
                    if (this.isCaptureMove(piece, [col, row], playerId)) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            //look below
            for (row = piece[1] + 1; row < this.size; row++) {
                if (this.canMoveThrough([col, row], isKing)) {
                    if (this.isCaptureMove(piece, [col, row], playerId)) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            //look left
            row = piece[1]; //reset the row
            for (col--; col >= 0; col--) {
                if (this.canMoveThrough([col, row], isKing)) {
                    if (this.isCaptureMove(piece, [col, row], playerId)) {
                        return true;
                    }
                } else {
                    break;
                }
            }
            //look right
            for (col = piece[0] + 1; col < this.size; col++) {
                if (this.canMoveThrough([col, row], isKing)) {
                    if (this.isCaptureMove(piece, [col, row], playerId)) {
                        return true;
                    }
                } else {
                    break;
                }
            }
        }

        return false;
        /*
        const mine = playerId == 0 ? this.attackers : this.defenders;
        var numMine = mine.length;
        if (playerId == 1) {
            numMine ++; //one more for the king
        }
        for (var i = 0; i < numMine; i++) {
            var hammer;
            if (i == mine.length) { //and it must be the defenders player
                hammer = this.king;
            } else {
                hammer = mine[i];
            }
            //check all the anvils who are in the mine list
            for (var j = 0; j < mine.length; j++) {
                var anvil = mine[j];
                const destination = this.getMoveLocation(hammer, anvil);
                console.log("destination: " + destination);
                //if (this.isCaptureMove(hammer[0], hammer[1], anvil[0], anvil[1], playerId)) {
                if (destination != undefined && this.isCaptureMove(hammer, destination, playerId)) {
                    return true;
                }
            }
            //now check the other possible anvils (havens and the king, if defending)
            const last = this.size - 1;
            const mid = (this.size - 1)/2;
            var otherAnvils = [[0, 0], [0, last], [last, 0], [last, last]];
            if (playerId == 1) {
                //add the king
                otherAnvils.push(this.king);
            }
            for (var j = 0; j < otherAnvils.length; j++) {
                var anvil = otherAnvils[j];
                const destination = this.getMoveLocation(hammer, anvil);
                console.log("destination: " + destination);
                //if (this.isCaptureMove(hammer[0], hammer[1], anvil[0], anvil[1], playerId)) {
                if (destination != undefined && this.isCaptureMove(hammer, destination, playerId)) {
                    return true;
                }
            }
        }
        //didn't find a capturing move
        return false
        */
    }

    /**
     * Returns the coordinates for a the hammer to land on a hammer/anvil attack.
     */
    , getMoveLocation: function (hammer, anvil) {
        if (hammer[0] == anvil[0]) {
            if (hammer[1] < anvil[1] - 2) {
                return [hammer[0], anvil[1] - 2];
            } else if (hammer[1] > anvil[1] + 2) {
                return [hammer[0], anvil[1] + 2];
            } else {
                //console.log("ERROR!  Not a legal hammer and anvil move! Hammer: " + hammer + "   anvil: " + anvil);
            }
        } else if (hammer[1] == anvil[1]) {
            if (hammer[0] < anvil[0] - 2) {
                return [anvil[0] - 2, anvil[1]];
            } else if (hammer[1] > anvil[0] + 2) {
                return [anvil[0] + 2, anvil[1]];
            } else {
                //console.log("ERROR!  Not a legal hammer and anvil move! Hammer: " + hammer + "   anvil: " + anvil);
            }
        } else {
            //console.log("ERROR!  Not a legal hammer and anvil move! Hammer: " + hammer + "   anvil: " + anvil);
        }
    }

    /**
     * Returns lists of the coordinates that could be a victim and anvil in the case of a move.  It does not check whether those pieces are there.  Result: list of pairs: [victimCoords, anvilCoords].
     */
    , getVictimAndAnvilsCoordinates: function (hammer, destination) {
        const last = this.size - 1;
        const below = [];
        if (destination[1] < this.size - 2) {
            below.push([[destination[0], destination[1] + 1], [destination[0], destination[1] + 2]]);
        }
        const above = [];
        if (destination[1] > 1) {
            above.push([[destination[0], destination[1] - 1], [destination[0], destination[1] - 2]]);
        }
        const left = [];
        if (destination[0] > 1) {
            left.push([[destination[0] - 1, destination[1]], [destination[0] - 2, destination[1]]]);
        }
        const right = [];
        if (destination[0] < this.size - 2) {
            right.push([[destination[0] + 1, destination[1]], [destination[0] + 2, destination[1]]]);
        }
        const victimAndAnvilPairs = [];
        victimAndAnvilPairs.push(...below);
        victimAndAnvilPairs.push(...above);
        victimAndAnvilPairs.push(...left);
        victimAndAnvilPairs.push(...right);
        return victimAndAnvilPairs;
    }

    /**
     * Returns whether the game is over.
     */
    , isGameOver: function () {
        const last = this.size - 1;
        if (this.king[0] == -1) {
            //the king is dead!
            return true;
        } else if (this.coordinatesEquals(this.king, [0, 0]) || this.coordinatesEquals(this.king, [0, last]) || this.coordinatesEquals(this.king, [last, 0]) || this.coordinatesEquals(this.king, [last, last])) {
            return true; //the king escaped!
        }
        return false;
    }

    /**
     * Returns whether two sets of coordinates are equal.
     */
    , coordinatesEquals: function (coordsA, coordsB) {
        return coordsA[0] == coordsB[0] && coordsA[1] == coordsB[1];
    }

    /**
     * Returns whether a space is empty.
     */
    , canMoveThrough: function (coords, isKing) {
        const mid = (this.size - 1) / 2;
        const last = this.size - 1;
        //check the special spaces
        if (this.coordinatesEquals(coords, [0, 0]) || this.coordinatesEquals(coords, [0, last]) || this.coordinatesEquals(coords, [last, 0]) || this.coordinatesEquals(coords, [last, last]) || this.coordinatesEquals(coords, [mid, mid])) {
            return isKing;
        }
        //otherwise, check the lists of pieces (and the king)
        if (this.coordinatesEquals(coords, this.king)) {
            return false;
        }
        for (var i = 0; i < this.attackers.length; i++) {
            if (this.coordinatesEquals(coords, this.attackers[i])) {
                return false;
            }
        }
        for (var i = 0; i < this.defenders.length; i++) {
            if (this.coordinatesEquals(coords, this.defenders[i])) {
                return false;
            }
        }
        //there's nothing in that space blocking us!  Let's go! :)
        return true;
    }

    /**
     * Returns whether the space contains a working anvil. TODO: doesn't check for the Throne.
     */
    , containsAnvil: function (anvilCoords, playerId) {
        const last = this.size - 1;
        const mid = last / 2;
        //check for the havens
        if (this.coordinatesEquals(anvilCoords, [0, 0]) || this.coordinatesEquals(anvilCoords, [0, last]) || this.coordinatesEquals(anvilCoords, [last, 0]) || this.coordinatesEquals(anvilCoords, [last, last])) {
            return true;
        }

        //check for the king
        if (playerId == 1 && this.coordinatesEquals(this.king, anvilCoords)) {
            return true;
        }

        //check for a teammate
        const pieces = playerId == 0 ? this.attackers : this.defenders;
        for (var i = 0; i < pieces.length; i++) {
            if (this.coordinatesEquals(anvilCoords, pieces[i])) {
                return true;
            }
        }
        return false;

    }

    /**
     * Returns whether the space contains a victim.  (Opposite id of the playerId.)
     */
    , containsVictim: function (victimCoords, playerId) {
        //check for the king
        if (playerId == 0 && this.coordinatesEquals(this.king, victimCoords)) {
            return true;
        }
        //check for an opposing piece
        const pieces = playerId == 1 ? this.attackers : this.defenders;
        for (var i = 0; i < pieces.length; i++) {
            if (this.coordinatesEquals(victimCoords, pieces[i])) {
                return true;
            }
        }
        return false;



    }

}); //end of ForcedCaptureHnefatafl class
ForcedCaptureHnefatafl.prototype.PLAYER_NAMES = ["Attacker", "Defender"];




const InteractiveForcedCaptureHnefataflView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        this.selectedTile = undefined;
        //let's write the board contents out so we can traverse it that way
        const contents = [];
        const last = this.position.size - 1;
        //const mid = last/2;
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }
        contents[0][0] += "haven";
        contents[0][last] += "haven";
        contents[last][0] += "haven";
        contents[last][last] += "haven";
        contents[last / 2][last / 2] += "throne";
        if (this.position.king[0] != -1) { //otherwise the king's been captured
            contents[this.position.king[0]][this.position.king[1]] += "king";
        }
        for (var i = 0; i < this.position.defenders.length; i++) {
            var defender = this.position.defenders[i];
            contents[defender[0]][defender[1]] += "defender";
        }
        for (var i = 0; i < this.position.attackers.length; i++) {
            var attacker = this.position.attackers[i];
            contents[attacker[0]][attacker[1]] += "attacker";
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        var width = this.position.getWidth();
        var height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / (height + 1); //plus 1 because of the space for messages
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var text = "";
                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                square.style.stroke = "black";
                square.style.strokeWith = 2;
                square.style.fill = "gray";
                var content = contents[colIndex][rowIndex];
                if (content.includes("haven")) {
                    square.style.fill = "orange";
                }
                if (content.includes("throne")) {
                    square.style.fill = "burlywood";
                }
                if (content.includes("king")) {
                    text = "K";
                }
                if (content.includes("attacker")) {
                    text = "A";
                }
                if (content.includes("defender")) {
                    text = "D";
                }

                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.box = square; // so the text and this can both refer to the square itself
                    square.onclick = function (event) { player.handleClick(event); }
                    square.text = text;
                }
                boardSvg.appendChild(square);

                if (text != "") {
                    const textBuffer = Math.ceil(.17 * boxSide);
                    const textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", x + textBuffer);//+ 20);
                    textElement.setAttributeNS(null, "y", y + boxSide - textBuffer);//+ 20);
                    const textSize = Math.ceil(.8 * boxSide);
                    textElement.setAttributeNS(null, "font-size", textSize);
                    if (text == "A") {
                        textElement.setAttributeNS(null, "color", "black");
                    } else {
                        //textElement.setAttributeNS(null, "color", "white");
                        //textElement.style.color = "white";
                        textElement.style.fill = "white";
                    }

                    textElement.textContent = text;
                    textElement.column = colIndex;
                    textElement.row = rowIndex;
                    textElement.box = square;
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "single";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.box = square; // so the text and this can both refer to the square itself
                        square.onclick = function (event) { player.handleClick(event); }
                        textElement.onclick = function (event) { player.handleClick(event); }
                    }
                    boardSvg.appendChild(textElement);
                }
            }
        }
        if (listener != undefined) {
            const playerId = listener.playerIndex;
            //console.log("playerId: " + playerId);
            //console.log("capture move? " + this.position.hasCaptureMove(playerId));
            if (this.position.hasCaptureMove(listener.playerIndex)) {
                //console.log("Displaying capture move message!");
                const captureMessage = document.createElementNS(svgNS, "text");
                captureMessage.textContent = "There is a forced move.";
                captureMessage.setAttributeNS(null, "x", 1.1 * boxSide);
                captureMessage.setAttributeNS(null, "y", (this.position.getHeight() + .6) * boxSide);
                captureMessage.setAttributeNS(null, "font-size", .4 * boxSide);
                captureMessage.setAttributeNS(null, "color", "black");
                boardSvg.appendChild(captureMessage);
            }
        }
    }

    /**
     * Selects a tile.
     */
    , selectTile: function (tile) {
        this.selectedTile = tile;
        this.selectedTile.oldColor = this.selectedTile.style.fill;
        this.selectedTile.style.fill = "green";
    }

    /**
     * Deselect tile.
     */
    , deselectTile: function () {
        this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target.box; //this will be a tile
        //console.log("clickedTile: " + clickedTile);
        //console.log("currentPlayer: " + currentPlayer);
        if (this.selectedTile === undefined) {
            const text = clickedTile.text;
            if ((currentPlayer == 0 && text == "A") ||
                (currentPlayer == 1 && (text == "D" || text == "K"))) {
                if (this.position.isMoveablePiece([clickedTile.column, clickedTile.row], currentPlayer)) {
                    this.selectTile(clickedTile);
                } else {
                    console.log("There is another piece that has a forced move.");
                }
            }
            return null;
        } else {
            const source = [this.selectedTile.column, this.selectedTile.row];
            const destination = [clickedTile.column, clickedTile.row];
            //console.log("Source: " + source + "   Destination: " + destination);
            const option = this.position.getOptionFromMove(source, destination, currentPlayer);
            //const option = this.position.getMoveAttempt(this.selectedTile.column, this.selectedTile.row, clickedTile.column, clickedTile.row, currentPlayer);
            this.deselectTile();
            return option;
        }
    }

}); //end of InteractiveForcedCaptureHnefataflView class

/**
 * View Factory for ForcedCaptureHnefatafl
 */
var InteractiveForcedCaptureHnefataflViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveForcedCaptureHnefataflView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveForcedCaptureHnefataflViewFactory

/**
 * Launches a new ForcedCaptureHnefatafl game.
 */
function newForcedCaptureHnefataflGame() {
    var viewFactory = new InteractiveForcedCaptureHnefataflViewFactory();
    var playDelay = 1000;
    var size = parseInt($('boardSize').value);
    var numDefenders = parseInt($('numDefenders').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new ForcedCaptureHnefatafl(size, numDefenders);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of Hnefatafl




///////////////////////////// Geography ////////////////////////////////

/**
 * Generalized Geography on a 2-D grid.
 * 
 * Grid is represented as:
 *  - board 2D grid of board contents as strings: 
 *    * "O" for an unvisited vertex
 *    * "X" for a visited vertex
 *    * "T" for the vertex with the token
 *    * "R" for an edge going left-to-right
 *    * "L" for an edge going left
 *    * "U" for an edge going up
 *    * "D" for an edge going down
 *    * "UR" for an edge going diagonally up and to the right
 *    * "UL" for an edge going up and to the left
 *    * "DR" edge going down and to the right
 *    * "DL" edge going down and to the left
 * 
 * @author Kyle Burke
 */
var GeographyGrid = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (size) {
        this.playerNames = GeographyGrid.prototype.PLAYER_NAMES;
        const width = size;
        const height = size;
        const upDown = ["U", "D"];
        const leftRight = ["L", "R"];
        const diagonals = ["UR", "UL", "DR", "DL"];
        this.board = [];
        for (var i = 0; i < 2 * width - 1; i++) {
            const column = [];
            column.push("O");
            for (var j = 1; j < 2 * height - 1; j++) {
                column.push(upDown[Math.floor(Math.random() * 2)]);
                j++;
                column.push("O");
            }
            this.board.push(column);
            i++;
            if (i == 2 * width - 1) {
                break;
            }
            const onlyEdgesCol = [];
            onlyEdgesCol.push(leftRight[Math.floor(Math.random() * 2)]);
            for (var j = 1; j < 2 * height - 1; j++) {
                onlyEdgesCol.push(diagonals[Math.floor(Math.random() * 4)]);
                j++;
                onlyEdgesCol.push(leftRight[Math.floor(Math.random() * 2)]);
            }
            this.board.push(onlyEdgesCol);
        }
        //offsets here prevent it from being on the side
        const tokenX = Math.floor(Math.random() * (width - 2)) + 1;
        const tokenY = Math.floor(Math.random() * (height - 2)) + 1;
        this.board[2 * tokenX][2 * tokenY] = "T";
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return (this.board.length + 1) / 2;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return (this.board[0].length + 1) / 2;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        return omniEquals(this.board, other.board);
    }

    /**
     * Clone.
     */
    , clone: function () {
        var clone = new GeographyGrid(this.getWidth());
        clone.board = [];
        for (var i = 0; i < this.board.length; i++) {
            const col = [];
            for (var j = 0; j < this.board[i].length; j++) {
                col.push(this.board[i][j]);
            }
            clone.board.push(col);
        }
        return clone;
    }

    /**
     * Returns the eight possible directions.
     */
    , getDirections: function () {
        return [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    }

    /**
     * Returns the position of the token in the model, counting the spaces for edges
     */
    , getTokenCoords: function () {
        for (var i = 0; i < this.board.length; i += 2) {
            for (var j = 0; j < this.board[0].length; j += 2) {
                if (this.board[i][j] == "T") {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const options = [];
        const tokenCoords = this.getTokenCoords();
        const tokenI = tokenCoords[0];
        const tokenJ = tokenCoords[1];
        //look in each possible direction and add the move if we can go there

        //left and down
        if (tokenI > 0 && tokenJ < this.board[0].length - 1) {
            if (this.board[tokenI - 1][tokenJ + 1] == "DL" && this.board[tokenI - 2][tokenJ + 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI - 2][tokenJ + 2] = "T";
                options.push(option);
            }
        }
        //left
        if (tokenI > 0) {
            if (this.board[tokenI - 1][tokenJ] == "L" && this.board[tokenI - 2][tokenJ] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI - 2][tokenJ] = "T";
                options.push(option);
            }
        }
        //left and up
        if (tokenI > 0 && tokenJ > 0) {
            if (this.board[tokenI - 1][tokenJ - 1] == "UL" && this.board[tokenI - 2][tokenJ - 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI - 2][tokenJ - 2] = "T";
                options.push(option);
            }
        }
        //up
        if (tokenJ > 0) {
            if (this.board[tokenI][tokenJ - 1] == "U" && this.board[tokenI][tokenJ - 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI][tokenJ - 2] = "T";
                options.push(option);
            }
        }
        //up and right
        if (tokenI < this.board.length - 1 && tokenJ > 0) {
            if (this.board[tokenI + 1][tokenJ - 1] == "UR" && this.board[tokenI + 2][tokenJ - 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI + 2][tokenJ - 2] = "T";
                options.push(option);
            }
        }
        //right
        if (tokenI < this.board.length - 1) {
            if (this.board[tokenI + 1][tokenJ] == "R" && this.board[tokenI + 2][tokenJ] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI + 2][tokenJ] = "T";
                options.push(option);
            }
        }
        //down and right
        if (tokenI < this.board.length - 1 && tokenJ < this.board[0].length - 1) {
            if (this.board[tokenI + 1][tokenJ + 1] == "DR" && this.board[tokenI + 2][tokenJ + 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI + 2][tokenJ + 2] = "T";
                options.push(option);
            }
        }
        //down
        if (tokenJ < this.board[0].length - 1) {
            if (this.board[tokenI][tokenJ + 1] == "D" && this.board[tokenI][tokenJ + 2] == "O") {
                const option = this.clone();
                option.board[tokenI][tokenJ] = "X";
                option.board[tokenI][tokenJ + 2] = "T";
                options.push(option);
            }
        }


        return options;
    }

    /**
     * Returns the option for going in one direction.  Horizontal Delta and Vertical Delta are both in [-1, 0, 1].  Doesn't check that the result is an option.
     */
    , getOptionFromMove: function (col, row) {
        const tokenCoords = this.getTokenCoords();
        const tokenI = tokenCoords[0];
        const tokenJ = tokenCoords[1];

        const option = this.clone();
        option.board[tokenI][tokenJ] = "X";
        option.board[col][row] = "T";
        return option;

    }

}); //end of GeographyGrid class
GeographyGrid.prototype.PLAYER_NAMES = ["Left", "Right"];



const InteractiveGeographyGridView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        this.selectedTile = undefined;
        this.selectedDirection = [0, 0];
        //let's write the board contents out so we can traverse it that way
        const width = this.position.getWidth() * 2 - 1;
        const height = this.position.getHeight() * 2 - 1;
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const pixelsPerBoxWide = (canvasWidth - 10) / (width + 1);
        const pixelsPerBoxHigh = (canvasHeight - 10) / (height + 1);
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //get some dimensions based on the canvas size
        const maxDiameter = boxSide;
        const padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //create defs and a marker for the path.
        //code adapted from question at: https://stackoverflow.com/questions/36430802/how-do-i-get-the-marker-end-of-an-svg-added-with-javascript-to-align-properly
        var defs = document.createElementNS(svgNS, "defs");
        var marker = document.createElementNS(svgNS, "marker");
        marker.setAttribute("id", "arrowHead");
        marker.setAttributeNS(null, "markerWidth", "10");
        marker.setAttributeNS(null, "markerHeight", "10");
        marker.setAttributeNS(null, "markerUnits", "strokeWidth");
        marker.setAttributeNS(null, "refX", 0);
        marker.setAttributeNS(null, "refY", 0);
        marker.setAttribute("viewBox", "-5 -5 10 10");
        marker.setAttributeNS(null, "orient", "auto");
        var arrowHeadPath = document.createElementNS(svgNS, "path");
        arrowHeadPath.setAttribute("d", "M-5,5 L-5,-5 L 5,0 z");
        arrowHeadPath.setAttribute("fill", "black");
        marker.appendChild(arrowHeadPath);
        defs.appendChild(marker);
        boardSvg.appendChild(defs);

        //console.log("boxSide:" + boxSide);

        //grab the possible moves
        const tokenCoords = this.position.getTokenCoords();
        const tokenX = tokenCoords[0];
        const tokenY = tokenCoords[1];
        const moveCoords = [];
        //left 
        if (tokenX > 0 && this.position.board[tokenX - 1][tokenY] == "L" && this.position.board[tokenX - 2][tokenY] == "O") {
            moveCoords.push([tokenX - 2, tokenY]);
        }
        //left and up
        if (tokenX > 0 && tokenY > 0 && this.position.board[tokenX - 1][tokenY - 1] == "UL" && this.position.board[tokenX - 2][tokenY - 2] == "O") {
            moveCoords.push([tokenX - 2, tokenY - 2]);
        }
        //up
        if (tokenY > 0 && this.position.board[tokenX][tokenY - 1] == "U" && this.position.board[tokenX][tokenY - 2] == "O") {
            moveCoords.push([tokenX, tokenY - 2]);
        }
        //up and right
        console.log("tokenX:" + tokenX);
        if (tokenY > 0 && tokenX < width - 1 && this.position.board[tokenX + 1][tokenY - 1] == "UR" && this.position.board[tokenX + 2][tokenY - 2] == "O") {
            moveCoords.push([tokenX + 2, tokenY - 2]);
        }
        //right
        if (tokenX < width - 1 && this.position.board[tokenX + 1][tokenY] == "R" && this.position.board[tokenX + 2][tokenY] == "O") {
            moveCoords.push([tokenX + 2, tokenY]);
        }
        //down and right
        if (tokenX < width - 1 && tokenY < height - 1 && this.position.board[tokenX + 1][tokenY + 1] == "DR" && this.position.board[tokenX + 2][tokenY + 2] == "O") {
            moveCoords.push([tokenX + 2, tokenY + 2]);
        }
        //down
        if (tokenY < height - 1 && this.position.board[tokenX][tokenY + 1] == "D" && this.position.board[tokenX][tokenY + 2] == "O") {
            moveCoords.push([tokenX, tokenY + 2]);
        }
        //down and left
        if (tokenY < height - 1 && tokenX > 0 && this.position.board[tokenX - 1][tokenY + 1] == "DL" && this.position.board[tokenX - 2][tokenY + 2] == "O") {
            moveCoords.push([tokenX - 2, tokenY + 2]);
        }


        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                const boxX = Math.floor(boxSide * colIndex) + 5;
                const boxY = Math.floor(boxSide * rowIndex) + 5;

                const elementString = this.position.board[colIndex][rowIndex];
                //nodes first
                if (elementString == "O" || elementString == "T" || elementString == "X") {
                    const element = document.createElementNS(svgNS, "circle");
                    element.setAttributeNS(null, "cx", boxX + .5 * boxSide);
                    element.setAttributeNS(null, "cy", boxY + .5 * boxSide);
                    element.setAttributeNS(null, "r", .5 * boxSide);
                    element.style.stroke = "black";
                    element.style.strokeWidth = 3;
                    element.style.fill = "white";
                    if (elementString == "X") {
                        element.style.fill = "gray";
                    }
                    boardSvg.appendChild(element);
                    if (elementString == "T") {
                        const token = document.createElementNS(svgNS, "circle");
                        token.setAttributeNS(null, "cx", boxX + .5 * boxSide);
                        token.setAttributeNS(null, "cy", boxY + .5 * boxSide);
                        token.setAttributeNS(null, "r", .25 * boxSide);
                        token.style.stroke = "black";
                        token.style.strokeWidth = 2;
                        token.style.fill = "black";
                        boardSvg.appendChild(token);
                    } else if (arrayContains(moveCoords, [colIndex, rowIndex]) && listener != undefined) {
                        var player = listener;
                        element.onclick = function (event) { player.handleClick(event); }
                        element.x = colIndex;
                        element.y = rowIndex;
                    }
                } else {
                    const element = document.createElementNS(svgNS, "path");
                    element.setAttribute("marker-end", "url(#arrowHead)");
                    element.style.stroke = "black";
                    element.style.strokeWidth = "2";
                    var startX;
                    var startY;
                    var endX;
                    var endY;
                    if (elementString == "R") {
                        startX = boxX;
                        startY = boxY + .5 * boxSide;
                        endX = boxX + boxSide - 10;
                        endY = boxY + .5 * boxSide;
                    } else if (elementString == "L") {
                        startX = boxX + boxSide;
                        startY = boxY + .5 * boxSide;
                        endX = boxX + 10;
                        endY = boxY + .5 * boxSide;
                    } else if (elementString == "D") {
                        startX = boxX + .5 * boxSide;
                        startY = boxY;
                        endX = boxX + .5 * boxSide;
                        endY = boxY + boxSide - 10;
                    } else if (elementString == "U") {
                        startX = boxX + .5 * boxSide;
                        startY = boxY + boxSide;
                        endX = boxX + .5 * boxSide;
                        endY = boxY + 10;
                    } else if (elementString == "UL") {
                        startX = boxX + 1.29 * boxSide;
                        startY = boxY + 1.29 * boxSide;
                        endX = boxX - .29 * boxSide + 15;
                        endY = boxY - .29 * boxSide + 15;
                    } else if (elementString == "UR") {
                        startX = boxX - .14 * boxSide;
                        startY = boxY + 1.14 * boxSide;
                        endX = boxX + 1 * boxSide;
                        endY = boxY - 0 * boxSide;
                    } else if (elementString == "DR") {
                        startX = boxX - .20 * boxSide;
                        startY = boxY - .10 * boxSide;
                        endX = boxX + 1 * boxSide;
                        endY = boxY + 1 * boxSide;
                    } else if (elementString == "DL") {
                        startX = boxX + 1.15 * boxSide;
                        startY = boxY - .10 * boxSide;
                        endX = boxX - .29 * boxSide + 15;
                        endY = boxY + 1 * boxSide;
                    }
                    element.setAttribute("d", "M" + startX + "," + startY + "  L" + endX + "," + endY);
                    boardSvg.appendChild(element);
                }
            }
        }
        this.graphics = boardSvg;
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        const clickedX = event.target.x;
        const clickedY = event.target.y;
        return this.position.getOptionFromMove(clickedX, clickedY);
    }

}); //end of InteractiveGeographyGridView class



/**
 * View Factory for GeographyGrid
 */
var InteractiveGeographyGridViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveGeographyGridView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveGorgonsViewFactory

/**
 * Launches a new ForcedCaptureHnefatafl game.
 */
function newGeographyGridGame() {
    var viewFactory = new InteractiveGeographyGridViewFactory();
    var playDelay = 1000;
    var size = parseInt($('boardSize').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new GeographyGrid(size);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of GeographyGrid




///////////////////////////// Gorgons ////////////////////////////////

/**
 * Game of Gorgons .
 * 
 * Grid is represented as:
 *  - board 2D grid of board contents as strings (columns as first index).  Each element can be either empty ("blank"), blue gorgon ("gorgon blue"), red gorgon ("gorgon red"), stone block ("stone blank"), stone blue gorgon ("stone gorgon blue"), or stone red gorgon ("stone gorgon red").
 * @author Kyle Burke
 */
var Gorgons = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (size, numBlueGorgons, numRedGorgons) {
        numRedGorgons = numRedGorgons || numBlueGorgons;
        this.playerNames = Gorgons.prototype.PLAYER_NAMES;
        const width = size;
        const height = size;
        if (numBlueGorgons < 0 || numRedGorgons < 0) {
            console.log("ERROR: trying to create a game with negative gorgons!");
            return;
        } else if (Math.max(numBlueGorgons, numRedGorgons) > (width + height) / 2) {
            console.log("ERROR: too many gorgons chosen, so we're going down to " + size + " gorgons per side.");
        }
        this.board = [];
        for (var i = 0; i < width; i++) {
            const column = [];
            for (var j = 0; j < height; j++) {
                column.push("blank");
            }
            this.board.push(column);
        }
        const evenWidthAbove = width % 2 == 0 ? width : (width + 1);
        const evenWidthBelow = width % 2 == 0 ? width : (width - 1);
        for (var i = 0; i < numRedGorgons; i++) {
            //place a red gorgon
            var row = Math.floor((2 * i) / width);
            var column = (2 * i) % evenWidthAbove;// + Math.pow(-1, row);
            this.board[column][row] = "gorgon red";
        }
        for (var i = 0; i < numBlueGorgons; i++) {
            //place a blue gorgon
            row = height - 1 - Math.floor((2 * i) / evenWidthBelow);
            column = (2 * i + 1) % evenWidthBelow;
            this.board[column][row] = "gorgon blue";
        }
        const mid = Math.floor((size - 1) / 2);
        const midPlus = Math.ceil((size - 1) / 2);
        this.board[mid][mid] = "stone " + this.board[mid][mid];
        this.board[mid][midPlus] = "stone " + this.board[mid][midPlus];
        this.board[midPlus][mid] = "stone " + this.board[midPlus][mid];
        this.board[midPlus][midPlus] = "stone " + this.board[midPlus][midPlus];
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.board.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return this.board[0].length;
    }

    /**
     * Returns the number of pieces for a player.
     */
    , getNumGorgons: function (playerId) {
        var count = 0;
        const pieceName = "gorgon " + (playerId == 0 ? "blue" : "red");
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] == pieceName) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                if (this.board[i][j] != other.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var clone = new Gorgons(this.getWidth(), 0);
        clone.board = [];
        for (var i = 0; i < this.getWidth(); i++) {
            const col = [];
            for (var j = 0; j < this.getHeight(); j++) {
                col.push(this.board[i][j]);
            }
            clone.board.push(col);
        }
        return clone;
    }

    /**
     * Returns whether two sets of coordinates are equal.
     */
    , coordinatesEquals: function (coordsA, coordsB) {
        return coordsA[0] == coordsB[0] && coordsA[1] == coordsB[1];
    }

    /**
     * Returns a list of the locations of spaces a gorgon can stone.
     */
    , stoneTilesForGorgon: function (gorgonLoc) {
        const directions = this.getDirections();
        const stoneTiles = [];
        for (var i = 0; i < directions.length; i++) {
            const direction = directions[i];
            if (this.canFace(gorgonLoc, direction)) {
                stoneTiles.push(this.toStone(gorgonLoc, direction));
            }
        }
        return stoneTiles;
    }

    /**
     * Returns the coordinates of the space that would be stoned, [col, row].  Coordinates is a 2-vector.  Direction is a 2-vector where the values are either 0, 1, or -1 in any combination except for [0, 0].
     */
    , toStone: function (source, direction) {
        var current = source;
        var next;
        //console.log("source: " + source);
        //console.log("direction: " + direction);
        while (true) {
            next = [current[0] + direction[0], current[1] + direction[1]];
            //console.log("current: " + current);
            //console.log("next: " + next);
            if (next[0] == -1 || next[0] == this.getWidth() || next[1] == -1 || next[1] == this.getHeight()) {
                //next is off the board
                if (this.coordinatesEquals(current, source)) {
                    //console.log("The gorgon can't stone in this direction!");
                    return undefined; //we don't want to return the source.  This gorgon can't move in that direction.
                } else {
                    return current;
                }
            } else {
                const content = this.board[next[0]][next[1]];
                if (content.substring(0, 5) == "stone") {
                    //the next space is a stone.  Return the prior one.
                    if (this.coordinatesEquals(current, source)) {
                        return undefined; //not if we're at the same place
                    } else {
                        return current;
                    }
                } else if (content != "blank") {
                    return next;
                }
            }
            current = next;
        }
        console.log("Shouldn't reach here!  (End of toStone)");
    }

    /**
     * Determines whether a gorgon at a given location [col, row] can turn to the specified direction [col, row].
     */
    , canFace: function (source, direction) {
        const neighborSpace = [source[0] + direction[0], source[1] + direction[1]];
        return !(neighborSpace[0] == -1 || neighborSpace[0] == this.getWidth() || neighborSpace[1] == -1 || neighborSpace[1] == this.getHeight() || this.board[neighborSpace[0]][neighborSpace[1]].substring(0, 5) == "stone");
    }

    /**
     * Returns the eight possible directions.
     */
    , getDirections: function () {
        return [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    }

    /**
     * Returns the locations of the gorgons for a specified player.
     */
    , getGorgons: function (playerId) {
        const gorgons = [];
        const gorgonName = "gorgon " + (playerId == 0 ? "blue" : "red");
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                const contents = this.board[i][j];
                if (contents == gorgonName) {
                    gorgons.push([i, j]);
                }
            }
        }
        return gorgons;
    }

    /**
     * Returns the options from a gorgon facing in one direction.
     */
    , getOptionsForGorgonInDirection: function (gorgonLoc, direction) {
        if (!this.canFace(gorgonLoc, direction)) {
            return [];
        }
        //console.log("gorgonLoc: " + gorgonLoc);
        //console.log("direction: " + direction);
        const options = [];
        const baseWithStone = this.clone();
        const toStone = baseWithStone.toStone(gorgonLoc, direction);
        //console.log("toStone: " + toStone);
        baseWithStone.board[toStone[0]][toStone[1]] = "stone " + baseWithStone.board[toStone[0]][toStone[1]];
        options.push(baseWithStone); //gorgon doesn't move
        var moveTo = [gorgonLoc[0] + direction[0], gorgonLoc[1] + direction[1]];
        while (!this.coordinatesEquals(moveTo, toStone)) {
            //console.log("moveTo: " + moveTo);
            const option = baseWithStone.clone();
            const gorgon = option.board[gorgonLoc[0]][gorgonLoc[1]]; //gorgon's name
            option.board[gorgonLoc[0]][gorgonLoc[1]] = "blank";
            option.board[moveTo[0]][moveTo[1]] = gorgon;
            options.push(option);
            moveTo = [moveTo[0] + direction[0], moveTo[1] + direction[1]];
            //console.log("option added!");
        }
        return options;
    }

    /**
     * Gets the direction from between two locations.
     */
    , getDirectionFromPoints: function (source, destination) {
        const difference = [destination[0] - source[0], destination[1] - source[1]];
        //check for illegal differences
        if (difference[0] != 0 && difference[1] != 0 && (Math.abs(difference[0]) != Math.abs(difference[1]))) {
            //illegal combination!
            return "Nope!";
        } else {
            const direction = [];
            direction.push(difference[0] / (Math.max(1, Math.abs(difference[0]))));
            direction.push(difference[1] / (Math.max(1, Math.abs(difference[1]))));
            return direction;
        }
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const gorgons = this.getGorgons(playerId);
        const options = [];
        const directions = this.getDirections();
        for (var i = 0; i < gorgons.length; i++) {
            const gorgon = gorgons[i];
            //console.log("i: " + i);
            for (var j = 0; j < directions.length; j++) {
                //console.log("j: " + j);
                const direction = directions[j];
                if (this.canFace(gorgon, direction)) {
                    const newOptions = this.getOptionsForGorgonInDirection(gorgon, direction);
                    for (var k = 0; k < newOptions.length; k++) {
                        //console.log("k: " + k);
                        options.push(newOptions[k]);
                    }
                }
            }
        }
        return options;
    }

    /**
     * Returns the option for moving a gorgon.  All three parameters are [row, col] cooredinates.
     */
    , getOptionFromMove: function (gorgonSource, newStoneLoc, gorgonDest) {
        const direction = this.getDirectionFromPoints(gorgonSource, newStoneLoc);
        //console.log("direction: " + direction);
        if (this.canFace(gorgonSource, direction)) {
            const option = this.clone();
            option.board[newStoneLoc[0]][newStoneLoc[1]] = "stone " + option.board[newStoneLoc[0]][newStoneLoc[1]];
            const gorgonString = option.board[gorgonSource[0]][gorgonSource[1]];
            option.board[gorgonSource[0]][gorgonSource[1]] = "blank";
            option.board[gorgonDest[0]][gorgonDest[1]] = gorgonString;
            return option;
        } else {
            return null;
        }
    }

    /**
     * Returns whether two sets of coordinates are equal.
     */
    , coordinatesEquals: function (coordsA, coordsB) {
        return coordsA[0] == coordsB[0] && coordsA[1] == coordsB[1];
    }

}); //end of Gorgons class
Gorgons.prototype.PLAYER_NAMES = ["Blue", "Red"];



const InteractiveGorgonsView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
        this.selectedStone = undefined;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        this.selectedTile = undefined;
        this.selectedDirection = [0, 0];
        //let's write the board contents out so we can traverse it that way
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var text = "";
                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                square.style.stroke = "black";
                square.style.strokeWith = 2;
                square.style.fill = "white";
                var content = this.position.board[colIndex][rowIndex];
                if (content.includes("stone")) {
                    square.style.fill = "gray";
                }
                if (content.includes("gorgon")) {
                    text = "G";
                    //text = "ï¿¼ï¿¼ï¿¼ðŸ"; //this is a green snake
                }
                const textColor = (content.includes("blue")) ? "blue" : "red";

                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.box = square; // so the text and this can both refer to the square itself
                    square.onclick = function (event) { player.handleClick(event); }
                    square.text = text;
                    square.color = textColor;
                }
                boardSvg.appendChild(square);

                if (text != "") {
                    const textBuffer = Math.ceil(.17 * boxSide);
                    const textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", x + textBuffer);//+ 20);
                    textElement.setAttributeNS(null, "y", y + boxSide - textBuffer);//+ 20);
                    const textSize = Math.ceil(.8 * boxSide);
                    textElement.setAttributeNS(null, "font-size", textSize);
                    //textElement.setAttributeNS(null, "color", textColor);
                    textElement.style.fill = textColor;

                    textElement.textContent = text;
                    textElement.column = colIndex;
                    textElement.row = rowIndex;
                    textElement.box = square;
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "single";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.box = square; // so the text and this can both refer to the square itself
                        square.onclick = function (event) { player.handleClick(event); }
                        textElement.onclick = function (event) { player.handleClick(event); }
                    }
                    boardSvg.appendChild(textElement);
                }
            }
        }
        this.graphics = boardSvg;
    }

    /**
     * Selects a tile.
     */
    , selectTile: function (tile) {
        this.selectedTile = tile;
        this.selectedTile.oldColor = this.selectedTile.style.fill;
        this.selectedTile.style.fill = "yellow";
        this.addXs();
    }

    /**
     * Deselect tile.
     */
    , deselectTile: function () {
        this.selectedTile.style.fill = this.selectedTile.oldColor;
        this.selectedTile = undefined;
        this.removeXs();
    }

    /**
     * Draws the Xs for places that can be stoned.
     */
    , addXs: function () {
        //now lots of code to highlight where you can stone things
        this.stoneOptionXs = [];
        const boardPixelWidth = this.graphics.getAttributeNS(null, "width");
        const boardPixelHeight = this.graphics.getAttributeNS(null, "height");
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const canvasWidth = boardPixelWidth;
        const canvasHeight = boardPixelHeight;
        const pixelsPerBoxWide = (canvasWidth - 20) / width;
        const pixelsPerBoxHigh = (canvasHeight - 20) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        //const boxSide = boardPixelWidth / width;
        var svgNS = "http://www.w3.org/2000/svg";
        //console.log("boardPixelSize: " + boardPixelSize);
        const gorgonLoc = [this.selectedTile.box.column, this.selectedTile.box.row];
        const locations = this.position.stoneTilesForGorgon(gorgonLoc);
        for (var i = 0; i < locations.length; i++) {
            const location = locations[i];
            //console.log("stone location: " + location);
            const x = 5 + Math.floor(location[0] * boxSide);
            const y = 5 + Math.floor(location[1] * boxSide);
            const topLeft = [x, y];
            const topRight = [x + boxSide, y];
            const bottomLeft = [x, y + boxSide];
            const bottomRight = [x + boxSide, y + boxSide];
            const textPadding = 10;
            const line1 = document.createElementNS(svgNS, "line");
            line1.setAttributeNS(null, "x1", topLeft[0]);
            line1.setAttributeNS(null, "y1", topLeft[1]);
            line1.setAttributeNS(null, "x2", bottomRight[0]);
            line1.setAttributeNS(null, "y2", bottomRight[1]);
            line1.style.stroke = "black";
            line1.style.strokeWidth = "2";
            line1.height = "" + boxSide;
            line1.width = "" + boxSide;
            this.graphics.appendChild(line1);
            this.stoneOptionXs.push(line1);
            const line2 = document.createElementNS(svgNS, "line");
            line2.setAttributeNS(null, "x1", topRight[0]);
            line2.setAttributeNS(null, "y1", topRight[1]);
            line2.setAttributeNS(null, "x2", bottomLeft[0]);
            line2.setAttributeNS(null, "y2", bottomLeft[1]);
            line2.style.stroke = "black";
            line2.style.strokeWidth = "2";
            line2.height = "" + boxSide;
            line2.width = "" + boxSide;
            this.graphics.appendChild(line2);
            this.stoneOptionXs.push(line2);
        }

    }

    /**
     * Removes all the Xs for the tiles to possibly stone.
     */
    , removeXs: function () {
        for (var i = 0; i < this.stoneOptionXs.length; i++) {
            this.graphics.removeChild(this.stoneOptionXs[i]);
        }
        this.stoneOptionXs = [];
    }

    /**
     * Selects a future stoned tile.
     */
    , selectTileToStone: function (tile) {
        this.selectedStone = tile;
        this.selectedStone.oldColor = this.selectedStone.style.fill;
        this.selectedStone.style.fill = "black";
        this.removeXs();
    }

    /**
     * Deselects the tile to stone.
     */
    , deselectTileToStone: function () {
        this.selectedStone.style.fill = this.selectedStone.oldColor;
        this.selectedStone = undefined;
        this.addXs();
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target.box; //this will be a tile
        //console.log("clickedTile: " + clickedTile);
        //console.log("currentPlayer: " + currentPlayer);
        if (this.selectedTile === undefined) {
            //console.log("First case!");
            const text = clickedTile.text;
            const gorgonPlayer = clickedTile.color == "blue" ? 0 : 1;
            if (text == "G" && clickedTile.style.fill != "gray" && gorgonPlayer == currentPlayer) {
                this.selectTile(clickedTile);

            }
            return null;
        } else if (this.selectedStone == undefined) {
            //console.log("Second case!");
            //time to select the tile we're going to stone.
            const gorgonTile = [this.selectedTile.column, this.selectedTile.row];
            const selectedStoneTile = [clickedTile.column, clickedTile.row];
            if (this.selectedTile == clickedTile) {
                this.deselectTile();
                return null;
            }
            const possibleStoneLocations = this.position.stoneTilesForGorgon(gorgonTile);
            //console.log("possibleStoneLocations: " + possibleStoneLocations);
            //console.log("selectedStoneTile: " + selectedStoneTile);
            var stoneInStoneTiles = false;
            for (var i = 0; i < possibleStoneLocations.length; i++) {
                const possibleStone = possibleStoneLocations[i];
                //console.log("possibleStone: " + possibleStone);
                if (this.position.coordinatesEquals(selectedStoneTile, possibleStone)) {
                    stoneInStoneTiles = true;
                    break;
                }
            }
            //console.log("stoneInStoneTiles? " + stoneInStoneTiles);
            if (stoneInStoneTiles) {
                this.selectTileToStone(clickedTile);
            }
            return null;
        } else {
            //console.log("Third case!");
            //now it's time to pick where to go
            //if they click on the stone, then deselect the stone.
            if (clickedTile == this.selectedStone) {
                this.deselectTileToStone();
                return null;
            }
            const gorgonTile = [this.selectedTile.column, this.selectedTile.row];
            const stoneTile = [this.selectedStone.column, this.selectedStone.row];
            const moveToTile = [clickedTile.column, clickedTile.row];
            //console.log("gorgonTile: " + gorgonTile);
            //console.log("stoneTile: " + stoneTile);
            //console.log("moveToTile: " + moveToTile);
            const option = this.position.getOptionFromMove(gorgonTile, stoneTile, moveToTile);
            //console.log("option: " + option);
            this.deselectTileToStone();
            this.deselectTile();
            return option;
        }
    }

}); //end of InteractiveGorgonsView class



/**
 * View Factory for Gorgons
 */
var InteractiveGorgonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveGorgonsView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveGorgonsViewFactory





const NonInteractiveGorgonsView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
        this.selectedStone = undefined;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        this.selectedTile = undefined;
        this.selectedDirection = [0, 0];
        //let's write the board contents out so we can traverse it that way
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        for (var col = 0; col < this.position.size; col++) {
            const column = [];
            for (var row = 0; row < this.position.size; row++) {
                column.push("");
            }
            contents.push(column);
        }

        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        var boardWidth = Math.min(getAvailableHorizontalPixels(containerElement), window.innerWidth - 200);
        var boardPixelSize = Math.min(window.innerHeight, boardWidth);
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100
        boardSvg.setAttributeNS(null, "width", boardPixelSize);
        boardSvg.setAttributeNS(null, "height", boardPixelSize);

        //get some dimensions based on the canvas size
        var maxCircleWidth = (boardPixelSize - 10) / width;
        var maxCircleHeight = (boardPixelSize - 10) / (height + 2);
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var boxSide = maxDiameter;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw a gray frame around everything
        var frame = document.createElementNS(svgNS, "rect");
        frame.setAttributeNS(null, "x", 5);
        frame.setAttributeNS(null, "y", 5);
        frame.setAttributeNS(null, "width", width * boxSide);
        frame.setAttributeNS(null, "height", height * boxSide);
        frame.style.strokeWidth = 4;
        frame.style.stroke = "gray";
        boardSvg.appendChild(frame);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var text = "";
                var square = document.createElementNS(svgNS, "rect");
                var x = 5 + Math.floor((colIndex) * boxSide);
                var y = 5 + Math.floor((rowIndex) * boxSide);
                square.setAttributeNS(null, "x", x);
                square.setAttributeNS(null, "y", y);
                square.setAttributeNS(null, "width", boxSide + 1);
                square.setAttributeNS(null, "height", boxSide + 1);
                square.style.stroke = "black";
                square.style.strokeWith = 2;
                square.style.fill = "white";
                var content = this.position.board[colIndex][rowIndex];
                if (content.includes("stone")) {
                    square.style.fill = "gray";
                }
                if (content.includes("gorgon")) {
                    text = "G";
                    //text = "ï¿¼ï¿¼ï¿¼ðŸ"; //this is a green snake
                }
                const textColor = (content.includes("blue")) ? "blue" : "red";

                if (listener != undefined) {
                    var player = listener;
                    square.popType = "single";
                    square.column = colIndex;
                    square.row = rowIndex;
                    square.box = square; // so the text and this can both refer to the square itself
                    square.onclick = function (event) { player.handleClick(event); }
                    square.text = text;
                    square.color = textColor;
                }
                boardSvg.appendChild(square);

                if (text != "") {
                    const textBuffer = Math.ceil(.17 * boxSide);
                    const textElement = document.createElementNS(svgNS, "text");
                    textElement.setAttributeNS(null, "x", x + textBuffer);//+ 20);
                    textElement.setAttributeNS(null, "y", y + boxSide - textBuffer);//+ 20);
                    const textSize = Math.ceil(.8 * boxSide);
                    textElement.setAttributeNS(null, "font-size", textSize);
                    //textElement.setAttributeNS(null, "color", textColor);
                    textElement.style.fill = textColor;

                    textElement.textContent = text;
                    textElement.column = colIndex;
                    textElement.row = rowIndex;
                    textElement.box = square;
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "single";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.box = square; // so the text and this can both refer to the square itself
                        square.onclick = function (event) { player.handleClick(event); }
                        textElement.onclick = function (event) { player.handleClick(event); }
                    }
                    boardSvg.appendChild(textElement);
                }
            }
        }
        this.graphics = boardSvg;
    }

}); //end of NonInteractiveGorgonsView



/**
 * View Factory for Gorgons
 */
var NonInteractiveGorgonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new NonInteractiveGorgonsView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getNonInteractiveBoard(position);
    }

}); //end of InteractiveGorgonsViewFactory

/**
 * Launches a new ForcedCaptureHnefatafl game.
 */
function newGorgonsGame() {
    var viewFactory = new InteractiveGorgonsViewFactory();
    var playDelay = 1000;
    var size = parseInt($('boardSize').value);
    var numBlueGorgons = parseInt($('numBluePieces').value);
    var numRedGorgons = parseInt($('numRedPieces').value);
    var controlForm = $('gameOptions');
    const leftPlayerCreationString = getSelectedRadioValue(controlForm.elements['leftPlayer']);
    var leftPlayer = eval(leftPlayerCreationString);
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    //console.log("rightPlayer: " + rightPlayer);
    var players = [leftPlayer, rightPlayer];
    //console.log("Selected Players:");
    //console.log(players);
    var game = new Gorgons(size, numBlueGorgons, numRedGorgons);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of Gorgons




/**
 * Class for Manalath
 * @author: Christina Shatney.
 */
var Manalath = Class.create(CombinatorialGame, {

    /**
     * Constructor
     */
    initialize: function (width, height, blockedSpaces) {
        blockedSpaces = blockedSpaces || [new Array(), new Array()];
        this.blockedSpaces = [new Array(), new Array()];
        for (var i = 0; i < blockedSpaces.length; i++) {
            for (var j = 0; j < blockedSpaces[i].length; j++) {
                var blockedSpace = blockedSpaces[i][j];
                this.blockedSpaces[i].push([blockedSpace[0], blockedSpace[1]]);
            }
        }
        this.width = width;
        this.height = height;
        this.playerNames = ["Blue", "Red"];
    }

    /**
     * toString
     */
    , toString: function () {
        string = "Manalath position: \n";
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            string += "  " + this.playerNames[i] + "-colored: ";
            for (var j = 0; j < this.blockedSpaces[i].length; j++) {
                string += "(" + this.blockedSpaces[i][j] + "), ";
            }
            string += "\n";
        }
        return string;
    }

    ,/**
     * indexOf for arrays in arrays
     */
    indexOf: function (array, block) {
        for (var i = 0; i < array.length; i++) {
            if ((array[i][0] == block[0]) && (array[i][1] == block[1])) {
                return i;
            }
        }
        return -1;
    }

    ,/**
     * Looks at what group a block is a part of
     */
    sameColorGroupABlockIsIn: function (block, player) {
        var group = new Array();
        group.push(block);
        for (var i = 0; i < group.length; i++) {
            var block = group[i];
            if (block[1] < Math.floor(this.height / 2)) {
                var down = block[1] + 1;
                var up = block[1] - 1;
                var toTheRight = block[0] + 1;
                var toTheLeft = block[0] - 1;
                for (var j = 0; j < this.blockedSpaces[player].length; j++) {
                    //Same x, down to the left
                    if (((block[0] == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //down to the right
                    else if (((toTheRight == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the right
                    else if (((toTheRight == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the left
                    else if (((toTheLeft == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the right
                    else if (((block[0] == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the left
                    else if (((toTheLeft == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                }
            }

            else if (block[1] == Math.floor(this.height / 2)) {
                var down = block[1] + 1;
                var up = block[1] - 1;
                var toTheRight = block[0] + 1;
                var toTheLeft = block[0] - 1;
                for (var j = 0; j < this.blockedSpaces[player].length; j++) {
                    //down to the left
                    if (((toTheLeft == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //down to the right
                    else if (((block[0] == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the right
                    else if (((toTheRight == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the left
                    else if (((toTheLeft == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the right
                    else if (((block[0] == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the left
                    else if (((toTheLeft == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            // console.log("Pushing the block6: " + this.blockedSpaces[player][j]);
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                }
            }


            else if (block[1] > Math.floor(this.height / 2)) {
                var down = block[1] + 1;
                var up = block[1] - 1;
                var toTheRight = block[0] + 1;
                var toTheLeft = block[0] - 1;
                for (var j = 0; j < this.blockedSpaces[player].length; j++) {
                    //down to the left
                    if (((toTheLeft == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //down to the right
                    else if (((block[0] == this.blockedSpaces[player][j][0]) && (down == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the right
                    else if (((toTheRight == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //Same y, to the left
                    else if (((toTheLeft == this.blockedSpaces[player][j][0]) && (block[1] == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            // console.log("Pushing the block4: " + this.blockedSpaces[player][j]);
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the right
                    else if (((toTheRight == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            // console.log("Pushing the block5: " + this.blockedSpaces[player][j]);
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                    //up, to the left
                    else if (((block[0] == this.blockedSpaces[player][j][0]) && (up == this.blockedSpaces[player][j][1]))) {
                        if (this.indexOf(group, this.blockedSpaces[player][j]) == -1) {
                            // console.log("Pushing the block6: " + this.blockedSpaces[player][j]);
                            group.push(this.blockedSpaces[player][j]);
                        }
                    }
                }
            }

        }
        return group;
    }


    ,/**
     * indexOf for arrays in arrays
     */
    indexOfArray: function (mainArray, array) {
        var counter = 0;
        for (var i = 0; i < mainArray.length; i++) {
            for (var j = 0; j < mainArray[i].length; j++) {
                for (var k = 0; k < array.length; k++) {
                    if ((mainArray[i][j][0] == array[k][0]) && (mainArray[i][j][1] == array[k][1])) {
                        counter++;
                    }
                }
                if (counter == mainArray[i].length) {
                    return i;
                }
            }
        }
        return -1;
    }


    ,/**
     * Returns an array of arrays of groups for each player
     */
    allGroupsOfSameColor: function () {
        var allGroups = [new Array(), new Array()];
        var array = new Array();
        for (var player = 0; player < this.blockedSpaces.length; player++) {
            for (var i = 0; i < this.blockedSpaces[player].length; i++) {
                array = this.sameColorGroupABlockIsIn(this.blockedSpaces[player][i], player)
                if (this.indexOfArray(allGroups[player], array) == -1) {
                    allGroups[player].push(array);
                }
            }
        }
        return allGroups;
    }



    ,/**
     * Clone
     */
    clone: function () {
        return new Manalath(this.width, this.height, this.blockedSpaces);
    }

    ,/**
     * Equals
     */
    equals: function (other) {
        for (var player = 0; player < this.blockedSpaces.length; player++) {
            for (var i = 0; i < this.blockedSpaces[player].length; i++) {
                var block = this.blockedSpaces[player][i];
                var otherHasBlock = false;
                for (var j = 0; j < other.blockedSpaces[player].length; j++) {
                    var otherBlock = other.blockedSpaces[player][j];
                    if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                        otherHasBlock = true;
                        break;
                    }
                }
                if (!otherHasBlock) return false;
            }
        }

        for (var player = 0; player < other.blockedSpaces.length; player++) {
            for (var i = 0; i < other.blockedSpaces[player].length; i++) {
                var otherBlock = other.blockedSpaces[player][i];
                var thisHasBlock = false;
                for (var j = 0; j < this.blockedSpaces[player].length; j++) {
                    var block = this.blockedSpaces[player][j];
                    if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                        thisHasBlock = true;
                        break;
                    }
                }
                if (!thisHasBlock) return false;
            }
        }
        return true;
    }

    ,/**
     * Returns boards with available moves
     */
    getOptionsForPlayer: function (playerId) {
        //Follows proper rules assuming you can only play your color
        var options = new Array();
        var option0;
        var option;
        var option1;

        var groups = this.allGroupsOfSameColor();
        for (var i = 0; i < groups[playerId].length; i++) {
            if (groups[playerId][i].length == 4) {
                for (var row = 0; row < this.height; row++) {
                    var widthMeasure;
                    if (row == Math.floor(this.height / 2)) {
                        widthMeasure = this.width + Math.floor(this.height / 2)
                    } else if (row > Math.floor(this.height / 2)) {
                        widthMeasure = this.width + (this.height - row - 1);
                    } else if (row < Math.floor(this.height / 2)) {
                        widthMeasure = this.width + row;
                    }
                    for (var column = 0; column < widthMeasure; column++) {
                        option0 = this.clone();
                        option0.blockedSpaces[playerId].push([column, row]);
                        var allGroupsOfSameColor0 = option0.allGroupsOfSameColor();
                        var counter0 = 0;
                        for (var i = 0; i < allGroupsOfSameColor0[playerId].length; i++) {
                            if (allGroupsOfSameColor0[playerId][i].length == 5) {
                                counter0++;
                            }
                        }
                        var counter2 = 0;
                        for (var player = 0; player < this.blockedSpaces.length; player++) {
                            for (var i = 0; i < this.blockedSpaces[player].length; i++) {
                                if ((this.blockedSpaces[player][i][0] == column) && (this.blockedSpaces[player][i][1] == row)) {
                                    counter2++;
                                    break;
                                }
                            }
                        }
                        if ((counter0 > 0) && (counter2 == 0)) {
                            options.push(option0);
                        }
                    }
                }
                return options;
            }
        }





        for (var i = 0; i < groups[Math.abs((playerId % 2) - 1)].length; i++) {
            if (groups[Math.abs((playerId % 2) - 1)][i].length == 5) {
                return options;
            }
        }

        for (var row = 0; row < this.height; row++) {
            var widthMeasure;
            if (row == Math.floor(this.height / 2)) {
                widthMeasure = this.width + Math.floor(this.height / 2)
            } else if (row > Math.floor(this.height / 2)) {
                widthMeasure = this.width + (this.height - row - 1);
            } else if (row < Math.floor(this.height / 2)) {
                widthMeasure = this.width + row;
            }
            for (var column = 0; column < widthMeasure; column++) {
                option = this.clone();
                option.blockedSpaces[playerId].push([column, row]);
                var allGroupsOfSameColor = option.allGroupsOfSameColor();
                var counter = 0;
                var counter1 = 0;
                var newGroupsOfFour;
                for (var i = 0; i < allGroupsOfSameColor[playerId].length; i++) {
                    if ((allGroupsOfSameColor[playerId][i].length == 4) || (allGroupsOfSameColor[playerId][i].length > 5)) {
                        counter++;
                    }
                }
                for (var player = 0; player < this.blockedSpaces.length; player++) {
                    for (var i = 0; i < this.blockedSpaces[player].length; i++) {
                        if ((this.blockedSpaces[player][i][0] == column) && (this.blockedSpaces[player][i][1] == row)) {
                            counter++;
                            counter1++;
                            break;
                        }
                    }
                }

                option1 = this.clone();
                option1.blockedSpaces[Math.abs((playerId % 2) - 1)].push([column, row]);
                var allGroupsOfSameColor1 = option1.allGroupsOfSameColor();
                for (var i = 0; i < allGroupsOfSameColor1[Math.abs((playerId % 2) - 1)].length; i++) {
                    if (allGroupsOfSameColor1[Math.abs((playerId % 2) - 1)][i].length > 4) {
                        counter1++;
                    }
                }
                if (counter1 == 0) {
                    options.push(option1);
                }

                if (counter == 0) {
                    options.push(option);
                }
            }
        }
        return options;
    }

    /**
     * Returns the color of a circle.
     */
    , getCircleColor: function (column, row) {
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            for (var j = 0; j < this.blockedSpaces[i].length; j++) {
                var blockedSpace = this.blockedSpaces[i][j];
                if ((blockedSpace[0] == column) && (blockedSpace[1] == row)) {
                    return i;
                }
            }
        }
        return Manalath.prototype.UNCOLORED;
    }

    ,/**
     * Returns the board with a possible move
     */
    getOptionWith: function (column, row, color) {
        var clone = this.clone();
        clone.blockedSpaces[color].push([column, row]);
        return clone;
    }
});
Manalath.prototype.BLUE = 0;
Manalath.prototype.RED = 1;
Manalath.prototype.UNCOLORED = 2;
Manalath.prototype.PLAYER_NAMES = ["Blue", "Red"];


/**
 * View for Manalath.
 * @author: Christina Shatney.
 */
var InteractiveManalathView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedElement = undefined;
        this.popup = null;
    }

    // //Adapted from https://gist.github.com/bencates/5b490ed79796cbd35863
    // ,hexPoints: function(x, y, radius) {
    //   var points = [];
    //   for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
    //     var pointX, pointY;
    //
    //     pointX = x + radius * Math.sin(theta);
    //     pointY = y + radius * Math.cos(theta);
    //
    //     points.push(pointX + ',' + pointY);
    //   }
    //
    //   return points.join(' ');
    // }

    /**
     * Draws the checker board and assigns the listener
     */
    , draw: function (containerElement, listener) {
        //clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.width;
        const height = this.position.height;
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        //var boardPixelSize = 10 + (this.position.sideLength + 4) * 100
        /*boardSvg.setAttributeNS(null, "width", 10 + (this.position.width+Math.floor(this.position.height/2)) * 100);
        boardSvg.setAttributeNS(null, "height", 10 + this.position.height * 100); */
        var columnNumber = 0;
        //draw the circles
        for (var row = 0; row < this.position.height; row++) {

            // console.log("column: " + column);
            // console.log("columnNumber: " + columnNumber);
            // if((row == 0) || (row == this.position.height-1)){
            //     for (var column = 0; column < this.position.width; column++) {
            //         console.log("row: " + row);
            //         // columnNumber = column;
            //         var colorInt = this.position.getCircleColor(column, row);
            //         var circle = document.createElementNS(svgNS, "circle");
            //         circle.row = row;
            //         circle.column = column;
            //
            //         circle.setAttributeNS(null, "cx", (column * 100) + 50);
            //         circle.setAttributeNS(null, "cy", (row * 100) + 50);
            //         circle.setAttributeNS(null, "r", 40);
            //         if (colorInt == Manalath.prototype.GRAY) {
            //             circle.setAttributeNS(null, "class", "grayPiece");
            //         } else if (colorInt == Manalath.prototype.BLACK) {
            //             circle.setAttributeNS(null, "class", "blackPiece");
            //         } else {
            //             circle.setAttributeNS(null, "class", "whitePiece");
            //             //only white circles are clickable
            //             if (listener != undefined) {
            //                 var player = listener;
            //                 circle.onclick = function(event) {
            //                     console.log("clicked on: (" + event.target.row + ", " + event.target.column + ")");
            //                     player.handleClick(event);
            //                 };
            //             }
            //         }
            //         boardSvg.appendChild(circle);
            //     }
            // }
            if (row == Math.floor(this.position.height / 2)) {
                // console.log("In the other if: " + row);
                for (var column = 0; column < this.position.width + Math.floor(this.position.height / 2); column++) {
                    // console.log("row: " + row);
                    // columnNumber = column;
                    var colorInt = this.position.getCircleColor(column, row);
                    var circle = document.createElementNS(svgNS, "circle");
                    circle.row = row;
                    circle.column = column;

                    circle.setAttributeNS(null, "cx", (column + .5) * boxSide);
                    circle.setAttributeNS(null, "cy", (row + .5) * boxSide);
                    circle.setAttributeNS(null, "r", .4 * boxSide);
                    if (colorInt == Manalath.prototype.RED) {
                        circle.setAttributeNS(null, "class", "redPiece");
                    } else if (colorInt == Manalath.prototype.BLUE) {
                        circle.setAttributeNS(null, "class", "bluePiece");
                    } else {
                        circle.setAttributeNS(null, "class", "whitePiece");
                        //only white circles are clickable
                        if (listener != undefined) {
                            var player = listener;
                            circle.onclick = function (event) {
                                //console.log("clicked on: (" + event.target.column + ", " + event.target.row + ")");
                                player.handleClick(event);
                            };
                        }
                    }
                    boardSvg.appendChild(circle);
                }
            }
            if (row > Math.floor(this.position.height / 2)) {
                for (var column = 0; column < this.position.width + (this.position.height - row - 1); column++) {
                    // console.log("row: " + row);
                    // columnNumber = column;
                    var colorInt = this.position.getCircleColor(column, row);
                    var circle = document.createElementNS(svgNS, "circle");
                    circle.row = row;
                    circle.column = column;

                    circle.setAttributeNS(null, "cx", String((column * boxSide) + ((row - Math.floor(this.position.height / 2) + 1) * boxSide / 2)));
                    circle.setAttributeNS(null, "cy", String((row + .5) * boxSide));
                    console.log(String(.4 * boxSide));
                    circle.setAttributeNS(null, "r", String(.4 * boxSide));

                    // circle.setAttributeNS(null, "cx", (column * 100) + 50);
                    // circle.setAttributeNS(null, "cy", (row * 100) + 50);
                    // circle.setAttributeNS(null, "r", 40);
                    if (colorInt == Manalath.prototype.RED) {
                        circle.setAttributeNS(null, "class", "redPiece");
                    } else if (colorInt == Manalath.prototype.BLUE) {
                        circle.setAttributeNS(null, "class", "bluePiece");
                    } else {
                        circle.setAttributeNS(null, "class", "whitePiece");
                        //only white circles are clickable
                        if (listener != undefined) {
                            var player = listener;
                            circle.onclick = function (event) {
                                //console.log("clicked on: (" + event.target.column + ", " + event.target.row + ")");
                                player.handleClick(event);
                            };
                        }
                    }
                    boardSvg.appendChild(circle);
                }
            }
            if (row < Math.floor(this.position.height / 2)) {
                for (var column = 0; column < this.position.width + row; column++) {
                    // console.log("row: " + row);
                    // columnNumber = column;
                    var colorInt = this.position.getCircleColor(column, row);
                    var circle = document.createElementNS(svgNS, "circle");
                    circle.row = row;
                    circle.column = column;

                    circle.setAttributeNS(null, "cx", (column * boxSide) + ((Math.abs(row - Math.floor(this.position.height / 2)) + 1) * boxSide / 2));
                    circle.setAttributeNS(null, "cy", (row + .5) * boxSide);
                    circle.setAttributeNS(null, "r", .4 * boxSide);
                    if (colorInt == Manalath.prototype.RED) {
                        circle.setAttributeNS(null, "class", "redPiece");
                    } else if (colorInt == Manalath.prototype.BLUE) {
                        circle.setAttributeNS(null, "class", "bluePiece");
                    } else {
                        circle.setAttributeNS(null, "class", "whitePiece");
                        //only white circles are clickable
                        if (listener != undefined) {
                            var player = listener;
                            circle.onclick = function (event) {
                                //console.log("clicked on: (" + event.target.column + ", " + event.target.row + ")");
                                player.handleClick(event);
                            };
                        }
                    }
                    boardSvg.appendChild(circle);
                }
            }
        }
    }

    /**
     * Handles a mouse click.
     * @param currentPlayer  The index for the player, not the player object.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        this.destroyPopup();
        //console.log("Clicked!");
        var self = this;
        //create the popup
        this.popup = document.createElement("div");

        var blueButton = document.createElement("button");
        blueButton.appendChild(toNode("Blue"));
        blueButton.onclick = function () {
            self.destroyPopup();
            player.sendMoveToRef(self.position.getOptionWith(event.target.column, event.target.row, Manalath.prototype.BLUE));
        };
        this.popup.appendChild(blueButton);

        var redButton = document.createElement("button");
        redButton.appendChild(toNode("Red"));
        redButton.onclick = function () {
            self.destroyPopup();
            player.sendMoveToRef(self.position.getOptionWith(event.target.column, event.target.row, Manalath.prototype.RED));
        };
        this.popup.appendChild(redButton);

        this.popup.style.position = "fixed";
        this.popup.style.display = "block";
        this.popup.style.opacity = 1;
        this.popup.width = Math.min(window.innerWidth / 2, 100);
        this.popup.height = Math.min(window.innerHeight / 2, 50);
        this.popup.style.left = event.clientX + "px";
        this.popup.style.top = event.clientY + "px";
        document.body.appendChild(this.popup);
        return null;
        //}
    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }
});  //end of InteractiveManalathView

/**
 * View Factory for Manalath
 * @author: Christina Shatney.
 */
var InteractiveManalathViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
        //do nothing
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveManalathView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveManalathViewFactory


/**
 * Creates a new Manalath game.
 * @author: Christina Shatney. 
 */
function newManalathGame() {
    var viewFactory = new InteractiveManalathViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    game = new Manalath(width, height);
    ref = new Referee(game, players, viewFactory, "gameCanvas", $('messageBox'), controlForm);
};



////////////////////////////////////// Martian Chess ///////////////////////////////
// MartianChess and other Martian-Chess-related-classes all coded by the same team (Jefferys, Andersen, & Roman).  All code authored by them unless specifically mentioned.

/**
 * Martian Chess!
 * @authors: Cam Jefferys, Jake Andsersen, and Jake Roman.
 */
const MartianChess = Class.create(ScoringCombinatorialGame, {
    // Core object functions
    initialize: function () {
        // Set variables
        this.width = 4
        this.height = 8
        this.topScore = 0
        this.bottomScore = 0
        this.lastMove = false // Once a move is made it will be replaced with [fromX, fromY, toX, toY, crossesCanal, player]
        this.playerNames = ["Top", "Bottom"]

        // Create standard martian chess board
        this.board = []
        for (let x = 0; x < this.width; x++) {
            this.board[x] = []
            for (let y = 0; y < this.height; y++) {
                this.board[x][y] = 0
            }
        }

        // Default pieces to place
        var piecesToPlace = [[3, 0, 0], [3, 1, 0], [3, 0, 1], [2, 2, 0], [2, 1, 1], [2, 0, 2], [1, 1, 2], [1, 2, 2], [1, 2, 1]]
        for (let i = 0; i < piecesToPlace.length; i++) {
            var piece = piecesToPlace[i]
            this.board[piece[1]][piece[2]] = piece[0] // Place top left pieces
            this.board[(this.width - 1) - piece[1]][(this.height - 1) - piece[2]] = piece[0] // Place bottom right pieces
        }
    },

    getScore: function () {
        // Top player is the left, and bottom player is the right on the number line
        return this.topScore - this.bottomScore
    },

    clone: function () {
        var clone = new MartianChess()
        // Bring all the variables along
        clone.width = this.width
        clone.height = this.height
        clone.topScore = this.topScore
        clone.bottomScore = this.bottomScore

        // Deep copy board
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                clone.board[x][y] = this.board[x][y]
            }
        }

        return clone
    },

    equals: function (other) {
        // Check variables
        if (!(other.width == this.width && other.height == this.height && other.topScore == this.topScore && other.bottomScore == this.bottomScore)) {
            return false // The boards have different variables
        }

        // Check board state
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (other.board[x][y] != this.board[x][y]) {
                    return false // Mismatch in board state
                }
            }
        }

        // Woohoo they match
        return true
    },

    getWidth: function () {
        return this.width;
    },

    getHeight: function () {
        return this.height;
    },

    getPlayerName: function (playerIndex) {
        return this.playerNames[playerIndex];
    },

    getOptionsForPlayer: function (playerId, ignoreEnemyPieceCheck = false) {
        // First check if the game is over
        var enemyPieces = this.getControlledPieces(1 - playerId)
        if (enemyPieces.length == 0 && (!ignoreEnemyPieceCheck)) {
            // The game is already over
            return []
        }

        // Returns a list of all moves a player can currently make in format [x, y, toX, toY]
        var playerPieces = this.getControlledPieces(playerId)
        var options = []
        for (var pieceId = 0; pieceId < playerPieces.length; pieceId++) {
            var pieceType = playerPieces[pieceId][0]
            var x = playerPieces[pieceId][1]
            var y = playerPieces[pieceId][2]
            var pieceOptions = this.getOptionsForPiece(playerId, pieceType, x, y)
            for (var optionId = 0; optionId < pieceOptions.length; optionId++) {
                var pieceOption = pieceOptions[optionId]

                // Clone the board and make the move
                var option = this.clone()
                option.makeMove(playerId, x, y, pieceOption[0], pieceOption[1])
                options.push(option)
            }
        }
        return options
    },

    // Supporting functions
    getSpace: function (x, y) {
        // Gets the piece at this space
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            return this.board[x][y]
        }
        else {
            return -1 // Out of bounds
        }
    },

    getControlArea: function (playerId) {
        // Returns the [x1,y1,x2,y2] area that a specific player has control over
        var focus_x1 = 0
        var focus_y1 = 0
        var focus_x2 = this.width - 1
        var focus_y2 = this.height - 1
        if (playerId == CombinatorialGame.prototype.LEFT) {
            // Top player
            focus_y2 = Math.floor((this.height / 2) - 1)
        }
        else if (playerId == CombinatorialGame.prototype.RIGHT) {
            // Bottom player
            focus_y1 = Math.floor(this.height / 2)
            focus_y2 = Math.floor(this.height - 1)
        }
        else {
            console.log("Warning, unknown player: " + playerId)
        }
        return [focus_x1, focus_y1, focus_x2, focus_y2]
    },

    canPlayerTake: function (playerId, x, y) {
        // Returns true if the provided player is able to take a specific piece on the board
        var playerOwns = this.checkSpaceOwnership(playerId, x, y)
        if (this.getSpace(x, y) < 0) {
            return false // Out of bounds
        }
        else if (playerOwns) {
            return false // Can't take own piece
        }
        return true // All good
    },

    canFieldPromote: function (playerId, x, y, toX, toY) {
        // Checks if the player can perform a field promoting by moving piece x,y to toX,toY
        if (!this.checkSpaceOwnership(playerId, x, y) || !this.checkSpaceOwnership(playerId, toX, toY)) {
            return false // If player doesn't own both pieces field promotion cannot continue
        }

        var pieceA = this.getSpace(x, y)
        var pieceB = this.getSpace(toX, toY)
        if ((pieceA == 1 && pieceB == 2) || (pieceA == 2 && pieceB == 1)) {
            // Field promotion to queen possible
            return 3
        }
        else if (pieceA == 1 && pieceB == 1) {
            // Field promotion to drone possible
            return 2
        }
        else {
            // Field promotion not possible
            return false
        }
    },

    checkSpaceOwnership: function (playerId, x, y) {
        // Returns true if the player has control over the square at X,Y
        var control_area = this.getControlArea(playerId)
        var area_x1 = control_area[0]
        var area_y1 = control_area[1]
        var area_x2 = control_area[2]
        var area_y2 = control_area[3]

        var playerOwns = (x >= area_x1 && x <= area_x2 && y >= area_y1 && y <= area_y2)
        // console.log("Checking ownership for player",this.playerNames[playerId],"of piece",x,y," Area:",area_x1,area_y1,area_x2,area_y2," Owns?",playerOwns)
        return playerOwns
    },

    getOptionsForPiece: function (playerId, pieceType, x, y) {
        // Gets available moves for a piece
        var moves = []

        if (pieceType == 1) {
            // Pawn
            var offsets = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            for (var i = 0; i < offsets.length; i++) {
                var offset = offsets[i]
                moves.push([x + offset[0], y + offset[1]])
            }
        }
        else if (pieceType == 2) {
            // Drone
            var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

            for (var i = 0; i < directions.length; i++) {
                // Start moving in a direction
                var dir = directions[i]
                var cx = x
                var cy = y
                for (var d = 0; d < 2; d++) { // Up to 2 spaces away
                    cx = cx + dir[0]
                    cy = cy + dir[1]
                    if (this.getSpace(cx, cy) < 0) {
                        break // Out of bounds, stop now
                    }
                    moves.push([cx, cy]) // Add this move as potentially available
                    if (this.getSpace(cx, cy) > 0) {
                        break // There's a piece here so let's not go any further
                    }
                }
            }
        }
        else if (pieceType == 3) {
            // Queen
            var directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1]]

            for (var i = 0; i < directions.length; i++) {
                // Start moving in a direction
                var dir = directions[i]
                var cx = x
                var cy = y
                while (true) { // Queen can move as far as they want
                    cx = cx + dir[0]
                    cy = cy + dir[1]
                    if (this.getSpace(cx, cy) < 0) {
                        break // Out of bounds, stop now
                    }
                    moves.push([cx, cy]) // Add this move as potentially available
                    if (this.getSpace(cx, cy) > 0) {
                        break // There's a piece here so let's not go any further
                    }
                }
            }
        }

        // Check legality of potential moves
        var options = []
        for (var i = 0; i < moves.length; i++) {
            var cx = moves[i][0]
            var cy = moves[i][1]

            // Prevent move rejection (undoing the last player's move)
            if (this.lastMove && this.lastMove[1] == cx && this.lastMove[2] == cy && this.lastMove[3] == x && this.lastMove[4] == y && this.lastMove[0] != playerId) {
                continue // Skip to next move
            }

            // Allow legal moves
            if (this.getSpace(cx, cy) == 0) { // Move to empty space
                options.push([cx, cy])
            }
            else if (this.canPlayerTake(playerId, cx, cy)) { // Take enemy piece
                options.push([cx, cy])
            }
            else if (this.canFieldPromote(playerId, x, y, cx, cy)) {
                options.push([cx, cy])
            }
        }

        // Return all legal moves
        return options
    },

    getControlledPieces: function (playerId) {
        // Returns a list of pieces that the player has control over in a list formatted as [pieceType, x, y]
        var pieces = []
        var control_area = this.getControlArea(playerId)
        var control_x1 = control_area[0]
        var control_y1 = control_area[1]
        var control_x2 = control_area[2]
        var control_y2 = control_area[3]
        for (var x = control_x1; x <= control_x2; x++) {
            for (var y = control_y1; y <= control_y2; y++) {
                var piece = this.getSpace(x, y)
                if (piece > 0) {
                    pieces.push([piece, x, y])
                }
            }
        }
        return pieces
    },

    place: function (piece, x, y) {
        // Place a piece at a given position on the board
        this.board[x][y] = piece;
    },

    getPlayerScore: function (playerId) {
        // Return the individual score of a player
        if (this.playerId = "Left") {
            return this.topScore;
        }
        else {
            return this.bottomScore;
        }
    },

    makeMove: function (playerId, x, y, toX, toY) {
        // Moves a selected piece to chosen position if possible
        var pieceType = this.getSpace(x, y)
        var options = this.getOptionsForPiece(playerId, pieceType, x, y)

        // Check for legal move
        var legal = false
        for (let i = 0; i < options.length; i++) {
            if (options[i][0] == toX && options[i][1] == toY) {
                legal = true
            }
        }
        if (!legal) {
            // Illegal move
            return false
        }

        // Perform Legal moves
        if (this.getSpace(toX, toY) == 0) {
            // Move to an empty space
            this.place(0, x, y)
            this.place(pieceType, toX, toY)
        }
        else if (this.canPlayerTake(playerId, toX, toY)) {
            // Space occupied by enemy piece that will be taken
            var pointsEarned = this.getSpace(toX, toY)
            if (playerId == 0) { // Top player
                this.topScore += pointsEarned
            }
            else if (playerId == 1) { // Bottom player
                this.bottomScore += pointsEarned
            }
            this.place(0, x, y)
            this.place(pieceType, toX, toY)
        }
        else if (this.canFieldPromote(playerId, x, y, toX, toY)) {
            // Give piece a field promotion
            var promoteTo = this.canFieldPromote(playerId, x, y, toX, toY)
            this.place(0, x, y)
            this.place(promoteTo, toX, toY)
        }

        // Update the last move
        var crossesCanal = !(this.checkSpaceOwnership(playerId, toX, toY))
        this.lastMove = [playerId, x, y, toX, toY, crossesCanal]

        return true
    },
});

/**
 * Gets an HTML Element containing the basic game options for a 2-dimensional grid.
 */
function createBasicGridGameOptionsForMartianChess() {
    //do some normalization for games with only one size parameter (e.g. Atropos)
    var container = document.createElement("div");
    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(Top plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getMartianChessRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv("Top:", leftPlayerElement));

    var rightRadio = getMartianChessRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv("Bottom:", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}

/**
 * Modified radio player options function to include our AI
 */
function getMartianChessRadioPlayerOptions(playerId, namesAndPlayerOptions, defaultId) {
    namesAndPlayerOptions = namesAndPlayerOptions || ["Human", "Random", "Very Easy AI", "Easy AI", "Medium AI", "MCTS Player", "Greedy Player", "Neuralnet Player âœ¨"];
    var playerName;
    var defaultIndex = defaultId;
    if (playerId == CombinatorialGame.prototype.LEFT) {
        playerName = "left";
        if (defaultId == undefined) {
            defaultIndex = 0;
        }
    } else if (playerId == CombinatorialGame.prototype.RIGHT) {
        playerName = "right";
        if (defaultId == undefined) {
            defaultIndex = 0;
        }
    } else {
        console.log("getRadioPlayerOptions got an incorrect playerId");
    }
    var playerNames;
    var players = [];
    //let's fix the playerOptions if they're broken
    if (typeof namesAndPlayerOptions[0] == 'string') {
        playerNames = namesAndPlayerOptions;
        for (var i = 0; i < playerNames.length; i++) {
            const name = playerNames[i];
            if (name == "Human") {
                players.push("new HumanPlayer(viewFactory)");
            } else if (name == "Random") {
                players.push("new RandomPlayer(1000)");
            } else if (name == "Very Easy AI") {
                players.push("new DepthSearchPlayer(1000, 1)");
            } else if (name == "Easy AI") {
                players.push("new DepthSearchPlayer(1000, 2)");
            } else if (name == "Medium AI") {
                players.push("new DepthSearchPlayer(1000, 3)");
            } else if (name.startsWith("MCTS Player")) {
                players.push("new MCTSPlayer(30, 1000)");
            } else if (name.startsWith("Greedy Player")) {
                players.push("new MartianChessGreedyPlayer()");
            } else if (name.startsWith("Neuralnet Player")) {
                players.push("new MartianChessNeuralPlayer()");
            } else {
                console.log("Didn't see an appropriate player name!!!");
                players.push("monkey");
            }
        }
    } else {
        //it's a list
        playerNames = [];
        //console.log("Splitting the player list.");
        for (var i = 0; i < namesAndPlayerOptions.length; i++) {
            playerNames.push(namesAndPlayerOptions[i][0]);
            players.push(namesAndPlayerOptions[i][1]);
        }
        //console.log(players);
    }
    return createRadioGroup(playerName + "Player", playerNames, defaultIndex, players); // "Professional (hangs your browser)"
}

/**
 * The start game function which fires up a new round of Martian Chess.
 */
function newMartianChessGame() {
    var viewFactory = new InteractiveMartianChessViewFactory();
    var playDelay = 1000;
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    leftPlayer.delayMilliseconds = 10
    rightPlayer.delayMilliseconds = 10
    const players = [leftPlayer, rightPlayer];
    var game = new MartianChess();
    var ref = new ScoringReferee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
}

const InteractiveMartianChessView = Class.create({
    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
        this.handleClick = function (event, currentPlayerX, currentPlayerY, containerElement) {
            var nextPosition = this.view.getNextPositionFromClick(event)
            console.log(this.view)
        }
    },

    draw(containerElement, listener) {
        // Clear out the children of containerElement
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");

        // Selected tile potential moves
        var options = []
        if (this.selectedX != undefined) {
            var pieceType = this.position.getSpace(this.selectedX, this.selectedY)
            options = this.position.getOptionsForPiece(this.drawPlayerIndex, pieceType, this.selectedX, this.selectedY)
        }

        this.containerElementCache = containerElement
        this.listenerCache = listener

        // Calculate board scale
        /*
        var boardWidth = Math.min(getAvailableHorizontalPixels(containerElement), window.innerWidth - 200);
        
        var boardPixelSize = Math.min(window.innerHeight, boardWidth) / 10;
        */
        // Now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.width;
        const height = this.position.height;
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        const boardPixelSize = boxSide;
        /*
        boardSvg.setAttributeNS(null, "width", 10 + (this.position.width + 4) * boardPixelSize);
        boardSvg.setAttributeNS(null, "height", 10 + this.position.height * boardPixelSize);
        */

        // Draw the Martian Chess board
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                // Draw the tile
                var parityString = "Even";
                if ((i + j) % 2 == 1) {
                    parityString = "Odd";
                }
                var checkerTile = document.createElementNS(svgNS, "rect");
                checkerTile.setAttributeNS(null, "x", (i * boardPixelSize) + "");
                checkerTile.setAttributeNS(null, "y", (j * boardPixelSize) + "");
                checkerTile.setAttributeNS(null, "posX", new String(i));
                checkerTile.setAttributeNS(null, "posY", new String(j));
                checkerTile.setAttributeNS(null, "height", boardPixelSize + "");
                checkerTile.setAttributeNS(null, "width", boardPixelSize + "");

                // Check if this tile is around moved piece
                var potentialMove = false
                for (var optionId = 0; optionId < options.length; optionId++) {
                    if (options[optionId][0] === i && options[optionId][1] === j) {
                        potentialMove = true
                    }
                }

                if (potentialMove === true) {
                    checkerTile.setAttributeNS(null, "class", "martianChessPotentialMove");
                }
                else if (this.selectedX === i && this.selectedY === j) {
                    checkerTile.setAttributeNS(null, "class", "martianChessSelectedTile");
                }
                else {
                    checkerTile.setAttributeNS(null, "class", "martianChess" + parityString + "Tile");
                }

                boardSvg.appendChild(checkerTile);

                if (listener != undefined) {
                    var player = listener;
                    checkerTile.onclick = function (event) { player.handleClick(event); }
                }
            }
        }

        // Draw the dividing line
        var dividingLine = document.createElementNS(svgNS, "rect");
        dividingLine.setAttributeNS(null, "x", "0");
        dividingLine.setAttributeNS(null, "y", ((this.position.height / 2) * boardPixelSize) - 4 + "");
        dividingLine.setAttributeNS(null, "height", "8");
        dividingLine.setAttributeNS(null, "width", new String(this.position.width * boardPixelSize));
        dividingLine.setAttributeNS(null, "class", "martianChessDivide");
        boardSvg.appendChild(dividingLine);

        // Draw pieces
        for (var i = 0; i < this.position.width; i++) {
            for (var j = 0; j < this.position.height; j++) {
                // Draw the piece if it exists
                piece = this.position.getSpace(i, j)
                if (piece > 0) {
                    // Determine size
                    var pieceSize = 0
                    if (piece == 1) {
                        pieceSize = .30 * boardPixelSize // Pawn
                    }
                    else if (piece == 2) {
                        pieceSize = .55 * boardPixelSize // Drone
                    }
                    else if (piece == 3) {
                        pieceSize = .80 * boardPixelSize // Queen
                    }

                    // Draw piece
                    var pieceTile = document.createElementNS(svgNS, "rect");
                    pieceTile.setAttributeNS(null, "x", (i * boardPixelSize) + ((boardPixelSize - pieceSize) / 2) + "");
                    pieceTile.setAttributeNS(null, "y", (j * boardPixelSize) + ((boardPixelSize - pieceSize) / 2) + "");
                    pieceTile.setAttributeNS(null, "height", new String(pieceSize));
                    pieceTile.setAttributeNS(null, "width", new String(pieceSize));
                    pieceTile.setAttributeNS(null, "posX", new String(i));
                    pieceTile.setAttributeNS(null, "posY", new String(j));
                    if (this.position.lastMove !== undefined && i == this.position.lastMove[3] && j == this.position.lastMove[4]) {
                        pieceTile.setAttributeNS(null, "class", "martianChessHighlightPiece");
                    }
                    else {
                        pieceTile.setAttributeNS(null, "class", "martianChessPiece");
                    }
                    boardSvg.appendChild(pieceTile);
                    if (listener != undefined) {
                        var player = listener;
                        pieceTile.onclick = function (event) { player.handleClick(event); }
                    }
                }
            }
        }

        // Display top score
        var topScoreDisplay = document.createElementNS(svgNS, "text");
        topScoreDisplay.textContent = "TOP SCORE: " + this.position.topScore;
        topScoreDisplay.setAttributeNS(null, "x", boardPixelSize * 0.1 + this.position.width * boardPixelSize + boardPixelSize * 0.1);
        topScoreDisplay.setAttributeNS(null, "y", boardPixelSize * 0.4); // Set the y position, adjust as needed
        topScoreDisplay.setAttributeNS(null, "font-size", boardPixelSize * 0.35);
        topScoreDisplay.setAttributeNS(null, "fill", "black");
        topScoreDisplay.setAttributeNS(null, "overflow", "visible");
        boardSvg.appendChild(topScoreDisplay);

        // Display bottom score
        var bottomScoreDisplay = document.createElementNS(svgNS, "text");
        bottomScoreDisplay.textContent = "BOTTOM SCORE: " + this.position.bottomScore;
        bottomScoreDisplay.setAttributeNS(null, "x", boardPixelSize * 0.1 + this.position.width * boardPixelSize + boardPixelSize * .2);
        bottomScoreDisplay.setAttributeNS(null, "y", this.position.height * boardPixelSize); // Set the y position, adjust as needed
        bottomScoreDisplay.setAttributeNS(null, "font-size", boardPixelSize * 0.35);
        bottomScoreDisplay.setAttributeNS(null, "fill", "black");
        bottomScoreDisplay.setAttributeNS(null, "overflow", "visible");
        boardSvg.appendChild(bottomScoreDisplay);
    },

    // Check adjacency
    isAdjacent(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1
    },

    // Beginning of Interactivity

    getNextPositionFromClick: function (event, playerIndex) {
        var clickedTile = event.target;
        var clickX = Number(clickedTile.getAttribute('posX'));
        var clickY = Number(clickedTile.getAttribute('posY'));
        this.drawPlayerIndex = playerIndex;

        // Make sure there is a piece to select
        if (this.position.getSpace(clickX, clickY) === 0 && this.selectedTile === undefined) {
            return null;
        }

        // Make sure we have ownership of the clicked space
        if (!this.position.checkSpaceOwnership(playerIndex, clickX, clickY) && this.selectedTile === undefined) {
            return null;
        }

        // Determine the piece the player wants to move
        if (this.selectedTile === undefined) { // No piece selected
            this.selectedX = clickX;
            this.selectedY = clickY;
            this.selectTile(clickedTile);
            this.draw(this.containerElementCache, this.listenerCache); // Redraw
            return null;
        }
        else { // Piece is selected
            // Deselect tile if we clicked on the same one
            if (this.selectedX === clickX && this.selectedY === clickY) {
                this.selectedX = undefined;
                this.selectedY = undefined;
                this.deselectTile();
                this.draw(this.containerElementCache, this.listenerCache); // Redraw
                return null;
            }

            this.selectedTile = undefined;
            const clone = this.position.clone();
            success = clone.makeMove(playerIndex, this.selectedX, this.selectedY, clickX, clickY);
            this.deselectTile();
            this.draw(this.containerElementCache, this.listenerCache); // Redraw
            return clone;
        }
    },

    selectTile: function (tile) {
        this.selectedTile = tile;
    },

    deselectTile: function () {
        this.selectedTile = undefined;
        this.selectedX = undefined;
        this.selectedY = undefined;
    },

    selectMoveTile: function (tile) {
        this.selectedMove = tile;
        // Apply visual changes to indicate move selection
    },

    deselectMoveTile: function () {
        this.selectedMove = undefined;
    }

});

const InteractiveMartianChessViewFactory = Class.create({ // MartianChess ViewFactory
    initialize: function () {
    },

    getInteractiveBoard: function (position) {
        return new InteractiveMartianChessView(position);
    },

    getView: function (position) {
        return this.getInteractiveBoard(position);
    },
});

const MartianChessNeuralPlayer = Class.create(ComputerPlayer, {
    initialize: function () {
        this.trainedModelPath = 'martian_chess_converted_network/model.json'; // Path on the webserver where trained model is stored
    },

    givePosition: function (playerIndex, position, referee) {
        // Return the best move
        let playerObject = this
        window.setTimeout(async function () {
            // Load model if this is the first time
            if (playerObject.model === undefined) {
                playerObject.model = await tf.loadLayersModel(playerObject.trainedModelPath);
            }

            // Get options for the player
            let optionStates = position.getOptionsForPlayer(playerIndex);
            let options = playerObject.getOptionsAsList(position, playerIndex, false);

            // Flip board and options if we aren't top player
            let board = position.board;
            if (playerIndex !== CombinatorialGame.prototype.LEFT) {
                board = playerObject.rotateBoard(board);
                options = playerObject.rotateOptions(options, position.width, position.height)
                for (let i = 0; i < optionStates.length; i++) {
                    let lm = optionStates[i].lastMove
                    let rotated_move = playerObject.rotateOptions([[lm[1], lm[2], lm[3], lm[4]]], position.width, position.height)[0]
                    optionStates[i].move = [optionStates[i][0], rotated_move[0], rotated_move[1], rotated_move[2], rotated_move[3], optionStates[i][5]]
                }
            }
            else {
                for (let i = 0; i < optionStates.length; i++) {
                    optionStates[i].move = optionStates[i].lastMove
                }
            }

            // Encode & flatten board state
            let encodedBoard = playerObject.oneHotEncodeBoard(board);
            let flattenedBoard = encodedBoard.flat(2);

            // Perform forward pass through network
            let inputTensor = tf.tensor(flattenedBoard).reshape([1, 96]);
            let outputTensor = playerObject.model.predict(inputTensor);
            let confidences = await outputTensor.data();

            // Generate mask of legal moves
            let moveSpace = playerObject.getAllPossibleMoves();
            let moveMask = [];
            for (let i = 0; i < moveSpace.length; i++) {
                let move = moveSpace[i];
                let legalMove = 0;
                for (let j = 0; j < optionStates.length; j++) {
                    let option = optionStates[j].move;
                    if (move[0] === option[1] && move[1] === option[2] && move[2] == option[3] && move[3] == option[4]) {
                        legalMove = 1;
                    }
                    // if (playerObject.previousMove !== undefined && option[1] == playerObject.previousMove[1] && option[2] == playerObject.previousMove[0] && option[3] == playerObject.previousMove[3] && option[4] == playerObject.previousMove[2]) {
                    //     legalMove = 0; // Override to prevent repeated moves
                    //     console.log("Move reject:" + option)
                    // }
                }
                moveMask.push(legalMove);
            }

            // Apply move mask to network output
            let maskedConfidences = []
            for (let i = 0; i < moveMask.length; i++) {
                maskedConfidences.push(confidences[i] * moveMask[i])
            }

            // Make random choice using probability distribution
            let totalWeight = 0;
            let cumulativeWeights = [];
            for (let i = 0; i < maskedConfidences.length; i++) {
                let weight = maskedConfidences[i];
                totalWeight += weight;
                cumulativeWeights.push(totalWeight);
            }
            let randomValue = Math.random() * totalWeight;
            let weightedProbabilityMove = 0;
            for (let i = 0; i < cumulativeWeights.length; i++) {
                if (randomValue < cumulativeWeights[i]) {
                    weightedProbabilityMove = i;
                    break;
                }
            }

            // Use maximum confidence option to make move
            let greedyMove = maskedConfidences.reduce((maxIndex, currentValue, currentIndex, maskedConfidences) =>
                currentValue > maskedConfidences[maxIndex] ? currentIndex : maxIndex, 0);

            let selectedMove = greedyMove; // Control logic for move making

            // Turn move choice into a position
            mv = moveSpace[selectedMove];
            let moveOption = false;
            for (let i = 0; i < optionStates.length; i++) {
                let option = optionStates[i]
                if (option.move[1] == mv[0] && option.move[2] == mv[1] && option.move[3] == mv[2] && option.move[4] == mv[3]) {
                    moveOption = option;
                }
            }

            // Handle invalid move
            if (moveOption === false) {
                moveOption = optionStates[Math.floor(Math.random() * optionStates.length)];
                console.log("RL fallback option chosen.");
            }

            // Make that move
            playerObject.previousMove = mv
            referee.moveTo(moveOption);
        }, this.delayMilliseconds);
    },

    oneHotEncodeBoard: function (board) {
        const boardArray = board.map(row => row.slice());

        // Create a one hot encoded board for each piece type (1 means that specific piece is there)
        const pawnsBoard = boardArray.map(row => row.map(cell => (cell === 1 ? 1 : 0)));
        const dronesBoard = boardArray.map(row => row.map(cell => (cell === 2 ? 1 : 0)));
        const queensBoard = boardArray.map(row => row.map(cell => (cell === 3 ? 1 : 0)));

        // Stack the boards on top of eachother
        const oneHotBoard = [pawnsBoard, dronesBoard, queensBoard];
        return oneHotBoard;
    },

    getAllPossibleMoves: function () {
        // Initialize the board as in the Python version
        let board = new MartianChess();
        let width = board.width;
        let height = board.height;

        // Zero out board
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                board.place(0, x, y);
            }
        }

        // Try permutations
        let allMoves = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let piece = 1; piece < 4; piece++) {
                    board.place(piece, x, y); // Place this type of piece at X/Y
                    let posOptions = this.getOptionsAsList(board, CombinatorialGame.prototype.LEFT, true);
                    allMoves = allMoves.concat(posOptions); // Add all moves for this player
                    board.place(0, x, y); // Remove the piece we placed
                }
            }
        }

        // Avoid premature deduplication: Keep all unique moves exactly as Python
        // To accurately collect unique moves, convert each move into a string format and re-convert it to an array format
        let uniqueMoves = allMoves.filter(
            (move, index, self) => index === self.findIndex((m) => JSON.stringify(m) === JSON.stringify(move))
        );

        return uniqueMoves;
    },

    getOptionsAsList: function (position, playerIndex, ignoreLastMove) {
        if (ignoreLastMove) {
            position.lastMove = false
        }
        let optionPositions = position.getOptionsForPlayer(playerIndex, true);
        let options = [];
        for (let i = 0; i < optionPositions.length; i++) {
            let opt = optionPositions[i].lastMove;
            options.push([opt[1], opt[2], opt[3], opt[4]]); // Reformat option as (fromX, fromY, toX, toY)
        }
        return options;
    },

    rotateBoard: function (board) {
        const rotatedBoard = board.map(row => [...row]); // Copy board
        rotatedBoard.reverse(); // Flip X Axis
        for (let i = 0; i < rotatedBoard.length; i++) { // For each row
            rotatedBoard[i].reverse(); // Flip Y Axis
        }
        return rotatedBoard;
    },

    rotateOptions: function (options, width, height) {
        let w = width - 1;
        let h = height - 1;
        let rotated_options = [];
        for (let i = 0; i < options.length; i++) {
            let from_x = options[i][0];
            let from_y = options[i][1];
            let to_x = options[i][2];
            let to_y = options[i][3];
            rotated_options.push([w - from_x, h - from_y, w - to_x, h - to_y])
        }
        return rotated_options
    }
})

const MartianChessGreedyPlayer = Class.create(ComputerPlayer, {
    initialize: function () {
    },

    givePosition: function (playerIndex, position, referee) {
        // Return the best move
        options = position.getOptionsForPlayer(playerIndex);

        let greediest_option = null;
        let greediest_score = -999;
        for (let i = 0; i < options.length; i++) {
            let clone = position.clone();
            let opt = options[i].lastMove;
            clone.makeMove(playerIndex, opt[1], opt[2], opt[3], opt[4]);

            let score = clone.getScore();
            if (playerIndex == CombinatorialGame.prototype.RIGHT) {
                score = -score; // Flip score if we are playing on the bottom
            }
            if (score > greediest_score) {
                greediest_score = score;
                greediest_option = [i];
            }
            else if (score >= greediest_score) {
                greediest_option.push(i)
            }
        }

        randomly_selected_greedy_option = greediest_option[Math.floor(Math.random() * (greediest_option.length))];
        window.setTimeout(function () { referee.moveTo(options[randomly_selected_greedy_option]); }, this.delayMilliseconds);
    },
})

//end of Martian Chess


/**
 * Class for NoCanDo ruleset.
 */
var NoCanDo = Class.create(CombinatorialGame, {

    /**
     * Constructor
     */
    initialize: function (width, height, startingDominoes, blockedSpaces) {
        startingDominoes = startingDominoes || [new Array(), new Array()];
        this.dominoes = [new Array(), new Array()];
        for (var i = 0; i < startingDominoes.length; i++) {
            for (var j = 0; j < startingDominoes[i].length; j++) {
                var startingDomino = startingDominoes[i][j];
                this.dominoes[i].push([startingDomino[0], startingDomino[1]]);
            }
        }
        blockedSpaces = blockedSpaces || new Array();
        this.blockedSpaces = new Array();
        for (var i = 0; i < blockedSpaces.length; i++) {
            var blockedSpace = blockedSpaces[i];
            this.blockedSpaces.push([blockedSpace[0], blockedSpace[1]]);
        }
        this.width = width;
        this.height = height;
        this.playerNames = ["Vertical", "Horizontal"];
    }

    ,/**
     * toString
     */
    toString: function () {
        var string = "Domineering position\n";
        for (var i = 0; i < this.dominoes.length; i++) {
            string += this.playerNames[i] + "'s dominoes (top-left corner) are at:\n";
            for (var j = 0; j < this.dominoes[i].length; j++) {
                string += "  " + this.dominoes[i][j] + "\n";
            }
        }
        string += "Blocked Spaces:\n";
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            string += "  " + this.blockedSpaces[i] + "\n";
        }
        return string;
    }

    ,/**
     * Clones this, but replaces dominoes with blocked spaces
     */
    simplify: function () {
        var clone = this.clone();
        for (var playerId = 0; playerId < 2; playerId++) {
            while (clone.dominoes[playerId].length > 0) {
                var domino = clone.dominoes[playerId].pop();
                clone.blockedSpaces.push(domino);
                clone.blockedSpaces.push([domino[0] + playerId, domino[1] + (1 - playerId)]);
            }
        }
        return clone;
    }

    ,/**
     * Returns the move options.
     */
    getOptionsForPlayer: function (playerId) {
        var options = new Array();
        var dominoPlacements = this.getDominoMoves(playerId);
        for (var i = 0; i < dominoPlacements.length; i++) {
            var newDomino = dominoPlacements[i];
            var column = newDomino[0];
            var row = newDomino[1];
            var option = this.clone();
            option.dominoes[playerId].push([column, row]);
            options.push(option);
        }
        return options;
    }

    ,/**
     * Checks that a vertical domino has at least one liberty
     */
    isVerticalDominoHappy: function (dominoBlock) {
        var x = dominoBlock[0];
        var y = dominoBlock[1];
        var simplifiedBoard = this.simplify();
        var topToTheLeft = dominoBlock[0] + 1;
        var blockedTop = false;
        var blockedBottom = false;
        var blockedTopRight = false;
        var blockedTopLeft = false;
        var blockedBottomLeft = false;
        var blockedBottomRight = false;
        for (var blockIndex = 0; blockIndex < simplifiedBoard.blockedSpaces.length; blockIndex++) {
            var block = simplifiedBoard.blockedSpaces[blockIndex]
            var toTheRight = dominoBlock[0] + 1;
            var toTheLeft = dominoBlock[0] - 1;
            var topAndAbove = dominoBlock[1] - 1;
            var bottomY = dominoBlock[1] + 1;
            var bottomAndBelow = dominoBlock[1] + 2;
            if (((block[0] == toTheRight) && (block[1] == dominoBlock[1])) || (dominoBlock[0] == this.width - 1)) {
                blockedTopRight = true;
            }
            if (((block[0] == toTheLeft) && (block[1] == dominoBlock[1])) || (dominoBlock[0] == 0)) {
                blockedTopLeft = true;
            }
            if (((block[0] == dominoBlock[0]) && (block[1] == topAndAbove)) || (dominoBlock[1] == 0)) {
                blockedTop = true;
            }
            if (((block[0] == toTheRight) && (block[1] == bottomY)) || (dominoBlock[0] == this.width - 1)) {
                blockedBottomRight = true;
            }
            if (((block[0] == toTheLeft) && (block[1] == bottomY)) || (dominoBlock[0] == 0)) {
                blockedBottomLeft = true;
            }
            if (((block[0] == dominoBlock[0]) && (block[1] == bottomAndBelow)) || (dominoBlock[1] == this.height - 2)) {
                blockedBottom = true;
            }
        }
        if ((blockedTop == true) && (blockedBottom == true) && (blockedTopLeft == true) && (blockedTopRight == true) && (blockedBottomLeft == true) && (blockedBottomRight == true)) {
            return false;
        } else {
            return true;
        }
    }

    ,/**
     * Checks that a horizontal domino has at least one liberty
     */
    ishorizontalDominoHappy: function (dominoBlock) {
        var simplifiedBoard = this.simplify();
        var topToTheLeft = dominoBlock[0] + 1;
        var blockedLeft = false;
        var blockedRight = false;
        var blockedTopRight = false;
        var blockedTopLeft = false;
        var blockedBottomLeft = false;
        var blockedBottomRight = false;
        for (var blockIndex = 0; blockIndex < simplifiedBoard.blockedSpaces.length; blockIndex++) {
            var block = simplifiedBoard.blockedSpaces[blockIndex]
            var top = dominoBlock[1] - 1;
            var bottom = dominoBlock[1] + 1;
            var right = dominoBlock[0] + 1;
            var left = dominoBlock[0] - 1;
            var allTheWayRight = dominoBlock[0] + 2;
            if (((block[0] == dominoBlock[0]) && (block[1] == top)) || (dominoBlock[1] == 0)) {
                blockedTopLeft = true;
            }
            if (((block[0] == right) && (block[1] == top)) || (dominoBlock[1] == 0)) {
                blockedTopRight = true;
            }
            if (((block[0] == left) && (block[1] == dominoBlock[1])) || (dominoBlock[0] == 0)) {
                blockedLeft = true;
            }
            if (((block[0] == allTheWayRight) && (block[1] == dominoBlock[1])) || (dominoBlock[0] == this.width - 2)) {
                blockedRight = true;
            }
            if (((block[0] == dominoBlock[0]) && (block[1] == bottom)) || (dominoBlock[1] == this.height - 1)) {
                blockedBottomLeft = true;
            }
            if (((block[0] == right) && (block[1] == bottom)) || (dominoBlock[1] == this.height - 1)) {
                blockedBottomRight = true;
            }
        }
        if ((blockedLeft == true) && (blockedRight == true) && (blockedTopLeft == true) && (blockedTopRight == true) && (blockedBottomLeft == true) && (blockedBottomRight == true)) {
            return false;
        } else {
            return true;
        }
    }

    ,/**
     * Checks that every domino on the board has at least one liberty
     */
    isBoardHappy: function () {
        var happyDominoes = 0;
        if (this.dominoes[0] != undefined) {
            for (var i = 0; i < this.dominoes[0].length; i++) {
                if (this.isVerticalDominoHappy(this.dominoes[0][i])) {
                    happyDominoes++;
                }
            }
        }
        if (this.dominoes[1] != undefined) {
            for (var i = 0; i < this.dominoes[1].length; i++) {
                if (this.ishorizontalDominoHappy(this.dominoes[1][i])) {
                    happyDominoes++;
                }
            }
        }
        var verticalDominoes = 0;
        if (this.dominoes[0] != undefined) {
            verticalDominoes = this.dominoes[0].length;
        }
        var horizontalDominoes = 0;
        if (this.dominoes[1] != undefined) {
            horizontalDominoes = this.dominoes[1].length;
        }
        if (happyDominoes == (verticalDominoes + horizontalDominoes)) {
            return true;
        } else {
            return false;
        }
    }


    ,/**
     * Gets a list of single-domino placement options for the next player.  Does not return entire game states!
     */
    getDominoMoves: function (playerId) {
        var moves = new Array();
        //don't look at the bottom row for vertical player
        for (var row = 0; row < this.height + playerId - 1; row++) {
            //don't look at the right-most column for horizontal
            for (var column = 0; column < this.width - playerId; column++) {
                //the two spaces the domino would take up
                var dominoSpaces = new Array();
                dominoSpaces.push([column, row]);
                dominoSpaces.push([column + playerId, row + (1 - playerId)]);
                //create the version of this with dominoes replaced by blocked spots
                var allBlocks = this.simplify();
                allBlocks.dominoes = JSON.parse(JSON.stringify(this.dominoes));
                var blocked = false;
                var blocksAroundDomino = 0;
                for (var blockIndex = 0; blockIndex < allBlocks.blockedSpaces.length; blockIndex++) {

                    var block = allBlocks.blockedSpaces[blockIndex]
                    for (var i = 0; i < dominoSpaces.length; i++) {

                        universalBlock = block;
                        universalDomino = dominoSpaces[i];
                        var dominoSpace = dominoSpaces[i];

                        if (block[0] == dominoSpace[0] && block[1] == dominoSpace[1]) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked) break;
                }
                if (!blocked) {
                    allBlocks.dominoes[playerId].push([column, row]);
                    if (allBlocks.isBoardHappy()) {
                        moves.push([column, row]);
                    }
                    else {
                        allBlocks.dominoes[playerId].pop();
                    }
                }
            }
        }
        return moves;
    }

    ,/**
     * clone
     */
    clone: function () {
        //
        return new NoCanDo(this.width, this.height, this.dominoes, this.blockedSpaces);
    }

    ,/**
     * equals
     */
    equals: function (other) {
        //Check that we have matching dominoes.

        //check that other has all of our dominoes
        for (var player = 0; player < this.dominoes.length; player++) {
            for (var i = 0; i < this.dominoes[player].length; i++) {
                var domino = this.dominoes[player][i];
                var otherHasDomino = false;
                for (var j = 0; j < other.dominoes[player].length; j++) {
                    var otherDomino = other.dominoes[player][j];
                    if (domino[0] == otherDomino[0] && domino[1] == otherDomino[1]) {
                        otherHasDomino = true;
                        break;
                    }
                }
                if (!otherHasDomino) return false;
            }
        }

        //now check that we have all of other's dominoes
        //(We don't compare sizes in case there are any repeats.)
        for (var player = 0; player < other.dominoes.length; player++) {
            for (var i = 0; i < other.dominoes[player].length; i++) {
                var otherDomino = other.dominoes[player][i];
                var thisHasDomino = false;
                for (var j = 0; j < this.dominoes[player].length; j++) {
                    var domino = this.dominoes[player][j];
                    if (domino[0] == otherDomino[0] && domino[1] == otherDomino[1]) {
                        thisHasDomino = true;
                        break;
                    }
                }
                if (!thisHasDomino) return false;
            }
        }

        //now check that blocked spaces match

        //check that other has all of our blocked spaces
        for (var i = 0; i < this.blockedSpaces.length; i++) {
            var block = this.blockedSpaces[i];
            var hasBlock = false;
            for (var j = 0; j < other.blockedSpaces.length; j++) {
                var otherBlock = other.blockedSpaces[j];
                if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                    hasBlock = true;
                    break;
                }
            }
            if (!hasBlock) return false;
        }

        //check that this has all of other's blocked spaces
        for (var i = 0; i < other.blockedSpaces.length; i++) {
            var otherBlock = other.blockedSpaces[i]
            var hasBlock = false;
            for (var j = 0; j < this.blockedSpaces.length; j++) {
                var block = this.blockedSpaces[j];
                if (block[0] == otherBlock[0] && block[1] == otherBlock[1]) {
                    hasBlock = true;
                    break;
                }
            }
            if (!hasBlock) return false;
        }

        //all things match! :)
        return true;
    }


}); //end of NoCanDo class
NoCanDo.prototype.PLAYER_NAMES = ["Vertical", "Horizontal"];





/**
 * Launches a new NoCanDo Game.
 */
function newNoCanDoGame() {
    var viewFactory = new InteractiveSVGDomineeringViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    game = new NoCanDo(width, height);
    ref = new Referee(game, players, viewFactory, "gameCanvas", $('messageBox'), controlForm);
};






/////////////// Node Kayles ///////////////

var NonDisconnectingNodeKayles = Class.create(NonDisconnectingArcKayles, {

    /**
     * Clone.
     */
    clone: function () {
        var clone = new NonDisconnectingNodeKayles(this.getWidth(), this.getHeight());
        clone.adjacencies = new Map();
        for (const key of this.adjacencies.keys()) {
            const ogNeighbors = this.adjacencies.get(key);
            const cloneNeighbors = [];
            for (var i = 0; i < ogNeighbors.length; i++) {
                cloneNeighbors.push(ogNeighbors[i]);
            }
            clone.adjacencies.set(key, cloneNeighbors);
        }
        return clone;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const options = [];
        for (const key of this.adjacencies.keys()) {
            const option = this.getOptionFromMove(key);
            if (option.isConnected()) {
                options.push(option);
            }
        }
        return options;
    }

    /**
     * Returns the option from selecting a node. Doesn't check whether the resulting graph is legal.
     */
    , getOptionFromMove: function (id) {
        id = Number(id); //why was it turning into a string?
        const option = this.clone();
        const neighbors = option.adjacencies.get(id);
        /*
        if (neighbors === undefined) {
            console.log("haskey? " + option.adjacencies.has(id));
            console.log("id: " + id + "  " + (typeof id));
            console.log(option.adjacencies);
            for (const key of option.adjacencies.keys()) {
                console.log(key + "  " + (typeof key) + "  " + (key == id));
            }
        }
        */
        const neighborsCopy = [];
        for (var i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
            neighborsCopy.push(Number(neighbor));
        }
        for (var i = 0; i < neighborsCopy.length; i++) {
            const neighbor = neighborsCopy[i];
            option.deleteVertex(neighbor);
        }
        option.deleteVertex(id);
        return option;
        /*
        if (option.isConnected()) {
            return option;
        } else {
            return null;
        }*/
    }


}); //end of NonDisconnectingNodeKayles



const InteractiveNonDisconnectingNodeKaylesView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //console.log("boxSide:" + boxSide);


        //draw the board
        for (const v1 of this.position.adjacencies.keys()) {
            const neighbors = this.position.adjacencies.get(v1);
            const v1Coords = this.position.idToCoords(v1);
            var element;
            //draw the edges
            for (var i = 0; i < neighbors.length; i++) {
                const v2 = neighbors[i];
                if (v1 < v2) {
                    const v2Coords = this.position.idToCoords(v2);
                    element = document.createElementNS(svgNS, "line");
                    element.setAttributeNS(null, "x1", (v1Coords[0] + .5) * boxSide);
                    element.setAttributeNS(null, "y1", (v1Coords[1] + .5) * boxSide);
                    element.setAttributeNS(null, "x2", (v2Coords[0] + .5) * boxSide);
                    element.setAttributeNS(null, "y2", (v2Coords[1] + .5) * boxSide);
                    element.style.stroke = "black";
                    element.style.strokeWidth = "8";
                    boardSvg.appendChild(element);
                }
            }
            //draw v1
            element = document.createElementNS(svgNS, "circle");
            element.setAttributeNS(null, "cx", (v1Coords[0] + .5) * boxSide);
            element.setAttributeNS(null, "cy", (v1Coords[1] + .5) * boxSide);
            element.setAttributeNS(null, "r", .25 * boxSide);
            element.style.stroke = "black";
            element.style.fill = "black";
            boardSvg.appendChild(element);
            if (listener != undefined) {
                var player = listener;
                element.onclick = function (event) { player.handleClick(event); }
                element.id = v1;
            }

        }
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        const id = event.target.id;
        //3console.log("Getting option from click... (" + id + ")");
        const option = this.position.getOptionFromMove(id);
        //console.log("Got option from click...");
        //console.log(option);
        return option;
    }

}); //end of InteractiveNonDisconnectingNodeKaylesView



/**
 * View Factory for NonDisconnectingNodeKayles
 */
var InteractiveNonDisconnectingNodeKaylesViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveNonDisconnectingNodeKaylesView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveNonDisconnectingNodeKaylesViewFactory

/**
 * Launches a new NonDisconnectingNodeKayles game.
 */
function newNonDisconnectingNodeKaylesGame() {
    var viewFactory = new InteractiveNonDisconnectingNodeKaylesViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new NonDisconnectingNodeKayles(width, height);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of NonDisconnectingNodeKayles





var NoGo = Class.create(CombinatorialGame, {

    /**
     * Constructor.  Creates a distance game on a grid where you aren't allowed to play at the sameDistances or differentDistances.  Either columnsOrWidth are both natural numbers as the dimensions, or height is undefined and columnsOrWidth is the columns to copy.
     */
    initialize: function (columnsOrWidth, height) {
        this.UNCOLORED = 2;
        if (height === undefined) {
            //no fourth parameter, so columnsOrWidth represents the columns.
            this.columns = columnsOrWidth; //this will get replaced shortly
            this.columns = this.cloneColumns(columnsOrWidth);
        } else {
            this.columns = [];
            for (var i = 0; i < columnsOrWidth; i++) {
                var column = [];
                this.columns.push(column);
                for (var j = 0; j < height; j++) {
                    column.push(this.UNCOLORED);
                }
            }
        }
        this.playerNames = ["Black", "White"];
    }

    /**
     * Clones the columns.
     */
    , cloneColumns: function (columns) {
        var columnsClone = [];
        for (var i = 0; i < this.getWidth(); i++) {
            var columnClone = [];
            columnsClone.push(columnClone);
            for (var j = 0; j < this.getHeight(); j++) {
                columnClone.push(columns[i][j]);
            }
        }
        return columnsClone;
    }

    /**
     * Clones this.
     */
    , clone: function () {
        return new NoGo(this.columns);
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.columns[0].length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Returns a list of all connected components.
     */
    , getConnectedComponents: function () {
        var components = this.getConnectedComponentsWithColor(CombinatorialGame.prototype.LEFT);
        var rightComponents = this.getConnectedComponentsWithColor(CombinatorialGame.prototype.RIGHT);
        for (var i = 0; i < rightComponents.length; i++) {
            components.push(rightComponents[i]);
        }
        return components;
    }

    /**
     * Returns a list of lists of connected components of a color.
     */
    , getConnectedComponentsWithColor: function (playerId) {
        //create a 2-d array of booleans
        var marked = [];
        for (var i = 0; i < this.getWidth(); i++) {
            var markedColumn = [];
            marked.push(markedColumn);
            for (var j = 0; j < this.getHeight(); j++) {
                markedColumn.push(false);
            }
        }

        var components = [];
        //go through each vertex, build a component around it if it's the right color and not marked
        for (var column = 0; column < this.getWidth(); column++) {
            for (var row = 0; row < this.getHeight(); row++) {
                if (!marked[column][row] && this.columns[column][row] == playerId) {
                    var component = [];
                    this.addToConnectedComponentAround(column, row, component, playerId, marked);
                    components.push(component);
                }
            }
        }
        return components;
    }

    /**
     * Returns the connected same-color component around a vertex.  Only 
     */
    , addToConnectedComponentAround: function (column, row, component, playerId, marked) {
        if (!marked[column][row] && this.columns[column][row] == playerId) {
            marked[column][row] = true;
            component.push([column, row]);

            //check the four neighboring vertices
            var neighborCol;
            var neighborRow;
            //check above
            if (row > 0) {
                neighborCol = column;
                neighborRow = row - 1;
                this.addToConnectedComponentAround(neighborCol, neighborRow, component, playerId, marked);
            }
            //check to the right
            if (column < this.getWidth() - 1) {
                neighborCol = column + 1;
                neighborRow = row;
                this.addToConnectedComponentAround(neighborCol, neighborRow, component, playerId, marked);
            }
            //check below
            if (row < this.getHeight() - 1) {
                neighborCol = column;
                neighborRow = row + 1;
                this.addToConnectedComponentAround(neighborCol, neighborRow, component, playerId, marked);
            }
            //check left
            if (column > 0) {
                neighborCol = column - 1;
                neighborRow = row;
                this.addToConnectedComponentAround(neighborCol, neighborRow, component, playerId, marked);
            }
        }
    }

    /**
     * Checks that all components have a liberty.
     */
    , allComponentsHaveLiberty: function () {
        var components = this.getConnectedComponents();
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (!this.componentHasLiberty(component)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks that a component has a liberty.
     */
    , componentHasLiberty: function (component) {
        for (var i = 0; i < component.length; i++) {
            var vertex = component[i];
            var column = vertex[0];
            var row = vertex[1];
            //check the four neighbors
            //check above
            if (row > 0 && this.columns[column][row - 1] == this.UNCOLORED) {
                return true;
            }
            //check right
            if (column < this.getWidth() - 1 && this.columns[column + 1][row] == this.UNCOLORED) {
                return true;
            }
            //check below
            if (row < this.getHeight() - 1 && this.columns[column][row + 1] == this.UNCOLORED) {
                return true;
            }
            //check left
            if (column > 0 && this.columns[column - 1][row] == this.UNCOLORED) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = [];

        for (var column = 0; column < this.getWidth(); column++) {
            for (var row = 0; row < this.getHeight(); row++) {
                if (this.columns[column][row] == this.UNCOLORED) {
                    if (this.isMoveLegal(column, row, playerId)) {
                        //the move is legal!  Let's put it in there! :)
                        var option = this.getOption(column, row, playerId);
                        options.push(option);
                    }
                }
            }
        }
        return options;
    }

    /**
     * Gets a single option.  This assumes that the move is legal.
     */
    , getOption: function (column, row, playerId) {
        var option = this.clone();
        option.columns[column][row] = playerId;
        return option;
    }

    /**
     * Checks that changing the vertex at [column, row] to color is a legal move.
     */
    , isMoveLegal: function (column, row, color) {
        //
        if (this.columns[column][row] != this.UNCOLORED) {
            return false;
        } else {
            //[column, row] is uncolored, good!
            var move = this.getOption(column, row, color);
            axe = this;
            return move.allComponentsHaveLiberty();
        }
    }

}); //end of NoGo class
NoGo.prototype.PLAYER_NAMES = ["Black", "White"];


var NoGoInteractiveView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //get some dimensions based on the canvas size
        var maxDiameter = boxSide;
        var padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var circle = document.createElementNS(svgNS, "circle");
                var centerX = 5 + Math.floor((colIndex + .5) * boxSide);
                circle.setAttributeNS(null, "cx", centerX);
                var centerY = 5 + Math.floor((rowIndex + .5) * boxSide);
                circle.setAttributeNS(null, "cy", centerY);
                circle.setAttributeNS(null, "r", nodeRadius);
                circle.style.stroke = "black";
                circle.style.strokeWidth = 5;
                if (this.position.columns[colIndex][rowIndex] == CombinatorialGame.prototype.LEFT) {
                    circle.style.fill = "black";
                } else if (this.position.columns[colIndex][rowIndex] == CombinatorialGame.prototype.RIGHT) {
                    circle.style.fill = "white";
                } else {
                    circle.style.fill = "gray";
                    if (listener != undefined) {
                        var player = listener;
                        //circle will be event.target, so give it some extra attributes.
                        circle.column = colIndex;
                        circle.row = rowIndex;
                        circle.onclick = function (event) { player.handleClick(event); }
                    }
                }
                boardSvg.appendChild(circle);
                //now add the edges
                if (colIndex < width - 1) {
                    var line = document.createElementNS(svgNS, "line");
                    line.setAttributeNS(null, "x1", centerX + nodeRadius);
                    line.setAttributeNS(null, "y1", centerY);
                    line.setAttributeNS(null, "x2", centerX + boxSide - nodeRadius);
                    line.setAttributeNS(null, "y2", centerY);
                    line.style.stroke = "black";
                    line.style.strokeWidth = 5;
                    boardSvg.appendChild(line);
                }
                if (rowIndex < height - 1) {
                    var line = document.createElementNS(svgNS, "line");
                    line.setAttributeNS(null, "x1", centerX);
                    line.setAttributeNS(null, "y1", centerY + nodeRadius);
                    line.setAttributeNS(null, "x2", centerX);
                    line.setAttributeNS(null, "y2", centerY + boxSide - nodeRadius);
                    line.style.stroke = "black";
                    line.style.strokeWidth = 5;
                    boardSvg.appendChild(line);
                }
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var column = event.target.column;
        var row = event.target.row;

        if (this.position.isMoveLegal(column, row, currentPlayer)) {
            var option = this.position.getOption(column, row, currentPlayer);
            player.sendMoveToRef(option);
        }
    }

}); //end of NoGoInteractiveView class

/**
 * View Factory for NoGo
 */
var NoGoInteractiveViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new NoGoInteractiveView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of NoGoInteractiveViewFactory

/**
 * Launches a new NoGo game.
 */
function newNoGoGame() {
    var viewFactory = new NoGoInteractiveViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new NoGo(width, height);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);

};




/////////////////////////////// Paint Can //////////////////////////////////////////

/**
 * Paint Can position.
 * 
 * Piles are stored in a 2D array of ints.  Each element is a realization.
 */
const PaintCan = Class.create(CombinatorialGame, {

    /**
     * Constructor.  brickPiles, a list of lists with elements from {"red", "blue", "green", "gray"} to describe the color of the bricks.  
     */
    initialize: function (brickPiles) {
        this.playerNames = ["Blue", "Red"];
        //deep copy the brickPiles
        this.piles = [];
        for (const brickPile of brickPiles) {
            const pile = [];
            for (const element of brickPile) {
                pile.push(element);
            }
            this.piles.push(pile);
        }
    }

    /**
     * Returns a string version of this.
     */
    , toString: function () {
        var string = "PaintCan with " + this.piles.length + " piles:\n";
        for (const pile of this.piles) {
            string += pile + "\n";
        }
        return string;
    }

    /**
     * Returns the number of piles.
     */
    , getNumPiles: function () {
        return this.piles.length;
    }

    /**
     * Returns whether this equals another PaintCan
     */
    , equals: function (other) {
        if (this.getNumPiles() != other.getNumPiles()) {
            return false;
        }
        for (var i = 0; i < this.getNumPiles(); i++) {
            const thisPile = this.piles[i];
            const otherPile = this.piles[i];
            if (thisPile.length != otherPile.length) {
                return false;
            }
            for (var j = 0; j < thisPile.length; j++) {
                if (thisPile[j] != otherPile[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        const clone = new PaintCan(this.piles);
        return clone;
    }

    /**
     * Returns whether a player can play on a specific color.
     */
    , canPlayOnBrick: function (playerId, color) {
        return color == "green" || (playerId == CombinatorialGame.prototype.LEFT && color == "blue") || (playerId == CombinatorialGame.prototype.RIGHT && color == "red");
    }

    /**
     * Returns the max pile height.
     */
    , getMaxPileHeight: function () {
        var height = 0;
        for (const pile of this.piles) {
            height = Math.max(height, pile.length);
        }
        return height;
    }

    /**
     * Returns a single option.
     */
    , getOptionAt: function (pileIndex, brickIndex) {
        const option = this.clone();
        //make a new green-only pile
        const newPile = [];
        while (newPile.length < brickIndex) {
            newPile.push("green");
        }
        option.piles[pileIndex] = newPile;
        return option;

    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        //first get the options from classical moves
        var options = new Array();
        for (var i = 0; i < this.piles.length; i++) {
            const pile = this.piles[i];
            for (var j = 0; j < pile.length; j++) {
                if (this.canPlayOnBrick(playerId, pile[j])) {
                    const option = this.getOptionAt(i, j);
                    options.push(option);
                }
            }
        }
        return options;
    }
}); //end of PaintCan class.




var InteractivePaintCanView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //console.log("Drawing...");
        yoGabba = containerElement;
        gabba = this;
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const boardPixelWidth = canvasWidth;
        const boardPixelHeight = canvasHeight;

        /*
        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        */

        //const maxBrickWidth = Math.floor((window.innerWidth - 200) / (2 * this.position.getNumPiles() + 1));
        const maxBrickWidth = Math.floor(boardPixelWidth / (2 * this.position.getNumPiles() + 1));
        const maxBrickHeight = Math.floor(boardPixelHeight / (this.position.getMaxPileHeight() + 6));
        const brickHeight = Math.min(maxBrickHeight, maxBrickWidth / 4);
        const brickWidth = Math.min(maxBrickWidth, 4 * brickHeight);

        const groundY = brickHeight * (this.position.getMaxPileHeight() + 4);
        const groundX = Math.floor(brickWidth * .5);
        const ground = document.createElementNS(svgNS, "rect");
        ground.setAttributeNS(null, "x", groundX + "");
        ground.setAttributeNS(null, "y", groundY + "");
        ground.setAttributeNS(null, "width", (brickWidth * 2 * this.position.getNumPiles()) + "");
        ground.setAttributeNS(null, "height", brickHeight + "");
        ground.style.stroke = "black";
        ground.style.fill = "brown";
        boardSvg.appendChild(ground);

        //draw the piles
        for (var pileIndex = 0; pileIndex < this.position.getNumPiles(); pileIndex++) {
            const pile = this.position.piles[pileIndex];
            var hasCan = false; //whether there's a paint can on top
            //draw the pile
            const brickX = (1 + 2 * pileIndex) * brickWidth;
            for (var brickIndex = 0; brickIndex < pile.length; brickIndex++) {
                //draw one brick
                const brickColor = pile[brickIndex];
                const brickY = groundY - ((1 + brickIndex) * brickHeight);
                const brick = document.createElementNS(svgNS, "rect");
                brick.setAttributeNS(null, "x", brickX + "");
                brick.setAttributeNS(null, "y", brickY + "");
                brick.setAttributeNS(null, "width", brickWidth + "");
                brick.setAttributeNS(null, "height", brickHeight + "");
                brick.style.stroke = "black";
                brick.style.fill = brickColor;
                boardSvg.appendChild(brick);
                if (listener != undefined) {
                    brick.pileIndex = pileIndex;
                    brick.brickIndex = brickIndex;
                    var player = listener;
                    brick.onclick = function (event) { player.handleClick(event); };
                }
                if (brickColor != "green") {
                    hasCan = true;
                }
            }
            if (hasCan) {
                //draw the paint can on top 
                const can = document.createElementNS(svgNS, "rect");
                const canX = brickX + Math.floor(brickWidth / 4);
                const canY = groundY - ((2 + pile.length) * brickHeight);
                const canHeight = 2 * brickHeight;
                const canWidth = Math.floor(brickWidth / 2);
                can.setAttributeNS(null, "x", canX + "");
                can.setAttributeNS(null, "y", canY + "");
                can.setAttributeNS(null, "width", canWidth + "");
                can.setAttributeNS(null, "height", canHeight + "");
                can.style.stroke = "silver";
                can.style.fill = "green";
                boardSvg.appendChild(can);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        const pileIndex = event.target.pileIndex;
        const brickIndex = event.target.brickIndex;
        const brickColor = this.position.piles[pileIndex][brickIndex];
        if (this.position.canPlayOnBrick(currentPlayer, brickColor)) {
            const option = this.position.getOptionAt(pileIndex, brickIndex);
            player.sendMoveToRef(option);
        }
    }


});  //end of InteractivePaintCanView

/**
 * View Factory for PaintCan
 */
var InteractivePaintCanViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractivePaintCanView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractivePaintCanViewFactory

/**
 * Generates a random PaintCan game.
 */
function getRandomPaintCanGame(numPiles, minPileSize, maxPileSize) {
    const piles = [];
    const colors = ["blue", "red", "green", "gray"];
    for (var i = 0; i < numPiles; i++) {
        const pile = [];
        const numBricks = minPileSize + Math.floor(Math.random() * (maxPileSize + 1 - minPileSize));
        //we don't want the bottom brick to be gray, otherwise it's just equal to zero.
        const firstBrick = randomChoice(["blue", "red", "green"]);
        pile.push(firstBrick);
        //push on all the remaining bricks (aside from the top.
        for (var j = 1; j < numBricks - 1; j++) {
            pile.push(randomChoice(colors));
        }
        //now add a top brick.  Again, not Gray.  Also, we want to make sure both players can play on each stack.
        if (numBricks > 1) {
            var blueCanPlay = false;
            var redCanPlay = false;
            for (var j = 0; j < numBricks - 1; j++) {
                const brick = pile[j];
                if (brick == "blue" || brick == "green") {
                    blueCanPlay = true;
                }
                if (brick == "red" || brick == "green") {
                    redCanPlay = true;
                }
            }
            if (blueCanPlay && redCanPlay) {
                pile.push(randomChoice(["blue", "red", "green"]));
            } else if (blueCanPlay && !redCanPlay) {
                pile.push(randomChoice(["green", "red"]));
            } else {
                //red can play, but blue cannot
                pile.push(randomChoice(["green", "blue"]));
            }
        }
        piles.push(pile);
    }
    //mainGame = new PaintCan(piles);
    return new PaintCan(piles);
}

/**
 * Launches a new PaintCan game.
 */
function newPaintCanGame() {
    var viewFactory = new InteractivePaintCanViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = getRandomPaintCanGame(width, 2, height);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
}


PaintCan.prototype.PLAYER_NAMES = ["Blue", "Red"];
///////////////// End of Paint Can





///////////////////////////// Popping Balloons ////////////////////////////////

/**
 * Popping Balloons.
 * 
 * Grid is stored as a 2D array of booleans.
 * @author Kyle Burke
 */
var PoppingBalloons = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (height, width) {
        var balloonLikelihood = .85;

        this.playerNames = ["Left", "Right"];

        this.columns = new Array();
        for (var colI = 0; colI < width; colI++) {
            var column = new Array();
            for (var rowI = 0; rowI < height; rowI++) {
                column.push(Math.random() <= balloonLikelihood);
            }
            this.columns.push(column);
        }
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.columns[0].length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var other = new PoppingBalloons(height, width);
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                other.columns[col][row] = this.columns[col][row];
            }
        }
        return other;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = new Array();
        var width = this.getWidth();
        var height = this.getHeight();
        //single balloon options
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                if (this.columns[col][row]) {
                    //create the option for popping that one balloon
                    options.push(this.getSingleBalloonOption(col, row));
                }
            }
        }

        //horizontal balloon pair options
        for (var col = 0; col < width - 1; col++) {
            for (var row = 0; row < height; row++) {
                if (this.columns[col][row] && this.columns[col + 1][row]) {
                    //create the option for popping the two balloons
                    options.push(this.getHorizontalBalloonOption(col, row));
                }
            }
        }

        //vertical balloon pair options
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height - 1; row++) {
                if (this.columns[col][row] && this.columns[col][row + 1]) {
                    //create the option for popping the two balloons
                    options.push(this.getVerticalBalloonOption(col, row));
                }
            }
        }

        //all balloons in a 2x2 square options
        for (var col = 0; col < width - 1; col++) {
            for (var row = 0; row < height - 1; row++) {
                //we just have to check that two diagonal balloons are there, otherwise we will be covered by any of the prior cases
                if ((this.columns[col][row] && this.columns[col + 1][row + 1]) || (this.columns[col + 1][row] && this.columns[col][row + 1])) {
                    //create the option for popping the two balloons
                    options.push(this.getSquareBalloonOption(col, row));
                }
            }
        }
        return options;
    }

    /**
     * Gets the result of a single balloon pop.  (This is not a required (inheriting) function.)
     */
    , getSingleBalloonOption: function (column, row) {
        var option = this.clone();
        option.columns[column][row] = false;
        return option;
    }

    /**
     * Gets the result of popping two balloons next to each other (horizontally).
     */
    , getHorizontalBalloonOption: function (column, row) {
        var option = this.clone();
        option.columns[column][row] = false;
        option.columns[column + 1][row] = false;
        return option;
    }

    /**
     * Gets the result of popping two balloons on top of each other (vertically).
     */
    , getVerticalBalloonOption: function (column, row) {
        var option = this.clone();
        option.columns[column][row] = false;
        option.columns[column][row + 1] = false;
        return option;
    }

    /**
     * Gets the result of popping two balloons on top of each other (vertically).
     */
    , getSquareBalloonOption: function (column, row) {
        var option = this.clone();
        option.columns[column][row] = false;
        option.columns[column][row + 1] = false;
        option.columns[column + 1][row] = false;
        option.columns[column + 1][row + 1] = false;
        return option;
    }

}); //end of PoppingBalloons class


var NonInteractivePoppingBalloonsView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        //get some dimensions based on the canvas size
        var maxDiameter = boxSide;
        var padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var cx = 5 + Math.floor((colIndex + .5) * boxSide);
                var cy = 5 + Math.floor((rowIndex + .5) * boxSide);
                if (this.position.columns[colIndex][rowIndex]) {
                    //there is a balloon here
                    var circle = document.createElementNS(svgNS, "circle"); //the balloon
                    circle.setAttributeNS(null, "cx", cx);
                    circle.setAttributeNS(null, "cy", cy);
                    circle.setAttributeNS(null, "r", nodeRadius);
                    circle.style.stroke = "black";
                    circle.style.strokeWidth = 1;
                    circle.style.fill = "red";
                    if (listener != undefined) {
                        var player = listener;
                        circle.popType = "single";
                        circle.column = colIndex;
                        circle.row = rowIndex;
                        circle.onclick = function (event) { player.handleClick(event); }
                        this.position.getSingleBalloonOption(colIndex, rowIndex);
                    }
                    boardSvg.appendChild(circle);
                }
            }
        }
    }

}); //end of NonInteractivePoppingBalloonsView class.

/**
 * Non-interactive View Factory for PoppingBalloons
 */
var NonInteractivePoppingBalloonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getNonInteractiveBoard: function (position) {
        return new NonInteractivePoppingBalloonsView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getNonInteractiveBoard(position);
    }

}); //end of InteractivePoppingBalloonsViewFactory




var InteractivePoppingBalloonsView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / (height);
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);
        console.log(canvasWidth + "  " + canvasHeight + "  " + width + "  " + height + "  " + pixelsPerBoxWide + "  " + pixelsPerBoxHigh);

        //get some dimensions based on the canvas size
        var maxDiameter = boxSide;
        var boardWidth = canvasWidth;
        //var boardPixelSize = Math.min(window.innerHeight, boardWidth);

        //get some dimensions based on the canvas size
        var maxCircleWidth = pixelsPerBoxWide;
        var maxCircleHeight = pixelsPerBoxHigh;
        var maxDiameter = Math.min(maxCircleWidth, maxCircleHeight);
        var padPercentage = .2;
        var nodeRadius = Math.floor(.5 * maxDiameter * (1 - padPercentage));
        var nodePadding = Math.floor(maxDiameter * padPercentage);

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var cx = 5 + Math.floor((colIndex + .5) * boxSide);
                var cy = 5 + Math.floor((rowIndex + .5) * boxSide);
                if (this.position.columns[colIndex][rowIndex]) {
                    //there is a balloon here
                    var circle = document.createElementNS(svgNS, "circle"); //the balloon
                    circle.setAttributeNS(null, "cx", cx);
                    circle.setAttributeNS(null, "cy", cy);
                    circle.setAttributeNS(null, "r", nodeRadius);
                    circle.style.stroke = "black";
                    circle.style.strokeWidth = 1;
                    circle.style.fill = "red";
                    if (listener != undefined) {
                        var player = listener;
                        circle.popType = "single";
                        circle.column = colIndex;
                        circle.row = rowIndex;
                        circle.onclick = function (event) { player.handleClick(event); }
                        this.position.getSingleBalloonOption(colIndex, rowIndex);
                    }
                    boardSvg.appendChild(circle);

                    //code to add the number to the balloon
                    //adapted from fiveelements' answer at https://stackoverflow.com/questions/57515197/how-to-add-text-inside-a-circle-svg-using-javascript
                    const balloonIndex = rowIndex * width + colIndex;
                    const number = document.createElementNS(svgNS, 'text');
                    number.setAttributeNS(null, 'x', cx);
                    number.setAttributeNS(null, 'y', cy);
                    number.setAttributeNS(null, 'text-anchor', 'middle');
                    number.setAttributeNS(null, 'dominant-baseline', 'central');
                    number.setAttributeNS(null, 'stroke', 'black');
                    number.setAttributeNS(null, 'fill', 'black');
                    number.setAttributeNS(null, 'stroke-width', '1px');
                    number.textContent = '' + balloonIndex;
                    if (listener != undefined) {
                        var player = listener;
                        number.popType = "single";
                        number.column = colIndex;
                        number.row = rowIndex;
                        number.onclick = function (event) { player.handleClick(event); }
                        this.position.getSingleBalloonOption(colIndex, rowIndex);
                    }
                    boardSvg.appendChild(number);
                    //console.log("added number");

                    //now check for other nearby balloons
                    if (colIndex + 1 < width && this.position.columns[colIndex + 1][rowIndex]) {
                        //there is a balloon to the right (as well)
                        var square = document.createElementNS(svgNS, "rect");
                        var squareWidth = boxSide * padPercentage;
                        var squareX = cx + nodeRadius;
                        var squareY = cy - squareWidth / 2;
                        square.setAttributeNS(null, "x", squareX + "");
                        square.setAttributeNS(null, "y", squareY + "");
                        square.setAttributeNS(null, "width", squareWidth + "");
                        square.setAttributeNS(null, "height", squareWidth + "");
                        square.style.stroke = "black";
                        square.style.strokeWidth = 1;
                        square.style.fill = "blue";
                        if (listener != undefined) {
                            var player = listener;
                            square.popType = "horizontal";
                            square.column = colIndex;
                            square.row = rowIndex;
                            square.onclick = function (even) { player.handleClick(event); }
                        }
                        boardSvg.appendChild(square);
                    }

                    if (rowIndex + 1 < height && this.position.columns[colIndex][rowIndex + 1]) {
                        //there is a balloon below this one (as well)
                        var square = document.createElementNS(svgNS, "rect");
                        var squareWidth = boxSide * padPercentage;
                        var squareX = cx - squareWidth / 2;
                        var squareY = cy + nodeRadius;
                        square.setAttributeNS(null, "x", squareX + "");
                        square.setAttributeNS(null, "y", squareY + "");
                        square.setAttributeNS(null, "width", squareWidth + "");
                        square.setAttributeNS(null, "height", squareWidth + "");
                        square.style.stroke = "black";
                        square.style.strokeWidth = 1;
                        square.style.fill = "blue";
                        if (listener != undefined) {
                            var player = listener;
                            square.popType = "vertical";
                            square.column = colIndex;
                            square.row = rowIndex;
                            square.onclick = function (even) { player.handleClick(event); }
                        }
                        boardSvg.appendChild(square);

                    }

                }
                //check to see if there should be a quad balloon popper
                if (colIndex + 1 < width && rowIndex + 1 < height &&
                    ((this.position.columns[colIndex + 1][rowIndex + 1] &&
                        this.position.columns[colIndex][rowIndex]) ||
                        (this.position.columns[colIndex + 1][rowIndex] &&
                            this.position.columns[colIndex][rowIndex + 1]))) {
                    //there are diagonal balloons, so we should be able to pop the quad

                    var square = document.createElementNS(svgNS, "rect");
                    var squareWidth = 2.2 * boxSide * padPercentage;
                    var squareX = cx + .707 * nodeRadius;
                    var squareY = cy + .707 * nodeRadius;
                    square.setAttributeNS(null, "x", squareX + "");
                    square.setAttributeNS(null, "y", squareY + "");
                    square.setAttributeNS(null, "width", squareWidth + "");
                    square.setAttributeNS(null, "height", squareWidth + "");
                    square.style.stroke = "black";
                    square.style.strokeWidth = 1;
                    square.style.fill = "yellow";
                    if (listener != undefined) {
                        var player = listener;
                        square.popType = "square";
                        square.column = colIndex;
                        square.row = rowIndex;
                        square.onclick = function (even) { player.handleClick(event); }
                    }
                    boardSvg.appendChild(square);
                }
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var column = event.target.column;
        var row = event.target.row;
        var chosenOption; //
        var self = this;
        if (event.target.popType == "single") {
            chosenOption = self.position.getSingleBalloonOption(column, row);
        } else if (event.target.popType == "horizontal") {
            chosenOption = self.position.getHorizontalBalloonOption(column, row);
        } else if (event.target.popType == "vertical") {
            chosenOption = self.position.getVerticalBalloonOption(column, row);
        } else if (event.target.popType == "square") {
            chosenOption = self.position.getSquareBalloonOption(column, row);
        } else {
            console.log("Didn't recognize the popType: " + event.target.popType);
        }

        player.sendMoveToRef(chosenOption);
    }

}); //end of InteractivePoppingBalloonsView class

/**
 * View Factory for PoppingBalloons
 */
var InteractivePoppingBalloonsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractivePoppingBalloonsView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractivePoppingBalloonsViewFactory

/**
 * Launches a new PoppingBalloons game.
 */
function newPoppingBalloonsGame() {
    var viewFactory = new InteractivePoppingBalloonsViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new PoppingBalloons(height, width);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};

///////////////////////// End of Popping Balloons





/////////////////////////////// Quantum Nim /////////////////////////////////////////

/**
 * Quantum Nim position.
 * 
 * Piles are stored in a 2D array of ints.  Each element is a realization.
 */
var QuantumNim = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     */
    initialize: function (numRealizations, numPiles, maxPileSize) {
        this.playerNames = ["Left", "Right"];
        this.realizations = new Array();
        for (var i = 0; i < numRealizations; i++) {
            var realization = new Array();
            for (var j = 0; j < numPiles; j++) {
                var pile = Math.floor(Math.random() * (maxPileSize + 1));
                realization.push(pile);
            }
            this.realizations.push(realization);
        }
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        if (this.getHeight() == 0) {
            return 0;
        } else {
            return this.realizations[0].length;
        }
    }

    /**
     * Returns the number of realizations.
     */
    , getNumRealizations: function () {
        return this.getHeight();
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        return this.realizations.length;
    }

    /**
     * Returns the number of piles.
     */
    , getNumPiles: function () {
        return this.getWidth();
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var realization = 0; realization < this.realizations.length; realization++) {
            for (var pile = 0; pile < this.realizations[realization].length; pile++) {
                if (this.realizations[realization][pile] != other.realizations[realization][pile]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var other = new QuantumNim(height, width, 5);
        for (var realization = 0; realization < height; realization++) {
            for (var pile = 0; pile < width; pile++) {
                other.realizations[realization][pile] = this.realizations[realization][pile];
            }
        }
        return other;
    }

    /**
     * Returns whether a realization is collapsed out.
     */
    , isRealizationCollapsed: function (realizationIndex) {
        //console.log("realizationIndex: " + realizationIndex);
        for (var pileIndex = 0; pileIndex < this.getNumPiles(); pileIndex++) {
            if (this.realizations[realizationIndex][pileIndex] < 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether a player can play on one of the columns.
     */
    , canPlayPile: function (pileIndex) {
        //var column = this.columns[columnIndex];
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (this.realizations[rIndex][pileIndex] > 0 && !this.isRealizationCollapsed(rIndex)) {
                //there are positive sticks in this pile in a non-collapsed realization
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether a player can play on one of the columns.
     */
    , maxTakeableFromPile: function (pileIndex) {
        //var column = this.columns[columnIndex];
        var maxPileSize = 0;
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (!this.isRealizationCollapsed(rIndex)) {
                maxPileSize = Math.max(maxPileSize, this.realizations[rIndex][pileIndex]);
            }
        }
        return maxPileSize;
    }

    /**
     * Returns the position after a player removes numSticks from pile # pileIndex.
     */
    , playAtPile: function (pileIndex, numSticks) {
        if (this.maxTakeableFromPile(pileIndex) < numSticks) {
            return null;  //TODO: throw an error?
        }
        var option = this.clone();
        for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
            if (!this.isRealizationCollapsed(rIndex)) {
                var realization = option.realizations[rIndex];
                realization[pileIndex] -= numSticks;
            }
        }
        return option;
    }

    /**
     * Returns the position resulting from a player making a quantum move: numSticksA from pileIndexA and numSticksB from pileIndexB.
     */
    , playAtTwoPiles: function (pileIndexA, numSticksA, pileIndexB, numSticksB) {
        if (pileIndexA == pileIndexB && numSticksA == numSticksB) {
            return this.playAtPile(pileIndexA, numSticksA);
        } else if (pileIndexA > pileIndexB || (pileIndexA == pileIndexB && numSticksA > numSticksB)) {
            //reordering the moves for consistency
            return this.playAtTwoPiles(pileIndexB, numSticksB, pileIndexA, numSticksA);
        } else {
            var option = this.clone();
            var oldRealizations = option.realizations;
            var newRealizations = new Array();
            for (var rIndex = 0; rIndex < this.getNumRealizations(); rIndex++) {
                var realization = oldRealizations[rIndex];
                if (!this.isRealizationCollapsed(rIndex)) {
                    var newRealizationA = new Array();
                    var newRealizationB = new Array();
                    for (var pileIndex = 0; pileIndex < this.getWidth(); pileIndex++) {
                        newRealizationA.push(realization[pileIndex]);
                        newRealizationB.push(realization[pileIndex]);
                        if (pileIndex == pileIndexA) {
                            newRealizationA[pileIndex] -= numSticksA;
                        }
                        if (pileIndex == pileIndexB) {
                            newRealizationB[pileIndex] -= numSticksB;
                        }
                    }
                    newRealizations.push(newRealizationA);
                    newRealizations.push(newRealizationB);
                } else {
                    newRealizations.push(realization);
                }
            }
            option.realizations = newRealizations;
            return option;

            /*
            //get the two individual options
            var optionA = this.playAtPile(pileIndexA, numSticksA);
            var optionB = this.playAtPile(pileIndexB, numSticksB);
            //combine the realizations, by adding optionB's realizations to optionA
            for (var rIndex = 0; rIndex < optionB.getNumRealizations(); rIndex++) {
                var realization = optionB.realizations[rIndex];
                optionA.realizations.push(realization);
            }
            return optionA;*/
        }
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        //first get the options from classical moves
        var options = new Array();
        for (var pileIndex = 0; pileIndex < this.getNumPiles(); pileIndex++) {
            var maxSticks = this.maxTakeableFromPile(pileIndex);
            for (var numSticks = 1; numSticks <= maxSticks; numSticks++) {
                options.push(this.playAtPile(pileIndex, numSticks));
            }
        }

        //next get the options from quantum moves
        for (var pileIndexA = 0; pileIndexA < this.getNumPiles(); pileIndexA++) {
            for (var pileIndexB = pileIndexA; pileIndexB < this.getNumPiles(); pileIndexB++) {
                var maxSticksA = this.maxTakeableFromPile(pileIndexA);
                var maxSticksB = this.maxTakeableFromPile(pileIndexB);
                for (var numSticksA = 1; numSticksA <= maxSticksA; numSticksA++) {
                    var numSticksB = 1;
                    if (pileIndexA == pileIndexB) {
                        numSticksB = numSticksA + 1;
                    }
                    for (; numSticksB <= maxSticksB; numSticksB++) {
                        options.push(this.playAtTwoPiles(pileIndexA, numSticksA, pileIndexB, numSticksB));
                    }
                }
            }
        }

        return options;
    }

}); //end of QuantumNim class




var InteractiveQuantumNimView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
        this.movesChosen = 0;
        this.firstPileIndex = -1;
        this.firstNumSticks = -1;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const boardUnitHeight = Math.min(height + 2, 1.5 * width); //this is because it can get really tall, but we don't want to compress it too much vertically.  (The +2 is for the triangles up top.)
        const pixelsPerBoxHigh = (canvasHeight - 10) / boardUnitHeight; //+1 for the triangles
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        var maxDiameter = boxSide; //Math.min(maxCircleWidth, maxCircleHeight);

        /*
                //get some dimensions based on the canvas size
                var maxBoxWidth = (boardPixelSize - 10) / width;
                //the boxes get too small as the board increases in height, so we're not doing this here.
                var maxBoxHeight = (boardPixelSize - 10) / (height + 2);
                //var maxBoxSide = Math.min(maxBoxWidth, maxBoxHeight);
                var maxBoxSide = Math.min(maxBoxWidth, maxBoxHeight, 200);
                */
        var maxBoxSide = boxSide;
        var boardHeight = maxBoxSide * (height + 2) + 10;

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the triangle at the top of the column
            if (this.position.canPlayPile(colIndex)) {
                //draw the triangle above the column.  This is where the player will press to select the column.
                //from Robert Longson's answer here: https://stackoverflow.com/questions/45773273/draw-svg-polygon-from-array-of-points-in-javascript
                var triangle = document.createElementNS(svgNS, "polygon");
                triangle.style.stroke = "black";
                var topLeftPoint = boardSvg.createSVGPoint();
                topLeftPoint.x = colIndex * maxBoxSide + 15;
                topLeftPoint.y = 10;
                triangle.points.appendItem(topLeftPoint);
                var topRightPoint = boardSvg.createSVGPoint();
                topRightPoint.x = (colIndex + 1) * maxBoxSide + 5;
                topRightPoint.y = 10;
                triangle.points.appendItem(topRightPoint);
                var bottomPoint = boardSvg.createSVGPoint();
                bottomPoint.x = (colIndex + .5) * maxBoxSide + 10;
                bottomPoint.y = 5 + maxBoxSide;
                triangle.points.appendItem(bottomPoint);
                triangle.style.fill = "black";
                boardSvg.appendChild(triangle);
                //set the listener for the triangle
                if (listener != undefined) {
                    triangle.column = colIndex;
                    var player = listener;
                    triangle.onclick = function (event) { player.handleClick(event); }
                }
                //console.log("drawing triangle: " + triangle);
            }
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var box = document.createElementNS(svgNS, "rect");
                var boxX = (10 + colIndex * maxBoxSide);
                var boxY = (10 + (rowIndex + 1) * maxBoxSide);
                box.setAttributeNS(null, "x", boxX + "");
                box.setAttributeNS(null, "y", boxY + "");
                box.setAttributeNS(null, "width", maxBoxSide + "");
                box.setAttributeNS(null, "height", maxBoxSide + "");
                //box.setAttributeNS(null, "class", parityString + "Checker");
                box.style.stroke = "black";
                box.style.fill = "white";
                boardSvg.appendChild(box);

                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                var textX = boxX + 2 * maxBoxSide / 6;
                var textY = boxY + 2 * maxBoxSide / 3;
                text.style.fontSize = maxBoxSide / 2 + "px";
                text.setAttributeNS(null, "x", textX + "");
                text.setAttributeNS(null, "y", textY + "");
                text.innerHTML = "" + this.position.realizations[rowIndex][colIndex];
                if (this.position.isRealizationCollapsed(rowIndex)) {
                    text.style.fill = "red";
                } else {
                    text.style.fill = "black";
                }
                boardSvg.appendChild(text);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var pileIndex = event.target.column;
        var maxSticks = this.position.maxTakeableFromPile(pileIndex);
        this.destroyPopup();
        //console.log("Clicked triangle!");
        var self = this;
        //create the popup
        this.popup = document.createElement("div");
        for (var i = 1; i <= maxSticks; i++) {
            var button = document.createElement("button");
            button.appendChild(toNode("" + i));
            button.number = i;
            var extraNum = i;
            button.onclick = function (event) {
                var source = event.currentTarget; //event.target doesn't work!
                self.destroyPopup();
                if (self.movesChosen == 1) {
                    //we've already chosen one move; this is the second part
                    var option = self.position.playAtTwoPiles(self.firstPileIndex, self.firstNumSticks, pileIndex, source.number);
                    self.movesChosen = 0;
                    player.sendMoveToRef(option);
                } else {
                    //prompt to ask whether we're making a second move
                    self.popup = document.createElement("div");
                    var doneButton = document.createElement("button");
                    doneButton.appendChild(toNode("Just that move."));
                    doneButton.onclick = function () {
                        var option = self.position.playAtPile(pileIndex, source.number);
                        self.destroyPopup();
                        player.sendMoveToRef(option);
                    };
                    self.popup.appendChild(doneButton);
                    var quantumButton = document.createElement("button");
                    quantumButton.appendChild(toNode("Add a second move."));
                    quantumButton.onclick = function () {
                        console.log("Choose another pile!");
                        self.movesChosen = 1;
                        self.firstPileIndex = pileIndex;
                        self.firstNumSticks = source.number;
                        self.destroyPopup();
                    };
                    self.popup.appendChild(quantumButton);

                    self.popup.style.position = "fixed";
                    self.popup.style.display = "block";
                    self.popup.style.opacity = 1;
                    self.popup.width = Math.min(window.innerWidth / 2, 100);
                    self.popup.height = Math.min(window.innerHeight / 2, 50);
                    self.popup.style.left = event.clientX + "px";
                    self.popup.style.top = event.clientY + "px";
                    document.body.appendChild(self.popup);
                }


            };
            this.popup.appendChild(button);
        }

        this.popup.style.position = "fixed";
        this.popup.style.display = "block";
        this.popup.style.opacity = 1;
        this.popup.width = Math.min(window.innerWidth / 2, 100);
        this.popup.height = Math.min(window.innerHeight / 2, 50);
        this.popup.style.left = event.clientX + "px";
        this.popup.style.top = event.clientY + "px";
        document.body.appendChild(this.popup);
        return null;


    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }


});  //end of InteractiveQuantumNimView

/**
 * View Factory for Quantum Nim
 */
var InteractiveQuantumNimViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveQuantumNimView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveQuantumNimViewFactory

/**
 * Launches a new Quantum Nim game.
 * TODO: add an option to choose the initial density of purple cells
 */
function newQuantumNimGame() {
    var viewFactory = new InteractiveQuantumNimViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new QuantumNim(height, width, 4);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};




var ReverseClobber = Class.create(Clobber, {

    /**
     * Gets the options for a player.
     */
    getOptionsForPlayer: function (playerId) {
        var otherPlayerId = 1 - playerId;
        var options = new Array();
        var currentPlayerPieces = this.draughts[playerId];
        var otherPlayerPieces = this.draughts[otherPlayerId];
        for (var i = 0; i < currentPlayerPieces.length; i++) {
            var currentPiece = currentPlayerPieces[i];
            for (var j = 0; j < otherPlayerPieces.length; j++) {
                var otherPiece = otherPlayerPieces[j];
                if (this.areAdjacent(currentPiece, otherPiece)) {
                    //generate a new game!
                    var nextPieces = [new Array(), new Array()];
                    for (var k = 0; k < i; k++) {
                        nextPieces[playerId].push(currentPlayerPieces[k]);
                    }
                    for (var k = i + 1; k < currentPlayerPieces.length; k++) {
                        nextPieces[playerId].push(currentPlayerPieces[k]);
                    }
                    var nextOtherPlayerPieces = new Array();
                    for (var k = 0; k < otherPlayerPieces.length; k++) {
                        nextPieces[otherPlayerId].push(otherPlayerPieces[k]);
                    }
                    var option = new ReverseClobber(this.width, this.height, nextPieces)
                    options.push(option); //TODO: switch to 3-argument contstructor
                    break; //stop checking for neighbors to the current player's piece
                }

            }
        }
        return options;
    }

    /**
     * Gets an option moving from rowA, columnA to rowB, columnB by playerId.
     */
    , getOptionAt: function (playerId, rowA, columnA, rowB, columnB) {
        const rowDist = Math.abs(rowA - rowB);
        const columnDist = Math.abs(columnA - columnB);
        if (rowDist + columnDist != 1) {
            //pieces aren't next to each other.
            return null;
        }
        const playerPieceIndex = omniIndexOf(this.draughts[playerId], [columnA, rowA]);
        const opponentPieceIndex = omniIndexOf(this.draughts[1 - playerId], [columnB, rowB]);
        if (playerPieceIndex == -1 || opponentPieceIndex == -1) {
            //one of the pieces doesn't exist!
            return null;
        }
        const option = this.clone();
        option.draughts[playerId].splice(playerPieceIndex, 1);
        return option;
    }

    /**
     * Clones this.
     */
    , clone: function () {
        return new ReverseClobber(this.width, this.height, omniClone(this.draughts));
    }

    ,/**
     * toString
     */
    toString: function () {
        var string = "Reverse Clobber Position\n";
        for (var i = 0; i < this.draughts.length; i++) {
            string += this.getPlayerName(i) + " positions:\n";
            for (var j = 0; j < this.draughts[i].length; j++) {
                var piece = this.draughts[i][j];
                string += "    [" + piece[0] + ", " + piece[1] + "]\n";
            }
        }
        return string;
    }

}); //end of ReverseClobber





var InteractiveSVGReverseClobberView = Class.create(InteractiveSVGClobberView, {

    /**
     * Handles a mouse click.
     */
    /*
    getNextPositionFromClick: function(event, currentPlayer, containerElement) {
        var clickedPiece = event.target;
        if (this.selectedPiece == undefined) {
            //select the clicked piece, if appropriate
            if (currentPlayer == clickedPiece.player) {
                this.selectPiece(clickedPiece);
            }
            return null; //no new move from this
        } else {
            if (currentPlayer == clickedPiece.player) {
                this.deselectPiece();
                return null;
            } else {
                //measure the distance between centers
                //console.log(clickedPiece.cx.baseVal.value + ", " + this.selectedPiece.cx.baseVal.value);
                var xDistance = Math.abs(clickedPiece.cx.baseVal.value - this.selectedPiece.cx.baseVal.value);
                var yDistance = Math.abs(clickedPiece.cy.baseVal.value - this.selectedPiece.cy.baseVal.value);
                var pieceDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
                if (pieceDistance < 105) {
                    var nextPieces = [[], []]; //nextPieces: 0th list will be blue, 1th red
                    var boardSvg = containerElement.lastChild;
                    var boardElements = boardSvg.childNodes;
                    for (var i = 0; i < boardElements.length; i++) {
                        if (boardElements[i] == this.selectedPiece) {
                            //add nothing!
                        } else if (boardElements[i].player != undefined) {
                            var piece = boardElements[i];
                            nextPieces[piece.player].push([(piece.cx.baseVal.value - 50)/100, (piece.cy.baseVal.value - 50) / 100]);
                        }
                    }
                    this.deselectPiece();
                    return new ReverseClobber(this.position.width, this.position.height, nextPieces);

                } else {
                    this.deselectPiece();
                    return null;
                }
            }
        }
    }*/
}); //end of InteractiveSVGReverseClobberView





/////////////////////////////// Toppling Dominoes /////////////////////////////////////


/**
 * Toppling Dominoes game
 * 
 * Grid is stored as a 2D array of single rows.  Each row is an array of integers where each represents the color of one domino.  In order to keep things looking neat, we leave in the space where fallen dominoes were; thus we also include empty dominoes in the arrays, which are unplayable. 
 * @author Kyle Burke.  
 */
const TopplingDominoes = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     * 
     */
    initialize: function (numRows, minDominoesInRow, maxDominoesInRow) {
        this.playerNames = ["Blue", "Red"];
        this.rows = [];
        //default probability
        const colors = [CombinatorialGame.prototype.LEFT, CombinatorialGame.prototype.RIGHT];
        var numBlueEnds = 0;
        var numRedEnds = 0;
        for (var i = 0; i < numRows; i++) {
            const row = [];
            const dominoDifference = maxDominoesInRow - minDominoesInRow;
            const numDominoes = Math.floor(Math.random() * dominoDifference) + minDominoesInRow;
            for (var j = 0; j < numDominoes; j++) {
                row.push(randomChoice(colors));
            }
            this.rows.push(row);
            if (row[0] == CombinatorialGame.prototype.LEFT) {
                numBlueEnds++;
                if (numBlueEnds > numRows) {
                    //we have too many blue dominoes on the ends and need to make this one red instead
                    row[0] = CombinatorialGame.prototype.RIGHT;
                    numRedEnds++;
                    numBlueEnds--;
                }
            } else {
                numRedEnds++;
                if (numRedEnds > numRows) {
                    //we have too many red dominoes on the ends and need to make this one blue instead
                    row[0] = CombinatorialGame.prototype.LEFT;
                    numRedEnds--;
                    numBlueEnds++;
                }
            }
            if (row[row.length - 1] == CombinatorialGame.prototype.LEFT) {
                numBlueEnds++;
                if (numBlueEnds > numRows) {
                    //we have too many blue dominoes on the ends and need to make this one red instead
                    row[row.length - 1] = CombinatorialGame.prototype.RIGHT;
                    numRedEnds++;
                    numBlueEnds--;
                }
            } else {
                numRedEnds++;
                if (numRedEnds > numRows) {
                    //we have too many red dominoes on the ends and need to make this one blue instead
                    row[row.length - 1] = CombinatorialGame.prototype.LEFT;
                    numRedEnds--;
                    numBlueEnds++;
                }
            }
        }
    }

    /**
     * Returns the width of this board.
     */
    , getMaxNumDominoes: function () {
        var maxLength = 0;
        for (const row of this.rows) {
            if (row.length > maxLength) {
                maxLength = row.length;
            }
        }
        return maxLength;
    }

    /**
     * Returns the height of this board.
     */
    , getNumRows: function () {
        return this.rows.length;
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        return omniEquals(this.rows, other.rows);
    }

    /**
     * Clone.
     */
    , clone: function () {
        const copy = new TopplingDominoes(1, 1, 1);
        copy.rows = omniClone(this.rows);
        return copy;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        const options = [];
        for (var i = 0; i < this.rows.length; i++) {
            const row = this.rows[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] == playerId) {
                    options.push(this.getLeftPushOption(i, j));
                    options.push(this.getRightPushOption(i, j));
                }
            }
        }
        return options;
    }

    /**
     * Gets an option by knocking a domino to the left.
     */
    , getLeftPushOption: function (rowIndex, dominoIndex) {
        const option = this.clone();
        //option.rows[rowIndex].splice(0, dominoIndex+1);
        for (var i = 0; i <= dominoIndex; i++) {
            option.rows[rowIndex][i] = TopplingDominoes.prototype.NO_DOMINO;
        }
        return option;
    }

    /**
     * Gets an option by knocking a domino to the right.
     */
    , getRightPushOption: function (rowIndex, dominoIndex) {
        const option = this.clone();
        //option.rows[rowIndex].splice(dominoIndex, option.rows[rowIndex].length - dominoIndex);
        for (var i = dominoIndex; i < option.rows[rowIndex].length; i++) {
            option.rows[rowIndex][i] = TopplingDominoes.prototype.NO_DOMINO;
        }
        return option;
    }

}); // end of TopplingDominoes

//nicely sets the dimensions of the the svg based on the container and available vertical space
function nicelySizeSVG(svg, container) {
    const svgY = svg.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const correctHeight = Math.min(containerHeight, window.innerHeight - svgY);
    //console.log("setting to: " + containerWidth + " x " + correctHeight);
    svg.setAttributeNS(null, "width", containerWidth);
    svg.setAttributeNS(null, "height", correctHeight);
}



var InteractiveTopplingDominoesView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        const svgNS = "http://www.w3.org/2000/svg";
        const boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const screenWidth = canvasWidth;
        const screenHeight = canvasHeight;
        const numRows = this.position.getNumRows();
        const maxNumDominoes = this.position.getMaxNumDominoes();

        var dominoWidth = screenWidth / (2 * maxNumDominoes + 4); //add space on either end for two dominoes
        var dominoHeight = screenHeight / (1.5 * numRows + 1); //add space for a half row on top and bottom.

        const DOMINO_RATIO_HEIGHT_TO_WIDTH = 5;

        if (dominoWidth * DOMINO_RATIO_HEIGHT_TO_WIDTH > dominoHeight) {
            //dominoes would be too wide 
            dominoWidth = dominoHeight / DOMINO_RATIO_HEIGHT_TO_WIDTH;
        } else {
            //dominoes might be too tall
            dominoHeight = dominoWidth * DOMINO_RATIO_HEIGHT_TO_WIDTH;
        }

        for (var rowI = 0; rowI < numRows; rowI++) {
            const row = this.position.rows[rowI];
            const rowLen = row.length;
            //draw the dominoes
            for (var domI = 0; domI < rowLen; domI++) {
                if (this.position.rows[rowI][domI] != TopplingDominoes.prototype.NO_DOMINO) {
                    const domino = document.createElementNS(svgNS, "rect");
                    domino.setAttributeNS(null, "x", (screenWidth / 2 + (2 * dominoWidth * (domI - rowLen / 2))).toString());
                    domino.setAttributeNS(null, "y", (dominoHeight * (1.5 * rowI + .3)).toString());
                    domino.setAttributeNS(null, "width", dominoWidth.toString());
                    domino.setAttributeNS(null, "height", dominoHeight.toString());
                    domino.style.stroke = "black";
                    if (row[domI] == CombinatorialGame.prototype.RIGHT) {
                        domino.style.fill = "red";
                        if (listener != undefined) {
                            var player = listener;
                            domino.row = rowI;
                            domino.index = domI;
                            domino.player = row[domI];
                            domino.onclick = function (event) { player.handleClick(event); }
                        }
                    } else {
                        domino.style.fill = "blue";
                        if (listener != undefined) {
                            var player = listener;
                            domino.row = rowI;
                            domino.index = domI;
                            domino.player = row[domI];
                            domino.onclick = function (event) { player.handleClick(event); }
                        }
                    }
                    boardSvg.appendChild(domino);
                }
            }

            //draw the board this row is on
            const platform = document.createElementNS(svgNS, "rect");
            platform.setAttributeNS(null, "x", (screenWidth / 2 + (dominoWidth * (-1 * (rowLen + 2)))).toString());
            platform.setAttributeNS(null, "y", (dominoHeight * (1.5 * rowI + 1.3)).toString());
            platform.setAttributeNS(null, "width", (2 * dominoWidth * (rowLen + 2)).toString());
            platform.setAttributeNS(null, "height", (.1 * dominoHeight).toString());
            platform.style.stroke = "black";
            platform.style.fill = "brown";
            boardSvg.appendChild(platform);
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        const domino = event.target;
        const rowIndex = domino.row;
        const dominoIndex = domino.index;
        this.destroyPopup();
        var self = this;
        //create the popup
        if (domino.player == currentPlayer) {
            this.popup = document.createElement("div");
            const leftButton = document.createElement("button");
            leftButton.appendChild(toNode("<-- Push"));
            leftButton.onclick = function () {
                self.destroyPopup();
                const chosenOption = self.position.getLeftPushOption(rowIndex, dominoIndex);
                player.sendMoveToRef(chosenOption);
            };
            this.popup.appendChild(leftButton);

            const rightButton = document.createElement("button");
            rightButton.appendChild(toNode("Push -->"));
            rightButton.onclick = function () {
                self.destroyPopup();
                const chosenOption = self.position.getRightPushOption(rowIndex, dominoIndex);
                player.sendMoveToRef(chosenOption);
            };
            this.popup.appendChild(rightButton);

            this.popup.style.position = "fixed";
            this.popup.style.display = "block";
            this.popup.style.opacity = 1;
            this.popup.width = Math.min(window.innerWidth / 2, 100);
            this.popup.height = Math.min(window.innerHeight / 2, 50);
            this.popup.style.left = event.clientX + "px";
            this.popup.style.top = event.clientY + "px";
            document.body.appendChild(this.popup);
        }
        return null;
    }

    /**
     * Destroys the popup color window.
     */
    , destroyPopup: function () {
        if (this.popup != null) {
            this.popup.parentNode.removeChild(this.popup);
            this.selectedElement = undefined;
            this.popup = null;
        }
    }

}); //end of InteractiveTopplingDominoesView class

/**
 * View Factory for TopplingDominoes
 */
var InteractiveTopplingDominoesViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveTopplingDominoesView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveTopplingDominoesViewFactory

/**
 * Launches a new TopplingDominoes game.
 */
function newTopplingDominoesGame() {
    var viewFactory = new InteractiveTopplingDominoesViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new TopplingDominoes(height, Math.max(2, Math.floor(width / 2)), width);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};
TopplingDominoes.prototype.PLAYER_NAMES = ["Blue", "Red"];
TopplingDominoes.prototype.NO_DOMINO = Math.min(CombinatorialGame.prototype.LEFT, CombinatorialGame.prototype.RIGHT) - 1;






/////////////////////////////// Toads and Frogs /////////////////////////////////////
//// author: Christopher Villegas.  All code for this section coded by him.

function getToadsandFrogsRadioPlayerOptions(playerId, namesAndPlayerOptions, defaultId) {
    namesAndPlayerOptions = namesAndPlayerOptions || ["Human", "Random", "Very Easy AI", "Easy AI", "Medium AI", "Tricky AI (slow)", "Hard AI (very slow)"];
    var playerName;
    var defaultIndex = defaultId;
    if (playerId == CombinatorialGame.prototype.LEFT) {
        playerName = "left";
        if (defaultId == undefined) {
            defaultIndex = 0;
        }
    } else if (playerId == CombinatorialGame.prototype.RIGHT) {
        playerName = "right";
        if (defaultId == undefined) {
            defaultIndex = 2;
        }
    } else {
        console.log("getRadioPlayerOptions got an incorrect playerId");
    }
    var playerNames;
    var players = [];
    //let's fix the playerOptions if they're broken
    if (typeof namesAndPlayerOptions[0] == 'string') {
        playerNames = namesAndPlayerOptions;
        for (var i = 0; i < playerNames.length; i++) {
            const name = playerNames[i];
            if (name == "Human") {
                players.push("new HumanPlayer(viewFactory)");
            } else if (name == "Random") {
                players.push("new RandomPlayer(1000)");
            } else if (name == "Very Easy AI") {
                players.push("new MinimaxPlayer(1000, 1)");
            } else if (name == "Easy AI") {
                players.push("new MinimaxPlayer(1000, 2)");
            } else if (name == "Medium AI") {
                players.push("new DepthSearchPlayer(playDelay, 4)");
            } else if (name.startsWith("Tricky AI")) {
                players.push("new DepthSearchPlayer(playDelay, 5)");
            } else if (name.startsWith("Hard AI")) {
                players.push("new DepthSearchPlayer(playDelay, 6)");
            } else {
                console.log("Didn't see an appropriate player name!!!");
                players.push("monkey");
            }
        }
    } else {
        //it's a list
        playerNames = [];
        //console.log("Splitting the player list.");
        for (var i = 0; i < namesAndPlayerOptions.length; i++) {
            playerNames.push(namesAndPlayerOptions[i][0]);
            players.push(namesAndPlayerOptions[i][1]);
        }
        //console.log(players);
    }
    return createRadioGroup(playerName + "Player", playerNames, defaultIndex, players); // "Professional (hangs your browser)"
}

var MinimaxPlayer = Class.create(ComputerPlayer, {
    initialize: function (delay, difficulty) {
        this.delayMilliseconds = delay;
        this.difficulty = difficulty;
    },

    givePosition: function (playerIndex, position, referee) {
        //console.log(playerIndex);

        option = this.minimax(position, this.difficulty, true, playerIndex);

        // Use setTimeout to simulate the delay before giving the move
        window.setTimeout(function () {
            referee.moveTo(option.move);
        }, this.delayMilliseconds);
    },

    minimax: function (position, depth, isMaximizingPlayer, playerId) {
        // Base case: depth is 0
        if (depth === 0) {
            return {
                score: this.evaluateBoard(position, playerId),
                move: null,
            };
        }

        let bestMove = null;

        if (isMaximizingPlayer) {
            let maxEval = Number.NEGATIVE_INFINITY;
            for (let move of position.getOptionsForPlayer(playerId)) {
                let newPosition = position.clone();
                newPosition.playAt(move, playerId);

                let evaluation = this.minimax(
                    newPosition,
                    depth - 1,
                    false,
                    playerId
                ).score;

                if (evaluation >= maxEval) {
                    //console.log(evaluation)
                    maxEval = evaluation;
                    bestMove = move;
                }
            }
            return { score: maxEval, move: bestMove };
        } else {
            let minEval = Number.POSITIVE_INFINITY;
            let opponentId = Number(!playerId);
            for (let move of position.getOptionsForPlayer(opponentId)) {
                let newPosition = position.clone();
                newPosition.playAt(move, opponentId);

                let evaluation = this.minimax(
                    newPosition,
                    depth - 1,
                    true,
                    playerId
                ).score;

                if (evaluation <= minEval) {
                    //console.log(evaluation)
                    minEval = evaluation;
                    bestMove = move;
                }
            }
            return { score: minEval, move: bestMove };
        }
    },

    evaluateBoard: function (position, playerId) {
        let l = position.getOptionsForPlayer(playerId).length;

        return l;
    },
});



const ToadsAndFrogs = Class.create(CombinatorialGame, {
    // Constructor for initializing the game
    initialize: function (boardSize) {
        var labels = [];
        this.playerNames = ["Left", "Right"];
        this.board = "";
        if (boardSize % 3 != 0) {
            var messageBox = document.getElementById("messageBox");
            messageBox.textContent =
                "Please select a multiple of 3 as your board size";
            return;
        }

        var numTAndF = boardSize / 3;
        for (let i = 0; i < numTAndF; i++) labels.push("T");
        for (let i = 0; i < boardSize - 2 * numTAndF; i++) labels.push("-");
        for (let i = 0; i < numTAndF; i++) labels.push("F");

        this.board = labels.join("");
    },

    getOptionsForPlayer: function (playerId) {
        var options = [];
        var boardCopy;

        if (playerId === 0) {
            // If it's Player 0 (Toads' turn)
            // Case: "T-" (Toad can hop right)
            var a = this.board.indexOf("T-");
            while (a !== -1) {
                boardCopy = this.clone();
                boardCopy.board =
                    this.board.slice(0, a) + "-T" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("T-", a + 1);
            }

            // Case: "TF-" (Toad can hop over Frog and move)
            var b = this.board.indexOf("TF-");
            while (b !== -1) {
                boardCopy = this.clone();
                boardCopy.board =
                    this.board.slice(0, b) + "-FT" + this.board.slice(b + 3);
                options.push(boardCopy);

                // Continue searching from the next index
                b = this.board.indexOf("TF-", b + 1);
            }
        } else {
            // If it's Player 1 (Frogs' turn)
            // Case: "-F" (Frog can hop left)
            var a = this.board.indexOf("-F");
            while (a !== -1) {
                boardCopy = this.clone();
                boardCopy.board =
                    this.board.slice(0, a) + "F-" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("-F", a + 1);
            }

            // Case: "-TF" (Frog can hop over Toad and move)
            var b = this.board.indexOf("-TF");
            while (b !== -1) {
                boardCopy = this.clone();
                boardCopy.board =
                    this.board.slice(0, b) + "FT-" + this.board.slice(b + 3);
                options.push(boardCopy);

                // Continue searching from the next index
                b = this.board.indexOf("-TF", b + 1);
            }
        }

        return options; // Return an array of all possible board states
    },

    equals: function (other) {
        return this.board === other.board;
    },

    clone: function () {
        var other = new ToadsAndFrogs(this.board.length);
        other.board = this.board;
        return other;
    },

    playAt: function (idx, currentPlayer) {
        if (this.board[idx] == "-") {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Toads' turn
            if (currentPlayer == 0) {
                if (this.board.slice(idx - 1, idx + 1) == "T-") {
                    option.board =
                        this.board.slice(0, idx - 1) +
                        "-T" +
                        this.board.slice(idx + 1);
                } else if (this.board.slice(idx - 2, idx + 1) == "TF-") {
                    option.board =
                        this.board.slice(0, idx - 2) +
                        "-FT" +
                        this.board.slice(idx + 1);
                }

                // If currently Frogs' turn
            } else {
                if (this.board.slice(idx, idx + 2) == "-F") {
                    option.board =
                        this.board.slice(0, idx) +
                        "F-" +
                        this.board.slice(idx + 2);
                } else if (this.board.slice(idx, idx + 3) == "-TF") {
                    option.board =
                        this.board.slice(0, idx) +
                        "FT-" +
                        this.board.slice(idx + 3);
                }
            }

            return option;
        } else if (this.board[idx] == ["T", "F"][currentPlayer]) {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Toads' turn
            if (currentPlayer == 0) {
                if (this.board.slice(idx, idx + 2) == "T-") {
                    option.board =
                        this.board.slice(0, idx) +
                        "-T" +
                        this.board.slice(idx + 2);
                } else if (this.board.slice(idx, idx + 3) == "TF-") {
                    option.board =
                        this.board.slice(0, idx) +
                        "-FT" +
                        this.board.slice(idx + 3);
                }

                // If currently Frogs' turn
            } else {
                if (this.board.slice(idx - 1, idx + 1) == "-F") {
                    option.board =
                        this.board.slice(0, idx - 1) +
                        "F-" +
                        this.board.slice(idx + 1);
                } else if (this.board.slice(idx - 2, idx + 1) == "-TF") {
                    option.board =
                        this.board.slice(0, idx - 2) +
                        "FT-" +
                        this.board.slice(idx + 1);
                }
            }

            //console.log(option.board);
            return option;
        } else {
            return this;
        }
    },
});

var InteractiveToadsAndFrogsView = Class.create({
    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    },

    /**
     * Draws the board.
     */
    draw: function (containerElement, listener) {
        var labels = this.position.board.split("");
        const width = labels.length;
        const height = 1;

        containerElement.innerHTML = "";
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / height;
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        // Create a <defs> element if it doesn't already exist
        let defs = boardSvg.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "defs"
            );
            boardSvg.appendChild(defs);
        }

        const rectSize = boxSide; //boardPixelSize / labels.length;

        labels.forEach((label, index) => {
            // Create a <pattern> element
            const pattern = document.createElementNS(svgNS, "pattern");
            const patternId = `imgPattern${index}`;
            pattern.setAttribute("id", patternId);
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            pattern.setAttribute("width", rectSize);
            pattern.setAttribute("height", rectSize);
            pattern.setAttribute("y", 5 + canvasHeight / 2 - rectSize);

            const image = document.createElementNS(svgNS, "image");
            image.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                label === "T"
                    ? "toadsAndFrogsItems/Toad.png"
                    : label === "F"
                        ? "toadsAndFrogsItems/Frog.png"
                        : "toadsAndFrogsItems/Empty.png"
            );
            image.setAttribute("width", rectSize);
            image.setAttribute("height", rectSize);

            pattern.appendChild(image);
            defs.appendChild(pattern);

            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", 5 + index * rectSize);
            rect.setAttribute("y", 5 + canvasHeight / 2 - rectSize);
            rect.setAttribute("width", rectSize);
            rect.setAttribute("height", rectSize);
            rect.setAttribute("fill", `url(#${patternId})`);
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", "3");
            rect.setAttribute("id", `rect-${index}`);
            if (listener != undefined) {
                var player = listener;
                rect.onclick = function (event) {
                    player.handleClick(event);
                };
            }
            boardSvg.appendChild(rect);
        });
    },

    getNextPositionFromClick: function (
        event,
        currentPlayer,
        containerElement,
        player
    ) {
        var idx = event.target.id;
        idx = parseInt(idx[idx.length - 1]);
        var chosenOption = this.position.playAt(idx, currentPlayer);
        player.sendMoveToRef(chosenOption);
    },
}); //end of InteractiveToadsAndFrogsView class

/**
 * View Factory for Toads and Frogs
 */
var InteractiveToadsAndFrogsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () { },

    /**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveToadsAndFrogsView(position);
    },

    /**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    },
}); //end of InteractiveToadsAndFrogsViewFactory

/**
 * Launches a new ToadsAndFrogs game.
 */
function newToadsAndFrogsGame() {
    var viewFactory = new InteractiveToadsAndFrogsViewFactory();
    var playDelay = 1000;
    var controlForm = $("gameOptions");
    var boardSize = parseInt($("boardSize").value);
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements["leftPlayer"]));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements["rightPlayer"]));
    const players = [leftPlayer, rightPlayer];
    var game = new ToadsAndFrogs(boardSize);
    var ref = new Referee(game, players, viewFactory, "toadsAndFrogsBoard", $("messageBox"), controlForm);
}

const ElephantsAndRhinosGame = Class.create(CombinatorialGame, {
    // Constructor for initializing the game
    initialize: function (boardSize) {
        var labels = [];
        this.playerNames = ["Left", "Right"];
        this.board = "";
        if (boardSize % 3 != 0) {
            var messageBox = document.getElementById("messageBox");
            messageBox.textContent =
                "Please select a multiple of 3 as your board size";
            return;
        }

        var numTAndF = boardSize / 3;
        for (let i = 0; i < numTAndF; i++) labels.push("E");
        for (let i = 0; i < boardSize - 2 * numTAndF; i++) labels.push("-");
        for (let i = 0; i < numTAndF; i++) labels.push("R");

        this.board = labels.join("");
    },

    getOptionsForPlayer: function (playerId) {
        var options = [];
        var boardCopy;

        if (playerId === 0) {  // If it's Player 0 (Elephants' turn)
            // Case: "E-" (Elephant can walk right)
            var a = this.board.indexOf("E-");
            while (a !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, a) + "-E" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("E-", a + 1);
            }

        } else {  // If it's Player 1 (Rhinos' turn)
            // Case: "-R" (Rhino can walk left)
            var a = this.board.indexOf("-R");
            while (a !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, a) + "R-" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("-R", a + 1);
            }
        }

        return options;  // Return an array of all possible board states
    },

    equals: function (other) {
        return this.board === other.board
    },

    clone: function () {
        var other = new ElephantsAndRhinosGame(this.board.length);
        other.board = this.board;
        return other;
    },

    playAt: function (idx, currentPlayer) {
        if (this.board[idx] == "-") {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Toads' turn
            if (currentPlayer == 0) {
                if (this.board.slice(idx - 1, idx + 1) == "E-") {
                    option.board = this.board.slice(0, idx - 1) + "-E" + this.board.slice(idx + 1);
                }

                // If currently Frogs' turn
            } else {
                if (this.board.slice(idx, idx + 2) == "-R") {
                    option.board = this.board.slice(0, idx) + "R-" + this.board.slice(idx + 2);
                }
            }

            return option;

        } else if (this.board[idx] == ["E", "R"][currentPlayer]) {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Toads' turn
            if (currentPlayer == 0) {
                if (this.board.slice(idx, idx + 2) == "E-") {
                    option.board = this.board.slice(0, idx) + "-E" + this.board.slice(idx + 2);
                }

                // If currently Frogs' turn
            } else {
                if (this.board.slice(idx - 1, idx + 1) == "-R") {
                    option.board = this.board.slice(0, idx - 1) + "R-" + this.board.slice(idx + 1);
                }
            }
            return option;
        } else {
            return this;
        }
    }
});

var InteractiveElephantsAndRhinosView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    },

    /**
     * Draws the board.
     */
    draw: function (containerElement, listener) {

        var labels = this.position.board.split("");

        containerElement.innerHTML = "";
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");
        const pixelsPerBoxWide = (canvasWidth - 10) / labels.length;
        const rectSize = Math.min(pixelsPerBoxWide, canvasHeight);

        const boardWidth = canvasWidth;

        const boardPixelSize = Math.min(canvasHeight, boardWidth);

        //const rectSize = boardPixelSize / labels.length;

        labels.forEach((label, index) => {
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", index * rectSize);
            rect.setAttribute("y", boardPixelSize / 2 - rectSize);
            rect.setAttribute("width", rectSize);
            rect.setAttribute("height", rectSize);
            rect.setAttribute(
                "fill",
                label === "E" ? "yellow" : label === "R" ? "green" : "grey"
            );
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", "3");
            rect.setAttribute("id", `rect-${index}`);
            if (listener != undefined) {
                var player = listener;
                rect.onclick = function (event) { player.handleClick(event); }
            }
            boardSvg.appendChild(rect);
        });
    },

    getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var idx = event.target.id;
        idx = parseInt(idx[idx.length - 1]);
        var chosenOption = this.position.playAt(idx, currentPlayer);
        player.sendMoveToRef(chosenOption);
    }
}); //end of InteractiveElephantsAndRhinosView class


/**
 * View Factory for Elephants and Rhinos
 */
var InteractiveElephantsAndRhinosViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    },

    /**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveElephantsAndRhinosView(position);
    },

    /**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }
}) //end of InteractiveElephantsAndRhinosViewFactory

/**
 * Launches a new Elephants And Rhinos game.
 */
function newElephantsAndRhinosGame() {
    var viewFactory = new InteractiveElephantsAndRhinosViewFactory
    var playDelay = 1000;
    var controlForm = $('gameOptions');
    var boardSize = parseInt($("boardSize").value);
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new ElephantsAndRhinosGame(boardSize);
    var ref = new Referee(game, players, viewFactory, "elephantsAndRhinosBoard", $('messageBox'), controlForm);
}

const SlammingToadsAndFrogs = Class.create(ToadsAndFrogs, {

    getOptionsForPlayer: function (playerId) {
        var options = [];
        var boardCopy;

        if (playerId === 0) {  // If it's Player 0 (Toads' turn)
            // Case: "T-" (Toad can hop right)
            var a = this.board.indexOf("T-");
            while (a !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, a) + "-T" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("T-", a + 1);
            }

            // Case: "TF-" (Toad can hop over Frog and move)
            var b = this.board.indexOf("-TF");
            while (b !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, b) + "FT-" + this.board.slice(b + 3);
                console.log(boardCopy.board);
                options.push(boardCopy);

                // Continue searching from the next index
                b = this.board.indexOf("-TF", b + 1);
            }

        } else {  // If it's Player 1 (Frogs' turn)
            // Case: "-F" (Frog can hop left)
            var a = this.board.indexOf("-F");
            while (a !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, a) + "F-" + this.board.slice(a + 2);
                options.push(boardCopy);

                // Continue searching from the next index
                a = this.board.indexOf("-F", a + 1);
            }

            // Case: "-TF" (Frog can hop over Toad and move)
            var b = this.board.indexOf("TF-");
            while (b !== -1) {
                boardCopy = this.clone()
                boardCopy.board = this.board.slice(0, b) + "-FT" + this.board.slice(b + 3);
                options.push(boardCopy);

                // Continue searching from the next index
                b = this.board.indexOf("TF-", b + 1);
            }
        }
        return options;  // Return an array of all possible board states
    },

    equals: function (other) {
        return this.board === other.board
    },

    clone: function () {
        var other = new SlammingToadsAndFrogs(this.board.length);
        other.board = this.board;
        return other;
    },

    playAt: function (idx, currentPlayer) {
        if (this.board[idx] == "-") {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Toads' turn
            if (currentPlayer == 0) {
                if (this.board.slice(idx - 1, idx + 1) == "T-") {
                    option.board = this.board.slice(0, idx - 1) + "-T" + this.board.slice(idx + 1);
                }
                else if (this.board.slice(idx, idx + 3) == "-TF") {
                    option.board = this.board.slice(0, idx) + "FT-" + this.board.slice(idx + 3);
                }

                // If currently Frogs' turn
            } else {
                if (this.board.slice(idx, idx + 2) == "-F") {
                    option.board = this.board.slice(0, idx) + "F-" + this.board.slice(idx + 2);
                } else if (this.board.slice(idx - 2, idx + 1) == "TF-") {
                    option.board = this.board.slice(0, idx - 2) + "-FT" + this.board.slice(idx + 1);
                }
            }

            return option;

        } else if (this.board[idx] == ["F", "T"][currentPlayer]) {
            // Clone that is going to be returned
            var option = this.clone();

            // If currently Frogs' turn
            if (currentPlayer == 1) {
                if (this.board.slice(idx, idx + 3) == "TF-") {
                    option.board = this.board.slice(0, idx) + "-FT" + this.board.slice(idx + 3);
                }

                // If currently Toads' turn
            } else {
                if (this.board.slice(idx - 2, idx + 1) == "-TF") {
                    option.board = this.board.slice(0, idx - 2) + "FT-" + this.board.slice(idx + 1);
                }
            }

            return option;
        } else {
            return this;
        }
    }
});

var InteractiveSlammingToadsAndFrogsView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    },

    /**
     * Draws the board.
     */
    draw: function (containerElement, listener) {

        var labels = this.position.board.split("");

        containerElement.innerHTML = "";
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        containerElement.appendChild(boardSvg);

        const boardWidth = Math.min(
            getAvailableHorizontalPixels(containerElement),
            window.innerWidth - 200
        );

        const boardPixelSize = Math.min(window.innerHeight, boardWidth);
        boardSvg.setAttribute("width", boardPixelSize);
        boardSvg.setAttribute("height", boardPixelSize);

        // Create a <defs> element if it doesn't already exist
        let defs = boardSvg.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            boardSvg.appendChild(defs);
        }

        const rectSize = boardPixelSize / labels.length;

        labels.forEach((label, index) => {

            // Create a <pattern> element
            const pattern = document.createElementNS(svgNS, "pattern");
            const patternId = `imgPattern${index}`;
            pattern.setAttribute("id", patternId);
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            pattern.setAttribute("width", rectSize);
            pattern.setAttribute("height", rectSize);
            pattern.setAttribute("y", boardPixelSize / 2 - rectSize)

            const image = document.createElementNS(svgNS, "image");
            image.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                label === "T"
                    ? "toadsAndFrogsItems/Toad.png"
                    : label === "F"
                        ? "toadsAndFrogsItems/Frog.png"
                        : "toadsAndFrogsItems/Empty.png"
            );
            image.setAttribute("width", rectSize);
            image.setAttribute("height", rectSize);

            pattern.appendChild(image);
            defs.appendChild(pattern);

            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", index * rectSize);
            rect.setAttribute("y", boardPixelSize / 2 - rectSize);
            rect.setAttribute("width", rectSize);
            rect.setAttribute("height", rectSize);
            rect.setAttribute("fill", `url(#${patternId})`);
            rect.setAttribute("stroke", "black");
            rect.setAttribute("id", `rect-${index}`);
            if (listener != undefined) {
                var player = listener;
                rect.onclick = function (event) { player.handleClick(event); }
            }
            boardSvg.appendChild(rect);
        });
    },

    getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var idx = event.target.id;
        idx = parseInt(idx[idx.length - 1]);
        var chosenOption = this.position.playAt(idx, currentPlayer);
        player.sendMoveToRef(chosenOption);
    }
}); //end of InteractiveSlammingToadsAndFrogsView class


/**
 * View Factory for SlammingToads and Frogs
 */
var InteractiveSlammingToadsAndFrogsViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    },

    /**
     * Returns an interactive view
     */
    getInteractiveBoard: function (position) {
        return new InteractiveSlammingToadsAndFrogsView(position);
    },

    /**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }
}) //end of InteractiveToadsAndFrogsViewFactory

/**
 * Launches a new ToadsAndFrogs game.
 */
function newSlammingToadsAndFrogsGame() {
    var viewFactory = new InteractiveSlammingToadsAndFrogsViewFactory
    var playDelay = 1000;
    var controlForm = $('gameOptions');
    var boardSize = parseInt($("boardSize").value);
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new SlammingToadsAndFrogs(boardSize);
    var ref = new Referee(game, players, viewFactory, "toadsAndFrogsBoard", $('messageBox'), controlForm);
}


//end of Toads and Frogs section



/////////////////////////////// Transverse Wave /////////////////////////////////////


/**
 * Transverse Wave game
 * 
 * Grid is stored as a 2D array of booleans.  (Array of columns of cells.)
 */
var TransverseWave = Class.create(CombinatorialGame, {

    /**
     * Constructor.
     * purpleProbability is the likelihood that a single cell is purple
     */
    initialize: function (height, width, purpleProbability) {
        this.playerNames = ["Left", "Right"];
        this.columns = new Array();
        //default probability
        var purpleChance = purpleProbability || .35;
        for (var i = 0; i < width; i++) {
            var column = new Array();
            for (var j = 0; j < height; j++) {
                var isPurple = Math.random() < purpleChance;
                column.push(isPurple);
            }
            this.columns.push(column);
        }
    }

    /**
     * Returns the width of this board.
     */
    , getWidth: function () {
        return this.columns.length;
    }

    /**
     * Returns the height of this board.
     */
    , getHeight: function () {
        if (this.getWidth() == 0) {
            return 0;
        } else {
            return this.columns[0].length;
        }
    }

    /**
     * Equals!
     */
    , equals: function (other) {
        //check that the dimensions match
        if (this.getWidth() != other.getWidth() || this.getHeight() != other.getHeight()) {
            return false;
        }
        //now check that all the cells are equal
        for (var col = 0; col < this.columns.length; col++) {
            for (var row = 0; row < this.columns[col].length; row++) {
                if (this.columns[col][row] != other.columns[col][row]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Clone.
     */
    , clone: function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var other = new TransverseWave(height, width);
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                other.columns[col][row] = this.columns[col][row];
            }
        }
        return other;
    }

    /**
     * Returns whether a player can play on one of the columns.
     */
    , canPlayColumn: function (columnIndex) {
        var column = this.columns[columnIndex];
        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            if (!column[rowIndex]) {
                //the cell is not green, so this column can be played on.
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the position that results in a player playing in a column.
     */
    , playAtColumn: function (columnIndex) {
        if (!this.canPlayColumn(columnIndex)) {
            return null;  //TODO: throw an error?
        }
        var option = this.clone();
        var column = option.columns[columnIndex];
        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            if (column[rowIndex]) {
                //it's already purple in this column; spread the transverse wave; and make all the others purple!
                for (var colIndex = 0; colIndex < option.columns.length; colIndex++) {
                    option.columns[colIndex][rowIndex] = true;
                }
            } else {
                //it's green here, so make it purple
                option.columns[columnIndex][rowIndex] = true;
            }
        }
        return option;
    }

    /**
     * Gets the options.
     */
    , getOptionsForPlayer: function (playerId) {
        var options = new Array();
        for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
            if (this.canPlayColumn(colIndex)) {
                options.push(this.playAtColumn(colIndex));
            }
        }
        return options;
    }

}); // end of TransverseWave class



var InteractiveTransverseWaveView = Class.create({

    /**
     * Constructor.
     */
    initialize: function (position) {
        this.position = position;
    }

    /**
     * Draws the board.
     */
    , draw: function (containerElement, listener) {
        //clear out the other children of the container element
        while (containerElement.hasChildNodes()) {
            containerElement.removeChild(containerElement.firstChild);
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var boardSvg = document.createElementNS(svgNS, "svg");
        //now add the new board to the container
        containerElement.appendChild(boardSvg);
        nicelySizeSVG(boardSvg, containerElement);
        const canvasWidth = boardSvg.getAttributeNS(null, "width");
        const canvasHeight = boardSvg.getAttributeNS(null, "height");

        const width = this.position.getWidth();
        const height = this.position.getHeight();
        const pixelsPerBoxWide = (canvasWidth - 10) / width;
        const pixelsPerBoxHigh = (canvasHeight - 10) / (height + 2.5); //for the triangles
        const boxSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        var maxDiameter = boxSide; //Math.min(maxCircleWidth, maxCircleHeight);
        const maxBoxSide = boxSide;

        //draw the board
        for (var colIndex = 0; colIndex < width; colIndex++) {
            //draw the triangle at the top of the column
            if (this.position.canPlayColumn(colIndex)) {
                //draw the triangle above the column.  This is where the player will press to select the column.
                //from Robert Longson's answer here: https://stackoverflow.com/questions/45773273/draw-svg-polygon-from-array-of-points-in-javascript
                var triangle = document.createElementNS(svgNS, "polygon");
                triangle.style.stroke = "black";
                var topLeftPoint = boardSvg.createSVGPoint();
                topLeftPoint.x = colIndex * maxBoxSide + 15;
                topLeftPoint.y = 10;
                triangle.points.appendItem(topLeftPoint);
                var topRightPoint = boardSvg.createSVGPoint();
                topRightPoint.x = (colIndex + 1) * maxBoxSide + 5;
                topRightPoint.y = 10;
                triangle.points.appendItem(topRightPoint);
                var bottomPoint = boardSvg.createSVGPoint();
                bottomPoint.x = (colIndex + .5) * maxBoxSide + 10;
                bottomPoint.y = 5 + maxBoxSide;
                triangle.points.appendItem(bottomPoint);
                triangle.style.fill = "black";
                boardSvg.appendChild(triangle);
                //set the listener for the triangle
                if (listener != undefined) {
                    triangle.column = colIndex;
                    var player = listener;
                    triangle.onclick = function (event) { player.handleClick(event); }
                }
                console.log("drawing triangle: " + triangle);
            }
            //draw the boxes in this column
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                var box = document.createElementNS(svgNS, "rect");
                box.setAttributeNS(null, "x", (10 + colIndex * maxBoxSide) + "");
                box.setAttributeNS(null, "y", (10 + (rowIndex + 2) * maxBoxSide) + "");
                box.setAttributeNS(null, "width", maxBoxSide + "");
                box.setAttributeNS(null, "height", maxBoxSide + "");
                //box.setAttributeNS(null, "class", parityString + "Checker");
                box.style.stroke = "black";
                if (this.position.columns[colIndex][rowIndex]) {
                    box.style.fill = "orchid";
                } else {
                    box.style.fill = "green";
                }
                boardSvg.appendChild(box);
            }
        }
    }

    /**
     * Handles the mouse click.
     */
    , getNextPositionFromClick: function (event, currentPlayer, containerElement, player) {
        var columnIndex = event.target.column;
        var chosenOption = this.position.playAtColumn(columnIndex);
        player.sendMoveToRef(chosenOption);
    }

}); //end of InteractiveTransverseWaveView class

/**
 * View Factory for Transverse Wave
 */
var InteractiveTransverseWaveViewFactory = Class.create({
    /**
     * Constructor
     */
    initialize: function () {
    }

    /**
     * Returns an interactive view
     */
    , getInteractiveBoard: function (position) {
        return new InteractiveTransverseWaveView(position);
    }

    /**
     * Returns a view.
     */
    , getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveTransverseWaveViewFactory

/**
 * Launches a new TransverseWave game.
 * TODO: add an option to choose the initial density of purple cells
 */
function newTransverseWaveGame() {
    var viewFactory = new InteractiveTransverseWaveViewFactory();
    var playDelay = 1000;
    var width = parseInt($('boardWidth').value);
    var height = parseInt($('boardHeight').value);
    var controlForm = $('gameOptions');
    var leftPlayer = eval(getSelectedRadioValue(controlForm.elements['leftPlayer']));
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    const players = [leftPlayer, rightPlayer];
    var game = new TransverseWave(height, width);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm);
};





function getCommonPlayerOptions(viewFactory, delay, lowAIDifficulty, highAIDifficulty) {
    var highAI = highAIDifficulty || 7;
    var lowAI = lowAIDifficulty || 1;
    var playDelay = delay || 1000;
    var playerOptions = [new HumanPlayer(viewFactory), new RandomPlayer(playDelay)];
    for (var i = lowAI; i <= highAI; i++) {
        playerOptions.push(new DepthSearchPlayer(playDelay, i));
    }
    return playerOptions;

};

function getCommonMCTSOptions(viewFactory, delay, lowAIDifficulty, highAIDifficulty) {
    var highAI = highAIDifficulty || 7;
    var lowAI = lowAIDifficulty || 1;
    var playDelay = delay || 1000;
    var playerOptions = [new HumanPlayer(viewFactory), new RandomPlayer(playDelay)];
    for (var i = lowAI; i <= highAI; i++) {
        playerOptions.push(new MCTS(playDelay));
    }
    console.log(playerOptions);
    return playerOptions;
};

function getCommonAIOptions(viewFactory, delay, lowAIDifficulty, highAIDifficulty) {
    var highAI = highAIDifficulty || 7;
    var lowAI = lowAIDifficulty || 1;
    var playDelay = delay || 1000;
    var playerOptions = [new HumanPlayer(viewFactory), new RandomPlayer(playDelay)];
    for (var i = lowAI; i <= highAI + 1; i++) {
        playerOptions.push(new AIPlayer(playDelay, i));
    }
    return playerOptions;
};





/**
 * Controller for game play under Normal Play (i.e., The last person to move wins, AKA if you can't move, you lose.)
 * TODO: change viewElementId to viewElement
 * autoStart is a boolean for whether the referee should start running at creation.
 * alertWhenDone is a list of objects that want to know when this is done.  All those objects should have a gameIsOver(Referee) method.
 */
const Referee = Class.create({
    initialize: function (position, players, viewFactory, viewElementId, messageContainerOrId, optionsPanel, autoStart, alertWhenDone, canPierule) {
        this.isComplete = false;
        this.viewFactory = viewFactory;
        this.position = position;
        this.players = players; //TODO: clone players?
        this.viewElementId = viewElementId || "gameBoard";

        // I Brendan Whitmire have changed this section || as well as added in the canPierule parameter -----------------------

        this.pieruleCount = 0;
        if (canPierule) {
            this.pieruleCount = 2;
        }

        // --------------------------------------------------------------------------------------------------------------------

        //this.viewElement = document.getElementById(viewElementId);
        this.currentPlayer = CombinatorialGame.prototype.LEFT;
        if (typeof messageContainerOrId === 'string') {
            this.messageContainerId = messageContainerOrId;
        } else {
            try {
                this.messageContainerId = messageContainerOrId.id;
            } catch (error) {
                //okay, let's just set it equal to a terrible string that won't be an id.
                this.messageContainerId = "mustardMcMonkey";
            }
        }
        //this.messageContainer = messageContainer || document.createElement("p");
        this.optionsPanel = optionsPanel || document.createElement("p");
        if (autoStart === undefined) {
            autoStart = true;
        }
        this.alertWhenDone = alertWhenDone || [];

        this.setOptionsAbleness(false);
        this.setStringMessage(this.position.getPlayerName(this.currentPlayer) + " goes first.");
        this.view = this.viewFactory.getView(this.position);
        if (!this.players[this.currentPlayer].hasView()) {
            this.view.draw(this.getViewContainer());
        }
        //console.log("In ref!");
        //console.log("  this.position: " + this.position);
        if (autoStart) this.requestNextMove();
    }

    /**
     * Gets a hypothetical winner in another game.  Returns the index of the winner if the game is complete.  It's a bit hacky.  Sorry!  If it's not complete, it returns a -1;
     */
    , getHypotheticalWinner: function (position, justMovedPlayerIndex) {
        //TODO: it would be safer to clone this referee and then do stuff to it.  How can we do that?

        //save important things
        const actualPosition = this.position;
        const actualIsDone = this.isComplete;
        const actualCurrentPlayer = this.currentPlayer;
        //set up the current status
        const nextPlayer = 1 - justMovedPlayerIndex;
        this.currentPlayer = nextPlayer;
        const nextOptions = position.getOptionsForPlayer(nextPlayer);
        this.isComplete = nextOptions.length == 0;
        var winner = -1; //an unknown player is winning as far as we know
        if (this.isComplete) {
            winner = this.getWinnerIndex();
        }
        //put the state back!
        this.position = actualPosition;
        this.isComplete = actualIsDone;
        this.currentPlayer = actualCurrentPlayer;
        return winner;
    }

    /**
     * Determines whether the options will be enabled.
     */
    , setOptionsAbleness: function (areEnabled) {
        var areDisabled = !areEnabled;
        var descendants = Element.descendants(this.optionsPanel);
        for (var i = 0; i < descendants.length; i++) {
            descendants[i].disabled = areDisabled;
        }
    }

    ,/**
     * Sets the message to players.
     */
    setStringMessage: function (message) {
        var messageContainer = $(this.messageContainerId);
        if (messageContainer != undefined) {
            messageContainer.innerHTML = message;
        }
    }

    ,/**
     * Gets the element that contains the view for this.
     */
    getViewContainer: function () {
        return $(this.viewElementId);
    }

    /**
     * Moves to a new option, setting all relevant fields.
     */
    , moveTo: function (option) {
        if (option == undefined || option == null) {
            console.log("option is undefined or null in Referee.moveTo(option)");
            console.log("We're counting that as a forfeit!");
            this.endGame();
        }

        // I Brendan Whitmire have added in this section ----------------------------------------

        this.position.canPierule = this.canPierule();

        // --------------------------------------------------------------------------------------

        if (this.position.hasOption(this.currentPlayer, option)) {
            //console.log("Making a legal move...");
            //the move is legal.  Make it.
            this.position = option;
            this.currentPlayer = 1 - this.currentPlayer;
            //console.log(this.players);
            if (!this.players[this.currentPlayer].hasView()) {
                this.view = this.viewFactory.getView(this.position);
                this.view.draw(this.getViewContainer());
            }

            if (this.position.getOptionsForPlayer(this.currentPlayer).length == 0) {
                this.endGame();
            } else {
                //TODO: globals for debugging!
                /*
                curP = this.currentPlayer;
                gameState = this.position;
                moves = this.position.getOptionsForPlayer(this.currentPlayer);
                */

                // I Brendan Whitmire have added this section ------------------------------
                this.pieruleCount -= 1;
                // -------------------------------------------------------------------------

                this.setStringMessage("It's " + this.position.getPlayerName(this.currentPlayer) + "'s turn.");
                this.requestNextMove();
            }
            //this.requestNextMove();
        } else {
            console.log("The current player (" + this.currentPlayer + ") tried to make an illegal move!");
            if (option != null) {
                console.log("Tried to move to a non-option!  Parent stored in debugPar; bad option stored in debugVar.");
                console.log("  From (debugPar): " + this.position);
                console.log(this.position);
                console.log("  To (debugVar): " + option);
                console.log(option);
                debugVar = option;
                debugPar = this.position;
            }
            this.endGame();
        }
    }

    /**
     * Ends the game.
     */
    , endGame: function () {
        this.isComplete = true;
        this.view = this.viewFactory.getView(this.position);
        this.view.draw(this.getViewContainer());
        //console.log("Game over!");
        const winnerIndex = this.getWinnerIndex();
        this.setStringMessage("There are no moves for " + this.position.getPlayerName(this.currentPlayer) + ".  " + this.position.getPlayerName(winnerIndex) + " wins!");
        this.setOptionsAbleness(true);
        this.alertGameOver();
    }

    /**
     * Requests the next move.
     */
    , requestNextMove: function () {
        var self = this;
        //perform a delayed call so that the display will redraw
        window.setTimeout(function () { self.requestNextMoveHelper(); }, 20);
    }

    /**
     * Helper for requestNextMove
     */
    , requestNextMoveHelper: function () {
        //console.log("this: " + this);
        //console.log("this.position: " + this.position);
        this.players[this.currentPlayer].givePosition(this.currentPlayer, this.position, this);
    }


    // I Brendan Whitmire have added this method---------------------------------------------
    /**
     * Returns whether or not the pie rule can be activated.
     */
    , canPierule: function () {
        return this.pieruleCount == 1;
    }
    // --------------------------------------------------------------------------------------


    /**
     * Returns whether this game is over.
     */
    , isDone: function () {
        return this.isComplete;
        //return this.position.getOptionsForPlayer(this.currentPlayer).length == 0;
    }

    /**
     *  Lets the relevant objects know that the game is over.
     */
    , alertGameOver: function () {
        for (var i = 0; i < this.alertWhenDone.length; i++) {
            this.alertWhenDone[i].gameIsOver(this);
        }
    }

    /**
     * Returns the winner.
     */
    , getWinnerIndex: function () {
        if (!this.isDone()) {
            //console.log("Asked for the winner before the game is done!!!!");
        }
        return 1 - this.currentPlayer;
    }
}); //end of Referee


/**
 * A Referee for Misere Play.  (i.e., whoever makes the last move loses)
 */
const MisereReferee = Class.create(Referee, {

    /**
     * Returns the winner.
     */
    getWinnerIndex: function () {
        if (!this.isDone()) {
            //console.log("Asked for the winner before the game is done!!!!");
        }
        return this.currentPlayer;
    }

}); //end of MisereReferee


/**
 * A Referee for Scoring Play.  (i.e., whoever has the winning score at the end wins)
 */
const ScoringReferee = Class.create(Referee, {

    endGame: function () {
        Referee.prototype.endGame.call(this);
        var endingMessage = "The game is over!  ";
        const winningIndex = this.getWinnerIndex();
        if (winningIndex >= 0 && winningIndex < 2) {
            const winningPlayerName = this.position.getPlayerName(this.getWinnerIndex());
            const winningMargin = Math.abs(this.getGameScore());
            endingMessage += winningPlayerName + " won by " + winningMargin + " points!";
        } else {
            endingMessage += "The score is tied, so the result is a draw!";
        }
        this.setStringMessage(endingMessage);
    }

    , getWinnerIndex: function () {
        const score = this.getGameScore();
        if (!this.isDone()) {
            console.log("Asked for the winner before the game is done!!!!");
        } else if (score == 0) {
            return CombinatorialGame.prototype.DRAW;
        } else if (score > 0) {
            return CombinatorialGame.prototype.LEFT;
        } else if (score < 0) {
            return CombinatorialGame.prototype.RIGHT;
        } else {
            console.log("ERROR!  We couldn't get the appropriate score!");
            return -1;
        }
    }

    , getGameScore: function () {
        try {
            return this.position.getScore();
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

});

/**
 *
 */
var RandomPlayer = Class.create(ComputerPlayer, {
    /**
     * Constructor
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */
    initialize: function (delay) {
        this.delayMilliseconds = delay;
    }

    /**
     * Chooses a move.
     */
    , givePosition: function (playerIndex, position, referee) {
        //var arrayForSemaphore = [false]; //use an array so we can pass by reference
        var options = position.getOptionsForPlayer(playerIndex);
        var randomIndex = Math.floor(Math.random() * options.length);
        window.setTimeout(function () { referee.moveTo(options[randomIndex]);/*arrayForSemaphore[0] = true;*/ }, this.delayMilliseconds);
        //while (!arrayForSemaphore[0]) { /* do nothing */}
        //return options[randomIndex];
    }

}); //end of RandomPlayer

var MCTS = Class.create(ComputerPlayer, {

    /**
     * Constructor
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */

    initialize: function (delay) {
        this.delayMilliseconds = delay;
    },

    givePosition: function (playerIndex, position, referee) {
        var newPosition = position.clone();
        var options = position.getOptionsForPlayer(playerIndex);
        var MCTSOptions = [];

        for (var i = 0; i < options.length; i++) {
            var tempNode = new MCTSNode(options[i], 0, 0);
            MCTSOptions.push(tempNode);
        }

        this.rollout(newPosition, MCTSOptions, playerIndex);
    },

    rollout: function (newPosition, options, playerIndex) {
        console.log("TEST");
        while (options.length > 0) {
            playerIndex = 1 - playerIndex
            newPosition.board = options[Math.floor(Math.random() * options.length)];
            options = newPosition.board.getOptionsForPlayer();
        }
        console.log(newPosition);
        console.log("WINNER! Player " + playerIndex);
    }

})

var MCTSNode = Class.create({

    initialize: function (position, timesSampled, value) {
        this.position = position;               //Position = ruleset
        this.timesSampled = timesSampled;
        this.value = value;
        this.ucb1 = Infinity;
    },

    getPosition: function () {
        return this.position;
    },

    getTimesSampled: function () {
        return this.timesSampled;
    },

    getValue: function () {
        return this.value;
    },

    getUCB1: function () {
        return this.ucb1;
    },

    setBoard: function (board) {
        this.board = board;
    },

    setTimesSampled: function (timesSampled) {
        this.timesSampled = timesSampled;
    },

    setValue: function (value) {
        this.value = value;
    },

    setUCB1: function (ucb1) {
        this.ucb1 = ucb1;
    },
})

async function loadModel() {
    let model = await tf.loadLayersModel('model.json');

    return model;
}

var AIPlayer = Class.create(ComputerPlayer, {

    /**
     * Constructor
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */

    initialize: function (delay, difficulty) {
        this.delayMilliseconds = delay;
        this.difficulty = difficulty;
    },

    givePosition: function (playerIndex, position, referee) {
        const AMAZONS_MODEL = loadModel();
        var self = this;
        AMAZONS_MODEL.then(function (AMAZONS_MODEL) {

            if (self.difficulty == 6) {
                var diff_coeff = 0.01;
            }
            else if (self.difficulty == 5) {
                var diff_coeff = 0.05;
            }
            else if (self.difficulty == 4) {
                var diff_coeff = 0.10;
            }
            else if (self.difficulty == 3) {
                var diff_coeff = 0.25;
            }
            else if (self.difficulty == 2) {
                var diff_coeff = 0.50;
            }
            else if (self.difficulty == 1) {
                var diff_coeff = 0.75;
            }

            var options = position.getOptionsForPlayer(playerIndex);

            var allMasks = [];
            for (var i = 0; i < options.length; i++) {
                // Flattens board from 2d array to 1d
                var temp2dBoard = options[i].getBoard();

                var flattenedBoard = [];
                for (var j = 0; j < temp2dBoard.length; j++) {
                    for (var k = 0; k < temp2dBoard[0].length; k++) {
                        flattenedBoard.push(temp2dBoard[j][k]);
                    }
                }

                var tempMask = new Array(400).fill(0);

                for (var l = 0; l < flattenedBoard.length; l++) {
                    var value = 0;
                    switch (flattenedBoard[l]) {
                        case 'blank':
                            value = 0;
                            break;
                        case 'amazon blue':
                            value = 1;
                            break;
                        case 'amazon red':
                            value = 2;
                            break;
                        case 'stone':
                            value = 3;
                            break;
                    }
                    // console.log(flattenedBoard[value] * 100 + l);
                    tempMask[value * 100 + l] = 1;
                }
                allMasks.push(tempMask);
            }

            var test = tf.tensor(allMasks);
            var output_tensor = AMAZONS_MODEL.predict(test);

            const boardRatings = output_tensor.arraySync();

            var sortedBoards = [];

            for (var i = 0; i < boardRatings.length; i++) {
                var score = (boardRatings[i][0] - boardRatings[i][1]) + 100 * (boardRatings[i][2] - boardRatings[i][3]);
                var temp = [options[i], score];
                sortedBoards.push(temp);
            }

            if (playerIndex == 0) {
                sortedBoards.sort(function (a, b) {
                    return b[1] - a[1];
                });
            }
            else {
                sortedBoards.sort(function (a, b) {
                    return a[1] - b[1];
                });
            }


            try {

                var idx = Math.floor(Math.random() * (sortedBoards.length - (sortedBoards.length * diff_coeff)));
                const move = sortedBoards[idx][0];
                //console.log("PLAYER " + playerIndex + " MADE A MOVE OF RATING " + sortedBoards[idx][1]);

                window.setTimeout(function () { referee.moveTo(move); }, this.delayMilliseconds);
            }
            catch (error) {
                console.log("ERROR");
                console.log(sortedBoards);
                console.log(sortedBoards.length);
                console.log(idx);
            }


        }, function (err) {
            console.log("ERROR");
        })


        // TODO: Pass allMasks into the model, which will return an array of values for each possible next board state
        //var boardRatings = AMAZONS_MODEL.predict(allMasks);

        // Make list of [[option, rating], [option, rating]...]
    }

})



var RESULT_WIN = 1;
var RESULT_DUNNO = 0;
var RESULT_LOSS = -1;

//abstract version
var BestMoveAndResults = Class.create({

    /**
     * Constructor.
     */
    initialize: function (moves, depth) {
        this.moves = moves;
        this.depth = depth;
    }

    /**
     * Returns whether this is a winning move.
     */
    , winnability: function () {
        console.log("Tried calling BestMoveAndResults.winnability!");
    }

    /**
     * Returns the depth of the knowledge.
     */
    , getDepth: function () {
        return this.depth;
    }

    /**
     * Returns the better choice of this and a winning move.
     */
    , addtoWin: function (other) {
        return other;//we want the other one because it's a win
    }

    /**
     * Returns the better choice of this and a losing move.
     */
    , addToLoss: function (other) {
        return this; //we want this one, because the other one is a loss.
    }

    /**
     * Returns a move chosen at random.
     */
    , getMove: function () {
        //using Jacob Relkin's answer here: https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
        index = Math.floor(Math.random() * this.moves.length);
        move = this.moves[index];
        if (move == undefined) {
            console.log("Found a problem in getMove():");
            console.log("    index: " + index);
            console.log("    move: " + move.toString());
        }
        return move;
    }

    /**
     * Returns the move options in this.
     */
    , getMoves: function () {
        return this.moves; //TODO: we should probably clone these
    }

    /**
     * Checks for parentage and prints a message.
     */
    , checkLegalOption: function (parent, playerId) {
        for (var i = 0; i < this.moves.length; i++) {
            option = this.moves[i];
            if (!parent.hasOption(playerId, option)) {
                /*console.log("checkLegalOption found a problem!");
                console.log("    parent: " + parent.toString());
                console.log("    option: " + option.toString());
                console.log("    i: " + i);
                console.log("    this.moves.length: " + this.moves.length);
                console.log("    depth: " + this.depth);
                console.log("    playerId: " + playerId);
                */
                return false;
            }
        }
        //console.log("Success in checkLegalOption!");
    }


}); //end of BestMoveAndResults

var WinningMoveAndResults = Class.create(BestMoveAndResults, {

    /**
     * Constructor.
     */
    initialize: function ($super, moves, depth) {
        $super(moves, depth);
    }

    , winnability: function () {
        return RESULT_WIN;
    }

    , addTo: function (other) {
        return other.addToWin(this);
    }

    , addtoWin: function (other) {
        if (this.depth > other.depth) {
            //the other one can lead to a win faster.  Choose that one.
            return other;
        } else if (this.depth < other.depth) {
            //this can lead to a win faster.  Choose this one.
            return this;
        } else {
            //both lead to a win in the same amount of time.  
            return new WinningMoveAndResults(this.moves.concat(other.moves), this.depth);
        }
    }

    , addToDunno: function (other) {
        return this; //this is a win.
    }

    , reverseForParent: function (parent, playerId) {
        this.checkLegalOption(parent, playerId);
        return new LosingMoveAndResults([parent], this.depth + 1);
    }

});


var LosingMoveAndResults = Class.create(BestMoveAndResults, {
    winnability: function () {
        return RESULT_LOSS;
    }

    , addTo: function (other) {
        return other.addToLoss(this);
    }

    //addToWin: not needed because it's in the superclass

    , addToDunno: function (other) {
        return other; //other is better
    }

    , addToLoss: function (other) {
        if (this.depth > other.depth) {
            //we can drag it on longer with this.  
            return this;
        } else if (this.depth < other.depth) {
            return other;
        } else {
            return new LosingMoveAndResults(this.moves.concat(other.moves), this.depth);
        }
    }

    , reverseForParent: function (parent, playerId) {
        this.checkLegalOption(parent, playerId);
        return new WinningMoveAndResults([parent], this.depth + 1);
    }
});


var UndecidedMoveAndResults = Class.create(BestMoveAndResults, {
    winnability: function () {
        return RESULT_DUNNO;
    }

    , addTo: function (other) {
        return other.addToDunno(this);
    }

    , addToDunno: function (other) {
        if (this.depth == other.depth) {
            //same depth, so use both
            return new UndecidedMoveAndResults(this.moves.concat(other.moves), this.depth);
        } else {
            if (Math.random() > .5) {
                return this;
            } else {
                return other;
            }
        }
    }

    , reverseForParent: function (parent, playerId) {
        this.checkLegalOption(parent, playerId);
        return new UndecidedMoveAndResults([parent], this.depth + 1);
    }
});


//represents a BestMoveAndResults with no options
var NullBestMoveAndResults = Class.create(LosingMoveAndResults, {

    /**
     * Constructor.
     */
    initialize: function ($super) {
        $super([], 0);
    }

    , checkLegalOption: function (parent, playerId) {
        //do nothing.  Nothing is a legal option.
    }

    , getMove: function () {
        console.log("Called getMove() on NullBestMoveAndResults!  Yikes!");
    }

});





/**
 *  Updated Brute-Force AI to play games.  This one will look for both wins (to head towards) and losses (to avoid).
 */
var DepthSearchPlayer = Class.create(ComputerPlayer, {
    /**
     * Constructor
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */
    initialize: function (delay, maxDepth) {
        this.delayMilliseconds = delay;
        this.maxDepth = maxDepth;
    }

    /**
     * Chooses a move.
     */
    , givePosition: function (playerIndex, position, referee) {
        //var bestMoves = this.getBestMovesFrom(playerIndex, position, this.maxDepth);
        //console.log("Looking for a move from: " + position);
        /*
        if (bestMoves.winnability() == RESULT_WIN) {
            console.log("AI is feeling real good.");
        } else if (bestMoves.winnability() == RESULT_DUNNO) {
            console.log("AI doesn't know how to feel.  Depth: " + bestMoves.getDepth());
        } else {
            console.log("AI doesn't feel too good about this.  Death likely in " + bestMoves.getDepth() + " moves.");
        }*/
        //var option = bestMoves.getMove();

        const bestMovesAndOutcomes = this.getBestOutcomeMovesAndOutcomesFrom(position, playerIndex, referee, this.maxDepth);
        const bestChosen = randomChoice(bestMovesAndOutcomes);
        const option = bestChosen[0];

        window.setTimeout(function () { referee.moveTo(option); }, this.delayMilliseconds);
    }

    /**
     * Converts a playerIndex to an outcome measure.  (Left -> 1, Right -> -1, Neither -> 0).
     */
    , playerIndexToOutcome: function (index) {
        if (index == CombinatorialGame.prototype.LEFT) {
            return 1;
        } else if (index == CombinatorialGame.prototype.RIGHT) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * Converts a playerIndex to an outcome measure.  (positive -> Left, negative -> Right, 0 -> Draw).
     */
    , outcomeToPlayerIndex: function (outcome) {
        if (outcome > 0) {
            return CombinatorialGame.prototype.LEFT;
        } else if (outcome < 0) {
            return CombinatorialGame.prototype.RIGHT;
        } else {
            return CombinatorialGame.prototype.DRAW;
        }
    }

    /**
     * Returns a list of moves with the best outcome this player found.  Returns a list of quads: [option, conclusivity, outcome, bestDepth], where the conclusivity is a boolean indicating whether it found a win or loss or not.  outcome is an integer representing who won, on a 1: Left, -1: Right, 0: draw/no one scale.  (NOTE: this is not the usual player indices!  We're doing it this way so that it "jives" with results of scoring games.)  bestDepth is the depth you can cause that.  For wins for yourself, lower depth is better.  For losses, a higher depth is better.  If conclusivity is false, then this number doesn't matter.  
     */
    , getBestOutcomeMovesAndOutcomesFrom: function (position, playerIndex, referee, depth) {
        const options = position.getOptionsForPlayer(playerIndex);
        const optionsAndOutcomes = [];
        if (options.length == 0) {
            return [];
        }
        //now we can assume options has a positive length.
        if (depth == 0) {
            for (var i = 0; i < options.length; i++) {
                optionsAndOutcomes.push([options[i], false, 0, 0]);
            }
            return optionsAndOutcomes;
        } else {
            for (var i = 0; i < options.length; i++) {
                const option = options[i];
                const otherPlayer = 1 - playerIndex;
                const nextPlays = option.getOptionsForPlayer(otherPlayer);
                const winner = referee.getHypotheticalWinner(option, playerIndex);
                var completed = winner != -1;
                var outcome = this.playerIndexToOutcome(winner);
                if (completed) {
                    //this option ends the game
                    optionsAndOutcomes.push([option, completed, outcome, 1]);
                    if (winner == playerIndex) {
                        break; //don't keep going... let's save ourselves some time.  This isn't very good in ScoringGames, but... whatever.  Sorry, ScoringGames!
                    }
                } else {
                    //the game isn't over, so we have to recurse
                    const nextOptionsAndOutcomes = this.getBestOutcomeMovesAndOutcomesFrom(option, otherPlayer, referee, depth - 1);
                    const firstNextOptionAndOutcome = nextOptionsAndOutcomes[0];
                    optionsAndOutcomes.push([option, firstNextOptionAndOutcome[1], firstNextOptionAndOutcome[2], firstNextOptionAndOutcome[3] + 1]);
                }
            }
            //now we need to take only the best of the ones we found.
            optionsAndOutcomes.sort((a, b) => {
                if (a[2] != b[2]) {
                    return a[2] - b[2];
                } else if (a[3] != b[3]) {
                    //depths are different
                    if (a[2] < 0) {
                        //both are a Right win 
                        return a[3] - b[3]; //faster wins are better for Right
                    } else {
                        //Left win or draw
                        return b[3] - a[3]; //faster wins are better for Left.
                    }
                } else if (a[1] == b[1]) {
                    return 0;
                } else if (a[1]) {
                    return 1; //sure, why not?
                } else {
                    return -1;//okay.  I didn't really think hard about this.
                }
            });
            //the array is backwards now: the best ones for left are all the way to the right.  The best ones for Right are all the way to the left.

            //now cut out the ones we don't want.  We can do that by searching.
            if (playerIndex == CombinatorialGame.prototype.LEFT) {
                //start from the right and go down
                var i = optionsAndOutcomes.length - 1;
                const highestOutcome = optionsAndOutcomes[i][2];
                const bestDepth = optionsAndOutcomes[i][3];
                for (; i >= 0; i--) {
                    if (optionsAndOutcomes[i][2] < highestOutcome || optionsAndOutcomes[i][3] != bestDepth) {
                        //cut out everything from 0 to i.
                        optionsAndOutcomes.splice(0, i + 1);
                        break;
                    }
                }
            } else {
                //start from the left and go up
                var i = 0;
                const lowestOutcome = optionsAndOutcomes[i][2];
                const bestDepth = optionsAndOutcomes[i][3];
                for (; i < optionsAndOutcomes.length; i++) {
                    if (optionsAndOutcomes[i][2] > lowestOutcome || optionsAndOutcomes[i][3] != bestDepth) {
                        //cut out everything from i forward
                        optionsAndOutcomes.splice(i, optionsAndOutcomes.length - i);
                        break;
                    }
                }
                //console.log(optionsAndOutcomes);
            }
            return optionsAndOutcomes;
        }
    }

    /**
     * Returns a BestMoveAndResults from the options of a position.
     * @param playerIndex index of current player
     * @param position    The position to search options from.
     * @param depth       The maximum depth to search to.
     */
    , getBestMovesFrom: function (playerIndex, position, depth) {
        depth = depth || this.maxDepth;
        var options = position.getOptionsForPlayer(playerIndex);
        var bestOptions = new NullBestMoveAndResults();
        if (options.length == 0) {
            //console.log("Asked to get the best move from position monkey with no options.");
            //monkeyPosition = position;
            return bestOptions;
        }
        if (depth <= 1) {
            return new UndecidedMoveAndResults(options, 0);
        } else {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                var nextOptions = this.getBestMovesFrom(1 - playerIndex, option, depth - 1);
                var reversed = nextOptions.reverseForParent(option, 1 - playerIndex);
                bestOptions = bestOptions.addTo(reversed);

                if (bestOptions.winnability() == 1) {
                    //we found a win.  Let's shortcut and return that instead of getting fancy.
                    return bestOptions;
                }
            }
            //console.log("Returning a " + bestOptions.winnability() + " from depth " + depth + "...");
            return bestOptions;
        }
    }

});

/**
 *  Brute-Force AI to play games.  Does not avoid losing moves.
 */
var DepthSearchPlayerOld = Class.create(ComputerPlayer, {
    /**
     * Constructor
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */
    initialize: function (delay, maxDepth) {
        this.delayMilliseconds = delay;
        this.maxDepth = maxDepth;
    }

    /**
     * Chooses a move.
     */
    , givePosition: function (playerIndex, position, referee) {
        var winningMove = this.getWinningMove(playerIndex, position);
        var option;
        if (winningMove != null) {
            option = winningMove;
            console.log("Found a winning move!");
        } else {
            var options = position.getOptionsForPlayer(playerIndex);
            var randomIndex = Math.floor(Math.random() * options.length);
            option = options[randomIndex];
        }
        window.setTimeout(function () { referee.moveTo(option); }, this.delayMilliseconds);
    }

    ,/**
     * Returns a winning move.
     */
    getWinningMove: function (playerIndex, position) {
        var options = position.getOptionsForPlayer(playerIndex);
        var opponentHasWinningMove = false;
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var otherWins = this.playerCanWin(1 - playerIndex, option, 1);
            if (otherWins == "maybe") {
                //do nothing
            } else if (otherWins == false) {
                return option;
            }
        }
        return null;
    }

    ,/**
     * Returns whether a player can win, given the depth.  Can return a boolean or "maybe".
     */
    playerCanWin: function (playerIndex, position, depth) {
        if (depth > this.maxDepth) {
            //console.log("Hit max search depth.");
            return "maybe";
        }
        var maybeWins = false;
        var options = position.getOptionsForPlayer(playerIndex);
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var otherWins = this.playerCanWin(1 - playerIndex, option, depth + 1);
            if (otherWins == "maybe") {
                maybeWins = true;
            } else if (!otherWins) {
                return true;
            }
        }
        if (maybeWins) {
            return "maybe";
        } else {
            return false;
        }

    }

});

/**
 * Gets a radio group of buttons for a player's controller options.
 * namesAndPlayerOptions might just be a list of strings.  In that case, we leave it alone.  Otherwise, each element is a pair [Name, Player].  TODO: should we make these player-creation-functions?
 */
function getRadioPlayerOptions(playerId, namesAndPlayerOptions, defaultId) {
    namesAndPlayerOptions = namesAndPlayerOptions || ["Human", "Random", "Very Easy AI", "Easy AI", "Medium AI", "Tricky AI (slow)", "Hard AI (very slow)"];
    var playerName;
    var defaultIndex = defaultId;
    if (playerId == CombinatorialGame.prototype.LEFT) {
        playerName = "left";
        if (defaultId == undefined) {
            defaultIndex = 0;
        }
    } else if (playerId == CombinatorialGame.prototype.RIGHT) {
        playerName = "right";
        if (defaultId == undefined) {
            defaultIndex = 0;
        }
    } else {
        console.log("getRadioPlayerOptions got an incorrect playerId");
    }
    var playerNames;
    var players = [];
    //let's fix the playerOptions if they're broken
    if (typeof namesAndPlayerOptions[0] == 'string') {
        playerNames = namesAndPlayerOptions;
        for (var i = 0; i < playerNames.length; i++) {
            const name = playerNames[i];
            if (name == "Human") {
                players.push("new HumanPlayer(viewFactory)");
            } else if (name == "Random") {
                players.push("new RandomPlayer(1000)");
            } else if (name == "Very Easy AI") {
                players.push("new DepthSearchPlayer(1000, 1)");
            } else if (name == "Easy AI") {
                players.push("new DepthSearchPlayer(1000, 2)");
            } else if (name == "Medium AI") {
                players.push("new DepthSearchPlayer(1000, 3)");
            } else if (name.startsWith("Tricky AI")) {
                players.push("new DepthSearchPlayer(1000, 4)");
            } else if (name.startsWith("Hard AI")) {
                players.push("new DepthSearchPlayer(1000, 5)");
            } else {
                console.log("Didn't see an appropriate player name!!!");
                players.push("monkey");
            }
        }
    } else {
        //it's a list
        playerNames = [];
        //console.log("Splitting the player list.");
        for (var i = 0; i < namesAndPlayerOptions.length; i++) {
            playerNames.push(namesAndPlayerOptions[i][0]);
            players.push(namesAndPlayerOptions[i][1]);
        }
        //console.log(players);
    }
    return createRadioGroup(playerName + "Player", playerNames, defaultIndex, players); // "Professional (hangs your browser)"
}

/**
 * Gets an HTML Element for 1-d board sizes.
 */
function createBasicOneDimensionalSizeOptions(minSize, maxSize, defaultSize, ruleset) {
    defaultSize = defaultSize || (minSize + maxSize) / 2;
    ruleset = ruleset || CombinatorialGame;
    var leftName = ruleset.prototype.PLAYER_NAMES[0];
    var rightName = ruleset.prototype.PLAYER_NAMES[1];

    var container = document.createElement("div");

    var sizeElement = document.createDocumentFragment();
    var sizeRange = createRangeInput(minSize, maxSize, defaultSize, "boardSize");
    container.appendChild(createGameOptionDiv("Size", sizeRange));

    //duplicated code from createBasicGridGameOptions
    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(" + leftName + " plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv(leftName + ":", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv(rightName + ":", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.style.fontSize = "large";
    startButton.onclick = newGame;
    container.appendChild(startButton);
    //end duplicated code.

    return container;
}

/**
 * Gets an HTML Element containing the basic game options for a 2-dimensional grid.
 */
function createBasicGridGameOptions(minWidth, maxWidth, defaultWidth, minHeight, maxHeight, defaultHeight, ruleset) {
    //do some normalization for games with only one size parameter (e.g. Atropos)
    minHeight = minHeight || minWidth;
    maxHeight = maxHeight || maxWidth;
    defaultHeight = defaultHeight || defaultWidth;

    ruleset = ruleset || CombinatorialGame;
    var leftName = ruleset.prototype.PLAYER_NAMES[0];
    var rightName = ruleset.prototype.PLAYER_NAMES[1];

    var container = document.createElement("div");

    var widthElement = document.createDocumentFragment();
    var widthRange = createRangeInput(minWidth, maxWidth, defaultWidth, "boardWidth");
    container.appendChild(createGameOptionDiv("Width", widthRange));

    var heightElement = document.createDocumentFragment();
    var heightRange = createRangeInput(minHeight, maxHeight, defaultHeight, "boardHeight");
    container.appendChild(createGameOptionDiv("Height", heightRange));

    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(" + leftName + " plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv(leftName + ":", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv(rightName + ":", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.style.fontSize = "large";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}


/**
 * Returns a button to start the game.
 */
function createStartButton() {
    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.style.fontSize = "large";
    startButton.onclick = newGame;
    return startButton;
}



/**
 * Gets an HTML Element containing the basic game options for a 2-dimensional grid.
 */
function createBasicGridGameOptionsForNoCanDo(minWidth, maxWidth, defaultWidth, minHeight, maxHeight, defaultHeight) {
    //do some normalization for games with only one size parameter (e.g. Atropos)
    minHeight = minHeight || minWidth;
    maxHeight = maxHeight || maxWidth;
    defaultHeight = defaultHeight || defaultWidth;

    var container = document.createElement("div");

    var widthElement = document.createDocumentFragment();
    var widthRange = createRangeInput(minWidth, maxWidth, defaultWidth, "boardWidth");
    container.appendChild(createGameOptionDiv("Width", widthRange));

    var heightElement = document.createDocumentFragment();
    var heightRange = createRangeInput(minHeight, maxHeight, defaultHeight, "boardHeight");
    container.appendChild(createGameOptionDiv("Height", heightRange));

    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(Vertical plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv("Vertical:", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv("Horizontal:", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}

/**
 * Gets an HTML Element containing the basic game options for a 2-dimensional grid.
 */
function createBasicGridGameOptionsForConnectFour(minWidth, maxWidth, defaultWidth, minHeight, maxHeight, defaultHeight) {
    //do some normalization for games with only one size parameter (e.g. Atropos)
    minHeight = minHeight || minWidth;
    maxHeight = maxHeight || maxWidth;
    defaultHeight = defaultHeight || defaultWidth;

    var container = document.createElement("div");

    var widthElement = document.createDocumentFragment();
    var widthRange = createRangeInput(minWidth, maxWidth, defaultWidth, "boardWidth");
    container.appendChild(createGameOptionDiv("Width", widthRange));

    var heightElement = document.createDocumentFragment();
    var heightRange = createRangeInput(minHeight, maxHeight, defaultHeight, "boardHeight");
    container.appendChild(createGameOptionDiv("Height", heightRange));

    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(Yellow plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv("Yellow:", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv("Red:", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}

/**
 * Gets an HTML Element containing the basic game options for a 2-dimensional grid.
 */
function createBasicGridGameOptionsForManalath(minWidth, maxWidth, defaultWidth, minHeight, maxHeight, defaultHeight) {
    //do some normalization for games with only one size parameter (e.g. Atropos)
    minHeight = minHeight || minWidth;
    maxHeight = maxHeight || maxWidth;
    defaultHeight = defaultHeight || defaultWidth;

    var container = document.createElement("div");

    var widthElement = document.createDocumentFragment();
    var widthRange = createRangeInput(minWidth, maxWidth, defaultWidth, "boardWidth");
    container.appendChild(createGameOptionDiv("Width", widthRange));

    var heightElement = document.createDocumentFragment();
    var heightRange = createRangeInputForManalath(minHeight, maxHeight, defaultHeight, "boardHeight");
    container.appendChild(createGameOptionDiv("Height", heightRange));

    const playerOptions = [["Human", "new HumanPlayer(viewFactory)"],
    ["Random", "new RandomPlayer(1000)"],
    ["Very Easy", "new MCTSPlayer(3, 1000)"],
    ["Easy", "new MCTSPlayer(10, 1000)"],
    ["Medium (Slow)", "new MCTSPlayer(100, 1000)"],
    ["Hard (Very Slow)", "new MCTSPlayer(250, 1000)"],
    ["Very Hard (Extremely slow; may hang browser.)", "new MCTSPlayer(750, 1000)"]
    ];

    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(Blue plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT, playerOptions, 0);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv("Blue:", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT, playerOptions, 0);
    container.appendChild(createGameOptionDiv("Red:", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}

/**
 * Creates an input range element.
 * TODO: move to paithanLibraries
 */
function createRangeInput(min, max, defaultValue, id, step) {
    const sliderStep = step || 1;
    var slider = new PaitSlider(min, max, sliderStep, defaultValue, id);
    return slider.toElement();
    /*
    var range = document.createElement("input");
    range.type = "range";
    range.min = min;
    range.max = max;
    range.value = defaultValue;
    if (id != undefined) {
        range.id = id;
    }
    return range;
    */
}

/**
 * Creates an input range element.
 * TODO: move to paithanLibraries
 */
function createRangeInputForManalath(min, max, defaultValue, id) {
    var slider = new PaitSlider(min, max, 2, defaultValue, id);
    return slider.toElement();
    /*
    var range = document.createElement("input");
    range.type = "range";
    range.min = min;
    range.max = max;
    range.value = defaultValue;
    if (id != undefined) {
        range.id = id;
    }
    return range;
    */
}

/**
 * Creates a radio group.  Values will be indexes.
 * TODO: move to paithanLibraries
 */
function createRadioGroup(name, descriptions, initiallyCheckedIndex, values) {
    values = values || Array.from(Array(descriptons.length).keys());
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < descriptions.length; i++) {
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = String(values[i]);
        //console.log("value set: " + radio.value);
        if (i == initiallyCheckedIndex) {
            radio.checked = true;
        }
        fragment.appendChild(radio);
        fragment.appendChild(document.createTextNode(descriptions[i]));
        fragment.appendChild(document.createElement("br"));
    }
    return fragment;
}

/**
 * Creates a game option control Element.
 */
function createGameOptionDiv(titleString, inputElement) {
    var gameOption = document.createElement("div");
    gameOption.className = "gameOption";
    var titleElement = document.createElement("div");
    gameOption.appendChild(titleElement);
    titleElement.className = "controlTitle";
    titleElement.appendChild(document.createTextNode(titleString));
    gameOption.appendChild(inputElement);
    return gameOption;
}

/**
 * Shows the rules for the game.
 */
function showRules(event) {
    $('rules').appendChild(document.createTextNode(rulesText));
    event.target.onclick = hideRules;
    event.target.innerHTML = "Hide Rules";
}

/**
 * Hides the rules for the current game.
 */
function hideRules(event) {
    removeAllChildren($('rules'));
    event.target.onclick = showRules;
    event.target.innerHTML = "Show";
}


function getCommonMCTSOptions(viewFactory, delay, lowAIDifficulty, highAIDifficulty) {
    var highAI = highAIDifficulty || 7;
    var lowAI = lowAIDifficulty || 1;
    var playDelay = delay || 1000;
    var playerOptions = [new HumanPlayer(viewFactory), new RandomPlayer(playDelay)];
    for (var i = lowAI; i <= highAI; i++) {
        playerOptions.push(new MCTSPlayer(playDelay));
    }
    return playerOptions;
};


/**
 * Creates a Monte Carlo Tree-Search player.
 * Author: Raymond Riddell.  (Slight changes by Kyle Burke.)
 */
const MCTSPlayer = Class.create(ComputerPlayer, {

    /**
     * Constructor
     * numTrials is the maximum number of rollouts the player will do
     * The delay doesn't work!  There's no way to pause a fruitful function.
     */
    initialize: function (numTrials, delay, randomTrialsSearchDepth, verbose) {
        this.maxNumTrials = numTrials || 10;
        this.delayMilliseconds = delay || 100;
        this.randomTrialsSearchDepth = randomTrialsSearchDepth || 1;
        this.verbose = verbose;
        if (this.verbose == undefined) {
            this.verbose = false;
        }
    },

    givePosition: function (playerIndex, position, referee) {
        var head = new MCTSNode(position, null, null, 0, 0, playerIndex);
        const startHead = head;
        const depthPlayer = new DepthSearchPlayer(1, this.randomTrialsSearchDepth);
        //console.log(head);
        var current = head;
        // Variable to keep track of number of iterations through MCTS
        var resource = 0;
        // Actual MCTS
        const differenceToPrint = 5;
        var priorPercentage = -differenceToPrint;
        //console.log("maxNumTrials: " + this.maxNumTrials);
        while (resource < this.maxNumTrials) {
            //print out a message to the console about the progress so far
            if (this.verbose) {
                const currentPercentage = Math.floor(100 * (resource + 1) / this.maxNumTrials);
                if (currentPercentage >= priorPercentage + differenceToPrint) {
                    priorPercentage = currentPercentage;
                    console.log("Thinking... " + currentPercentage + '% complete...');
                }
            }
            // If the current position has no children
            if (current.getChildren() == null) {
                // If the current position has never been sampled
                if (current.getTimesSampled() == 0) {
                    // Rollout on current, determining whether rollout resulted in a win or loss
                    var value = this.rollout(current);
                    // Backpropagate up the tree, increasing the number of times sampled by one and the value of the states by the value of the rollout
                    current.backPropagate(value);
                    resource += 1;
                    current = head;
                    continue;
                }
                // If the current node has no children, but has been sampled before
                else {
                    // Get all of the next available moves from the current board state
                    //var childrenAsPositions = current.position.getOptionsForPlayer(current.getPlayerIndex()); 
                    var childrenAsPositions = depthPlayer.getBestMovesFrom(current.getPlayerIndex(), current.position).getMoves();
                    // If there are no available moves, do a "fake" rollout
                    if (childrenAsPositions.length == 0) {
                        //console.log("TEST");
                        var value = this.rollout(current);
                        if (value != current.getPlayerIndex()) {
                            console.log("Didn't get the correct player!");
                        }
                        current.backPropagate(value);
                        resource += 1;
                        current = head;
                        continue;
                    }
                    // Convert them bitches to nodes(respectfully)
                    else {
                        var childrenAsNodes = new Array();
                        for (var i = 0; i < childrenAsPositions.length; i++) {
                            var tempNode = new MCTSNode(childrenAsPositions[i], current, null, 0, 0);
                            childrenAsNodes.push(tempNode);
                        }
                        current.setChildren(childrenAsNodes);
                        // Because all these new children have never been sampled before, their UCB1 values are all infinite, so we just pick the first one
                        var child = current.getChildren()[0];
                        // Autobots! Roll out!
                        var value = this.rollout(child);
                        // Backpropagate the results up the tree
                        current.backPropagate(value);
                        resource += 1;
                        current = head;
                        continue;
                    }
                }
            }
            // If the current node has children
            else {
                // Calculate the UCB1 values of all of the children
                var ucb1 = new Array();

                for (var i = 0; i < current.getChildren().length; i++) {
                    // If the current child node has never been sampled before, its UCB1 value is considered infinite
                    if (current.getChildren()[i].getTimesSampled() == 0) {
                        ucb1.push(Infinity);
                    }
                    // Otherwise, do some fancy math
                    else {
                        ucb1.push((current.getChildren()[i].getValue() / current.getChildren()[i].getTimesSampled()) + (current.getChildren().length * Math.sqrt(Math.log(current.getTimesSampled()) / current.getChildren()[i].getTimesSampled())));
                    }
                }
                // Select the child with the highest UCB1 value to be the new current
                var max = 0;
                var maxIdx = 0;

                for (var i = 0; i < current.getChildren().length; i++) {
                    if (ucb1[i] > max) {
                        max = ucb1[i];
                        maxIdx = i;
                    }
                }

                current = current.getChildren()[maxIdx];
                continue;
            }
        }

        // Now that we've run MCTS, just return the child of root that has the highest average value (i.e. best winrate)

        var children = head.getChildren();
        /*
        if (children == null) {
            console.log(" x head == startHead?  " + head == startHead);
            console.log(" x position = current.position?  " + position.equals(current.position));
            console.log("Position:");
            console.log(position);
            console.log("num children: " + position.getOptionsForPlayer(playerIndex).length);
            console.log("current's num children: " + current.position.getOptionsForPlayer(playerIndex).length);
            console.log("head.getChildren().length: " + head.getChildren().length);
            children = [];
        }
        */
        var averages = new Array();

        for (var i = 0; i < children.length; i++) {
            var tempAvg = children[i].getValue() / children[i].getTimesSampled();
            averages.push(tempAvg);
        }
        var max = 0;
        var maxIdx = 0;

        for (var i = 0; i < averages.length; i++) {
            if (averages[i] > max) {
                max = averages[i];
                maxIdx = i;
            }
        }

        console.log("MCTS Player: \"I'm feeling " + Math.floor(100 * max) + "% confident about my move.\"");

        // Return the best move
        window.setTimeout(function () { referee.moveTo(children[maxIdx].getPosition());/*arrayForSemaphore[0] = true;*/ }, this.delayMilliseconds);
    },

    //makes random moves until the game ends, returning the index of the winning player
    rollout: function (current) {
        //const searchDepth = 2;
        //const player = new DepthSearchPlayer(1, searchDepth);
        var position = current.position;
        var playerIndex = current.getPlayerIndex();
        var options = position.getOptionsForPlayer(playerIndex);
        while (options.length > 0) {
            position = options[Math.floor(Math.random() * options.length)];
            //const bestMoves = player.getBestMovesFrom(playerIndex, position);
            //position = bestMoves.getMove();
            playerIndex = 1 - playerIndex;
            options = position.getOptionsForPlayer(playerIndex);
        }

        return playerIndex;
    }
})

var MCTSNode = Class.create({

    initialize: function (position, parent, children, timesSampled, value, playerIndex) {
        if (parent != null) {
            playerIndex = 1 - parent.getPlayerIndex();
        }
        this.position = position;               //Position = game class
        this.parent = parent;
        this.children = children;
        this.timesSampled = timesSampled;
        this.value = value;
        this.playerIndex = playerIndex;
    },

    //back propagate the winner up through all parents
    //value is a 1 if it was a win for the current player, 0 otherwise
    //refactored from above
    backPropagate: function (winnerIndex) {
        var value = winnerIndex == this.playerIndex ? 1 : 0;
        this.timesSampled++;
        this.value += value;
        if (this.parent != null) {
            this.parent.backPropagate(winnerIndex);
        }
    },

    getPosition: function () {
        return this.position;
    },

    getParent: function () {
        return this.parent;
    },

    getChildren: function () {
        return this.children;
    },

    getTimesSampled: function () {
        return this.timesSampled;
    },

    getValue: function () {
        return this.value;
    },

    setPosition: function (board) {
        this.position = board;
    },

    setParent: function (parent) {
        this.parent = parent;
    },

    setChildren: function (children) {
        this.children = children;
    },

    setTimesSampled: function (timesSampled) {
        this.timesSampled = timesSampled;
    },

    setValue: function (value) {
        this.value = value;
    },

    hasChildren: function () {
        return this.children == null;
    },

    getPlayerIndex: function () {
        return this.playerIndex;
    }
});




//creates a triangular grid graph of values.  Here there are straight rows and the columns go in and out zigzagged.  The even rows are shifted right; the odd to the left.
const TriangularGridGraph = Class.create({

    initialize: function (width, height, initValuesFunction) {
        this.initValuesFunction = initValuesFunction || ((col, row) => null);
        this.vertices = [];
        //still going to address the vertices by columns first.
        for (var i = 0; i < width; i++) {
            const column = [];
            this.vertices.push(column);
            for (var j = 0; j < height; j++) {
                column.push(initValuesFunction(i, j));
            }
        }
        this.width = width;
        this.height = height;
    }

    , isRowShiftedLeft: function (row) {
        return row % 2 == 1;
    }

    , isRowShiftedRight: function (row) {
        return row % 2 == 0;
    }

    , getValue: function (col, row) {
        return this.vertices[col][row];
    }

    , setValue: function (col, row, value) {
        this.vertices[col][row] = value;
    }

    , getNeighborValues: function (col, row) {
        const neighborValues = [];
        if (col > 0) {
            neighborValues.push(this.vertices[col - 1][row]);
        }
        if (col < this.width - 1) {
            neighborValues.push(this.vertices[col + 1][row]);
        }
        if (row > 0) {
            neighborValues.push(this.vertices[col][row - 1]);
            if (col > 0 && this.isRowShiftedLeft(row)) {
                neighborValues.push(this.vertices[col - 1][row - 1]);
            } else if (col < this.width - 1 && this.isRowShiftedRight(row)) {
                neighborValues.push(this.vertices[col + 1][row - 1]);
            }
        }
        if (row < this.height - 1) {
            neighborValues.push(this.vertices[col][row + 1]);
            if (col > 0 && this.isRowShiftedLeft(row)) {
                neighborValues.push(this.vertices[col - 1][row + 1]);
            } else if (col < this.width - 1 && this.isRowShiftedRight(row)) {
                neighborValues.push(this.vertices[col + 1][row + 1]);
            }
        }
        return neighborValues;
    }

    //creates a 1-level deep copy
    , clone: function () {
        var self = this;
        values = (col, row) => self.vertices[col][row];
        const copy = new TriangularGridGraph(this.width, this.height, values);
        return copy;
    }

    //checks whether equals
    , equals: function (other) {
        if (this.width != other.width || this.height != other.height) {
            return false;
        } else {
            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                    if (this.vertices[i][j] != other.vertices[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

});

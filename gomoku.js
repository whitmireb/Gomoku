
/**
 * Gomoku!
 * @authors: Brendan Whitmire.
 */

// omniEquals()

var Gomoku = Class.create(CombinatorialGame, {
    /**
     * Constructor.
     */

    initialize: function (size, spaces) {
        this.board = new Array();
        spaces = spaces || new Array();
        this.canPierule = false;
        for (var i = 0; i < spaces.length; i++) {
            this.board.push(new Array());
            for (var j = 0; j < spaces[i].length; j++) {
                this.board[i].push(spaces[i][j]);
            }
        }

        if (this.board.length == 0) {
            for (var i = 0; i < size; i++) {
                this.board.push(new Array());
                for (var j = 0; j < size; j++) {
                    this.board[i].push(" ")
                }
            }
        }
        this.playerNames = ["Black", "White"];
        this.size = size;

    },

    isFiveInRow: function (playerID) {
        for (var i = 0; i < this.size; i++) {
            var hcount = 0;
            var vcount = 0;
            for (var j = 0; j < this.size; j++) {
                if (this.board[i][j] === playerID) {
                    hcount += 1;
                    if (hcount > 4) {
                        return true;
                    }
                } else {
                    hcount = 0;
                }
                if (this.board[j][i] === playerID) {
                    vcount += 1;
                    if (vcount > 4) {
                        return true;
                    }
                } else {
                    vcount = 0;
                }
            }
        }

        // Check the diagonals
        for (var i = 0; i < this.size - 4; i++) {
            var ucount = 0;
            var dcount = 0;
            // Check the left to right diagonals
            for (var j = 0; j < this.size - i; j++) {
                if (this.board[i + j][j] === playerID) {
                    dcount += 1;
                    if (dcount > 4) {
                        return true;
                    }
                } else {
                    dcount = 0;
                }
                if (i != 0) {
                    if (this.board[j][i + j] === playerID) {
                        ucount += 1;
                        if (ucount > 4) {
                            return true;
                        }
                    } else {
                        ucount = 0;
                    }
                }

            }

            dcount = 0;
            ucount = 0;
            // Check the right to left diagonals
            for (var j = 0; j < this.size - i; j++) {
                if (this.board[i + j][this.size - j - 1] === playerID) {
                    dcount += 1;
                    if (dcount > 4) {
                        return true;
                    }
                } else {
                    dcount = 0;
                }
                if (i != 0) {
                    if (this.board[j][this.size - i - j - 1] === playerID) {
                        ucount += 1;
                        if (ucount > 4) {
                            return true;
                        }
                    } else {
                        ucount = 0;
                    }
                }

            }
        }

    },

    getOptionsForPlayer: function (playerID) {
        var options = new Array();

        if (this.isFiveInRow(1 - playerID)) {
            return options;
        }

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.board[i][j] === " ") {
                    options.push(this.getOptionForPosition(i, j, playerID));
                }
            }
        }

        if (this.canPierule) {
            options.push(this.negate());
        }

        return options;

    },

    getOptionForPosition: function (x, y, playerID) {
        // retuns a single board, if the player given would place a pieve at the location given
        var option = this.clone();
        if (option.board[x][y] === " ") {
            option.board[x][y] = playerID;
        }
        return option
    },

    equals: function (other) {
        if (this.size != other.size) {
            return false;
        }
        if (this.board.length != other.board.length) {
            return false
        }

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (!(this.board[i][j] === other.board[i][j])) {
                    return false;
                }
            }
        }
        return true;
    },

    negate: function () {
        negatedBoard = this.clone();
        for (var i = 0; i < negatedBoard.size; i++) {
            for (var j = 0; j < negatedBoard.size; j++) {
                if (negatedBoard.board[i][j] === 0) {
                    negatedBoard.board[i][j] = 1;
                } else if (negatedBoard.board[i][j] === 1) {
                    negatedBoard.board[i][j] = 0;
                }

            }
        }
        return negatedBoard;
    },

    clone: function () {
        return new Gomoku(this.size, this.board, this.pieruleCounter - 1);
    },

    toString: function () {
        return "Cheese burger";
    }

});

Gomoku.prototype.PLAYER_NAMES = ["Black", "White"];

var InteractiveGomokuView = Class.create({

    initialize: function (position) {
        this.position = position;
        this.selectedTile = undefined;
        this.popup = null;
    }

    ,/**
     * Draws the board and assigns the listener
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

        var size = this.position.size;
        const pixelsPerBoxWide = (canvasWidth - 20);
        const pixelsPerBoxHigh = (canvasHeight - 20);
        const backgroundSide = Math.min(pixelsPerBoxWide, pixelsPerBoxHigh);

        var background = document.createElementNS(svgNS, "rect");
        background.setAttributeNS(null, "x", String(5));
        background.setAttributeNS(null, "y", String(5));
        background.setAttributeNS(null, "width", String(backgroundSide));
        background.setAttributeNS(null, "height", String(backgroundSide));
        background.setAttributeNS(null, "id", "GomokuBackground");
        boardSvg.appendChild(background);

        // Draw the lines
        var gap = backgroundSide / (size + 1);
        for (var i = 1; i < size + 1; i++) {
            // Draw veticle line
            var line = document.createElementNS(svgNS, "rect");
            line.setAttributeNS(null, "x", String((i * gap) + 5));
            line.setAttributeNS(null, "y", String(5));
            line.setAttributeNS(null, "width", "2");
            line.setAttributeNS(null, "height", String(backgroundSide));
            line.setAttributeNS(null, "class", "gomokuLine");
            boardSvg.appendChild(line);

            // Draw horizontal line
            line = document.createElementNS(svgNS, "rect");
            line.setAttributeNS(null, "x", String(5));
            line.setAttributeNS(null, "y", String((i * gap) + 5));
            line.setAttributeNS(null, "width", String(backgroundSide));
            line.setAttributeNS(null, "height", "2");
            line.setAttributeNS(null, "class", "gomokuLine");
            boardSvg.appendChild(line);

            if (((i == 4 || i == size - 3) && size > 11) || ((i == 3 || i == size - 2) && size < 12)) {
                var dot = document.createElementNS(svgNS, "circle");
                dot.setAttributeNS(null, "cx", String((i * gap) + 5));
                dot.setAttributeNS(null, "cy", String((i * gap) + 5));
                dot.setAttributeNS(null, "r", String(gap / 6));
                dot.setAttributeNS(null, "class", "gomokuDot")
                boardSvg.appendChild(dot);

                dot = document.createElementNS(svgNS, "circle");
                dot.setAttributeNS(null, "cx", String((i * gap) + 5));
                dot.setAttributeNS(null, "cy", String(((size - i + 1) * gap) + 5));
                dot.setAttributeNS(null, "r", String(gap / 6));
                dot.setAttributeNS(null, "class", "gomokuDot")
                boardSvg.appendChild(dot);

                if (size % 2 == 1 && size > 13) {
                    dot = document.createElementNS(svgNS, "circle");
                    dot.setAttributeNS(null, "cx", String((i * gap) + 5));
                    dot.setAttributeNS(null, "cy", String(((Math.floor(size / 2) + 1) * gap) + 5));
                    dot.setAttributeNS(null, "r", String(gap / 6));
                    dot.setAttributeNS(null, "class", "gomokuDot")
                    boardSvg.appendChild(dot);

                    dot = document.createElementNS(svgNS, "circle");
                    dot.setAttributeNS(null, "cx", String(((Math.floor(size / 2) + 1) * gap) + 5));
                    dot.setAttributeNS(null, "cy", String((i * gap) + 5));
                    dot.setAttributeNS(null, "r", String(gap / 6));
                    dot.setAttributeNS(null, "class", "gomokuDot")
                    boardSvg.appendChild(dot);
                }
            }

            if (size % 2 == 1 && i == Math.floor(size / 2) + 1) {
                var dot = document.createElementNS(svgNS, "circle");
                dot.setAttributeNS(null, "cx", String((i * gap) + 5));
                dot.setAttributeNS(null, "cy", String((i * gap) + 5));
                dot.setAttributeNS(null, "r", String(gap / 6));
                dot.setAttributeNS(null, "class", "gomokuDot")
                boardSvg.appendChild(dot);
            }
        }

        // Draw the pieces
        var board = this.position.board;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    var piece = document.createElementNS(svgNS, "circle");
                    piece.setAttributeNS(null, "cx", String(((i + 1) * gap) + 5));
                    piece.setAttributeNS(null, "cy", String(((j + 1) * gap) + 5));
                    piece.setAttributeNS(null, "r", String(gap / 2.5));
                    piece.setAttributeNS(null, "class", "gomokuBlackPiece")
                    boardSvg.appendChild(piece);
                } else if (board[i][j] === 1) {
                    var piece = document.createElementNS(svgNS, "circle");
                    piece.setAttributeNS(null, "cx", String(((i + 1) * gap) + 5));
                    piece.setAttributeNS(null, "cy", String(((j + 1) * gap) + 5));
                    piece.setAttributeNS(null, "r", String(gap / 2.5));
                    piece.setAttributeNS(null, "class", "gomokuWhitePiece")
                    boardSvg.appendChild(piece);
                } else {
                    if (listener != undefined) {
                        var piece = document.createElementNS(svgNS, "circle");
                        piece.setAttributeNS(null, "cx", String(((i + 1) * gap) + 5));
                        piece.setAttributeNS(null, "cy", String(((j + 1) * gap) + 5));
                        piece.setAttributeNS(null, "r", String(gap / 2.5));
                        piece.setAttributeNS(null, "class", "gomokuFakePiece")
                        boardSvg.appendChild(piece);
                        var player = listener;
                        piece.column = i;
                        piece.row = j;
                        piece.onclick = function (event) { player.handleClick(event); }
                    }
                }
            }
        }


        if (listener != undefined && listener.referee.canPierule()) {
            var self = this;
            this.popup = document.createElement("div");
            var pieButton = document.createElement("button");
            pieButton.appendChild(toNode("ACTIVATE THE PIE RULE!!!"));
            pieButton.onclick = function () {
                // self.destroyPopup();
                self.position = self.position.negate();
                listener.referee.moveTo(self.position);
                self.draw(containerElement, listener);
            }
            this.popup.appendChild(pieButton);
            this.popup.style.position = "relative";
            this.popup.style.display = "block";
            this.popup.style.opacity = 1;
            this.popup.width = Math.min(window.innerWidth / 2, 100);
            this.popup.height = Math.min(window.innerHeight / 2, 50);
            containerElement.appendChild(this.popup);
        }

    }

    /**
     * Destroys the popup color window.
     */
    // , destroyPopup: function () {
    //     if (this.popup != null) {
    //         this.popup.parentNode.removeChild(this.popup);
    //         this.selectedElement = undefined;
    //         this.popup = null;
    //     }
    // }

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
        nextPosition = this.position.getOptionForPosition(column, row, currentPlayer);
        return nextPosition;
    }

    ,/**
     * Handles a mouse click.
     */
    getNextPositionFromClick: function (event, currentPlayer, containerElement) {
        var clickedTile = event.target;
        var nextPosition = this.getNextPositionFromElementLocations(clickedTile, containerElement, currentPlayer);
        // this.deselectTile();
        return nextPosition;
    }
});  //end of InteractiveSVGGomokuView

var InteractiveGomokuViewFactory = Class.create({
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
        return new InteractiveGomokuView(position);
    }

    ,/**
     * Returns a view.
     */
    getView: function (position) {
        return this.getInteractiveBoard(position);
    }

}); //end of InteractiveSVGGomokuViewFactory

function createBasicGridGameOptionsForGomoku(minSize, maxSize, defaultSize) {

    var container = document.createElement("div");

    var sizeElement = document.createDocumentFragment();
    var sizeRange = createRangeInput(minSize, maxSize, defaultSize, "boardSize");
    container.appendChild(createGameOptionDiv("Size", sizeRange));

    var leftPlayerElement = document.createDocumentFragment();
    leftPlayerElement.appendChild(document.createTextNode("(Black plays first.)"));
    leftPlayerElement.appendChild(document.createElement("br"));
    var leftRadio = getRadioPlayerOptions(CombinatorialGame.prototype.LEFT);
    leftPlayerElement.appendChild(leftRadio);
    container.appendChild(createGameOptionDiv("Black:", leftPlayerElement));

    var rightRadio = getRadioPlayerOptions(CombinatorialGame.prototype.RIGHT);
    container.appendChild(createGameOptionDiv("White:", rightRadio));

    var startButton = document.createElement("input");
    startButton.type = "button";
    startButton.id = "starter";
    startButton.value = "Start Game";
    startButton.onclick = newGame;
    container.appendChild(startButton);

    return container;
}

function newGomokuGame() {
    var viewFactory = new InteractiveGomokuViewFactory();
    var playDelay = 1000;
    var size = parseInt($('boardSize').value);
    var controlForm = $('gameOptions');
    const leftPlayerCreationString = getSelectedRadioValue(controlForm.elements['leftPlayer']);
    var leftPlayer = eval(leftPlayerCreationString);
    var rightPlayer = eval(getSelectedRadioValue(controlForm.elements['rightPlayer']));
    var players = [leftPlayer, rightPlayer];
    var game = new Gomoku(size);
    var ref = new Referee(game, players, viewFactory, "MainGameBoard", $('messageBox'), controlForm, undefined, undefined, true);
};

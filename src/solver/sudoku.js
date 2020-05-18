/*
    Sudoku.js
    ---------
    A Sudoku puzzle generator and solver JavaScript library.
    Please see the README for more details.
*/

//(function(root){
    //var sudoku = root.sudoku = {};  // Global reference to the sudoku library
    var sudoku = {};
    sudoku.DIGITS = "123456789";    // Allowed sudoku.DIGITS
    var ROWS = "ABCDEFGHI";         // Row lables
    var COLS = sudoku.DIGITS;       // Column lables
    var SQUARES = null;             // Square IDs

    var UNITS = null;               // All units (row, column, or box)
    var SQUARE_UNITS_MAP = null;    // Squares -> units map
    var SQUARE_PEERS_MAP = null;    // Squares -> peers map

    var MIN_GIVENS = 17;            // Minimum number of givens
    var NR_SQUARES = 81;            // Number of squares

    // Define difficulties by how many squares are given to the player in a new
    // puzzle.
    var DIFFICULTY = {
        "easy":         65,
        "medium":       55,
        "hard":         45,
        "very-hard":    35,
        "insane":       25,
        "inhuman":      15,
    };

    // Blank character and board representation
    sudoku.BLANK_CHAR = '.';
    sudoku.BLANK_BOARD = "...................................................."+
            ".............................";

    // Init
    // -------------------------------------------------------------------------
    function initialize(){
        /* Initialize the Sudoku library (invoked after library load)
        */
        SQUARES             = sudoku._cross(ROWS, COLS);
        UNITS               = sudoku._get_all_units(ROWS, COLS);
        SQUARE_UNITS_MAP    = sudoku._get_square_units_map(SQUARES, UNITS);
        SQUARE_PEERS_MAP    = sudoku._get_square_peers_map(SQUARES,
                                    SQUARE_UNITS_MAP);
    }

     // Generate
    // -------------------------------------------------------------------------
    sudoku.generate = function(difficulty, unique){
        /* Generate a new Sudoku puzzle of a particular `difficulty`, e.g.,
            // Generate an "easy" sudoku puzzle
            sudoku.generate("easy");
        Difficulties are as follows, and represent the number of given squares:
                "easy":         65
                "medium":       55
                "hard":         45
                "very-hard":    35
                "insane":       25
                "inhuman":      15
        You may also enter a custom number of squares to be given, e.g.,
            // Generate a new Sudoku puzzle with 60 given squares
            sudoku.generate(60)
        `difficulty` must be a number between 17 and 81 inclusive. If it's
        outside of that range, `difficulty` will be set to the closest bound,
        e.g., 0 -> 17, and 100 -> 81.
        By default, the puzzles are unique, uless you set `unique` to false.
        (Note: Puzzle uniqueness is not yet implemented, so puzzles are *not*
        guaranteed to have unique solutions)
        TODO: Implement puzzle uniqueness
        */
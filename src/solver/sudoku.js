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

         // If `difficulty` is a string or undefined, convert it to a number or
        // default it to "easy" if undefined.
        if(typeof difficulty === "string" || typeof difficulty === "undefined"){
            difficulty = DIFFICULTY[difficulty] || DIFFICULTY.easy;
        }

        // Force difficulty between 17 and 81 inclusive
        difficulty = sudoku._force_range(difficulty, NR_SQUARES + 1,
                MIN_GIVENS);

        // Default unique to true
        unique = unique || true;

        // Get a set of squares and all possible candidates for each square
        var blank_board = "";
        for(var i = 0; i < NR_SQUARES; ++i){
            blank_board += '.';
        }
        var candidates = sudoku._get_candidates_map(blank_board);

        // For each item in a shuffled list of squares
        var shuffled_squares = sudoku._shuffle(SQUARES);
        for(var si in shuffled_squares){
            var square = shuffled_squares[si];

            // If an assignment of a random chioce causes a contradictoin, give
            // up and try again
            var rand_candidate_idx =
                    sudoku._rand_range(candidates[square].length);
            var rand_candidate = candidates[square][rand_candidate_idx];
            if(!sudoku._assign(candidates, square, rand_candidate)){
                break;
            }

            // Make a list of all single candidates
            var single_candidates = [];
            for(si in SQUARES){
                square = SQUARES[si];

                if(candidates[square].length === 1){
                    single_candidates.push(candidates[square]);
                }
            }

            // If we have at least difficulty, and the unique candidate count is
            // at least 8, return the puzzle!
            if(single_candidates.length >= difficulty &&
                    sudoku._strip_dups(single_candidates).length >= 8){
                var board = "";
                var givens_idxs = [];
                for(i in SQUARES){
                    square = SQUARES[i];
                    if(candidates[square].length === 1){
                        board += candidates[square];
                        givens_idxs.push(i);
                    } else {
                        board += sudoku.BLANK_CHAR;
                    }
                }

                // If we have more than `difficulty` givens, remove some random
                // givens until we're down to exactly `difficulty`
                var nr_givens = givens_idxs.length;
                if(nr_givens > difficulty){
                    givens_idxs = sudoku._shuffle(givens_idxs);
                    for(i = 0; i < nr_givens - difficulty; ++i){
                        var target = parseInt(givens_idxs[i]);
                        board = board.substr(0, target) + sudoku.BLANK_CHAR +
                            board.substr(target + 1);
                    }
                }

                // Double check board is solvable
                // TODO: Make a standalone board checker. Solve is expensive.
                if(sudoku.solve(board)){
                    return board;
                }
            }
        }

         // Give up and try a new puzzle
         return sudoku.generate(difficulty);
        };
    
        // Solve
        // -------------------------------------------------------------------------
        sudoku.solve = function(board, reverse){
            /* Solve a sudoku puzzle given a sudoku `board`, i.e., an 81-character
            string of sudoku.DIGITS, 1-9, and spaces identified by '.', representing the
            squares. There must be a minimum of 17 givens. If the given board has no
            solutions, return false.
            Optionally set `reverse` to solve "backwards", i.e., rotate through the
            possibilities in reverse. Useful for checking if there is more than one
            solution.
            */
    
            // Assure a valid board
            var report = sudoku.validate_board(board);
            if(report !== true){
                throw report;
            }
    
            // Check number of givens is at least MIN_GIVENS
            var nr_givens = 0;
            for(var i in board){
                if(board[i] !== sudoku.BLANK_CHAR && sudoku._in(board[i], sudoku.DIGITS)){
                    ++nr_givens;
                }
            }
            if(nr_givens < MIN_GIVENS){
                // eslint-disable-next-line
                throw "Too few givens. Minimum givens is " + MIN_GIVENS;
            }
    
            // Default reverse to false
            reverse = reverse || false;
    
            var candidates = sudoku._get_candidates_map(board);
            var result = sudoku._search(candidates, reverse);
    
            if(result){
                var solution = "";
                for(var square in result){
                    solution += result[square];
                }
                return solution;
            }
            return false;
        };
    
        sudoku.get_candidates = function(board){
            /* Return all possible candidatees for each square as a grid of
            candidates, returnning `false` if a contradiction is encountered.
            Really just a wrapper for sudoku._get_candidates_map for programmer
            consumption.
            */
    
            // Assure a valid board
            var report = sudoku.validate_board(board);
            if(report !== true){
                throw report;
            }
    
            // Get a candidates map
            var candidates_map = sudoku._get_candidates_map(board);
    
            // If there's an error, return false
            if(!candidates_map){
                return false;
            }
    
            // Transform candidates map into grid
            var rows = [];
            var cur_row = [];
            var i = 0;
            for(var square in candidates_map){
                var candidates = candidates_map[square];
                cur_row.push(candidates);
                if(i % 9 === 8){
                    rows.push(cur_row);
                    cur_row = [];
                }
                ++i;
            }
            return rows;
        }
    
        sudoku._get_candidates_map = function(board){
            /* Get all possible candidates for each square as a map in the form
            {square: sudoku.DIGITS} using recursive constraint propagation. Return `false`
            if a contradiction is encountered
            */
    
            // Assure a valid board
            var report = sudoku.validate_board(board);
            if(report !== true){
                throw report;
            }
    
            var candidate_map = {};
            var squares_values_map = sudoku._get_square_vals_map(board);
    
            // Start by assigning every digit as a candidate to every square
            for(var si in SQUARES){
                candidate_map[SQUARES[si]] = sudoku.DIGITS;
            }
    
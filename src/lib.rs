use rand::prelude::*;
use wasm_bindgen::prelude::*;

const WIDTH: usize = 3;
const HEIGHT: usize = 3;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Cell {
    Blank,
    X,
    O,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Game {
    grid: [Cell; WIDTH * HEIGHT],
    turn_o: bool,
    rng: rand::rngs::SmallRng,
}

impl Game {
    // Minimax search to find best move for current player
    // Returns (usize, usize, winner)
    fn get_best_move(&self) -> (usize, usize, Cell) {
        assert!(self.has_winner().is_none());
        let mut best_x = 0;
        let mut best_y = 0;
        let mut best_winner = None;
        for y in 0..HEIGHT {
            for x in 0..WIDTH {
                let idx = Self::xy_to_index(x, y);
                if self.grid[idx] != Cell::Blank {
                    continue;
                }

                let mut next_game = self.clone();
                next_game.grid[idx] = {
                    if self.turn_o {
                        Cell::O
                    } else {
                        Cell::X
                    }
                };
                next_game.turn_o = !self.turn_o;
                let winner = if let Some(w) = next_game.has_winner() {
                    w
                } else {
                    next_game.get_best_move().2
                };
                if let Some(best) = best_winner {
                    if self.turn_o {
                        if (winner == Cell::O && best != Cell::O)
                            || (winner == Cell::Blank && best == Cell::X)
                        {
                            best_winner = Some(winner);
                            best_x = x;
                            best_y = y;
                        }
                    } else {
                        if (winner == Cell::X && best != Cell::X)
                            || (winner == Cell::Blank && best == Cell::O)
                        {
                            best_winner = Some(winner);
                            best_x = x;
                            best_y = y;
                        }
                    }
                } else {
                    best_winner = Some(winner);
                    best_x = x;
                    best_y = y;
                }
            }
        }

        assert!(best_winner.is_some());
        (best_x, best_y, best_winner.unwrap())
    }

    // Plays poorly. Explicitly bad first moves and
    // then random plays other than moves that block
    // the opponent winning 50% of the time.
    fn get_mediocre_move(&mut self) -> (usize, usize, Cell) {
        // See if we're on the first turn for the current player.
        let mut num_x = 0;
        let mut num_o = 0;
        for i in 0..WIDTH * HEIGHT {
            match self.grid[i] {
                Cell::Blank => (),
                Cell::X => {
                    num_x += 1;
                }
                Cell::O => {
                    num_o += 1;
                }
            }
        }

        if num_x == 0 && num_o == 0 {
            assert!(!self.turn_o);
            return (2, 1, Cell::Blank);
        }

        if num_x == 1 && num_o == 0 {
            assert!(self.turn_o);
            if self.grid[Self::xy_to_index(1, 0)] == Cell::Blank {
                return (2, 1, Cell::Blank);
            } else {
                return (1, 2, Cell::Blank);
            }
        }

        // Any potential wins for the opponent?
        if self.rng.gen_bool(0.5) {
            for y in 0..HEIGHT {
                for x in 0..WIDTH {
                    let idx = Self::xy_to_index(x, y);
                    if self.grid[idx] != Cell::Blank {
                        continue;
                    }

                    let mut next_board = self.clone();
                    next_board.grid[idx] = if self.turn_o { Cell::X } else { Cell::O };
                    if next_board.has_winner().is_some() {
                        return (x, y, Cell::Blank);
                    }
                }
            }
        }

        // Just take the first empty spot.
        for y in 0..HEIGHT {
            for x in 0..WIDTH {
                let idx = Self::xy_to_index(x, y);
                if self.grid[idx] == Cell::Blank {
                    return (x, y, Cell::Blank);
                }
            }
        }

        panic!("Unreachable!");
    }
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Game {
        Self {
            grid: [Cell::Blank; WIDTH * HEIGHT],
            turn_o: false,
            rng: rand::rngs::SmallRng::from_entropy(),
        }
    }

    pub fn cells(&self) -> *const Cell {
        self.grid.as_ptr()
    }

    pub fn get_cell(&self, x: usize, y: usize) -> Cell {
        self.grid[Self::xy_to_index(x, y)]
    }

    pub fn xy_to_index(x: usize, y: usize) -> usize {
        y * WIDTH + x
    }

    pub fn has_winner(&self) -> Option<Cell> {
        for x in 0..WIDTH {
            let maybe_winner = self.grid[Self::xy_to_index(x, 0)];
            if maybe_winner == Cell::Blank {
                continue;
            }
            if self.grid[Self::xy_to_index(x, 1)] != maybe_winner {
                continue;
            }
            if self.grid[Self::xy_to_index(x, 2)] == maybe_winner {
                return Some(maybe_winner);
            }
        }

        for y in 0..WIDTH {
            let maybe_winner = self.grid[Self::xy_to_index(0, y)];
            if maybe_winner == Cell::Blank {
                continue;
            }
            if self.grid[Self::xy_to_index(1, y)] != maybe_winner {
                continue;
            }
            if self.grid[Self::xy_to_index(2, y)] == maybe_winner {
                return Some(maybe_winner);
            }
        }

        let maybe_winner = self.grid[Self::xy_to_index(0, 0)];
        if maybe_winner != Cell::Blank {
            if self.grid[Self::xy_to_index(1, 1)] == maybe_winner
                && self.grid[Self::xy_to_index(2, 2)] == maybe_winner
            {
                return Some(maybe_winner);
            }
        }

        let maybe_winner = self.grid[Self::xy_to_index(0, 2)];
        if maybe_winner != Cell::Blank {
            if self.grid[Self::xy_to_index(1, 1)] == maybe_winner
                && self.grid[Self::xy_to_index(2, 0)] == maybe_winner
            {
                return Some(maybe_winner);
            }
        }

        for c in self.grid {
            if c == Cell::Blank {
                return None;
            }
        }
        Some(Cell::Blank)
    }

    pub fn do_user_move(&mut self, x: usize, y: usize) {
        assert!(self.grid[Self::xy_to_index(x, y)] == Cell::Blank);
        assert!(self.has_winner().is_none());
        self.grid[Self::xy_to_index(x, y)] = {
            if self.turn_o {
                Cell::O
            } else {
                Cell::X
            }
        };
        self.turn_o = !self.turn_o;
    }

    pub fn do_comp_move(&mut self, play_well: bool) {
        assert!(self.has_winner().is_none());
        let (x, y, _) = if play_well {
            self.get_best_move()
        } else {
            self.get_mediocre_move()
        };
        self.grid[Self::xy_to_index(x, y)] = {
            if self.turn_o {
                Cell::O
            } else {
                Cell::X
            }
        };
        self.turn_o = !self.turn_o;
    }
}

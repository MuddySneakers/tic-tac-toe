import init from "../pkg/tic_tac_toe.js";
import * as ttt from "../pkg/tic_tac_toe.js";
import wasm from "../pkg/tic_tac_toe.js";

const BANNER_Y = 100;
const BUTTON_RADII = 5;

const MENU_START_X = 80;
const MENU_START_Y = 120;
const MENU_FONT_SIZE = 70;
const MENU_OPTION_INDENT = 80;

const MENU_SEL_XO_WIDTH = 55;
const MENU_SEL_POORLY_WIDTH = 205;
const MENU_SEL_PERFECTLY_WIDTH = 290;
const MENU_SEL_HEIGHT = 65;
const MENU_SEL_X_OFFSET = 7;
const MENU_SEL_Y_OFFSET = -5;

const PLAY_BUTTON_TOP = 520;
const PLAY_BUTTON_HEIGHT = 70;
const PLAY_BUTTON_BOT = PLAY_BUTTON_TOP + PLAY_BUTTON_HEIGHT;
const PLAY_BUTTON_WIDTH = 230;
const PLAY_BUTTON_Y_OFFSET = 10;

const XO_BOT = MENU_START_Y + 2 * MENU_FONT_SIZE;
const XO_TOP =  XO_BOT - MENU_SEL_HEIGHT;

const X_LEFT = MENU_START_X + MENU_OPTION_INDENT;
const X_RIGHT = X_LEFT + MENU_FONT_SIZE;
const O_LEFT = X_LEFT + MENU_OPTION_INDENT;
const O_RIGHT = O_LEFT + MENU_FONT_SIZE;

const POORLY_LEFT = MENU_START_X + MENU_OPTION_INDENT;
const POORLY_BOT = MENU_START_Y + 4 * MENU_FONT_SIZE;
const POORLY_TOP = POORLY_BOT - MENU_SEL_HEIGHT;

const PERFECTLY_LEFT = MENU_START_X + MENU_OPTION_INDENT;
const PERFECTLY_BOT = MENU_START_Y + 5 * MENU_FONT_SIZE;
const PERFECTLY_TOP = PERFECTLY_BOT - MENU_SEL_HEIGHT;

const BOARD_WIDTH = 3;
const BOARD_HEIGHT = 3;

const canvas = document.getElementById('tictactoe-canvas');

const PLAY_BUTTON_LEFT = canvas.width / 2 - PLAY_BUTTON_WIDTH / 2;

const GAME_CELL_FONT_SIZE = 90;
const GAME_CELL_X = 100;
const GAME_CELL_Y = 100;
const GAME_BOARD_LEFT = canvas.width / 2 - BOARD_WIDTH * GAME_CELL_X / 2;
const GAME_BOARD_TOP = 150;
const GAME_CELL_TEXT_OFFSET_X = 25;
const GAME_CELL_TEXT_OFFSET_Y = 85;

const GAME_STMT_LEFT = 50;
const GAME_STMT_BOT = 550;

const GAME_AGAIN_LEFT = 350;
const GAME_AGAIN_BOT = 550;

const AGAIN_BUTTON_LEFT = 340;
const AGAIN_BUTTON_TOP = 485;
const AGAIN_BUTTON_WIDTH = 233;
const AGAIN_BUTTON_HEIGHT = 70;

var user_is_o = false;
var comp_is_perfect = true;

var in_game = false;
var game_state = null;

function drawBanner(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.font = "100px ChalkboardFont";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Tic-Tac-Toe", canvas.width/2, BANNER_Y);
}

function setUserAsX() {
    user_is_o = false;
    menu_button_status[0].outline = true;
    menu_button_status[1].outline = false;
}

function setUserAsO() {
    user_is_o = true;
    menu_button_status[0].outline = false;
    menu_button_status[1].outline = true;
}

function setCompAsPoorly() {
    comp_is_perfect = false;
    menu_button_status[2].outline = true;
    menu_button_status[3].outline = false;
}

function setCompAsPerfectly() {
    comp_is_perfect = true;
    menu_button_status[2].outline = false;
    menu_button_status[3].outline = true;
}

function startGame() {
    in_game = true;
    game_state = ttt.Game.new();
    if (user_is_o) {
        game_state.do_comp_move(comp_is_perfect);
    }
}

const MENU_BUTTONS = [
    { label: "X", x: X_LEFT, y: XO_TOP, w: MENU_SEL_XO_WIDTH, h: MENU_SEL_HEIGHT, on_click: setUserAsX },
    { label: "O", x: O_LEFT, y: XO_TOP, w: MENU_SEL_XO_WIDTH, h: MENU_SEL_HEIGHT, on_click: setUserAsO },
    { label: "Poorly", x: POORLY_LEFT, y: POORLY_TOP, w: MENU_SEL_POORLY_WIDTH, h: MENU_SEL_HEIGHT, on_click: setCompAsPoorly },
    { label: "Perfectly", x: PERFECTLY_LEFT, y: PERFECTLY_TOP, w: MENU_SEL_PERFECTLY_WIDTH, h: MENU_SEL_HEIGHT, on_click: setCompAsPerfectly },
    { label: "Start!", x: PLAY_BUTTON_LEFT, y: PLAY_BUTTON_TOP, w: PLAY_BUTTON_WIDTH, h: PLAY_BUTTON_HEIGHT, on_click: startGame },
];

const NUM_MENU_BUTTONS = MENU_BUTTONS.length;

var menu_button_status = [
    { glow: false, outline: true },
    { glow: false, outline: false },
    { glow: false, outline: false },
    { glow: false, outline: true },
    { glow: false, outline: true },
]

function drawMenu(ctx) {
    ctx.font = "80px ChalkboardFont";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillText("You'll play:", MENU_START_X, MENU_START_Y + MENU_FONT_SIZE);
    ctx.fillText("I'll play:", MENU_START_X, MENU_START_Y + 3 * MENU_FONT_SIZE);

    for (let i = 0; i < NUM_MENU_BUTTONS; i++) {
        if (menu_button_status[i].glow) {
            ctx.fillStyle = "gray"
            ctx.beginPath();
            ctx.roundRect(MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET, MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET, MENU_BUTTONS[i].w, MENU_BUTTONS[i].h, BUTTON_RADII);
            ctx.fill();
            ctx.fillStyle = "white"
        }
        if (menu_button_status[i].outline) {
            ctx.beginPath();
            ctx.roundRect(MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET, MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET, MENU_BUTTONS[i].w, MENU_BUTTONS[i].h, BUTTON_RADII);
            ctx.stroke();
        }
        ctx.fillText(MENU_BUTTONS[i].label, MENU_BUTTONS[i].x, MENU_BUTTONS[i].y + MENU_BUTTONS[i].h);
    }
}

var board_cell_hover = [ false, false, false, false, false, false, false, false, false ];
var again_button_hover = false;

function drawGame(ctx) {
    ctx.font = "100px ChalkboardFont";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board_cell_hover[idx]) {
                ctx.fillStyle = "gray"
                ctx.beginPath();
                ctx.roundRect(GAME_BOARD_LEFT + x * GAME_CELL_X, GAME_BOARD_TOP + y * GAME_CELL_Y, GAME_CELL_X, GAME_CELL_Y, BUTTON_RADII);
                ctx.fill();
                ctx.fillStyle = "white"
            }

            const cell = game_state.get_cell(x, y);
            if (cell == ttt.Cell.X) {
                ctx.fillText("X", GAME_BOARD_LEFT + x * GAME_CELL_X + GAME_CELL_TEXT_OFFSET_X, GAME_BOARD_TOP + y * GAME_CELL_Y + GAME_CELL_TEXT_OFFSET_Y);
            } else if (cell == ttt.Cell.O) {
                ctx.fillText("O", GAME_BOARD_LEFT + x * GAME_CELL_X + GAME_CELL_TEXT_OFFSET_X, GAME_BOARD_TOP + y * GAME_CELL_Y + GAME_CELL_TEXT_OFFSET_Y);
            }
        }
    }

    ctx.beginPath();
    ctx.moveTo(GAME_BOARD_LEFT, GAME_BOARD_TOP + GAME_CELL_Y);
    ctx.lineTo(GAME_BOARD_LEFT + 3 * GAME_CELL_X, GAME_BOARD_TOP + GAME_CELL_Y);
    ctx.moveTo(GAME_BOARD_LEFT, GAME_BOARD_TOP + 2 * GAME_CELL_Y);
    ctx.lineTo(GAME_BOARD_LEFT + 3 * GAME_CELL_X, GAME_BOARD_TOP + 2 * GAME_CELL_Y);
    ctx.moveTo(GAME_BOARD_LEFT + GAME_CELL_X, GAME_BOARD_TOP);
    ctx.lineTo(GAME_BOARD_LEFT + GAME_CELL_X, GAME_BOARD_TOP + 3 * GAME_CELL_Y);
    ctx.moveTo(GAME_BOARD_LEFT + 2 * GAME_CELL_X, GAME_BOARD_TOP);
    ctx.lineTo(GAME_BOARD_LEFT + 2 * GAME_CELL_X, GAME_BOARD_TOP + 3 * GAME_CELL_Y);
    ctx.stroke();

    const winner = game_state.has_winner();

    if (typeof winner !== 'undefined') {
        ctx.font = "80px ChalkboardFont";
        const stmt = (winner === ttt.Cell.Blank)
            ? "Tie!"
            : ((winner === ttt.Cell.X && user_is_o) || (winner === ttt.Cell.O && !user_is_o))
                ? "I win!"
                : "You win!";
        ctx.fillText(stmt, GAME_STMT_LEFT, GAME_STMT_BOT);

        if (again_button_hover) {
            ctx.fillStyle = "gray"
            ctx.beginPath();
            ctx.roundRect(AGAIN_BUTTON_LEFT, AGAIN_BUTTON_TOP, AGAIN_BUTTON_WIDTH, AGAIN_BUTTON_HEIGHT, BUTTON_RADII);
            ctx.fill();
            ctx.fillStyle = "white"
        }

        ctx.beginPath();
        ctx.roundRect(AGAIN_BUTTON_LEFT, AGAIN_BUTTON_TOP, AGAIN_BUTTON_WIDTH, AGAIN_BUTTON_HEIGHT, BUTTON_RADII);
        ctx.stroke();
        ctx.fillText("Again?", GAME_AGAIN_LEFT, GAME_AGAIN_BOT);
    }
}

function drawBody(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, MENU_START_Y, canvas.width, canvas.height - MENU_START_Y);
    if (in_game) {
        drawGame(ctx);
    } else {
        drawMenu(ctx);
    }
}

function menuMouseMoveHandler(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    for (let i = 0; i < NUM_MENU_BUTTONS; i++) {
        menu_button_status[i].glow =
           (x > MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET && x < MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET + MENU_BUTTONS[i].w &&
            y > MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET && y < MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET + MENU_BUTTONS[i].h);
    }
}

function gameMouseMoveHandler(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (typeof game_state.has_winner() === 'undefined') {
        for (let cy = 0; cy < BOARD_HEIGHT; cy++) {
            for (let cx = 0; cx < BOARD_WIDTH; cx++) {
                const idx = ttt.Game.xy_to_index(cx, cy);
                const cell = game_state.get_cell(x, y);
                board_cell_hover[idx] =
                    ((cell === ttt.Cell.Blank) &&
                     (x > GAME_BOARD_LEFT + cx * GAME_CELL_X) && (x < GAME_BOARD_LEFT + (cx + 1) * GAME_CELL_X) &&
                     (y > GAME_BOARD_TOP + cy * GAME_CELL_Y) && (y < GAME_BOARD_TOP + (cy + 1) * GAME_CELL_Y));
            }
        }
    } else {
        again_button_hover = (x > AGAIN_BUTTON_LEFT) && (x < AGAIN_BUTTON_LEFT + AGAIN_BUTTON_WIDTH) &&
            (y > AGAIN_BUTTON_TOP) && (y < AGAIN_BUTTON_TOP + AGAIN_BUTTON_HEIGHT);
    }
}

function mouseMoveHandler(event) {
    if (in_game) {
        gameMouseMoveHandler(event);
    } else {
        menuMouseMoveHandler(event);
    }

    drawBody(canvas);
}

function menuMouseClickHandler(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    for (let i = 0; i < NUM_MENU_BUTTONS; i++) {
        if (x > MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET && x < MENU_BUTTONS[i].x - MENU_SEL_X_OFFSET + MENU_BUTTONS[i].w &&
            y > MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET && y < MENU_BUTTONS[i].y - MENU_SEL_Y_OFFSET + MENU_BUTTONS[i].h) {
            MENU_BUTTONS[i].on_click();
            break;
        }
    }
}

function gameMouseClickHandler(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (typeof game_state.has_winner() === 'undefined') {
        for (let cy = 0; cy < BOARD_HEIGHT; cy++) {
            for (let cx = 0; cx < BOARD_WIDTH; cx++) {
                const idx = ttt.Game.xy_to_index(x, y);
                const cell = game_state.get_cell(x, y);
                if ((cell == ttt.Cell.Blank) &&
                    (x > GAME_BOARD_LEFT + cx * GAME_CELL_X) && (x < GAME_BOARD_LEFT + (cx + 1) * GAME_CELL_X) &&
                    (y > GAME_BOARD_TOP + cy * GAME_CELL_Y) && (y < GAME_BOARD_TOP + (cy + 1) * GAME_CELL_Y)) {
                    game_state.do_user_move(cx, cy);

                    if (typeof game_state.has_winner() === 'undefined') {
                       game_state.do_comp_move(comp_is_perfect);
                    }

                    board_cell_hover[idx] = false;
                    break;
                }
            }
        }
    } else {
        if ((x > AGAIN_BUTTON_LEFT) && (x < AGAIN_BUTTON_LEFT + AGAIN_BUTTON_WIDTH) &&
            (y > AGAIN_BUTTON_TOP) && (y < AGAIN_BUTTON_TOP + AGAIN_BUTTON_HEIGHT)) {
            in_game = false;
            again_button_hover = false;
            game_state.free();
            game_state = null;
        }
    }
}

function mouseClickHandler(event) {
    if (in_game) {
        gameMouseClickHandler(event);
    } else {
        menuMouseClickHandler(event);
    }

    drawBody(canvas);
}

canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("click", mouseClickHandler);

var myFont = new FontFace('ChalkboardFont', 'url(www/assets/ChalkboardByMartaVanEck-gvpp.ttf)');

function run() {
    drawBanner(canvas);
    drawBody(canvas);
}

myFont.load().then(function(font){
    document.fonts.add(font);
    init().then(run)
});

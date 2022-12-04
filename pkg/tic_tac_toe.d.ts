/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Blank,
  X,
  O,
}
/**
*/
export class Game {
  free(): void;
/**
* @returns {Game}
*/
  static new(): Game;
/**
* @returns {number}
*/
  cells(): number;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_cell(x: number, y: number): number;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  static xy_to_index(x: number, y: number): number;
/**
* @returns {number | undefined}
*/
  has_winner(): number | undefined;
/**
* @param {number} x
* @param {number} y
*/
  do_user_move(x: number, y: number): void;
/**
* @param {boolean} play_well
*/
  do_comp_move(play_well: boolean): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_game_free: (a: number) => void;
  readonly game_new: () => number;
  readonly game_cells: (a: number) => number;
  readonly game_get_cell: (a: number, b: number, c: number) => number;
  readonly game_xy_to_index: (a: number, b: number) => number;
  readonly game_has_winner: (a: number) => number;
  readonly game_do_user_move: (a: number, b: number, c: number) => void;
  readonly game_do_comp_move: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

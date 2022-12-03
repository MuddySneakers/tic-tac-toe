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

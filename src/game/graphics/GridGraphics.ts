import { Container, Point } from "pixi.js";
import SquareGraphics from "./SquareGraphics";

export default class GridGraphics extends Container {
  private squares: SquareGraphics[] = [];
  private gridHeight: number;
  private gridWidth: number;

  constructor(gridWidth: number, gridHeight: number) {
    super();

    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    const square_size = 10;
    const holeBorder = 0.25;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const square = new SquareGraphics(square_size, holeBorder, new Point(x, y));
        square.position.set(x * square_size, y * square_size);
        this.squares.push(square);
        square.addListener('square-over', this.onSquareOver);
        square.addListener('square-out', this.onSquareOut);
        square.addListener('square-up', this.onSquareUp);
        this.addChild(square);
      }
    }

    this.pivot.x = this.width/2;
    this.pivot.y = this.height/2;
  }
  
  private onSquareOver = (gridPosition: Point) => {
    this.getFirstEmptySquare(gridPosition.x).select(0x401010);
  }

  private onSquareOut = (gridPosition: Point) => {
    for (let y = 0; y < this.gridHeight; y++) {
      this.getSquare(gridPosition.x, y).unselect();
    }
  }

  private onSquareUp = (gridPosition: Point) => {
    const square = this.getFirstEmptySquare(gridPosition.x);
    square.addToken(0xff0000)
    square.unselect();
    this.onSquareOver(gridPosition);
    this.emit('column-click', gridPosition.x);
  }

  private getSquare(x: number, y: number) {
    return this.squares[x + y * this.gridWidth];
  }

  private getFirstEmptySquare(x: number) {
    for (let y = this.gridHeight-1; y >= 0; y--) {
      const square = this.getSquare(x, y)
      if (!square.hasToken) {
        return square;
      }
    }
    throw new NoEmptySquareError(`Column ${x} has no empty square`);
  }

  public resize(width: number, height: number) {
    const proportion = this.gridWidth / this.gridHeight;

    this.width = width/height < proportion ? width : height*proportion;
    this.height = width/height < proportion ? width/proportion: height;

    this.position.set(width/2, height/2);
  }
}

class NoEmptySquareError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NoEmptySquareError';
  }
}
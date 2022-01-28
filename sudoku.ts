import readline from 'readline'
import fs from 'fs'
import _ from 'lodash'
import dotenv from 'dotenv'

dotenv.config()

// TODO: sz: may not be 9

// validating all rows and all cols (are [1...9] is sufficient
// ... further validation of the 9 3x3 is not necessary.
// ====== state of reading from file
const state = {
  readCount: true,
  readMatrixSize: false,
  readMatrix: false,
}
let toStdOut = ''

// ====== data
let cnt = 0
let sz = 0
// ====== ref
const refNums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

let matrix: number[][] = []
let matrices: number[][][] = []

// ====== utils
const validateRow = (row: number[]): boolean => {
  let t = [...row]
  t.sort((a, b) => a > b ? 1 : -1)
  // console.log('validateRow: ', row)
  if (!_.isEqual(t, refNums)) {
    // console.log('validateRow: returning false')
    return false
  }
  return true
}

const validateMatrix = (mat: number[][]): boolean => {
  // validate row sums.
  for (let row = 0; row < mat.length; row++) {
    if (!validateRow(mat[row])) return false
  }
  return true
}

// ====== read in.

console.log(process.env.SUDOKU_PUZZLE_FILE)
const fname = process.env.SUDOKU_PUZZLE_FILE
const rl = readline.createInterface({
  input: fs.createReadStream('./data/sudoku.txt'),
})

let row = 0 // read up to sz * sz number of rows.
rl.on('line', (line: string) => {
  if (state.readCount) {
    cnt = +line
    state.readCount = false;
    state.readMatrixSize = true;
    return
  } else if (state.readMatrixSize) {
    sz = +line
    matrix = new Array(sz * sz).fill(0).map(() => new Array(sz * sz).fill(0))
    state.readMatrixSize = false;
    state.readMatrix = true;
  } else {
    matrix[row++] = line.split(/ /).map(s => +s)
    if (row == sz * sz) {
      matrices.push(matrix)
      state.readMatrixSize = true;
      state.readMatrix = false;
      row = 0
    }
  }
})
  .on('close', () => {
    // ======= validate
    for (let matN = 0; matN < matrices.length; matN++) {
      let m = matrices[matN] // convenience
      // console.log(matrices[matN])
      if (!validateMatrix(m)) {
        console.log(`Sudoku puzzle ${matN} failed`)
        return
      }
      // ====== validate transposed matrix
      // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
      const trans = m[0].map((_, colIndex) => m.map(row => row[colIndex]));
      if (!validateMatrix(trans)) {
        console.log(`Sudoku puzzle (transpose) ${matN} failed`)
        return
      }
      console.log(`Sudoku puzzle ${matN} succeeded`)
    }

  })

  // module.exports.x = validateMatrix
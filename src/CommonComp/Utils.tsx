// constants for coloring of leaderboards
export const nameColor : { [id: string] : string; } = {"green": "#527744", "aqua":"#446E77", "ochre": "#A4912C", "navy": "#445077", "indigo": "#4C4477", "violet": "#6A4477", "red": "#774444", "indianred": "#77445c"};
export const codeColor : { [id: string] : string; } = {"green": "#839D68", "aqua":"#68979D", "ochre": "#B2A573", "navy": "#68779D", "indigo": "#70689D", "violet": "#8C689D", "red": "#9d6868", "indianred": "#9d687c"};

// consts for coloring of squares
export const colorMap : { [id: string] : string; } = {"c": "#32884A", "p":"#C9BC45", "a": "#6E7582", "e": "#0b141bc5"};
export const borderMap : { [id: string] : string; } = {"c": "#32884A", "p":"#C9BC45", "a": "#6E7582", "e": "#f5cff7"};

// export app's url
export const URL : string = 'https://leaderboardle.herokuapp.com'
//export const URL : string = 'localhost:3000'

// type for a date's specific guess
export type Guess  = {
    guess_no : number
    presence : string
}

// number of weeks for best score
export const NUM_WEEKS = 12;


// get the date string from date object
export function dateToString (date: Date) {


  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

 return mm + dd + yyyy

}


// function to return a GuessInfo for a date
export function loadData (data : { [guess : string] : Guess}) {

    var items : [string, Guess] [] = Object.keys(data).map(
      (key) => { return [key, data[key]] });
    
    items.sort((a , b) => (a[1].guess_no > b[1].guess_no) ? 1 : -1)
    
    const guessSplitArray : string[][]  = items.map((ele) => (ele[0].split("").map((el) => el.toUpperCase())))
    const presenceSplitArray : string [][] = items.map((ele) => ele[1].presence.split(""))
    const colorsSplitArray : string [][] =[]
    const bordersSplitArray : string [][] =[]

    while (guessSplitArray.length < 6) {
      guessSplitArray.push(['','', '','', ''])
      presenceSplitArray.push(['e','e', 'e','e', 'e'])
    }
    
    for (let i = 0; i<presenceSplitArray.length; i++) {
      let newColors : string[] = []
      let newBorders : string[] = []
      for (let j = 0; j<presenceSplitArray[i].length; j++) {
        newColors.push(colorMap[presenceSplitArray[i][j]])
        newBorders.push(borderMap[presenceSplitArray[i][j]])
      }
      colorsSplitArray.push(newColors)
      bordersSplitArray.push(newBorders)
    }

    let newGuessInfo = {splitGuesses: guessSplitArray, splitColors: colorsSplitArray, splitBorderColors : bordersSplitArray}
    return newGuessInfo;
    
  }

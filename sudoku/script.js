 let  game=JSON.parse(localStorage.getItem('game'));
 
 if(game===null){
     
    game={
        sudoku:[],
        puzzle:[],
        update:[],
        diff:"medium",
        score:0,
        errors:0
     };
 }
 

// let sudoku=[];
// let diff="";
// let puzzle=[];

let numselected;
let boxselected;
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num)
            return false;
    }

    const s_row = Math.floor(row / 3) * 3;
    const s_col = Math.floor(col / 3) * 3;


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[s_row + i][s_col + j] === num)
                return false;
        }
    }
//   console.log("checked succesfully!!");
    return true;
}


function generatesudoku() {
    let board = [];

    for (let i = 0; i < 9; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            board[i][j] = 0;
        }
    }
//    console.log("filled with zeros");
    function fillBoard(board) {
        for (let i = 0; i < 9; i++) {
            // console.log(`${i} row completed`);
            for (let j = 0; j < 9; j++) {
                // console.log("reached");
                if (board[i][j] === 0) {
                    let nums=[]
                    for(let k=1;k<=9;k++)
                      nums.push(k);
                    nums.sort(()=> Math.random()-0.5);
                    for (const num of nums) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (fillBoard(board)) {
                                return true;
                            }
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillBoard(board);
    return board
}


function removeBlanks(board,blanks)
{
    let removed=0;
     while(removed < blanks)
     {
        const row=Math.floor(Math.random()*9);
        const col=Math.floor(Math.random()*9);
        if(board[row][col] !== 0)
        {
            board[row][col]=0;
            removed++;
        }
     }

     return board;
}


function generatePuzzle(diffculty)
{
    game.sudoku=generatesudoku();
   
    let clone=[];
    for(let i=0;i<9;i++)
    {
        clone[i]=[];
        for(let j=0;j<9;j++)
        {
            clone[i][j]=game.sudoku[i][j];
        }
    }
     let blanks;
    switch(diffculty)
    {
        case "easy":blanks=35;
         break;
        case "medium":blanks=45;
         break;
        case "hard":blanks=55;
         break;
        default : blanks=45;
    }

   return removeBlanks(clone,blanks);
}

if(game.puzzle.length===0)
{
    game.puzzle=generatePuzzle(game.diff);
   
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            game.update[i][j]=0;
        }
    }
}

console.log(game.sudoku);
console.log(game.puzzle);
console.log(game.update);

localStorage.setItem('game',JSON.stringify(game));

window.onload =function()
{
    setGame(game.puzzle,game.update);
    document.getElementById("score").innerText=`Score:${game.score}`;
    document.getElementById("error").innerText=`Error:${game.errors}`
}

function setGame(board1,board2)
{
    for(let i=1;i<=9;i++)
    {
        let number=document.createElement("div");
        number.id=i;
        number.innerText=i;
        number.setAttribute("class","number");
        document.getElementById("digits").appendChild(number);
        number.addEventListener("click",selectNumber);
    }

    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            let box=document.createElement("div");
            box.id=i.toString()+"-"+j.toString();
            if(board1[i][j] !== 0)
            {
                box.innerText=board1[i][j];
                box.classList.add("box_start");
                box.classList.add("read");
            }else{
                box.innerText="";
            }
            box.classList.add("box");
            document.getElementById("board").appendChild(box);
            if(i==2 || i==5){
                box.classList.add("hor_sep")
            }
            if(j==2 || j==5)
            {
                box.classList.add("ver_sep");
            }

            box.addEventListener("click",selectBox);
        }
    }

    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
        
            if(board2[i][j] !== 0){
                const id=i.toString()+"-"+j.toString();
                let box=document.getElementById(id);
                box.innerText= board2[i][j];
                box.classList.add("correct");
            }
        }
    }
}

document.querySelector("#easy").addEventListener("click",(e)=>{
     game.diff="easy";
     
     localStorage.setItem('game',JSON.stringify(game));
})
document.querySelector("#medium").addEventListener("click",(e)=>{
    game.diff="medium";
    
    localStorage.setItem('game',JSON.stringify(game));
})
document.querySelector("#hard").addEventListener("click",(e)=>{
    game.diff="hard";
   
    localStorage.setItem('game',JSON.stringify(game));
})

function newGame(puzzle)
{
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            const id=i.toString()+"-"+j.toString();
            let box=document.getElementById(id);
            box.classList.remove("correct","wrong");
            if(box.innerText !== "")
            {
                box.innerText="";
                box.classList.remove("box_start");
            }
            
            if(puzzle[i][j] !== 0)
            {
                box.innerText=puzzle[i][j];
                box.classList.add("box_start");
            }
            
        }
    }

    document.getElementById("score").innerText=`Score:${game.score}`;
    document.getElementById("error").innerText=`Error:${game.errors}`
}

document.querySelector("#newgame").addEventListener("click",(e)=>{
     game.puzzle=generatePuzzle(game.diff);

     for(let i=0;i<9;i++)
     {
        for(let j=0;j<9;j++)
        {
            game.update[i][j]=0;
        }
     }
     game.score=0;
     game.errors=0;
     
     localStorage.setItem('game',JSON.stringify(game));
     newGame(game.puzzle);
})

function selectBox()
{
     if(boxselected != null)
     {
        boxselected.classList.remove("box_selected");
     }
      boxselected=this;
      boxselected.classList.add("box_selected");
    
}
function selectNumber()
{
    if(numselected != null)
    {
        numselected.classList.remove("number_selected");
    }
    numselected=this;
    numselected.classList.add("number_selected");
    
    
    if(boxselected && !boxselected.classList.contains("read"))
    {
        boxselected.classList.remove("correct","wrong");
        boxselected.innerText=numselected.id;
        
        const row=parseInt(boxselected.id[0]);
        const col=parseInt(boxselected.id[2]);
        
        

         game.update[row][col]=parseInt(numselected.id);
        
        

        if(parseInt(numselected.id)!==game.sudoku[row][col]){
            boxselected.classList.add("wrong");
              game.errors+=1;
            document.getElementById("error").innerText=`Error:${game.errors}`;
        }
        else if(parseInt(numselected.id)===game.sudoku[row][col]){
            boxselected.classList.add("correct"); 
            game.score+=30;
            document.getElementById("score").innerText=`Score:${game.score}`;
        }
    }
    localStorage.setItem('game',JSON.stringify(game));
}

document.getElementById("reset").addEventListener("click",resetGame)

function resetGame(){
  
    for(let i=0;i<9;i++)
        {
           for(let j=0;j<9;j++)
           {
               game.update[i][j]=0;
           }
        }
        
       game.score=0;
       game.errors=0;
       localStorage.setItem('game',JSON.stringify(game));
       newGame(game.puzzle);
}
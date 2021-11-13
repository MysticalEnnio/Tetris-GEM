/*******************************************************************************
Copyright © 2021 Mystaredia Team
*******************************************************************************/

document.addEventListener("DOMContentLoaded", () => {
  let difficulty;
  let randomcolor = 0;
  let startSpeedMultipliyer;
  if(confirm("Do you want to make advanced options?")) {
    difficulty;
    console.log(difficulty)
    while(difficulty < 1 || difficulty > 100 || difficulty == undefined) {
      difficulty = prompt("Set a difficulty (1-10 (1 = Ridicolous)(5 = normal)(10 = Super Easy)(100 = Too easy))")
      if(difficulty < 1 && difficulty > 100 || difficulty == undefined) {
        alert("Please set a difficulty")
      } 
    }
    while(startSpeedMultipliyer < 0.1 || startSpeedMultipliyer > 10 || startSpeedMultipliyer == undefined) {
      startSpeedMultipliyer = prompt("Set a startSpeedMultipliyer (0.1-10)")
      if(startSpeedMultipliyer < 0.1 && startSpeedMultipliyer > 1 || startSpeedMultipliyer == undefined) {
        alert("Please set a startSpeedMultipliyer")
      } 
    }
    randomcolor = confirm("Random Tetris block colors?(When not they are predefined)")
  } else {
    difficulty = 3;
    startSpeedMultipliyer = 1;
  }
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const clearBtn = document.querySelector("#clear-button")
  const FinalScore = document.querySelector("#FinalScore")
  const FinalScoreNumber = document.querySelector("#FinalScoreNumber")
  const width = 10;
  let nextRandom = 0;
  let nextTetStyle = 0;
  let timerId;
  let score = 0;
  let delay = 10;
  let GameOver = 0;
  // Playlist array
  var Songs = [];
  Songs[0] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20The%20Underground%20Radio%20(152kbit_Opus).ogg?v=1625219046838');
  Songs[1] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20Vs.%20POCKET%20-%20uNDeRWoRLD%20MoNaRCHy%20(128kbit_AAC).m4a?v=1625219049358');
  Songs[2] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20The%20Dapper%20Mannequin%20Bakery%20(128kbit_AAC).m4a?v=1625219051340');
  Songs[3] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Reality%20Check%20Through%20The%20Skull%20(128kbit_AAC).m4a?v=1625219051521');
  Songs[4] = new Audio("https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Undying%20Wish%20~%20The%20Villain's%20Reckoning%20(152kbit_Opus).ogg?v=1625219052678");
  Songs[5] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20COMMON%20CORE%20(128kbit_AAC).m4a?v=1625219053228');
  Songs[6] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Dino%20Dork%20(192kbit_AAC).m4a?v=1625219053467');
  Songs[7] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Septisicle%20(152kbit_Opus).ogg?v=1625219053643');
  Songs[8] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Underground%20Static%20(192kbit_AAC).m4a?v=1625219053764');
  Songs[9] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20SAVE%20(152kbit_Opus).ogg?v=1625219053904');
  Songs[10] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20Sign%20Language%20(152kbit_Opus).ogg?v=1625219053935');
  Songs[11] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20SAVE%20(Encore)%20(128kbit_AAC).m4a?v=1625219054173');
  Songs[12] = new Audio("https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20g%20a%20r%20d%20e%20n%20(192kbit_AAC).m4a?v=1625219054261");
  Songs[13] = new Audio('https://cdn.glitch.com/68b1bbb5-a5b0-43d1-848b-27c6296c7766%2FDM%20DOKURO%20-%20BONESCUFFLE%20(128kbit_AAC).m4a?v=1625221302513');

  // Current index of the files array
  var SongI = Math.floor(Math.random() * Songs.length);
  
  // function for moving to next audio file
  function next() {
    Songs[SongI].removeEventListener('ended', next, false)
    let random;
    while(random === SongI) {
      let random = Math.floor(Math.random() * Songs.length);
    }
    // Change the audio element source
    Songs[SongI].play();
  }
  
  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const rlTetromino = [
    [1, width + 1, width * 2 + 1, 0],
    [width, width + 1, width + 2, 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2]
  ];
  
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const rzTetromino = [
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width , width + 1, width * 2 ],
    [0, 1, width * 1 + 1, width * 1 + 2]
  ];
  
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];
  
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const theTetrominoes = [
    lTetromino,
    rlTetromino,
    zTetromino,
    rzTetromino,
    tTetromino,
    oTetromino,
    iTetromino
  ];

  const TetrominoesStyle = [
    "https://i.imgur.com/Q3q5Ltn.png", //lTetromino
    "https://i.imgur.com/OlgkEsE.png", //rlTetromino
    "https://i.imgur.com/jlssLoJ.png", //zTetromino
    "https://i.imgur.com/CHMhtdW.png", //rzTetromino
    "https://i.imgur.com/vojloxY.png", //tTetromino
    "https://i.imgur.com/tUKxGNj.png", //oTetromino
    "https://i.imgur.com/loT5BfF.png"  //iTetromino
  ];
  
  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  let curtetstyle;
  if(randomcolor) {
    curtetstyle = TetrominoesStyle[Math.floor(Math.random() * TetrominoesStyle.length)];
  } else {
    curtetstyle = TetrominoesStyle[random];
  }

  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundImage = `url(${curtetstyle})`
    });
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundImage = `url()`;
    });
  }

  //assign functions to keyCodes
  function control(e) {
    setTimeout(function() {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
    }, delay);
  }
  document.addEventListener("keydown", control);

  //move down function
  function moveDown() {
    freeze();
    undraw();
    currentPosition += width;
    draw();
    /*if(!GameOver){
      score += Math.round(10*startSpeedMultipliyer/difficulty);
      scoreDisplay.innerHTML = score;
      changeSpeed()
    }*/
  }
  
  //chnagespeed function
  function changeSpeed() {
    clearInterval(timerId)
    timerId = setInterval(moveDown, ((1000 / startSpeedMultipliyer) - (score / difficulty)))
  }

  //freeze function
  function freeze() {
    if (
      current.some(index =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach(index =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      if(randomcolor) {
        curtetstyle = TetrominoesStyle[Math.floor(Math.random() * TetrominoesStyle.length)];
      } else {
        curtetstyle = TetrominoesStyle[random];
      }
      if(randomcolor) {
        nextTetStyle = TetrominoesStyle[Math.floor(Math.random() * TetrominoesStyle.length)];
      } else {
        nextTetStyle = TetrominoesStyle[nextRandom];
      }
      currentPosition = 4;
      draw();
      displayNext();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      index => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some(index =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      index => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some(index =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }
  /////////

  //show up-next tetromino in mini-grid display
  const displaySquaresNext = document.querySelectorAll(".display-next div");
  const displayWidth = 4;
  const displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 0], //rlTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [2, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1], //rzTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [0, 1, 2, 3] //iTetromino
  ];
  
  //display the shape in the mini-grid display
  function displayNext() {
    //remove any trace of a tetromino form the entire grid
    displaySquaresNext.forEach(square => {
      square.classList.remove("tetromino");
      square.style.backgroundImage = `url()`;
    });
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquaresNext[displayIndex + index].classList.add("tetromino");
      displaySquaresNext[currentPosition + index].style.backgroundImage = `url(${nextTetStyle})`
    });
  }
  
  //add functionality to the Start/Stop button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayNext();
      
      // Start the player
      console.log(Songs[SongI])
      Songs[SongI].play();
      
       // Listen for the music ended event, to play the next audio file
       Songs[SongI].addEventListener('ended', next, false)
    }
  });

  //add functionality to the Clear button
  clearBtn.addEventListener("click", () => {
    location.reload();
  });
  
  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9
      ];

      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += Math.round(100*startSpeedMultipliyer/difficulty);
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundImage = `url()`;
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
      document.removeEventListener("keydown", control);
      document.addEventListener("keydown", control);
    }
  }

  //game over
  function gameOver() {
    if (
      current.some(index =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      FinalScore.style.color = "black"
      FinalScoreNumber.innerHTML = score;
      scoreDisplay.innerHTML = "end";
      GameOver = 1;
      clearInterval(timerId);
      let PlayerName;
      while(!PlayerName) {
        PlayerName = prompt(`Game over! Your score is: ${score}! Enter a Username.`)
      }
      addScore(score, PlayerName);
    }
  }
});

function addScore(Score, Username) {
  console.log(Username + ":" + Score)
  var fs = require('fs');
  let gameResult = {player: Username, score: Score};
  fs.readFile('./Scores.json', 'utf8', function (err, data){
    if (err) {
       console.log(err)
   } else {
      const Scores = JSON.parse(data);
      Scores.events.push(gameResult);
     
      const json = JSON.stringify(Scores);
     
      fs.writeFile('./Scores.json', json, 'utf8', function(err){
      if(err){ 
        console.log(err); 
      } else {
        //Everything went OK!
      }});
   }
  })
}
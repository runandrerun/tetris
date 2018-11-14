document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');

  context.scale(20, 20);



  createMatrix = (w, h) => {
      const matrix = [];
      while (h--) {
          matrix.push(new Array(w).fill(0));
      }
      return matrix;
  }


  drawMatrix = (matrix, offset) => {
      matrix.forEach((row, y) => {
          row.forEach((value, x) => {
              if (value !== 0) {
                  context.fillStyle = colors[value];
                  context.fillRect(x + offset.x,
                                   y + offset.y,
                                   1, 1);
              }
          });
      });
  }

  draw = () => {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      drawMatrix(arena, {x: 0, y: 0});
      drawMatrix(player.matrix, player.pos);
  }

  merge = (arena, player) => {
      player.matrix.forEach((row, y) => {
          row.forEach((value, x) => {
              if (value !== 0) {
                  arena[y + player.pos.y][x + player.pos.x] = value;
              }
          });
      });
  }


  playerDrop = () => {
      player.pos.y++;
      if (collide(arena, player)) {
          player.pos.y--;
          merge(arena, player);
          playerReset();
          arenaSweep();
          updateScore();
      }
      dropCounter = 0;
  }

  playerMove = (offset) => {
      player.pos.x += offset;
      if (collide(arena, player)) {
          player.pos.x -= offset;
      }
  }

  playerReset = () => {
      const pieces = 'TJLOSZI';
      player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
      player.pos.y = 0;
      player.pos.x = (arena[0].length / 2 | 0) -
                     (player.matrix[0].length / 2 | 0);
      if (collide(arena, player)) {
          arena.forEach(row => row.fill(0));
          player.score = 0;
          updateScore();
      }
  }

  playerRotate = (dir) => {
      const pos = player.pos.x;
      let offset = 1;
      rotate(player.matrix, dir);
      while (collide(arena, player)) {
          player.pos.x += offset;
          offset = -(offset + (offset > 0 ? 1 : -1));
          if (offset > player.matrix[0].length) {
              rotate(player.matrix, -dir);
              player.pos.x = pos;
              return;
          }
      }
  }

  let dropCounter = 0;
  let dropInterval = 1000;

  let lastTime = 0;
  function update(time = 0) {
      const deltaTime = time - lastTime;

      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
          playerDrop();
      }

      lastTime = time;

      draw();
      requestAnimationFrame(update);
  }


  updateScore = () => {
      document.getElementById('score').innerText = 'Score ' + player.score;
  }

  document.addEventListener('keydown', event => {
      if (event.keyCode === 37) {
          playerMove(-1);
      } else if (event.keyCode === 39) {
          playerMove(1);
      } else if (event.keyCode === 40) {
          playerDrop();
      } else if (event.keyCode === 81) {
          playerRotate(-1);
      } else if (event.keyCode === 87) {
          playerRotate(1);
      }
  });


  const arena = createMatrix(12, 20);
  
  const player = {
      pos: {x: 0, y: 0},
      matrix: null,
      score: 0,
  };

  playerReset();
  updateScore();
  update();

});

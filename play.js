//キャンバスについて定義
const gameDisplay = document.getElementById("gamePlay");
const gameDisplayCTX = gameDisplay.getContext("2d");
const spacecraft = new Image();
spacecraft.src = "spacecraft.png";
const bullet = new Image();
bullet.src = "bullet.png";
const enemy = new Image();
enemy.src = "enemy.png";
gameDisplayCTX.fillStyle = "#000033";

//乗り物について定義
const scsize = 100;
let spacecraftX = gameDisplay.width / 2 - scsize / 2;
const minspacecraftX = - scsize / 2;
const maxspacecraftX = gameDisplay.width - scsize / 2;
const AmountOfscMovement = 1;
let movement;
let movementPermission = 0;

//弾について定義
const bsize = scsize / 10;
let bulletY = -2 * bsize;
let bulletX = 0;
const AmountOfbMovement = 50;

//敵について定義
let appearedEnemy = [];
let enemyNumber = 0;
const esize = 50;
let emovement = [];
const AmountOfeMovement = 5;

//スマホ用ボタンについて定義
const leftB = document.getElementById("leftB");
const rightB = document.getElementById("rightB");
const shotB = document.getElementById("shotB");

//その他の定義
const start = document.getElementById("start");
let game;
let startstop = 0;
let hit = 0;
let all = 0;
let gameovered = false;

//効果音について定義
const shotS = document.getElementById("shotS");
const hitS = document.getElementById("hitS");
const gameoverS = document.getElementById("gameoverS");

//gameoverについて定義
const gameoverDisplay = document.getElementById("gameover");
const gameover = document.querySelector("#gameover h2");
const gameoverImg = document.querySelector("#gameover img");
const allene = document.getElementById("allEnemies");
const hitene = document.getElementById("hitEnemies");
const again = document.getElementById("again");
let gameoverColor = "red";

window.onload = function(){
    gameDisplayCTX.fillRect(0,0,gameDisplay.width,gameDisplay.height);
    gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
    document.addEventListener("keydown", scMovement);
    document.addEventListener("keyup", function(e){
        if(e.keyCode == 68 || e.keyCode == 65){
            clearInterval(movement);
            movementPermission = 0;
        }
    });
    leftB.ontouchstart = function(){
        movement = setInterval(function(){
            if(spacecraftX >= minspacecraftX){
                spacecraftX = spacecraftX - AmountOfscMovement;
                gameDisplayCTX.clearRect(spacecraftX + AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                gameDisplayCTX.fillRect(spacecraftX + AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
            }
        },1);
    }
    rightB.ontouchstart = function(){
        movement = setInterval(function(){
            if(spacecraftX <= maxspacecraftX){
                spacecraftX = spacecraftX + AmountOfscMovement;
                gameDisplayCTX.clearRect(spacecraftX - AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                gameDisplayCTX.fillRect(spacecraftX - AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
            }
        },1);
    }
    leftB.ontouchmove = function(){
        clearInterval(movement);
    }
    rightB.ontouchmove = function(){
        clearInterval(movement);
    }
    shotB.addEventListener("click",function(){
        if(bulletY <= -2 * bsize){
            shotS.play();
            bulletY = gameDisplay.height - scsize - bsize;
            bulletX = spacecraftX;
            gameDisplayCTX.drawImage(bullet, bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
            let upBullet = setInterval(function(){
                gameDisplayCTX.clearRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
                gameDisplayCTX.fillRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize + 1);
                bulletY = bulletY - AmountOfbMovement;
                gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
                gameDisplayCTX.drawImage(bullet, bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
                if(bulletY <= -2 * bsize){
                    clearInterval(upBullet);
                }
            },100)
        }
    });
    document.addEventListener("keypress", shootBullets);
    start.addEventListener("click",function(){
        if(startstop == 0){
            startstop++;
            start.innerText = "stop";
            game = setInterval(function(){
                if(Math.floor(Math.random() * 2) == 0){
                    occurEnemy(enemyNumber);
                    enemyNumber++;
                }
            }, 500);
        }else if(startstop == 1){
            clearInterval(game);
            startstop--;
            start.innerText = "start";
        }
    });
    if(isSmartPhone()){
        document.getElementById("intro").style.display = "none";
        document.getElementById("controlPanel").style.display = "block";
    }
};

function scMovement(e){
    if(movementPermission == 0){
        switch (e.keyCode){
            case 68:
                movement = setInterval(function(){
                    if(spacecraftX <= maxspacecraftX){
                        spacecraftX = spacecraftX + AmountOfscMovement;
                        gameDisplayCTX.clearRect(spacecraftX - AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                        gameDisplayCTX.fillRect(spacecraftX - AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                        gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
                    }
                },1);
                movementPermission++;
                break;
            case 65:
                movement = setInterval(function(){
                    if(spacecraftX >= minspacecraftX){
                        spacecraftX = spacecraftX - AmountOfscMovement;
                        gameDisplayCTX.clearRect(spacecraftX + AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                        gameDisplayCTX.fillRect(spacecraftX + AmountOfscMovement, gameDisplay.height - scsize, scsize, scsize);
                        gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
                    }
                },1);
                movementPermission++;
                break;
        }
    }
}

function shootBullets(e){
    if(e.keyCode == 32 && bulletY <= -2 * bsize){
        shotS.play();
        bulletY = gameDisplay.height - scsize - bsize;
        bulletX = spacecraftX;
        gameDisplayCTX.drawImage(bullet, bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
        let upBullet = setInterval(function(){
            gameDisplayCTX.clearRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
            gameDisplayCTX.fillRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize + 1);
            bulletY = bulletY - AmountOfbMovement;
            gameDisplayCTX.drawImage(spacecraft, spacecraftX, gameDisplay.height - scsize, scsize, scsize);
            gameDisplayCTX.drawImage(bullet, bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
            if(bulletY <= -2 * bsize){
                clearInterval(upBullet);
            }
        },100)
    }
}

function occurEnemy(Num){
    appearedEnemy[Num] = new Object();
    appearedEnemy[Num].X = Math.floor(Math.random() * gameDisplay.width) - esize / 2;
    appearedEnemy[Num].Y = 0;
    emovement[Num] = setInterval(function(){
        gameDisplayCTX.clearRect(appearedEnemy[Num].X, appearedEnemy[Num].Y, esize, esize);
        gameDisplayCTX.fillRect(appearedEnemy[Num].X, appearedEnemy[Num].Y, esize, esize);
        appearedEnemy[Num].Y = appearedEnemy[Num].Y + AmountOfeMovement;
        gameDisplayCTX.drawImage(enemy, appearedEnemy[Num].X, appearedEnemy[Num].Y, esize, esize);
        if(bulletY <= appearedEnemy[Num].Y + esize && bulletY + bsize >= appearedEnemy[Num].Y && bulletX < appearedEnemy[Num].X && bulletX + bsize > appearedEnemy[Num].X - esize){
            console.log("hit");
            clearInterval(emovement[Num]);
            gameDisplayCTX.clearRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize);
            gameDisplayCTX.fillRect(bulletX + scsize / 2 - bsize / 2, bulletY, bsize, 2 * bsize + 1);
            bulletY = - 2 * bsize;
            gameDisplayCTX.clearRect(appearedEnemy[Num].X, appearedEnemy[Num].Y, esize, esize);
            gameDisplayCTX.fillRect(appearedEnemy[Num].X, appearedEnemy[Num].Y, esize, esize);
            all++;
            hit++;
            hitS.play();
        }
        if(appearedEnemy[Num].Y <= gameDisplay.height && appearedEnemy[Num].Y + esize >= gameDisplay.height - scsize && appearedEnemy[Num].X <= spacecraftX + scsize && appearedEnemy[Num].X + esize >= spacecraftX && !gameovered){
            gameovered = true;
            clearInterval(game);
            gameoverS.play();
            startstop = -1;
            gameoverDisplay.style.display = "block";
            hitene.innerText = hit;
            allene.innerText = all;
            again.addEventListener("click",function(){
                location.reload();
            });
            setInterval(function(){
                gameover.style.color = gameoverColor;
                gameoverImg.style.background = gameoverColor;
                switch(gameoverColor){
                    case "red":
                        gameoverColor = "black";
                        break;
                    case "black":
                        gameoverColor = "red";
                        break;
                }
            },250)

        }
        if(appearedEnemy[Num].Y > gameDisplay.height){
            clearInterval(emovement[Num]);
            all++;
        }
    },50);
}

function isSmartPhone() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  }
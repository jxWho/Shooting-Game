// To store global variables
var MYGAME = {};
MYGAME.Scale = 0.7;
MYGAME.SmallEnemySpeed = 3;
MYGAME.MediumEnemySpeed = 3;
MYGAME.LargeEnemySpeed = 2;
MYGAME.SmallEnemyScore = 100;
MYGAME.MediumEnemyScore = 500;
MYGAME.LargeEnemyScore = 1000;
MYGAME.baseEnemyInterval = 10;


function game_init()
{
  MYGAME.gameScene = new Scene();
  MYGAME.gameScene.setSize(
    480 * MYGAME.Scale,
    800 * MYGAME.Scale);

  MYGAME.myAirCraft = new MyClasses.MyAirCraft_Class(
                                                  MYGAME.gameScene,
                                                  "./image/wdfj_1.png",
                                                  "./image/wdfj_2.png",
                                                  66 * MYGAME.Scale,
                                                  80 * MYGAME.Scale
  );

  MYGAME.score = 0;
  //Score lable
  MYGAME.scoreLabel = new MyClasses.FontClass(
    MYGAME.gameScene,
    "Score: " + MYGAME.score,
    20
  );
  MYGAME.scoreLabel.setPosition(
    0,
    MYGAME.scoreLabel.size * 1.5 * MYGAME.Scale
  );

  MYGAME.myAirCraft.setSpeed( 0 );
  MYGAME.myAirCraft.setBoundAction( STOP );

  MYGAME.backgroundSprite = new Sprite(MYGAME.gameScene,
                                       "./assets/bg_01.jpg",
                                       480 * MYGAME.Scale,
                                       800 * MYGAME.Scale);
  MYGAME.backgroundSprite.setPosition(
                                      240 * MYGAME.Scale,
                                      400 * MYGAME.Scale);
  MYGAME.backgroundSprite.setSpeed(0);

  MYGAME.bulletPool = [];
  for( var i = 0; i < 100; i++ ) {
    MYGAME.bulletPool.push( new MyClasses.Bullet_Class( MYGAME.gameScene,
                                          "./image/bullet1.png",
                                          6 * MYGAME.Scale,
                                          14 * MYGAME.Scale)
                          );
  }

  // small enemy
  MYGAME.enemy1Pool = [];
  var enemy1Explosion = [
    "./image/xfjbz_1.png",
    "./image/xfjbz_2.png",
    "./image/xfjbz_3.png",
    "./image/xfjbz_4.png"
  ];
  for( i = 0; i < 100; i++ ) {
    MYGAME.enemy1Pool.push(
      new MyClasses.EnemyClass(
        MYGAME.gameScene,
        "./image/enemy1_fly_1.png",
        34 * MYGAME.Scale,
        24 * MYGAME.Scale,
        1,
        enemy1Explosion,
        MYGAME.SmallEnemySpeed )
);
}

// medium enemy
  MYGAME.enemy2Pool = [];
  var enemy2Explosion = [
    "./image/zfjbz_1.png",
    "./image/zfjbz_2.png",
    "./image/zfjbz_3.png",
    "./image/zfjbz_4.png"
  ];

  for( i = 0; i < 80; i++ ) {
    MYGAME.enemy2Pool.push(
      new MyClasses.EnemyClass(
        MYGAME.gameScene,
        "./image/enemy2_fly_1.png",
        46 * MYGAME.Scale,
        60 * MYGAME.Scale,
        5,
        enemy2Explosion,
        MYGAME.MediumEnemySpeed,
        "./image/enemy2_got_hit.png")
    );
  }

// large enemy
  MYGAME.enemy3Pool = [];
  var enemy3Explosion = [
    "./image/dfjbz_1.png",
    "./image/dfjbz_2.png",
    "./image/dfjbz_3.png",
    "./image/dfjbz_4.png",
    "./image/dfjbz_5.png",
    "./image/dfjbz_6.png",
  ];

  for( i = 0; i < 40; i++ ) {
    MYGAME.enemy3Pool.push(
      new MyClasses.EnemyClass(
        MYGAME.gameScene,
        "./image/enemy3_fly_1.png",
        110 * MYGAME.Scale,
        164 * MYGAME.Scale,
        10,
        enemy3Explosion,
        MYGAME.LargeEnemySpeed,
        "./image/enemy3_got_hit.png"
      )
    );
  }

  MYGAME.gameScene.createEnemy = function(){
    var enemy_cnt = 0;

    return function( enemy1s, enemy2s, enemy3s ) {

      var enemy1_interval = MYGAME.baseEnemyInterval;
      var enemy2_interval = enemy1_interval * 5;
      var enemy3_interval = enemy1_interval * 10;

      enemy_cnt += 1;
      if ( enemy_cnt % enemy1_interval === 0 ){
        console.log( "current " + enemy1_interval );
        createEnemyHelperFunction( enemy1s, this );
      }

      if ( enemy_cnt % enemy2_interval === 0 ) {
        createEnemyHelperFunction( enemy2s, this );
      }

      if ( enemy_cnt % enemy3_interval === 0 ) {
        createEnemyHelperFunction( enemy3s, this );
      }

      if ( enemy_cnt >= enemy3_interval )
        enemy_cnt = 0;
    };
  }();

  MYGAME.gameScene.start();

  MYGAME.gameScene.enhanceEnemyAndPlayer = function() {
    var cnt = 0;

    return function() {
      //increase the speed every 5000scores;
      if( MYGAME.score / 5000 > cnt ) {
        cnt += 1;
        increaseEnemiesSpeed( MYGAME.enemy1Pool );
        increaseEnemiesSpeed( MYGAME.enemy2Pool );
        increaseEnemiesSpeed( MYGAME.enemy3Pool );

        if ( MYGAME.baseEnemyInterval > 5 )
          MYGAME.baseEnemyInterval -= 1;

        if( MYGAME.score > 15000 ) {
          if( MYGAME.myAirCraft.bullet_interval > 1 )
            MYGAME.myAirCraft.bullet_interval -= 1;
          if( MYGAME.myAirCraft.bullet_speed < 40 )
            MYGAME.myAirCraft.bullet_spped += 1;
        }
      }
    };
  }();
}

function increaseEnemiesSpeed( Enemise )
{
  for( var index in Enemise ) {
    Enemise[ index ].o_Speed += 1;
  }
}

//used to pick an avaliable enemy from the enemy pool
function createEnemyHelperFunction( enemyPool, currrent_scene )
{
  for( var temp_enemy_index in enemyPool ) {
    var temp_enemy = enemyPool[ temp_enemy_index ];
    if( temp_enemy.visible === false ){
      var randomX = Math.floor(
        Math.random() * currrent_scene.width + temp_enemy.width / 2
      );

      if( randomX > currrent_scene.width - temp_enemy.width / 2 )
        randomX = temp_enemy.width / 2;

      temp_enemy.setPosition( randomX, temp_enemy.height / 2  );
      temp_enemy.reset();
      break;
    }
  }
}

function setPlayerPosition()
{
  var mouseX = MYGAME.gameScene.getMouseX();
  var mouseY = MYGAME.gameScene.getMouseY();
  if( isNaN(mouseX) === false && isNaN(mouseY) === false ) {
      var player_newX, player_newY;

      if ( mouseX < MYGAME.myAirCraft.width / 2 ) {
        player_newX = MYGAME.myAirCraft.width / 2;
      } else if ( mouseX > MYGAME.myAirCraft.scene.width - MYGAME.myAirCraft.width / 2 ){
        player_newX = MYGAME.myAirCraft.scene.width - MYGAME.myAirCraft.width / 2;
      } else {
        player_newX = mouseX;
      }

      if( mouseY < MYGAME.myAirCraft.height / 2 ) {
        player_newY = MYGAME.myAirCraft.height / 2;
      } else if ( mouseY > MYGAME.myAirCraft.scene.height- MYGAME.myAirCraft.height / 2 ){
        player_newY = MYGAME.myAirCraft.scene.height- MYGAME.myAirCraft.height / 2;
      } else {
        player_newY = mouseY;
      }

      MYGAME.myAirCraft.setPosition( player_newX, player_newY);
    }
}



function update()
{

  MYGAME.gameScene.clear();
  MYGAME.backgroundSprite.update();

  checkCollisions();

  setPlayerPosition();
  MYGAME.myAirCraft.shoot( MYGAME.bulletPool );
  MYGAME.myAirCraft.update();


  //update bullets
  for (var b in MYGAME.bulletPool ){
    MYGAME.bulletPool[b].update();
  }

  MYGAME.gameScene.createEnemy(
    MYGAME.enemy1Pool,
    MYGAME.enemy2Pool,
    MYGAME.enemy3Pool
  );
  //update enemy1s
  for ( var temp_enemy1 in MYGAME.enemy1Pool ) {
    var current_enemy1 = MYGAME.enemy1Pool[ temp_enemy1 ];
    current_enemy1.update();
  }

  for( var temp_enemy2 in MYGAME.enemy2Pool ) {
    var current_enemy2 = MYGAME.enemy2Pool[ temp_enemy2 ];
    current_enemy2.update();
  }

  for ( var temp_enemy3 in MYGAME.enemy3Pool ){
    var current_enemy3 = MYGAME.enemy3Pool[ temp_enemy3 ];
    current_enemy3.update();
  }

  MYGAME.scoreLabel.update();

  MYGAME.gameScene.enhanceEnemyAndPlayer();

  console.log( MYGAME.baseEnemyInterval );
}

function checkCollisions()
{

  //check collision between bullets and enemies
  for( var temp_bullet_index in MYGAME.bulletPool ) {
    var temp_bullet = MYGAME.bulletPool[ temp_bullet_index ];
    if ( temp_bullet.visible === true ) {

      var flag = false;
      //with small airCraft
      for ( var temp_enemy1_index in MYGAME.enemy1Pool ) {
        var temp_enemy1 = MYGAME.enemy1Pool[ temp_enemy1_index ];
        if( temp_enemy1.visible && temp_bullet.collidesWith( temp_enemy1 ) ) {
          temp_enemy1.HP -= 1;
          temp_enemy1.currentStatus = 1;
          temp_bullet.visible = false;
          flag = true;

          //update socre if possible
          if ( temp_enemy1.HP <= 0 ) {
            MYGAME.score += MYGAME.SmallEnemyScore;
            MYGAME.scoreLabel.text = "Score :" + MYGAME.score;
          }
          break;
        }
      }

      if ( flag )
        continue;

      for( var temp_enemy2_index in MYGAME.enemy2Pool ) {
        var temp_enemy2 = MYGAME.enemy2Pool[ temp_enemy2_index ];
        if( temp_enemy2.visible && temp_bullet.collidesWith( temp_enemy2 ) ) {
          temp_enemy2.HP -= 1;
          temp_enemy2.currentStatus = 1;
          temp_bullet.visible = false;
          flag = true;

          //update socre if possible
          if ( temp_enemy2.HP <= 0 ) {
            MYGAME.score += MYGAME.MediumEnemyScore;
            MYGAME.scoreLabel.text = "Score :" + MYGAME.score;
          }
          break;
        }
      }

      if ( flag )
        continue;

      for( var temp_enemy3_index in MYGAME.enemy3Pool ) {
        var temp_enemy3 = MYGAME.enemy3Pool[ temp_enemy3_index ];
        if( temp_enemy3.visible && temp_bullet.collidesWith( temp_enemy3 )) {
          temp_enemy3.HP -=1;
          temp_enemy3.currentStatus = 1;
          temp_bullet.visible = false;

          //update socre if possible
          if ( temp_enemy3.HP <= 0 ) {
            MYGAME.score += MYGAME.LargeEnemyScore;
            MYGAME.scoreLabel.text = "Score :" + MYGAME.score;
          }

          break;
        }
      }

    } //visible bullet for
  }

  // check collision between player and enemies
  for( var temp_enemy1_index in MYGAME.enemy1Pool ) {
      var temp_enemy1 = MYGAME.enemy1Pool[ temp_enemy1_index ];
      if ( MYGAME.myAirCraft.collidesWith( temp_enemy1 ) ) {
        // Player dies
        MYGAME.myAirCraft.visible = false;

        MYGAME.gameScene.stop();

        if ( confirm("Game Over! Try again?") ) {
          document.location.href = "";
          return;
        }
      }
  }

  //medium enemy
  for( var temp_enemy2_index in MYGAME.enemy2Pool ) {
      var temp_enemy2 = MYGAME.enemy2Pool[ temp_enemy2_index ];
      if ( MYGAME.myAirCraft.collidesWith( temp_enemy2 ) ) {
        // Player dies
        MYGAME.myAirCraft.visible = false;

        MYGAME.gameScene.stop();

        if ( confirm("Game Over! Try again?") ){
          document.location.href = "";
          return;
        }
      }
    }

    //large enemy
    for( var temp_enemy3_index in MYGAME.enemy3Pool ) {
      var temp_enemy3 = MYGAME.enemy3Pool[ temp_enemy3_index ];
      if ( MYGAME.myAirCraft.collidesWith( temp_enemy3 ) ) {
        // Player dies
        MYGAME.myAirCraft.visible = false;

        MYGAME.gameScene.stop();

        if ( confirm("Game Over! Try again?") ){
          document.location.href = "";
          return;
        }
      }
    }
}


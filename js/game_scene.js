// To store global variables
var MYGAME = {};

function game_init()
{
  MYGAME.gameScene = new Scene();
  MYGAME.gameScene.setSize(480, 800);

  MYGAME.myAirCraft = new MyClasses.MyAirCraft_Class(
                                                  MYGAME.gameScene,
                                                  "./image/wdfj_1.png",
                                                  "./image/wdfj_2.png",
                                                  66, 80 );
  MYGAME.myAirCraft.setSpeed( 0 );
  MYGAME.myAirCraft.setBoundAction( STOP );

  MYGAME.backgroundSprite = new Sprite(MYGAME.gameScene,
                                       "./assets/bg_01.jpg", 480, 800);
  MYGAME.backgroundSprite.setPosition(240, 400);
  MYGAME.backgroundSprite.setSpeed(0);

  MYGAME.bulletPool = [];
  for( var i = 0; i < 100; i++ ) {
    MYGAME.bulletPool.push( new MyClasses.Bullet_Class( MYGAME.gameScene,
                                          "./image/bullet1.png",
                                          6, 14)
                          );
  }

  MYGAME.enemy1Pool = [];
  var enemy1Explosion = [
    "./image/xfjbz_1.png",
    "./image/xfjbz_2.png",
    "./image/xfjbz_3.png",
    "./image/xfjbz_4.png"
  ];
  for( i = 0; i < 20; i++ ) {
    MYGAME.enemy1Pool.push(
        new MyClasses.EnemyClass(
                                 MYGAME.gameScene,
                                 "./image/enemy1_fly_1.png",
                                 34, 24,
                                  1, enemy1Explosion )
      );
  }

  MYGAME.gameScene.start();

  MYGAME.gameScene.createEnemy = function(){
    var enemy1_interval = 20;
    var enemy1_cnt = 0;

    return function( enemy1s ) {

      enemy1_cnt += 1;
      if ( enemy1_cnt >= enemy1_interval ){
        enemy1_cnt = 0;

        // find a usuable enemy (which is dead )
        for ( var temp_enemy1 in enemy1s ) {
          if ( enemy1s[temp_enemy1].visible === false ) {
            console.log( 'not see' );
            // put this enemy1 to the top of the screen
            var tEnemy = enemy1s[temp_enemy1];
            var randomX = Math.floor( Math.random() * this.width + tEnemy.width / 2 );
            if ( randomX > this.width - tEnemy.width / 2 )
                randomX = tEnemy.width / 2;

            tEnemy.setPosition( randomX, 0 );
            tEnemy.image = tEnemy.originalImage;
            tEnemy.HP = 1;
            tEnemy.show();
            tEnemy.setSpeed( 5 );
            break;
          }
        }
      }

    };
  }();

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
  MYGAME.myAirCraft.update_frame();
  MYGAME.myAirCraft.shoot( MYGAME.bulletPool );
  MYGAME.myAirCraft.update();


  //update bullets
  for (var b in MYGAME.bulletPool ){
    MYGAME.bulletPool[b].update();
  }

  MYGAME.gameScene.createEnemy( MYGAME.enemy1Pool );
  //update enemy1s
  for ( var temp_enemy1 in MYGAME.enemy1Pool ) {
    var current_enemy1 = MYGAME.enemy1Pool[ temp_enemy1 ];
    if ( current_enemy1.visible === true  ){
      if ( current_enemy1.HP <= 0 )
      current_enemy1.explode();
    }
    current_enemy1.update();
  }
}

function checkCollisions()
{
  console.log( "check" );

  //check collision between bullets and enemies
  for( var temp_bullet_index in MYGAME.bulletPool ) {
    var temp_bullet = MYGAME.bulletPool[ temp_bullet_index ];
    if ( temp_bullet.visible === true ) {

      for ( var temp_enemy1_index in MYGAME.enemy1Pool ) {
        var temp_enemy1 = MYGAME.enemy1Pool[ temp_enemy1_index ];
        if( temp_enemy1.visible === true && temp_bullet.collidesWith( temp_enemy1 ) ) {
          temp_enemy1.HP -= 1;
          temp_bullet.visible = false;
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
       // MYGAME.myAirCraft.visible = false;

      //  MYGAME.gameScene.stop();
        var playerExplode = new Sprite( MYGAME.gameScene,
                                       "./image/bffjbx.gif",
                                       66,82);
      }
  }
}


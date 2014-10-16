var MYGAME = {};
var flag = true;

function game_init()
{
  MYGAME.gameScene = new Scene();
  MYGAME.gameScene.setSize(480, 800);

  MYGAME.backgroundSprite = new Sprite(MYGAME.gameScene,
                                       "./assets/bg_01.jpg", 480, 800);
  MYGAME.backgroundSprite.setPosition(240, 400);
  MYGAME.backgroundSprite.setSpeed(0);

  MYGAME.myAirCraft_1 = new Sprite(MYGAME.gameScene,
                                   "./image/wdfj_1.png", 66, 80);
  MYGAME.myAirCraft_1.setPosition(MYGAME.gameScene.getMouseX(),
                                  MYGAME.gameScene.getMouseY());
  MYGAME.myAirCraft_1.setSpeed(0);

  MYGAME.myAirCraft_2 = new Sprite(MYGAME.gameScene,
                                   "./image/wdfj_2.png",
                                   66, 80);
  MYGAME.myAirCraft_2.setPosition(MYGAME.gameScene.getMouseX(),
                                  MYGAME.gameScene.getMouseY());
  MYGAME.myAirCraft_2.setSpeed(0);
  MYGAME.myAirCraft_2.hide();

  MYGAME.gameScene.start();
  MYGAME.console.log( MYGAME.gameScene.getMouseX() );
}

function update()
{
  mouseX = MYGAME.gameScene.getMouseX();
  mouseY = MYGAME.gameScene.getMouseY();
  console.log( mouseX );
  console.log( mouseY );

  MYGAME.gameScene.clear();
  MYGAME.backgroundSprite.update();

  if (flag === true){
    MYGAME.myAirCraft_1.show();
    MYGAME.myAirCraft_2.hide();
  } else {
    MYGAME.myAirCraft_1.hide();
    MYGAME.myAirCraft_2.show();
  }

  flag = !flag;

  MYGAME.myAirCraft_1.setPosition( mouseX, mouseY );
  MYGAME.myAirCraft_1.update();

  MYGAME.myAirCraft_2.setPosition( mouseX, mouseY );
  MYGAME.myAirCraft_2.update();
}


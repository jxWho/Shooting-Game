var MyClasses = {};

//for creating a new object based on the prototype o
if (typeof Object.create !== 'function' )
{
  Object.create = function(o) {
    var F = function (){};
    F.prototype = o;
    return new F();
  };
}

//privode a way to make a method available to all functions
Function.prototype.method = function(name, func) {
  this.prototype[name] = func;
  return this;
};

// for "class" inheritance
Function.method("inherits", function(Parent){
  this.prototype = new Parent();
  return this;
});

// Class for player
MyClasses.MyAirCraft_Class = function(scene, imgeFile1, imgeFile2, width, height){
  var airCraft = new Sprite( scene, imgeFile1, width, height );
  var img1 = airCraft.image;
  var img2 = new Image();
  img2.src = imgeFile2;
  var flag = true;
  var cnt = 0;

  airCraft.setPosition( scene.width / 2, scene.height - airCraft.height  );

  airCraft.update_frame = function(){
    cnt += 0.1;
    if (cnt >= 0.2 ){
      cnt = 0;
      if ( flag === true ){
        this.image = img1;
      } else {
        this.image = img2;
      }

      flag = !flag;
    }
  };

  var bullet_cnt_time = 0;
  airCraft.bullet_interval = 3;
  airCraft.bullet_speed = 30;
  airCraft.shoot = function( bullets ){
    if( airCraft.visible ) {
      bullet_cnt_time += 1;
      if ( bullet_cnt_time >= this.bullet_interval ) {
        bullet_cnt_time = 0;
        // find a possible bullet to shoot
        for ( var temp_bullet in bullets ) {
          if ( bullets[temp_bullet].visible === false ) {
            // reuse this bullet to shoot
              bullets[temp_bullet].show();
              bullets[temp_bullet].setSpeed( airCraft.bullet_speed );
              bullets[temp_bullet].setPosition( this.x, this.y );

              //create sound effect file
              if ( !MyClasses.shootSound)
                MyClasses.shootSound = new Sound("./sound/shoot.mp3");
              MyClasses.shootSound.play();
              break;
          }
        }
      }
    }
  };

  airCraft.update = function() {
    //update each frame for the airCraft to show animation
    airCraft.update_frame();
    //parent update method
    this.x += this.dx;
    this.y += this.dy;
    this.checkBounds();
    if ( this.visible ) {
      this.draw();
    }
  };
  return airCraft;
};

//Class for bullets
MyClasses.Bullet_Class = function(scene, imageFile, width, height){
  var bullet = new Sprite( scene, imageFile, width, height );

  bullet.changeMoveAngleBy( -90 );
  bullet.setBoundAction( DIE );
  bullet.hide();

  return bullet;
};

//Class for enemy airCraft
MyClasses.EnemyClass = function(scene,
                                imageFile,
                                width,
                                height,
                                hp,
                                explodeImageFiles,
                                speed,
                                gotHitImageFile )
{
  var enemy = new Sprite( scene, imageFile, width, height );

  enemy.changeMoveAngleBy( 90 );
  enemy.setBoundAction( DIE );
  enemy.hide();
  enemy.HP = hp;
  enemy.o_HP = hp;
  enemy.o_Speed = speed;
  enemy.originalImage = enemy.image;
  enemy.setSpeed( speed );
  //0 stands for normal status
  //1 stands for got-hit status
  enemy.currentStatus= 0;

  if( gotHitImageFile ){
    enemy.gotHitImage = new Image();
    enemy.gotHitImage.src = gotHitImageFile;
  }

  // number of explosion frames;
  enemy.explodeFrames = explodeImageFiles.length;
  enemy.currentExplodeFrame = 0;
  enemy.explodeImages = [];

  // acts as a time counter;
  enemy.explodeCnt = 0;
  //pre-load images
  for (var i = 0; i < enemy.explodeFrames; i++) {
    var temp_image = new Image();
    temp_image.src = explodeImageFiles[i];
    enemy.explodeImages.push( temp_image );
  }
  enemy.explode = function() {
    this.setSpeed(0);
    this.explodeCnt += 1;
    if ( this.explodeCnt >= 2 ) {
      this.explodeCnt = 0;
      this.currentExplodeFrame += 1;
      if( this.currentExplodeFrame < this.explodeFrames ){
        this.image = this.explodeImages[ this.currentExplodeFrame ];
      } else {
        this.hide();
        this.currentExplodeFrame = 0;
      }
    }
  };

  // set the enemy to its original status
  enemy.reset = function() {
    this.HP = this.o_HP;
    this.image = this.originalImage;
    this.currentStatus = 0;
    this.show();
    this.setSpeed( this.o_Speed );
  };

  enemy.showGotHit = function() {
    if ( this.gotHitImage ) {
      this.image = this.gotHitImage;
    }
  };

  enemy.update = function(){
    //check if got hit
    //when HP is less than 0, it will explode, no need to show gotHit status
    if( this.HP > 0 && this.currentStatus == 1 ) {
      this.showGotHit();
      this.currentStatus = 0;
    } else if ( this.HP > 0 && this.currentStatus === 0 ) {
      this.image = this.originalImage;
    }
    //check if needed to explode
    if( this.visible === true && this.HP <= 0 ){
      this.explode();
    }
    // parent update method
    this.x += this.dx;
    this.y += this.dy;
    this.checkBounds();
    if ( this.visible ){
      this.draw();
    }
  };

  return enemy;
};

MyClasses.FontClass = function( scene, text, size) {
  this.scene = scene;
  this.canvas = scene.canvas;
  this.context = this.canvas.getContext("2d");
  this.text = text;
  this.size = size;
  this.x = 200;
  this.y = 200;

  this.draw = function() {
    ctx = this.context;
    ctx.font = this.size + "px Arial";
    ctx.strokeText(this.text, this.x, this.y);
  };

  this.update = function() {
    this.draw();
  };

  this.setPosition = function( x, y ) {
    this.x = x;
    this.y = y;
  };
};


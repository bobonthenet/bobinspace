var game = new Phaser.Game(800,600, Phaser.AUTO, 'Bob in Space', {preload: preload, create: create, update: update, render: render});

var player;
var starfield;
var cursors;
var bank;
var shipTrail;
var bullets;
var fireButton;
var bulletTimer = 0;

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
  game.load.image('starfield', '/images/starfield.png');
  game.load.image('ship', '/images/player.png');
  game.load.image('bullet', 'images/bullet.png');
}

function create() {
  // The scrolling starfield background
  starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);


  // My ship
  player = game.add.sprite(400, 500, 'ship');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  shipTrail = game.add.emitter(player.x, player.y + 10, 400);
  shipTrail.width = 10
  shipTrail.makeParticles('bullet');
  shipTrail.setXSpeed(30, -30);
  shipTrail.setYSpeed(200, 180);
  shipTrail.setRotation(50, -50);
  shipTrail.setAlpha(1, 0.01, 800);
  shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.start(false, 5000, 10);
}

function update() {
  starfield.tilePosition.y += 2;

  player.body.acceleration.x = 0;

  if (fireButton.isDown) {
    fireBullet();
  }

  if(cursors.left.isDown)
  {
    player.body.acceleration.x = -ACCELERATION;
  }
  else if (cursors.right.isDown)
  {
    player.body.acceleration.x = ACCELERATION;
  }

  if (player.x > game.width - 50) {
    player.x = game.width - 50;
    player.body.acceleration.x = 0;
  }
  if (player.x < 50) {
    player.x = 50;
    player.body.acceleration.x = 0;
  }

  bank = player.body.velocity.x / MAXSPEED;
  player.scale.x = 1 - Math.abs(bank) / 2;
  player.angle = bank * 30;
  shipTrail.x = player.x;
}

function render() {

}

function fireBullet() {

  if (game.time.now > bulletTimer)
  {
    var BULLET_SPEED = 400;
    var BULLET_SPACING = 250;
    var bullet = bullets.getFirstExists(false);
    
    if (bullet)
    {
      var bulletOffset= 20 * Math.sin(game.math.degToRad(player.angle));
      bullet.reset(player.x + bulletOffset, player.y);
      bullet.angle = player.angle;
      game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
      bullet.body.velocity.x += player.body.velocity.x;

      bulletTimer = game.time.now + BULLET_SPACING;
    }
  }
}

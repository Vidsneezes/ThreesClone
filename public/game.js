var game = new Phaser.Game(410, 395, Phaser.AUTO, '2048game');

var PhaserGame = function () {

}

var BoardPiece = function() {

}

var presets = {
            xPad: 5,
            yPad: 2,
            tileWidth: 100,
            tileHeight: 95
        }

BoardPiece.prototype = {
    indexedPosition: {
        x: 0,
        y: 0
    },
    sprite: {},
    init: function(i, j) {
        this.indexedPosition.x = i;
        this.indexedPosition.y = j;
        this.sprite = game.add.sprite(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad,'playPiece');
    },
    movePiece: function(dir){
        this.sprite.x += 3;
    }
}

PhaserGame.prototype = {
    init: function() {

    },
    preload: function() {
        game.load.image('playBoard','static/assets/images/PlayBoard.png');
        game.load.image('playPiece','static/assets/images/PlayPiece.png');
    },
    create: function(){
        var test = game.add.sprite(5,5,'playBoard');
        var board = [];
        var tiles = [1,0,0,0,
                     0,0,0,0,
                     0,0,0,0,
                     0,0,0,0];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
              if(tiles[i+j*4] == 1){
                var tile = new BoardPiece();
                tile.init(i,j);
              }
            }
        }

        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    },
    update: function(){
        if(this.upKey.downDuration(1)){
            console.log("key press");
        }
    },
    resolveCollision: function(tileA,tileB,direction){
        if(direction == 1){
            //check left
        }else if(direction == 2){
            //check right
        }else if(direction == 3){
            //check up
        }else if(direction == 4){
            //check down
        }

    }
};

game.state.add('Game',PhaserGame, true);
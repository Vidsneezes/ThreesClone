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

var style = { font: "35px Arial", fill: "#749de0", align: "center" };

BoardPiece.prototype = {
    indexedPosition: {
        x: 0,
        y: 0
    },
    init: function(i, j) {
        this.baseValue = 2;
        this.indexedPosition.x = i;
        this.indexedPosition.y = j;
        this.sprite = game.add.sprite(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad,'playPiece');
        this.text = game.add.text(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5, "2", style);
        this.text.anchor.set(0.5);
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
                     0,0,1,0,
                     0,0,0,0];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
              if(tiles[i+j*4] == 1){
                var tile = new BoardPiece();
                tile.init(i,j);
                board.add(tile);
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

        }else if(this.downKey.downDuration(1)){

        }else if(this.leftKey.downDuration(1)){

        }else if(this.rightKey.downDuration(1)){

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

    },
    fragmentMovePiece: function(){
        
    }
};

game.state.add('Game',PhaserGame, true);
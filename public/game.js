var game = new Phaser.Game(410, 395, Phaser.AUTO, '2048game');

var PhaserGame = function () {

}

var BoardPiece = function() {

}

var BoardGroup = function() {
}

/*

*/

var presets = {
            xPad: 5,
            yPad: 2,
            tileWidth: 100,
            tileHeight: 95
        }

var style = { font: "35px Arial", fill: "#749de0", align: "center" };

BoardPiece.prototype = {
    init: function(i, j) {
        this.baseValue = 2;
        this.indexedPosition = {
            x:i,y:j
        }
        this.sprite = game.add.sprite(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad,'playPiece');
    },
    movePiece: function(){
        this.sprite.x = this.indexedPosition.x*presets.tileWidth+presets.xPad;
        this.sprite.y = this.indexedPosition.y*presets.tileHeight+presets.yPad;
        this.text.x = this.indexedPosition.x*presets.tileWidth+presets.xPad+presets.tileWidth*0.5;
        this.text.y = this.indexedPosition.y*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5;
    },
    TryMove: function(x,y,checkCollision){
        if( this.indexedPosition.x + x >= 0 && this.indexedPosition.y + y >= 0 &&
            this.indexedPosition.x + x < 4 && this.indexedPosition.y + y < 4){
            this.indexedPosition = {
                x: this.indexedPosition.x + x, y:this.indexedPosition.y + y
            }
            this.movePiece();
        }
    },
    changeValue: function(){
        this.baseValue = 4;
        this.text.setText(this.baseValue);
    }
}

BoardGroup.prototype = {
    init: function(){
       this.groupBase = game.add.group();
       this.textGroup = game.add.group();
       for(var i = 0; i < 16; i++){
            var text = game.add.text(0*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , 0*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5, "2", style, this.textGroup);
            text.anchor.set(0.5);
            this.groupBase.create(20+ i,20,'playPiece');
       }
       this.groupBase.forEach(function(item){
            item.kill();
       });
       this.textGroup.forEach(function(item){
            item.kill();
       })
    },
    killAll: function(){
        this.groupBase.forEach(function(item){
            item.kill();
        });
        this.textGroup.forEach(function(item){
            item.kill();
        })
    },
    placePiece: function(i,j, value){
        var item = this.groupBase.getFirstDead();
        item.reset(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad);
        var textPiece = this.textGroup.getFirstDead();
        textPiece.setText(value);
        textPiece.reset(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5);
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
        this.boardGroup = new BoardGroup();
        this.boardGroup.init();
        this.tiles = [1,0,0,0,
                     0,0,0,0,
                     0,0,1,0,
                     0,0,0,0];
        this.printTiles();
        this.boardRebuildGroup();
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.state = 0;
    },
    printTiles: function(){
        let m = "";
        for(var j =0; j < 4; j++){
            for(var i=0; i < 4; i++){
                m = m + "" + this.tiles[i+j*4];
            }
            m = m +"\n";
        }
        console.log(m);
    },
    update: function(){
        if(this.state === 0){
            this.inputState();
        }
    },
    inputState: function(){
        if(this.upKey.downDuration(1)){
            this.makeMove(1);
        }else if(this.downKey.downDuration(1)){
            this.makeMove(0);
        }else if(this.leftKey.downDuration(1)){
            this.makeMove(2);
        }else if(this.rightKey.downDuration(1)){
            this.makeMove(3);
        }
    },
    makeMove(typeDef){
        this.moveTileLogic(typeDef);
        this.trySpawnNew();
        this.printTiles();
        this.boardRebuildGroup();
    },
    trySpawnNew: function(){
        let container = [];
        for(var i = 0; i < this.tiles.length;i++){
            if(this.tiles[i] === 0){
                container.push(i);
            }
            this.tiles[i] = Math.abs(this.tiles[i]);
        }
        const unclampRand = Math.floor(Math.random() * container.length);
        const randM = Math.min(Math.max(0,unclampRand),container.length-1);
        if(container.length > 0){
            this.tiles[container[randM]] = 1;
        }
    },
    moveTileLogic: function(typeDef){
        if(typeDef === 0){
            for(var j=3;j >= 0;j--){
                for(var i=0; i < 4; i++){
                    if(this.tiles[i+j*4] !== 0)
                    {
                        this.moveDownRecurser(i,j,true);
                    }
                }
            }
        }else if(typeDef === 1){
            for(var j=0;j < 4;j++){
                for(var i=0; i < 4; i++){
                    if(this.tiles[i+j*4] !== 0)
                    {
                        this.moveUpRecurser(i,j,true);
                    }
                }
            }
        }else if(typeDef === 2){
            for(var j=0;j < 4;j++){
                for(var i=0; i < 4; i++){
                    if(this.tiles[i+j*4] !== 0)
                    {
                        this.moveLeftRecurser(i,j,true);
                    }
                }
            }
        }else if(typeDef === 3){
            for(var j=3;j >= 0;j--){
                for(var i=3; i >= 0; i--){
                    if(this.tiles[i+j*4] !== 0)
                    {
                        this.moveRightRecurser(i,j,true);
                    }
                }
            }
        }
    },
    moveUpRecurser: function(i,j,canCombine){
        const augmented = j-1;
        if(augmented >= 0){
            const nextThen = i + augmented*4;
            let tile = {i:i,j:j,canCombine:canCombine,hor:0,ver:-1};
            this.makeMoveCallback(nextThen,tile,(ix,jx,canC) => {this.moveUpRecurser(ix,jx,canC)});
        }
    },
    moveDownRecurser: function(i,j,canCombine){
        const augmented = j+1;
        if(augmented < 4){
            const nextThen = i + augmented*4;
            let tile = {i:i,j:j,canCombine:canCombine,hor:0,ver:1};
            this.makeMoveCallback(nextThen,tile,(ix,jx,canC) => {this.moveDownRecurser(ix,jx,canC)});
        }
    },
    moveRightRecurser: function(i,j,canCombine){
        const augmented = i+1;
        if(augmented < 4){
            const nextThen = augmented + j*4;
            let tile = {i:i,j:j,canCombine:canCombine,hor:1,ver:0};
            this.makeMoveCallback(nextThen,tile,(ix,jx,canC) => {this.moveRightRecurser(ix,jx,canC)});
        }
    },
    moveLeftRecurser: function(i,j,canCombine){
        const augmented = i-1;
        if(augmented >= 0){
            const nextThen = augmented + j*4;
            let tile = {i:i,j:j,canCombine:canCombine,hor:-1,ver:0};
            this.makeMoveCallback(nextThen,tile,(ix,jx,canC) => {this.moveLeftRecurser(ix,jx,canC)});
        }
    },
    makeMoveCallback: function(nextThen,tile,recurser){
        const indexThem = this.tiles[nextThen];
        const value = this.tiles[tile.i+tile.j*4];
        if(indexThem === 0){
            this.tiles[nextThen] = value;
            this.tiles[tile.i+tile.j*4] = 0; 
            recurser(tile.i+tile.hor,tile.j + tile.ver,tile.canCombine);
        }else if(indexThem === value && tile.canCombine === true){
            this.tiles[nextThen] = -(value + value);
            this.tiles[tile.i+tile.j*4] = 0;
            recurser(tile.i+tile.hor,tile.j+tile.ver,false);
        }
    },
    boardRebuildGroup: function(){
        //rebuild group
        this.boardGroup.killAll();
        this.tiles.forEach((tile, index)=>{
            if(tile !== 0){
                const j = Math.floor(index/4);
                const i = index - (j*4);
                this.boardGroup.placePiece(i,j,tile);
            }
        });
    }
};

game.state.add('Game',PhaserGame, true);
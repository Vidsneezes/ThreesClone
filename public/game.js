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
    init: function(i, j) {
        this.baseValue = 2;
        this.indexedPosition = {
            x:i,y:j
        }
        this.sprite = game.add.sprite(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad,'playPiece');
        this.text = game.add.text(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5, this.baseValue, style);
        this.text.anchor.set(0.5);
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

PhaserGame.prototype = {
    init: function() {

    },
    preload: function() {
        game.load.image('playBoard','static/assets/images/PlayBoard.png');
        game.load.image('playPiece','static/assets/images/PlayPiece.png');
    },
    create: function(){
        var test = game.add.sprite(5,5,'playBoard');
        this.board = [];
        this.tiles = [1,0,0,0,
                     1,0,0,0,
                     2,0,0,0,
                     4,0,0,0];
        this.printTiles();
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
                for(var i=0; i < 4; i++){
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
    makeMoveCallback: function(nextOf,tile,recurser){
        const indexThem = this.tiles[nextOf];
        const value = this.tiles[tile.i+tile.j*4];
        if(indexThem === 0){
            this.tiles[nextOf] = value;
            this.tiles[tile.i+tile.j*4] = 0; 
            recurser(tile.i+tile.hor,tile.j + tile.ver,tile.canCombine);
        }else if(indexThem === value && tile.canCombine === true){
            this.tiles[nextOf] = -(value + value);
            this.tiles[tile.i+tile.j*4] = 0;
            recurser(tile.i+tile.hor,tile.j+tile.ver,false);
        }
    },
    boardRebuildGroup: function(){
        //rebuild group
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
    boardMove: function(x,y){
        if(x === -1){
            this.toLeft(4);
        }else if(x === 1){
            this.toRight(0);
        }else if(y === 1){
            this.toDown(0);
        }else if(y === -1){
            this.toUp(4);
        }
    },
    toLeft: function(iter){
        var moveList = [];
        for(var m=1;m < iter;m++){
            for(var i=0;i < this.board.length;i++){
                if(this.board[i].indexedPosition.x === m){
                    moveList.push(this.board[i]);
                }
            }
            for(var i=0;i < moveList.length;i++){
                if(this.checkCollision(moveList[i],-1,0) === false){
                    moveList[i].TryMove(-1,0);
                }
            }
            moveList = [];
        }
        if(iter > 2){
            this.toLeft(iter -1 );
        }
    },  
    toRight: function(iter){
        var moveList = [];
        for(var m=3;m >= iter;m--){
            for(var i=0;i < this.board.length;i++){
                if(this.board[i].indexedPosition.x === m){
                    moveList.push(this.board[i]);
                }
            }
            for(var i=0;i < moveList.length;i++){
                if(this.checkCollision(moveList[i],1,0) === false){
                    moveList[i].TryMove(1,0);
                }
            }
            moveList = [];
        }
        if(iter < 2){
            this.toRight(iter + 1);
        }
    },
    toUp: function(iter){
        var moveList = [];
        for(var m=1;m < iter;m++){
            for(var i=0;i < this.board.length;i++){
                if(this.board[i].indexedPosition.y === m){
                    moveList.push(this.board[i]);
                }
            }
            for(var i=0;i < moveList.length;i++){
                if(this.checkCollision(moveList[i],0,-1) === false){
                    moveList[i].TryMove(0,-1);
                }
            }
            moveList = [];
        }
        if(iter > 2){
            this.toUp(iter -1 );
        }
    },
    toDown: function(iter){
        var moveList = [];
        for(var m=3;m >= iter;m--){
            moveList = this.buildMoveList(m);
            this.tryMove(0,1,moveList);
            moveList = [];
        }
        if(iter < 2){
            this.toDown(iter + 1);
        }
    },
    tryMove: function(hor, ver, moveList){
        let toDestroy = [];
        for(var i=0;i < moveList.length;i++){
            const occupiedGroup = this.checkCollision(moveList[i],hor,ver);
            if(occupiedGroup.occupied === false){
                moveList[i].TryMove(hor,ver);
            }else {
                moveList[i].TryMove(hor,ver);
                moveList[i].changeValue();
                this.board[occupiedGroup.iPos].changeValue();
                toDestroy.push()
            }
        }
    }
    ,
    buildMoveList: function(m){
        let moveList = [];
        for(var i=0;i < this.board.length;i++){
            if(this.board[i].indexedPosition.y === m){
                moveList.push(this.board[i]);
            }
        }
        return moveList;
    },
    checkCollision: function(tile,x,y){
        x = tile.indexedPosition.x + x;
        y = tile.indexedPosition.y + y;
        for(var i=0;i < this.board.length;i++){
            if(this.board[i].indexedPosition.x === x && this.board[i].indexedPosition.y === y){
                return {occupied: true, iPos: i};
            }
        }
        return {occupied: false};
    }
};

game.state.add('Game',PhaserGame, true);
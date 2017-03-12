import React from 'react';
import styles from './app.css';
import 'pixi';
import 'p2';
import Phaser from 'phaser';

var game = new Phaser.Game(410, 395, Phaser.AUTO, '2048game');


var PhaserGame = function () {

}

var BoardGroup = function() {
}

/*

*/

var presets = {
            xPad: 5,
            yPad: 2,
            tileWidth: 100,
            tileHeight: 95,
            moveWait: 150
        }

var style = { font: "35px Arial", fill: "#749de0", align: "center" };

BoardGroup.prototype = {
    init: function(){
       this.groupBase = game.add.group();
       this.textGroup = game.add.group();
       for(var i = 0; i < 16; i++){
            var text = game.add.text(0*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , 0*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5, "2", style, this.textGroup);
            text.anchor.set(0.5);
            var extil = this.groupBase.create(20+ i,20,'playpiece1');
            extil.indexPos = {
                i:0,
                j:0,
                value: 1
            };
            extil.moveOn = false;
            extil.toBeRemove = false;
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
    promptMove: function(i,j,indexThen, value){
        var ended = false;
        console.log(value);
        this.groupBase.forEachAlive(function(item){
            if(ended === false && item.indexPos.i === i && item.indexPos.j === j){
                const newJ = Math.floor(indexThen/4);
                const newI = indexThen - (newJ*4);
                item.indexPos = {
                    i:newI,
                    j:newJ,
                    value: value
                };
                item.moveOn = true;
                ended = true;
            }
        });
    },
    promptRemove: function(i,j){
        var ended = false;
        this.groupBase.forEachAlive(function(item){
            if(ended == false && item.indexPos.i === i && item.indexPos.j === j){
                ended = true;
                item.toBeRemove = true;
            }
        });
    },
    removePieces: function(i,j){
        this.groupBase.forEach(function(item){
            if(item.toBeRemove === true){
                item.kill();
                item.toBeRemove = false;
            }
        });
    },
    movePieces: function(){
        this.groupBase.forEachAlive(function(item){
            if(item.moveOn === true && item.toBeRemove === false){
                item.moveOn = false;
                game.add.tween(item).to({x:item.indexPos.i*presets.tileWidth+presets.xPad,y:item.indexPos.j*presets.tileHeight+presets.yPad},presets.moveWait,"Linear",true);
            }
        });
    },
    moveDone: function(){
        this.groupBase.forEachAlive(function(item){
            if(item.indexPos.value < 3000){
                item.loadTexture("playpiece"+item.indexPos.value);
            }else {
                item.loadTexture("playpiecex");
            }
        })
    },
    placePiece: function(i,j, value){
        var item = this.groupBase.getFirstDead();
        item.reset(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad);
        item.indexPos = {
            i: i,
            j:j,
            value: 1
        };
        item.loadTexture("playpiece"+item.indexPos.value);
        //var textPiece = this.textGroup.getFirstDead();
        //textPiece.setText(value);
       //textPiece.reset(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5);
    },
    placeNewPiece: function(i,j,value){
        var item = this.groupBase.getFirstDead();
        item.reset(i*presets.tileWidth+presets.xPad,j*presets.tileHeight+presets.yPad);
        item.alpha = 0;
        item.indexPos = {
            i:i,
            j:j,
            value:1
        };
        item.loadTexture("playpiece"+item.indexPos.value);
        game.add.tween(item).to({alpha: 1},100,"Linear",true);
        //var textPiece = this.textGroup.getFirstDead();
        //textPiece.setText(value);
        //textPiece.reset(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5);
        //textPiece.alpha = 0;
        //game.add.tween(textPiece).to({alpha: 1},100,"Linear",true);
        
    },
    rebuildText: function(tiles){
        this.textGroup.forEach(function(item){
            item.kill();
        })
        for(var xi = 0; xi < tiles.length; xi++){
            if(tiles[xi] !== 0){
                const j = Math.floor(xi/4);
                const i = xi - (j*4);
                var textPiece = this.textGroup.getFirstDead();
                textPiece.setText(tiles[xi]);
                textPiece.reset(i*presets.tileWidth+presets.xPad+presets.tileWidth*0.5 , j*presets.tileHeight+presets.yPad + presets.tileHeight* 0.5);
                textPiece.alpha = 1;
            }
        }
    }
}

PhaserGame.prototype = {
    init: function() {

    },
    preload: function() {
        game.load.image('playBoard','public/assets/images/PlayBoard.png');
        game.load.image('playpiece1','public/assets/images/playpiece1.png');
        game.load.image('playpiece2','public/assets/images/playpiece2.png');
        game.load.image('playpiece4','public/assets/images/playpiece4.png');
        game.load.image('playpiece8','public/assets/images/playpiece8.png');
        game.load.image('playpiece16','public/assets/images/playpiece16.png');
        game.load.image('playpiece32','public/assets/images/playpiece32.png');
        game.load.image('playpiece64','public/assets/images/playpiece64.png');
        game.load.image('playpiece128','public/assets/images/playpiece128.png');
        game.load.image('playpiece256','public/assets/images/playpiece256.png');
        game.load.image('playpiece512','public/assets/images/playpiece512.png');
        game.load.image('playpiece1024','public/assets/images/playpiece1024.png');
        game.load.image('playpiece2048','public/assets/images/playpiece2048.png');
        game.load.image('playpiecex','public/assets/images/playpiecex.png');
        
    },
    create: function(){
        var test = game.add.sprite(5,5,'playBoard');
        this.boardGroup = new BoardGroup();
        this.boardGroup.init();
        this.tiles = [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0];
        this.printTiles();
        this.boardRebuildGroup();
        this.boardGroup.rebuildText(this.tiles);
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
        let container = [];
        for(var i = 0; i < this.tiles.length;i++){
            if(this.tiles[i] === 0){
                container.push(i);
            }
            this.tiles[i] = Math.abs(this.tiles[i]);
        }
        this.printTiles();
        this.boardGroup.movePieces();
        game.time.events.add(presets.moveWait + 4,()=>{ 
            this.boardGroup.removePieces();
            this.boardGroup.moveDone();
            this.boardGroup.groupBase.sort('y',Phaser.Group.SORT_ASCENDING);
            this.state = 0;
            this.trySpawnNew(container);
            this.boardGroup.rebuildText(this.tiles);
        },this)
        this.state = 1;
    },
    trySpawnNew: function(container){
        const unclampRand = Math.floor(Math.random() * container.length);
        const randM = Math.min(Math.max(0,unclampRand),container.length-1);
        const index = container[randM];
        if(container.length > 0){
            this.tiles[index] = 1;
            const j = Math.floor(index/4);
            const i = index - (j*4);
            this.boardGroup.placeNewPiece(i,j,1);
            this.boardGroup.groupBase.sort('y',Phaser.Group.SORT_ASCENDING);
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
            this.boardGroup.promptMove(tile.i,tile.j,nextThen,this.tiles[nextThen]);
            recurser(tile.i+tile.hor,tile.j + tile.ver,tile.canCombine);
        }else if(indexThem === value && tile.canCombine === true){
            const newJ = Math.floor(nextThen/4);
            const newI = nextThen - (newJ*4);
            this.boardGroup.promptRemove(newI,newJ);
            this.tiles[nextThen] = -(value + value);
            this.tiles[tile.i+tile.j*4] = 0;
            this.boardGroup.promptMove(tile.i,tile.j,nextThen,Math.abs(this.tiles[nextThen]));
            recurser(tile.i+tile.hor,tile.j+tile.ver,false);
        }
    },
    boardRebuildGroup: function(){
        //rebuild group
        this.tiles.forEach((tile, index)=>{
            if(tile !== 0){
                const j = Math.floor(index/4);
                const i = index - (j*4);
                this.boardGroup.placePiece(i,j,tile);
            }
        });
    },
    gameStart: function(){
        game.state.add('Game',PhaserGame, true);
    }
};

class App extends React.Component {
    render(){
        game.state.add('Game',PhaserGame, true);
        return (
            <div >
                <div className={styles.border}>
                </div>
                <div id="2048game" className={styles.game}></div>
            </div>
        );
    }
}

export default App;
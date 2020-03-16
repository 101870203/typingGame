var board = {
    dom: document.getElementById("score"),
    maxLost: 3,////最大丢失量
    lost: 0,//当前丢失了多少个
    score: 0,//当前分数
    render: function () {
        this.dom.innerHTML = `
        <p>得分${this.score}</p>
        <p>丢失${this.lost}/${this.maxLost}</p>`
    },
    //增加一个丢失数
    addLost: function () {
        if (this.lost === this.maxLost) {
            return
        };
        this.lost += 1;
        if (this.lost === this.maxLost) {
            game.gameOver();
        }
        this.render();
    },
    reset: function () {
        this.lost = 0;
        this.score = 0;
        this.render();
    },
    //增加得分
    addScore: function (number) {
        if (this.lost === this.maxLost) {
            return
        };
        this.score += number;
        this.render();
    }
}
board.render();
var letters = []; //目前的所有字母，一个字母就是一个对象
//字母的容器
var divContainer = document.getElementById("letter-container");
/**
 * 产生一个字母对象，并将其加入到数组中
 */
function createLetter() {
    //创建img元素
    var img = document.createElement("img");
    img.className = "letter";
    divContainer.appendChild(img);

    //设置图片路径
    var charNumber = getRandom(65, 65 + 26); //字母的随机ASCII码
    var char = String.fromCharCode(charNumber);
    img.src = "img/letter/" + char + ".png";
    console.log(char);

    var left = getRandom(0, divContainer.clientWidth - img.width);
    img.style.left = left + "px";
    img.style.top = -img.height + "px";
    var letter = {
        dom: img,
        char: char,
        left: left,
        top: -img.height,//初始top值
        speed: getRandom(100, 500),//速度：像素/秒
        render: function () {
            this.dom.style.top = this.top + "px";
        },
        move: function (duration) {
            var dis = duration * this.speed;
            this.top += dis;
            this.render();
        },
        kill() {
            var index = letters.indexOf(this);
            if (index >= 0) {
                letters.splice(index, 1);
            }
            // 移除dom
            this.dom.remove();
        }
    }
    letters.push(letter);
}

var game = {
    timerProduce: null,//自动产生字母的timerid
    timerMove: null,//自动移动的timerid
    isOver: false,
    //自动的，不断的产生字母
    startProduce: function () {
        if (this.timerProduce) {
            return
        };
        this.timerProduce = setInterval(createLetter, 500);
    },
    //停止产生字母
    stopProduce() {
        clearInterval(this.timerProduce);
        this.timerProduce = null;
    },
    startMove: function () {
        if (this.timerMove) {
            return
        };
        var duration = 0.016; //间隔时间，秒
        this.timerMove = setInterval(function () {
            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                letter.move(duration);
                if (letter.top >= divContainer.clientHeight) {
                    letter.kill();
                    i--;
                    //丢失分数
                    board.addLost();
                }
            }
        }, duration * 1000);
    },
    stopMove: function () {
        clearInterval(this.timerMove);
        this.timerMove = null;
    },
    gameOver: function () {
        this.stopProduce();
        this.stopMove();
        document.getElementById("over").style.display = "block";
        this.isOver = true;
    },
    restart: function () {
        // 清除画布
        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            letter.kill();
            i--;
        }
        this.startMove();
        this.startProduce();
        board.reset();
        this.isOver = false;
        document.getElementById("over").style.display = "none";
    }
}
//开始游戏
game.startProduce();
game.startMove();
//重新开始
var over = document.getElementById("over");
over.onclick = function() {
   game.restart();

}

window.onkeydown = function (e) {
    if (game.isOver) {
        return
    };
    var key = e.key.toUpperCase();

    for (var i = 0; i < this.letters.length; i++) {
        var letter = this.letters[i];
        if (letter.char === key) {
            letter.kill();
            this.board.addScore(10);
            return;//只移除一个
        }
    }
}

// 根据最小值和最大值产生一个随机整数(不包含最大值)
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
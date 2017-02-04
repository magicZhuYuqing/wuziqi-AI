var chessBoard = [];
var me = true;


for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}
var over = false;
//赢法数组
var wins = [];
//赢法的统计数组
var myWin = [];
var computeWin = [];

for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

var count = 0;
//所有横线的赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

//所有竖线的赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 15; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j][count] = true;
        }
        count++;
    }
}

//所有斜线的赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

//所有反斜线的赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}
console.log(count);

for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computeWin[i] = 0;
}
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

// context.strokeStyle = "#BBBBBB"
var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function() {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();

}

var drawChessBoard = function() {
    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 0 + 15)
        context.lineTo(15 + i * 30, 450 - 15);
        context.stroke();
        context.moveTo(0 + 15, 15 + i * 30)
        context.lineTo(450 - 15, 15 + i * 30);
        context.stroke();
    }
}

var oneStep = function(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30, 15 + j * 30, 13, 15 + i * 30, 15 + j * 30, 0);
    if (me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }

    context.fillStyle = gradient;
    context.fill();
}

chess.onclick = function(e) {
    if (over) {
        return; //如果已经结束了，直接返回
    }
    if (!me) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, me);
        chessBoard[i][j] = 1;
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computeWin[k] = 6;
                if (myWin[k] == 5) {
                    window.alert("你赢了");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computeAI();
        }
    }

}
var computeAI = function() {
    var myScore = [];
    var computeScore = [];
    var max = 0;
    var u = 0,
        v = 0;
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computeScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computeScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }

                        if (computeWin[k] == 1) {
                            computeScore[i][j] += 220;
                        } else if (computeWin[k] == 2) {
                            computeScore[i][j] += 420;
                        } else if (computeWin[k] == 3) {
                            computeScore[i][j] += 2200;
                        } else if (computeWin[k] == 4) {
                            computeScore[i][j] += 20000;
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) {
                    if (computeScore[i][j] > computeScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if (computeScore[i][j] > max) {
                    max = computeScore[i][j];
                    u = i;
                    v = j;
                } else if (computeScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u, v, false);
    chessBoard[u][v] = 2;

    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computeWin[k]++;
            myWin[k] = 6;
            if (computeWin[k] == 5) {
                window.alert("计算机赢了");
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }

}

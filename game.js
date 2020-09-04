var isNewGame = true;//to determine if a new is started or a game is loaded ( false for load true for new game)
var isGameEnded = false;
(function () {

    var CSS = {
        selection: {

            background: 'black'
        },
        welcomeMessage: {

            color: 'white'
        },
        buttons: {
            fontWeight: 100,
            display: 'inline-block',
            padding: 20,
            borderRadius: 5,
            border: 'none',
            margin: 5
        },
        button1: {

        },
        button2: {

        },
        button3: {

        },
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },

        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            right: 0,
            top: 150
        },
        scores: {
            width: 40,
            height: 40,
            top: 0,
            position: 'absolute',
            fontSize: '40px'

        },
        scorePlayer1: {
            left: 400
        },
        scorePlayer2: {
            left: 500

        }

    };

    var CONSTS = {
        gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        scoreToWin: 2,
        mode: '',
        cpuModel: ''
    };

    function start() {
        if (isNewGame) {
            selectionMenuDraw();
        }
        else {
            draw();
        }
        setEvents();
        roll(0);
        loop();
    }
    function selectionMenuDraw() {

        $('<div/>', { id: 'selection-menu' }).css(CSS.selection).appendTo('body');
        $('<div/>', { id: 'welcome-message' }).css(CSS.welcomeMessage).appendTo('#selection-menu');
        $('#welcome-message').text("Welcome to Ping Pong Game, Select Your Game Mode");
        $('<button/>', { id: 'button1' }).css($.extend(CSS.button1, CSS.buttons))
            .appendTo('#selection-menu');
        $('#button1').text("2 Player");
        $('<button/>', { id: 'button2' }).css($.extend(CSS.button2, CSS.buttons))
            .appendTo('#selection-menu');
        $('#button2').text("Player vs Cpu");
        $('<button/>', { id: 'button3' }).css($.extend(CSS.button3, CSS.buttons))
            .appendTo('#selection-menu');
        $('#button3').text("Cpu vs Cpu");
        





        $("#button1").click(function () {

            CONSTS.mode = '2Player';
            draw();
            $("#selection-menu").remove();
        });
        $("#button2").click(function () {

            CONSTS.mode = 'PlayerVsCpu';
            CONSTS.cpuModel = 'yFollow';
            draw();
            $("#selection-menu").remove();
        });
        $("#button3").click(function () {

            CONSTS.mode = 'CpuVsCpu';
            CONSTS.cpuModel = 'yFollow';
            draw();
            $("#selection-menu").remove();
        });

    }
    function draw() {
        $('<div/>', { id: 'pong-game' }).css(CSS.arena).appendTo('body');
        $('<div/>', { id: 'pong-line' }).css(CSS.line).appendTo('#pong-game');
        $('<div/>', { id: 'score-1' }).css($.extend(CSS.scorePlayer1, CSS.scores))
            .appendTo('#pong-game');
        $('<div/>', { id: 'score-2' }).css($.extend(CSS.scorePlayer2, CSS.scores))
            .appendTo('#pong-game');
        $('#score-1').text(CONSTS.score1);
        $('#score-2').text(CONSTS.score2);
        $('<div/>', { id: 'pong-ball' }).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', { id: 'stick-1' }).css($.extend(CSS.stick1, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'stick-2' }).css($.extend(CSS.stick2, CSS.stick))
            .appendTo('#pong-game');
            
      
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87 && CONSTS.mode !== 'CpuVsCpu') {
                CONSTS.stick1Speed = -6;
            }
            if (e.keyCode == 83 && CONSTS.mode !== 'CpuVsCpu') {
                CONSTS.stick1Speed = 6;
            }
            if (e.keyCode == 38 && CONSTS.mode === '2Player') {

                CONSTS.stick2Speed = -6;
            }
            if (e.keyCode == 40 && CONSTS.mode === '2Player') {
                CONSTS.stick2Speed = 6;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 87 || e.keyCode == 83 && CONSTS.mode !== 'CpuVsCpu') {
                CONSTS.stick1Speed = 0;
            }
            if ((e.keyCode == 38 || e.keyCode == 40) && CONSTS.mode === '2Player') {
                CONSTS.stick2Speed = 0;
            }
        });
    }
    $(window).on("unload", function (e) {
        if (isGameEnded === false) {
            localStorage.setItem("myCss", JSON.stringify(CSS));
            localStorage.setItem("myConsts", JSON.stringify(CONSTS));
        }
        else {
            localStorage.clear();
        }
    });
    function cpuController(request) {
        if (request === 'speed') {
            if (CONSTS.mode === 'PlayerVsCpu') {
                let s2Speed = calcStickSpeed(2);
                return s2Speed;
            } else if (CONSTS.mode === 'CpuVsCpu') {
                let s1Speed = calcStickSpeed(1);
                let s2Speed = calcStickSpeed(2);
                return [ s1Speed, s2Speed ];
            } else {
                return;
            }
        } else {
            return null;
        }
    }

    function calcStickSpeed(stickNum) {
        var array = [0, CSS.stick1, CSS.stick2];


        if (CONSTS.cpuModel === 'yFollow') {
           
            if (CSS.ball.top > array[stickNum].top) {
                if (stickNum === 1) {  return CONSTS.stick1Speed = 6 }
                else { return CONSTS.stick2Speed = 6 }
            }
            else if (CSS.ball.top < array[stickNum].top) {
                if (stickNum === 1) { return CONSTS.stick1Speed = -6 }
                else { return CONSTS.stick2Speed = -6 }
            }
            else {
                if (stickNum === 1) { 
                    return CONSTS.stick1Speed = 0; 
                }
                else { 
                    return CONSTS.stick2Speed = 0; 
                }
            }
        }  else {
            return null;
        }
    }
    function loop() {
        window.pongLoop = setInterval(function () {
            
            if (CONSTS.mode === 'PlayerVsCpu') {

                var speed=cpuController("speed");
                CONSTS.stick2Speed=speed;
                
                

            }
            else if (CONSTS.mode === 'CpuVsCpu') {

                var speeds=cpuController("speed");
                /*if (CSS.stick2.top <= 0 || CSS.stick2.top >= CSS.arena.height - CSS.stick2.height) {
                    CONSTS.stick2Speed = CONSTS.stick2Speed * -1;
                }
                if (CSS.stick1.top <= 0 || CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) {
                    CONSTS.stick1Speed = CONSTS.stick1Speed * -1;
                }*/
                CONSTS.stick1Speed=speeds[0];

                CONSTS.stick2Speed=speeds[1];
                

            }
            
            CSS.stick1.top += CONSTS.stick1Speed;
            CSS.stick2.top += CONSTS.stick2Speed;


            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);

            if (CSS.stick1.top <= 0) {
                CSS.stick1.top = 0;
            }
            if (CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) {
                CSS.stick1.top = CSS.arena.height - CSS.stick1.height;
            }
            if (CSS.stick2.top <= 0) {
                CSS.stick2.top = 0;
            }
            if (CSS.stick2.top >= CSS.arena.height - CSS.stick2.height) {
                CSS.stick2.top = CSS.arena.height - CSS.stick2.height;
            }

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }


            $('#pong-ball').css({ top: CSS.ball.top, left: CSS.ball.left });

            if (CSS.ball.left <= CSS.stick.width) {
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll(2)//if winner is right send 2 ;

            }
            if (CSS.ball.left >= CSS.arena.width - CSS.stick.width - CSS.ball.width) {

                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll(1)//if winner is left send 1;

            }
            /*
                        if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                            roll();
                        }*/
        }, CONSTS.gameSpeed);
    }

    function roll(winner) {


        if (winner == 1) {
            CONSTS.score1++;
        }
        else if (winner == 2) {
            CONSTS.score2++;

        }
        $('#score-1').text(CONSTS.score1);
        $('#score-2').text(CONSTS.score2);


        if (CONSTS.score1 >= CONSTS.scoreToWin || CONSTS.score2 >= CONSTS.scoreToWin) {
            isGameEnded = true;
            clearInterval(window.pongLoop);
            window.pongLoop = null; //finishes the game if one of the players reach max score
        }
        if (isNewGame === true) {
            CSS.ball.top = CSS.arena.height / 2;
            CSS.ball.left = CSS.arena.width / 2;

            var side = -1;

            if (Math.random() < 0.5) {
                side = 1;
            }

            CONSTS.ballTopSpeed = Math.random() * -2 - 3;
            CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
        }
        isNewGame = true;

    }

    if ("myCss" in localStorage) {

        CONSTS = JSON.parse(window.localStorage.getItem("myConsts"));
        CSS = JSON.parse(window.localStorage.getItem("myCss"));
        isNewGame = false;
    }

    start();


}
)();

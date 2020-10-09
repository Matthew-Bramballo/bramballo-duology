gameInstance = null;

window.onload = function () {
    var gameConfig = {
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
        scene:  [
            ScInit, ScMenu, ScGame1, ScGame2
        ],
        scale: {
            mode: Phaser.Scale.FIT,
        },
        autoRound: false
    }
    gameInstance = new Phaser.Game(gameConfig);
    gameInstance.canvas.parentElement.style.backgroundColor = "#000000";
}
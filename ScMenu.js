class ScMenu extends Phaser.Scene   {
    constructor()   {
        super("menuGame")
    }

    create()    {
        this.funnyno = this.sound.add("funnyno")

        new TextButton(this, 960, 800, "Play Matthew Bramballo in: Boohbahmobile Troubles", {}, () => {
            this.scene.start("playGame1");
            this.musicIndex.stop();
            this.musicIndex.destroy();
        }).setOrigin(0.5)

        new TextButton(this, 960, 880, "Play Matthew Bramballo in: Basement Escapades", {}, () => {
            this.scene.start("playGame2");
            this.musicIndex.stop();
            this.musicIndex.destroy();
        }).setOrigin(0.5)

        new TextButton(this, 960, 960, "Quit", {}, () => {
            window.close();
        }).setOrigin(0.5)

        // Draw Menu Background
        this.add.image(960, 540, "bgMenu").setDepth(-20)
        
        // Draw Menu Logo
        this.menuLogo = this.add.image(960, 400, "sLogo").setDepth(-10).setOrigin(0.5);

        // Play Menu Music
        this.musicIndex = this.sound.add("Music1");
        this.musicIndex.setLoop(true);
        this.musicIndex.play();

        this.tweenValue = 0;
    }

    update()    {
        this.menuLogo.angle = Math.sin(this.tweenValue) * 0.6;
        this.tweenValue += 0.01;
        gameInstance.scale.pageAlignHorizontally = true;
        gameInstance.scale.pageAlignVertically = true;
        gameInstance.scale.refresh();
    }
}
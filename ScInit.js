preloadTextObject = null;
preloadTextStrings = [
    "MATTHEW BRAMBALLO is LOADING...\n",
    "MATTHEW BRAMBALLO is FINISHED.\n\nCLICK TO CONTINUE."
]
testButton = null;

class TextButton extends Phaser.GameObjects.Text  {
    constructor(scene, x, y, text, style, callback)   {
        super(scene, x, y, text, style, callback);
        scene.add.existing(this)

        this.redTween = 200;
        this.tweenAmount = 0;
        this.startX = x;
        this.startY = y;
    
        this.setInteractive({useHandCursor: true});
        this.setStyle({
            fontFamily: "WarioWareIncV2",
            fontSize: "48px",
            color: rgbToHex(128, 128, 128),
            strokeThickness: 2,
            stroke: "#000000"
        })
        .on("pointerover", () => this.buttonStateHover())
        .on("pointerout", () => this.buttonStateRest())
        .on("pointerdown", () => this.buttonStateActive())
        .on("pointerup", () => {
            this.buttonStateHover();
            callback();
        })
        
        this.setStyle({ fontSize: "64px"})
    }

    preUpdate()    {
        this.tweenAmount += 0.1;
        switch(this.buttonState)    {
            case "Hover":
                this.x = this.startX + Math.sin(this.tweenAmount);
                this.y = this.startY;
                this.buttonSetColour(rgbToHex(180, 200, 220))
                break;
            case "Rest":
                this.x = this.startX;
                this.y = this.startY;
                this.buttonSetColour(rgbToHex(128, 128, 128))
                break;
            case "Active":
                this.buttonSetColour(rgbToHex(255, 255, 255))
                this.x = this.startX;
                this.y = this.startY;
                break;
        }
    }

    buttonSetColour(colour) {
        this.setStyle({color: colour})
    }

    buttonStateHover()  {
        this.buttonState = "Hover";
    }

    buttonStateRest()   {
        this.buttonState = "Rest";
    }

    buttonStateActive() {
        this.buttonState = "Active";
    }
}

class SpriteButton extends Phaser.GameObjects.Image  {
    constructor(scene, x, y, texture, callback)   {
        super(scene, x, y, texture, callback);
        scene.add.existing(this)

        this.redTween = 200;
        this.tweenAmount = 0;
        this.startX = x;
        this.startY = y;
        this.buttonEnabled = true;
    
        this.setInteractive({useHandCursor: true})
        .on("pointerover", () => this.buttonStateHover())
        .on("pointerout", () => this.buttonStateRest())
        .on("pointerdown", () => this.buttonStateActive())
        .on("pointerup", () => {
            this.buttonStateHover();
            callback();
        })
    }

    preUpdate()    {

        if (this.buttonEnabled)  {
            this.setInteractive(true);
            this.alpha = 1;
        }   else    {
            this.setInteractive(false);
            this.alpha = 0;
        }

        this.tweenAmount += 0.1;
        switch(this.buttonState)    {
            case "Hover":
                this.x = this.startX + Math.sin(this.tweenAmount);
                this.y = this.startY;
                break;
            case "Rest":
                this.x = this.startX;
                this.y = this.startY;
                break;
            case "Active":
                this.x = this.startX;
                this.y = this.startY;
                break;
        }
    }

    buttonStateHover()  {
        this.buttonState = "Hover";
    }

    buttonStateRest()   {
        this.buttonState = "Rest";
    }

    buttonStateActive() {
        this.buttonState = "Active";
    }
}

class ScInit extends Phaser.Scene   {
    constructor()   {
        super("initGame")
    }

    preload()   {
        this.tweenAmount = 0;

        let preloadTextStringsAdd = "0%";
        preloadTextObject = this.add.text(960, 540, preloadTextStrings[0] + preloadTextStringsAdd, {
            fontSize: '24px',
            align: "center",
            fontFamily: "WarioWareIncV2"
        }).setOrigin(0.5);

        // Music Loading
        this.load.audio("Music1", ["Assets/Audio/Music1.mp3", "Assets/Audio/Music1.ogg"]);
        this.load.audio("Music2", ["Assets/Audio/Music2.mp3", "Assets/Audio/Music2.ogg"]);
        this.load.audio("Music3", ["Assets/Audio/Music3.mp3", "Assets/Audio/Music3.ogg"]);
        this.load.audio("funnyno", ["Assets/Audio/funnyno.mp3", "Assets/Audio/funnyno.ogg"]);
        
        // Art Loading
        this.load.image("bgMenu", "Assets/Graphics/bgMenu.png");
        this.load.image("sLogo", "Assets/Graphics/sLogo.png");
        this.load.image("sButtonPlay", "Assets/Graphics/sButtonPlay.png");
        this.load.image("sButtonPause", "Assets/Graphics/sButtonPause.png")

        // Video Loading
        this.load.video("videoGame1", "Assets/Video/videoGame1.mp4");
        this.load.video("videoGame2", "Assets/Video/videoGame2.mp4");

        this.load.on("progress", function (value) {
            let preloadTextStringsAdd = Math.floor(value * 100) + "%";
            preloadTextObject.text = preloadTextStrings[0] + preloadTextStringsAdd;
        });
    }

    create()    {
        preloadTextObject.text = preloadTextStrings[1];

        this.input.on("pointerdown", function (pointer) {
            this.scene.start("menuGame")
        }, this);
    }

    update()    {
        this.tweenAmount += 0.1;
        preloadTextObject.x = 960 + Math.sin(this.tweenAmount);
        preloadTextObject.angle = Math.sin(this.tweenAmount) * 2
        gameInstance.scale.pageAlignHorizontally = true;
        gameInstance.scale.pageAlignVertically = true;
        gameInstance.scale.refresh();
    }
}
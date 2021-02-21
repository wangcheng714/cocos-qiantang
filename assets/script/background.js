// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Sprite,
        },
        bg1: {
            default: [],
            type: [cc.SpriteFrame],
        },
        node_skins: { //皮肤节点
            default: [],
            type: [cc.Node]
        },
        node_shuiBoWen: {
            default: null,
            type: cc.Node
        },
        node_fish: {
            default: null,
            type: cc.Node
        },
        node_particle: {
            default: [],
            type: [cc.ParticleSystem]
        }
    },

    onLoad () {
        this.initShuiBoWen();
        this.initFishTime();
        this.fishBeginPosition = cc.v2(0, 0);
        this.disableAllParticle();
    },

    disableAllSkin() {
        for(let i = 0; i < this.node_skins.length; i++) {
            this.node_skins[i].active = false;
        }
    },

    disableAllParticle() {
        for (let i = 0; i < this.node_particle.length; i++) {
            if (this.node_particle[i]) {
                this.node_particle[i].node.active = false;
            }
        }
    },

    initShuiBoWen() {
        // 水波纹已经等待的时间
        this.shuiBoWenWaitTimes = 0;
        // 水波纹需要等待的随机时间 1s中60次
        this.shuiBoWenRandomWait = 180 + Math.random() * 120;
    },

    initFishTime() {
        // 鱼儿已经等待的时间
        this.fishWaitTimes = 0;
        // 鱼儿需要等待的随机时间
        this.fishRandomWait = 600 + Math.random() * 200;
    },

    // 随机播放水波纹
    playShuiBoWen() {
        const positionX = Math.random() * 720 - 360;
        const positionY = Math.random() * 1280 - 640;
        this.node_shuiBoWen.setPosition(cc.v2(positionX, positionY));
        const shuiBoWenAnimation = this.node_shuiBoWen.getComponent(cc.Animation);
        shuiBoWenAnimation.play('shuiBoWen');
    },

    playFish() {
        //停止所有的鱼儿动画
        this.node_fish.stopAllActions();
        const fishs = this.node_fish.children;
        const fishActionList = [
            {
                time: 5,
                list: [cc.v2(420,568),cc.v2(-70,345),cc.v2(-460,650)]
            },
            {
                time: 7,
                list: [cc.v2(-300,650),cc.v2(166,46),cc.v2(-180,-828)]
            },
            {
                time: 4,
                list: [cc.v2(450,40),cc.v2(-170,-780)]
            },
            {
                time: 10,
                list: [cc.v2(-500,-227),cc.v2(100,-747),cc.v2(300,700)]
            }
        ];
        const randomFish = Math.floor(Math.random() * 2);
        const randomActionIndex = Math.floor(Math.random() * 3);
        const randomAction = fishActionList[randomActionIndex];
        console.log(randomActionIndex);
        for (let i = 0; i < fishs.length; i++) {
            fishs[i].active = false;
        }
        fishs[randomFish].active = true;
        const swimAction = cc.cardinalSplineTo(randomAction.time, randomAction.list, 0);
        this.node_fish.runAction(swimAction);
    },

    btnCallback(sender, str) {
        cc.log(str);
        this.disableAllSkin();
        this.disableAllParticle();
        const num = Math.floor(Math.random() * 9);
        this.bg.spriteFrame = this.bg1[num];
        this.node_skins[num].active= true;
        this.node_particle[num].node.active = true;
    },

    update (dt) {
        this.shuiBoWenWaitTimes++;
        if (this.shuiBoWenWaitTimes > this.shuiBoWenRandomWait) {
            this.playShuiBoWen();
            this.initShuiBoWen();
        }
        this.fishWaitTimes++;
        if (this.fishWaitTimes > this.fishRandomWait) {
            this.initFishTime();
            this.playFish();
        }
        const fishEndPosition = this.node_fish.getPosition();
        if (this.fishBeginPosition.x !== fishEndPosition.x && this.fishBeginPosition.y !== fishEndPosition.y) {
            const angle = this.getAngle(this.fishBeginPosition, fishEndPosition);
            this.node_fish.angle = -angle;
        }
        this.fishBeginPosition = fishEndPosition;
    },

    // 获取两个点之间的角度
    getAngle:function(start,end){
        var x = end.x - start.x
        var y = end.y - start.y
        var hypotenuse = Math.sqrt(x*x + y*y)

        var cos = x / hypotenuse
        var radian = Math.acos(cos)

        //求出弧度
        var angle = 180 / (Math.PI / radian)
        //用弧度算出角度
        if(y < 0){
            angle = 0-angle
        }else if(y == 0 && x < 0){
            angle = 180
        }
        return 90-angle
    }
});
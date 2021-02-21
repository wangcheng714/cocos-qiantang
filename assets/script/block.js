const Global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {
        spf: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setBlockXY();
        this.setTouchEvent();
    },

    setTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.log('touch_start');
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (this.direction === 'x') { //只能X轴移动
                this.node.setPosition(cc.v2(
                    this.node.getPosition().x + event.getDelta().x,
                    this.node.getPosition().y,
                ));
            } else if(this.direction === 'y'){ //只能Y轴移动
                this.node.setPosition(cc.v2(
                    this.node.getPosition().x,
                    this.node.getPosition().y + event.getDelta().y,
                ));
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.setBlockXY();
            this.setBlockPosition(this.x, this.y);
            Game.updateBlockHolder();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.setBlockXY();
            this.setBlockPosition(this.x, this.y);
            Game.updateBlockHolder();
        }, this);
    },

    //初始化一个木块：每次创建一个block的时候需要调用
    //TODO: 如何在构造函数期间就完成初始化，不用显示调用
    init(size, position){
        this.blockSize = size;
        const sizeToken = this.blockSize.split('_');
        if (sizeToken.length !== 2) {
            cc.log(`blockSize=${this.blockSize}不合法，请检查！`);
            return ;
        }
        this.blockWidth = Number.parseInt(sizeToken[0]);
        this.blockHeight = Number.parseInt(sizeToken[1]);
        switch(size) {
            case '1_2':
                this.node.width = 108;
                this.node.height = 220;
                //规定block的移动方向
                this.direction = 'y';
                this.node.getComponent(cc.Sprite).spriteFrame = this.spf[0];
                break;
            case '1_3':
                this.node.width = 108;
                this.node.height = 332;
                this.direction = 'y';
                this.node.getComponent(cc.Sprite).spriteFrame = this.spf[1];
                break;
            case '2_1':
                this.node.width = 220;
                this.node.height = 108;
                this.direction = 'x';
                this.node.getComponent(cc.Sprite).spriteFrame = this.spf[2];
                break;
            case '3_1':
                this.node.width = 332;
                this.node.height = 108;
                this.direction = 'x';
                this.node.getComponent(cc.Sprite).spriteFrame = this.spf[3];
                break;
        }
        this.setBlockPosition(position.x, position.y);
    },

    setBlockXY() {
        const nodePosition = this.node.getPosition();
        let x = Math.round(nodePosition.x / Global.blockSize);
        let y = Math.round(nodePosition.y / Global.blockSize);
        // block的越界检查
        if (y < -3) {
            y = -3;
        }
        if (x < -3) {
            x = -3;
        }
        if (x + this.blockWidth > 3) {
            x = 3 - this.blockWidth;
        }
        if (y + this.blockHeight > 3) {
            y = 3 - this.blockHeight;
        }
        this.x = x;
        this.y = y;
    },

    // 通过角标还原block的位置
    setBlockPosition(x, y) {
        this.node.setPosition(cc.v2(
            x  * (Global.blockSize + Global.blockGap),
            y  * (Global.blockSize + Global.blockGap),
        ));
    },

    start () {

    },

    update (dt) {},
});

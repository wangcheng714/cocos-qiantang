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
            this.range = this.getBlockMoveRange();
            console.log(this.range);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (this.direction === 'x') { //只能X轴移动
                let targetXPosition = this.node.getPosition().x + event.getDelta().x;
                console.log(targetXPosition + this.blockWidth * Global.blockSize);
                if (targetXPosition + this.blockWidth * Global.blockSize > this.range.maxPosition + 8) {
                    return ;
                }
                if (targetXPosition < this.range.minPosition - 8) {
                    return ;
                }
                this.node.setPosition(cc.v2(
                    targetXPosition,
                    this.node.getPosition().y,
                ));
            } else if(this.direction === 'y'){ //只能Y轴移动
                let targetYPosition = this.node.getPosition().y + event.getDelta().y;
                if (targetYPosition + this.blockHeight * Global.blockSize > this.range.maxPosition + 8) {
                    return ;
                }
                if (targetYPosition < this.range.minPosition - 8) {
                    return ;
                }
                this.node.setPosition(cc.v2(
                    this.node.getPosition().x,
                    targetYPosition,
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

    //获取block最大可移动的范围
    getBlockMoveRange() {
        const hackBlockX = this.x + 3;
        const hackBlockY = this.y + 3;
        let maxRange = 0;
        let minRange = 0;
        const range = {
            min: minRange,
            max: maxRange,
        }
        if (this.direction === 'x') {
            let preXPlace = this.getBlockHolderValue(hackBlockX - minRange - 1, hackBlockY);
            let nextXPlace = this.getBlockHolderValue(hackBlockX + this.blockWidth + maxRange, hackBlockY);
            while(preXPlace === 0) {
                minRange++;
                preXPlace = this.getBlockHolderValue(hackBlockX - minRange - 1, hackBlockY);
            }
            while(nextXPlace === 0) {
                maxRange++;
                nextXPlace = this.getBlockHolderValue(hackBlockX + this.blockWidth + maxRange, hackBlockY);
            }
            range.min = hackBlockX - minRange;
            range.max = hackBlockX + this.blockWidth + maxRange - 1;
        } else {
            let preIndex = hackBlockY - minRange - 1;
            let preYValue = this.getBlockHolderValue(hackBlockX, preIndex);
            let nextIndex = hackBlockY + this.blockHeight + maxRange;
            let nextYValue = this.getBlockHolderValue(hackBlockX, nextIndex);
            while(preIndex >= 0 && preYValue === 0) {
                minRange++;
                preIndex = hackBlockY - minRange - 1;
                preYValue = this.getBlockHolderValue(hackBlockX, hackBlockY - minRange - 1);
            }
            while(nextIndex < Global.blockCount && nextYValue === 0) {
                maxRange++;
                nextIndex = hackBlockY + this.blockHeight + maxRange;
                nextYValue = this.getBlockHolderValue(hackBlockX, hackBlockY + this.blockHeight + maxRange);
            }
            range.min = hackBlockY - minRange;
            range.max = hackBlockY + this.blockHeight + maxRange - 1;
        }
        range.maxPosition = (range.max - 3 + 1) * (Global.blockSize + Global.blockGap);
        range.minPosition = (range.min - 3) * (Global.blockSize + Global.blockGap);
        return range;
    },

    getBlockHolderValue(x, y) {
        if (x >= 0 && x < Global.blockCount && y >= 0 && y < Global.blockCount) {
            return Game.blockHolder[y][x];
        } else {
            cc.log(`x = ${x}，y = ${y}，越界了！`);
            return null;
        }
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

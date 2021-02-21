const Global = require('global');
const GameConfig = require('gameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        startScreen: {
            default: null,
            type: cc.Node
        },
        playScreen: {
            default: null,
            type: cc.Node
        },
        menuContainer: {
            default: null,
            type: cc.Node
        },
        blockBg: {
            default: null,
            type: cc.Node
        },
        prefab_block_helper: {
            default: null,
            type: cc.Prefab,
        },
        block: {
            default: null,
            type: cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        window.Game = this;
        this.startScreen.active = false;
        this.playScreen.active = true;
        this.toogleMenuBtns(false);
        this.addBlockHelper();
        this.initLevel(4);
        this.initBlockHolder();
        this.updateBlockHolder();
    },

    //初始化关卡
    initLevel(level) {
        if (level > GameConfig.length) {
            cc.log("没有关卡，清确认level是否正确！");
        } else {
            const levelConfig = GameConfig[level - 1];
            const levelData = levelConfig.data;
            for (let i = 0; i < levelData.length; i++) {
                const blockData = levelData[i];
                const block = cc.instantiate(this.block);
                const blockJsNode = block.getComponent('block');
                blockJsNode.init(blockData.blockSize, {x: blockData.x, y: blockData.y});
                block.parent = this.blockBg;
            }
        }
    },

    //初始化一个二维数组，代表占位符情况
    initBlockHolder() {
        this.blockHolder = [];
        for(let i = 0; i < Global.blockCount; i++) {
            this.blockHolder[i] = [];
            for(let j = 0; j < Global.blockCount; j++) {
                this.blockHolder[i][j] = 0;
            }
        }
    },

    //更新二维数据占位情况数据
    updateBlockHolder() {
        const blocks = this.getAllBlockChild();
        this.initBlockHolder();
        for(let i = 0; i < blocks.length; i++) {
            const jsNode = blocks[i].getComponent('block');
            this.blockHolder[jsNode.y + 3][jsNode.x + 3] = 1;
            if (jsNode.blockWidth > jsNode.blockHeight) {
                for(let j = 1; j < jsNode.blockWidth; j++) {
                    this.blockHolder[jsNode.y + 3][jsNode.x + 3 + j] = 1;
                }
            } else {
                for(let j = 1; j < jsNode.blockHeight; j++) {
                    this.blockHolder[jsNode.y + 3 + j][jsNode.x + 3] = 1;
                }
            }
        }
        console.log(this.blockHolder);
    },

    //获得所有的木块子节点
    getAllBlockChild() {
        const blockChildren = [];
        const children = this.blockBg.children;
        const childrenCount = this.blockBg.childrenCount;
        for (let i = 0; i < childrenCount; i++) {
            const child = children[i];
            const jsNode = child.getComponent('block');
            if (jsNode) {
                blockChildren.push(child);
            }
        }
        return blockChildren;
    },

    //添加宫格标记辅助分割线
    addBlockHelper() {
        //调整父节点的位置
        this.blockBg.width = Global.blockSize * Global.blockCount + (Global.blockCount + 1) * Global.blockGap;
        this.blockBg.height = Global.blockSize * Global.blockCount + (Global.blockCount + 1) * Global.blockGap;
        //每一个区块整体移动的位置
        const blockInitPosotion = cc.v2(-this.blockBg.width/2 + Global.blockGap, -this.blockBg.height/2 + Global.blockGap);
        for(let x = 0; x < Global.blockCount; x++) {
            for (let y = 0; y < Global.blockCount; y++) {
                const blockHelper = cc.instantiate(this.prefab_block_helper);
                blockHelper.parent = this.blockBg;
                blockHelper.setPosition(cc.v2(
                    x * (Global.blockSize + Global.blockGap) + blockInitPosotion.y,
                    y * (Global.blockSize + Global.blockGap) + blockInitPosotion.x,
                ));
                blockHelper.getChildByName('position').getComponent(cc.Label).string = `(${x},${y})`;
            }
        }
    },

    start () {

    },

    //切换所有button显示、隐藏状态
    toogleMenuBtns(show) {
        const menuBtn = this.menuContainer.getChildByName('btnMenu');
        const menuCloseBtn = this.menuContainer.getChildByName('btnClose');
        const hintBtn = this.menuContainer.getChildByName('btnHint');
        const replayBtn = this.menuContainer.getChildByName('btnReplay');

        const btnHome = this.menuContainer.getChildByName('btnHome');
        const btnLevel = this.menuContainer.getChildByName('btnLevel');
        const btnSkin = this.menuContainer.getChildByName('btnSkin');
        const btnSetting = this.menuContainer.getChildByName('btnSetting');
        const menuBtnPosition = menuBtn.getPosition();
        const detalX = Math.abs(menuBtnPosition.x / 2);

        if (show) {
            menuBtn.active = false;
            hintBtn.active = false;
            replayBtn.active = false;
            btnHome.active = true;
            btnLevel.active = true;
            btnSkin.active = true;
            btnSetting.active = true;
            menuCloseBtn.active = true;
            cc.tween(btnHome).to(0.1, { position:  cc.v2(menuBtnPosition.x + detalX, menuBtnPosition.y)}).start();
            cc.tween(btnLevel).to(0.14, { position:  cc.v2(menuBtnPosition.x + detalX * 2, menuBtnPosition.y)}).start();
            cc.tween(btnSkin).to(0.16, { position:  cc.v2(menuBtnPosition.x + detalX * 3, menuBtnPosition.y)}).start();
            cc.tween(btnSetting).to(0.18, { position:  cc.v2(menuBtnPosition.x + detalX * 4, menuBtnPosition.y)}).start();
        } else {
            cc.tween(btnHome)
                .to(0.1, { position:  cc.v2(menuBtnPosition.x, menuBtnPosition.y)})
                .call(() => { btnHome.active = false; })
                .start();
            cc.tween(btnLevel)
                .to(0.1, { position:  cc.v2(menuBtnPosition.x, menuBtnPosition.y)})
                .call(() => { btnLevel.active = false; })
                .start();
            cc.tween(btnSkin)
                .to(0.1, { position:  cc.v2(menuBtnPosition.x, menuBtnPosition.y)})
                .call(() => { btnSkin.active = false; })
                .start();
            cc.tween(btnSetting)
                .to(0.1, { position:  cc.v2(menuBtnPosition.x, menuBtnPosition.y)})
                .call(() => { btnSetting.active = false; })
                .start();

            menuCloseBtn.active = false;
            menuBtn.active = true;
            replayBtn.active = true;
            hintBtn.active = true;
        }
    },

    btnClick(sender, str) {
        cc.log(str);
        switch(str) {
            //Start页面的play按钮被点击，开始游戏
            case 'btnPlay_start':
                this.startScreen.active = false;
                this.playScreen.active = true;
                break;
            //Play页面的Home按钮被点击，返回首页
            case 'btnHome_play':
                // this.toogleMenuBtns(false);
                this.startScreen.active = true;
                this.playScreen.active = false;
                break;
            //Play页面的菜单按钮
            case 'btnMenu_play':
                cc.log('btnHome_play');
                this.toogleMenuBtns(true);
                break;
            case 'btnClose_play':
                this.toogleMenuBtns(false);
                break;
        }

    },

    update (dt) {},
});

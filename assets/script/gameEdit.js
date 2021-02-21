
cc.Class({
    extends: cc.Component,

    properties: {
        blockBg: {
            default: null,
            type: cc.Node
        },
        block: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    btnClick(sender, str) {
        switch(str) {
            case '1_2':
            case '1_3':
            case '2_1':
            case '3_1':
                const block = cc.instantiate(this.block);
                const jsNode = block.getComponent('block');
                jsNode.init(str, {x: 0, y: 0});
                block.parent = this.blockBg;
                break;
            case 'clear':
                const clearBlocks = this.getAllBlockChild();
                for (let i = clearBlocks.length - 1; i >= 0; i--) {
                    clearBlocks[i].removeFromParent();
                }
                break;
            case 'log':
                const logBlocks = this.getAllBlockChild();
                const blockSetting = [];
                for(let i = 0; i < logBlocks.length; i++) {
                    const jsNode = logBlocks[i].getComponent('block');
                    blockSetting.push(`{blockSize: '${jsNode.blockSize}', x: ${jsNode.x}, y: ${jsNode.y}}`);
                }
                cc.log(blockSetting.toString());
                break;
        }

    },

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

    start () {

    },

    // update (dt) {},
});

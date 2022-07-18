<template>
  <section>
    <div>
      <p>{{ currentColer == 1 ? "黒" : "白" }} の番</p>
      <p>白: {{ white }} 黒: {{ black }}</p>
    </div>
    <table>
      <tr v-for="y in height" :key="y">
        <td v-for="x in width" :key="x">
          <img :src="getImgSrc(y, x)" @click="change(y, x)" />
        </td>
      </tr>
    </table>
    <div id="message">
      <h2 v-show="message != ''">{{ message }}</h2>
    </div>
    <div>
      <button @click="pass">パス</button>
      <button @click="hint">ヒント</button>
    </div>
  </section>
</template>

<script>
// animejs 使用していないのでコメントアウトしています
// import anime from 'animejs';

// AIプログラム
const MYAI = require("../assets/js/myai");

export default {
  name: "OthelloGame",
  props: {
    width: Number,
    height: Number,
  },
  data() {
    return {
      state: Array,
      currentColer: 1, // 現在の色
      white: 2,
      black: 2,
      history: Array, // 盤面変化の履歴
      message: "",
    };
  },
  methods: {
    /** 盤面の状態を取得
     * @param {number} y 盤面のy座標
     * @param {number} x 盤面のx座標
     *
     * @return 指定した座標の状態
     */
    getState(y, x) {
      return this.state[y - 1][x - 1];
    },
    /** 盤面の状態を設定
     * @param {state} state 設定する値
     * @param {number} y 盤面のy座標
     * @param {number} x 盤面のx座標
     */
    setState(color, y, x) {
      this.state[y - 1].splice(x - 1, 1, color);
    },
    /** 画像のソースを取得
     * @param {number} y 盤面のy座標
     * @param {number} x 盤面のx座標
     *
     * @return {string} 画像のソース
     */
    getImgSrc(y, x) {
      const state = this.getState(y, x);

      if (state == 1) {
        return require("../assets/black.jpg");
      } else if (state == 2) {
        return require("../assets/white.jpg");
      }
      return require("../assets/none.png");
    },
    /** プロパティの値「height,width」で盤面を初期化
     ----------------------------------------------------- */
    initState() {
      this.state = new Array(this.height);

      for (let y = 0; y < this.height; y++) {
        this.state[y] = new Array(this.width).fill(0);
      }
      const basisY = this.height / 2;
      const basisX = this.width / 2;

      this.setState(1, basisY, basisX);
      this.setState(2, basisY, basisX + 1);
      this.setState(2, basisY + 1, basisX);
      this.setState(1, basisY + 1, basisX + 1);
    },
    /** 画面変更履歴を初期化
     ----------------------------------------------------- */
    initHistory() {
      this.history = new Array();
    },

    change(y, x) {
      const state = this.getState(y, x);

      if (state == 0) {
        // koma is not placed
        let reverseArray = this.search(y, x);
        let reverseCount = reverseArray.length;

        if (reverseCount) {
          this.setState(this.currentColer, y, x);
          this.reverse(reverseArray);
          this.history.push({
            color: this.currentColer,
            flag: "put",
            state: [y, x],
          });
          this.turnEnd();
        } else {
          this.setMessage("そこには置けないよ〜");
        }
      } else {
        this.setMessage("そこには置けないよ〜");
      }
    },
    /**
     * 裏返すことができるコマの数と、それぞれのコマの座標を返す
     * @param {Number} y 盤面のy座標
     * @param {Number} x 盤面のx座標
     *
     * @return {Array} {裏返すコマの座標}
     */
    search(y, x) {
      const SEARCH_ARGS = [
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
      ];
      const REVERSE_COLOR = (this.currentColer % 2) + 1;
      let reverseArray = new Array();

      for (let i in SEARCH_ARGS) {
        //  searchArray の flag 対応表
        //  0:  裏返し終了
        //  1:  裏返すことができるコマ
        //  -1: 裏返しができない
        let searchArray = new Array();
        let setY = y;
        let setX = x;

        const YY = SEARCH_ARGS[i][0];
        const XX = SEARCH_ARGS[i][1];
        for (;;) {
          setY += YY;
          setX += XX;
          if (setY < 1 || setY > this.height || setX < 1 || setX > this.width) {
            searchArray.push({ flag: -1 });
            break;
          }
          const state = this.getState(setY, setX);
          if (state == REVERSE_COLOR) {
            // 裏返すコマが置かれた場所
            searchArray.push({ flag: 1, y: setY, x: setX });
          } else if (state == this.currentColer) {
            // 自分と同じ色のコマが置かれた場所
            searchArray.push({ flag: 0 });
            break;
          } else {
            // コマが置かれていない場所
            searchArray.push({ flag: -1 });
            break;
          }
        }
        let lastIndex = searchArray.length - 1;
        if (searchArray[lastIndex]["flag"] == 0) {
          for (let j = 0; j < lastIndex; j++) {
            reverseArray.push([searchArray[j]["y"], searchArray[j]["x"]]);
          }
        }
      }
      return reverseArray;
    },
    /**
     * コマを反転させる
     */
    reverse(reverseArray) {
      for (let i in reverseArray) {
        let y = reverseArray[i][0];
        let x = reverseArray[i][1];
        const state = this.getState(y, x);
        let newState = (state % 2) + 1;
        this.setState(newState, y, x);

        // アニメーションできていない
        /** アニメーションの動作に使用
         * @type {HTMLElement}
         *
        const element = event.target;
        anime({
          targets: element,
          rotateY: [180, -180],
          easing: "easeInOutQuad",
          duration: 500,
        }); */
      }
    },
    /**
     * change または pass 後実行
     */
    turnEnd() {
      this.currentColer = (this.currentColer % 2) + 1; // 白黒の入れ替え

      // 終了条件
      let gameEndFlag = false;

      this.count();

      // 盤面全てにコマが置かれていたらゲーム終了
      let totalKoma = this.black + this.white;
      let numOfState = this.height * this.width;
      if (totalKoma == numOfState) {
        gameEndFlag = true;
      }

      // pass が2回連続ならゲーム終了
      let lastIndex = Object.keys(this.history).length - 1;
      if (this.history[lastIndex].flag == "pass") {
        lastIndex--;
        if (this.history[lastIndex].flag == "pass") {
          gameEndFlag = true;
        }
      }
      if (gameEndFlag) {
        this.setMessage("ゲーム終了!!");
        this.history[-1] = { black: this.black, white: this.white };
        setTimeout(() => {
          this.$emit("othelloGame", this.history);
        }, 2500); // 表示を遅延させる
      } else {
        if (this.currentColer == 2) {
          // 次の番が白 (proglam) の場合
          const ai = new MYAI(2, this.state);
          let ans = ai.GetAnswer();
          setTimeout(() => {
            if (ans) {
              ans = ans.map((num) => num + 1);
              this.change(ans[0], ans[1]);
            } else {
              this.pass();
            }
          }, 500); // 表示を遅延させる
        }
      }
    },
    /**
     * 盤面上の黒・白の数を数える
     */
    count() {
      this.black = 0;
      this.white = 0;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let color = this.state[y][x];
          if (color == 1) {
            this.black++;
          } else if (color == 2) {
            this.white++;
          }
        }
      }
    },
    /**
     * 盤面に置けるコマがあるかどうかを確認
     *
     * @return {Number} 置けるコマの数を返す
     */
    putCheck() {
      let putCount = 0;
      for (let y = 1; y <= this.height; y++) {
        for (let x = 1; x <= this.width; x++) {
          const state = this.getState(y, x);
          if (state == 0) {
            let reverseArray = this.search(y, x);
            let reverseCount = reverseArray.length;
            if (reverseCount) {
              putCount++;
            }
          }
        }
      }
      return putCount;
    },
    /**
     * コメントの表示
     * @param {String} contents 出力するコメント内容
     */
    setMessage(contents) {
      this.message = contents;
      setTimeout(() => {
        this.message = "";
      }, 1000); // 1.0s 後に非表示
    },

    /** パス（置ける場所がある場合はパスできない）
     ----------------------------------------------------- */
    pass() {
      // パスできるかのチェック
      let canNotPass = this.putCheck();
      if (canNotPass) {
        this.setMessage("置ける場所があるので、パスできません!!");
      } else {
        // コメント出力
        this.setMessage(
          (this.currentColer == 1 ? "黒" : "白") + "がパスしました！"
        );
        this.history.push({ color: this.currentColer, flag: "pass" });
        this.turnEnd();
      }
    },
    /** コマを置くことができる場所を表示（未完成）
     ----------------------------------------------------- */
    hint() {
      this.putCheck();
    },
  },
  created() {
    this.initState();
    this.initHistory();
  },
  watch: {
    width() {
      this.initState();
    },
    height() {
      this.initState();
    },
  },
};
</script>

<style scoped>
table {
  margin: 0 auto;
  border-collapse: collapse;
}
td {
  text-align: center;
  width: 60px;
  height: 60px;
  border: solid 2px black;
  background-color: lime;
}
img {
  vertical-align: middle;
  width: 100%;
}
#message {
  position: absolute;
  top: 40%;
  left: 50%;

  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
#message * {
  background-color: yellow;
  padding: 30px;
  border-radius: 10px;
  border: solid 2px black;
}
</style>
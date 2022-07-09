//  最善手を探す
//  ミニマックス法


class MYAI {
  constructor(color, state) {
    this.CURRENT_COLER = color;
    this.CURRENT_STATE = state;

    this.optimalList = new Array();
    this.optimalList.push({count: 0});

    this.Predict();
  }

  /**
   * 最善手を返す
   * @returns [y, x]
   */
  GetAnswer() {
    let randomNum = Math.floor(Math.random() * this.optimalList.length);
    return this.optimalList[randomNum]['node1'];
  }

  /**
   * 予測を行う
   */
  Predict() {
    // 自分の1手目
    let node1_reverse = this.Search(this.CURRENT_COLER, this.CURRENT_STATE);
    for (let node1_branch in node1_reverse) {
      let node2_board = this.CreateCopyBoard(this.CURRENT_STATE);
      this.ReverseAndPut(node2_board, node1_reverse[node1_branch], this.CURRENT_COLER);
      this.Compare(
        node2_board, node1_reverse[node1_branch]
      );

      // 相手の1手目
      let node2_reverse = this.Search((this.CURRENT_COLER % 2) + 1, node2_board);
      for (let node2_branch in node2_reverse) {
        let node3_board = this.CreateCopyBoard(node2_board);
        this.ReverseAndPut(node3_board, node2_reverse[node2_branch], (this.CURRENT_COLER % 2) + 1);

        // 自分の2手目
        let node3_reverse = this.Search(this.CURRENT_COLER, node3_board);
        for (let node3_branch in node3_reverse) {
          let node4_board = this.CreateCopyBoard(node3_board);
          this.ReverseAndPut(node4_board, node3_reverse[node3_branch], this.CURRENT_COLER);
          this.Compare(
            node4_board, node1_reverse[node1_branch], node2_reverse[node2_branch], 
            node3_reverse[node3_branch]
          );

          // 相手の2手目
          let node4_reverse = this.Search((this.CURRENT_COLER % 2) + 1, node4_board);
          for (let node4_branch in node4_reverse) {
            let node5_board = this.CreateCopyBoard(node4_board);
            this.ReverseAndPut(node5_board, node4_reverse[node4_branch], (this.CURRENT_COLER % 2 + 1));
  
            // 自分の3手目
            let node5_reverse = this.Search(this.CURRENT_COLER, node5_board);
            for (let node5_branch in node5_reverse) {
              let node6_board = this.CreateCopyBoard(node5_board);
              this.ReverseAndPut(node6_board, node5_reverse[node5_branch], this.CURRENT_COLER);
              this.Compare(
                node6_board, node1_reverse[node1_branch], node2_reverse[node2_branch], 
                node3_reverse[node3_branch], node4_reverse[node4_branch], node5_reverse[node5_branch]
              );
            }
          }
        }
      }
    }
  }
  /**
   * 盤面の複製（値渡しで配列を作成）
   * @param {Array} board 
   * @returns 
   */
  CreateCopyBoard(board) {
    let newBoard = new Array();
    for (let array in board) {
      newBoard.push(board[array].concat());
    }
    return newBoard;
  }

  /**
   * 合法手を探し、配列にして返す
   * @param {Number} color 
   * @param {Array} board 
   * @returns 要素の最後にkomaを置いた場所、それまでがReverese
   */
  Search(color, board) {
    let putArray = new Array();
    for (let y = 0; y < board.length; y ++) {
      for (let x = 0; x < board[y].length; x ++) {
        if (board[y][x] == 0) {
          let array = this.ReverseSearch(y, x, color, board);
          let reFlag = array["count"];

          if (reFlag) {
            array["count"] ++;
            array["place"].push([y, x]);
            putArray.push(array["place"]);
          }
        }
      }
    }
    return putArray;
  }
  ReverseSearch(stateY, stateX, stateColor, board) {
    const SEARCH_ARGS = [
      [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]
    ];
    let reverseColor = (stateColor % 2) + 1;

    let reverseArray = new Array();
    let reverseCount = 0;

    for (let i in SEARCH_ARGS) {
      let searchArray = new Array();
      let y = stateY;
      let x = stateX;

      let YY = SEARCH_ARGS[i][0];
      let XX = SEARCH_ARGS[i][1];
      // 裏返すコマを探す処理
      for (;;) {
        y += YY;
        x += XX;
        if (y == -1 || y == board.length || x == -1 || x == board[y].length) {    // 枠にあたったら
          searchArray.push({flag: -1});
          break;
        }

        let state = board[y][x];
        if (state == reverseColor) {        // 裏返すことができるコマが置かれていたら
          searchArray.push({flag: 1, y: y, x: x});
        } else if (state == stateColor) {   // 置いたコマと同じ色のコマが見つかったら
          searchArray.push({flag: 0});
          break;
        } else {                            // まだ何も置かれていないなら
          searchArray.push({flag: -1});
          break;
        }
      }
      if (searchArray[searchArray.length - 1]['flag'] == 0) {
        for (let j = 0 ; j < searchArray.length - 1; j ++) {
          reverseArray.push(
            [searchArray[j]['y'], searchArray[j]['x']]
          );
          reverseCount ++;
        }
      }
    }

    return {count: reverseCount, place: reverseArray};
  }

  /**
   * 盤面の更新 (reverseArrayを反映した盤面の作成)
   * @param {Array} board 反映前の盤面
   * @param {Array} stateArray プット・リバースするコマの位置
   * @param {Number} color 置くコマの色
   */
  ReverseAndPut(board, stateArray, color) {
    for (const element of stateArray) {
      let y = element[0];
      let x = element[1];
      board[y][x] = color;
    }
  }

  /**
   * 自分のコマの色の数
   * @param {Array} board 
   * @returns 
   */
  CountKoma(board) {
    let count = 0;
    for (let y in board) {
      for (let x in board[y]) {
        let state = board[y][x];
        if (state == this.CURRENT_COLER) {
          count ++;
        }
      }
    }
    return count;
  }
  /**
   * 最善手の比較
   * @param {Array} board 現在の盤面
   * @param {Array} node1 1手目、自分が置いた場所
   * @param {Array} node2 1手目、相手が置いた場所
   * @param {Array} node3 2手目、自分が置いた場所
   * @param {Array} node4 2手目、相手が置いた場所
   * @param {Array} node5 3手目、自分が置いた場所
   */
  Compare(board, node1 = [], node2 = [], node3 = [], node4 = [], node5 = []) {
    const PUT_STATE = (node_array) => node_array[node_array.length - 1];

    let latestCount = this.CountKoma(board);
    let bestCount = this.optimalList[0]['count'];

    if (latestCount > bestCount) {
      this.optimalList = new Array();
      this.optimalList.push({
        count: latestCount,
        node1: PUT_STATE(node1), node2: PUT_STATE(node2), node3: PUT_STATE(node3),
        node4: PUT_STATE(node4), node5: PUT_STATE(node5),
      });
    } else if (latestCount == bestCount) {
      this.optimalList.push({
        count: latestCount,
        node1: PUT_STATE(node1), node2: PUT_STATE(node2), node3: PUT_STATE(node3),
        node4: PUT_STATE(node4), node5: PUT_STATE(node5),
      });
    }
  }
}

module.exports = MYAI;
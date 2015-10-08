describe('app.js', function() {
  describe('Test init()', function () {
    it('every variable should have been initialized correctly', function () {
      init();

      //assert
      assert.equal(realWidth, map.length);
      assert.equal(realHeight, map[0].length);
      for(var i = 0; i < realWidth; i++){
        assert.equal(0, map[i][0]);
      }
    });
  });

  describe('Test randomProduction()', function () {
    it('should not product cell where there is a block', function () {
      var test_block = [[10,20], [30,20], [50,33], [59,10], [11,12], [30, 29], [38, 19]];
      for (var i = 0; i < test_block.length; i++){
        map[test_block[i][0]][test_block[i][1]] = 1;
      }
      randomProduction();

      //assert
      for (var i = 0; i < test_block.length; i++){
        assert.equal(1, map[test_block[i][0]][test_block[i][1]])
      }
    });
    it('every cell should be alive except blocks', function () {
      var test_block = [[10,20], [30,20], [50,33], [59,10], [11,12], [30, 29], [38, 19]];
      for (var i = 0; i < test_block.length; i++){
        map[test_block[i][0]][test_block[i][1]] = 1;
      }
      liveProbability = 1;
      randomProduction();

      //assert
      assert.equal(width*height-test_block.length, previousLiveCells.length);
    });
  });

  describe('Test update logic', function () {
    it('test the update logic is right or not, case 1', function () {
      init();
      previousLiveCells = [[0,0], [0,1], [0,2], [1,3], [2,0], [2,4], [3,1], [3,3]];
      for (var i = 0; i < previousLiveCells.length; i++){
        map[previousLiveCells[i][0]][previousLiveCells[i][1]] = 8;
      }
      var test_after = [[0,0], [0,1], [0,2], [0,3], [1,1], [2,1], [2,2], [2,3],[3,3]];

      document.createElement('div');
      $('div').append("<canvas id='cells'></canvas>");

      gameCycle();
      //assert
      for (var i = 0; i < test_after.length; i++){
        assert.equal(8, map[test_after[i][0]][test_after[i][1]]);
      }
      assert.equal(test_after.length, previousLiveCells.length);
    });

    it('test the update logic is right or not, case 2', function () {
      init();
      previousLiveCells = [[0,2], [1,1], [1,3], [2,0], [2,2], [2,4], [3,1], [3,3], [4,2]];
      for (var i = 0; i < previousLiveCells.length; i++){
        map[previousLiveCells[i][0]][previousLiveCells[i][1]] = 8;
      }
      var test_after = [[1,1], [1,3], [3,1], [3,3]];

      document.createElement('div');
      $('div').append("<canvas id='cells'></canvas>");

      gameCycle();
      //assert
      for (var i = 0; i < test_after.length; i++){
        assert.equal(8, map[test_after[i][0]][test_after[i][1]]);
      }
      assert.equal(test_after.length, previousLiveCells.length);
    });
  });

  describe('Test multiDimArraySearch()', function () {
    it('should return -1 when element not exist in 2d array', function () {
      var test_array = [[1,2], [2,1], [3,4], [4,3], [5,6], [7,8]];
      assert.equal(-1, multiDimArraySearch(1,1,test_array));
      assert.equal(-1, multiDimArraySearch(1,4,test_array));
      assert.equal(-1, multiDimArraySearch(5,7,test_array));
    });
    it('should return position when element exist in 2d array', function () {
      var test_array = [[1,2], [2,1], [3,4], [4,3], [5,6], [7,8]];
      assert.equal(0, multiDimArraySearch(1,2,test_array));
      assert.equal(3, multiDimArraySearch(4,3,test_array));
      assert.equal(5, multiDimArraySearch(7,8,test_array));
    });
  });
});

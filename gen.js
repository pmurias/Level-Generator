function print(x) {
    process.stdout.write(x);
}

function display(x) {
    for (var y=0;y<level.length;y++) {
        for (var x=0;x<level[y].length;x++) {
            print(level[y][x]);
        }
        print("\n");
    }
}

var level = [];
var size = 10;

for (var i=0;i<size;i++) {
    level[i] = [];
    for (var j=0;j<size;j++) {
        level[i][j] = '#';
    }
}

var rules = {'c':
    {
        pattern: [
            ['#','#','#'],
            [' ',' ','c'],
            ['#','#','#']
        ],
        offset: [0,-1]
    }
}

function replace(rules,board) {
    var rule;
    for (var y=0;y<level.length;y++) {
        for (var x=0;x<level[y].length;x++) {
            if (rule = rules[level[y][x]]) {
                var offsetX = x+rule.offset[0];
                var offsetY = y+rule.offset[1];
                for (var py=0;py<rule.pattern.length;py++) {
                    for (var px=0;px<rule.pattern[py].length;px++) {
                        board[offsetY+py][offsetX+px] = rule.pattern[py][px];
                    }
                }
                return;
            }
        }
    }
}

level[3][0] = 'c';

for (var i=0;i<3;i++) {
    replace(rules,level);
}

display(level);

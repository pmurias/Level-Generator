function print(x) {
    process.stdout.write(x);
}

function display(level) {
    for (var y=0;y<level.length;y++) {
        for (var x=0;x<level[y].length;x++) {
            print(level[y][x]);
        }
        print("\n");
    }
}

var level = [];
var size = 30;

for (var i=0;i<size;i++) {
    level[i] = [];
    for (var j=0;j<size;j++) {
        level[i][j] = '#';
    }
}

function rotate_pattern(p) {
    var new_p = [];
    var arrows = {};


    arrows['^'] = '>';
    arrows['>'] = 'v';
    arrows['<'] = '^';
    arrows['v'] = '<';

    for (var y=0;y<p[0].length;y++) {
        new_p[y] = [];
        for (var x=0;x<p.length;x++) {
//            console.log(y,x,p.length-x-1,y);
            var tile = p[p.length-x-1][y];
            tile = arrows[tile] || tile;
            new_p[y][x] = tile;
        }
    }
    return new_p;

}

//bit silly but should avoid bugs
function calc_offset(offset,pattern) {
    var old = pattern[-offset[0]][-offset[1]];
    pattern[-offset[0]][-offset[1]] = 'X';
    //display(pattern);
    var rotated = rotate_pattern(pattern);
    //display(rotated);
    pattern[-offset[0]][-offset[1]] = old;

    for (var y=0;y<rotated.length;y++) {
        for (var x=0;x<rotated[y].length;x++) {
            if (rotated[y][x] == 'X') {
                return [-y,-x];
            }
        }
    }
}
function rotate_rules(rules) {
    return rules.map(function(r) {
        return {
            pattern:rotate_pattern(r.pattern),
            p:r.p,
            offset:calc_offset(r.offset,r.pattern),
        }
    });
}

var rules = {'>':
    [{
        pattern: [
            ['?','^','?'],
            [' ',' ','>'],
            ['?','v','?']
        ],
        offset: [-1,0],
        p:0.1,
    },
    {
        pattern: [
            ['?','^'],
            [' ',' '],
            ['?','v']
        ],
        offset: [-1,0],
        p:0.1,
    },
    {
        pattern: [
            ['?','?'],
            [' ','>'],
            ['?','?']
        ],
        offset: [-1,0],
        p:0.8,
    },
    {
        pattern: [[' ']],
        p:0,
        offset: [0,0]
    }]

};

rules['v'] = rotate_rules(rules['>']);
rules['<'] = rotate_rules(rules['v']);
rules['^'] = rotate_rules(rules['<']);

/*display(rules['>'][2].pattern);
display(rotate_pattern(rules['>'][2].pattern));*/


function replace_tile(rules,board,y,x) {
    var tile = board[y][x];
    var random = Math.random();
    for (var r in rules[tile]) {
        var rule = rules[tile][r]; 
 //       console.info(random,rule.p);
        if (random > rule.p) {
//            console.info("did not choose rule");
            random -= rule.p;
            continue;
        }
        var offsetX = x+rule.offset[1];
        var offsetY = y+rule.offset[0];
        if (offsetY+rule.pattern.length > board.length
            || offsetY < 0
            || offsetX < 0
            || offsetX+rule.pattern[0].length > board[0].length) {
            random -= rule.p;
            continue;
        }
        //console.log(tile);
        for (var py=0;py<rule.pattern.length;py++) {
            for (var px=0;px<rule.pattern[py].length;px++) {
                var replacement = rule.pattern[py][px];
                if (replacement != '?')  {
                    board[offsetY+py][offsetX+px] = replacement;
                }
            }
        }
        //console.info('replacement: ',r);
        return;
    }
    console.info("probabilities are incorrectly defined");
}
function replace(rules,board) {
    var rule;
    for (var y=0;y<board.length;y++) {
        for (var x=0;x<board[y].length;x++) {
            if (rules[board[y][x]]) {
                replace_tile(rules,board,y,x);
                return;
            }
        }
    }
}

level[5][3] = '>';
/*for (var i=0;i<100;i++) {
    print("\n\n\n");
    display(level);
    replace(rules,level);
}
*/
for (var i=0;i<100;i++) {
    replace(rules,level);
}

display(level);


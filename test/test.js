var fs = require('fs');
var path = require('path');
var test = require('ava');
var postcss = require('postcss');

var plugin = require('../');

function read(fn) {
    return fs.readFileSync(path.join(__dirname, fn)).toString();
}

test('direction', function (t) {
    var input = read('./fixture/in.css');
    var output = read('./fixture/out.css');

    return postcss([plugin]).process(input).then(function (result) {
        fs.writeFileSync('blah', result.css);
        t.is(result.css, output, 'should equal output');
    });
});

var postcss = require('postcss');
var splitSelector = require('css-selector-splitter');

var PROPS = [
    'border-inline-end',
    'border-inline-end-color',
    'border-inline-end-style',
    'border-inline-end-width',
    'border-inline-start',
    'border-inline-start-color',
    'border-inline-start-style',
    'border-inline-start-width',
    'margin-inline-end',
    'margin-inline-start',
    'offset-inline-end',
    'offset-inline-start',
    'padding-inline-end',
    'padding-inline-start'
];

function isDirectionDecl(node) {
    if (node.type === 'decl') {
        switch (node.prop) {
            case 'float':
            case 'clear':
            case 'text-align':
                return ['start', 'end'].indexOf(node.value) > -1;
            default:
                return PROPS.indexOf(node.prop) > -1;
        }
    } else {
        return false;
    }
}

function transformDecl(isRTL, decl) {
    var start = isRTL ? 'right': 'left';
    var end = isRTL ? 'left': 'right';

    var newProp = decl.prop;
    var newValue = decl.value;

    switch (decl.prop) {
        case 'float':
        case 'clear':
        case 'text-align':
            newValue = decl.value.replace('start', start).replace('end', end);
            break;
        case 'offset-inline-start':
            newProp = start;
            break;
        case 'offset-inline-end':
            newProp = end;
            break;
        default:
            newProp = decl.prop.replace('inline-start', start).replace('inline-end', end);
            break;
    }

    return decl.clone({'prop': newProp, 'value': newValue});
}

function transformSelector(isRTL, ruleSelector) {
    var prepend = isRTL ? 'html[dir=rtl]' : 'html[dir=ltr]';

    return splitSelector(ruleSelector).map(function (selector) {
        return prepend + ' ' + selector;
    }).join(', ');
}

function processRule(rule) {
    var dirDecls = rule.nodes.filter(isDirectionDecl);

    if (dirDecls.length > 0) {
        var ltrDecls = dirDecls.map(transformDecl.bind(null, false));
        var rtlDecls = dirDecls.map(transformDecl.bind(null, true));

        var ltrSelector = transformSelector(false, rule.selector);
        var rtlSelector = transformSelector(true, rule.selector);

        rule.cloneAfter({'selector': ltrSelector, 'nodes': ltrDecls})
            .cloneAfter({'selector': rtlSelector, 'nodes': rtlDecls});

        dirDecls.forEach(function (decl) { decl.remove(); });
    }
}

module.exports = postcss.plugin('postcss-direction', function () {
    return function (css) {
        css.walkRules(processRule);
    };
});

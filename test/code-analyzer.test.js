import assert from 'assert';
import {
    generateCFG
} from '../src/js/code-analyzer';

describe('Assignment 3', () => {
    it('Test 1', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argumentsSection = '1,2,3';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' a = x + 1\n' +
            ' b = a + y\n' +
            ' c = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 2 -\n' +
            'b < z",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 3 -\n' +
            'c = c + 5",shape=rectangle]\n' +
            'n6 [label="- 4 -\n' +
            'return c\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 5 -\n' +
            'b < z * 2",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 6 -\n' +
            'c = c + x + 5",shape=rectangle,style=filled,color=limegreen]\n' +
            'n9 [label="- 7 -\n' +
            'c = c + z + 5",shape=rectangle]\n' +
            'n1 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n10 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n10 []\n' +
            'n9 -> n10 []\n' +
            'n10 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n10 -> n6 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 2', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argumentsSection = '-1.5,-3,14,32.66';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' a = x + 1\n' +
            ' b = a + y\n' +
            ' c = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 2 -\n' +
            'b < z",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 3 -\n' +
            'c = c + 5",shape=rectangle,style=filled,color=limegreen]\n' +
            'n6 [label="- 4 -\n' +
            'return c\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 5 -\n' +
            'b < z * 2",shape=diamond]\n' +
            'n8 [label="- 6 -\n' +
            'c = c + x + 5",shape=rectangle]\n' +
            'n9 [label="- 7 -\n' +
            'c = c + z + 5",shape=rectangle]\n' +
            'n1 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n10 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n10 []\n' +
            'n9 -> n10 []\n' +
            'n10 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n10 -> n6 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 3', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argumentsSection = '1,2,2';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' a = x + 1\n' +
            ' b = a + y\n' +
            ' c = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 2 -\n' +
            'b < z",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 3 -\n' +
            'c = c + 5",shape=rectangle]\n' +
            'n6 [label="- 4 -\n' +
            'return c\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 5 -\n' +
            'b < z * 2",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 6 -\n' +
            'c = c + x + 5",shape=rectangle]\n' +
            'n9 [label="- 7 -\n' +
            'c = c + z + 5",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n10 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n10 []\n' +
            'n9 -> n10 []\n' +
            'n10 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n10 -> n6 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 4', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argumentsSection = '17,0,2';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' a = x + 1\n' +
            ' b = a + y\n' +
            ' c = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 2 -\n' +
            'a < z",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 3 -\n' +
            'c = a + b\n' +
            'z = c * 2\n' +
            'a++\n' +
            '",shape=rectangle]\n' +
            'n8 [label="- 4 -\n' +
            'return z\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n9 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n5 -> n9 []\n' +
            'n9 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n9 -> n4 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 5', () => {
        let codeToParse = 'function func(value,AS,MIN,MAX){\n' +
            'let i, ti, tv, sum;\n' +
            'let av;\n' +
            'i = 0; ti = 0; tv = 0; sum = 0;\n' +
            'while (ti < AS && value[i] != -999) {\n' +
            'ti++;\n' +
            'if (value[i] >= MIN && value[i] <= MAX) {\n' +
            'tv++;\n' +
            'sum = sum + value;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'if (tv > 0)\n' +
            'av = sum/tv;\n' +
            'else\n' +
            'av =  -999;\n' +
            'return  av;\n' +
            '}\n';
        let argumentsSection = '[-999],10,50,100';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' i, ti, tv, sum\n' +
            ' av\n' +
            'i = 0\n' +
            'ti = 0\n' +
            'tv = 0\n' +
            'sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 2 -\n' +
            'ti < AS ",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 3 -\n' +
            'ti++",shape=rectangle]\n' +
            'n9 [label="- 4 -\n' +
            'value[i] >= MIN ",shape=diamond]\n' +
            'n10 [label="- 5 -\n' +
            'tv++\n' +
            'sum = sum + value\n' +
            '",shape=rectangle]\n' +
            'n12 [label="- 6 -\n' +
            'i++",shape=rectangle]\n' +
            'n13 [label="- 7 -\n' +
            'tv > 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 8 -\n' +
            'av = sum/tv",shape=rectangle]\n' +
            'n15 [label="- 9 -\n' +
            'return  av\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 10 -\n' +
            'av =  -999",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n19 []\n' +
            'n7 -> n20 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n9 -> n21 [label="false"]\n' +
            'n10 -> n21 []\n' +
            'n12 -> n19 []\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n22 []\n' +
            'n16 -> n22 []\n' +
            'n17 [label="- 11 -\n' +
            'value[i] != -999",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 -> n17 [label="true"]\n' +
            'n17 -> n8 [label="true"]\n' +
            'n17 -> n20 [label="false"]\n' +
            'n18 [label="- 12 -\n' +
            'value[i] <= MAX",shape=diamond]\n' +
            'n9 -> n18 [label="true"]\n' +
            'n18 -> n10 [label="true"]\n' +
            'n18 -> n21 [label="false"]\n' +
            'n19 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n19 -> n7 []\n' +
            'n20 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n20 -> n13 []\n' +
            'n21 [label=""]\n' +
            'n21 -> n12 []\n' +
            'n22 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n22 -> n15 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 6', () => {
        let codeToParse = 'function func(value,AS,MIN,MAX){\n' +
            'let i, ti, tv, sum;\n' +
            'let av;\n' +
            'i = 0; ti = 0; tv = 0; sum = 0;\n' +
            'while (ti < AS && value[i] != -999) {\n' +
            'ti++;\n' +
            'if (value[i] >= MIN && value[i] <= MAX) {\n' +
            'tv++;\n' +
            'sum = sum + value;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'if (tv > 0)\n' +
            'av = sum/tv;\n' +
            'else\n' +
            'av =  -999;\n' +
            'return  av;\n' +
            '}\n';
        let argumentsSection = '[1,2,3,4,5],5,0,10';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' i, ti, tv, sum\n' +
            ' av\n' +
            'i = 0\n' +
            'ti = 0\n' +
            'tv = 0\n' +
            'sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 2 -\n' +
            'ti < AS ",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 3 -\n' +
            'ti++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n9 [label="- 4 -\n' +
            'value[i] >= MIN ",shape=diamond,style=filled,color=limegreen]\n' +
            'n10 [label="- 5 -\n' +
            'tv++\n' +
            'sum = sum + value\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n12 [label="- 6 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n13 [label="- 7 -\n' +
            'tv > 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 8 -\n' +
            'av = sum/tv",shape=rectangle,style=filled,color=limegreen]\n' +
            'n15 [label="- 9 -\n' +
            'return  av\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 10 -\n' +
            'av =  -999",shape=rectangle]\n' +
            'n1 -> n19 []\n' +
            'n7 -> n20 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n9 -> n21 [label="false"]\n' +
            'n10 -> n21 []\n' +
            'n12 -> n19 []\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n22 []\n' +
            'n16 -> n22 []\n' +
            'n17 [label="- 11 -\n' +
            'value[i] != -999",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 -> n17 [label="true"]\n' +
            'n17 -> n8 [label="true"]\n' +
            'n17 -> n20 [label="false"]\n' +
            'n18 [label="- 12 -\n' +
            'value[i] <= MAX",shape=diamond,style=filled,color=limegreen]\n' +
            'n9 -> n18 [label="true"]\n' +
            'n18 -> n10 [label="true"]\n' +
            'n18 -> n21 [label="false"]\n' +
            'n19 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n19 -> n7 []\n' +
            'n20 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n20 -> n13 []\n' +
            'n21 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n21 -> n12 []\n' +
            'n22 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n22 -> n15 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 7', () => {
        let codeToParse = 'function myFunc(x,y,flag)\n' +
            '{\n' +
            'let evenCounterX = 0;\n' +
            'let oddCounterX = 0;\n' +
            'let evenCounterY = 0;\n' +
            'let oddCounterY = 0;\n' +
            'let i = 0;\n' +
            'while(i < x.length)\n' +
            '{\n' +
            'if(x[i] % 2 === 0)\n' +
            '{\n' +
            'evenCounterX++;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'oddCounterX++;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'i = 0;\n' +
            'while(i < y.length)\n' +
            '{\n' +
            'if(y[i] % 2 === 0)\n' +
            '{\n' +
            'evenCounterY++;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'oddCounterY++;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'let firstCond = evenCounterX < evenCounterY;\n' +
            'let secondCond = oddCounterX < oddCounterY;\n' +
            'if(firstCond && secondCond || flag)\n' +
            '{\n' +
            'return \'Y Is Better !\';\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return \'X Is Better !\';\n' +
            '}\n' +
            '}';
        let argumentsSection = '[1,2],[6,7,8,9],true';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' evenCounterX = 0\n' +
            ' oddCounterX = 0\n' +
            ' evenCounterY = 0\n' +
            ' oddCounterY = 0\n' +
            ' i = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n6 [label="- 2 -\n' +
            'i < x.length",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 [label="- 3 -\n' +
            'x[i] % 2 === 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 4 -\n' +
            'evenCounterX++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n9 [label="- 5 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n10 [label="- 6 -\n' +
            'oddCounterX++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n11 [label="- 7 -\n' +
            'i = 0",shape=rectangle,style=filled,color=limegreen]\n' +
            'n12 [label="- 8 -\n' +
            'i < y.length",shape=diamond,style=filled,color=limegreen]\n' +
            'n13 [label="- 9 -\n' +
            'y[i] % 2 === 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 10 -\n' +
            'evenCounterY++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n15 [label="- 11 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 12 -\n' +
            'oddCounterY++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n17 [label="- 13 -\n' +
            ' firstCond = evenCounterX < evenCounterY\n' +
            ' secondCond = oddCounterX < oddCounterY\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n19 [label="- 14 -\n' +
            'firstCond ",shape=diamond,style=filled,color=limegreen]\n' +
            'n20 [label="- 15 -\n' +
            'return \'Y Is Better !\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n21 [label="- 16 -\n' +
            'return \'X Is Better !\'\n' +
            '",shape=rectangle]\n' +
            'n1 -> n24 []\n' +
            'n6 -> n7 [label="true"]\n' +
            'n6 -> n11 [label="false"]\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n10 [label="false"]\n' +
            'n8 -> n25 []\n' +
            'n9 -> n24 []\n' +
            'n10 -> n25 []\n' +
            'n11 -> n26 []\n' +
            'n12 -> n13 [label="true"]\n' +
            'n12 -> n17 [label="false"]\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n27 []\n' +
            'n15 -> n26 []\n' +
            'n16 -> n27 []\n' +
            'n17 -> n19 []\n' +
            'n19 -> n28 [label="false"]\n' +
            'n22 [label="- 17 -\n' +
            'secondCond ",shape=diamond,style=filled,color=limegreen]\n' +
            'n19 -> n22 [label="true"]\n' +
            'n22 -> n29 [label="true"]\n' +
            'n23 [label="- 18 -\n' +
            'flag",shape=diamond]\n' +
            'n22 -> n23 [label="false"]\n' +
            'n23 -> n29 [label="true"]\n' +
            'n23 -> n28 [label="false"]\n' +
            'n24 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n24 -> n6 []\n' +
            'n25 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n25 -> n9 []\n' +
            'n26 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n26 -> n12 []\n' +
            'n27 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n27 -> n15 []\n' +
            'n28 [label=""]\n' +
            'n28 -> n21 []\n' +
            'n29 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n29 -> n20 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 8', () => {
        let codeToParse = 'function myFunc(x,y,flag)\n' +
            '{\n' +
            'let evenCounterX = 0;\n' +
            'let oddCounterX = 0;\n' +
            'let evenCounterY = 0;\n' +
            'let oddCounterY = 0;\n' +
            'let i = 0;\n' +
            'while(i < x.length)\n' +
            '{\n' +
            'if(x[i] % 2 === 0)\n' +
            '{\n' +
            'evenCounterX++;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'oddCounterX++;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'i = 0;\n' +
            'while(i < y.length)\n' +
            '{\n' +
            'if(y[i] % 2 === 0)\n' +
            '{\n' +
            'evenCounterY++;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'oddCounterY++;\n' +
            '}\n' +
            'i++;\n' +
            '}\n' +
            'let firstCond = evenCounterX < evenCounterY;\n' +
            'let secondCond = oddCounterX < oddCounterY;\n' +
            'if(firstCond && secondCond || flag)\n' +
            '{\n' +
            'return \'Y Is Better !\';\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return \'X Is Better !\';\n' +
            '}\n' +
            '}';
        let argumentsSection = '[1,1,3,3],[2],true';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' evenCounterX = 0\n' +
            ' oddCounterX = 0\n' +
            ' evenCounterY = 0\n' +
            ' oddCounterY = 0\n' +
            ' i = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n6 [label="- 2 -\n' +
            'i < x.length",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 [label="- 3 -\n' +
            'x[i] % 2 === 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 4 -\n' +
            'evenCounterX++",shape=rectangle]\n' +
            'n9 [label="- 5 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n10 [label="- 6 -\n' +
            'oddCounterX++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n11 [label="- 7 -\n' +
            'i = 0",shape=rectangle,style=filled,color=limegreen]\n' +
            'n12 [label="- 8 -\n' +
            'i < y.length",shape=diamond,style=filled,color=limegreen]\n' +
            'n13 [label="- 9 -\n' +
            'y[i] % 2 === 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 10 -\n' +
            'evenCounterY++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n15 [label="- 11 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 12 -\n' +
            'oddCounterY++",shape=rectangle]\n' +
            'n17 [label="- 13 -\n' +
            ' firstCond = evenCounterX < evenCounterY\n' +
            ' secondCond = oddCounterX < oddCounterY\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n19 [label="- 14 -\n' +
            'firstCond ",shape=diamond,style=filled,color=limegreen]\n' +
            'n20 [label="- 15 -\n' +
            'return \'Y Is Better !\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n21 [label="- 16 -\n' +
            'return \'X Is Better !\'\n' +
            '",shape=rectangle]\n' +
            'n1 -> n24 []\n' +
            'n6 -> n7 [label="true"]\n' +
            'n6 -> n11 [label="false"]\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n10 [label="false"]\n' +
            'n8 -> n25 []\n' +
            'n9 -> n24 []\n' +
            'n10 -> n25 []\n' +
            'n11 -> n26 []\n' +
            'n12 -> n13 [label="true"]\n' +
            'n12 -> n17 [label="false"]\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n27 []\n' +
            'n15 -> n26 []\n' +
            'n16 -> n27 []\n' +
            'n17 -> n19 []\n' +
            'n19 -> n28 [label="false"]\n' +
            'n22 [label="- 17 -\n' +
            'secondCond ",shape=diamond,style=filled,color=limegreen]\n' +
            'n19 -> n22 [label="true"]\n' +
            'n22 -> n29 [label="true"]\n' +
            'n23 [label="- 18 -\n' +
            'flag",shape=diamond,style=filled,color=limegreen]\n' +
            'n22 -> n23 [label="false"]\n' +
            'n23 -> n29 [label="true"]\n' +
            'n23 -> n28 [label="false"]\n' +
            'n24 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n24 -> n6 []\n' +
            'n25 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n25 -> n9 []\n' +
            'n26 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n26 -> n12 []\n' +
            'n27 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n27 -> n15 []\n' +
            'n28 [label=""]\n' +
            'n28 -> n21 []\n' +
            'n29 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n29 -> n20 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });

    it('Test 9', () => {
        let codeToParse = 'function tomerTest(str1,str2,flag)\n' +
            '{\n' +
            'let flag1 = (str1[0] === \'T\');\n' +
            'let flag2 = (str2[0] === \'L\');\n' +
            'if(flag1&& flag2 && flag)\n' +
            '{\n' +
            'return \'Complex And Case\';\n' +
            '}\n' +
            'else if(!flag2)\n' +
            '{\n' +
            'let i = 30;\n' +
            'let y = 15;\n' +
            'return i/y;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return \'Finally Done\'\n' +
            '}\n' +
            '}';
        let argumentsSection = '\'Tomer\',\'Lev\',true';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' flag1 = (str1[0] === \'T\')\n' +
            ' flag2 = (str2[0] === \'L\')\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n3 [label="- 2 -\n' +
            'flag1",shape=diamond,style=filled,color=limegreen]\n' +
            'n4 [label="- 3 -\n' +
            'return \'Complex And Case\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n5 [label="- 4 -\n' +
            '!flag2",shape=diamond]\n' +
            'n6 [label="- 5 -\n' +
            ' i = 30\n' +
            ' y = 15\n' +
            '",shape=rectangle]\n' +
            'n8 [label="- 6 -\n' +
            'return i/y\n' +
            '",shape=rectangle]\n' +
            'n9 [label="- 7 -\n' +
            'return \'Finally Done\'",shape=rectangle]\n' +
            'n1 -> n3 []\n' +
            'n3 -> n12 [label="false"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n9 [label="false"]\n' +
            'n6 -> n8 []\n' +
            'n10 [label="- 8 -\n' +
            'flag2 ",shape=diamond,style=filled,color=limegreen]\n' +
            'n3 -> n10 [label="true"]\n' +
            'n10 -> n12 [label="false"]\n' +
            'n11 [label="- 9 -\n' +
            'flag",shape=diamond,style=filled,color=limegreen]\n' +
            'n10 -> n11 [label="true"]\n' +
            'n11 -> n4 [label="true"]\n' +
            'n11 -> n12 [label="false"]\n' +
            'n12 [label=""]\n' +
            'n12 -> n5 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 10', () => {
        let codeToParse = 'function tomerTest(str1,str2,flag)\n' +
            '{\n' +
            'let flag1 = (str1[0] === \'T\');\n' +
            'let flag2 = (str2[0] === \'L\');\n' +
            'if(flag1&& flag2 && flag)\n' +
            '{\n' +
            'return \'Complex And Case\';\n' +
            '}\n' +
            'else if(!flag)\n' +
            '{\n' +
            'let i = 30;\n' +
            'let y = 15;\n' +
            'return i/y;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return \'Finally Done\'\n' +
            '}\n' +
            '}';
        let argumentsSection = '\'100\',\'100\',true';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' flag1 = (str1[0] === \'T\')\n' +
            ' flag2 = (str2[0] === \'L\')\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n3 [label="- 2 -\n' +
            'flag1",shape=diamond,style=filled,color=limegreen]\n' +
            'n4 [label="- 3 -\n' +
            'return \'Complex And Case\'\n' +
            '",shape=rectangle]\n' +
            'n5 [label="- 4 -\n' +
            '!flag",shape=diamond,style=filled,color=limegreen]\n' +
            'n6 [label="- 5 -\n' +
            ' i = 30\n' +
            ' y = 15\n' +
            '",shape=rectangle]\n' +
            'n8 [label="- 6 -\n' +
            'return i/y\n' +
            '",shape=rectangle]\n' +
            'n9 [label="- 7 -\n' +
            'return \'Finally Done\'",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n3 []\n' +
            'n3 -> n12 [label="false"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n9 [label="false"]\n' +
            'n6 -> n8 []\n' +
            'n10 [label="- 8 -\n' +
            'flag2 ",shape=diamond]\n' +
            'n3 -> n10 [label="true"]\n' +
            'n10 -> n12 [label="false"]\n' +
            'n11 [label="- 9 -\n' +
            'flag",shape=diamond]\n' +
            'n10 -> n11 [label="true"]\n' +
            'n11 -> n4 [label="true"]\n' +
            'n11 -> n12 [label="false"]\n' +
            'n12 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n12 -> n5 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 11', () => {
        let codeToParse = 'function myFunc(a,b)\n' +
            '{\n' +
            'if(a.length === 3)\n' +
            '{\n' +
            'return 10;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return 20;\n' +
            '}\n' +
            '}';
        let argumentsSection = '[1,2,3]';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            'a.length === 3",shape=diamond,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            'return 10\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n3 [label="- 3 -\n' +
            'return 20\n' +
            '",shape=rectangle]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n3 [label="false"]\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 12', () => {
        let codeToParse = 'function tomerTest(str1,str2,flag)\n' +
            '{\n' +
            'let flag1 = (str1[0] === \'T\');\n' +
            'let flag2 = (str2[0] === \'L\');\n' +
            'if(str1 || str2 || flag)\n' +
            '{\n' +
            'return \'Complex And Case\';\n' +
            '}\n' +
            'else if(!flag2)\n' +
            '{\n' +
            'let i = 30;\n' +
            'let y = 15;\n' +
            'return i/y;\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'return \'Finally Done\'\n' +
            '}\n' +
            '}';
        let argumentsSection = '\'Tomer\',\'Lev\',true';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' flag1 = (str1[0] === \'T\')\n' +
            ' flag2 = (str2[0] === \'L\')\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n3 [label="- 2 -\n' +
            'str1 ",shape=diamond,style=filled,color=limegreen]\n' +
            'n4 [label="- 3 -\n' +
            'return \'Complex And Case\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n5 [label="- 4 -\n' +
            '!flag2",shape=diamond]\n' +
            'n6 [label="- 5 -\n' +
            ' i = 30\n' +
            ' y = 15\n' +
            '",shape=rectangle]\n' +
            'n8 [label="- 6 -\n' +
            'return i/y\n' +
            '",shape=rectangle]\n' +
            'n9 [label="- 7 -\n' +
            'return \'Finally Done\'",shape=rectangle]\n' +
            'n1 -> n3 []\n' +
            'n3 -> n12 [label="true"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n9 [label="false"]\n' +
            'n6 -> n8 []\n' +
            'n10 [label="- 8 -\n' +
            'str2 ",shape=diamond]\n' +
            'n3 -> n10 [label="false"]\n' +
            'n10 -> n12 [label="true"]\n' +
            'n11 [label="- 9 -\n' +
            'flag",shape=diamond]\n' +
            'n10 -> n11 [label="false"]\n' +
            'n11 -> n12 [label="true"]\n' +
            'n11 -> n5 [label="false"]\n' +
            'n12 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n12 -> n4 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
});
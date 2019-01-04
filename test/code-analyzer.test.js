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
            '    \n' +
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
            '    \n' +
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
        let argumentsSection = '1,2,9';
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
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argumentsSection = '4,2,1';
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
    it('Test 4', () => {
        let codeToParse = 'function  func(value,AS,MIN,MAX){\n' +
            '\tlet i, ti, tv, sum;\n' +
            '\tlet av;\n' +
            '\ti = 0; ti = 0; tv = 0; sum = 0;\n' +
            '\twhile (ti < AS && value != -999) {\n' +
            '\t\tti++;\n' +
            '\t\tif (value >= MIN && value <= MAX) {\n' +
            '\t\t\ttv++;\n' +
            '\t\t\tsum = sum + value;\n' +
            '\t\t}\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\tif (tv > 0)\n' +
            '\t\tav = sum/tv;\n' +
            '\telse\n' +
            '\t\tav =  -999;\n' +
            '\treturn  av;\n' +
            '}\n';
        let argumentsSection = '-999,3,4,5';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' i, ti, tv, sum\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            ' av\n' +
            'i = 0\n' +
            'ti = 0\n' +
            'tv = 0\n' +
            'sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 3 -\n' +
            'ti < AS ",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 4 -\n' +
            'ti++",shape=rectangle]\n' +
            'n9 [label="- 5 -\n' +
            'value >= MIN ",shape=diamond]\n' +
            'n10 [label="- 6 -\n' +
            'tv++\n' +
            'sum = sum + value\n' +
            '",shape=rectangle]\n' +
            'n12 [label="- 7 -\n' +
            'i++",shape=rectangle]\n' +
            'n13 [label="- 8 -\n' +
            'tv > 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 9 -\n' +
            'av = sum/tv",shape=rectangle]\n' +
            'n15 [label="- 10 -\n' +
            'return  av\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 11 -\n' +
            'av =  -999",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n19 []\n' +
            'n7 -> n20 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n9 -> n21 [label="false"]\n' +
            'n10 -> n21 []\n' +
            'n12 -> n19 []\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n22 []\n' +
            'n16 -> n22 []\n' +
            'n17 [label="- 12 -\n' +
            'value != -999",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 -> n17 [label="true"]\n' +
            'n17 -> n8 [label="true"]\n' +
            'n17 -> n20 [label="false"]\n' +
            'n18 [label="- 13 -\n' +
            'value <= MAX",shape=diamond]\n' +
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
    it('Test 5', () => {
        let codeToParse = 'function myFunc(value)\n' +
            '{\n' +
            '\tlet sum = 0;\n' +
            '\tif(value >= 0)\n' +
            '\t{\n' +
            '\t\tlet i = 0;\n' +
            '\t\twhile(i <= value)\n' +
            '\t\t{\n' +
            '\t\t\ti++;\n' +
            '\t\t\tsum = sum + i;\n' +
            '\t\t}\n' +
            '\t\treturn sum;\n' +
            '\t}\n' +
            '\telse\n' +
            '\t{\n' +
            '\t\treturn \'Not In Range\';\n' +
            '\t}\n' +
            '}';
        let argumentsSection = '2';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            'value >= 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n3 [label="- 3 -\n' +
            ' i = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 4 -\n' +
            'i <= value",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 5 -\n' +
            'i++\n' +
            'sum = sum + i\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 6 -\n' +
            'return sum\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n8 [label="- 7 -\n' +
            'return \'Not In Range\'\n' +
            '",shape=rectangle]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n8 [label="false"]\n' +
            'n3 -> n9 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n9 []\n' +
            'n9 [label="",style=filled,color=limegreen]\n' +
            '\n' +
            'n9 -> n4 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 6', () => {
        let codeToParse = 'function myFunc(value)\n' +
            '{\n' +
            '\tlet sum = 0;\n' +
            '\tif(value >= 0 && value <= 100)\n' +
            '\t{\n' +
            '                return \'In Range\';\n' +
            '\t}\n' +
            '\telse\n' +
            '\t{\n' +
            '\t\treturn \'Not In Range\';\n' +
            '\t}\n' +
            '}';
        let argumentsSection = '2';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            'value >= 0 ",shape=diamond,style=filled,color=limegreen]\n' +
            'n3 [label="- 3 -\n' +
            'return \'In Range\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n4 [label="- 4 -\n' +
            'return \'Not In Range\'\n' +
            '",shape=rectangle]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n6 [label="false"]\n' +
            'n5 [label="- 5 -\n' +
            'value <= 100",shape=diamond,style=filled,color=limegreen]\n' +
            'n2 -> n5 [label="true"]\n' +
            'n5 -> n3 [label="true"]\n' +
            'n5 -> n6 [label="false"]\n' +
            'n6 [label=""]\n' +
            'n6 -> n4 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 7', () => {
        let codeToParse = 'function  func(value,AS,MIN,MAX){\n' +
            '\tlet i, ti, tv, sum;\n' +
            '\tlet av;\n' +
            '\ti = 0; ti = 0; tv = 0; sum = 0;\n' +
            '\twhile (ti < AS && value != -999) {\n' +
            '\t\tti++;\n' +
            '\t\tif (value >= MIN && value <= MAX) {\n' +
            '\t\t\ttv++;\n' +
            '\t\t\tsum = sum + value;\n' +
            '\t\t}\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\tif (tv > 0)\n' +
            '\t\tav = sum/tv;\n' +
            '\telse\n' +
            '\t\tav =  -999;\n' +
            '\treturn  av;\n' +
            '}\n';
        let argumentsSection = '10,20,30,40';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' i, ti, tv, sum\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            ' av\n' +
            'i = 0\n' +
            'ti = 0\n' +
            'tv = 0\n' +
            'sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 3 -\n' +
            'ti < AS ",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 4 -\n' +
            'ti++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n9 [label="- 5 -\n' +
            'value >= MIN ",shape=diamond,style=filled,color=limegreen]\n' +
            'n10 [label="- 6 -\n' +
            'tv++\n' +
            'sum = sum + value\n' +
            '",shape=rectangle]\n' +
            'n12 [label="- 7 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n13 [label="- 8 -\n' +
            'tv > 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 9 -\n' +
            'av = sum/tv",shape=rectangle]\n' +
            'n15 [label="- 10 -\n' +
            'return  av\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 11 -\n' +
            'av =  -999",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n19 []\n' +
            'n7 -> n20 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n9 -> n21 [label="false"]\n' +
            'n10 -> n21 []\n' +
            'n12 -> n19 []\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n22 []\n' +
            'n16 -> n22 []\n' +
            'n17 [label="- 12 -\n' +
            'value != -999",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 -> n17 [label="true"]\n' +
            'n17 -> n8 [label="true"]\n' +
            'n17 -> n20 [label="false"]\n' +
            'n18 [label="- 13 -\n' +
            'value <= MAX",shape=diamond]\n' +
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
    it('Test 8', () => {
        let codeToParse = 'function  func(value,AS,MIN,MAX){\n' +
            '\tlet i, ti, tv, sum;\n' +
            '\tlet av;\n' +
            '\ti = 0; ti = 0; tv = 0; sum = 0;\n' +
            '\twhile (ti < AS && value != -999) {\n' +
            '\t\tti++;\n' +
            '\t\tif (value >= MIN && value <= MAX) {\n' +
            '\t\t\ttv++;\n' +
            '\t\t\tsum = sum + value;\n' +
            '\t\t}\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\tif (tv > 0)\n' +
            '\t\tav = sum/tv;\n' +
            '\telse\n' +
            '\t\tav =  -999;\n' +
            '\treturn  av;\n' +
            '}\n';
        let argumentsSection = '50,10,0,100';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' i, ti, tv, sum\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            ' av\n' +
            'i = 0\n' +
            'ti = 0\n' +
            'tv = 0\n' +
            'sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n7 [label="- 3 -\n' +
            'ti < AS ",shape=diamond,style=filled,color=limegreen]\n' +
            'n8 [label="- 4 -\n' +
            'ti++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n9 [label="- 5 -\n' +
            'value >= MIN ",shape=diamond,style=filled,color=limegreen]\n' +
            'n10 [label="- 6 -\n' +
            'tv++\n' +
            'sum = sum + value\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n12 [label="- 7 -\n' +
            'i++",shape=rectangle,style=filled,color=limegreen]\n' +
            'n13 [label="- 8 -\n' +
            'tv > 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n14 [label="- 9 -\n' +
            'av = sum/tv",shape=rectangle,style=filled,color=limegreen]\n' +
            'n15 [label="- 10 -\n' +
            'return  av\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n16 [label="- 11 -\n' +
            'av =  -999",shape=rectangle]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n19 []\n' +
            'n7 -> n20 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n9 -> n21 [label="false"]\n' +
            'n10 -> n21 []\n' +
            'n12 -> n19 []\n' +
            'n13 -> n14 [label="true"]\n' +
            'n13 -> n16 [label="false"]\n' +
            'n14 -> n22 []\n' +
            'n16 -> n22 []\n' +
            'n17 [label="- 12 -\n' +
            'value != -999",shape=diamond,style=filled,color=limegreen]\n' +
            'n7 -> n17 [label="true"]\n' +
            'n17 -> n8 [label="true"]\n' +
            'n17 -> n20 [label="false"]\n' +
            'n18 [label="- 13 -\n' +
            'value <= MAX",shape=diamond,style=filled,color=limegreen]\n' +
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
    it('Test 9', () => {
        let codeToParse = 'function myFunc(value)\n' +
            '{\n' +
            '\tlet sum = 0;\n' +
            '\tif(value == 100 || value == 200)\n' +
            '\t{\n' +
            '\t\tsum = sum + value;\n' +
            '\t}\n' +
            '\telse if(value <= 0)\n' +
            '\t{\n' +
            '\t\treturn -1;\n' +
            '\t}\n' +
            '\telse\n' +
            '\t{\n' +
            '\t\treturn \'Just Another Test\';\n' +
            '\t}\n' +
            '}';
        let argumentsSection = '1';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = 'digraph {\n' +
            'n1 [label="- 1 -\n' +
            ' sum = 0\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n2 [label="- 2 -\n' +
            'value == 100 ",shape=diamond,style=filled,color=limegreen]\n' +
            'n3 [label="- 3 -\n' +
            'sum = sum + value",shape=rectangle]\n' +
            'n4 [label="- 4 -\n' +
            'value <= 0",shape=diamond,style=filled,color=limegreen]\n' +
            'n5 [label="- 5 -\n' +
            'return -1\n' +
            '",shape=rectangle]\n' +
            'n6 [label="- 6 -\n' +
            'return \'Just Another Test\'\n' +
            '",shape=rectangle,style=filled,color=limegreen]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n8 [label="true"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n7 [label="- 7 -\n' +
            'value == 200",shape=diamond,style=filled,color=limegreen]\n' +
            'n2 -> n7 [label="false"]\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n4 [label="false"]\n' +
            'n8 [label=""]\n' +
            'n8 -> n3 []\n' +
            '}';
        assert.strictEqual(dotCode, requiredResult);
    });
    it('Test 10', () => {
        let codeToParse = '';
        let argumentsSection = '1';
        let dotCode = generateCFG(codeToParse, argumentsSection);
        let requiredResult = '';
        assert.strictEqual(dotCode, requiredResult);
    });
});
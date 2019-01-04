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
});
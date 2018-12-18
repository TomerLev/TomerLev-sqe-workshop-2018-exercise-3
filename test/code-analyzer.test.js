import assert from 'assert';
import {
    parseCode
} from '../src/js/code-analyzer';

describe('Assignment 2', () => {
    it('Test 1', () => {
        let codeToParse = 'function foo(x, y, z){' +
            '    let a = x + 1;' +
            '    let b = a + y;' +
            '    let c = 0;' +
            '    ' +
            '    if (b < z) {' +
            '        c = c + 5;' +
            '        return x + y + z + c;' +
            '    } else if (b < z * 2) {' +
            '        c = c + x + 5;' +
            '        return x + y + z + c;' +
            '    } else {' +
            '        c = c + z + 5;' +
            '        return x + y + z + c;' +
            '    }' +
            '}';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function foo(x, y, z) {' +
            'if (x + 1 + y < z) {' +
            'return x + y + z + 0 + 5;' +
            '} else if (x + 1 + y < z * 2) {' +
            'return x + y + z + 0 + x + 5;' +
            '} else {' +
            'return x + y + z + 0 + z + 5;' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [2];
        let linesToGreen = results[2];
        let requiredGreenLines = [4];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 2', () => {
        let codeToParse = 'function foo(x, y, z){' +
            '    let a = x + 1;' +
            '    let b = a + y;' +
            '    let c = 0;' +
            '    ' +
            '    while (a < z) {' +
            '        c = a + b;' +
            '        z = c * 2;' +
            '    }' +
            '    ' +
            '    return z;' +
            '}';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function foo(x, y, z) {' +
            'while (x + 1 < z) {' +
            'z = (x + 1 + x + 1 + y) * 2;' +
            '}' +
            'return z;' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 3', () => {
        let codeToParse = 'global1 = 10;' +
            'global2 = 20;' +
            'global3 = 30;' +
            'function foo(x, y, z){' +
            '    let a = x + 1;' +
            '    let b = a + y;' +
            '    let c = 0;' +
            '    if (global1 == global2)' +
            '        z = a + b;' +
            '    else  if (global2 == global3)' +
            '        z = a - b;' +
            '    else  if (global1 == global3)' +
            '        z = a * c;' +
            '    else ' +
            '        z = c;' +
            '}' +
            'global4 = 40;' +
            'global5 = 50;' +
            'global6 = 60;';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'global1 = 10;' +
            'global2 = 20;' +
            'global3 = 30;' +
            'function foo(x, y, z) {' +
            'if (global1 == global2) z = x + 1 + x + 1 + y;' +
            'else if (global2 == global3) z = (x + 1) - (x + 1 + y);' +
            'else if (global1 == global3) z = (x + 1) * (0);' +
            'else z = 0;' +
            '}' +
            'global4 = 40;' +
            'global5 = 50;' +
            'global6 = 60;';
        let linesToRed = results[1];
        let requiredRedLines = [6, 7, 8];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 4', () => {
        let codeToParse = 'let global1 = 10;' +
            'let global2 = 20;' +
            'function func(a,b)' +
            '{' +
            'let c = 0;' +
            'let d = 0;' +
            'if(a>b)' +
            '{' +
            'a = c + d;' +
            'a = c + global1;' +
            'a = c + global2;' +
            'a = c * c;' +
            'a = c + 100;' +
            'return a + b;' +
            '}' +
            'if(b>a)' +
            '{' +
            'b = c + d;' +
            'b = c + global1;' +
            'b = c + global2;' +
            'b = c * c;' +
            'b = a - b;' +
            '}' +
            'else if(a == b)' +
            '{' +
            'a = c + d;' +
            'b = c + global1;' +
            'a = c + global2;' +
            'b = c * c;' +
            'a = c + 100;' +
            'b = c + 100;' +
            'return a * b;' +
            '}' +
            '}';
        let argumentsSection = '1,2';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let global1 = 10;' +
            'let global2 = 20;' +
            'function func(a, b) {' +
            'if (a > b) {' +
            'a = 0 + 0;' +
            'a = 0 + global1;' +
            'a = 0 + global2;' +
            'a = (0) * (0);' +
            'a = 0 + 100;' +
            'return a + b;' +
            '}' +
            'if (b > a) {' +
            'b = 0 + 0;' +
            'b = 0 + global1;' +
            'b = 0 + global2;' +
            'b = (0) * (0);' +
            'b = a - b;' +
            '} else if (a == b) {' +
            'a = 0 + 0;' +
            'b = 0 + global1;' +
            'a = 0 + global2;' +
            'b = (0) * (0);' +
            'a = 0 + 100;' +
            'b = 0 + 100;' +
            'return a * b;' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [5];
        let linesToGreen = results[2];
        let requiredGreenLines = [13];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 5', () => {
        let codeToParse = 'function func(a,b)' +
            '{' +
            '     let c;' +
            '     c = 10;' +
            '     if(a>b)' +
            'return a + c;' +
            ' else if(b>a)' +
            ' return b + c;' +
            ' else' +
            ' return a * b;' +
            '}';
        let argumentsSection = '1,2';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function func(a, b) {' +
            'if (a > b) return a + 10;' +
            'else if (b > a) return b + 10;' +
            'else return a * b;' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [2];
        let linesToGreen = results[2];
        let requiredGreenLines = [3];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 6', () => {
        let codeToParse = 'function func(a,b,c)' +
            '{' +
            'let result = 0;' +
            'if(a[0] == b[0])' +
            '{' +
            'result  = a[0] + b[0];' +
            'return result;' +
            '}' +
            'else' +
            '{' +
            'result = a[1] * b[1];' +
            'return result;' +
            '}' +
            '}';
        let argumentsSection = '[1,2],[3,4,5],5';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function func(a, b, c) {' +
            'if (a[0] == b[0]) {' +
            'return a[0] + b[0];' +
            '} else {' +
            'return a[1] * b[1];' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [2];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 7', () => {
        let codeToParse = 'function foo(x, y, z){' +
            '    let a = x + 1;' +
            '    let b = a + y;' +
            '    let c = 0;' +
            '    ' +
            '    while (a < z) {' +
            '        c = a + b;' +
            '        z = 2 * c;' +
            '    }' +
            '    ' +
            '    return z;' +
            '}';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function foo(x, y, z) {' +
            'while (x + 1 < z) {' +
            'z = 2 * (x + 1 + x + 1 + y);' +
            '}' +
            'return z;' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 8', () => {
        let codeToParse = 'function func(a,b)' +
            '{' +
            'let result = 0;' +
            'if(a[0] == b[0])' +
            '{' +
            'result  = a[0] + b[0];' +
            'return result;' +
            '}' +
            'else' +
            '{' +
            'result = a[1] * b[1];' +
            'return result;' +
            '}' +
            '}';
        let argumentsSection = '[1,2],[3,4,5]';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function func(a, b) {' +
            'if (a[0] == b[0]) {' +
            'return a[0] + b[0];' +
            '} else {' +
            'return a[1] * b[1];' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [2];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 9', () => {
        let codeToParse = 'function func(a,b,c)' +
            '{' +
            '        let z = a[0]+b[0];' +
            'let result = 0;' +
            'if(a[0] < b[0])' +
            '{' +
            'result  = a[0] + b[0] * 1;' +
            'return result;' +
            '}' +
            'else' +
            '{' +
            'result = 2 - z;' +
            'return result;' +
            '}' +
            '}';
        let argumentsSection = '[1,2],[3,4,5],100';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function func(a, b, c) {' +
            'if (a[0] < b[0]) {' +
            'return a[0] + b[0] * 1;' +
            '} else {' +
            'return 2 - (a[0] + b[0]);' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [2];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 10', () => {
        let codeToParse = 'function func(a,b,c)' +
            '{' +
            '        let z = a[0]+b[0];' +
            'let result = 0;' +
            'if(a[0] < b[0])' +
            '{' +
            'result  = a[0] + b[0] * 1;' +
            'return result;' +
            '}' +
            'else' +
            '{' +
            'result = z / 2;' +
            'return result;' +
            '}' +
            '}';
        let argumentsSection = '[1,2],[3,4,5],100';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function func(a, b, c) {' +
            'if (a[0] < b[0]) {' +
            'return a[0] + b[0] * 1;' +
            '} else {' +
            'return (a[0] + b[0]) / 2;' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [2];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 11', () => {
        let codeToParse = 'let globalNumber1 = 0;' +
            'let globalNumber2 = 5;' +
            'let globalNumber3 = 10;' +
            'function myFunc(a,b,c)' +
            '{' +
            'let x = a + 1;' +
            'let y = x + 2;' +
            'let z = y + 3;' +
            'while(globalNumber3 > 0)' +
            '{' +
            'a = z - 2;' +
            '}' +
            'if(a < globalNumber1)' +
            '{' +
            'b = y * z;' +
            '}' +
            'else if(a > globalNumber1)' +
            '{' +
            'b = x * y;' +
            '}' +
            'else' +
            '{' +
            'b = x * y * z;' +
            '}' +
            'return b;' +
            '}';
        let argumentsSection = '0,5,10';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let globalNumber1 = 0;' +
            'let globalNumber2 = 5;' +
            'let globalNumber3 = 10;' +
            'function myFunc(a, b, c) {' +
            'while (globalNumber3 > 0) {' +
            'a = (a + 1 + 2 + 3) - 2;' +
            '}' +
            'if (a < globalNumber1) {' +
            'b = (a + 1 + 2) * (a + 1 + 2 + 3);' +
            '} else if (a > globalNumber1) {' +
            'b = (a + 1) * (a + 1 + 2);' +
            '} else {' +
            'b = (a + 1) * (a + 1 + 2) * (a + 1 + 2 + 3);' +
            '}' +
            'return b;' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [9, 11];
        let linesToGreen = results[2];
        let requiredGreenLines = [];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 12', () => {
        let codeToParse = 'function myFunc(a,b,c)' +
            '{' +
            'let x = a + b;' +
            'let y = x + c;' +
            'let z = y * 50;' +
            'if(a < b)' +
            '{' +
            'if((b - a) == 1)' +
            '{' +
            'if(z > 0)' +
            '{' +
            'b = z / 2;' +
            '}' +
            '}' +
            'else' +
            '{' +
            'a = z / 3;' +
            '}' +
            '}' +
            'else if (a > b)' +
            '{' +
            'if((a - b) == 1)' +
            '{' +
            ' b = z * 2;' +
            '}' +
            'else' +
            '{' +
            'b = z * 3;' +
            '}' +
            '}' +
            'else' +
            '{' +
            'return z * z;' +
            '}' +
            '}';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'function myFunc(a, b, c) {' +
            'if (a < b) {' +
            'if (b - a == 1) {' +
            'if ((a + b + c) * 50 > 0) {' +
            'b = ((a + b + c) * 50) / 2;' +
            '}' +
            '} else {' +
            'a = ((a + b + c) * 50) / 3;' +
            '}' +
            '} else if (a > b) {' +
            'if (a - b == 1) {' +
            'b = ((a + b + c) * 50) * 2;' +
            '} else {' +
            'b = ((a + b + c) * 50) * 3;' +
            '}' +
            '} else {' +
            'return ((a + b + c) * 50) * ((a + b + c) * 50);' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [2, 3, 4];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 13', () => {
        let codeToParse = 'let global1 = 2;' +
            'let global2  = 4;' +
            'let global3  = 8;' +
            'let myName = \'TomerLev\';' +
            'function foo() {' +
            '    if(global2 > global1 ){' +
            '        if(global3 > global2 ){' +
            '            if(myName.length === global3 ){' +
            '                return true;' +
            '            }      ' +
            '        }' +
            '    }' +
            '}';
        let argumentsSection = '1,2,3';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let global1 = 2;' +
            'let global2 = 4;' +
            'let global3 = 8;' +
            'let myName = \'TomerLev\';' +
            'function foo() {' +
            'if (global2 > global1) {' +
            'if (global3 > global2) {' +
            'if (myName.length === global3) {' +
            'return true;' +
            '}' +
            '}' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [7, 8, 9];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 14', () => {
        let codeToParse = 'let global1 = 10;' +
            'let global2 = 45;' +
            'function func(arg1,arg2) ' +
            '{' +
            '    let a = arg1;' +
            '    if((global1+a) * 3 === global2)' +
            '    {' +
            '        if(global3 / 2 !== 10)' +
            '        {' +
            '            return global1;' +
            '        }' +
            '    }' +
            '}' +
            'let global3 = 30;';
        let argumentsSection = '5,20';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let global1 = 10;' +
            'let global2 = 45;' +
            'function func(arg1, arg2) {' +
            'if ((global1 + (arg1)) * 3 === global2) {' +
            'if (global3 / 2 !== 10) {' +
            'return global1;' +
            '}' +
            '}' +
            '}' +
            'let global3 = 30;';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [5,6];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 15', () => {
        let codeToParse = 'let globalArray = [13,\'Tomer\',true,false];' +
            'let name = globalArray[1];' +
            'let firstLetter = name[0];' +
            'let predicat = globalArray[2];' +
            'function myFunc()' +
            '{' +
            'if(predicat)' +
            '{' +
            'if(firstLetter === \'T\')' +
            '{' +
            'return globalArray[2];' +
            '}' +
            'else' +
            '{' +
            'return globalArray[3];' +
            '}' +
            '}' +
            '}';
        let argumentsSection = '';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let globalArray = [13, \'Tomer\', true, false];' +
            'let name = [13, \'Tomer\', true, false][1];' +
            'let firstLetter = [13, \'Tomer\', true, false][1][0];' +
            'let predicat = [13, \'Tomer\', true, false][2];' +
            'function myFunc() {' +
            'if (predicat) {' +
            'if (firstLetter === \'T\') {' +
            'return globalArray[2];' +
            '} else {' +
            'return globalArray[3];' +
            '}' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [];
        let linesToGreen = results[2];
        let requiredGreenLines = [7,8];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
    it('Test 16', () => {
        let codeToParse = 'let global1 = 10;' +
            'let global2 = 1.5;' +
            'let global3 = true;' +
            'let global4 = \'Gili\';' +
            'let global5 = [20,false,\'Tomer\',3.14];' +
            'function bigTest(arg1,arg2,arg3)' +
            '{' +
            'let local = global5[2];' +
            'if(global3)' +
            '{' +
            'if(global5[1] === arg2[2])' +
            '{' +
            'if(global1*global2 !== arg2[0])' +
            '{' +
            'return global3;' +
            '}' +
            'else if(global5[1])' +
            '{' +
            'return global4;' +
            '}' +
            'else if(arg1[4] === \'o\')' +
            '{' +
            'return local[1][1];' +
            '}' +
            '}' +
            '}' +
            '}';
        let argumentsSection = '\'Shimon\',[15,1,false,\'Lol\'],555';
        let results = parseCode(codeToParse, argumentsSection);
        let substitutedFunction = results[0].join('\n');
        let requiredResult = 'let global1 = 10;' +
            'let global2 = 1.5;' +
            'let global3 = true;' +
            'let global4 = \'Gili\';' +
            'let global5 = [20, false, \'Tomer\', 3.14];' +
            'function bigTest(arg1, arg2, arg3) {' +
            'if (global3) {' +
            'if (global5[1] === arg2[2]) {' +
            'if (global1 * global2 !== arg2[0]) {' +
            'return global3;' +
            '} else if (global5[1]) {' +
            'return global4;' +
            '} else if (arg1[4] === \'o\') {' +
            'return [20, false, \'Tomer\', 3.14][2][1][1];' +
            '}' +
            '}' +
            '}' +
            '}';
        let linesToRed = results[1];
        let requiredRedLines = [10,12];
        let linesToGreen = results[2];
        let requiredGreenLines = [8,9,14];
        assert.strictEqual(
            substitutedFunction.replace(/\s/g, ''),
            requiredResult.replace(/\s/g, '')
        );
        assert.deepStrictEqual(
            linesToRed,
            requiredRedLines
        );
        assert.deepStrictEqual(
            linesToGreen,
            requiredGreenLines
        );
    });
});
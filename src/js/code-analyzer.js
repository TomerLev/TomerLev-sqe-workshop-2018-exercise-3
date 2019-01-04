import * as esprima from 'esprima';

const StringBuilder = require('string-builder');
const esgraph = require('esgraph');

const generateCFG = (code, args) => {
    const cfg = esgraph(esprima.parse(code, {range: true}).body[0].body);
    let dotCode = esgraph.dot(cfg, {counter: 0, source: code});
    dotCode = deleteExceptionTransitions(dotCode);
    dotCode = deleteEntryAndExitStates(dotCode);
    dotCode = makeConditionsDiamondShape(dotCode);
    dotCode = splitComplexConditions(dotCode, []);
    dotCode = unifyStates(dotCode);
    dotCode = makeRectangle(dotCode);
    dotCode = doMergeStates(dotCode);
    dotCode = colorTheGraph(dotCode, esprima.parse(code, {range: true}).body[0].params, args);
    dotCode = numberStates(dotCode);
    dotCode = splitStatementsByNewLine(dotCode);
    dotCode = removeLetWord(dotCode);
    dotCode = 'digraph {\n' + dotCode + '\n}';
    console.log(dotCode);
    return dotCode;
};


function colorTheGraph(code, paramNames, args) {
    let colorString = new StringBuilder();
    let arrayOfArgs = divideIntoArgs(args);
    let throughNodes = [];
    for (let i = 0; i < paramNames.length; i++) {
        colorString.append('let ' + paramNames[i].name + ' = ' + arrayOfArgs[i] + '; ');
    }
    let splittedByNewLine = code.split('\n');
    let endOfFunction = false;
    let currentNumber = [1];
    while (!endOfFunction) {
        for (let i = 0; i < splittedByNewLine.length; i++) {
            if (splittedByNewLine[i].includes('n' + currentNumber[0]) && !splittedByNewLine[i].includes('->')) {
                endOfFunction = splittedByNewLine[i].includes('return');
                throughNodes.push('n' + currentNumber[0]);
                colorString.append(' ' + splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('"') + 1, splittedByNewLine[i].lastIndexOf('"')));
                if (splittedByNewLine[i].includes('diamond')) {
                    if (eval(colorString.toString())) {
                        for (let j = 0; j < splittedByNewLine.length; j++) {
                            if (splittedByNewLine[j].includes('n' + currentNumber[0]) && splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes('true')) {
                                currentNumber[0] = splittedByNewLine[j].slice(splittedByNewLine[j].lastIndexOf('n') + 1, splittedByNewLine[j].lastIndexOf('[') - 1);
                                break;
                            }
                        }
                    }
                    else {
                        for (let j = 0; j < splittedByNewLine.length; j++) {
                            if (splittedByNewLine[j].includes('n' + currentNumber[0]) && splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes('false')) {
                                currentNumber[0] = splittedByNewLine[j].slice(splittedByNewLine[j].lastIndexOf('n') + 1, splittedByNewLine[j].lastIndexOf('[') - 1);
                                break;
                            }
                        }
                    }
                    let string = colorString.toString();
                    string = string.slice(0, string.lastIndexOf(';') + 1);
                    colorString = new StringBuilder();
                    colorString.append(string);
                    break;
                }
                else {
                    for (let j = 0; j < splittedByNewLine.length; j++) {
                        if (splittedByNewLine[j].includes('n' + currentNumber[0]) && splittedByNewLine[j].includes('->') && (splittedByNewLine[j].indexOf('->') > splittedByNewLine[j].indexOf('n' + currentNumber))) {
                            currentNumber[0] = splittedByNewLine[j].slice(splittedByNewLine[j].lastIndexOf('n') + 1, splittedByNewLine[j].lastIndexOf('[') - 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (!splittedByNewLine[i].includes('->')) {
            let stateNumber = splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('n'), splittedByNewLine[i].indexOf('[') - 1);
            if (throughNodes.includes(stateNumber)) {
                splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].lastIndexOf(']')) + ',style=filled,color=limegreen];';
            }
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function getTopNumber(splittedByNewLine, topNumber) {
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes(' -> ')) {
            let from = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' '));
            let fromNumber = from.slice(1, from.length);
            topNumber[0] = Math.max(fromNumber, topNumber[0]);
            let to = splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('>') + 2, splittedByNewLine[i].indexOf('[') - 1);
            let toNumber = to.slice(1, to.length);
            topNumber[0] = Math.max(toNumber, topNumber[0]);
        }
    }
    topNumber[0]++;
}

function twoToOne(code)
{
    code = code.replace(/&&/g, '&');
    code = code.split('||').join('|');
    return code;
}
function splitComplexConditions(code, toRemove) {
    code = twoToOne(code)
    let splittedByNewLine = code.split('\n');
    let topNumber = [-1];
    getTopNumber(splittedByNewLine, topNumber);
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('&')) {
            let secondCond = splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('&') + 2, splittedByNewLine[i].lastIndexOf('"'));
            splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf('&')) + splittedByNewLine[i].slice(splittedByNewLine[i].lastIndexOf('"'), splittedByNewLine[i].length);
            splittedByNewLine = splittedByNewLine.concat('n' + topNumber[0] + ' [label="' + secondCond + '"' + ',shape=diamond]');
            let from = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' '));
            let to = 'n' + topNumber[0];
            let transitionTrueCase;
            let transitionFalseCase;
            for (let j = 0; j < splittedByNewLine.length; j++) {
                if (splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes(from) && splittedByNewLine[j].includes('label="true"')) {
                    transitionTrueCase = splittedByNewLine[j];
                    if (!toRemove.includes(transitionTrueCase)) {
                        splittedByNewLine[j] = '';
                    }
                    transitionTrueCase = transitionTrueCase.slice(transitionTrueCase.lastIndexOf('n'), transitionTrueCase.lastIndexOf(' '));
                }
                if (splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes(from) && splittedByNewLine[j].includes('label="false"')) {
                    transitionFalseCase = splittedByNewLine[j];
                    transitionFalseCase = transitionFalseCase.slice(transitionFalseCase.lastIndexOf('n'), transitionFalseCase.lastIndexOf(' '));
                }
            }
            splittedByNewLine = splittedByNewLine.concat(from + ' -> ' + to + ' [label="true"]');
            toRemove.push(from + ' -> ' + to + ' [label="true"]');
            splittedByNewLine = splittedByNewLine.concat(to + ' -> ' + transitionTrueCase + ' [label="true"]');
            splittedByNewLine = splittedByNewLine.concat(to + ' -> ' + transitionFalseCase + ' [label="false"]');
            break;
        }
        else if (splittedByNewLine[i].includes('|')) {
            let secondCond = splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('|') + 2, splittedByNewLine[i].lastIndexOf('"'));
            splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf('|')) + splittedByNewLine[i].slice(splittedByNewLine[i].lastIndexOf('"'), splittedByNewLine[i].length);
            splittedByNewLine = splittedByNewLine.concat('n' + topNumber[0] + ' [label="' + secondCond + '"' + ',shape=diamond]');
            let from = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' '));
            let to = 'n' + topNumber[0];
            let transitionTrueCase,transitionFalseCase;
            for (let j = 0; j < splittedByNewLine.length; j++) {
                if (splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes(from) && splittedByNewLine[j].includes('label="true"')) {
                    transitionTrueCase = splittedByNewLine[j];
                    transitionTrueCase = transitionTrueCase.slice(transitionTrueCase.lastIndexOf('n'), transitionTrueCase.lastIndexOf(' '));
                }
                if (splittedByNewLine[j].includes('->') && splittedByNewLine[j].includes(from) && splittedByNewLine[j].includes('label="false"')) {
                    transitionFalseCase = splittedByNewLine[j];
                    if (!toRemove.includes(transitionFalseCase)) {
                        splittedByNewLine[j] = '';
                    }
                    transitionFalseCase = transitionFalseCase.slice(transitionFalseCase.lastIndexOf('n'), transitionFalseCase.lastIndexOf(' '));
                }
            }
            splittedByNewLine = splittedByNewLine.concat(from + ' -> ' + to + ' [label="false"]');
            toRemove.push(from + ' -> ' + to + ' [label="false"]');
            splittedByNewLine = splittedByNewLine.concat(to + ' -> ' + transitionTrueCase + ' [label="true"]');
            splittedByNewLine = splittedByNewLine.concat(to + ' -> ' + transitionFalseCase + ' [label="false"]');
            break;
        }
    }
    let toReturnCode = splittedByNewLine.filter((element) => (element !== '')).join('\n');
    splittedByNewLine = toReturnCode.split('\n');
    let flag = false;
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('&') || splittedByNewLine[i].includes('|')) {
            flag = true;
            break;
        }
    }
    if (flag) {
        return splitComplexConditions(toReturnCode, toRemove);
    }
    else {
        return toReturnCode;
    }
}


function makeRectangle(code) {
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (!splittedByNewLine[i].includes('->')) {
            if (!splittedByNewLine[i].includes('shape')) {
                splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].lastIndexOf(']')) +
                    ',shape=rectangle' + ']';
            }
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function splitStatementsByNewLine(code) {
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        let count = (splittedByNewLine[i].match(/;/g) || []).length;
        if (count > 0) {
            splittedByNewLine[i] = splittedByNewLine[i].split(';').join('\n');
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function removeLetWord(code) {
    code = code.replace(/;/g, '');
    return code.replace(/let/g, '');
}

function fixArrows(splittedByNewLine, topNumber, stateToNumberOfArrowsIn, fromAndTo) {
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes(' -> ')) {
            let from = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' '));
            let fromNumber = from.slice(1, from.length);
            topNumber[0] = Math.max(fromNumber, topNumber[0]);
            let to = splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('>') + 2, splittedByNewLine[i].indexOf('[') - 1);
            let toNumber = to.slice(1, to.length);
            topNumber[0] = Math.max(toNumber, topNumber[0]);
            fromAndTo.set(from, to);
            if (stateToNumberOfArrowsIn.has(to)) {
                stateToNumberOfArrowsIn.set(to, stateToNumberOfArrowsIn.get(to) + 1);
            }
            else {
                stateToNumberOfArrowsIn.set(to, 1);
            }
        }
    }
    topNumber[0]++;
}

function isOk(splittedByNewLine, i, key) {
    return splittedByNewLine[i].includes(' -> ') && splittedByNewLine[i].includes(key) && (splittedByNewLine[i].indexOf(' -> ') < splittedByNewLine[i].indexOf(key));
}

function doMergeStates(code) {
    let splittedByNewLine = code.split('\n');
    let stateToNumberOfArrowsIn = new Map();
    let fromAndTo = new Map();
    let topNumber = [-1];
    fixArrows(splittedByNewLine, topNumber, stateToNumberOfArrowsIn, fromAndTo);
    for (let [key, value] of stateToNumberOfArrowsIn) {
        if (value > 1) {
            for (let i = 0; i < splittedByNewLine.length; i++) {
                if (isOk(splittedByNewLine, i, key)) {
                    splittedByNewLine[i] = splittedByNewLine[i].replace(key, 'n' + topNumber[0]);
                }
            }
            splittedByNewLine = splittedByNewLine.concat('n' + topNumber[0] + ' [label=""]');
            splittedByNewLine = splittedByNewLine.concat('n' + topNumber[0] + ' -> ' + key + ' []');
            topNumber[0]++;
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}


function numberStates(code) {
    let number = 1;
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (!splittedByNewLine[i].includes(' -> ') && splittedByNewLine[i].charAt(0) === 'n' && !splittedByNewLine[i].includes('""')) {
            splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf('"') + 1) + '- ' + number + ' -' + '\n' +
                splittedByNewLine[i].slice(splittedByNewLine[i].indexOf('"') + 1, splittedByNewLine[i].lastIndexOf(']') + 1);
            number++;
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}


function followingIsOk(str1, str2, word) {
    return !str1.includes(word) && !str2.includes(word);
}

function thereIsTransitions(str1, str2, code) {
    let myState = str1.slice(0, str1.indexOf(' '));
    let nextState = str2.slice(0, str2.indexOf(' '));
    return code.includes(myState + ' -> ' + nextState);
}

function canUnify(str1, str2, splittedByNewLine) {
    return followingIsOk(str1, str2, 'diamond') && followingIsOk(str1, str2, 'return') && followingIsOk(str1, str2, '->')
        && (numberOfArrowsIn(str1, splittedByNewLine) <= 1) && (numberOfArrowsIn(str2, splittedByNewLine) <= 1);
}

function numberOfArrowsIn(str, splittedByNewLine) {
    let counter = 0;
    let myState = str.slice(0, str.indexOf(' '));
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('->') && splittedByNewLine[i].includes(myState) && (splittedByNewLine[i].indexOf('->') < splittedByNewLine[i].indexOf(myState))) {
            counter++;
        }
    }
    return counter;
}

function addSecondStatement(splittedByNewLine, i) {
    let secondStatement = splittedByNewLine[i + 1].slice(splittedByNewLine[i + 1].indexOf('"') + 1, splittedByNewLine[i + 1].lastIndexOf('"'));
    if (!secondStatement.includes(';')) {
        secondStatement = secondStatement + ';';
    }
    if (splittedByNewLine[i].includes(';')) {

        splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].lastIndexOf('"')) + secondStatement + '"]';
    }
    else {
        splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].lastIndexOf('"')) + ';' + secondStatement + '"]';
    }
}

function deleteNotNeededStates(splittedByNewLine, myState, nextState, i) {
    for (let j = i + 2; j < splittedByNewLine.length; j++) {
        if (splittedByNewLine[j] !== undefined) {
            if (splittedByNewLine[j].includes(myState + ' -> ' + nextState)) {
                splittedByNewLine[j] = '';
            }
            else if (splittedByNewLine[j].includes(nextState)) {
                splittedByNewLine[j] = splittedByNewLine[j].replace(nextState, myState);
            }
        }
    }
}


function unifyStates(code) {
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (((i + 1) < splittedByNewLine.length) && canUnify(splittedByNewLine[i], splittedByNewLine[i + 1], splittedByNewLine)
            && thereIsTransitions(splittedByNewLine[i], splittedByNewLine[i + 1], splittedByNewLine.join('\n'))) {
            addSecondStatement(splittedByNewLine, i);
            let myState = splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' '));
            let nextState = splittedByNewLine[i + 1].slice(0, splittedByNewLine[i + 1].indexOf(' '));
            splittedByNewLine[i + 1] = '';
            deleteNotNeededStates(splittedByNewLine, myState, nextState, i);
            i = -1;
            splittedByNewLine = splittedByNewLine.filter((element) => (element !== ''));
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}


function makeConditionsDiamondShape(code) {
    let setOfConditions = new Set();
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('label="true"') || splittedByNewLine[i].includes('label="false"')) {
            setOfConditions.add(splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' ')));
        }
    }
    addDiamondShape(splittedByNewLine, setOfConditions);
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function addDiamondShape(splittedByNewLine, setOfConditions) {
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (!splittedByNewLine[i].includes('->')) {
            if (setOfConditions.has(splittedByNewLine[i].slice(0, splittedByNewLine[i].indexOf(' ')))) {
                splittedByNewLine[i] = splittedByNewLine[i].slice(0, splittedByNewLine[i].lastIndexOf(']')) +
                    ',shape=diamond' + ']';
            }
        }
    }
}


function deleteExceptionTransitions(code) {
    let splittedByNewLine = code.split('\n');
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes(', label="exception"')) {
            splittedByNewLine[i] = '';
        }
    }
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function deleteEntryAndExitStates(code) {
    let splittedByNewLine = code.split('\n');
    let indexOfEntry, indexOfExit;
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('label="entry"')) {
            indexOfEntry = splittedByNewLine[i].slice(1, splittedByNewLine[i].indexOf(' '));
        }
        if (splittedByNewLine[i].includes('label="exit"')) {
            indexOfExit = splittedByNewLine[i].slice(1, splittedByNewLine[i].indexOf(' '));
        }
    }
    doTheDeletion(splittedByNewLine, indexOfEntry, indexOfExit);
    return splittedByNewLine.filter((element) => (element !== '')).join('\n');
}

function doTheDeletion(splittedByNewLine, indexOfEntry, indexOfExit) {
    for (let i = 0; i < splittedByNewLine.length; i++) {
        if (splittedByNewLine[i].includes('n' + indexOfEntry) || splittedByNewLine[i].includes('n' + indexOfExit)) {
            splittedByNewLine[i] = '';
        }
    }
}

export {
    generateCFG
};

function divideIntoArgs(argumentsSection) {
    let arrayOfArgsToReturn = [];
    if (argumentsSection.indexOf('[') === -1) {
        return argumentsSection.split(',');
    }
    else {
        while (argumentsSection.indexOf('[') !== -1) {
            let argOfArray = argumentsSection.substring(argumentsSection.indexOf('['), argumentsSection.indexOf(']') + 1);
            let firstArgs = argumentsSection.substring(0, argumentsSection.indexOf('[')).split(',');
            for (let i = 0; i < firstArgs.length; i++) {
                arrayOfArgsToReturn.push(firstArgs[i]);
            }
            arrayOfArgsToReturn.push(argOfArray);
            argumentsSection = argumentsSection.substring(argumentsSection.indexOf(']') + 1, argumentsSection.length);
        }
        pushTheRest(argumentsSection, arrayOfArgsToReturn);
        return arrayOfArgsToReturn.filter((element) => (element !== ''));
    }
}

function pushTheRest(argumentsSection, arrayOfArgsToReturn) {
    if (argumentsSection.localeCompare('') !== 0) {
        let firstArgs = argumentsSection.split(',');
        for (let i = 0; i < firstArgs.length; i++) {
            arrayOfArgsToReturn.push(firstArgs[i]);
        }
    }
}
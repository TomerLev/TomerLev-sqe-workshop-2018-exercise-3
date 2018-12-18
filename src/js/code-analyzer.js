import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const StringBuilder = require('string-builder');
const beautify = require('js-beautify').js;

const parseCode = (codeToParse, argumentsSection) => {
    let arrayOfArgs = divideIntoArgs(argumentsSection);
    let parsedCode = esprima.parseScript(codeToParse, {loc: true, range: true});
    let functionAfterSub = new StringBuilder();
    let localVarsToVals = new Map();
    let globalVarsToVals = new Map();
    let argsToValues = new Map();
    parsedCode.body.forEach(function (element) {
        substitutePart(element, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, true);
    });
    functionAfterSub = beautify(functionAfterSub.toString(), {indent_size: 4});
    let linesToGreen = [];
    let linesToRed = [];
    determineColors(functionAfterSub, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
    let functionAfterSubSplittedByNewLine = functionAfterSub.split('\n');
    return [functionAfterSubSplittedByNewLine, linesToRed, linesToGreen];
};


function substitutePart(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    if (data.type.localeCompare('ReturnStatement') === 0) {
        substituteReturnStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub);
    }
    else if (data.type.localeCompare('FunctionDeclaration') === 0) {
        substituteFunctionDeclaration(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs);
    }
    else {
        return substitutePartType[data.type](data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
    }
}

const substitutePartType =
    {
        'FunctionDeclaration': substituteFunctionDeclaration,
        'VariableDeclaration': substituteVariableDeclaration,
        'ExpressionStatement': substituteExpressionStatement,
        'WhileStatement': substituteWhileStatement,
        'IfStatement': substituteIfStatement,
        'AssignmentExpression': substituteAssignmentExpression,
        'ReturnStatement': substituteReturnStatement
    };


export {
    parseCode
};

function substituteWhileStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    let varValueString = escodegen.generate(data.test);
    let varValueStringAfterSub = doSubstitute(varValueString, localVarsToVals);
    functionAfterSub.append('while (' + varValueStringAfterSub + '){');
    data.body.body.forEach(function (element) {
        substitutePart(element, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
    });
    functionAfterSub.append('}');
}

function substituteReturnStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub) {
    let varValueString = escodegen.generate(data.argument);
    let varValueStringAfterSub = doSubstitute(varValueString, localVarsToVals);
    functionAfterSub.append('return ' + varValueStringAfterSub + ';');
}

function substituteIfStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    let varValueString = escodegen.generate(data.test);
    let varValueStringAfterSub = doSubstitute(varValueString, localVarsToVals);
    functionAfterSub.append('if (' + varValueStringAfterSub + ')');
    let copyOfGlobalVarsToVals = new Map(globalVarsToVals);
    let copyOfLocalVarsToVals = new Map(localVarsToVals);
    checkBodyOfIf(data.consequent, copyOfLocalVarsToVals, copyOfGlobalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
    checkAlternate(data.alternate, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
}

function checkBodyOfIf(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    if (data.type.localeCompare('BlockStatement') === 0) {
        functionAfterSub.append('{');
        data.body.forEach(function (element) {
            substitutePart(element, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
        });
        functionAfterSub.append('}');
    }
    else {
        substitutePart(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
    }
}


function checkAlternate(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    if (data !== null) {
        if (data.type.localeCompare('IfStatement') === 0) {
            substituteElseIfStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);

        }
        else {
            substituteElseStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
        }
    }
}

function substituteElseIfStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    let varValueString = escodegen.generate(data.test);
    let varValueStringAfterSub = doSubstitute(varValueString, localVarsToVals);
    functionAfterSub.append('else if (' + varValueStringAfterSub + ')');
    let copyOfGlobalVarsToVals = new Map(globalVarsToVals);
    let copyOfLocalVarsToVals = new Map(localVarsToVals);
    checkBodyOfIf(data.consequent, copyOfLocalVarsToVals, copyOfGlobalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
    checkAlternate(data.alternate, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
}

function substituteElseStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    functionAfterSub.append('else ');
    let copyOfGlobalVarsToVals = new Map(globalVarsToVals);
    let copyOfLocalVarsToVals = new Map(localVarsToVals);
    checkBodyOfIf(data, copyOfLocalVarsToVals, copyOfGlobalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
}

function substituteExpressionStatement(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    substituteAssignmentExpression(data.expression, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal);
}

function substituteAssignmentExpression(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    let varNameString = escodegen.generate(data.left);
    let varValueString = escodegen.generate(data.right);
    let varValueStringAfterSub = doSubstitute(varValueString, localVarsToVals);
    if (isGlobal) {
        globalVarsToVals.set(varNameString, varValueStringAfterSub);
    }
    else if (!globalVarsToVals.has(varNameString) && !argsToValues.has(varNameString)) {
        localVarsToVals.set(varNameString, varValueStringAfterSub);
    }
    appendAssignment(varNameString, varValueStringAfterSub, globalVarsToVals, argsToValues, functionAfterSub);
}

function appendAssignment(varNameString, varValueStringAfterSub, globalVarsToVals, argsToValues, functionAfterSub) {
    if (globalVarsToVals.has(varNameString) || argsToValues.has(getVarName(varNameString))) {
        functionAfterSub.append(varNameString + ' = ' + varValueStringAfterSub + ';');
    }
}

function setValueToVar(varName, varValue, isGlobal, localVarsToVals, globalVarsToVals) {
    if (isGlobal) {
        globalVarsToVals.set(varName, varValue);
    }
    else {
        localVarsToVals.set(varName, varValue);
    }
}

function substituteVariableDeclaration(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, isGlobal) {
    data.declarations.forEach(function (element) {
        if (element.init === null) {
            setValueToVar(element.id.name, undefined, isGlobal, localVarsToVals, globalVarsToVals);
        }
        else {
            let varNameString = element.id.name;
            let varValueString = escodegen.generate(element.init).replace(/[\n]/g, '');
            if (varValueString.indexOf('[') !== -1) {
                varValueString = varValueString.replace(/ /g, '');
            }
            let varValueStringAfterSub = doSubstituteWithGlobals(varValueString, localVarsToVals, globalVarsToVals);
            setValueToVar(varNameString, varValueStringAfterSub, isGlobal, localVarsToVals, globalVarsToVals);
            if (globalVarsToVals.has(varNameString)) {
                functionAfterSub.append('let ' + varNameString + ' = ' + varValueStringAfterSub + ';');
            }
        }
    });
}

function substituteFunctionDeclaration(data, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs) {
    functionAfterSub.append('function ' + data.id.name + '(');
    let index = 0;
    data.params.forEach(function (element) {
        if (index === arrayOfArgs.length - 1) {
            functionAfterSub.append(element.name);
        }
        else {
            functionAfterSub.append(element.name + ', ');
        }
        argsToValues.set(element.name, arrayOfArgs[index]);
        index++;
    });
    functionAfterSub.append('){');
    data.body.body.forEach(function (element) {
        substitutePart(element, localVarsToVals, globalVarsToVals, argsToValues, functionAfterSub, arrayOfArgs, false);
    });
    functionAfterSub.append('}');
}

function doSubstitute(beforeSub, localVarsToVals) {
    let beforeSubSplittedBySpace = beforeSub.split(' ');
    for (let i = 0; i < beforeSubSplittedBySpace.length; i++) {
        let openParen = false;
        let closeParen = false;
        if (beforeSubSplittedBySpace[i].indexOf('(') !== -1) {
            openParen = true;
            beforeSubSplittedBySpace[i] = beforeSubSplittedBySpace[i].substring(1, beforeSubSplittedBySpace[i].length);
        }
        if (beforeSubSplittedBySpace[i].indexOf(')') !== -1) {
            closeParen = true;
            beforeSubSplittedBySpace[i] = beforeSubSplittedBySpace[i].substring(0, beforeSubSplittedBySpace[i].length - 1);
        }
        doSub(localVarsToVals, beforeSubSplittedBySpace, i);
        addOpenParen(openParen, beforeSubSplittedBySpace, i);
        addCloseParen(closeParen, beforeSubSplittedBySpace, i);
    }
    return beforeSubSplittedBySpace.join(' ');
}

function addOpenParen(openParen, beforeSubSplittedBySpace, i) {
    if (openParen) {
        beforeSubSplittedBySpace[i] = '(' + beforeSubSplittedBySpace[i];
    }
}

function addCloseParen(closeParen, beforeSubSplittedBySpace, i) {
    if (closeParen) {
        beforeSubSplittedBySpace[i] = beforeSubSplittedBySpace[i] + ')';
    }
}

function checkNeedForParenBefore(i, beforeSubSplittedBySpace) {
    return (((i + 1) < beforeSubSplittedBySpace.length) && (beforeSubSplittedBySpace[i + 1] === '*' || beforeSubSplittedBySpace[i + 1] === '/')
        || (beforeSubSplittedBySpace[i + 1] === '-'));
}

function checkNeedForParenAfter(i, beforeSubSplittedBySpace) {
    return (((i - 1) >= 0) && (beforeSubSplittedBySpace[i - 1] === '*' || beforeSubSplittedBySpace[i - 1] === '/') || beforeSubSplittedBySpace[i - 1] === '-');
}

function checkNeedForParen(i, beforeSubSplittedBySpace) {
    return (checkNeedForParenBefore(i, beforeSubSplittedBySpace) || checkNeedForParenAfter(i, beforeSubSplittedBySpace));
}

function doSub(VarsToVals, beforeSubSplittedBySpace, i) {
    if (VarsToVals.has(beforeSubSplittedBySpace[i])) {
        if (checkNeedForParen(i, beforeSubSplittedBySpace)) {
            beforeSubSplittedBySpace[i] = '(' + VarsToVals.get(beforeSubSplittedBySpace[i]) + ')';
        }
        else {
            beforeSubSplittedBySpace[i] = VarsToVals.get(beforeSubSplittedBySpace[i]);
        }
    }
    else if (VarsToVals.has(getVarName(beforeSubSplittedBySpace[i]))) {
        beforeSubSplittedBySpace[i] = VarsToVals.get(getVarName(beforeSubSplittedBySpace[i])) + beforeSubSplittedBySpace[i].substring(beforeSubSplittedBySpace[i].indexOf('['), beforeSubSplittedBySpace[i].lastIndexOf(']') + 1);
    }
    else if (VarsToVals.has(getVarName2(beforeSubSplittedBySpace[i]))) {
        beforeSubSplittedBySpace[i] = VarsToVals.get(getVarName2(beforeSubSplittedBySpace[i])) + beforeSubSplittedBySpace[i].substring(beforeSubSplittedBySpace[i].indexOf('.'), beforeSubSplittedBySpace[i].length);
    }
}

function doSubstituteWithGlobals(toTest, argsToValues, globalVarsToVals) {
    let beforeSubSplittedBySpace = toTest.split(' ');
    for (let i = 0; i < beforeSubSplittedBySpace.length; i++) {
        doSub(argsToValues, beforeSubSplittedBySpace, i);
        doSub(globalVarsToVals, beforeSubSplittedBySpace, i);
    }
    return beforeSubSplittedBySpace.join(' ');
}

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

function getVarName(expression) {
    let indexOfParen = expression.indexOf('[');
    if (indexOfParen === -1) {
        return expression;
    }
    else {
        return expression.substring(0, indexOfParen);
    }
}

function getVarName2(expression) {
    let indexOfDot = expression.indexOf('.');
    if (indexOfDot === -1) {
        return expression;
    }
    else {
        return expression.substring(0, indexOfDot);
    }
}

function determineColors(functionAfterSub, linesToGreen, linesToRed, argsToValues, globalVarsToVals) {
    let parsedFunc = esprima.parseScript(functionAfterSub, {loc: true, range: true});
    parsedFunc.body.forEach(function (element) {
        if (element.type.localeCompare('FunctionDeclaration') === 0) {
            element.body.body.forEach(function (element) {
                determineLinesOfColors(element, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
            });
        }
    });
}

function determineLinesOfColors(element, linesToGreen, linesToRed, argsToValues, globalVarsToVals) {
    if (element.type.localeCompare('IfStatement') === 0) {
        let toTest = escodegen.generate(element.test);
        toTest = toTest.split('(').join('( ');
        toTest = toTest.split(')').join(' )');
        toTest = doSubstituteWithGlobals(toTest, argsToValues, globalVarsToVals);
        doSafeEval(toTest, linesToRed, linesToGreen, element);
        checkInsideOfGreenIf(element, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
        if (checkIfAlternateIsIfStatement(element)) {
            if (!linesToGreen.includes(element.loc.start.line)) {
                determineLinesOfColors(element.alternate, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
            }
        }
    }
}

function checkIfAlternateIsIfStatement(element) {
    return (element.alternate !== null && element.alternate.type.localeCompare('IfStatement') === 0);
}

function doSafeEval(toTest, linesToRed, linesToGreen, element) {
    if (eval(toTest)) {
        linesToGreen.push(element.loc.start.line);
    }
    else {
        linesToRed.push(element.loc.start.line);
    }
}

function checkInsideOfGreenIf(element, linesToGreen, linesToRed, argsToValues, globalVarsToVals) {
    if (linesToGreen.includes(element.loc.start.line)) {
        if (element.consequent.type.localeCompare('BlockStatement') === 0) {
            element.consequent.body.forEach(function (element) {
                determineLinesOfColors(element, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
            });
        }
        else {
            determineLinesOfColors(element.consequent, linesToGreen, linesToRed, argsToValues, globalVarsToVals);
        }
    }
}
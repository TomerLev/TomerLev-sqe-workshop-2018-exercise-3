import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#ApplySymbolicSubstitutionButton').click(() => {
        let codeSection = $('#codeSection').val();
        let argumentsSection = $('#argumentsSection').val();
        let results = parseCode(codeSection, argumentsSection);
        let substitutedFunction = results[0];
        let linesToRed = results[1];
        let linesToGreen = results[2];
        $('#showResultFunctions').append(makeTableHTML(substitutedFunction, linesToRed, linesToGreen));
    });
});


function makeTableHTML(funcAfterSub, linesToRed, linesToGreen) {
    let result = '';
    for (let i = 0; i < funcAfterSub.length; i++) {
        if (linesToRed.includes(i + 1)) {
            result += '<tr class="Red">';
            result += '<td>' + funcAfterSub[i] + '</td>';
            result += '</tr>';
        }
        else if (linesToGreen.includes(i + 1)) {
            result += '<tr class="Green">';
            result += '<td>' + funcAfterSub[i] + '</td>';
            result += '</tr>';
        }
        else {
            result += '<tr>';
            result += '<td>' + funcAfterSub[i] + '</td>';
            result += '</tr>';
        }
    }
    return result;}

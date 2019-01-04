import $ from 'jquery';
import {generateCFG} from './code-analyzer';

const Viz = require('viz.js/viz');

$(document).ready(function () {
    $('#ApplySymbolicSubstitutionButton').click(() => {
        let codeSection = $('#codeSection').val();
        let argumentsSection = $('#argumentsSection').val();
        let dotCode = generateCFG(codeSection, argumentsSection);
        const workerURL = 'node_modules/viz.js/full.render.js';
        let viz = new Viz({workerURL});
        viz.renderSVGElement(dotCode)
            .then(function (element) {
                document.body.appendChild(element);
            })
            .catch(error => {
                viz = new Viz({workerURL});
            });

    });
});
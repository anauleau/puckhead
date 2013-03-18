window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), 1000, 1000);

    paper.path("M0,500L1000,500")
    puck = paper.circle(500, 500, 10);
    puck.attr({fill: '#333'});

    puck.node.onclick = function() {
      puck.attr('cx', puck.attrs.cx - 10);
    };
};
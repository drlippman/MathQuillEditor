/*
  This object contains the layouts we'll be using. These are exposed by the
  getLayoutstyle and getLayout functions it returns.
  We'll pass those functions to the MQeditor in the config.
 */
var myMQeditor = (function($) {
  var mobileLayout = [ //row 0
    [ //array of columns
      {s:2},
      {l:'\\left(\\right)', c:'t', w:'('},
      {l:'x^{}', c:'t', w:'^', nb:1},
      {s:.25},
      {b:'7'},
      {b:'8'},
      {b:'9'},
      {l:'\\frac{}{}', c:'t', w:'/'},
      {s:.75},
      {b:'&uarr;', c:'k', w:'Up'},
      {s:.5}
    ],
    [ //row 1
      {p:'Funcs', s:2, nb:1, 'panel': [
        [
          {l:'\\log', c:'f'},
          {l:'\\ln', c:'f'},
          {l:'\\log_{}', c:'f'},
          {l:'e^{}', c:'t', w:'e^'},
          {s:1},
          {s:1}
        ],
        [
          {l:'\\sin', c:'f'},
          {l:'\\cos', c:'f'},
          {l:'\\tan', c:'f'},
          {l:'\\sec', c:'f'},
          {l:'\\csc', c:'f'},
          {l:'\\cot', c:'f'}
        ],
        [
          {l:'\\sin^{-1}', c:'f'},
          {l:'\\cos^{-1}', c:'f'},
          {l:'\\tan^{-1}', c:'f'},
          {l:'\\sinh', c:'f'},
          {l:'\\cosh', c:'f'},
          {l:'\\tanh', c:'f'}
        ]
      ]},
      {l:'\\pi', nb:1},
      {l:'\\sqrt{}', c:'c', w:'sqrt', nb:1},
      {s:.25},
      {b:'4'},
      {b:'5'},
      {b:'6'},
      {b:'*'},
      {s:.25},
      {b:'&larr;', c:'k', w:'Left'},
      {b:'&rarr;', c:'k', w:'Right'}
    ],
    [ //row 2
      {s:2},
      {l:'\\infty'},
      {l:'\\sqrt[n]{}', c:'c', w:'nthroot', nb:1},
      {s:.25},
      {b:'1'},
      {b:'2'},
      {b:'3'},
      {b:'-'},
      {s:.75},
      {b:'&darr;', c:'k', w:'Down'},
      {s:.5}
    ],
    [ //row 3
      {p:'ABC', s:2, 'left': 0, 'panel': [
        [
          {p:'q'},{p:'w'},{p:'e'},{p:'r'},{p:'t'},
          {p:'y'},{p:'u'},{p:'i'},{p:'o'},{p:'p'}
        ],
        [
          {s:.5},{p:'a'},{p:'s'},{p:'d'},{p:'f'},{p:'g'},
          {p:'h'},{p:'j'},{p:'k'},{p:'o'},{s:.5}
        ],
        [
          {b:'&#8679;', c:'shift', s:1.5},
          {p:'z'},{p:'x'},{p:'c'},{p:'v'},{p:'b'},
          {p:'n'},{p:'m'},
          {b:'&#x232B;', c:'k', w:'Backspace', s:1.5}
        ],
        [
          {s:2},
          {l:'\\left[\\right]', c:'i', w:'[]'},
          {l:'\\langle{}', c:'c', w:'\\langle'},
          {p:'%'},
          {p:','},
          {b:'&larr;', c:'k', w:'Left'},
          {b:'&rarr;', c:'k', w:'Right'}
        ]
      ]},
      {p:'DNE', 'sm':2},
      {l:'\\left|\\right|', c:'t', w:'|', nb:1},
      {s:.25},
      {b:'0'},
      {b:'.'},
      {b:','},
      {b:'+'},
      {s:.25},
      {b:'&#x232B;', s:2, c:'k', w:'Backspace'},
    ]
  ];
  var ineqPanel = {b:'&le;', s:2, 'panel': [
    [
      {l:'\\lt'},
      {l:'\\gt'},
      {l:'\\le'},
      {l:'\\ge'}
    ],
    [
      {p:'or'},
      {p:'DNE', 'sm':2},
      {p:'all reals', c:'w', w:'\\text{all reals}', s:2}
    ]
  ]};
  var intervalPanel = {l:'\\left({},{}\\right]', s:2, 'panel': [
    [
      {l:'\\left(\\right)', c:'i', w:'()'},
      {l:'\\left[\\right]', c:'i', w:'[]'},
      {l:'\\left(\\right]', c:'i', w:'(]'},
      {l:'\\left[\\right)', c:'i', w:'[)'}
    ],
    [
      {l:'\\infty'},
      {l:'-\\infty', c:'w'},
      {l:'\\cup'},
      {s:1}
    ]
  ]};
  var matrixPanel = {p:'Matrix', s: 2, sm: 1, panel: [
    [
      {p:'2×2', c:'w', w:'\\begin{bmatrix}&\\\\&\\end{bmatrix}'},
      {p:'2×3', c:'w', w:'\\begin{bmatrix}&&\\\\&&\\end{bmatrix}'},
      {p:'3×3', c:'w', w:'\\begin{bmatrix}&&\\\\&&\\\\&&\\end{bmatrix}'},
      {p:'3×4', c:'w', w:'\\begin{bmatrix}&&&\\\\&&&\\\\&&&\\end{bmatrix}'}
    ],
    [
      {p:'+Col', c:'m', w:'addColumn'},
      {p:'-Col', c:'m', w:'deleteColumn'},
      {p:'+Row', c:'m', w:'addRow'},
      {p:'-Row', c:'m', w:'deleteRow'}
    ]
  ]};
  var underLayout = [
    [ //row 0
      {p:'Funcs', s:2, nb:1, 'panel': [
        [
          {l:'\\log', c:'f'},
          {l:'\\ln', c:'f'},
          {l:'\\log_{}', c:'f'},
          {l:'e^{}', c:'t', w:'e^'},
          {s:1},
          {s:1}
        ],
        [
          {l:'\\sin', c:'f', sm:1},
          {l:'\\cos', c:'f', sm:1},
          {l:'\\tan', c:'f', sm:1},
          {l:'\\sec', c:'f', sm:1},
          {l:'\\csc', c:'f', sm:1},
          {l:'\\cot', c:'f', sm:1}
        ],
        [
          {l:'\\sin^{-1}', c:'f', sm:1},
          {l:'\\cos^{-1}', c:'f', sm:1},
          {l:'\\tan^{-1}', c:'f', sm:1},
          {l:'\\sinh', c:'f', sm:1},
          {l:'\\cosh', c:'f', sm:1},
          {l:'\\tanh', c:'f', sm:1}
        ]
      ]},
      {l:'\\frac{}{}', c:'t', w:'/'},
      {l:'x^{}', c:'t', w:'^', nb:1},
      {l:'x_{}', c:'t', w:'_', nb:1},
      {l:'\\sqrt{}', c:'c', w:'sqrt', nb:1},
      {l:'\\sqrt[n]{}', c:'c', w:'nthroot', nb:1},
      {s:.25},
      {b:'&uarr;', c:'k', w:'Up'},
      {b:'&darr;', c:'k', w:'Down'},
    ],
    [ //row 1
      {s:2},
      {l:'\\left|\\right|', c:'t', w:'|', nb:1},
      {l:'\\left(\\right)', c:'t', w:'('},
      {l:'\\pi', nb:1},
      {l:'\\infty'},
      {p:'DNE', 'sm':2},
      {s:.25},
      {b:'&larr;', c:'k', w:'Left'},
      {b:'&rarr;', c:'k', w:'Right'}
    ],
    [ //row 2
      {s:7.25},
      {b:'&#x232B;', s:2, c:'k', w:'Backspace'}
    ]
  ];

  function getLayout(el) {
    var layoutstyle = MQeditor.getLayoutstyle();
    var baseid = el.id.substring(8);
    var textel = $('#'+baseid);
    //TODO: fix this - need to get from params
    var vars = textel.attr("data-mq-vars") || '';
    vars = (vars=='') ? [] : vars.split(/,/);
    var calcformat = textel.attr("data-mq");
    var qtype = calcformat.split(/,/)[0];
    var baselayout = [];
    if (layoutstyle === 'OSK') {
      baselayout = $.extend(true, [], mobileLayout);
      console.log(baselayout);
      if (vars.length > 0) {
        // replace spacer with vars buttons or panel control
        baselayout[0] = getVarsButtons(vars).concat(baselayout[0].slice(1));
      }
      if (qtype=='calcinterval') {
        if (calcformat.match(/inequality/)) {
          baselayout[2][0] = ineqPanel;
        } else {
          baselayout[2][0] = intervalPanel;
        }
      } else if (qtype=='calcmatrix') {
        baselayout[2][0] = matrixPanel;
      } else if (calcformat.match(/point/)) {
        baselayout[2][0] = {l:'\\left(\\right)', s:2, c:'t', w:'('};
      } else if (calcformat.match(/vector/)) {
        baselayout[2][0] = {l:'\\langle{}', s:2, c:'c', w:'\\langle'};
      }
      if (calcformat.match(/(list|set)/) || qtype=='string') {
        baselayout[3][6] = {'b':','};
      } else if (calcformat.match(/equation/)) { // replace , with =
        baselayout[3][6] = {'b':'='};
      }
    } else { // under layout
      baselayout = $.extend(true, [], underLayout);
      if (qtype=='calcinterval') {
        if (calcformat.match(/inequality/)) {
          baselayout[1][0] = ineqPanel;
        } else {
          baselayout[1][0] = intervalPanel;
        }
      } else if (qtype=='calcmatrix') {
        baselayout[1][0] = matrixPanel;
      } else if (calcformat.match(/point/)) {
        baselayout[1][0] = {l:'\\left(\\right)', s:2, c:'t', w:'('};
      } else if (calcformat.match(/vector/)) {
        baselayout[1][0] = {l:'\\langle{}', s:2, c:'c', w:'\\langle'};
      }
    }
    if (calcformat.match(/(fraction|mixed)/)) { // elim non-basic btns
      var r,c,sz;
      for (r=0;r<baselayout.length;r++) {
        for (c=0;c<baselayout[r].length;c++) {
          if (baselayout[r][c].hasOwnProperty('nb')) {
            sz = baselayout[r][c].s || 1;
            baselayout[r][c] = {s:sz};
          }
        }
      }
    }
    return baselayout;
  }
  var greekletters = [''];

  function getVarsButtons(vars) {
    for (var i=0; i<vars.length; i++) {
      vars[i] = vars[i].replace(/alpha|beta|chi|delta|epsilon|gamma|varphi|phi|psi|sigma|rho|theta|lambda|mu|nu|omega|tau/i,
        '\\$&');
    }
    if (vars.length<3 &&
      vars[0].length<3 &&
      vars[1].length<3
    ) {
      //put them as regular buttons.
      if (vars.length==1) {
        return [{'b':vars[0]},{'s':1}];
      } else {
        return [{'b':vars[0]},{'b':vars[1]}];
      }
    } else {
      var perrow = Math.min(8,Math.max(4, Math.ceil(vars.length/4)));
      var subarr = [];
      var cnt=0;
      for (nr=0;nr<Math.ceil(vars.length/perrow);nr++) {
        subarr[nr] = [];
        for (nc=0;nc<perrow;nc++) {
          if (cnt<vars.length) {
            subarr[nr][nc] = {'b':vars[cnt], c:'w'};
          } else {
            subarr[nr][nc] = {'s':1};
          }
          cnt++;
        }
      }
      return [{'p':'Vars', 's':2, 'panel':subarr.slice()}];
    }
  }


  return {
    getLayout: getLayout
  }
})(jQuery);


/*
  This code initializes everything
 */
// Tell the editor to use our functions above to generate layout
MQeditor.setConfig({
  getLayout: myMQeditor.getLayout
});

// set the default MathQuill config.
var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
MQ.config({
  leftRightIntoCmdGoes: 'up',
  supSubsRequireOperand: true,
  autoCommands: 'pi theta sqrt oo',
  autoParenOperators: true,
  addCommands: {'oo': ['VanillaSymbol', '\\infty ', '&infin;']},
});

// add button to toggle MQ on inputs
$(function() {
  /*$("input[type=text]").each(function(i,el) {
    var btn = $("<button/>", {
      type:"button",
      text:"MQ",
      click: function() {
        MQeditor.toggleMQ(el);
      }
    });
    $(this).after(btn);
  });
  */
 MQeditor.toggleMQAll("input");
});

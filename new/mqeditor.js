/*
  Equation Editor palette tool for MathQuill
  (c) David Lippman 2019
  Mozilla Public License, v. 2.0: http://mozilla.org/MPL/2.0/

  You can toggle a plain input field into a MathQuill field with attached
  editor using toggleMQ.  Alternatively if you already have an MathQuill
  mathfield, you can attach the editor using attachEditor.  If pre-creating
  mathfields, make sure you use substituteTextarea if your layoutstyle is 'OSK'

  To get anything to display, you'll need to first call setConfig with a config
  object defining either layout (an array describing the layout) or
  getLayout, a function that returns a layout array.

 */

var MQeditor = (function($) {
  var config = {
    layoutstyle: 'auto',
    layout: []
  };
  var MQconfig = {};
  var curMQfield = null;
  var blurTimer = null;
  var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);

  /*
    Config object for MQeditor
    layoutstyle:
      "under" for on-focus floating under entry box,
      "OSK" for on-focus fixed-position on-screen-keyboard
    layout: array that defines the palette buttons
    getLayout: a function that returns a layout. Gets passed the MQ element.
    getLayoutstyle: a function that returns a value for layoutstyle.
    toMQ:  function to convert text to MQ latex
    fromMQ: function to convert MQ latex to input
   */
  function setConfig(newconfig) {
    for (var i in newconfig) {
      config[i] = newconfig[i];
    }
  }

  /*
    MQconfig holds the config used when creating MQ editable fields
   */
  function setMQconfig(newconfig) {
    MQconfig = newconfig;
  }

  /*
    Toggles the given input field to/from a MathQuill field
    and attaches the editor to the field
    el: the input field node or id of input. Must have a unique id
    state: (optional) true to toggle to MQ; false to regular input
   */
  function toggleMQ(el, state, nofocus) {
    if (typeof el == 'string') {
      el = document.getElementById(el);
    }
    var newstate = state || (el.type != 'hidden');
    var textId = el.id;
    if (newstate === true) { // enable MQ
      var initval = $(el).attr("type","hidden").val();
      if (config.hasOwnProperty('toMQ')) { // convert format if needed
        initval = config.toMQ(initval);
      }
      var mqfield = $("#mqinput-"+textId);
      if (mqfield.length == 0) {  // no existing MQ input
        var span = $("<span/>", {
          id: "mqinput-"+textId,
          class: "mathquill-math-field",
          text: initval
        });
  			span.insertAfter(el);
        var thisMQconfig = {
          handlers: {
            edit: onMQedit
          }
        };
        if (config.hasOwnProperty("getLayoutstyle")) {
          config.curlayoutstyle = config.getLayoutstyle();
        } else if (config.layoutstyle == 'auto') {
          config.curlayoutstyle = getLayoutstyle();
        } else {
          config.curlayoutstyle = config.layoutstyle;
        }
        if (config.curlayoutstyle == 'OSK') {
          thisMQconfig.substituteTextarea = function () {
            var s = document.createElement('span');
            s.setAttribute('tabindex', 0);
            return s;
          };
          thisMQconfig.keyboardPassthrough = true;
        }
        mqfield = MQ.MathField(span[0], thisMQconfig).config(MQconfig);
        attachEditor(span);

      } else { // has existing MQ input
        mqfield.show();
  			mqfield = MQ(mqfield[0]).latex(initval);
      }
      if (nofocus !== true) {
        mqfield.focus();
      }
    } else { // disable MQ
      $(el).attr("type","text").focus();
      $("#mqinput-"+textId).hide();
    }

  }

  /*
    Toggles all inputs matching the selector to/from a MathQuill field
    state: (optional) true to toggle to MQ; false to regular input
   */
  function toggleMQAll(selector, state) {
    var newstate = state || (el.type != 'hidden');
    $(selector).each(function(i,el) {
      toggleMQ(el, newstate, true);
    });
  }

  /*
    Sets onfocus/onblur listeners to show/hide the editor on focus/blur
    call with the MQ node
   */
  function attachEditor(mqel) {
    // set up editor to display on focus
    $(mqel).find(".mq-textarea > *")
      .on('focus.mqeditor', showEditor)
      .on('blur.mqeditor', function() {
        blurTimer = setTimeout(hideEditor, 100);
      });
  }

  /*
    Display the editor, rebuilding the panel if needed
   */
  function showEditor(event) {
    clearTimeout(blurTimer);
    var mqel = $(event.target).closest(".mathquill-math-field");
    if (curMQfield === null) {
      // first time through: inject the mqeditor div
      $("body").append($("<div/>", {id:"mqeditor", class:"mqeditor"}));
      // prevent clicks in editor from triggering blur in MQ field
      $("#mqeditor").on("mousedown touchstart", function(evt) {evt.preventDefault();});
    }
    // update layoutStyle if needed
    var lastlayoutstyle = config.curlayoutstyle;
    if (config.hasOwnProperty("getLayoutstyle")) {
      config.curlayoutstyle = config.getLayoutstyle();
    } else if (config.layoutstyle == 'auto') {
      config.curlayoutstyle = getLayoutstyle();
    } else {
      config.curlayoutstyle = config.layoutstyle;
    }
    if (config.curlayoutstyle === 'OSK') {
      $("#mqeditor").addClass("fixedbottom");
    } else {
      $("#mqeditor").removeClass("fixedbottom");
    }
    // see if the field has changed
    if (curMQfield === null || mqel[0] != curMQfield.el() ||
      lastlayoutstyle !== config.curlayoutstyle
    ) {
      // new field; need to build the panel
      // update the layout based on the element
      if (config.hasOwnProperty("getLayout")) {
        config.layout = config.getLayout(mqel[0]);
      }
      // empty existing
      $("#mqeditor").empty().show();
      // build new panel
      buildPanel(document.getElementById("mqeditor"), config.layout);
      // render buttons then hide subpanels
      $("#mqeditor .mqed-btn.rend").each(function() {MQ.StaticMath(this, {mouseEvents: false}); });
      $("#mqeditor .mqed-subpanel").hide();
    }
    // now show and position the editor
    if (config.curlayoutstyle === 'OSK') {
      $("#mqeditor").slideDown(50);
    } else {
      $("#mqeditor").show();
    }
    positionEditor(mqel);
    curMQfield = MQ.MathField(mqel[0]);
  }

  /*
    Hide the editor
   */
  function hideEditor(event) {
    if (config.curlayoutstyle === 'OSK') {
      $("#mqeditor").slideUp(50);
    } else {
      $("#mqeditor").hide();
    }
  }

  /*
    Positions the editor below the MQ field, if layoutstyle dictates
   */
  function positionEditor(ref) {
    if (config.curlayoutstyle == 'under') {
    	var mqfield = $(ref).closest(".mathquill-math-field");
    	var offset = mqfield.offset();
    	var height = mqfield.height();
      var editorWidth = document.getElementById("mqeditor").offsetWidth;
      var editorLeft = offset.left;
      if (editorLeft + editorWidth > document.documentElement.clientWidth) {
        editorLeft = document.documentElement.clientWidth - editorWidth-5;
      }
    	$("#mqeditor").css("top", offset.top + height + 3).css("left", editorLeft);
    } else {
      $("#mqeditor").css("top", "auto").css("left", 0);
    }
  }
  /*
    Update the editor position, and update the regular input field
   */
  function onMQedit(mf) {
  	var el = mf.el();
  	positionEditor(el);
  	if (el.id.match(/mqinput/)) {
      var latex = mf.latex();
      if (config.hasOwnProperty('fromMQ')) {
        //convert to input format
        latex = config.fromMQ(latex);
      }
  		document.getElementById(el.id.substring(8)).value = latex;
  	}
  }

  /*
    The default layoutstyle calculator
   */
  function getLayoutstyle() {
    var width = document.documentElement.clientWidth;
    if (navigator.userAgent.match(/Android/) ||
      navigator.userAgent.match(/iPhone/) ||
      navigator.userAgent.match(/iPad/) ||
      width < 500
    ) {
      return 'OSK';
    } else {
      return 'under';
    }
  }

  /*
    Build the editor panel
  */
  function buildPanel(baseel, layoutarr) {
    var row,btn,rowel,btnel,btncont,r,c,cmdtype,cmdval,subpanel,nr,nc,cnt;
    for (r=0;r<layoutarr.length;r++) {
      rowel = document.createElement("div");
      rowel.className = 'mqed-row';
      row = layoutarr[r];
      for (c=0;c<row.length;c++) {
        btn = row[c];
        btncont = document.createElement("div");
        btncont.className = "mqed-btn-cont";
        // set size
        if (btn.hasOwnProperty('s')) {
          btncont.style.flexGrow = btn.s;
        }
        rowel.appendChild(btncont);
        if (!btn.hasOwnProperty('l') && !btn.hasOwnProperty('b') && !btn.hasOwnProperty('p')) {
          //spacer
          continue;
        }

        btnel = document.createElement("span");
        btnel.tabIndex = 0;
        if (btn.hasOwnProperty('l')) { // latex button
          btnel.className = "mqed-btn rend";
          btnel.innerText = btn.l;
          cmdtype = 'c';
          cmdval = btn.l.substring(1);
        } else if (btn.hasOwnProperty('b')) { // rendered text button
          btnel.className = "mqed-btn rend";
          btnel.innerHTML = btn.b;
          cmdtype = 't';
          cmdval = btn.b;
        } else { // plain text button
          btnel.className = "mqed-btn";
          btnel.innerHTML = btn.p;
          cmdtype = 't';
          cmdval = btn.p;
        }
        // override default command type
        if (btn.hasOwnProperty('c')) {
          cmdtype = btn.c;
          if (cmdtype == 'shift') {
            $(btnel).addClass("mqed-shift");
          }
        }
        // make it small; 1 for 90%, 2 for 80%, etc.
        if (btn.hasOwnProperty('sm')) {
          btnel.style.fontSize = (100-10*btn.sm) + '%';
        }
        // override what to write
        if (btn.hasOwnProperty('w')) {
          cmdval = btn.w;
        }
        // button controls a subpanel
        if (btn.hasOwnProperty('panel')) {
          subpanel = document.createElement("div");
          subpanel.id = baseel.id + '-sub-'+r+'-'+c;
          // set left or right position (as percent)
          if (btn.hasOwnProperty('left')) {
            subpanel.style.left = btn.left + '%';
            // ensure control button is still visible over panel
            btnel.style.zIndex = 200;
          } else {
            subpanel.style.left = 'auto';
          }
          if (btn.hasOwnProperty('right')) {
            subpanel.style.right = btn.right + '%';
          }
          subpanel.className = "mqed-subpanel";
          // build subpanel
          buildPanel(subpanel, btn.panel);
          baseel.appendChild(subpanel);
          cmdtype = 'showpanel';
          cmdval = subpanel.id;
        }
        $(btnel).data("cmdtype", cmdtype).data("cmdval", cmdval);
        $(btnel).on("click touchstart keydown", makeBtnListener(cmdtype, cmdval))
          .on("touchend", function(evt) { $(evt.currentTarget).removeClass("mactive"); });
        btncont.appendChild(btnel);
      }
      baseel.appendChild(rowel);
    }
  }

  /*
    Returns a listener function. Used in buildPanel
  */
  function makeBtnListener(cmdtype, cmdval) {
    return function (event) {
      handleMQbtn(event,cmdtype,cmdval);
    }
  }

  /*
    Handle an editor button click
  */
  function handleMQbtn(event, cmdtype, cmdval) {
    if (event.type=='keydown' && event.key !== 'Enter') {
      return;
    }
    if (event.type=='touchstart') {
      event.preventDefault();
      $(event.currentTarget).addClass("mactive");
    }


    // return focus to editor
    //clearTimeout(blurTimer);
    //curMQfield.focus();

    if (cmdtype == 't') {
      // do typedText
      if (cmdval.match(/^[a-zA-Z]$/)) {
        // check for shift key being active
        if ($(event.target).closest('.mqed-subpanel').find(".mqed-shift").hasClass("active")) {
          cmdval = cmdval.toUpperCase();
        }
      }
      curMQfield.typedText(cmdval);
    } else if (cmdtype == 'c') {
      // do MQ cmd
      curMQfield.cmd(cmdval);
    } else if (cmdtype=='w') {
      // do MQ write
      curMQfield.write(cmdval);
    } else if (cmdtype=='k') {
      // do MQ keystroke
      curMQfield.keystroke(cmdval);
    } else if (cmdtype=='f') {
      // function; if there's a selection, wrap it in parens and apply function
  		var sel = curMQfield.getSelection();
  		if (sel) {
  			curMQfield.write(cmdval+'\\left('+sel+'\\right)');
        curMQfield.keystroke('Left');
  		} else if (cmdval.match(/{}$/)) {
        curMQfield.typedText(cmdval.replace(/{}$/,''));
      } else {
  		  curMQfield.write(cmdval);
  		}
    } else if (cmdtype=='sf') {
      // simple function, that doesn't need parens.
  		var sel = curMQfield.getSelection();
  		if (sel) {
  			curMQfield.write(cmdval+'{'+sel+'}');
  		} else {
  		  curMQfield.cmd(cmdval);
  		}
  		curMQfield.keystroke('Left');
    } else if (cmdtype=='i') {
      // interval: if there's a selection, wrap it
  		var sel = curMQfield.getSelection();
      if (!sel) {
        sel = '';
      }
      var leftsym = cmdval.charAt(0);
      var rightsym = cmdval.charAt(1);
  		curMQfield.write('\\left'+leftsym+sel+'\\right'+rightsym);
      if (sel=='') {
        curMQfield.keystroke('Left');
      }
    } else if (cmdtype=='showpanel') {
      // show a panel
      var subpanel = document.getElementById(cmdval);
      var target = $(event.target).closest('.mqed-btn');
      if (subpanel.style.left === 'auto') {
        // set left now
        var targRight = target.parent().position().left + target.parent().width() + 2;
        subpanel.style.left = (100*targRight/$("#mqeditor").width()) + '%';
      }
      if (subpanel.style.display == 'none') { // show it
        // first hide any already-showing subpanels
        target.closest(".mqeditor").find(".mqed-subpanel").hide();
        target.closest(".mqeditor").find(".mqed-btn.active").removeClass("active");
        // make panel button active
        target.addClass("active");
        $(subpanel).show();
      } else { //hide it
        target.removeClass("active");
        $(subpanel).hide();
      }
    } else if (cmdtype=='shift') {
      // enable Shift in alphabet panel
      var target = $(event.target).closest('.mqed-btn');
      var subpanel = $(event.target).closest('.mqed-subpanel');
      var goingActive = !target.hasClass("active");
      if (goingActive) {
        target.addClass("active");
      } else {
        target.removeClass("active");
      }
      // change case of each button label
      subpanel.find(".mqed-btn").each(function(i,el) {
        var txt = el.textContent;
        if (txt.match(/^[a-zA-Z]$/)) {
          if (goingActive) {
            el.textContent = el.textContent.toUpperCase();
          } else {
            el.textContent = el.textContent.toLowerCase();
          }
        }
      });
    }
  }
  return {
    setConfig: setConfig,
    setMQconfig: setMQconfig,
    toggleMQ: toggleMQ,
    toggleMQAll: toggleMQAll,
    attachEditor: attachEditor,
    getLayoutstyle: getLayoutstyle
  }
})(jQuery);
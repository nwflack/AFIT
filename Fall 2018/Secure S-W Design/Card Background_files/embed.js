(function () {
    window.alensa_widget = window.alensa_widget || {};

    alensa_widget.execFuncOnWidgets = function (func) {
        var elements = null;
        if (typeof (document.getElementsByClassName) === 'function') {
            elements = document.getElementsByClassName("sstk_widget");
        }
        else {
            elements = document.querySelectorAll('.sstk_widget');
        }

        for (var i = 0; i < _wdata.length; i++) {
            for (var j = 0; j < elements.length; j++) {
                var w_id = elements[j].getAttribute("data-id");
                if (_wdata[i].widget_id == w_id) {
                    func(elements[j], _wdata[i]);
                    break;
                }
            }
        }
    };

    alensa_widget.init = function () {
        if (alensa_widget.loaded) {
            return;
        }

        if (typeof (_wdata) === 'undefined') {
            return;
        }
        alensa_widget.loaded = true;


        function InsertWidget(element, data) {
  
            var ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", data.server_url + "/widget/" + data.widget_id);
            ifrm.style.width = (data.width) + "px";
            ifrm.style.height = (data.height ) + "px";
            //ifrm.style.border = "1px solid #ccc";
            ifrm.hspace = 0;
            ifrm.vspace = 0;
            ifrm.scrolling = "no";
            ifrm.marginHeight = 0;
            ifrm.marginWidth = 0;
            ifrm.frameBorder = 0;
            element.appendChild(ifrm);
        }

        alensa_widget.execFuncOnWidgets(InsertWidget);
    };

    alensa_widget.init();

})();
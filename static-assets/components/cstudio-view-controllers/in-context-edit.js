/**
 * File: in-context-edit.js
 * Component ID: viewcontroller-in-context-edit
 * @author: Russ Danner
 * @date: 4.27.2011
 **/
(function(){

    var InContextEdit,
        Dom = YAHOO.util.Dom;

    CStudioAuthoring.register("ViewController.InContextEdit", function() {
        CStudioAuthoring.ViewController.InContextEdit.superclass.constructor.apply(this, arguments);
    });

    InContextEdit = CStudioAuthoring.ViewController.InContextEdit;
    YAHOO.extend(InContextEdit, CStudioAuthoring.ViewController.Base, {
        events: ["updateContent"],
        actions: [".update-content", ".cancel"],

        initialise: function(usrCfg) {
            Dom.setStyle(this.cfg.getProperty("context"), "overflow", "visible");
        },

        close: function() {
            var editorId = this.editorId;
            var iframeEl = window.top.document.getElementById("in-context-edit-editor-"+editorId);
            iframeEl.parentNode.parentNode.style.display = "none";
        },

        /**
         * on initialization, go out and get the content and
         * populate the dialog.
         *
         * on error, display the issue and then close the dialog
         */
        initializeContent: function(item, field, site, isEdit, callback, $modal, aux, editorId) {
            var iframeEl = window.top.document.getElementById("in-context-edit-editor-"+editorId);
            var dialogEl = document.getElementById("viewcontroller-in-context-edit-"+editorId+"_0_c");
            var dialogBodyEl = document.getElementById("viewcontroller-in-context-edit-"+editorId+"_0");
            aux = (aux) ? aux : {};

            CStudioAuthoring.Service.lookupContentType(CStudioAuthoringContext.site, item.contentType, {
                context: this,
                iframeEl: iframeEl,
                dialogEl: dialogEl,
                failure: crafter.noop,
                dialogBodyEl: dialogBodyEl,
                success: function(contentType) {
                    var windowUrl = "";
                    windowUrl = this.context.constructUrlWebFormSimpleEngine(contentType, item, field, site, isEdit, aux, editorId);

                    this.iframeEl.src = windowUrl;
                    this.context.editorId = editorId;
                    CStudioAuthoring.InContextEdit.registerDialog(editorId, this.context);

                    this.iframeEl.onload = function () {

                        var body = this.contentDocument.body,
                            html = $(body).parents('html').get(0),
                            count = 1,
                            max;

                        var interval = setInterval(function () {

                            max = Math.max(
                                body.scrollHeight,
                                html.offsetHeight,
                                html.clientHeight,
                                html.scrollHeight,
                                html.offsetHeight);

                            if (max > $(window.top).height()) {
                                max = $(window.top).height() - 100;
                            }

                            if (max > 350) {
                                clearInterval(interval);
                                $modal.height(max);
                            }

                            if (count++ > 10) {
                                clearInterval(interval);
                            }

                        }, 1000);

                    };

                }
            });
        },

        /**
         * get the content from the input and send it back to the server
         */
        updateContentActionClicked: function(buttonEl, evt) {
            //not used
        },

        /**
         * cancel the dialog
         */
        cancelActionClicked: function(buttonEl, evt) {
            //not used
        },

        /**
         * construct URL for simple form server
         */
        constructUrlWebFormSimpleEngine: function(contentType, item, field, site, isEdit, auxParams, editorId) {
            var windowUrl = "";
            var formId = contentType.form;
            var readOnly = false;

            for(var j=0; j<auxParams.length; j++) {
                if(auxParams[j].name=="changeTemplate") {
                    formId = auxParams[j].value;
                }

                if(auxParams[j].name == "readonly") {
                    readOnly = true;
                }
            }
            
            // double / can cause issues in some stores
            item.uri = item.uri.replace("//", "/");

            windowUrl = CStudioAuthoringContext.authoringAppBaseUri +
            "/form?site=" + site + 
            "&form=" + formId +
            "&path=" + item.uri;

            if(field) {
                windowUrl += "&iceId=" + field;
            } else {
                windowUrl += "&iceComponent=true";
            }

            if(isEdit == true || isEdit == "true"){
                windowUrl += "&edit="+isEdit;
            }
            
            if(readOnly == true) {
                windowUrl += "&readonly=true";
            }

            windowUrl += "&editorId="+editorId;

            return windowUrl;
        },

        /**
         * provide support for legacy form server
         */
        constructUrlWebFormLegacyFormServer: function(item, field, site) {
            var CMgs = CStudioAuthoring.Messages;
            var langBundle = CMgs.getBundle("forms", CStudioAuthoringContext.lang);
            CStudioAuthoring.Operations.showSimpleDialog(
                "legacyError-dialog",
                CStudioAuthoring.Operations.simpleDialogTypeINFO,
                CMgs.format(langBundle, "notification"),
                CMgs.format(langBundle, "legacyError"),
                null,
                YAHOO.widget.SimpleDialog.ICON_BLOCK,
                "studioDialog"
            );
        }
    });

    CStudioAuthoring.Env.ModuleMap.map("viewcontroller-in-context-edit", InContextEdit);

})();

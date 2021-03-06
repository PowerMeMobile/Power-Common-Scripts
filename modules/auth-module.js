﻿(function (globals, App, $) {
    'use strict';

    function AuthModule() {

        var self = this;

        this.options = {
            urlToLoadDialog: null
        }

        this.init = function (options, user) {
            for (var option in this.options)
                this.options[option] = options && options[option] !== undefined ? options[option] : this.options[option];

            self.user = user;
            ko.postbox.subscribe(App.events.login.signOut, function (ev) {
                self.loadInlineLogin();
            });
        }

        this.user = null;

        this.loadInlineLogin = function () {
            var self = this;
            if (!$('#inline-login-page').length) {
                $.get(self.options.urlToLoadDialog, null,
                    function (data) {
                        $('body').append(data);
                        openModal();
                        setTimeout(function () {
                            App.vms.login.applyLoginPageBindings();
                        }, 50);
                    });
            } else {
                if (!$('#inline-login-page').hasClass('in')) {
                    openModal();
                }
            }
        }

        var openModal = function () {
            $('#inline-login-page').modal('show');
        };
    }

    App.auth = new AuthModule();

}(this, App, jQuery));
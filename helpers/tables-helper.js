﻿(function (App, ko, $) {
    'use strict;'

    function TablesHelper() {
        var self = this;

        var baseOptions = {
            buttons: [],
            stateSave: true,
            stateDuration: 60,
            lengthMenu: [[25, 50, 100], [25, 50, 100]],
            language: {
                processing: '<div class="blocking"><i class="fa fa-spinner fa-spin fa-3x"></i></div>'
            },
            autoWidth: false,
            dom: '<"row"<"col-sm-6"l><"col-sm-6"<"pull-right"B>>><"row"<"col-xs-12"<"table-responsive"t><"new-table"r>>><"row"<"col-sm-6"><"col-sm-6"p>>'
        }

        var serverOptions = {
            serverSide: true,
            deferRender: true,
            processing: true,
            ajax: {
                type: 'POST',
                contentType: 'application/json',
                error: null
            }
        }

        this.composeServerOptions = function (custom, vm) {
            var options = $.extend(true, {}, baseOptions, serverOptions);
            options.ajax.data = function (data, settings) {
                var filter = vm.mapToSave();
                return JSON.stringify({ data: data, filter: filter });
            }

            return $.extend(true, options, custom);
        }

        this.composeClientOptions = function (options) {
            var options = $.extend(true, {}, baseOptions, options)

            return options;
        }

        this.addExport = function (options, vm) {
            options.buttons = [{
                text: 'Export',
                extend: 'collection',
                background: false,
                buttons: [{
                    text: 'Csv',
                    action: function (e, dt, node, config) {
                        vm.exportData('Csv');
                    }
                }, {
                    text: 'Excel',
                    action: function (e, dt, node, config) {
                        vm.exportData('Xlsx');
                    }
                }]
            }];

            return options;
        }

        this.linkTo = function (url, text, options) {
            return $("<a />",
                $.extend(options, {
                    href: url,
                    text: App.utils.unescape(text)
                }))[0].outerHTML;
        }

        this.linkAction = function (func, text, options) {
            return $("<a />",
                $.extend(options, {
                    href: 'javascript:' + func,
                    text: text
                }))[0].outerHTML;
        }

        this.dateTime = function (data) {
            return data ? new moment(data).format(App.backend.LocalizationSettings.DefaultDateTimeFormat) : null;
        }

        this.timeDate = function (data) {
            return data ? new moment(data).format(App.backend.LocalizationSettings.TimeDateFormat) : null;
        }

        this.renderIf = function (args, data, condition) {
            var meta = args[3];
            if (condition()) {
                if (data) {
                    if (!meta.settings.aoColumns[meta.col].bVisible)
                        meta.settings.oInstance.fnSetColumnVis(meta.col, 1, false);

                    if (typeof data === 'function')
                        return data();
                    else
                        return data;
                }
                return null;
            }
            else {
                if (meta.settings.aoColumns[meta.col].bVisible)
                    meta.settings.oInstance.fnSetColumnVis(meta.col, 0, false);

                return null;
            }
        }

        $.fn.dataTable.ext.errMode = 'throw';

        $.fn.dataTableExt.afnSortData['obsevable'] = function (oSettings, iColumn) {
            var query = oSettings.aoColumns[iColumn].data;
            var data = oSettings.oApi._fnGetDataMaster(oSettings);

            return $.map(data, function (item, i) {
                var expr = new Function('item', 'return item.' + query);
                return ko.unwrap(expr(item));
            });
        }
    }

    App.ns('helpers').table = new TablesHelper();

}(App, ko, jQuery));

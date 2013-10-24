/*global Addressbook, Backbone*/
Addressbook.Routers = Addressbook.Routers || {};
Addressbook.Controllers = Addressbook.Controllers || {};

(function() {


    Addressbook.Controllers.MainController = M.Controller.extend({

        testModel: null,

        contactCollection: null,

        applicationStart: function() {
            var that = this;
            var collection = new Addressbook.Collections.ContactsCollection(/*dummy*/);
            collection.fetch({
                success: function() {
                    //                        listView.render();
                    //Addressbook.testModel.set('lastname', collection.models[0].get('lastname'));
                    //Addressbook.testModel.set('firstname', collection.models[0].get('firstname'));
                    //Addressbook.testModel.set('value', collection.models[0].get('firstname') + ' - ' + collection.models[0].get('lastname'));
                }
            });

            this.contactCollection = collection;

            this.editModel = new Addressbook.Models.ContactsModel({
                firstname: 'aaa',
                lastname: 'aaa'
            });

            this.currentModel = this.editModel;

            this.detailView = Addressbook.Views.DetailView.design(this, null, true);

            Addressbook.layout = M.SwitchLayout.extend().design(this, null, true);

            Addressbook.layout.applyViews({
                content: this.detailView
            }).render();

            $('#main').html(Addressbook.layout.$el);
            PageTransitions.init();

        },

        show: function() {
            Addressbook.layout.applyViews({
                content: this.detailView
            });

            PageTransitions.next();
        },

        topcoatTheme: function() {
            M.TemplateManager._currentUI = 'topcoat';
            Addressbook.detailView.updateTemplate();
            Addressbook.detailView.render();
        },

        addEntry: function() {
            this.scope.set('currentModel', this.scope.contactCollection.create(this.scope.editModel.attributes));
        },

        removeEntry: function() {
            if( this.scope.currentModel ) {
                this.scope.currentModel.destroy();
                this.scope.set('currentModel', null);
            }
            this.scope.editModel.clear();
        },

        updateEntry: function() {
            if( this.scope.currentModel ) {
                this.scope.currentModel.save(this.scope.editModel.attributes);
            }
        }
    });

    Addressbook.Routers.MainRouter = M.Router.extend({
        routes: {
            '': 'indexCtrl',
            'secondpage': 'secondpageCtrl',
            'thirdpage': 'thirdpageCtrl'
        },


        initialize: function() {

            M.Router.prototype.initialize.apply(this, arguments);
            Addressbook.MainController = this.indexCtrl;
            Addressbook.EditController = this.editCtrl;
        },

        indexCtrl: Addressbook.Controllers.MainController.create(),

        secondpageCtrl: M.Controller.extend({
            initialize: function() {
                M.Router.prototype.initialize.apply(this, arguments);
                this.view = M.View.extend({
                    value: 'Second Page'
                }, {
                    btn: M.ButtonView.extend({
                        value: 'third',
                        events: {
                            click: function() {
                                Addressbook.navigate({
                                    route: '/thirdpage'
                                })
                            }
                        }
                    })
                }).design();
            },
            show: function() {

                Addressbook.layout.applyViews({
                    content: this.view
                });

                PageTransitions.next();
            },
            applicationStart: function() {
                Addressbook.navigate({
                    route: '/'
                });
            }
        }).create(),

        thirdpageCtrl: M.Controller.extend({
            initialize: function() {
                M.Router.prototype.initialize.apply(this, arguments);
                this.view = M.View.extend({
                    value: 'Third Page'
                }, {
                    btn: M.ButtonView.extend({
                        value: 'first',
                        events: {
                            click: function() {
                                Addressbook.navigate({
                                    route: '/'
                                })
                            }
                        }
                    })
                }).design();
            },
            show: function() {
                Addressbook.layout.applyViews({
                    content: this.view
                });

                PageTransitions.next();
            },
            applicationStart: function() {
                Addressbook.navigate({
                    route: '/'
                });
            }
        }).create()
    });

})();
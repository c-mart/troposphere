import ProviderMachineCollection from 'collections/ProviderMachineCollection';
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ProviderMachineConstants from 'constants/ProviderMachineConstants';
import _ from 'underscore';
import NotificationController from 'controllers/NotificationController';


let ProviderMachineStore = BaseStore.extend({
    collection: ProviderMachineCollection,

    removeCache: function(machine) {
      var queryParams = {machine_id: machine.id},
          queryString = this.generateQueryString(queryParams);

        this.queryModels[queryString] = null;

    },
    get: function(machineId) {
        if (!this.models) return this.fetchModels();
        var machine = BaseStore.prototype.get.apply(this, arguments);
        if (!machine) return this.fetchModel(machineId);
        return machine;
    },
    getMachinesFor: function(image) {
        var image_key = "image=" + image.id;
        var use_query = "?image_id="+image.id
        if(!this.queryModels[image_key]) {
            this.fetchWhere(use_query);
        } else {
            return this.queryModels[image_key];
        }
    },

    getProvidersForVersion: function(version) {
        var version_key = "version=" + version.id,
            use_query = "?version_id="+ version.id;

        if(!this.queryModels[version_key]) {
            this.fetchModelsFor(version_key, use_query);
        } else {
            return new Backbone.Collection(
                            this.queryModels[version_key]
                            .map((ver) => ver.get('provider'))
                        );
        }
    },

    getMachinesForVersion: function(version) {
        var version_key = "version=" + version.id,
            use_query = "?version_id="+ version.id;

        if(!this.queryModels[version_key]) {
            this.fetchModelsFor(version_key, use_query);
        } else {
            return new Backbone.Collection(
                            this.queryModels[version_key]
                        );
        }
    },

    fetchModelsFor: function(image_key, use_query) {
        //Based on 'the key', get all related objects
        if (!this.queryModels[image_key] && !this.isFetching) {
            this.isFetching = true;
            var models = new this.collection();
            models.fetch({
                url: _.result(models, 'url') + use_query
            }).done(function() {
                this.isFetching = false;

                this.queryModels[image_key] = models;
                if (this.pollingEnabled) {
                    this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
                }
                this.emitChange();

            }.bind(this));
        }
    }
});

let store = new ProviderMachineStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ProviderMachineConstants.UPDATE_PROVIDER_MACHINE:
            store.update(payload);
            break;

        default:
            return true;
    }

    store.emitChange();

    return true;
});

export default store;

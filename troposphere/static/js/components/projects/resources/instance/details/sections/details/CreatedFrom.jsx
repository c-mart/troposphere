import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import Router from "react-router";
import stores from "stores";

export default React.createClass({
    displayName: "CreatedFrom",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance,
            image = stores.ImageStore.get(instance.get("image").id);

        if (!image) {
            return (
            <div className="loading-tiny-inline"></div>
            );
        }

        return (
        <ResourceDetail label="Based on">
            <Router.Link to="image-details" params={{ imageId: image.id }}>
                {image.get("name")}
            </Router.Link>
        </ResourceDetail>
        );
    }
});

/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Checkbox.react'
  ],
  function (React, Backbone, Checkbox) {

    return React.createClass({

      propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),

        getResourceRows: React.PropTypes.func.isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,

        children: React.PropTypes.node.isRequired
      },

      toggleCheckbox: function(e){
        var isChecked = this.areAllResourcesSelected();

        this.props.resources.each(function(resource){
          if (!isChecked) {
            this.props.onResourceSelected(resource);
          } else {
            this.props.onResourceDeselected(resource);
          }
        }.bind(this));
      },

      areAllResourcesSelected: function(){
        var allResourcesSelected = true;
        this.props.resources.each(function(resource){
          if(!this.props.selectedResources.get(resource)) allResourcesSelected = false;
        }.bind(this));
        return allResourcesSelected;
      },

      render: function () {
        var resourceRows = this.props.getResourceRows();

        return (
          <table className="table table-hover">
            <thead>
              <tr onClick={this.toggleCheckbox}>
                <th><Checkbox isChecked={this.areAllResourcesSelected()}/></th>
                {this.props.children}
              </tr>
            </thead>
            <tbody>
              {resourceRows}
            </tbody>
          </table>
        );
      }

    });

  });

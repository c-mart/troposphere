define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url'
  ],
  function (React, Gravatar, Backbone, URL) {

    var Rating = React.createClass({
      render: function () {
        var repeatString = function (string, num) {
          return new Array(num + 1).join(string);
        };
        return React.DOM.div({className: 'star-rating'},
          repeatString("\u2605", this.props.rating) +
            repeatString("\u2606", 5 - this.props.rating));
      }
    });

    var Tags = React.createClass({
      render: function () {
        var tags = this.props.tags.map(function (tag) {
          return React.DOM.li({className: 'tag', key: tag}, React.DOM.a({href: '#'}, tag));
        });

        return React.DOM.ul({className: 'tags'}, tags);
      }
    });

    var Bookmark = React.createClass({
      toggleFavorite: function (e) {
        e.preventDefault();
        this.props.application.set('favorite', !this.props.application.get('favorite'));
      },
      render: function () {
        var isFavorite = this.props.application.get('favorite')
        return React.DOM.a({
          className: 'bookmark ' + (isFavorite ? 'on' : 'off'),
          href: '#',
          onClick: this.toggleFavorite
        });
      }
    });

    var ApplicationCard = React.createClass({
      getDefaultProps: function () {
        return {
          showDetails: true,
          showLaunch: false
        };
      },
      onAppClick: function (e) {
        e.preventDefault();
        var url = URL.application(this.props.application);
        Backbone.history.navigate(url, {trigger: true});
      },
      render: function () {
        var app = this.props.application;

        var iconSize = 150;
        var icon;
        if (app.get('icon'))
          icon = React.DOM.img({
            src: app.get('icon'),
            width: iconSize,
            height: iconSize
          });
        else
          icon = Gravatar({hash: app.get('uuid_hash'), size: iconSize});

        var appUri = URL.application(app, {absolute: true});

        return React.DOM.div({className: 'app-card'},
          React.DOM.div({className: 'icon-container'}, React.DOM.a({
            href: appUri,
            onClick: this.onAppClick
          }, icon)),
          React.DOM.div({className: 'app-name'}, React.DOM.a({
            href: appUri,
            onClick: this.onAppClick,
            title: app.get('name_or_id')
          }, app.get('name_or_id'))),
          Rating({rating: app.get('rating')}),
          React.DOM.button({
            className: 'btn btn-primary btn-block launch-button',
            onClick: this.props.onLaunch}, "Launch"),
          Bookmark({application: app}));
      }
    });

    var ApplicationCardList = React.createClass({
      render: function () {
        var apps = this.props.applications;
        return React.DOM.div({},
          React.DOM.h3({}, this.props.title),
          React.DOM.ul({className: 'app-card-list'}, apps.map(function (app) {
            return React.DOM.li({}, ApplicationCard({application: app}));
          })));
      }
    });

    return {
      "ApplicationCardList": ApplicationCardList,
      "ApplicationCard": ApplicationCard,
      "Rating": Rating,
      "Tags": Tags
    };

  });

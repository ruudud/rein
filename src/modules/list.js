/*global Modernizr: true, canvg: true*/
(function (L, W, REIN, $) {
  L.Views.Browse = REIN.View.extend({
    template: REIN.templates.browse,
    subviews: {
      areas: null,
      districts: null,
      marks: null
      //search: null,
    },

    initialize: function () {
      this.subviews.marks = new L.Views.Marks();
      this.subviews.areas = new L.Views.Areas({collection: REIN.Areas});
      this.subviews.districts = new L.Views.Districts({collection: REIN.Areas});

      this.bindBackgroundEvents();
    },

    bindBackgroundEvents: function () {
      this.subviews.areas.on('select:area', this._onSelectArea, this);
      this.subviews.districts.on('select:district', this._onSelectDistrict, this);

      REIN.events.on('toggleSearch', this._onToggleSearch, this);
      REIN.events.on('search', this._onSearch, this);
    },

    render: function () {
      this.$el.html(this.template());
      this.assign(this.subviews);
      return this;
    },

    _onSelectArea: function (areaId) {
      this.activeArea = areaId;
      this.subviews.districts.setAreaAndRender(areaId);
      this.subviews.marks.reset();
      this.subviews.marks.filterByArea(areaId);
    },

    _onSelectDistrict: function (districtId) {
      this.subviews.marks.renderMarksInDistrict(this.activeArea, districtId);
    },

    _onSearch: function () {
      this.subviews.areas.hide();
      this.subviews.districts.hide();
      this.reset();
    },

    _onToggleSearch: function (active) {
      if (!active) {
        this.subviews.areas.show();
        this.subviews.districts.show();
        this.subviews.marks.reset();
      }
    },

    reset: function () {
      this.subviews.areas.reset();
      this.$('.districts').html('');
    }

  });

  L.Views.Areas = REIN.View.extend({
    collection: {},
    itemTemplate: REIN.templates.area,
    _$areas: [],

    initialize: function () {
      this.on('item:click', this._onAreaClick, this);
    },

    render: function () {
      _.each(this.collection, function (item, id) {
        var area = new W.Views.ListItem({
          eventBus: this,
          model: item,
          template: this.itemTemplate
        });
        this.$el.append(area.render().$el);
        this._$areas.push(area);
      }.bind(this));
      return this;
    },

    reset: function () {
      this.$('.selected').removeClass('selected');
    },

    _onAreaClick: function (id) {
      this.trigger('select:area', id);
      REIN.events.trigger('filter:area', id);
      REIN.tools.trackEvent('browseArea', {
        category: 'nav',
        label: this.collection[id].name
      });
    }
  });

  L.Views.Districts = REIN.View.extend({
    className: 'selectable',
    collection: {},
    activeDistrict: -1,
    activeArea: -1,
    itemTemplate: REIN.templates.area,
    template: REIN.templates.list,
    _listItems: [],

    initialize: function () {
      this.on('item:click', this._onDistrictClick, this);
    },

    render: function () {
      if (this.activeArea < 0) {
        return this;
      }

      this.$el.html(this.template({
        className: this.className,
        title: REIN.Areas[this.activeArea].name
      }));
      this.renderDistricts(this.$('.list'));

      this.scrollTo();
    },

    renderDistricts: function (container) {
      _.each(this.collection, function (item, id) {
        var listItem = new W.Views.ListItem(_.extend(this.options, {
          eventBus: this,
          model: this._getModel(id, item),
          template: this.itemTemplate
        }));
        container.append(listItem.render().el);
        this._listItems.push(listItem);
      }.bind(this));
      return this;
    },

    setAreaAndRender: function (areaId) {
      this.activeArea = areaId;
      this.collection = REIN.Areas[areaId].districts;
      this.render();
      this.show();
    },

    reset: function () {
      this.$('.selected').removeclass('selected');
    },

    _onDistrictClick: function (districtId) {
      this.activeDistrict = districtId;
      this.trigger('select:district', districtId);
      REIN.events.trigger('filter:district', districtId);
      REIN.tools.trackEvent('browseDistrict', {
        category: 'nav',
        label: this.collection[districtId].name
      });
    },

    _getModel: function (id, item) {
      var model = _.extend({
        id: id,
        count: REIN.Register.filter(function (m) {
          return m.district === parseInt(id, 10);
        }).length
      }, item);
      return model;
    }
  });

  L.Views.Marks = REIN.View.extend({
    className: '',
    template: REIN.templates.list,
    _marksInActiveArea: new Backbone.Collection(),

    initialize: function () {
      this.markList = new L.Views.MarkList();

      REIN.events.on('search', this.search, this);
    },

    render: function (title) {
      this.$el.html(this.template({
        className: this.className,
        title: title
      }));
      this.assign({'.list': this.markList});

      return this;
    },

    search: function (needle) {
      var hits, tElapsed, tPerChar, tBefore = +(new Date());
      REIN.events.trigger('loading:start');

      // TODO improve search, split needle for words
      needle = needle.toLowerCase().trim();

      hits = REIN.Register.filter(function (o) {
        var fullName = o.firstName + ' ' + o.lastName;
        return fullName.toLowerCase().indexOf(needle) > -1;
      });
      this.markList.collection.reset(hits, { silent: true });

      this.render('«' + needle + '» gav ' + hits.length + ' treff');
      this.show();
      //REIN.tools.defer(this._currentHits, 'reset', 200, hits);

      tElapsed = +(new Date()) - tBefore;
      tPerChar = tElapsed / needle.length;
      REIN.tools.trackEvent('search', { timePerChar: tPerChar });
    },

    renderMarksInDistrict: function (areaId, districtId) {
      var hits, districtName;

      this.reset();
      hits = this.filterByDistrict(districtId);
      this.markList.collection.reset(hits, { silent: true });

      districtName = REIN.Areas[areaId].districts[districtId].name;
      this.render(districtName);
      this.show();
      this.scrollTo();
    },

    filterByArea: function (areaId) {
      this.reset();

      var hits = REIN.Register.filter(function (o) {
        return o.area === areaId;
      });
      this._marksInActiveArea.reset(hits, {silent: true});
      return this._marksInActiveArea;
    },

    filterByDistrict: function (districtId) {
      //REIN.events.trigger('loading:start');
      var hits = this._marksInActiveArea.filter(function (o) {
        return o.get('district') === districtId;
      });
      return hits;
      // Need to delay by 200ms to ensure animation start
      //REIN.tools.defer(this._marksInActiveArea, 'reset', 200, hits);
    },

    reset: function () {
      this.$el.html('');
      this.markList.clearExistingViews();
    }
  });

  L.Views.MarkList = REIN.View.extend({
    tagName: 'ul',
    className: 'marks',
    collection: new Backbone.Collection(),
    loading: false,
    templates: {
      mark: REIN.templates.mark,
      svg: REIN.templates.svg,
      canvas: REIN.templates.canvas
    },

    render: function () {
      this.collection.each(function (owner) {
        var markItem = new L.Views.Mark({
          model: owner,
          templates: this.templates
        });
        this.$el.append(markItem.render().el);
      }.bind(this));
      REIN.events.trigger('loading:end');
      return this;
    },

    clearExistingViews: function () {
      this.$el.empty();
    }
  });

  L.Views.Mark = REIN.View.extend({
    className: 'mark',
    tagName: 'li',
    model: new Backbone.Model({}),
    _isOpen: false,
    events: {'click': '_onClick'},

    render: function () {
      var mark = this.model.toJSON(),
        ears = REIN.Ears[mark.cutId],
        districtName = REIN.Areas[mark.area].districts[mark.district].name,
        svg = this.options.templates.svg({
          left: ears[0],
          right: ears[1]
        });
      this.$el.html(this.options.templates.mark({
        districtName: districtName,
        mark: mark
      }));
      if (Modernizr.inlinesvg) {
        this.$('.image').append(svg);
      } else {
        this.renderSvgInCanvas(svg);
      }
      return this;
    },

    renderSvgInCanvas: function (svg) {
      this.$('.image').prepend(this.options.templates.canvas());
      // canvg requires fixed width and height to scale correctly:
      // http://code.google.com/p/canvg/issues/detail?id=74
      var $canvas = this.$('canvas'),
        viewPortWidth = $(window).width(),
        canvasWidth = viewPortWidth > 320 ? 320 : viewPortWidth,
        canvasHeight = canvasWidth * 0.35;

      $canvas.width(canvasWidth + 'px').height(canvasHeight + 'px');
      canvg($canvas[0], svg.trim(), {
        ignoreMouse: true,
        ignoreDimensions: true,
        scaleWidth: canvasWidth
      });
    },

    _open: function () {
      this.$('.information').show();
      this.$el.addClass('selected');
      this._isOpen = true;
    },

    _close: function () {
      this.$('.information').hide();
      this.$el.removeClass('selected');
      this._isOpen = false;
    },

    _onClick: function (event) {
      event.preventDefault();
      this._isOpen ? this._close() : this._open();
    }
  });
}(REIN.module('list'), REIN.module('widget'), REIN, $));

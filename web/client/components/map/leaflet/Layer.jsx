/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var Layers = require('../../../utils/leaflet/Layers');
var assign = require('object-assign');

const LeafletLayer = React.createClass({
    propTypes: {
        map: React.PropTypes.object,
        type: React.PropTypes.string,
        options: React.PropTypes.object,
        position: React.PropTypes.number
    },
    componentDidMount() {
        this.createLayer(this.props.type, this.props.options, this.props.position);
        if (this.props.options && this.layer && this.props.options.visibility !== false) {
            this.addLayer();
            this.updateZIndex();
        }
    },
    componentWillReceiveProps(newProps) {
        const newVisibility = newProps.options && newProps.options.visibility !== false;
        this.setLayerVisibility(newVisibility);

        const newOpacity = (newProps.options && newProps.options.opacity !== undefined) ? newProps.options.opacity : 1.0;
        this.setLayerOpacity(newOpacity);

        if (newProps.position !== this.props.position) {
            this.updateZIndex(newProps.position);
        }
    },
    componentWillUnmount() {
        if (this.layer && this.props.map) {
            this.props.map.removeLayer(this.layer);
        }
    },
    render() {
        return null;
    },
    setLayerVisibility(visibility) {
        var oldVisibility = this.props.options && this.props.options.visibility !== false;
        if (visibility !== oldVisibility) {
            if (visibility) {
                this.addLayer();
            } else {
                this.removeLayer();
            }
            this.updateZIndex();

        }
    },
    setLayerOpacity(opacity) {
        var oldOpacity = (this.props.options && this.props.options.opacity !== undefined) ? this.props.options.opacity : 1.0;
        if (opacity !== oldOpacity && this.layer) {
            this.layer.setOpacity(opacity);
        }
    },
    updateZIndex(position) {
        let newPosition = position || this.props.position;
        if (newPosition && this.layer && this.layer.setZIndex) {
            this.layer.setZIndex(newPosition);
        }
    },
    createLayer(type, options, position) {
        if (type) {
            const opts = assign({}, options, position ? {zIndex: position} : null);
            this.layer = Layers.createLayer(type, opts);
            if (this.layer) {
                this.layer.layerName = options.name;
            }
        }
    },
    addLayer() {
        if (this.layer) {
            this.props.map.addLayer(this.layer);
        }
    },
    removeLayer() {
        if (this.layer) {
            this.props.map.removeLayer(this.layer);
        }
    }
});

module.exports = LeafletLayer;

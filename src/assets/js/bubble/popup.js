
/**
 * 3D场景气泡框
 * @constructor
 */

class Popup {
    constructor(opt) {
        this.dom = null
        this.parentElement = null
        this._viewer = opt.viewer;
        this.html = opt.html;
        this.showClose = opt.showClose;
        this.position = opt.position;  //Cartesian3
        this.pixelOffset = opt.pixelOffset || new Cesium.Cartesian2(0, 0);  //像素偏移
        this._show = opt.show || false;
        this.hideOnBehindGlobe = opt.hideOnBehindGlobe || false;  // 是否在地球背面隐藏
        this.scaleByDistance = opt.scaleByDistance;  //距离控制大小
        this.translucencyByDistance = opt.translucencyByDistance;  //距离控制透明度
        this.distanceDisplayCondition = opt.distanceDisplayCondition; //距离控制显隐
        this.scratch = new Cesium.Cartesian2();
        this.RemoveCallback = function () { }
        this.init(opt);
    }

    init(opt) {
        // 在Cesium容器中添加元素
        // 传入html时转为dom元素
        if (this.html) {
            const htmlDom = document.createElement('div');
            htmlDom.id = 'popup_' + new Date() * 1
            htmlDom.style.position = 'absolute'
            htmlDom.style.transform = 'translate(-50%, -50%) scale(1)'
            htmlDom.style.transformOrigin = 'center bottom'
            htmlDom.innerHTML = opt.html;
            this.dom = htmlDom
        }
        this.parentElement = document.getElementById('popupContainer');

        if (this.parentElement) {
            this.parentElement.appendChild(this.dom)
            if (this.showClose) {
                const parent = document.createElement('div')
                parent.innerHTML = `<span style="font-size: 24px; position: absolute; right:8px; top: 4px; pointer-events: all; cursor: pointer; color:white;">×</span>`
                const close = parent.firstChild
                this.dom.appendChild(close)
                close.addEventListener('click', () => {
                    this.destroy()
                })
            }
        }

        if (!this._viewer) {
            return;
        }
        this.dom.style.pointerEvents = 'none';
        this._viewer.container.appendChild(this.parentElement);
        
        this.setViewer();
        if (this._show) {
            if (this.position) {
                setTimeout(() => { this.setPosition(opt.position) }, 500)
            }
        }

    };

    /**
    * 设置关联的cesium viewer
    * @param viewer
    */
    setViewer() {
        let _self = this;

        // 每一帧触发
        // _self.RemoveCallback = _self._viewer.scene.preRender.addEventListener(function () {
        //     if (_self._show) {
        //         _self.update()
        //     }
        // });

        // 相机改变触发
        _self.RemoveCallback = _self._viewer.camera.changed.addEventListener(function () {
            if (_self._show) {
                _self.update()
            }
        })
    };

    /**
     * 获取关联的cesium viewer
     * @return {Cesium.Viewer}
     */
    getViewer() {
        return this._viewer;
    };

    /**
     * 设置位置
     * @param position{Array}
     */
    setPosition(position) {
        let _self = this;
        if (!position) {
            _self.close();
            return;
        }
        if (!_self.getViewer()) {
            return;
        }
        let canvasPosition = _self.getViewer().scene.cartesianToCanvasCoordinates(position, _self.scratch); // 笛卡尔坐标到画布坐标
        if (Cesium.defined(canvasPosition)) {
            _self.dom.style.top = canvasPosition.y + _self.pixelOffset.y + 'px';
            _self.dom.style.left = canvasPosition.x + _self.pixelOffset.x + 'px';
            // _self.dom.style.transform = `matrix(1, 0, 0, 1, ${canvasPosition.x + _self.pixelOffset.x}, ${canvasPosition.y + _self.pixelOffset.y})`;
            _self.dom.style.opacity = 1;
            _self._show = true;
            if (_self.hideOnBehindGlobe || _self.distanceDisplayCondition || _self.translucencyByDistance || _self.scaleByDistance) {
                let cameraPosition = _self.getViewer().camera.position;
                let distance = Cesium.Cartesian3.distance(cameraPosition, position);
                if (_self.hideOnBehindGlobe) {
                    let height = _self.getViewer().scene.globe.ellipsoid.cartesianToCartographic(cameraPosition).height;
                    height += _self.getViewer().scene.globe.ellipsoid.maximumRadius;
                    if (!(distance > height)) {
                        _self.dom.style.display = "flex"
                    } else {
                        _self.dom.style.display = "none"
                    }
                }
                if (_self.distanceDisplayCondition) {
                    if (distance < _self.distanceDisplayCondition.near || distance > _self.distanceDisplayCondition.far) {
                        _self.dom.style.opacity = 0;
                        return;
                    } else {
                        _self.dom.style.opacity = 1;
                    }
                }
                if (_self.translucencyByDistance) {
                    if (distance < _self.translucencyByDistance.near) {
                        _self.dom.style.opacity = _self.translucencyByDistance.nearValue;
                        _self.dom.style.transform = `translate(-50%, -50%) scale(${_self.translucencyByDistance.nearValue})`;
                    } else if (distance > _self.translucencyByDistance.far) {
                        _self.dom.style.opacity = _self.translucencyByDistance.farValue;
                        _self.dom.style.transform = `translate(-50%, -50%) scale(${_self.translucencyByDistance.farValue})`;
                    } else {
                        let val1 = _self.translucencyByDistance.farValue - _self.translucencyByDistance.nearValue;
                        let val2 = _self.translucencyByDistance.far - _self.translucencyByDistance.near;
                        let val3 = ((distance - _self.translucencyByDistance.near) / val2) * val1 + _self.translucencyByDistance.nearValue;
                        _self.dom.style.opacity = val3;
                        _self.dom.style.transform = `translate(-50%, -50%) scale(${val3})`;
                    }
                }
                if (_self.scaleByDistance) {
                    if (distance < _self.scaleByDistance.near) {
                        let val = _self.scaleByDistance.nearValue;
                        _self.dom.style.transform = `scale(${val}, ${val})`;
                    } else if (distance > _self.scaleByDistance.far) {
                        let val = _self.scaleByDistance.farValue;
                        _self.dom.style.transform = `scale(${val}, ${val})`;
                    } else {
                        let val1 = _self.scaleByDistance.farValue - _self.scaleByDistance.nearValue;
                        let val2 = _self.scaleByDistance.far - _self.scaleByDistance.near;
                        let val3 = ((distance - _self.scaleByDistance.near) / val2) * val1 + _self.scaleByDistance.nearValue;
                        _self.dom.style.transform = `scale(${val3}, ${val3})`;
                    }
                }

            }
        }
        _self.position = position;
    };


    update() {
        this.setPosition(this.position);
    };
    getPosition() {
        return this.position;
    };

    close() {
        this.dom.style.opacity = 0;
        this._show = false;
    };

    show() {
        if (this.position) {
            this.dom.style.opacity = 1;
            this._show = true;
            this.setPosition(this.position);
        }
    };

    destroy() {
        this.RemoveCallback();
        this.close();
        this.parentElement.removeChild(this.dom);
    }

}

export default Popup
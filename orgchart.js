function orgChart(param) {
    // 插入样式
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = '.org-hover{position:absolute;left:10px;top:10px;z-index:999;padding:10px;min-width:100px;text-align:center;background-color:#fff;border-radius:10px;border:3px solid #efefef;color:#666;font-size:14px;transition:all .3s;visibility:hidden;opacity:0;}.org-hover>p{padding:0;margin:0;}.org-box{display:flex;flex-direction:row;font-size:14px;animation:treeShow .6s forwards;}@keyframes treeShow{from{transform:translateX(100px);}to{transform:none;}}.org-title{padding:8px 0;}.org-text{background-color:#999;color:#fff;padding:5px 20px;border-radius:20px;box-shadow:0 0 10px #ddd;cursor:default;}.org-line-up{width:20px;height:50%;}.org-line-bottom{width:20px;height:50%;}.org-block{display:flex;flex-direction:column;justify-content:center;}.org-box>.org-box>.org-block:nth-child(1)>.org-line-bottom{border-top:2px solid #ddd;}.org-box>.org-box>.org-block:nth-child(2)>.org-box>.org-block>.org-line-bottom{border-top:2px solid #ddd;border-left:2px solid #ddd;}.org-box>.org-box>.org-block:nth-child(2)>.org-box:last-child>.org-block>.org-line-bottom{border-top:2px solid #ddd;border-left-color:transparent;}.org-box>.org-box>.org-block:nth-child(2)>.org-box>.org-block>.org-line-up{border-left:2px solid #ddd;}.org-box>.org-box>.org-block:nth-child(2)>.org-box:first-child>.org-block>.org-line-up{border-left-color:transparent;}.org-box>.org-block:nth-child(2)>.org-box:first-child>.org-block>.org-line-bottom{border-radius:10px 0 0 0;}.org-box>.org-block:nth-child(2)>.org-box:last-child>.org-block>.org-line-up{border-bottom:2px solid #ddd;border-radius:0 0 0 10px;}.org-box>.org-block:nth-child(2)>.org-box:last-child>.org-block>.org-line-bottom{border-top-color:transparent !important;}.org-box>.org-block:nth-child(2)>.org-box:first-child:nth-last-child(1)>.org-block>.org-line-up{border-radius:0;border-bottom:transparent;}.org-box>.org-block:nth-child(2)>.org-box:first-child:nth-last-child(1)>.org-block>.org-line-bottom{border-radius:0;border-top:2px solid #ddd !important;}';
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    // 子块颜色
    var color = param.color || ['#d86363', '#e66f43', '#59a56a', '#8165c3'];
    // 插入内容
    document.getElementById(param.el).innerHTML = ('<div class="org-hover"></div>' +
        '<div class="org-box">' +
        '<div class="org-block">' +
        '<div class="org-title">' +
        '<div class="org-text" style="background-color: ' + color[0] + '">' + param.data.name + '</div>' +
        '</div>' +
        '</div>' + addBlock(param.data.children, 1) + '</div>');

    // 绑定hover事件
    var elList = document.getElementsByClassName('org-text');
    var i = 0;
    for (var i = 0; i < elList.length; i++) {
        addHandler(elList[i], 'mouseover', function(e) {
            // hover框位置和超出边界的处理
            var x = e.target.offsetWidth + getLeft(e.target) + 10;
            var y = getTop(e.target) + e.target.offsetHeight;
            hoverEl(true, e.target.dataset ? e.target.dataset.hover : e.target.getAttribute('data-hover'), [x, y], e.target.style.backgroundColor);
        });
        addHandler(elList[i], 'mouseout', function(e) {
            hoverEl(false);
        });
    }

    // hover事件操作
    function hoverEl(isShow, text, position, color) {
        var hover = document.getElementsByClassName('org-hover');
        for (var i = 0; i < hover.length; i++) {
            if (hover[i].parentNode.id = param.el) {
                hover = hover[i];
                break;
            }
        }
        if (isShow && text) {
            hover.innerHTML = text;
            hover.style.borderColor = 'rgba(' + color.split('(')[1].split(')')[0] + ', .6)';
            hover.style.visibility = 'visible';
            hover.style.opacity = '1';
            hover.style.left = position[0] + 'px';
            position[1] = position[1] - hover.offsetHeight;
            if (position[1] <= 0) position[1] = 10;
            hover.style.top = position[1] + 'px';
        } else {
            hover.style.visibility = 'hidden';
            hover.style.opacity = '0';
        }
    }

    //用递归方法获取offset(IE)
    function getTop(e) {
        var offset = e.offsetTop;
        if (e.offsetParent != null) offset += getTop(e.offsetParent);
        return offset;
    }

    function getLeft(e) {
        var offset = e.offsetLeft;
        if (e.offsetParent != null) offset += getLeft(e.offsetParent);
        return offset;
    }

    // 子块递归函数
    function addBlock(son, index) {
        if (index >= color.length) index = 0;
        var dom = '';
        for (var i = 0; i < son.length; i++) {
            dom += '<div class="org-box">' +
                '<div class="org-block">' +
                '<div class="org-line-up"></div>' +
                '<div class="org-line-bottom"></div>' +
                '</div>' +
                '<div class="org-block">' +
                '<div class="org-title">' +
                '<div class="org-text" style="background-color: ' + color[index] + '" ' + (son[i].hover ? 'data-hover="' + son[i].hover + '"' : '') + '>' + son[i].name + '</div>' +
                '</div>' +
                '</div>' +
                (son[i].children ? addBlock(son[i].children, index + 1) : '') +
                '</div>';
        }
        return '<div class="org-box">' +
            '<div class="org-block">' +
            '<div class="org-line-up"></div>' +
            '<div class="org-line-bottom"></div>' +
            '</div>' +

            '<div class="org-block">' +
            dom +
            '</div>' +
            '</div>';

    }

    // 事件兼容处理
    function addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, function(event) {
                handler(event);
                event.stopPropagation();
            }, false);
        } else if (element.attachEvent) {
            // 兼容IE8+
            element.attachEvent('on' + type, function(event) {
                handler(event);
                window.event.cancelBubble = true;
            });
        }
    }

}
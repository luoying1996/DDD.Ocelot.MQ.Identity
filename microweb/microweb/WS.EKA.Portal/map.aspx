<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="map.aspx.cs" Inherits="WS.EKA.Portal.map" %>

<%--<!DOCTYPE html>--%>

<%--<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    	<style type="text/css">
	body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
	</style>
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=D645f58f16f9c64e3f47af0c80787036"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <div id="allmap"></div>
    </div>
    </form>
</body>
</html>--%>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<style type="text/css">
	body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
	    .E_Back
	    {  width:2em; height:2em; background:url(/Content/Images/mapback.png) no-repeat center; background-size:2em 2em; position:fixed; right:1em; top:1em; display:block; z-index:999999;
	    }
	</style>
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=D645f58f16f9c64e3f47af0c80787036"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js"></script>
    <script type="text/javascript" src="http://developer.baidu.com/map/jsdemo/demo/convertor.js"></script>
    <script type="text/javascript" src="/Scripts/jquery-1.7.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" type="text/javascript"></script>
	<link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css" />
    <link rel="stylesheet" href="/Content/css/index.css" />
	<title>地图展示</title>
</head>
<body> 
   
	<div id="allmap"></div>
     <div class="wrapper">
    <a href="/#page/Catalog" class="E_Back"></a>
        </div>
</body>
</html>
<script type="text/javascript">

    var strLocaltionData = <%=strLocaltionData%>;
    var myLatitude =<%=myLatitude%>; 
    var myLongitude =<%=myLongitude%>;

    //var myLatitude ="30.531534";
    //var myLongitude ="114.337715";

    var map = new BMap.Map("allmap");//创建地图
    var point = new BMap.Point(myLongitude, myLatitude);//新增坐标点
    map.centerAndZoom(point, 15);//加载坐标
    map.addControl(new BMap.NavigationControl());

    var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });// 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();;// 左上角，方向图标
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);


    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    var mainContent='我的位置'; 
    addClickHandler(mainContent,marker);
    var label = new BMap.Label("我的位置",{offset:new BMap.Size(20,-10)});
    marker.setLabel(label); //添加百度label

    var p=3
    var data_info=new Array();
    for (var m = 0; m < $(strLocaltionData).length; m++) {
        data_info[m]=new Array();
        data_info[m][0]=strLocaltionData[m].Latitude;
        data_info[m][1]=strLocaltionData[m].Longitude;
        var content='<div style="margin:0;line-height:20px;padding:2px;">' +
                          '店铺名称：'+strLocaltionData[m].MemLoginID+'<br/>'+
                          //'<img src="../img/baidu.jpg" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
                          '地址：'+strLocaltionData[m].Address+'<br/>简介：'+strLocaltionData[m].Vocation+
                          '</div>'
        data_info[m][2]=content;
        data_info[m][3]=strLocaltionData[m].MemLoginID;
    }

    function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
            openInfo(content, e)
        });
    }

    function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var SearchInfoWindow = new BMapLib.SearchInfoWindow(map, content, opts);  // 创建信息窗口对象 
        var marker = new BMap.Marker(point);
        SearchInfoWindow.open(marker);
    }

    if (strLocaltionData!="") {
        var opts = {
            width: 290,             //宽度
            height: 105,              //高度
            panel: "panel",         //检索结果面板
            enableAutoPan: true,     //自动平移
            searchTypes: [
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
            ]
        };
        for (var i = 0; i < data_info.length; i++) {
            var marker = new BMap.Marker(new BMap.Point(data_info[i][1], data_info[i][0]));  // 创建标注
            var content = data_info[i][2];
            map.addOverlay(marker); // 将标注添加到地图中
            var label = new BMap.Label(data_info[i][3], { offset: new BMap.Size(20, -10) });
            marker.setLabel(label);
            addClickHandler(content, marker);
        }
    }
</script>


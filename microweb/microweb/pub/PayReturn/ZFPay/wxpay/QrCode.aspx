<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="QrCode.aspx.cs" Inherits="WS.EKA.Portal.wxpay.QrCode1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>微信二维码支付</title>
</head>
<body>
    <img src="/wxpay/QrCodePay.aspx?auth_code=<%=auth_code %>&body=<%=body %>&device_info=<%=device_info %>&out_trade_no=<%=out_trade_no %>&total_fee=<%=total_fee %>&memid=<%=memid%>" />
</body>
</html>

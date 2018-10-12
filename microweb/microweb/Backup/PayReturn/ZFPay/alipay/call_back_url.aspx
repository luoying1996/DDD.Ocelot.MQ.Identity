<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="call_back_url.aspx.cs" Inherits="WS.EKA.Portal.alipay.call_back_url" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <title>支付成功</title>
    <style type="text/css">
        .pay_success {
            background-color: #ececec;
            height: 100%;
            text-align: center;
        }

        .pay_suconte {
            color: #797979;
            line-height: 50px;
            font-size: 24px;
            width: 270px;
            position: absolute;
            left: 50%;
            margin-left: -135px;
            top: 20%;
            font-family: \5FAE\8F6F\96C5\9ED1;
        }

            .pay_suconte img {
                display: inline-block;
            }

            .pay_suconte span {
                line-height: 74px;
                color: #595959;
                font-size: 30px;
                display: block;
                padding-left: 76px;
                background: url(Images/zfcg_bg.png) no-repeat left top;
            }

            .pay_suconte p {
                margin-top: 10px;
            }
    </style>

</head>
<body class="pay_success">
    <div class="pay_suconte">
        <span>您已支付成功</span>
        <p>继续购买，请返回应用</p>
    </div>
</body>
</html>

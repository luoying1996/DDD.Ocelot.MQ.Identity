--服务于商品耳机分类筛选商品
ALTER VIEW [dbo].[V_Product]  
AS  
SELECT     A.Guid, A.Name, A.OriginalImge, A.ThumbImage, A.SmallImage, A.RepertoryNumber, A.Weight, A.RepertoryCount, A.UnitName, A.RepertoryAlertCount, A.PresentScore,   
                      A.PresentRankScore, A.SocreIntegral, A.LimitBuyCount, A.MarketPrice, A.ShopPrice, A.Brief, A.Detail, A.ClickCount, A.CollectCount, A.BuyCount, A.CommentCount,   
                      A.ReferCount, A.ModifyTime, A.IsSaled, A.IsBest, A.IsNew, A.IsHot, A.IsReal, A.IsOnlySaled, A.Title, A.Description, A.Keywords, A.OrderID, A.BrandName,   
                       A.SaleNumber, A.ActiveImage, A.SupplierLoginID, B.BaskOrderLogCount, A.AgentID, A.IsRecommend, 0 AS T, A.MobileDetail, A.BrandGuid ,A.ProductCategoryID,C.FatherID 
FROM         dbo.ShopNum1_Product AS A LEFT OUTER JOIN  
                          (SELECT     ProductGuid, COUNT(*) AS BaskOrderLogCount  
                            FROM          dbo.ShopNum1_BaskOrder_Log  
                            GROUP BY ProductGuid)
                             AS B ON A.Guid = B.ProductGuid  
                             LEFT JOIN ShopNum1_ProductCategory c ON A.ProductCategoryID=c.ID
WHERE     (A.IsDeleted = 0) AND (A.IsAudit = 1) AND (A.IsSaled = 1)  
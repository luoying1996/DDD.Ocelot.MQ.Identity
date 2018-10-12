using AttributeRouting.Web.Http;
using WS.EKA.Portal.Filters;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class PromotionController:ControllerBase
    {
        public PromotionController()
        {
        }
        /// <summary>
        /// 优惠券列表
        /// </summary>
        /// <param name="shopingCartPrice"></param>
        /// <returns></returns>
        [GET("api/promotionbyprice/{shopingCartPrice}")]
        public object Get(decimal shopingCartPrice)
        {
            var result = CommonRequest.ApiGetPromotionByPrice(shopingCartPrice);
            return result;
        }

        /// <summary>
        /// 验证优惠券是否正确
        /// </summary>
        /// <param name="ticketCode"></param>
        /// <returns></returns>
        [GET("api/FavourTicketVerify/")]
        public bool VerifyFavourTicket(string ticketCode, string memLoginID)
        {
            var ticket = CommonRequest.ApiVerifyFavourTicket(memLoginID, ticketCode);
            return ticket != null;

        }
    }
}
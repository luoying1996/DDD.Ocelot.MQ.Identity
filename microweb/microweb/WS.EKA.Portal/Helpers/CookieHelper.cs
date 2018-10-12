using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WS.EKA.Portal.Helpers
{
    public class CookieHelper
    {
        public HttpCookie this[string key]
        {
            get
            {
                return HttpContext.Current.Request.Cookies[key];
            }
            set
            {
                HttpCookie cookie = new HttpCookie(key, value.ToString());
                HttpContext.Current.Response.Cookies.Add(cookie);
            }
        }

        public string TryGet(string key)
        {
            return TryGet(key, () => string.Empty);
        }

        public string TryGet(string key, Func<string> getDefault)
        {
            var value = RetrieveValueWithDefaultHelper.TryGet<object>(() => this[key].Value, getDefault);

            return (value == null) ? string.Empty : value.ToString();
        }

        public void Set(string key, string value, int timeoutHours)
        {
            HttpCookie cookie = new HttpCookie(key, value.ToString());
            cookie.Expires = DateTime.Now.AddHours(timeoutHours);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        public void Remove(string key)
        {
            HttpCookie cookie = new HttpCookie(key, string.Empty);
            cookie.Expires = DateTime.Now.AddYears(-1);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

    }
}
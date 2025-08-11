// middlewares/detectBrowserPlatform.js
export const detectBrowserPlatform = (req, res, next) => {
    const ua = req.headers['user-agent'] || '';
  
    if (/mobile|android|iphone|ipad/i.test(ua)) {
      req.platform = 'mobile';
    } else {
      req.platform = 'web';
    }
  
    next();
  };
  
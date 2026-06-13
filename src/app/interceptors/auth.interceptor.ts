import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   if (
    req.url.includes('/login') ||
    req.url.includes('/register')
  ) {
    return next(req);
  }
  const token = localStorage.getItem('expense_tracker_token');

 console.log(token)


  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    
    
    });
    console.log("token add in header ")
    return next(authReq);
  }

  return next(req);
};
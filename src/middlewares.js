export const localMiddlewares = (req, res, next) => {
  console.log(req.session);
  res.locals.session = req.session;
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  console.log(res.locals.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};

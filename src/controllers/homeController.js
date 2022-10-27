export const home = (req, res) => {
  const videos = [1, 2, 3, 4, 5, 6, 7, 8];
  res.render("home", { pageTitle: "Home", videos });
};
export const login = (req, res) => res.send("Login");
export const join = (req, res) => res.send("Join");
export const search = (req, res) => res.send("Search");

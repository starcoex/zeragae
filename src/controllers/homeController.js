export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const login = (req, res) => res.send("Login");
export const join = (req, res) => res.send("Join");
export const search = (req, res) => res.send("Search");

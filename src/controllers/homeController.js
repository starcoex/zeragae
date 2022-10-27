const fakeMaker = {
  username: "Ko Jung Hoon",
  loggedIn: false,
};

export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", fakeMaker });
};
export const login = (req, res) => res.send("Login");
export const join = (req, res) => res.send("Join");
export const search = (req, res) => res.send("Search");

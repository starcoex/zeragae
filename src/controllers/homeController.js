export const videos = [
  {
    title: "first",
    rating: 5,
    comments: 2,
    creatdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Two",
    rating: 5,
    comments: 2,
    creatdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
];

export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const login = (req, res) => res.send("Login");
export const join = (req, res) => res.send("Join");
export const search = (req, res) => res.send("Search");

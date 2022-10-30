import fetch from "node-fetch";
export const see = (req, res) => res.send("Users");
export const logout = (req, res) => res.send("Logout");
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove");
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_singup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};
export const callbackGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  if ("acess_token" in json) {
    const { access_token } = json;
    const userRequest = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    // const json = await userRequest.json();
    console.log(json);
  } else {
    return res.redirect("/login");
  }
};

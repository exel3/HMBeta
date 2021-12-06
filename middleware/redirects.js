export default function(req) {
  const redirects = [
    {
      from: "/", 
      to: "/locals"
    }
  ]
  const redirect = redirects.find((r) => r.from === req.route.path)
  if (redirect) {
    req.redirect(redirect.to)
  }
}
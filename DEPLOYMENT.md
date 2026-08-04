# Deploying Perspecta to GitHub Pages

Four steps, no build tools required.

## 1. Create the repository

Go to [github.com/new](https://github.com/new). Name it `perspecta` (or anything you like — for a personal/org site named exactly `<username>.github.io`, GitHub serves it at your root domain instead of a subpath). Set it to **Public**, then click **Create repository**.

## 2. Push the files

From the folder containing `index.html`, `styles.css`, and `script.js`:

```bash
git init
git add index.html styles.css script.js
git commit -m "Initial Perspecta site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 3. Activate GitHub Pages

In the repository, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to `Deploy from a branch`, pick branch `main` and folder `/ (root)`, then click **Save**.

## 4. Visit your live site

GitHub builds the site in about 1–2 minutes. It will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

(or `https://<your-username>.github.io/` if the repo is named `<username>.github.io`). Future pushes to `main` redeploy automatically.

---

### Notes

- Images currently use `picsum.photos` placeholders — swap the `src` attributes in `index.html` for real photography before launch.
- The newsletter form is front-end only; connect it to a provider (Mailchimp, Buttondown, ConvertKit) for real signups.
- Update the Twitter/X and LinkedIn URLs in the footer once those accounts exist.

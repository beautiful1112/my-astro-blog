Switching to Astro is a solid choice: **Astro is modern, works well for an English personal blog, pairs nicely with CMS tools like Keystatic or TinaCMS, and deploys smoothly to Cloudflare Pages**. The npm conflict concern is also important — the right approach is: **do not install lots of packages globally with system npm; use nvm to manage Node.js versions and let each project manage its own dependencies via `package.json` and `node_modules`**.

Let's start fresh with a safer way to install Node.js and Astro.

---

## 2. Should you delete the old Hugo blog directory?

If you previously created:

```text
~/myblog
```

and you are sure you no longer need it, you can delete it:

```bash
rm -rf ~/myblog
```

⚠️ Note: this command permanently deletes the `~/myblog` directory.

If it contains posts or images you wrote, back it up first:

```bash
mv ~/myblog ~/myblog-hugo-backup
```

That is safer.

I recommend backing up instead of deleting immediately:

```bash
mv ~/myblog ~/myblog-hugo-backup
```

Delete it later once you are sure you no longer need it.

---

## 3. Why does Astro need Node.js?

Astro is a static site framework built on the Node.js ecosystem.

You will use:

| **Tool** | **Purpose** |
|---|---|
| Node.js | Runs Astro and build tools |
| npm | Installs project dependencies |
| package.json | Records which dependencies the project needs |
| node_modules/ | The project's installed dependencies |
| Astro | Generates site pages |
| Cloudflare Pages | Builds and deploys the static site |

A typical Astro project structure:

```text
my-astro-blog/
├── package.json
├── node_modules/
├── astro.config.mjs
├── src/
├── public/
└── ...
```

Key point: **each project has its own `node_modules/`, so projects generally do not interfere with each other.**

---

## 4. How to avoid conflicts between npm projects

Great question. Node.js project conflicts usually come from two places:

1. **Too many globally installed npm packages**
2. **Different projects needing different Node.js versions**

The solution is:

```text
nvm + per-project local dependencies
```

In practice:

- Use **nvm** to manage Node.js versions
- Avoid casual `sudo npm install -g`
- Run `npm install` inside each project
- Keep dependencies in each project's own `package.json`
- Use `.nvmrc` when you need to pin a Node.js version

This approach works well when running multiple Node/npm projects on Rocky Linux.

---

## 5. Installation methods to avoid

First, what not to do.

### Not recommended: install nodejs directly with dnf

For example:

```bash
sudo dnf install nodejs npm
```

This is simple, but has drawbacks:

- The version may be outdated
- System-wide install is inflexible
- Switching Node versions across projects is awkward
- Permission issues are more likely later
- Beginners may misuse `sudo npm install -g`

So we do not use this approach.

---

### Not recommended: frequent global npm installs

For example:

```bash
sudo npm install -g astro
```

Not recommended.

Astro now prefers:

```bash
npm create astro@latest
```

This creates a project without forcing a global Astro install.

---

## 6. Recommended approach: install nvm

`nvm` is Node Version Manager for managing Node.js versions.

Install basic tools first:

```bash
sudo dnf install -y curl git
```

Then install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

After installation, load nvm in the current shell:

```bash
source ~/.bashrc
```

Check that nvm works:

```bash
nvm --version
```

If you see a version number, for example:

```text
0.40.3
```

nvm is installed successfully.

---

## 7. Install Node.js LTS with nvm

Astro works best with a recent Node.js version. Install the LTS release:

```bash
nvm install --lts
```

Set LTS as the default:

```bash
nvm alias default lts/*
```

Check Node.js and npm versions:

```bash
node -v
npm -v
```

You should see something like:

```text
v22.x.x
```

and:

```text
10.x.x
```

Exact versions do not need to match; any recent LTS is fine.

---

## 8. Why nvm helps: no conflicts between projects

Example:

Your Astro blog might use Node 22:

```bash
nvm use 22
```

Later, another older project might need Node 20:

```bash
nvm install 20
nvm use 20
```

You can also add a `.nvmrc` file in the project.

For example, in the Astro project root:

```bash
echo "lts/*" > .nvmrc
```

Then inside the project run:

```bash
nvm use
```

nvm will switch Node versions based on `.nvmrc`.

To pin Node 22:

```bash
echo "22" > .nvmrc
```

That is the key to avoiding conflicts between Node projects.

---

## 9. Create your first Astro blog project

Now create the Astro project.

Go to your home directory:

```bash
cd ~
```

Run:

```bash
npm create astro@latest
```

This starts an interactive wizard.

You may see questions like these.

### Project name

Suggested input:

```text
my-astro-blog
```

### How would you like to start your new project?

You can choose:

```text
Use blog template
```

If there is no blog template, choose:

```text
A basic, minimal starter
```

For a blog, the blog template is recommended.

### Install dependencies?

Choose:

```text
Yes
```

### Initialize a new git repository?

You can choose:

```text
Yes
```

This makes pushing to GitHub easier later.

---

## 10. Enter the Astro project and start it

After creation, enter the project:

```bash
cd ~/my-astro-blog
```

If the wizard did not install dependencies automatically, run:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev -- --host 0.0.0.0
```

Note the two `--` characters:

```bash
npm run dev -- --host 0.0.0.0
```

Because:

- `npm run dev` is the npm command
- `--host 0.0.0.0` is passed through to Astro

On success, you should see something like:

```text
Local:   http://localhost:4321/
Network: http://192.168.x.x:4321/
```

Astro's default port is usually:

```text
4321
```

---

## 11. Open Astro in the browser

### If you are on Rocky Linux locally

Open:

```text
http://localhost:4321/
```

### If you are on a Windows host accessing a VMware VM

First check the Rocky Linux IP:

```bash
ip addr
```

Look for something like:

```text
192.168.x.x
```

Then in the Windows browser open:

```text
http://VM_IP:4321/
```

For example:

```text
http://192.168.10.128:4321/
```

If it does not load, open the firewall port:

```bash
sudo firewall-cmd --add-port=4321/tcp
```

To make it permanent:

```bash
sudo firewall-cmd --add-port=4321/tcp --permanent
sudo firewall-cmd --reload
```

---

## 12. How dependencies are isolated in an Astro project

Inside your Astro project run:

```bash
ls
```

You should see:

```text
package.json
package-lock.json
node_modules
src
public
astro.config.mjs
```

Most important:

| **File / directory** | **Purpose** |
|---|---|
| `package.json` | Lists npm packages for this project |
| `package-lock.json` | Locks dependency versions for consistent deploys |
| `node_modules/` | This project's installed dependencies |
| `src/` | Site source code |
| `public/` | Static assets such as images |
| `astro.config.mjs` | Astro configuration |

Different projects have different:

```text
node_modules/
package.json
```

So they do not affect each other.

For example:

```text
~/my-astro-blog/node_modules/
~/another-node-project/node_modules/
```

These are separate directories and do not interfere.

---

## 13. Do not install npm packages globally by default

When a tutorial says:

```bash
npm install -g something
```

do not run it immediately.

Prefer local project dependencies:

```bash
npm install something
```

Or use:

```bash
npx something
```

For example, creating an Astro project with:

```bash
npm create astro@latest
```

is the cleaner approach.

---

## 14. Add `.nvmrc` after creating the Astro project

Enter your Astro project:

```bash
cd ~/my-astro-blog
```

Create `.nvmrc`:

```bash
echo "lts/*" > .nvmrc
```

Each time you enter the project you can run:

```bash
nvm use
```

It will automatically use the LTS Node.js version.

You can also check the current Node location:

```bash
which node
```

You should see something like:

```text
/home/your-username/.nvm/versions/node/v22.x.x/bin/node
```

That means you are using nvm-managed Node, not the system Node.

---

## 15. Full command summary for first Astro startup

You can run these in order.

### Remove Hugo

```bash
which hugo
sudo rm -f /usr/local/bin/hugo
hugo version
```

If you had a Hugo project, back it up first:

```bash
mv ~/myblog ~/myblog-hugo-backup
```

---

### Install nvm and Node.js

```bash
sudo dnf install -y curl git

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

source ~/.bashrc

nvm --version

nvm install --lts
nvm alias default lts/*

node -v
npm -v
```

---

### Create the Astro project

```bash
cd ~
npm create astro@latest
```

Suggested project name:

```text
my-astro-blog
```

After creation:

```bash
cd ~/my-astro-blog
echo "lts/*" > .nvmrc
npm run dev -- --host 0.0.0.0
```

Then visit:

```text
http://VM_IP:4321/
```

---

## 16. Deploying to Cloudflare Pages later

When deploying Astro to Cloudflare Pages, use:

```text
Build command: npm run build
Build output directory: dist
```

Astro generates:

```text
dist/
```

Cloudflare Pages publishes the `dist` directory.

For local development:

```bash
npm run dev -- --host 0.0.0.0
```

For a production build test:

```bash
npm run build
```

To preview the build locally:

```bash
npm run preview -- --host 0.0.0.0
```

---

## 17. Rules to remember

To avoid conflicts between npm projects later, remember:

1. **Install Node.js with nvm, not system dnf Node.js**
2. **Each project has its own `package.json`**
3. **Each project has its own `node_modules/`**
4. **Do not casually use `sudo npm install -g`**
5. **Install packages locally with `npm install package-name` inside the project**
6. **Use `.nvmrc` to pin the project's Node version**
7. **Add `node_modules/` to `.gitignore`; do not push it to GitHub**

Astro usually ships with `.gitignore`. You can check:

```bash
cat .gitignore
```

It should include:

```text
node_modules
dist
```

If not, add manually:

```bash
nano .gitignore
```

Add:

```gitignore
node_modules/
dist/
.env
```

---

## 18. Goals for this stage

At this stage you should have:

- Node.js installed via nvm
- npm working
- Astro project created successfully
- `npm run dev -- --host 0.0.0.0` starting the dev server
- The Astro default page loading in the browser

After that, the next step is: **turn the Astro project into an English blog structure and write your first Markdown/MDX post**.

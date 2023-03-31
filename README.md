# Chatstreet

<div style="border-top: 4px double grey"></div>

Chatstreet is a chating web application written with [Flask](https://flask.palletsprojects.com/en/2.2.x/), [VueJs](https://vuejs.org/) and a [MariaDB](https://mariadb.org/) database. This project has been started for a school project (IT Module 347). The owners are:
- #### [David Abderhalden](https://github.com/DavidAbderhalden)
- #### [Loris Syla](https://github.com/lorissyla)

## Deployment

### DEV-Environment
```shell
docker compose -f docker-compose.dev.yaml build --no-cache
docker compose -f docker-compose.dev.yaml -p chatstreet-dev up -d
```
### PROD-Environment
```shell
docker compose -f docker-compose.prod.yaml build --no-cache
docker compose -f docker-compose.prod.yaml -p chatstreet-prod up -d
```
_Make sure to continuously delete the old docker compose images if you are developing on the application._

## Code Contributor Guide

---

If you want to contribute to the code you will first need to set up a usable working environment. Please follow these steps. 

1. Clone the Repo to a local folder (I recommend using the SSH protocol).
2. Make sure to navigate from the root to this path `./.git/hooks/` and create a new file called `pre-commit`
3. Add the following content to that file:

```batch
#!/bin/bash

python "./scripts/hooks/pre-commit.py"

exec git add .

exec git commit --amend
```
_This will allow you to use the GitHub actions_

To push images to GitHub first you will need an access token. Next upset an environment variable with the value of your token and log into GitHub.
```shell
export CR_PAT=<token>
echo $CR_PAT | docker login ghcr.io -u <username> --password-stdin
```

Next you need to build an image with the name `ghcr.io/chatstreet/<image_name>:<image_tag>`.
>>>>>>> b705dcc... Endpoint setup (user/data) POST

Then you can push it to GitHub via this command:

```shell
docker push <image>
```

### VCS Guidelines

Give the branch a reasonable name separated with hyphens. Locally you can commit as much as you want. If you are finished coding make sure to use the `fetch --prune` command to get all the changes from remote. Then you will need to rebase your branch with development and squash all of your commits into one `git rebase -i origin/development`. Make sure to choose a descriptive commit message. Create a pull-request to development in the GitHub GUI. Add a short description of what you have changed. Follow the Merge Rules.

#### Often encountered problems:

- Merge conflicts: If there are any merge conflicts you haven't properly rebased your branch with its HEAD.
 
- The "bloody" label indicates that you have touched a very important file which can potently crash everything. Best contact the owner.

- Failed GitHub Action will be thrown if you touched a file inside the `./.github/**/*` directory. Make sure to revert your change.

- If any other questions arise you can contact one of the owners.

<div style="border-top: 1px solid grey; display: flex; justify-content: space-between; align-items: center;">
	<p>Last Update:</p>
	<p>17.03.2023</p>
</div>
